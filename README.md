# 🌅 WhatsApp Morning Bot v2.0

Sevgilinize her sabah otomatik günaydın mesajı gönderen Node.js botu. 24/7 çalışabilir, sunucuda kurulabilir ve tamamen özelleştirilebilir.

## ✨ Özellikler

- ✅ **Otomatik mesaj gönderimi** - Her sabah saat 09:00'da
- ✅ **Kaçırılan mesaj sistemi** - Sunucu geç açılsa bile gönderir
- ✅ **Kişiselleştirilmiş mesajlar** - 40+ farklı mesaj şablonu
- ✅ **Zamanlı çalışma** - Cron job ile hassas zamanlama
- ✅ **Log sistemi** - Detaylı kayıt tutma
- ✅ **Retry mekanizması** - Başarısız mesajları tekrar dener
- ✅ **Sunucu desteği** - VPS/Cloud sunucuda çalışabilir
- ✅ **PM2 desteği** - Process manager ile yönetim
- ✅ **Bot komutları** - WhatsApp'tan bot kontrolü

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js (v16+)
- npm veya yarn
- Chrome/Chromium browser
- WhatsApp telefon uygulaması

### Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/yourusername/whatsapp-morning-bot.git
cd whatsapp-morning-bot
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Çevre değişkenlerini ayarlayın:**
```bash
cp .env.example .env
# .env dosyasını editöyde açın ve CONTACT_NAME'i ayarlayın
```

4. **Bot'u başlatın:**
```bash
npm start
```

5. **QR kodu tarayın:**
   - Terminal'de çıkan QR kodu WhatsApp'ınızla tarayın
   - WhatsApp Web'e bağlantı kurulacak

6. **Test edin:**
   - Terminal'de `t` yazıp Enter'a basın
   - Test mesajı gönderilecek

## ⚙️ Konfigürasyon

### .env Dosyası

```env
# Sevgilinizin WhatsApp'taki adı (tam olarak)
CONTACT_NAME=Sevgi Yıldız

# Çalışma ortamı
NODE_ENV=production

# Log seviyesi
LOG_LEVEL=info
```

### config.js Ayarları

```javascript
// Mesaj gönderme saati (cron format)
dailyTime: '0 9 * * *', // Her gün 09:00

// Saat dilimi
timezone: 'Europe/Istanbul',

// Maksimum retry sayısı
maxRetries: 3
```

## 📂 Proje Yapısı

```
whatsapp-morning-bot/
├── 📄 bot.js              # Ana bot kodu
├── ⚙️ config.js           # Konfigürasyon
├── 💬 messages.js         # Mesaj şablonları
├── 📦 package.json        # Proje ayarları
├── 🔐 .env               # Çevre değişkenleri
├── 📚 README.md          # Bu dosya
├── 🚫 .gitignore         # Git ignore
└── 📁 utils/
    ├── 📝 logger.js       # Log sistemi
    └── ⏰ scheduler.js     # Zamanlama sistemi
```

## 🌐 Sunucu Kurulumu

### DigitalOcean/AWS/VPS'te Kurulum

1. **Sunucuya bağlanın:**
```bash
ssh root@your-server-ip
```

2. **Node.js kurulumu:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Chrome kurulumu (WhatsApp Web için):**
```bash
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

4. **PM2 kurulumu:**
```bash
npm install -g pm2
```

5. **Bot'u kurün:**
```bash
git clone https://github.com/yourusername/whatsapp-morning-bot.git
cd whatsapp-morning-bot
npm install
```

6. **PM2 ile başlatın:**
```bash
pm2 start bot.js --name "whatsapp-bot"
pm2 startup
pm2 save
```

### Docker ile Kurulum

```dockerfile
# Dockerfile kullanımı
docker build -t whatsapp-morning-bot .
docker run -d --name whatsapp-bot whatsapp-morning-bot
```

## 📋 Komutlar

### NPM Scripts

```bash
npm start           # Bot'u başlat
npm run dev         # Development modda başlat (nodemon ile)
npm test            # Test mesajı gönder
npm run pm2:start   # PM2 ile başlat
npm run pm2:stop    # PM2'yi durdur
npm run pm2:logs    # PM2 loglarını göster
```

### Bot Komutları (WhatsApp'tan)

Bot'a WhatsApp'tan mesaj gönderebilirsiniz:

- `bot status` veya `durum` - Bot durumunu kontrol et
- `test mesaj` - Test mesajı gönder

### Terminal Komutları

Bot çalışırken terminalde:

- `t` - Test mesajı gönder
- `s` - İstatistikleri göster  
- `q` - Bot'u kapat

## 📊 Monitoring

### Loglar

```bash
# Canlı logları takip et
tail -f logs/whatsapp-bot.log

