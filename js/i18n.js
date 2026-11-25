/**
 * i18n Translation Engine for Math Engine AZ (v3.4.0)
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
            menuTitle: "Menyu",
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
            angleModeTitle: "Bucaq vahidi: DEG / RAD",
            copyResult: "Nəticəni kopyala",
            copiedToast: "Kopyalandı!",

            // Navigation & Math Editor Toolbar
            navLeft: "Sol yuva (←)",
            navRight: "Sağ yuva (→)",
            btnFrac: "Kəsr (□/□)",
            btnMixedFrac: "Qarışıq kəsr (□ □/□)",
            btnPower: "Qüvvət (xⁿ)",
            btnSqrt: "Kök (√)",
            btnParens: "Mötərizə ( )",

            // Solution Steps & Visual Card
            solverTitle: "Həll Addımları",
            solverSubtitle: "Addım-addım riyazi izahat",
            visualTitle: "Vizual Model və Qrafik",
            visualSubtitle: "Koordinat müstəvisi · 2D",
            visualGraphSubtitle: "2D İnteraktiv Qrafik Müstəvisi",
            visualAlgebraSubtitle: "Funksiya və Tənliklər Müstəvisi",
            solverEmptyTitle: "Riyazi ifadə daxil edin",
            solverEmptyDesc: "Kalkulyatorda ədəd və ya əməliyyat daxil etdikdə, burada ətraflı addım-addım həll və alternativ formlar göstəriləcək.",
            showSubSteps: "Ətraflı addımları göstər",
            hideSubSteps: "Ətraflı addımları gizlət",
            substepsShow: "Ətraflı addımları göstər",
            substepsHide: "Ətraflı addımları gizlət",
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
            versionInfo: "Versiya 3.6.0 · Statistical Charts & Offline Interactive Guide",

            // Settings Right Info Card
            sysInfoTitle: "Sistem Məlumatı",
            sysInfoSubtitle: "PWA mühərriki və cihaz konfiqurasiyası",
            appVersionLabel: "Tətbiq Versiyası",
            appVersion: "Tətbiq Versiyası",
            appVersionVal: "v3.6.0 (Statistical Charts & Guide)",
            pwaCacheLabel: "Oflayn Keş Statusu",
            pwaCacheStatus: "Oflayn Keş Statusu",
            pwaCacheActive: "Aktiv (math-engine-az-v3.6.0)",
            guideBotTitle: "İnteraktiv Bələdçi",
            guideBotTour: "İnterfeys turu",
            guideBotSearchPlaceholder: "Formula və ya mövzu axtar (məs: konus, limit)...",
            shortcutsTitle: "Qısayol Düymələri",
            shortcutDigits: "Rəqəmlər",
            shortcutOps: "Əsas əməllər",
            shortcutExp: "Qüvvət (xⁿ)",
            shortcutParens: "Mötərizələr",
            shortcutEval: "Hesabla",
            shortcutClear: "Təmizlə",
            shortcutDel: "Atomik silmə",
            shortcutNav: "Yuva naviqasiyası",
            resetDefaults: "Ayarları sıfırla",
            resetDefaultsBtn: "Ayarları sıfırla",
            resetDefaultsDesc: "Bütün görünüş, dil və vibrasiya parametrlərini ilkin vəziyyətinə qaytarın",
            resetSuccess: "Ayarlar uğurla sıfırlandı!",

            // Visual Card Headings for Geometry, Statistics, etc.
            geoDiagramTitle: "2D Həndəsi Çertyoj",
            geoDiagramSubtitle: "Dinamik ölçülər, tərəflər və bucaqlar",
            statsChartTitle: "Statistik Paylanma Qrafiki",
            statsChartSubtitle: "Verilənlər sütunları və Ədədi Orta (x̄)",
            statsMeanLabel: "Ədədi orta (x̄)",

            // Geometry
            secGeoTitle: "Həndəsi Hesablamalar",
            geoHeading: "📐 Həndəsi Hesablamalar",
            geoSelectLabel: "Fiquru seçin:",
            geoModeLabel: "Hesablama üsulu:",
            geoSelectPrompt: "— Fiqur seçin —",
            geoPlaneShapes: "Müstəvi Fiqurlar",
            geoSolidShapes: "3D Fəza Fiqurları",
            geoCircle: "Dairə",
            geoSquare: "Kvadrat",
            geoRectangle: "Düzbucaqlı",
            geoTriangle: "Üçbucaq",
            geoTrapezoid: "Trapesiya",
            geoPolygon: "Düzgün Çoxbucaqlılar",
            geoCoordinate: "Koordinatlar Metodu",
            geoVector: "Müstəvi Vektorları",
            geoCube: "Kub",
            geoCuboid: "Düzbucaqlı Paralelepiped",
            geoCylinder: "Silindr",
            geoSphere: "Kürə",
            geoCone: "Konus",
            geoPyramid: "Düzgün Dördbucaqlı Piramida",
            geoFrustum: "Kəsik Konus",
            geoSymbols: "Simvollar:",
            geoInputPlaceholder: "Məs: 3, √3, 2√5, π/2",
            btnCalculate: "Hesabla",

            // Algebra
            secAlgebraTitle: "Cəbr və Tənliklər",
            algebraHeading: "✖️ Cəbr və Tənliklər",
            subTabQuadratic: "Kvadrat tənlik",
            subTabLinear2: "2 məchullu",
            subTabLinear3: "3 məchullu",
            subTabPercentage: "Faiz",
            subTabSequence: "Silsilə",
            subTabComplex: "Kompleks Ədədlər",
            subTabInequality: "Bərabərsizliklər",
            subTabGP: "Həndəsi Silsilə",
            algComplexTitle: "Kompleks Ədədlər: z₁ = a + bi, z₂ = c + di",
            algIneqTitle: "Kvadrat və Xətti Bərabərsizliklər",
            algIneqOpLabel: "İşarə:",
            algGPTitle: "Həndəsi Silsilə (bₙ, Sₙ, S)",
            algLinear2Title: "Xətti tənliklər sistemi (2 məchullu)",
            algLinear3Title: "Xətti tənliklər sistemi (3 məchullu)",
            algPctTitle: "Faiz Hesablamaları",
            pctFindPercent: "Ədədin faizini tap",
            pctWhatPercent: "Bir ədəd digərinin neçə faizidir?",
            pctFindWhole: "X ədədin Y%-dirsə, ədədi tap",
            pctIncrease: "Faizlə artır",
            pctDecrease: "Faizlə azalt",
            algSeqTitle: "Ədədi Silsilələr",
            seqArithmetic: "Ədədi silsilə",
            seqGeometric: "Həndəsi silsilə",
            btnSolve: "Həll et",

            // Calculus / Analysis
            secAnalysisTitle: "Riyazi Analiz",
            analysisHeading: "📈 Riyazi Analiz",
            subTabDerivative: "Törəmə",
            subTabIntegral: "İnteqral",
            subTabGraph: "Qrafik",
            subTabLimit: "Limit",
            calcDerivTitle: "Simvolik Törəmə Hesablama",
            calcDerivPlaceholder: "Məsələn: x^2 + 3*x + 1",
            calcIntTitle: "Müəyyən İnteqral (Simpson Qaydası)",
            calcIntPlaceholder: "Məsələn: x^2",
            calcIntLower: "a (alt hədd) =",
            calcIntUpper: "b (üst hədd) =",
            calcGraphTitle: "Funksiya Qrafiki Parametrləri",
            calcGraphPlaceholder: "Məsələn: x^2 - 4",
            calcGraphFunc1Label: "f(x) =",
            calcGraphFunc2Label: "g(x) (istəyə bağlı) =",
            calcGraphFunc2Placeholder: "Məsələn: x + 2 (ikinci funksiya)",
            calcGraphNote: "Qrafik sağ paneldə interaktiv olaraq nümayiş etdirilir.",
            graphRootsLabel: "Köklər (y = 0):",
            graphIntersectionsLabel: "Kəsişmə nöqtələri (f = g):",
            graphNoFeatures: "Görünən diapazonda tapılmadı",
            calcLimitTitle: "Funksiya Limiti Hesablama",
            calcLimitPlaceholder: "Məsələn: (x^2 - 4)/(x - 2)",
            calcLimitPointLabel: "x → a (yaxınlaşma nöqtəsi):",
            calcLimitPointPlaceholder: "Məs: 2, 0, pi/2, inf, -inf",
            calcLimitHint: "Ədəd (0, 2), ifadə (pi/2) və ya sonsuzluq (inf, +inf, -inf, ∞) daxil edin.",
            btnFindDeriv: "Törəməni tap",
            btnCalcInt: "İnteqralı hesabla",
            btnPlot: "Qrafiki çək",
            btnCalcLimit: "Limiti hesabla",
            limitLeftLabel: "Sol limit (x → a⁻):",
            limitRightLabel: "Sağ limit (x → a⁺):",
            limitTwoSidedLabel: "İkitərəfli limit:",
            limitDNE: "Mövcud deyil",
            limitUndefinedDomain: "Təyin olunmayıb",
            limitRemovableNote: "Aradan qaldırıla bilən kəsilmə (f(a) təyin olunmayıb və ya L-dən fərqlidir)",
            limitJumpNote: "Sıçrayışlı kəsilmə (sol limit sağ limitə bərabər deyil)",
            limitAsymptoteNote: "Sonsuz kəsilmə / şaquli asimptot",
            limitOneSidedNote: "Yalnız birtərəfli yaxınlaşma mövcuddur",

            // Statistics
            secStatsTitle: "Ehtimal, Statistika və Matrislər",
            statsHeading: "🎲 Ehtimal, Statistika və Matrislər",
            subTabStats: "Statistika",
            subTabProbability: "Ehtimal",
            subTabMatrix: "Matrislər",
            statsSubTitle: "Statistik Göstəricilər",
            statsDataLabel: "Ədədləri vergüllə ayırın:",
            statsDataPlaceholder: "Məsələn: 5, 10, 15, 20, 25",
            probTitle: "Permutasiya və Kombinasiya",
            matrixTitle: "Matris Əməliyyatları",
            matrixSizeLabel: "Ölçü:",
            matrixOpLabel: "Əməliyyat:",
            matrixOpAdd: "Toplama (A + B)",
            matrixOpSub: "Çıxma (A − B)",
            matrixOpMul: "Vurma (A × B)",
            matrixOpDet: "Determinant |A|",
            matrixALabel: "Matris A",
            matrixBLabel: "Matris B",

            // Number Theory & Combinatorics
            subTabNumberTheory: "Ədədlər və Kombinatorika",
            ntGcdLcmTitle: "ƏBOB və ƏKOB",
            ntGcdLcmInputLabel: "Ədədləri vergüllə ayırın:",
            ntGcdLcmPlaceholder: "Məsələn: 24, 36, 60",
            ntCombTitle: "Permutasiya, Aranjeman, Kombinezon",
            ntBtnPerm: "Pₙ = n!",
            ntBtnArr: "Aₙᵏ",
            ntBtnComb: "Cₙᵏ",
            ntGcdLabel: "ƏBOB:",
            ntLcmLabel: "ƏKOB:",
            ntPrimeFactorsLabel: "Sadə vuruqlara ayırma:",
            ntPermLabel: "Permutasiya (Pₙ):",
            ntArrLabel: "Aranjeman (Aₙᵏ):",
            ntCombLabel: "Kombinezon (Cₙᵏ):"
        },
        en: {
            // Brand & Navigation
            brandTitle: "Math Engine AZ",
            menuTitle: "Menu",
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
            angleModeTitle: "Angle unit: DEG / RAD",
            copyResult: "Copy result",
            copiedToast: "Copied!",

            // Navigation & Math Editor Toolbar
            navLeft: "Left slot (←)",
            navRight: "Right slot (→)",
            btnFrac: "Fraction (□/□)",
            btnMixedFrac: "Mixed fraction (□ □/□)",
            btnPower: "Exponent (xⁿ)",
            btnSqrt: "Square root (√)",
            btnParens: "Parentheses ( )",

            // Solution Steps & Visual Card
            solverTitle: "Solution Steps",
            solverSubtitle: "Step-by-step mathematical explanation",
            visualTitle: "Visual Model & Graph",
            visualSubtitle: "Coordinate plane · 2D",
            visualGraphSubtitle: "2D Interactive Coordinate Plane",
            visualAlgebraSubtitle: "Functions & Equations Plane",
            solverEmptyTitle: "Enter an expression",
            solverEmptyDesc: "Enter numbers or operations in the calculator to see detailed step-by-step solutions and alternative representations.",
            showSubSteps: "Show detailed steps",
            hideSubSteps: "Hide detailed steps",
            substepsShow: "Show detailed steps",
            substepsHide: "Hide detailed steps",
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
            versionInfo: "Version 3.6.0 · Statistical Charts & Offline Interactive Guide",

            // Settings Right Info Card
            sysInfoTitle: "System Information",
            sysInfoSubtitle: "PWA runtime and device configuration",
            appVersionLabel: "Application Version",
            appVersion: "Application Version",
            appVersionVal: "v3.6.0 (Statistical Charts & Guide)",
            pwaCacheLabel: "Offline Cache Status",
            pwaCacheStatus: "Offline Cache Status",
            pwaCacheActive: "Active (math-engine-az-v3.6.0)",
            guideBotTitle: "Interactive Guide",
            guideBotTour: "Quick Tour",
            guideBotSearchPlaceholder: "Search formula or topic (e.g. cone, limit)...",
            shortcutsTitle: "Keyboard Shortcuts",
            shortcutDigits: "Digits",
            shortcutOps: "Basic Operators",
            shortcutExp: "Exponent (xⁿ)",
            shortcutParens: "Parentheses",
            shortcutEval: "Evaluate",
            shortcutClear: "All Clear",
            shortcutDel: "Atomic Delete",
            shortcutNav: "Slot Navigation",
            resetDefaults: "Reset Defaults",
            resetDefaultsBtn: "Reset Defaults",
            resetDefaultsDesc: "Restore all appearance, language, and haptic preferences to defaults",
            resetSuccess: "Settings successfully restored to defaults!",

            // Visual Card Headings for Geometry, Statistics, etc.
            geoDiagramTitle: "2D Geometric Diagram",
            geoDiagramSubtitle: "Dynamic dimensions, sides & angles",
            statsChartTitle: "Statistical Distribution Chart",
            statsChartSubtitle: "Data bars and Mean Indicator (x̄)",
            statsMeanLabel: "Mean (x̄)",

            // Geometry
            secGeoTitle: "Geometric Calculations",
            geoHeading: "📐 Geometric Calculations",
            geoSelectLabel: "Select shape:",
            geoModeLabel: "Calculation mode:",
            geoSelectPrompt: "— Select shape —",
            geoPlaneShapes: "2D Plane Shapes",
            geoSolidShapes: "3D Solid Geometry",
            geoCircle: "Circle",
            geoSquare: "Square",
            geoRectangle: "Rectangle",
            geoTriangle: "Triangle",
            geoTrapezoid: "Trapezoid",
            geoPolygon: "Regular Polygons",
            geoCoordinate: "Coordinate Method",
            geoVector: "2D Plane Vectors",
            geoCube: "Cube",
            geoCuboid: "Rectangular Prism",
            geoCylinder: "Cylinder",
            geoSphere: "Sphere",
            geoCone: "Cone",
            geoPyramid: "Square Pyramid",
            geoFrustum: "Conical Frustum",
            geoSymbols: "Symbols:",
            geoInputPlaceholder: "Ex: 3, √3, 2√5, π/2",
            btnCalculate: "Calculate",

            // Algebra
            secAlgebraTitle: "Algebra & Equations",
            algebraHeading: "✖️ Algebra & Equations",
            subTabQuadratic: "Quadratic equation",
            subTabLinear2: "2 variables",
            subTabLinear3: "3 variables",
            subTabPercentage: "Percentage",
            subTabSequence: "Sequences",
            subTabComplex: "Complex Numbers",
            subTabInequality: "Inequalities",
            subTabGP: "Geometric Progression",
            algComplexTitle: "Complex Numbers: z₁ = a + bi, z₂ = c + di",
            algIneqTitle: "Quadratic & Linear Inequalities",
            algIneqOpLabel: "Sign:",
            algGPTitle: "Geometric Progression (bₙ, Sₙ, S)",
            algLinear2Title: "System of Linear Equations (2 variables)",
            algLinear3Title: "System of Linear Equations (3 variables)",
            algPctTitle: "Percentage Calculations",
            pctFindPercent: "Find percentage of a number",
            pctWhatPercent: "What percent is X of Y?",
            pctFindWhole: "Find whole if X is Y%",
            pctIncrease: "Increase by percentage",
            pctDecrease: "Decrease by percentage",
            algSeqTitle: "Number Sequences",
            seqArithmetic: "Arithmetic sequence",
            seqGeometric: "Geometric sequence",
            btnSolve: "Solve",

            // Calculus / Analysis
            secAnalysisTitle: "Mathematical Analysis",
            analysisHeading: "📈 Mathematical Analysis",
            subTabDerivative: "Derivative",
            subTabIntegral: "Integral",
            subTabGraph: "Graph",
            subTabLimit: "Limit",
            calcDerivTitle: "Symbolic Derivative",
            calcDerivPlaceholder: "Example: x^2 + 3*x + 1",
            calcIntTitle: "Definite Integral (Simpson's Rule)",
            calcIntPlaceholder: "Example: x^2",
            calcIntLower: "a (lower limit) =",
            calcIntUpper: "b (upper limit) =",
            calcGraphTitle: "Function Graph Parameters",
            calcGraphPlaceholder: "Example: x^2 - 4",
            calcGraphFunc1Label: "f(x) =",
            calcGraphFunc2Label: "g(x) (optional) =",
            calcGraphFunc2Placeholder: "Example: x + 2 (second function)",
            calcGraphNote: "The graph is displayed interactively in the right-hand panel.",
            graphRootsLabel: "Roots (y = 0):",
            graphIntersectionsLabel: "Intersections (f = g):",
            graphNoFeatures: "None in visible range",
            calcLimitTitle: "Function Limit Calculator",
            calcLimitPlaceholder: "Example: (x^2 - 4)/(x - 2)",
            calcLimitPointLabel: "x → a (approach point):",
            calcLimitPointPlaceholder: "Ex: 2, 0, pi/2, inf, -inf",
            calcLimitHint: "Enter a number (0, 2), expression (pi/2), or infinity (inf, +inf, -inf, ∞).",
            btnFindDeriv: "Find derivative",
            btnCalcInt: "Calculate integral",
            btnPlot: "Plot graph",
            btnCalcLimit: "Calculate limit",
            limitLeftLabel: "Left-hand limit (x → a⁻):",
            limitRightLabel: "Right-hand limit (x → a⁺):",
            limitTwoSidedLabel: "Two-sided limit:",
            limitDNE: "Does not exist",
            limitUndefinedDomain: "Undefined",
            limitRemovableNote: "Removable discontinuity (f(a) is undefined or differs from L)",
            limitJumpNote: "Jump discontinuity (left-hand limit ≠ right-hand limit)",
            limitAsymptoteNote: "Infinite discontinuity / vertical asymptote",
            limitOneSidedNote: "Only one-sided approach is in domain",

            // Statistics
            secStatsTitle: "Probability, Statistics & Matrices",
            statsHeading: "🎲 Probability, Statistics & Matrices",
            subTabStats: "Statistics",
            subTabProbability: "Probability",
            subTabMatrix: "Matrices",
            statsSubTitle: "Statistical Metrics",
            statsDataLabel: "Separate numbers with commas:",
            statsDataPlaceholder: "Example: 5, 10, 15, 20, 25",
            probTitle: "Permutations & Combinations",
            matrixTitle: "Matrix Operations",
            matrixSizeLabel: "Size:",
            matrixOpLabel: "Operation:",
            matrixOpAdd: "Addition (A + B)",
            matrixOpSub: "Subtraction (A − B)",
            matrixOpMul: "Multiplication (A × B)",
            matrixOpDet: "Determinant |A|",
            matrixALabel: "Matrix A",
            matrixBLabel: "Matrix B",

            // Number Theory & Combinatorics
            subTabNumberTheory: "Number Theory & Combinatorics",
            ntGcdLcmTitle: "GCD & LCM",
            ntGcdLcmInputLabel: "Separate integers with commas:",
            ntGcdLcmPlaceholder: "Example: 24, 36, 60",
            ntCombTitle: "Permutations & Combinations",
            ntBtnPerm: "Pₙ = n!",
            ntBtnArr: "Aₙᵏ",
            ntBtnComb: "Cₙᵏ",
            ntGcdLabel: "GCD:",
            ntLcmLabel: "LCM:",
            ntPrimeFactorsLabel: "Prime factorization:",
            ntPermLabel: "Permutation (Pₙ):",
            ntArrLabel: "Arrangement (Aₙᵏ):",
            ntCombLabel: "Combination (Cₙᵏ):"
        }
    };

    let currentLang = 'az';

    function init() {
        if (typeof localStorage !== 'undefined') {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved === 'en' || saved === 'az') {
                    currentLang = saved;
                }
            } catch (e) {}
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
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem(STORAGE_KEY, lang);
            } catch (e) {}
        }
        if (typeof window !== 'undefined' && window.MathCore && typeof window.MathCore.setLanguage === 'function') {
            window.MathCore.setLanguage(lang);
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

        // Update optgroup / elements with data-i18n-label attribute
        document.querySelectorAll('[data-i18n-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-label');
            if (dict[key]) {
                el.label = dict[key];
            }
        });
    }

    return {
        init,
        t,
        setLanguage,
        getLanguage,
        applyLanguage,
        TRANSLATIONS,
        translations: TRANSLATIONS
    };
}));
