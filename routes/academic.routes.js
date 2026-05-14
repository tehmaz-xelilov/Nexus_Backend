// ==============================================
// Fayl: routes/academic.routes.js
// Təsvir: Akademik Köməkçi endpointi.
//         Frontend: academic.html
//         Form: "Mühazirəni Konspekt Et" -> 
//         POST /api/academic/summarize
// ==============================================

const express = require('express');
const router = express.Router();
const { generateContent } = require('../services/ai.service');
const { academicSummarizePrompt } = require('../utils/prompt.templates');
const { academicLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/academic/summarize
 * Body: { text: string, type: 'summarize' | 'essay' | 'research' }
 * 
 * Frontend-dən gələn uzun mətni Gemini-yə göndərib
 * konspekt/esse/tədqiqat planı şəklində qaytarır.
 */
router.post('/summarize', academicLimiter, async (req, res, next) => {
    try {
        const { text, type } = req.body;

        // Validasiya
        if (!text || text.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: 'Zəhmət olmasa ən azı 50 simvoldan ibarət mətn daxil edin.',
                errorCode: 'TEXT_TOO_SHORT'
            });
        }

        if (text.length > 10000) {
            return res.status(400).json({
                success: false,
                message: 'Mətn çox uzundur. Maksimum 10.000 simvol daxil edə bilərsiniz.',
                errorCode: 'TEXT_TOO_LONG'
            });
        }

        const validTypes = ['summarize', 'essay', 'research'];
        const taskType = validTypes.includes(type) ? type : 'summarize';

        console.log(`📚 [Akademik] ${taskType} sorğusu. Mətn uzunluğu: ${text.length}`);

        // Prompt hazırla
        const prompt = academicSummarizePrompt(text, taskType);

        // Gemini-yə göndər
        const result = await generateContent(prompt);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error,
                errorCode: 'AI_PROCESSING_ERROR'
            });
        }

        // Uğurlu cavab
        res.json({
            success: true,
            data: {
                type: taskType,
                result: result.text,
                originalLength: text.length,
                summaryLength: result.text.length
            }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;