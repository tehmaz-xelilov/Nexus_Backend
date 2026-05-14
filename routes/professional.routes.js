// ==============================================
// Fayl: routes/professional.routes.js
// Təsvir: Professional CV/LinkedIn endpointləri.
//         Frontend: professional.html
//         Tab 1: "CV Generator" -> 
//           POST /api/professional/cv-summary
//         Tab 2: "LinkedIn Analiz" -> 
//           POST /api/professional/linkedin-analysis
// ==============================================

const express = require('express');
const router = express.Router();
const { generateContent } = require('../services/ai.service');
const { 
    professionalCvSummaryPrompt, 
    professionalLinkedInPrompt 
} = require('../utils/prompt.templates');
const { professionalLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/professional/cv-summary
 * Body: { firstName, lastName, email, phone, experience, education, skills, languages }
 * 
 * CV məlumatlarını qəbul edib, peşəkar xülasə hazırlayır.
 */
router.post('/cv-summary', professionalLimiter, async (req, res, next) => {
    try {
        const cvData = {
            firstName: req.body.firstName || '',
            lastName: req.body.lastName || '',
            email: req.body.email || '',
            phone: req.body.phone || '',
            experience: req.body.experience || '',
            education: req.body.education || '',
            skills: req.body.skills || '',
            languages: req.body.languages || ''
        };

        // Validasiya
        if (!cvData.firstName.trim() || !cvData.email.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Zəhmət olmasa ən azı ad və email daxil edin.',
                errorCode: 'MISSING_REQUIRED_FIELDS'
            });
        }

        console.log(`📄 [CV] Xülasə hazırlanır: ${cvData.firstName} ${cvData.lastName}`);

        const prompt = professionalCvSummaryPrompt(cvData);
        const result = await generateContent(prompt);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error,
                errorCode: 'AI_PROCESSING_ERROR'
            });
        }

        res.json({
            success: true,
            data: {
                summary: result.text,
                profile: {
                    fullName: `${cvData.firstName} ${cvData.lastName}`.trim(),
                    email: cvData.email
                }
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/professional/linkedin-analysis
 * Body: { url: string }
 * 
 * LinkedIn profil linkini analiz edib tövsiyələr verir.
 */
router.post('/linkedin-analysis', professionalLimiter, async (req, res, next) => {
    try {
        const { url } = req.body;

        if (!url || !url.includes('linkedin.com')) {
            return res.status(400).json({
                success: false,
                message: 'Zəhmət olmasa düzgün LinkedIn profil linki daxil edin.',
                errorCode: 'INVALID_URL'
            });
        }

        console.log(`🔗 [LinkedIn] Analiz: ${url}`);

        const prompt = professionalLinkedInPrompt(url);
        const result = await generateContent(prompt);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error,
                errorCode: 'AI_PROCESSING_ERROR'
            });
        }

        res.json({
            success: true,
            data: {
                analysis: result.text,
                analyzedUrl: url
            }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;