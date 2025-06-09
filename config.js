require('dotenv').config();

const config = {
    // WhatsApp ayarları
    whatsapp: {
        contactName: process.env.CONTACT_NAME || 'SEVGILI_ADI', // ⚠️ .env dosyasında ayarlayın
        sessionName: 'whatsapp-morning-session',
        headless: process.env.NODE_ENV === 'production', // Production'da headless
        timeout: 30000
    },

    // Zamanlama ayarları
    schedule: {
        dailyTime: '0 9 * * *', // Her gün saat 09:00 (cron format)
        timezone: 'Europe/Istanbul',
        retryInterval: 5, // Başarısız mesajları 5 dakika sonra tekrar dene
        maxRetries: 3
    },

    // Log ayarları
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: 'logs/whatsapp-bot.log',
        maxSize: '10m',
        maxFiles: 5
    },

    // Mesaj ayarları
    messages: {
        maxLength: 1000,
        includeEmojis: true,
        personalizedMessages: true
    },

    // Güvenlik ayarları
    security: {
        enableMessageLog: true,
        maxDailyMessages: 1,
        preventDuplicates: true
    },

    // Debug ayarları
    debug: {
        verbose: process.env.NODE_ENV !== 'production',
        saveScreenshots: false,
        logMessageContent: process.env.NODE_ENV !== 'production'
    }
};

module.exports = config;