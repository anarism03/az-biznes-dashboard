"""DOCX/PDF/TXT üçün pulsuz lokal sözbəsöz oxşarlıq auditi.

Bunun əmsalları StrikePlagiarism və ya Turnitin əmsalları deyil.
"""
from __future__ import annotations
from collections import defaultdict
import argparse
from datetime import datetime
from html import escape
import io
import json
from pathlib import Path
import re
import unicodedata

from docx import Document

try:
    import fitz
except ImportError:
    fitz = None

WORD = re.compile(r"[^\W_]+(?:[’'-][^\W_]+)*", re.UNICODE)
EXTENSIONS = {".docx", ".pdf", ".txt"}


def normalize(word: str) -> str:
    # Azerbaijani dotted İ and dotless I
    return unicodedata.normalize("NFKC", word).replace("İ", "i").replace("I", "ı").lower()


def extract(name: str, content: bytes):
    extension = Path(name).suffix.lower()
    blocks = []
    if extension == ".docx":
        doc = Document(io.BytesIO(content))
        from docx.text.paragraph import Paragraph
        from docx.table import Table
        for i, b in enumerate(doc.iter_inner_content(), 1):
            if isinstance(b, Paragraph):
                blocks.append((f"Abzas/blok {i}", b.text))
            elif isinstance(b, Table):
                for row_id, row in enumerate(b.rows, 1):
                    for col_id, cell in enumerate(row.cells, 1):
                        blocks.append((f"Cədvəl/blok {i}, xana {row_id}/{col_id}", cell.text))
    elif extension == ".pdf":
        if fitz is None:
            raise RuntimeError("PDF dəstəyi üçün PyMuPDF quraşdırın.")
        doc = fitz.open(stream=content, filetype="pdf")
        blocks = [(f"PDF səhifə {i+1}", p.get_text("text")) for i, p in enumerate(doc)]
    elif extension == ".txt":
        blocks = [(f"Sətir {i}", l) for i, l in enumerate(content.decode("utf-8-sig").splitlines(), 1)]
    else:
        raise ValueError("Yalnız DOCX, PDF, TXT dəstəklənir.")
    words = []
    for loc, block in blocks:
        for m in WORD.finditer(block):
            words.append({"word": normalize(m.group()), "text": m.group(), "location": loc})
    return words, blocks


def _index(tokens, n):
    vals = [w["word"] for w in tokens]
    return {tuple(vals[i:i+n]): i for i in range(len(vals) - n + 1)}


def analyze(target_name: str, target_data: bytes, sources: list[tuple[str, bytes]], max_matches=35):
    target, blocks = extract(target_name, target_data)
    if not target:
        raise ValueError("Hədəf faylda oxuna bilən mətn yoxdur.")
    total = len(target)
    values = [x["word"] for x in target]
    union = {5: set(), 20: set()}
    per_source, matches = [], []
    for source_name, source_data in sources:
        other, _ = extract(source_name, source_data)
        coverage = {5: set(), 20: set()}
        spans = []
        for n in (5, 20):
            lookup = _index(other, n)
            for i in range(total-n+1):
                j = lookup.get(tuple(values[i:i+n]))
                if j is None:
                    continue
                coverage[n].update(range(i, i+n))
                union[n].update(range(i, i+n))
                if n == 5:
                    spans.append((i, i+n, j))
        merged = []
        for a,b,j in sorted(spans):
            if merged and a <= merged[-1][1]:
                merged[-1][1] = max(b, merged[-1][1])
            else:
                merged.append([a,b,j])
        for a,b,j in merged:
            if b-a < 8:
                continue
            matches.append({
                "source": source_name,
                "length_words": b-a,
                "target_location": target[a]["location"],
                "source_location": other[j]["location"],
                "target_excerpt": " ".join(z["text"] for z in target[a:min(b,a+65)])
            })
        per_source.append({
            "source": source_name,
            "source_word_count": len(other),
            "matched_token_coverage_5_pct": round(100*len(coverage[5])/total,2),
            "matched_token_coverage_20_pct": round(100*len(coverage[20])/total,2)
        })
    paragraphs = defaultdict(list)
    for loc, block in blocks:
        key = tuple(normalize(m.group()) for m in WORD.finditer(block))
        if len(key) >= 35:
            paragraphs[key].append(loc)
    dup = [{"word_count":len(k),"locations":v} for k,v in paragraphs.items() if len(v)>1]
    return {
        "target":target_name,
        "generated_at":datetime.now().astimezone().isoformat(timespec="seconds"),
        "target_word_count":total,
        "source_count":len(sources),
        "sources":per_source,
        "overall":{
            "matched_token_coverage_5_pct":round(100*len(union[5])/total,2),
            "matched_token_coverage_20_pct":round(100*len(union[20])/total,2)
        },
        "matches":sorted(matches,key=lambda x:-x["length_words"])[:max_matches],
        "duplicated_paragraphs":dup[:30],
        "warning":"Yalnız yüklənən lokal mənbələr üzrə dəqiq söz ardıcıllığıdır. Rəsmi StrikePlagiarism və AI yoxlaması deyil."
    }


