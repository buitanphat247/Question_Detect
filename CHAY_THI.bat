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

:: Khởi động Chrome nạp sẵn Extension ngay lập tức (không cần cài đặt thủ công)
start "" "%CHROME_PATH%" --load-extension="%EXT_DIR%" --user-data-dir="%TEMP%\chrome_exam_data" "https://utexlms.hcmute.edu.vn"
exit
