@echo off
color 0A
title GitHub Upload Automatic

echo ================================
echo   GITHUB AUTO UPLOAD SCRIPT
echo ================================

echo.
set /p repo=Masukkan URL Repository GitHub:

echo.
echo Contoh:
echo https://github.com/meteoradja-ytmjk/youtube-uploader.git

echo.
pause

cd /d %~dp0

git init

git add .

git commit -m "auto upload"

git branch -M main

git remote remove origin >nul 2>&1

git remote add origin %repo%

git pull origin main --allow-unrelated-histories

git push -u origin main --force

echo.
echo ================================
echo       UPLOAD SELESAI

echo ================================
echo.
pause
