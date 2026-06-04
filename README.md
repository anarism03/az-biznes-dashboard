# Azerbaijan Business Data Visualization Dashboard

Dissertasiya movzusu ucun hazirlanmis React dashboard layihesi. Layihenin meqsedi biznes datasinin vizuallasdirilmasini, KPI idareetmesini, BI aleti secimini, empirik analizi ve data governance prosesini tek strukturda gostermekdir.

## Esas imkanlar

- 2021, 2022, 2023, 2024, 2025 ve 2026 dovrleri uzre resmi makro gostergiciler
- 2026 gostergicileri tam il kimi yox, yanvar-aprel cari dovru kimi ayrica qeyd olunur
- KPI kartlari secilen ile gore yenilenir
- Sektor paylari, illik trendler ve müqayiseli qrafikler
- BI aletleri ucun metodoloji muqayise sehifesi
- Empirik analiz, governance ve hesabat sehifeleri
- Axtaris modali
- Excel, CSV, JSON ve qisa netice export funksiyalari
- Mobil, tablet ve desktop ucun responsive layout

## Sehifeler

- `Icra paneli` - umumi KPI, illik makro qrafikler ve sektor paylari
- `KPI modeli` - dashboard KPI strukturu ve qerar metrikleri
- `BI aletleri` - Power BI, Tableau, Looker ve D3.js muqayisesi
- `Empirik analiz` - 2021-2025 tam il ve 2026 cari dovr analizleri
- `Data governance` - data keyfiyyeti, mesuliyyet ve idareetme qati
- `Hesabat ve menbeler` - dissertasiya fəsilləri, tovsiye ve resmi menbeler

## Data menbeleri

Dashboard resmi ve aciq menbeler esasinda qurulub:

- Dovlet Statistika Komitesi
- Iqtisadiyyat Nazirliyi
- Azerbaycan Respublikasinda reqemsal iqtisadiyyatin inkisafi uzre strategiya
- World Bank Azerbaijan Monthly Economic Update

Qeyd: 2026 melumatlari tam il neticesi deyil, yanvar-aprel dovru ucun resmi cari gostergicilerdir.

## Texnologiyalar

- React
- Vite
- React Router
- Ant Design
- Recharts
- Tailwind CSS
- Lucide React

## Qurasdirma

```bash
npm install
```

## Lokal ise salma

```bash
npm run dev
```

Brauzerde acin:

```text
http://localhost:5173
```

## Production build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Export

Headerdeki `Yukle` menyusu ile dashboard datasini bu formatlarda almaq olar:

- Excel `.xls`
- CSV
- JSON
- Qisa netice kopyalama

## Repository

GitHub: https://github.com/anarism03/az-biznes-dashboard
