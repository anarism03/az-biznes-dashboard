# Azərbaycan Biznes Dashboard

Bu layihə mənim dissertasiya mövzum üçün hazırlanmış biznes data vizuallaşdırma panelidir. Məqsəd sadədir: rəsmi iqtisadi göstəriciləri daha oxunaqlı formada göstərmək və qərarvermə üçün istifadə oluna bilən dashboard nümunəsi qurmaq.

Layihədə 2021, 2022, 2023, 2024, 2025 və 2026 göstəriciləri var. 2026 məlumatı tam il deyil, yanvar-aprel dövrü kimi ayrıca göstərilir.

## Nələr var

- İllərə görə ÜDM və qeyri-neft/qaz göstəriciləri
- KPI kartları və qrafiklər
- Sektor payları
- BI alətlərinin müqayisəsi
- Empirik analiz bölməsi
- Data governance səhifəsi
- Hesabat və mənbələr bölməsi
- Axtarış
- Excel, CSV və JSON export
- Mobil və tablet üçün uyğun görünüş

## İstifadə olunan texnologiyalar

- React
- Vite
- Ant Design
- Recharts
- React Router
- Tailwind CSS

## Layihəni işə salmaq

Əvvəl paketləri quraşdır:

```bash
npm install
```

Sonra lokal serveri başlat:

```bash
npm run dev
```

Brauzerdə bu ünvana keç:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Mənbələr

Dashboard əsasən rəsmi açıq mənbələrdəki məlumatlara əsaslanır:

- Dövlət Statistika Komitəsi
- İqtisadiyyat Nazirliyi
- Rəqəmsal iqtisadiyyat strategiyası
- World Bank Azerbaijan Monthly Economic Update

## Qeyd

Bu layihə həm dissertasiya üçün praktiki nümunədir, həm də real dashboard kimi istifadə oluna bilər.
