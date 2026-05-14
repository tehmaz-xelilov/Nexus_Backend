// ==============================================
// Fayl: config/gemini.config.js
// Təsvir: Google Gemini API konfiqurasiyası.
// ==============================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

// API açarını .env-dən al
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

if (!apiKey) {
    console.error('⚠️  GEMINI_API_KEY tapılmadı! .env faylını yoxlayın.');
    // Development modunda xəbərdarlıq et, amma server-i çökdürmə
}

// Gemini client-ini yarat
const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

// Model konfiqurasiyası
const modelConfig = {
    model: modelName,
    generationConfig: {
        temperature: 0.7,        // Kreativlik səviyyəsi (0 = dəqiq, 1 = kreativ)
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,   // Maksimum cavab uzunluğu
    }
};

/**
 * Gemini modelini qaytarır.
 * @returns {Object} Gemini model instance
 */
function getModel() {
    return genAI.getGenerativeModel(modelConfig);
}

module.exports = { getModel, modelName };