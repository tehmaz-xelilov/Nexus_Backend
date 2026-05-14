// ==============================================
// Fayl: server.js
// Təsvir: Əsas server konfiqurasiyası,
//         middleware, route birləşdirmə.
// ==============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Middleware
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

// Routes
const academicRoutes = require('./routes/academic.routes');
const businessRoutes = require('./routes/business.routes');
const professionalRoutes = require('./routes/professional.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// Təhlükəsizlik
app.use(helmet());

// CORS - Yalnız Frontend-dən sorğulara icazə
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Logging (development üçün)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// JSON body parser
app.use(express.json({ limit: '5mb' }));

// Rate Limiting (ümumi)
app.use('/api', generalLimiter);

// ==================== ROUTES ====================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Nexus AI API-yə xoş gəlmisiniz!',
        version: '1.0.0',
        endpoints: {
            academic: '/api/academic/summarize',
            business: {
                review: '/api/business/review-reply',
                smm: '/api/business/smm-ideas'
            },
            professional: {
                cv: '/api/professional/cv-summary',
                linkedin: '/api/professional/linkedin-analysis'
            }
        }
    });
});

// API Routes
app.use('/api/academic', academicRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/professional', professionalRoutes);

// ==================== ERROR HANDLING ====================

// 404 - Tapılmadı
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Axtardığınız səhifə tapılmadı.',
        errorCode: 'ROUTE_NOT_FOUND'
    });
});

// Qlobal xəta idarəçisi
app.use(errorHandler);

// ==================== SERVER START ====================

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║       Nexus AI Backend Server       ║
║   Status:  🟢 Aktiv                 ║
║   Port:    ${PORT}                     ║
║   Mode:    ${process.env.NODE_ENV || 'development'}                 ║
║   API:     http://localhost:${PORT}/api ║
╚══════════════════════════════════════╝
    `);
});

module.exports = app; // Test üçün export