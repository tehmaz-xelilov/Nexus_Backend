// ==============================================
// Fayl: routes/business.routes.js
// Təsvir: Biznes Panel endpointləri.
//         Frontend: business.html
//         Kart 1: "Rəy Cavablayıcı" -> 
//           POST /api/business/review-reply
//         Kart 2: "SMM Kontent Planlayıcı" -> 
//           POST /api/business/smm-ideas
// ==============================================

const express = require('express');
const router = express.Router();
const { generateContent, analyzeSentiment } = require('../services/ai.service');
const { 
    businessReviewReplyPrompt, 
    businessSmmIdeasPrompt 
} = require('../utils/prompt.templates');
const { businessLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/business/review-reply
 * Body: { review: string }
 * 
 * Müştəri rəyini analiz edib, sentimentə uyğun cavab hazırlayır.
 */
router.post('/review-reply', businessLimiter, async (req, res, next) => {
    try {
        const { review } = req.body;

        if (!review || review.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Zəhmət olmasa ən azı 10 simvoldan ibarət rəy daxil edin.',
                errorCode: 'REVIEW_TOO_SHORT'
            });
        }

        // Sentiment analizi
        const sentiment = analyzeSentiment(review);
        console.log(`💬 [Biznes] Rəy sentimenti: ${sentiment}`);

        // Prompt hazırla
        const prompt = businessReviewReplyPrompt(review, sentiment);

        // Gemini-yə göndər
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
                reply: result.text,
                sentiment: sentiment,
                originalReview: review
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/business/smm-ideas
 * Body: { niche: string }
 * 
 * Biznes növünə görə SMM kontent ideyaları təqdim edir.
 */
router.post('/smm-ideas', businessLimiter, async (req, res, next) => {
    try {
        const { niche } = req.body;

        const validNiches = ['restoran', 'geyim', 'texnika', 'gozellik', 'idman'];
        const businessNiche = validNiches.includes(niche) ? niche : 'restoran';

        console.log(`📱 [SMM] Kontent ideyaları: ${businessNiche}`);

        const prompt = businessSmmIdeasPrompt(businessNiche);
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
                niche: businessNiche,
                ideas: result.text
            }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;