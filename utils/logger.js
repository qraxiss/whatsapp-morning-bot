const winston = require('winston');
const config = require('../config');

// Log formatı
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
);

// Renkli console formatı
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'HH:mm:ss'
    }),
    winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    })
);

// Winston logger konfigürasyonu
const logger = winston.createLogger({
    level: config.logging.level,
    format: logFormat,
    transports: [
        // Dosyaya loglama
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: config.logging.file,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        
        // Console'a loglama
        new winston.transports.Console({
            format: consoleFormat,
            level: config.debug.verbose ? 'debug' : 'info'
        })
    ]
});

// Özel log metodları
const customLogger = {
    // Sistem başlatma
    startup: (message) => {
        logger.info(`🚀 STARTUP: ${message}`);
    },

    // WhatsApp olayları
    whatsapp: {
        qr: () => {
            logger.info('📱 QR kod oluşturuldu, WhatsApp ile tarayın');
        },
        authenticated: () => {
            logger.info('🔐 WhatsApp kimlik doğrulama başarılı');
        },
        ready: () => {
            logger.info('✅ WhatsApp Web bağlantısı hazır');
        },
        disconnected: (reason) => {
            logger.warn(`🔌 WhatsApp bağlantısı kesildi: ${reason}`);
        },
        authFailure: (error) => {
            logger.error(`❌ WhatsApp kimlik doğrulama başarısız: ${error}`);
        }
    },

    // Mesaj işlemleri
    message: {
        sending: (contact) => {
            logger.info(`📤 Mesaj gönderiliyor: ${contact}`);
        },
        sent: (contact, message) => {
            logger.info(`✅ Mesaj gönderildi: ${contact}`);
            if (config.debug.logMessageContent) {
                logger.debug(`💌 Mesaj içeriği: ${message}`);
            }
        },
        failed: (contact, error) => {
            logger.error(`❌ Mesaj gönderilemedi (${contact}): ${error}`);
        },
        duplicate: (date) => {
            logger.warn(`⚠️ Bugün zaten mesaj gönderilmiş: ${date}`);
        }
    },

    // Zamanlama
    schedule: {
        set: (time) => {
            logger.info(`⏰ Zamanlayıcı ayarlandı: ${time}`);
        },
        triggered: () => {
            logger.info('🔔 Zamanlanmış görev tetiklendi');
        },
        missed: (reason) => {
            logger.warn(`⏳ Kaçırılan görev: ${reason}`);
        }
    },

    // Hata yakalama
    error: (operation, error) => {
        logger.error(`💥 Hata [${operation}]: ${error.message}`, error);
    },

    // Debug bilgileri
    debug: (operation, data) => {
        if (config.debug.verbose) {
            logger.debug(`🔍 DEBUG [${operation}]: ${JSON.stringify(data, null, 2)}`);
        }
    },

    // Sistem durumu
    system: {
        memory: () => {
            const used = process.memoryUsage();
            const memInfo = Object.keys(used).map(key => `${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`).join(', ');
            logger.info(`📊 Bellek kullanımı: ${memInfo}`);
        },
        uptime: () => {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            logger.info(`⏱️ Çalışma süresi: ${hours}s ${minutes}d`);
        }
    }
};

// Winston logger'ı extend et
Object.setPrototypeOf(customLogger, logger);

module.exports = customLogger;