def render_html(result: dict) -> str:
    e=lambda x:escape(str(x))
    o=result["overall"]
    rows="".join("<tr><td>"+e(s["source"])+"</td><td>"+e(s["source_word_count"])+"</td><td>"+e(s["matched_token_coverage_5_pct"])+"%</td><td>"+e(s["matched_token_coverage_20_pct"])+"%</td></tr>" for s in result["sources"])
    parts="".join("<h3>"+e(m["source"])+" — "+e(m["length_words"])+" söz</h3><p>"+e(m["target_location"])+": "+e(m["target_excerpt"])+"</p>" for m in result["matches"])
    return "<!doctype html><html lang='az'><meta charset='utf-8'><title>AZ lokal audit</title><style>body{max-width:940px;margin:40px auto;font:16px/1.5 system-ui;color:#172033}table{border-collapse:collapse;width:100%}td,th{padding:10px;border-bottom:1px solid #ccc;text-align:left}</style><h1>Lokal mətn-oxşarlığı auditi</h1><p><b>Hədəf:</b> "+e(result["target"])+"<br><b>Söz:</b> "+str(result["target_word_count"])+"<br><b>5+ söz uyğunluğu:</b> "+str(o["matched_token_coverage_5_pct"])+"%<br><b>20+ söz uyğunluğu:</b> "+str(o["matched_token_coverage_20_pct"])+"%</p><p><b>Diqqət:</b> "+e(result["warning"])+"</p><h2>Mənbələr</h2><table><tr><th>Fayl</th><th>Söz</th><th>5+</th><th>20+</th></tr>"+rows+"</table><h2>Uzun uyğunluqlar</h2>"+parts+"</html>"


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--target",required=True)
    parser.add_argument("--sources",nargs="+",required=True)
    parser.add_argument("--output",default="report.html")
    parser.add_argument("--json",default="report.json")
    args=parser.parse_args()
    target=Path(args.target)
    if not target.is_file():
        parser.error("Hədəf sənəd tapılmadı.")
    sources=[]
    visited=set()
    for item in args.sources:
        path=Path(item)
        candidates=path.rglob("*") if path.is_dir() else [path]
        for file in candidates:
            if file.is_file() and file.suffix.lower() in EXTENSIONS and file.resolve()!=target.resolve() and file.resolve() not in visited:
                sources.append((str(file),file.read_bytes()))
                visited.add(file.resolve())
    if not sources:
        parser.error("Müqayisə üçün heç bir sənəd yoxdur.")
    report=analyze(target.name,target.read_bytes(),sources)
    Path(args.output).write_text(render_html(report),encoding="utf-8")
    Path(args.json).write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report["overall"],ensure_ascii=False,indent=2))
    print("HTML:",Path(args.output).resolve())


if __name__=="__main__":
    main()
