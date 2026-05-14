// ==============================================
// Fayl: middleware/auth.prototype.js
// Təsvir: Gələcək autentifikasiya sistemi üçün
//         prototip struktur. Hal-hazırda bütün
//         sorğulara icazə verir.
//         Gələcəkdə JWT və ya API Key yoxlanışı
//         əlavə olunacaq.
// ==============================================

const fs = require('fs');
const path = require('path');

// Mock istifadəçi məlumatları (JSON fayldan)
const usersPath = path.join(__dirname, '..', 'data', 'users.mock.json');

function loadUsers() {
    try {
        const data = fs.readFileSync(usersPath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

/**
 * Prototip auth middleware.
 * Hal-hazırda sadəcə sorğuya davam etməyə icazə verir.
 * Gələcəkdə:
 * - Authorization header-dən token çıxaracaq
 * - Token-i JWT ilə doğrulayacaq
 * - İstifadəçi rolunu yoxlayacaq (tələbə/biznes sahibi/admin)
 */
function authPrototype(req, res, next) {
    // Gələcək implementasiya üçün yer
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) return res.status(401).json({ message: 'Token tələb olunur.' });
    
    // İstifadəçini tap
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    
    // Hal-hazırda: bütün sorğulara icazə
    req.user = {
        id: 'guest',
        role: 'anonymous',
        name: 'Qonaq İstifadəçi'
    };
    
    next();
}

/**
 * Rol əsaslı giriş məhdudiyyəti.
 * @param {string[]} roles - İcazə verilən rollar
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Giriş tələb olunur.',
                errorCode: 'AUTH_REQUIRED'
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bu əməliyyat üçün icazəniz yoxdur.',
                errorCode: 'INSUFFICIENT_PERMISSIONS'
            });
        }
        
        next();
    };
}

module.exports = { authPrototype, requireRole };