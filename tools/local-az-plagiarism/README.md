# Azərbaycan dilində lokal plagiat-oxşarlıq auditi

Bu ayrıca `feature/local-az-plagiarism-audit` branch-ı AzərDash əsas proqramının işini dəyişmir.

**İmkanlar:** DOCX/PDF/TXT sənədlərini yerli sənədlərlə 5 və 20 ardıcıl söz uyğunluğu üzrə müqayisə etmək; uyğun paraqrafları göstərmək; HTML və JSON hesabatları çıxarmaq.

**Əhəmiyyətli:** Bu alət StrikePlagiarism/Turnitin deyil. İnternet, nəşriyyat və universitet bazalarına çıxış vermir. AI müəllifliyi yoxlanılmır. Faizlər UNEC-in rəsmi I/II əmsalı ilə müqayisə edilə bilməz.

## Windows istifadə qaydası

1. Python 3.11+ yükləyin.
2. Bu qovluqdakı faylları kompüterinizdə eyni qovluğa yerləşdirin.
3. `start_windows.bat` faylını iki dəfə klikləyin. İlk istifadədə paketlər endiriləcək.
4. Brauzerdə `http://localhost:8501` açın.
5. Hədəf dissertasiya və müqayisə mənbələrini seçib yoxlayın.

## CLI

```powershell
python checker.py --target "C:\Users\HOME\Desktop\dissertasiya.docx" --sources "C:\Users\HOME\Desktop\menbeler" --output report.html --json report.json
```

## Təhlükəsizlik

Dissertasiya mətnini bu ictimai GitHub reposuna commit etməyin. Hədəf və mənbə faylları lokal qalır. İlk Python paket quraşdırılmasından başqa proqramın özü heç bir bulud API-sinə mətn göndərmir.

Əgər rəsmi UNEC yoxlamasının nəticəsini istəyirsinizsə, StrikePlagiarism üzrə universitetdən verilən hesabatı ayrıca əldə edin.
