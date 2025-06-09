/**
 * WhatsApp Morning Bot - Mesaj Şablonları
 * Sevgi dolu günaydın mesajları (Sorulu versiyon - Emojisiz)
 */

const messages = {
    // Klasik günaydın mesajları
    morning: [
        "Günaydın aşkım! Harika bir gün geçir. Bugün neler yapacaksın?",
        "Günaydın canım! Seni çok seviyorum. Bugün planların neler?",
        "Sabah sabah gülümsemen için buradayım. Bu güzel günde neler yapmayı planlıyorsun?",
        "Yeni bir gün, yeni umutlar... Günaydın bebeğim! Bugün hangi güzel şeyler seni bekliyor?",
        "Kahvenden bile tatlısın günaydın sevgilim! Bugün ne yapıyorsun?",
        "Gözlerini açtığın an dünya güzelleşiyor. Bugün nelerle meşgul olacaksın?",
        "Bugün senin günün olsun aşkım! Bu güzel günde neler yapacağını merak ediyorum?",
        "Bir gülümsemenle bütün günümü aydınlatırsın. Bugün nasıl geçireceksin günü?"
    ],

    // Romantik mesajlar
    romantic: [
        "Sabah sabah en güzel hediyem sen olmak. Bugün ne yapacaksın canım?",
        "Hayatımın anlamı, günaydın sevgilim! Bugün hangi güzel işlerle meşgul olacaksın?",
        "Seninle her sabah bir masal gibi başlıyor. Bu masalımsı günde neler yapacaksın?",
        "Ruhumun yarısı, günaydın aşkım! Bugün planların neler?",
        "Kalbimin kraliçesi, güzel bir gün geçir. Bugün krallığında neler oluyor?",
        "Sen olmadan geçen her saniye eksik günaydın! Bugün nasıl dolduracaksın zamanını?",
        "Aşkımızın ışığında yeni bir gün başlıyor. Bu özel günde neler yapıyorsun?",
        "Sen benim için güneşten daha parlaksın. Bugün ne yaparak parıldayacaksın?"
    ],

    // Sevimli mesajlar
    cute: [
        "Minik kalbimdeki dev aşk sana günaydın diyor. Bugün neler yapacaksın tatlım?",
        "Sabah kahvesi gibi, sen de beni uyandırıyorsun. Bugün planların neler?",
        "Bugün seni düşünerek başlıyorum güne. Sen bugün nelerle meşgul olacaksın?",
        "Yüzündeki gülümseme benim güneşim. Bu güneşli günde neler yapacaksın?",
        "Seninle olmak hayatımın en güzel macerası. Bugün hangi maceralara atılacaksın?",
        "Kalbimdeki en tatlı yerindesin. Bugün ne yapacaksın canım?",
        "Sen benim şanslı yıldızımsın. Bu şanslı günde neler planlıyorsun?",
        "Aşkın büyüsüyle günaydın büyücüm! Bugün hangi büyüler yapacaksın?"
    ],

    // Motivasyon mesajları
    motivational: [
        "Bugün harika şeyler yapacaksın, buna inanıyorum! Hangi harika şeylerle başlayacaksın?",
        "Sen güçlüsün, sen muhteşemsin! Günaydın canım. Bugün bu gücünle neler başaracaksın?",
        "Hayallerinin peşinden koş, ben arkandayım! Bugün hangi hayallerine yaklaşacaksın?",
        "Bu gün senin günün, parlayacaksın! Bugün nasıl parlayacağını merak ediyorum?",
        "Engel tanımayan gücün beni büyülüyor. Bugün bu güçle neler yapacaksın?",
        "Sen yaparsın, sen başarırsın! İnanıyorum sana. Bugün neyi başarmayı hedefliyorsun?",
        "Bugün yeni başarıların günü olsun! Hangi başarıları elde etmeyi planlıyorsun?",
        "Kendine inan, çünkü ben sana inanıyorum! Bugün ne yaparak kendini kanıtlayacaksın?"
    ],

    // Hafta sonu mesajları
    weekend: [
        "Hafta sonu keyfi başlasın! Günaydın tatlım. Bugün nasıl eğleneceksin?",
        "Dinlenme zamanı, huzurlu bir gün geçir. Bugün nasıl dinlenmeyi planlıyorsun?",
        "Hafta sonu planların neler acaba? Bugün hangi güzel şeyler yapacaksın?",
        "Rahatlamaya hak ettin! Güzel bir gün olsun. Bugün kendini nasıl şımartacaksın?",
        "Hafta sonu tatili başladı! Bugün nasıl değerlendirmeyi planlıyorsun?",
        "Tembellik zamanı! Bugün nasıl tembellik edeceksin canım?",
        "Bugün sadece senin günün olsun! Bu özel günü nasıl geçireceksin?",
        "Hafta sonu huzuru sana yakışıyor. Bugün huzurunu nasıl bulacaksın?"
    ],

    // Özel günler için mesajlar
    special: {
        // Pazartesi motivasyonu
        monday: [
            "Yeni hafta, yeni fırsatlar! Günaydın savaşçım. Bu hafta hangi fırsatları değerlendirmeyi planlıyorsun?",
            "Pazartesi blues'una yenilme! Sen güçlüsün. Bugün güçlü başlangıç için neler yapacaksın?",
            "Hafta senin ellerinde şekillenecek! Bugün hangi şekli vermeye başlayacaksın?"
        ],
        
        // Cuma sevinci
        friday: [
            "Cuma geldi! Hafta sonu yaklaşıyor. Bugün hangi son işleri halledeceksin?",
            "Son mesai! Biraz daha dayanma canım. Bugün işleri nasıl toparlamayı planlıyorsun?",
            "Hafta sonu planları yapmaya ne dersin? Bugün planlarını netleştirmeyi düşünüyor musun?"
        ],

        // Yağmurlu günler
        rainy: [
            "Yağmur bile senin kadar güzel değil. Bu yağmurlu günde içeride neler yapacaksın?",
            "Bulutlu hava, sen mutluluk güneşisin. Bugün mutluluğunu nasıl yayacaksın?",
            "İçeriden sıcak bir kahve nasıl olur? Bugün sıcak içeceklerle neler yapıyorsun?"
        ]
    },

    // Test mesajları
    test: [
        "Bu bir test mesajıdır. Bot çalışıyor! Test için bugün başka neler deneyeceksin?",
        "Test başarılı! WhatsApp bağlantısı aktif. Bugün sistemle başka neler yapmayı planlıyorsun?",
        "Sistem kontrolü tamamlandı. Bugün hangi kontrolleri sen yapacaksın?"
    ],

    // Hata mesajları
    error: [
        "Üzgünüm, mesaj gönderilemedi. Tekrar deneyeceğim. Sen bugün ne yapıyorsun?",
        "Teknik bir sorun yaşandı, yakında düzeltilecek. Bugün teknik işlerinle nasıl ilgileniyorsun?",
        "Bot geçici olarak çevrimdışı, yakında döneceğim. Sen bugün hangi işlerle meşgulsün?"
    ]
};

