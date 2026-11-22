# AzərDash — qərar üçün vizual analitika

“Biznesdə qərarverməni optimallaşdırmaq üçün qabaqcıl data vizuallaşdırma və interaktiv dashboard analizi” mövzusunda
magistr dissertasiyasının (UNEC, 2026) praktiki prototipi.

Panel üç məlumat mənbəyini bir interfeysdə birləşdirir:

- **Dövlət Statistika Komitəsi** — 2021–2025 tam illik və 2026 yanvar–aprel makro göstəriciləri, ÜDM-in sektor strukturu;
- **Dünya Bankı Open Data API** — ÜDM (USD), real artım, inflyasiya, işsizlik, ixrac və idxal; API cavab verməyəndə
  `src/data/worldBankSnapshot.ts` ehtiyat nüsxəsi işə düşür və bu interfeysdə açıq göstərilir;
- **26.10.2026 sorğusu** — 29 uyğun cavab: istifadə tezliyi × qərar hazırlığı çarpaz bölgüsü, fayda ifadələri,
  hesabat vaxtı, maneələr, təlim ehtiyacı (`src/data/survey.ts`).

## İmkanlar

- İl zolağı, qrafikə klik və sektor seçimi bütün paneli birlikdə yeniləyir; vəziyyət URL-də saxlanılır
  (`?il=2024&sektor=Sənaye`) və linklə paylaşılır
- Hər kartda məlumatın aid olduğu il; qismən il (2026) tam illik trendə qoşulmur və ayrıca işarələnir
- Sektor üzrə detal paneli və filtr kimi tətbiq
- Komanda paleti (Ctrl/⌘ + K), klaviatura qısayolları (← → il, T tema, F təqdimat, P çap, ? kömək)
- Təqdimat rejimi (tam ekran), çap / PDF üçün ayrıca üslub
- Excel, CSV, JSON ixracı, qısa xülasəni və linki kopyalama
- Liquid glass interfeys, View Transitions ilə səhifə keçidi və klik nöqtəsindən açılan tema dəyişməsi
- Açıq və tünd tema, mobil uyğunluq, `prefers-reduced-motion` və `prefers-reduced-transparency` dəstəyi

## Texnologiyalar

React 18 · TypeScript · Vite · Recharts · Motion · Ant Design · Tailwind CSS · Onest şrifti

## İşə salmaq

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build
```

Müəllif: İsmayılzadə Anar Nizami oğlu · Elmi rəhbər: t.ü.f.d., dos. Sərdarova İcabikə Ziya qızı