# PM2 logları
pm2 logs whatsapp-bot

# Hata logları
tail -f logs/error.log
```

### İstatistikler

Bot'un gönderdiği mesajlar `logs/message-log.json` dosyasında tutulur:

```json
{
  "2024-06-09": {
    "sent": true,
    "timestamp": "2024-06-09T06:00:00.000Z",
    "time": "09:00:00",
    "retryCount": 0
  }
}
```

## 🎨 Özelleştirme

### Yeni Mesaj Ekleme

`messages.js` dosyasını editleyerek yeni mesajlar ekleyebilirsiniz:

```javascript
morning: [
    "Kendi mesajınız buraya! 💕",
    "Başka bir sevgi dolu mesaj ❤️"
]
```

### Zamanlama Değiştirme

`config.js` dosyasından mesaj saatini değiştirebilirsiniz:

```javascript
schedule: {
    dailyTime: '0 8 * * *', // Saat 08:00
    timezone: 'Europe/Istanbul'
}
```

### Özel Günler

Özel günler için mesajlar ekleyebilirsiniz:

```javascript
// Doğum günü, yıldönümü vs.
special: {
    "2024-02-14": "Sevgililer günü özel mesajı! 💕",
    "2024-12-31": "Yeni yıl mesajı! 🎉"
}
```

## 🛠️ Sorun Giderme

### Yaygın Sorunlar

**QR kod tarayamıyorum:**
```bash
# Headless modu kapatın
NODE_ENV=development npm start
```

**Kişi bulunamıyor:**
```bash
# .env dosyasında ismi kontrol edin
CONTACT_NAME=Tam İsim Soyadı
```

**Chrome hatası (Linux):**
```bash
# Chrome eksik bağımlılıkları kurun
sudo apt-get install -y libnss3 libatk-bridge2.0-0 libx11-xcb1 libxcb-dri3-0 libxss1 libasound2
```

**Memory hatası:**
```bash
# PM2 restart
pm2 restart whatsapp-bot
```

### Debug Modu

```bash
# Detaylı log için
LOG_LEVEL=debug npm start
```

## 🔒 Güvenlik

- `.env` dosyasını asla Git'e commitlemeyin
- Sunucuda firewall kullanın
- SSH key authentication kullanın
- Düzenli olarak güncellemeleri takip edin

## 📈 Performans

- **RAM Kullanımı:** ~100-200MB
- **CPU Kullanımı:** Minimal
- **Disk:** ~50MB
- **Network:** Minimal (sadece mesaj gönderirken)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit yapın (`git commit -am 'Yeni özellik eklendi'`)
4. Push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

## ⭐ Destek

Eğer bu proje işinize yaradıysa, lütfen ⭐ verin!

## 📞 İletişim

- GitHub: [@aysebelenpisdil](https://github.com/aysebelenpisdil)
- Email: aysebelenpisdil@gmail.com

---

**💡 Not:** Bu bot eğitim amaçlıdır. WhatsApp'ın kullanım şartlarına uygun olarak kullanın.

## 🔄 Güncellemeler

### v2.0.0 (Latest)
- ✅ Node.js'e tamamen geçiş
- ✅ Gelişmiş log sistemi
- ✅ PM2 desteği
- ✅ Sunucu optimizasyonu
- ✅ Retry mekanizması

### v1.0.0
- ✅ Python/Selenium ile ilk versiyon
- ✅ Temel mesaj gönderme
- ✅ Windows Task Scheduler desteği