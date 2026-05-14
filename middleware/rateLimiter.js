// ==============================================
// Fayl: middleware/rateLimiter.js
// Təsvir: Rate limiting - Gemini Free API
//         limitlərini aşmamaq üçün.
// ==============================================

const rateLimit = require('express-rate-limit');

// Ümumi API limiti (bütün endpointlər üçün)
const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dəqiqə
    max: process.env.RATE_LIMIT_PER_MINUTE || 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Sorğu limitini keçdiniz. Zəhmət olmasa bir dəqiqə gözləyin.',
        errorCode: 'RATE_LIMIT_EXCEEDED',
        retryAfter: '60 saniyə'
    }
});

// Akademik endpoint üçün xüsusi limit (daha böyük mətnlər işləndiyi üçün)
const academicLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Akademik sorğu limitini keçdiniz. Konspekt hazırlamaq üçün gözləyin.',
        errorCode: 'ACADEMIC_RATE_LIMIT'
    }
});

// Biznes endpointləri üçün limit
const businessLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Biznes sorğu limitini keçdiniz. Bir dəqiqə gözləyin.',
        errorCode: 'BUSINESS_RATE_LIMIT'
    }
});

// Professional endpointlər üçün limit
const professionalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Professional sorğu limitini keçdiniz. Bir dəqiqə gözləyin.',
        errorCode: 'PROFESSIONAL_RATE_LIMIT'
    }
});

module.exports = {
    generalLimiter,
    academicLimiter,
    businessLimiter,
    professionalLimiter
};