// ==============================================
// Fayl: middleware/errorHandler.js
// Təsvir: Qlobal xəta idarəçisi.
//         Azərbaycan dilində professional mesajlar.
// ==============================================

/**
 * Qlobal xəta idarəçisi middleware.
 * Bütün 4 parametrli error handler-lər kimi işləyir.
 */
function errorHandler(err, req, res, next) {
    console.error('🚨 [Xəta]', err.stack || err.message);

    // Rate limit xətası (express-rate-limit-dən gələn)
    if (err.statusCode === 429) {
        return res.status(429).json({
            success: false,
            message: 'Çox sayda sorğu göndərdiniz. Zəhmət olmasa bir dəqiqə gözləyin.',
            errorCode: 'RATE_LIMIT_EXCEEDED'
        });
    }

    // JSON parse xətası
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Göndərilən məlumat formatı səhvdir. Zəhmət olmasa düzgün JSON göndərin.',
            errorCode: 'INVALID_JSON'
        });
    }

    // Ölçü limiti xətası
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Göndərilən məlumat çox böyükdür. Maksimum 5MB ölçüdə məlumat göndərə bilərsiniz.',
            errorCode: 'PAYLOAD_TOO_LARGE'
        });
    }

    // Default: server xətası
    res.status(err.statusCode || 500).json({
        success: false,
        message: 'Server daxilində xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.',
        errorCode: 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
}

module.exports = { errorHandler };