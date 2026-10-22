# AzərDash — Azərbaycan Biznes Dashboard

Anar Ismayılzadənin dissertasiya mövzusu üçün praktiki nümunə: **biznesdə qərarverməni optimallaşdırmaq üçün qabaqcıl data vizuallaşdırma və interaktiv dashboard analizi**.

Panel 2021–2026 rəsmi makro göstəriciləri və Dünya Bankı Open Data API-sini birləşdirir. 2026 məlumatı tam il deyil — yanvar–aprel dövrü kimi ayrıca göstərilir.

## Nələr var

- Linked KPI paneli (il/sektor filtrləri bütün qrafikləri sinxron yeniləyir)
- Qrafik kliklə il seçimi və sektor **drill-down** detalı
- KPI kartları, boş/yüklənmə vəziyyətləri
- Sektor payları, BI alət müqayisəsi, empirik analiz, data governance
- Axtarış, Excel/CSV/JSON export
- Light/dark tema, mobil və tablet uyğunluğu
- TypeScript (core) + React 18 + Vite

## Texnologiyalar

- React 18 + TypeScript
- Vite
- Ant Design
- Recharts
- React Router
- Tailwind CSS

## İşə salmaq

```bash
npm install
npm run dev
```

Brauzer: `http://localhost:5173`

## Build / typecheck

```bash
npm run typecheck
npm run build
npm run preview
```

## Mənbələr

- Dövlət Statistika Komitəsi
- İqtisadiyyat Nazirliyi
- Rəqəmsal iqtisadiyyat strategiyası
- World Bank Azerbaijan Open Data / Monthly Economic Update
