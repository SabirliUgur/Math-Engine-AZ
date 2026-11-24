/**
 * i18n Translation Engine for Math Engine AZ (v2.5.0)
 * Zero-dependency bilingual support: Azerbaijani ('az') & English ('en')
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.I18n = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const STORAGE_KEY = 'math_engine_az_lang';

    const TRANSLATIONS = {
        az: {
            // Brand & Navigation
            brandTitle: "Math Engine AZ",
            tabCalculator: "Kalkulyator",
            tabGeometry: "Həndəsə",
            tabAlgebra: "Cəbr",
            tabAnalysis: "Analiz",
            tabStatistics: "Statistika",
            tabSettings: "Parametrlər",

            // Sidebar History
            historyTitle: "Tarixçə",
            historyExport: "İxrac (.json)",
            historyClear: "Təmizlə",
            historyEmpty: "Hələ hesablama yoxdur",
            historyInsertTitle: "Klikləyin: Nəticəni daxil edin",

            // Calculator
            modeBesit: "Bəsit",
            modeElmi: "Elmi",
            engineTag: "F(X) · ENGINE",
            angleDegree: "DEG",
            angleRadian: "RAD",
            copyResult: "Nəticəni kopyala",
            copiedToast: "Kopyalandı!",

            // Solution Steps & Visual Card
            solverTitle: "Həll Addımları",
            solverSubtitle: "Addım-addım riyazi izahat",
            visualTitle: "Vizual Model və Qrafik",
            visualSubtitle: "Koordinat müstəvisi · 2D",
            visualGraphSubtitle: "f(x) qrafiki · 2D",
            solverEmptyTitle: "Riyazi ifadə daxil edin",
            solverEmptyDesc: "Kalkulyatorda ədəd və ya əməliyyat daxil etdikdə, burada ətraflı addım-addım həll və alternativ formlar göstəriləcək.",
            step1Title: "1. İlkin ifadə və struktur",
            step2Title: "2. Qaydalar və aralıq hesablama",
            step3Title: "3. Yekun nəticə və sadələşdirmə",
            altFormsTitle: "Alternativ Formlar",
            fractionForm: "Düzgün/Qeyri-düzgün kəsr",
            mixedForm: "Qarışıq kəsr",
            decimalForm: "Onluq kəsr",
            approxDecimal: "Təqribi onluq",
            zoomIn: "Yaxınlaşdır",
            zoomOut: "Uzaqlaşdır",
            zoomReset: "Sıfırla",
            visualBadgeGraph: "f(x) qrafiki aktivdir",
            visualBadgeIdle: "Funksiyanı daxil edin və ya əməliyyatı seçin",

            // General & Common Labels
            stepWord: "Addım",
            errorGeneric: "Xəta",
            errorBadge: "Xəta",

            // Settings Hub
            settingsTitle: "Parametrlər",
            settingsHeading: "⚙️ Parametrlər",
            settingsAppearance: "Görünüş və Tema",
            settingThemeTitle: "Görünüş və Tema",
            settingThemeDesc: "Açıq, tünd və ya sistem temasını seçin",
            themeLight: "Aydınlıq",
            themeDark: "Qaranlıq",
            themeAuto: "Avtomatik",
            themeAutoNote: "Sisteminizin qaranlıq/işıqlı rejiminə avtomatik uyğunlaşır",
            settingsLanguage: "Dil (Language)",
            settingLangTitle: "İnterfeys Dili",
            settingLangDesc: "Tətbiqin əsas dilini təyin edin",
            langAz: "Azərbaycan",
            langEn: "English",
            settingsHaptic: "Düymə Vibrasiyası (Haptic)",
            settingHapticTitle: "Düymə Vibrasiyası",
            settingHapticDesc: "Kalkulyator düymələrinə toxunduqda yüngül haptik əks-əlaqə",
            settingHapticNote: "Vibrasiya dəstəklənən mobil brauzerlərdə (Android Chrome, Samsung Internet) işləyir, masaüstü və iOS Safari cihazlarında nəzərə alınmır.",
            hapticActive: "Aktiv",
            hapticEnabled: "Aktiv",
            hapticDisabled: "Deaktiv",
            hapticNote: "Vibrasiya dəstəklənən mobil brauzerlərdə (Android Chrome, Samsung Internet) işləyir, masaüstü və iOS Safari cihazlarında nəzərə alınmır.",
            versionInfo: "Versiya 2.5.0 · Core Precision & Offline Engine",

            // Geometry
            secGeoTitle: "Həndəsi Hesablamalar",
            geoHeading: "📐 Həndəsi Hesablamalar",
            geoSelectPrompt: "— Fiqur seçin —",
            geoPlaneShapes: "Müstəvi Fiqurlar",
            geoSolidShapes: "Fəza Fiqurları",
            geoCircle: "Dairə",
            geoSquare: "Kvadrat",
            geoRectangle: "Düzbucaqlı",
            geoTriangle: "Üçbucaq",
            geoTrapezoid: "Trapesiya",
            geoCube: "Kub",
            geoCylinder: "Silindr",
            geoSphere: "Kürə",
            geoCone: "Konus",
            geoSymbols: "Simvollar:",
            btnCalculate: "Hesabla",

            // Algebra
            secAlgebraTitle: "Cəbr və Tənliklər",
            algebraHeading: "✖️ Cəbr və Tənliklər",
            subTabQuadratic: "Kvadrat tənlik",
            subTabLinear2: "2 məchullu",
            subTabLinear3: "3 məchullu",
            subTabPercentage: "Faiz",
            subTabSequence: "Silsilə",
            btnSolve: "Həll et",

            // Calculus / Analysis
            secAnalysisTitle: "Riyazi Analiz",
            analysisHeading: "📈 Riyazi Analiz",
            subTabDerivative: "Törəmə",
            subTabIntegral: "İnteqral",
            subTabGraph: "Qrafik",
            btnFindDeriv: "Törəməni tap",
            btnCalcInt: "İnteqralı hesabla",
            btnPlot: "Qrafiki çək",

            // Statistics
            secStatsTitle: "Ehtimal, Statistika və Matrislər",
            statsHeading: "🎲 Ehtimal, Statistika və Matrislər",
            subTabStats: "Statistika",
            subTabProbability: "Ehtimal",
            subTabMatrix: "Matrislər"
        },
        en: {
            // Brand & Navigation
            brandTitle: "Math Engine AZ",
            tabCalculator: "Calculator",
            tabGeometry: "Geometry",
            tabAlgebra: "Algebra",
            tabAnalysis: "Calculus",
            tabStatistics: "Statistics",
            tabSettings: "Settings",

            // Sidebar History
            historyTitle: "History",
            historyExport: "Export (.json)",
            historyClear: "Clear",
            historyEmpty: "No calculations yet",
            historyInsertTitle: "Click to insert result",

            // Calculator
            modeBesit: "Basic",
            modeElmi: "Scientific",
            engineTag: "F(X) · ENGINE",
            angleDegree: "DEG",
            angleRadian: "RAD",
            copyResult: "Copy result",
            copiedToast: "Copied!",

            // Solution Steps & Visual Card
            solverTitle: "Solution Steps",
            solverSubtitle: "Step-by-step mathematical explanation",
            visualTitle: "Visual Model & Graph",
            visualSubtitle: "Coordinate plane · 2D",
            visualGraphSubtitle: "f(x) plot · 2D",
            solverEmptyTitle: "Enter an expression",
            solverEmptyDesc: "Enter numbers or operations in the calculator to see detailed step-by-step solutions and alternative representations.",
            step1Title: "1. Initial expression & structure",
            step2Title: "2. Rules & intermediate calculation",
            step3Title: "3. Final result & simplification",
            altFormsTitle: "Alternative Forms",
            fractionForm: "Proper/Improper fraction",
            mixedForm: "Mixed number",
            decimalForm: "Decimal",
            approxDecimal: "Approximate decimal",
            zoomIn: "Zoom In",
            zoomOut: "Zoom Out",
            zoomReset: "Reset Zoom",
            visualBadgeGraph: "f(x) plot is active",
            visualBadgeIdle: "Enter a function or select an operation",

            // General & Common Labels
            stepWord: "Step",
            errorGeneric: "Error",
            errorBadge: "Error",

            // Settings Hub
            settingsTitle: "Settings",
            settingsHeading: "⚙️ Settings",
            settingsAppearance: "Appearance & Theme",
            settingThemeTitle: "Appearance & Theme",
            settingThemeDesc: "Choose light, dark, or system theme",
            themeLight: "Light",
            themeDark: "Dark",
            themeAuto: "Auto",
            themeAutoNote: "Automatically matches your device light/dark mode",
            settingsLanguage: "Language",
            settingLangTitle: "Interface Language",
            settingLangDesc: "Set the primary application language",
            langAz: "Azerbaijani",
            langEn: "English",
            settingsHaptic: "Keypad Haptic Vibration",
            settingHapticTitle: "Keypad Vibration",
            settingHapticDesc: "Subtle haptic vibration feedback when tapping keys",
            settingHapticNote: "Haptic feedback works on supported mobile browsers (Android Chrome, Samsung Internet) and is safely ignored on desktop and iOS Safari.",
            hapticActive: "Enabled",
            hapticEnabled: "Enabled",
            hapticDisabled: "Disabled",
            hapticNote: "Haptic feedback works on supported mobile browsers (Android Chrome, Samsung Internet) and is safely ignored on desktop and iOS Safari.",
            versionInfo: "Version 2.5.0 · Core Precision & Offline Engine",

            // Geometry
            secGeoTitle: "Geometric Calculations",
            geoHeading: "📐 Geometric Calculations",
            geoSelectPrompt: "— Select shape —",
            geoPlaneShapes: "2D Plane Shapes",
            geoSolidShapes: "3D Solid Shapes",
            geoCircle: "Circle",
            geoSquare: "Square",
            geoRectangle: "Rectangle",
            geoTriangle: "Triangle",
            geoTrapezoid: "Trapezoid",
            geoCube: "Cube",
            geoCylinder: "Cylinder",
            geoSphere: "Sphere",
            geoCone: "Cone",
            geoSymbols: "Symbols:",
            btnCalculate: "Calculate",

            // Algebra
            secAlgebraTitle: "Algebra & Equations",
            algebraHeading: "✖️ Algebra & Equations",
            subTabQuadratic: "Quadratic equation",
            subTabLinear2: "2 variables",
            subTabLinear3: "3 variables",
            subTabPercentage: "Percentage",
            subTabSequence: "Sequences",
            btnSolve: "Solve",

            // Calculus / Analysis
            secAnalysisTitle: "Mathematical Analysis",
            analysisHeading: "📈 Mathematical Analysis",
            subTabDerivative: "Derivative",
            subTabIntegral: "Integral",
            subTabGraph: "Graph",
            btnFindDeriv: "Find derivative",
            btnCalcInt: "Calculate integral",
            btnPlot: "Plot graph",

            // Statistics
            secStatsTitle: "Probability, Statistics & Matrices",
            statsHeading: "🎲 Probability, Statistics & Matrices",
            subTabStats: "Statistics",
            subTabProbability: "Probability",
            subTabMatrix: "Matrices"
        }
    };

    let currentLang = 'az';

    function init() {
        const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved === 'en' || saved === 'az') {
            currentLang = saved;
        } else {
            currentLang = 'az';
        }
        if (typeof window !== 'undefined' && window.MathCore && typeof window.MathCore.setLanguage === 'function') {
            window.MathCore.setLanguage(currentLang);
        }
        applyLanguage(currentLang);
    }

    function t(key, fallback = '') {
        const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.az;
        return dict[key] || fallback || key;
    }

    function setLanguage(lang) {
        if (lang !== 'az' && lang !== 'en') return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        if (window.MathCore && typeof MathCore.setLanguage === 'function') {
            MathCore.setLanguage(lang);
        }
        applyLanguage(lang);

        // Notify listeners if any
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
            window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
        }
    }

    function getLanguage() {
        return currentLang;
    }

    function applyLanguage(lang) {
        if (typeof document === 'undefined') return;
        const dict = TRANSLATIONS[lang] || TRANSLATIONS.az;

        // Update document lang
        document.documentElement.lang = lang;

        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // Update elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (dict[key]) {
                el.title = dict[key];
            }
        });

        // Update elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.placeholder = dict[key];
            }
        });
    }

    return {
        init,
        t,
        setLanguage,
        getLanguage,
        applyLanguage,
        TRANSLATIONS
    };
}));
