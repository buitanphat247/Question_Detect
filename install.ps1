# Script tự động tải và cài đặt Extension Detect_Question siêu tốc
$ErrorActionPreference = 'Stop'
Write-Host ">>> Dang tai Extension moi nhat tu GitHub..." -ForegroundColor Cyan

$zipUrl = "https://github.com/buitanphat247/Question_Detect/archive/refs/heads/main.zip"
$zipFile = "ext_temp.zip"

Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile
Expand-Archive -Path $zipFile -DestinationPath . -Force

if (Test-Path "Detect_Question") {
    Remove-Item "Detect_Question" -Recurse -Force
}
Rename-Item "Question_Detect-main" "Detect_Question"
Remove-Item $zipFile -Force

Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host "✅ TAI VA GIAI NEN THANH CONG VAO THU MUC: Detect_Question" -ForegroundColor Green
Write-Host "👉 Mo chrome://extensions -> Bat Developer mode -> Load Unpacked" -ForegroundColor Yellow
Write-Host "=======================================================`n" -ForegroundColor Green
