@echo off
chcp 65001 >nul
title Khởi động hệ thống giải đề tự động...

set "EXT_DIR=%~dp0"
if "%EXT_DIR:~-1%"=="\" set "EXT_DIR=%EXT_DIR:~0,-1%"

:: Tìm đường dẫn Google Chrome
set "CHROME_PATH="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if "%CHROME_PATH%"=="" set "CHROME_PATH=chrome.exe"

echo ================================================================
echo   [1/2] ĐANG TẮT TOÀN BỘ TIẾN TRÌNH CHROME CHẠY NGẦM...
echo ================================================================
taskkill /F /IM chrome.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo ================================================================
echo   [2/2] ĐANG MỞ LẠI CHROME VÀ NẠP TIỆN ÍCH GIẢI ĐỀ (ALT + H)...
echo   (Toàn bộ tab cũ của bạn sẽ được tự động khôi phục lại)
echo ================================================================
start "" "%CHROME_PATH%" --load-extension="%EXT_DIR%" --restore-last-session "https://utexlms.hcmute.edu.vn"

timeout /t 1 /nobreak >nul
exit
