@echo off
title Pacman Game - Local Server

echo ===============================
echo    Iniciando Pacman Game JS
echo ===============================
echo.

REM Comprobamos si Python está instalado
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python no está instalado o no está en PATH.
    echo Por favor instala Python 3 desde https://www.python.org/
    pause
    exit /b
)

echo Lanzando servidor en el puerto 8000...
start "" http://localhost:8000
python -m http.server 8000

pause
