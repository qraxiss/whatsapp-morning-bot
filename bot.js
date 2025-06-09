/**
 * WhatsApp Morning Bot v2.0
 * Node.js ile geliştirilmiş otomatik günaydın mesajı gönderen bot
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline');

// Kendi modüllerimiz
const config = require('./config');
const logger = require('./utils/logger');
const MessageScheduler = require('./utils/scheduler');
const { getPersonalizedMessage, getRandomMessage } = require('./messages');

class WhatsAppMorningBot {
    constructor() {
        this.client = null;
        this.scheduler = new MessageScheduler();
        this.isReady = false;
        this.contactInfo = null;
        
        // Graceful shutdown için
        this.setupGracefulShutdown();
        
        logger.startup('WhatsApp Morning Bot v2.0 başlatılıyor...');
        this.initializeClient();
    }

    /**
     * WhatsApp Client'ı başlat
     */
    initializeClient() {
        logger.startup('WhatsApp Web Client oluşturuluyor...');
        
        this.client = new Client({
            authStrategy: new LocalAuth({
                name: config.whatsapp.sessionName
            }),
            puppeteer: {
                headless: config.whatsapp.headless,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor'
                ]
            }
        });

        this.setupEventHandlers();
        
        logger.startup('WhatsApp Client başlatılıyor...');
        this.client.initialize();
    }

    /**
     * WhatsApp event handler'ları ayarla
     */
    setupEventHandlers() {
        // QR kod event'i
        this.client.on('qr', (qr) => {
            logger.whatsapp.qr();
            console.log('\n📱 WhatsApp Web\'e giriş yapmak için QR kodu tarayın:\n');
            qrcode.generate(qr, { small: true });
            console.log('\n💡 QR kodu telefonunuzla tarayıp WhatsApp Web\'e bağlanın.\n');
        });

        // Kimlik doğrulama başarılı
        this.client.on('authenticated', () => {
            logger.whatsapp.authenticated();
        });

        // Client hazır
        this.client.on('ready', async () => {
            logger.whatsapp.ready();
            this.isReady = true;
            
            // Kişi bilgilerini yükle
            await this.loadContactInfo();
            
            // Kaçırılan mesaj kontrolü
            if (await this.scheduler.checkMissedMessage()) {
                logger.info('Kaçırılan mesaj tespit edildi, gönderiliyor...');
                await this.sendDailyMessage();
            }
            
            // Ana menüyü göster
            this.showMainMenu();
        });

        // Kimlik doğrulama hatası
        this.client.on('auth_failure', (msg) => {
            logger.whatsapp.authFailure(msg);
        });

        // Bağlantı kesildi
        this.client.on('disconnected', (reason) => {
            logger.whatsapp.disconnected(reason);
            this.isReady = false;
        });

        // Genel hata yakalama
        this.client.on('error', (error) => {
            logger.error('WhatsApp Client', error);
        });

        // Mesaj alındığında (bot komutları için)
        this.client.on('message', async (message) => {
            await this.handleIncomingMessage(message);
        });
    }

    /**
     * Kişi bilgilerini yükle ve doğrula
     */
    async loadContactInfo() {
        try {
            const contacts = await this.client.getContacts();
            const contact = contacts.find(c => 
                (c.name && c.name.toLowerCase().includes(config.whatsapp.contactName.toLowerCase())) ||
                (c.pushname && c.pushname.toLowerCase().includes(config.whatsapp.contactName.toLowerCase()))
            );
            
            if (contact) {
                this.contactInfo = contact;
                logger.info(`👤 Hedef kişi bulundu: ${contact.name || contact.pushname} (${contact.id.user})`);
                return true;
            } else {
                logger.error('loadContactInfo', `"${config.whatsapp.contactName}" adında kişi bulunamadı!`);
                
                // İlk 10 kişiyi listele
                console.log('\n📋 Mevcut kişiler (ilk 10):');
                contacts.slice(0, 10).forEach((c, index) => {
                    if (c.name || c.pushname) {
                        console.log(`  ${index + 1}. ${c.name || c.pushname}`);
                    }
                });
                console.log('\n💡 config.js dosyasında contactName\'i doğru ayarladığınızdan emin olun.\n');
                return false;
            }
        } catch (error) {
            logger.error('loadContactInfo', error);
            return false;
        }
    }

    /**
     * Günlük mesaj gönder
     */
    async sendDailyMessage() {
        try {
            if (!this.isReady) {
                return { success: false, error: 'WhatsApp hazır değil' };
            }

            if (!this.contactInfo) {
                const contactLoaded = await this.loadContactInfo();
                if (!contactLoaded) {
                    return { success: false, error: 'Hedef kişi bulunamadı' };
                }
            }

            logger.message.sending(this.contactInfo.name || this.contactInfo.pushname);

            // Kişiselleştirilmiş mesaj oluştur
            const message = getPersonalizedMessage(
                config.whatsapp.contactName,
                {
                    includeEmojis: config.messages.includeEmojis,
                    maxLength: config.messages.maxLength
                }
            );

            // Mesajı gönder
            const chatId = this.contactInfo.id._serialized;
            await this.client.sendMessage(chatId, message);

            logger.message.sent(this.contactInfo.name || this.contactInfo.pushname, message);
            
            return { 
                success: true, 
                message: message,
                contact: this.contactInfo.name || this.contactInfo.pushname
            };

        } catch (error) {
            logger.message.failed(config.whatsapp.contactName, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Test mesajı gönder
     */
    async sendTestMessage() {
        try {
            if (!this.isReady) {
                console.log('⏳ WhatsApp henüz hazır değil, lütfen bekleyin...');
                return false;
            }

            const testMessage = getRandomMessage('test');
            const result = await this.sendDailyMessage();
            
            if (result.success) {
                console.log('✅ Test mesajı başarıyla gönderildi!');
                console.log(`💌 Mesaj: ${result.message}`);
                return true;
            } else {
                console.log(`❌ Test mesajı gönderilemedi: ${result.error}`);
                return false;
            }
        } catch (error) {
            logger.error('sendTestMessage', error);
            console.log(`❌ Test mesajı hatası: ${error.message}`);
            return false;
        }
    }

    /**
     * Gelen mesajları işle (bot komutları)
     */
    async handleIncomingMessage(message) {
        // Sadece direkt mesajları işle (grup mesajlarını ignore et)
        if (message.from.includes('@g.us')) return;
        
        // Bot komutları
        const text = message.body.toLowerCase().trim();
        
        if (text.includes('bot status') || text.includes('durum')) {
            const stats = await this.scheduler.getStats();
            const response = `🤖 Bot Durumu:
✅ Durum: ${this.isReady ? 'Aktif' : 'Pasif'}
📅 Bugün mesaj: ${stats.todayMessageSent ? 'Gönderildi' : 'Henüz gönderilmedi'}
📊 Toplam mesaj: ${stats.totalMessages}
⏰ Zamanlayıcı: ${stats.isRunning ? 'Çalışıyor' : 'Durdu'}`;
            
            message.reply(response);
            logger.debug('handleIncomingMessage', 'Status komutu işlendi');
        }
        
        if (text.includes('test mesaj')) {
            message.reply('🧪 Test mesajı gönderiliyor...');
            const success = await this.sendTestMessage();
            if (success) {
                message.reply('✅ Test başarılı!');
            } else {
                message.reply('❌ Test başarısız!');
            }
        }
    }

    /**
     * Ana menüyü göster
     */
    showMainMenu() {
        console.log('\n' + '='.repeat(50));
        console.log('🤖 WhatsApp Morning Bot v2.0 - Hazır!');
        console.log('='.repeat(50));
        console.log('📱 WhatsApp Web bağlantısı aktif');
        console.log(`👤 Hedef kişi: ${this.contactInfo?.name || config.whatsapp.contactName}`);
        console.log(`⏰ Günlük mesaj saati: ${config.schedule.dailyTime}`);
        console.log(`🌍 Saat dilimi: ${config.schedule.timezone}`);
        console.log('='.repeat(50));
        console.log('\n📋 Komutlar:');
        console.log('  t - Test mesajı gönder');
        console.log('  s - İstatistikleri göster');
        console.log('  q - Çıkış');
        console.log('\n🔔 Zamanlayıcı başlatılıyor...\n');
        
        this.startSchedulerAndMenu();
    }

    /**
     * Zamanlayıcıyı başlat ve interaktif menüyü aç
     */
    startSchedulerAndMenu() {
        // Zamanlayıcıyı başlat
        this.scheduler.start(async () => await this.sendDailyMessage());
        
        // Interaktif menü
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const askCommand = () => {
            rl.question('\n> Komut girin (t/s/q): ', async (answer) => {
                const cmd = answer.toLowerCase().trim();
                
                switch (cmd) {
                    case 't':
                        console.log('🧪 Test mesajı gönderiliyor...');
                        await this.sendTestMessage();
                        askCommand();
                        break;
                        
                    case 's':
                        const stats = await this.scheduler.getStats();
                        console.log('\n📊 İstatistikler:');
                        console.log(`  📅 Bugün mesaj gönderildi: ${stats.todayMessageSent ? 'Evet' : 'Hayır'}`);
                        console.log(`  📈 Toplam gönderilen mesaj: ${stats.totalMessages}`);
                        console.log(`  📆 Son mesaj tarihi: ${stats.lastMessageDate || 'Hiç'}`);
                        console.log(`  ⏰ Zamanlayıcı durumu: ${stats.isRunning ? 'Çalışıyor' : 'Durdurulmuş'}`);
                        console.log(`  🔄 Bekleyen retry: ${stats.retryQueueLength}`);
                        askCommand();
                        break;
                        
                    case 'q':
                        console.log('👋 Bot durduruluyor...');
                        rl.close();
                        this.gracefulShutdown();
                        break;
                        
                    default:
                        console.log('❌ Geçersiz komut! (t/s/q)');
                        askCommand();
                        break;
                }
            });
        };

        askCommand();
    }

    /**
     * Graceful shutdown ayarla
     */
    setupGracefulShutdown() {
        process.on('SIGINT', () => this.gracefulShutdown());
        process.on('SIGTERM', () => this.gracefulShutdown());
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception', error);
            this.gracefulShutdown();
        });
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection', new Error(`Promise: ${promise}, Reason: ${reason}`));
        });
    }

    /**
     * Temiz kapanış
     */
    gracefulShutdown() {
        logger.info('🛑 Bot kapatılıyor...');
        
        if (this.scheduler) {
            this.scheduler.stop();
        }
        
        if (this.client) {
            this.client.destroy();
        }
        
        logger.info('👋 Bot başarıyla kapatıldı');
        process.exit(0);
    }
}

// Ana fonksiyon
async function main() {
    try {
        // Konsol başlığı
        console.clear();
        console.log('🚀 WhatsApp Morning Bot v2.0');
        console.log('Node.js ile geliştirildi\n');
        
        // Bot'u başlat
        new WhatsAppMorningBot();
        
    } catch (error) {
        logger.error('Main', error);
        console.error('💥 Kritik hata:', error.message);
        process.exit(1);
    }
}

// Program'ı başlat
if (require.main === module) {
    main();
}

module.exports = WhatsAppMorningBot;