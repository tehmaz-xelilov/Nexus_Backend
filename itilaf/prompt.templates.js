// ==============================================
// Fayl: utils/prompt.templates.js
// Təsvir: Gemini API üçün Azərbaycan dilində
//         prompt şablonları. Prompt engineering
//         məntiqi burada cəmlənib.
// ==============================================

/**
 * AKADEMİK - Mühazirə Konspekti
 * Frontend: academic.html -> "Mühazirəni Konspekt Et" formu
 */
function academicSummarizePrompt(text, type) {
    const typeMap = {
        summarize: 'konspekt',
        essay: 'esse',
        research: 'tədqiqat planı'
    };
    const taskName = typeMap[type] || 'konspekt';

    return `
Sən professional Azərbaycan dili müəllimisən. Sənin vəzifən aşağıdakı mətni oxuyub, 
peşəkar bir ${taskName} hazırlamaqdır.

QAYDALAR:
1. Cavabı YALNIZ Azərbaycan dilində yaz.
2. Mətni analiz et və əsas fikirləri ayır.
3. Nəticəni "bullet point" formatında təqdim et.
4. Hər bənd qısa, anlaşıqlı və məlumatlandırıcı olsun.
5. Girişdə mətnin əsas mövzusunu 1 cümlə ilə ümumiləşdir.
6. Ən vacib məlumatları qalın hərflərlə vurğula (** **).
7. Sonda 1-2 cümləlik nəticə çıxar.

MƏTN:
"""
${text}
"""

İndi bu mətnin ${taskName}ini hazırla:
`;
}

/**
 * BİZNES - Rəy Cavabı
 * Frontend: business.html -> "Rəy Cavablayıcı" kartı
 */
function businessReviewReplyPrompt(review, sentiment) {
    const toneMap = {
        positive: 'minnətdar və həvəsləndirici',
        negative: 'üzrxah və problemin həllinə yönəlmiş',
        neutral: 'nəzakətli və təşəkkür dolu'
    };
    const tone = toneMap[sentiment] || 'professional';

    return `
Sən Azərbaycanda fəaliyyət göstərən bir biznesin müştəri xidmətləri mütəxəssisisən.
Aşağıdakı müştəri rəyinə ${tone} tonda, Azərbaycan dilində cavab yazmalısan.

QAYDALAR:
1. Cavabı YALNIZ Azərbaycan dilində yaz.
2. Müştəriyə adı ilə deyil, "Hörmətli müştəri" deyə müraciət et.
3. Müsbət rəyə: təşəkkür et, gələcək səfərə dəvət et.
4. Mənfi rəyə: üzr istə, problemi həll edəcəyini bildir, əlaqə məlumatı ver.
5. Neytral rəyə: təşəkkür et, xidməti yaxşılaşdıracağını qeyd et.
6. Cavab 3-4 cümlədən çox olmasın, emoji istifadə etmə (emoji əvəzinə sözlərlə ifadə et).
7. Peşəkar və mehriban ol.

MÜŞTƏRİ RƏYİ:
"""
${review}
"""

Cavabını yaz:
`;
}

/**
 * BİZNES - SMM İdeyaları
 * Frontend: business.html -> "SMM Kontent Planlayıcı" kartı
 */
function businessSmmIdeasPrompt(niche) {
    const nicheNames = {
        restoran: 'Restoran/Kafe',
        geyim: 'Geyim Mağazası',
        texnika: 'Texnika Mağazası',
        gozellik: 'Gözəllik Salonu',
        idman: 'İdman Zalı'
    };
    const businessName = nicheNames[niche] || 'Biznes';

    return `
Sən Azərbaycan bazarı üzrə sosial media mütəxəssisisən.
"${businessName}" üçün 1 həftəlik (5 ədəd) kontent ideyası hazırlamalısan.

QAYDALAR:
1. Cavabı YALNIZ Azərbaycan dilində yaz.
2. Hər ideya 1 cümlə olsun.
3. İdeyalar praktik, Azərbaycan auditoriyasına uyğun olsun.
4. Hər ideyanı nömrələ (1-dən 5-ə).
5. Hər ideya üçün qısa başlıq və hansı formatda (foto, video, hekayə) olduğunu qeyd et.
6. Müxtəlif kontent tipləri qarışdır: təşviq, məlumatlandırma, əyləncə, məhsul tanıtımı, müştəri ilə əlaqə.

İndi "${businessName}" üçün həftəlik kontent ideyalarını yaz:
`;
}

/**
 * PROFESSIONAL - CV Xülasə
 * Frontend: professional.html -> "CV Generator" -> Önizləmə
 */
function professionalCvSummaryPrompt(cvData) {
    const fullName = `${cvData.firstName || ''} ${cvData.lastName || ''}`.trim() || '[Ad Soyad]';
    const skills = cvData.skills || '[bacarıqlar qeyd edilməyib]';
    const experience = cvData.experience || '[təcrübə qeyd edilməyib]';
    const languages = cvData.languages || 'Azərbaycan';

    return `
Sən professional CV mütəxəssisisən. Aşağıdakı məlumatlara əsasən 
peşəkar bir CV xülasəsi (3-4 cümlə) yazmalısan.

QAYDALAR:
1. Cavabı YALNIZ Azərbaycan dilində yaz.
2. Şəxsin adını, əsas bacarıqlarını, təcrübəsini və dil bilgilərini vurğula.
3. Xülasə qısa, təsirli və professional olsun.
4. "Mən" sözü əvəzinə 3-cü şəxs və ya peşəkar üslub istifadə et.
5. Nəticəyönümlü və güclü sifətlər işlət.

ŞƏXSİ MƏLUMATLAR:
- Ad: ${fullName}
- Bacarıqlar: ${skills}
- İş Təcrübəsi: ${experience}
- Dillər: ${languages}

Professional xülasəni yaz:
`;
}

/**
 * PROFESSIONAL - LinkedIn Analizi
 * Frontend: professional.html -> "LinkedIn Analiz" tabı
 */
function professionalLinkedInPrompt(profileUrl) {
    return `
Sən LinkedIn profil analizi üzrə ekspertsən. Aşağıdakı profil linkini analiz etməlisən.
(Əgər profilə baxa bilmirsənsə, ümumi tövsiyələr ver).

QAYDALAR:
1. Cavabı YALNIZ Azərbaycan dilində yaz.
2. Profil optimallaşdırması üçün 5-7 tövsiyə ver.
3. Hər tövsiyəni nömrələ.
4. Tövsiyələr praktik, LinkedIn alqoritminə uyğun olsun.
5. Azərbaycan bazarı və beynəlxalq standartları nəzərə al.
6. Cavabın sonunda qısa ümumi qiymətləndirmə ver (məs: Profil tamlığı təxmini 70%).

LINKEDIN PROFİL LİNKİ:
"""
${profileUrl}
"""

Analiz və tövsiyələri yaz:
`;
}

module.exports = {
    academicSummarizePrompt,
    businessReviewReplyPrompt,
    businessSmmIdeasPrompt,
    professionalCvSummaryPrompt,
    professionalLinkedInPrompt
};