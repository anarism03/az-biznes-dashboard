@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>&1
if errorlevel 1 (
 echo Python tapilmadi. https://www.python.org/downloads/ saytindan Python qurasdirin.
 pause
 exit /b 1
)
if not exist .venv py -3 -m venv .venv
call .venv\Scripts\activate.bat
python -m pip install -r requirements.txt
if errorlevel 1 (
 echo Asililiqlarin qurasdirilmasi alinmadi.
 pause
 exit /b 1
)
python -m streamlit run app.py
pause
