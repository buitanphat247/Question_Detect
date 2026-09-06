@echo off
chcp 65001 >nul
set "EXT_DIR=%~dp0"
if "%EXT_DIR:~-1%"=="\" set "EXT_DIR=%EXT_DIR:~0,-1%"

:: Tìm đường dẫn Google Chrome trên máy
set "CHROME_PATH="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME_PATH=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if "%CHROME_PATH%"=="" set "CHROME_PATH=chrome.exe"

:: Kiểm tra nếu Chrome đang chạy ngầm thì đóng để nạp extension
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ========================================================
    echo   Chrome đang chạy! Đang khởi động lại để nạp tiện ích...
    echo ========================================================
    taskkill /F /IM chrome.exe >nul 2>&1
    timeout /t 1 /nobreak >nul
)

:: Mở lại Chrome với Extension đã nạp sẵn và khôi phục các tab làm việc
start "" "%CHROME_PATH%" --load-extension="%EXT_DIR%" --restore-last-session "https://utexlms.hcmute.edu.vn"
exit
