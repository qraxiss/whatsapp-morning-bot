const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const logger = require('./logger');

class MessageScheduler {
    constructor() {
        this.tasks = new Map();
        this.logFile = 'logs/message-log.json';
        this.retryQueue = [];
        this.isRunning = false;
    }

    /**
     * Mesaj log dosyasını yükle
     */
    async loadMessageLog() {
        try {
            const logExists = await fs.access(this.logFile).then(() => true).catch(() => false);
            if (!logExists) {
                return {};
            }
            
            const data = await fs.readFile(this.logFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            logger.error('loadMessageLog', error);
            return {};
        }
    }

    /**
     * Mesaj logunu kaydet
     */
    async saveMessageLog(data) {
        try {
            // logs klasörünün var olduğundan emin ol
            await fs.mkdir(path.dirname(this.logFile), { recursive: true });
            await fs.writeFile(this.logFile, JSON.stringify(data, null, 2));
        } catch (error) {
            logger.error('saveMessageLog', error);
        }
    }

    /**
     * Bugün mesaj gönderildi mi kontrol et
     */
    async isMessageSentToday() {
        const log = await this.loadMessageLog();
        const today = new Date().toISOString().split('T')[0];
        return log[today]?.sent || false;
    }

    /**
     * Mesaj gönderildi olarak işaretle
     */
    async markMessageSent(messageContent = null) {
        const log = await this.loadMessageLog();
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        
        log[today] = {
            sent: true,
            timestamp: now.toISOString(),
            time: now.toLocaleTimeString('tr-TR'),
            message: config.debug.logMessageContent ? messageContent : '[Gizli]',
            retryCount: 0
        };
        
        await this.saveMessageLog(log);
        logger.message.sent('Log', `Mesaj ${today} tarihinde kaydedildi`);
    }

    /**
     * Kaçırılan mesaj kontrolü
     */
    async checkMissedMessage() {
        const now = new Date();
        const hour = now.getHours();
        
        // Saat 9'u geçtiyse ve bugün mesaj gönderilmemişse
        if (hour >= 9 && !(await this.isMessageSentToday())) {
            logger.schedule.missed(`Saat ${hour}:${now.getMinutes()}, bugün henüz mesaj gönderilmemiş`);
            return true;
        }
        
        return false;
    }

    /**
     * Ana günlük mesaj gönderme fonksiyonu
     */
    async executeDailyMessage(sendMessageCallback) {
        try {
            // Çift mesaj kontrolü
            if (await this.isMessageSentToday()) {
                logger.message.duplicate(new Date().toISOString().split('T')[0]);
                return false;
            }

            logger.schedule.triggered();
            
            // Mesaj gönderme callback'ini çağır
            const result = await sendMessageCallback();
            
            if (result.success) {
                await this.markMessageSent(result.message);
                return true;
            } else {
                // Başarısız olursa retry queue'ye ekle
                this.addToRetryQueue(sendMessageCallback);
                return false;
            }
            
        } catch (error) {
            logger.error('executeDailyMessage', error);
            this.addToRetryQueue(sendMessageCallback);
            return false;
        }
    }

    /**
     * Retry queue'ye görev ekle
     */
    addToRetryQueue(callback) {
        if (this.retryQueue.length < config.schedule.maxRetries) {
            this.retryQueue.push({
                callback,
                addedAt: new Date(),
                retryCount: 0
            });
            logger.debug('addToRetryQueue', `Retry queue'ye eklendi. Toplam: ${this.retryQueue.length}`);
        }
    }

    /**
     * Retry queue'yu işle
     */
    async processRetryQueue() {
        if (this.retryQueue.length === 0) return;

        logger.debug('processRetryQueue', `${this.retryQueue.length} görev işleniyor`);

        const task = this.retryQueue.shift();
        if (!task) return;

        try {
            task.retryCount++;
            const result = await task.callback();
            
            if (result.success) {
                await this.markMessageSent(result.message);
                logger.info(`✅ Retry başarılı (${task.retryCount}. deneme)`);
            } else if (task.retryCount < config.schedule.maxRetries) {
                // Maksimum retry'a ulaşmadıysa tekrar ekle
                this.retryQueue.push(task);
                logger.warn(`⚠️ Retry başarısız, tekrar denenecek (${task.retryCount}/${config.schedule.maxRetries})`);
            } else {
                logger.error('processRetryQueue', `Maksimum retry sayısına ulaşıldı (${config.schedule.maxRetries})`);
            }
        } catch (error) {
            logger.error('processRetryQueue', error);
        }
    }

    /**
     * Ana zamanlayıcıyı başlat
     */
    start(sendMessageCallback) {
        if (this.isRunning) {
            logger.warn('Scheduler zaten çalışıyor');
            return;
        }

        this.isRunning = true;
        logger.schedule.set(`${config.schedule.dailyTime} (${config.schedule.timezone})`);

        // Ana cron job - günlük mesaj
        const dailyTask = cron.schedule(config.schedule.dailyTime, async () => {
            await this.executeDailyMessage(sendMessageCallback);
        }, {
            scheduled: true,
            timezone: config.schedule.timezone
        });

        // Retry işlemleri için ikinci cron job
        const retryTask = cron.schedule(`*/${config.schedule.retryInterval} * * * *`, async () => {
            await this.processRetryQueue();
        }, {
            scheduled: true,
            timezone: config.schedule.timezone
        });

        // Sistem durumu kontrolü (her saat)
        const statusTask = cron.schedule('0 * * * *', () => {
            logger.system.memory();
            logger.system.uptime();
        }, {
            scheduled: true,
            timezone: config.schedule.timezone
        });

        // Task'ları kaydet
        this.tasks.set('daily', dailyTask);
        this.tasks.set('retry', retryTask);
        this.tasks.set('status', statusTask);

        logger.startup('Zamanlayıcı sistemi başlatıldı');
        
        // İlk başlatmada kaçırılan mesaj kontrolü
        setTimeout(async () => {
            if (await this.checkMissedMessage()) {
                await this.executeDailyMessage(sendMessageCallback);
            }
        }, 5000);
    }

    /**
     * Zamanlayıcıyı durdur
     */
    stop() {
        if (!this.isRunning) {
            return;
        }

        this.tasks.forEach((task, name) => {
            task.destroy();
            logger.debug('stop', `${name} task'ı durduruldu`);
        });

        this.tasks.clear();
        this.isRunning = false;
        logger.info('🛑 Zamanlayıcı sistemi durduruldu');
    }

    /**
     * Test modu - hemen mesaj gönder
     */
    async testMessage(sendMessageCallback) {
        logger.info('🧪 Test modu: Mesaj gönderiliyor...');
        
        try {
            const result = await sendMessageCallback();
            if (result.success) {
                logger.info('✅ Test mesajı başarıyla gönderildi');
                return true;
            } else {
                logger.error('testMessage', 'Test mesajı gönderilemedi');
                return false;
            }
        } catch (error) {
            logger.error('testMessage', error);
            return false;
        }
    }

    /**
     * İstatistikler
     */
    async getStats() {
        const log = await this.loadMessageLog();
        const today = new Date().toISOString().split('T')[0];
        
        const stats = {
            totalMessages: Object.keys(log).length,
            todayMessageSent: log[today]?.sent || false,
            lastMessageDate: Object.keys(log).sort().pop(),
            retryQueueLength: this.retryQueue.length,
            isRunning: this.isRunning,
            activeTasks: this.tasks.size
        };

        return stats;
    }
}

module.exports = MessageScheduler;