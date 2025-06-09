@echo off
chcp 65001 >nul
title GitHub Temizleme
echo.
echo GitHub icin proje temizleniyor...
echo ===============================
echo.

echo 1. .env dosyasi generic yapiliyor...
echo CONTACT_NAME=SEVGILI_ADI > .env
echo NODE_ENV=development >> .env  
echo LOG_LEVEL=info >> .env
echo DEBUG_MODE=true >> .env

echo 2. .env.example olusturuluyor...
copy .env .env.example >nul

echo 3. .gitignore olusturuluyor...
(
echo node_modules/
echo .env
echo logs/
echo *.log
echo .wwebjs_auth/
echo .wwebjs_cache/
echo whatsapp-morning-session/
echo *-session/
echo message-log.json
echo .pm2/
echo .vscode/
echo .idea/
echo .DS_Store
echo Thumbs.db
) > .gitignore

echo 4. Gereksiz dosyalar siliniyor...
if exist "logs\*.log" del /q "logs\*.log" 2>nul
if exist "logs\message-log.json" del /q "logs\message-log.json" 2>nul
if exist "whatsapp-morning-session" rmdir /s /q "whatsapp-morning-session" 2>nul
if exist ".wwebjs_auth" rmdir /s /q ".wwebjs_auth" 2>nul
if exist ".wwebjs_cache" rmdir /s /q ".wwebjs_cache" 2>nul

echo 5. logs klasoru hazirlaniyor...
if not exist "logs" mkdir logs
echo # Log dosyalari burada tutulur > logs\.gitkeep

echo.
echo ✅ Temizlik tamamlandi!
echo ========================
echo.
echo Temizlenen ogeler:
echo - .env dosyasi generic yapildi
echo - .env.example olusturuldu  
echo - .gitignore guncellendi
echo - Log dosyalari temizlendi
echo - Session dosyalari temizlendi
echo.
echo GitHub'a yuklemeye hazir!
echo.

pause