/**
 * Rastgele mesaj seç
 * @param {string} category - Mesaj kategorisi
 * @param {object} options - Ek seçenekler
 * @returns {string} Seçilen mesaj
 */
function getRandomMessage(category = 'morning', options = {}) {
    const { maxLength = 1000 } = options;
    
    let messageArray = messages[category];
    
    // Kategori bulunamazsa varsayılan kategoriye dön
    if (!messageArray || !Array.isArray(messageArray)) {
        messageArray = messages.morning;
    }
    
    let selectedMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
    
    // Uzunluk kontrolü
    if (selectedMessage.length > maxLength) {
        selectedMessage = selectedMessage.substring(0, maxLength - 3) + '...';
    }
    
    return selectedMessage;
}

/**
 * Güne göre mesaj kategorisi belirle
 * @returns {string} Mesaj kategorisi
 */
function getTodayCategory() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
    const hour = today.getHours();
    
    // Hafta sonu kontrolü
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'weekend';
    }
    
    // Pazartesi motivasyonu
    if (dayOfWeek === 1) {
        return 'motivational';
    }
    
    // Cuma sevinci
    if (dayOfWeek === 5) {
        return 'cute';
    }
    
    // Öğleden sonra farklı ton
    if (hour >= 12) {
        return 'romantic';
    }
    
    // Varsayılan: sabah mesajları
    return 'morning';
}

/**
 * Kişiselleştirilmiş mesaj oluştur
 * @param {string} contactName - Kişi adı
 * @param {object} options - Ek seçenekler
 * @returns {string} Kişiselleştirilmiş mesaj
 */
function getPersonalizedMessage(contactName, options = {}) {
    const category = getTodayCategory();
    let message = getRandomMessage(category, options);
    
    // İsim ekleme (isteğe bağlı)
    if (options.includeName && contactName && contactName !== 'SEVGILI_ADI') {
        // Mesajda "aşkım", "canım" vs. varsa isim ekleme
        if (!message.includes('aşkım') && !message.includes('canım') && !message.includes('sevgilim')) {
            message += ` ${contactName}`;
        }
    }
    
    return message;
}

module.exports = {
    messages,
    getRandomMessage,
    getTodayCategory,
    getPersonalizedMessage
};