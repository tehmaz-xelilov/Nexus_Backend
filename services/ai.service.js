// ==============================================
// Fayl: services/ai.service.js
// Təsvir: Gemini API ilə əlaqə quran əsas servis.
//         Prompt göndərib, cavabı təmizləyib qaytarır.
// ==============================================

const { getModel } = require('../config/gemini.config');

/**
 * Gemini API-yə prompt göndərir və cavabı qaytarır.
 * @param {string} prompt - Gemini-yə göndəriləcək tam prompt
 * @param {Object} options - Əlavə konfiqurasiya
 * @returns {Promise<Object>} { success: boolean, text: string, error?: string }
 */
async function generateContent(prompt, options = {}) {
    try {
        const model = getModel();
        
        // Gemini-yə sorğu göndər
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        // Cavab mətnini çıxar
        const text = response.text();
        
        if (!text || text.trim().length === 0) {
            throw new Error('Gemini boş cavab qaytardı.');
        }

        console.log(`✅ [Gemini] Cavab uzunluğu: ${text.length} simvol`);
        
        return {
            success: true,
            text: text.trim()
        };

    } catch (error) {
        console.error('❌ [Gemini] Xəta:', error.message);
        
        // Xətanın tipinə görə mesaj
        let userMessage = 'AI emalı zamanı xəta baş verdi.';
        
        if (error.message.includes('API key')) {
            userMessage = 'AI xidməti konfiqurasiyasında problem var. Administratorla əlaqə saxlayın.';
        } else if (error.message.includes('SAFETY')) {
            userMessage = 'Daxil etdiyiniz məzmun AI təhlükəsizlik filterlərindən keçmədi. Zəhmət olmasa mətni yoxlayın.';
        } else if (error.message.includes('quota') || error.message.includes('429')) {
            userMessage = 'AI sorğu limiti keçilib. Zəhmət olmasa bir dəqiqə gözləyin və yenidən cəhd edin.';
        } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
            userMessage = 'AI xidmətinə qoşulmaq mümkün olmadı. İnternet bağlantınızı yoxlayın.';
        }

        return {
            success: false,
            error: userMessage,
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        };
    }
}

/**
 * Sadə sentiment analizi (AI-ə göndərmədən, açar sözlərlə).
 * Frontend: business.html -> Rəy Cavablayıcı
 * @param {string} text - Müştəri rəyi
 * @returns {string} 'positive' | 'negative' | 'neutral'
 */
function analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    
    const positiveWords = [
        'əla', 'super', 'gözəl', 'mükəmməl', 'yaxşı', 'çox bəyəndim',
        'razıyam', 'məmnunam', 'təşəkkür', 'sağ olun', 'sevindim',
        'möhtəşəm', 'qəşəng', 'dadlı', 'sürətli', 'keyfiyyətli'
    ];
    
    const negativeWords = [
        'pis', 'bərbad', 'dəhşət', 'xəbərdarlıq', 'şikayət', 'məyus',
        'qəbuledilməz', 'keyfiyyətsiz', 'yavaş', 'problem', 'səhv',
        'iyrənc', 'qorxunc', 'kobud', 'laqeyd', 'narahatam'
    ];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveScore++;
    });
    
    negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeScore++;
    });
    
    if (negativeScore > positiveScore) return 'negative';
    if (positiveScore > negativeScore) return 'positive';
    return 'neutral';
}

module.exports = {
    generateContent,
    analyzeSentiment
};