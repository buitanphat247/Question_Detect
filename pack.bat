@echo off
chcp 65001 >nul
echo Đang đóng gói tiện ích thành 1 file ZIP duy nhất...
powershell -Command "Compress-Archive -Path manifest.json, background.js, content.js, popup.html, popup.css, popup.js, icons -DestinationPath Detect_Question.zip -Force"
echo [THÀNH CÔNG] Đã tạo file: Detect_Question.zip
pause
