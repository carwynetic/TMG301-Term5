@echo off
chcp 65001 > nul
title TMG301 Master Exam Prep - Local Server

echo =======================================================================
echo   🎓 TMG301 TEXT MINING MASTER EXAM PREP - FPT UNIVERSITY TERM 5
echo   17 Chapters • 950 Questions • 50-Min Mock Exam Engine
echo =======================================================================
echo.
echo [1/2] Checking Python environment...
python --version > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.8+ or open index.html directly in your browser.
    echo.
    pause
    exit /b 1
)

echo [2/2] Starting local HTTP server at http://localhost:8000 ...
echo.
python "%~dp0server.py"

pause
