@echo off
title Push TMG301 to GitHub (carwynetic)
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================================
echo   Pushing TMG301-Term5 to https://github.com/carwynetic/TMG301-Term5.git
echo ========================================================
echo.

git branch -M main
git status

echo.
echo Đang tiến hành push lên remote origin...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   [THÀNH CÔNG] Đã push toàn bộ dự án lên GitHub!
    echo   Repository: https://github.com/carwynetic/TMG301-Term5
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [LƯU Ý] Nếu gặp lỗi xác thực (Permission denied / Auth required):
    echo   - Hãy đăng nhập tài khoản GitHub bằng trình duyệt khi được hỏi.
    echo   - Hoặc sử dụng GitHub Personal Access Token (PAT).
    echo ========================================================
)

echo.
pause
