"""Lokal Streamlit UI; mətn başqa sayta yüklənmir."""
import json
import streamlit as st
from checker import analyze, render_html

st.set_page_config(page_title="AZ lokal oxşarlıq",layout="wide")
st.title("Azərbaycanca lokal mətn-oxşarlığı")
st.info("Bu, rəsmi StrikePlagiarism və ya AI detektoru deyil. Yalnız seçilmiş lokal sənədlər yoxlanılır.")
target=st.file_uploader("Dissertasiya (.docx/.pdf/.txt)",type=["docx","pdf","txt"])
sources=st.file_uploader("Müqayisə mənbələri (bir neçə fayl)",type=["docx","pdf","txt"],accept_multiple_files=True)

if st.button("Yoxla",type="primary",disabled=not(target and sources)):
    try:
        st.session_state.report=analyze(target.name,target.getvalue(),[(s.name,s.getvalue()) for s in sources])
    except Exception as ex:
        st.error(str(ex))

if "report" in st.session_state:
    r=st.session_state.report
    a,b,c=st.columns(3)
    a.metric("Söz sayı",r["target_word_count"])
    b.metric("5+ söz lokal əhatə",str(r["overall"]["matched_token_coverage_5_pct"])+"%")
    c.metric("20+ söz lokal əhatə",str(r["overall"]["matched_token_coverage_20_pct"])+"%")
    st.dataframe(r["sources"],use_container_width=True)
    for m in r["matches"]:
        with st.expander(str(m["length_words"])+" söz · "+m["source"]):
            st.write(m["target_location"]+" — "+m["target_excerpt"])
    st.download_button("HTML hesabat",render_html(r),file_name="az_lokal_audit.html")
    st.download_button("JSON hesabat",json.dumps(r,ensure_ascii=False,indent=2),file_name="az_lokal_audit.json")
