# Dəyişikliklər Tarixçəsi (Changelog)

Bütün önəmli dəyişikliklər və yeniliklər bu sənəddə qeyd olunur.
Format [Keep a Changelog](https://keepachangelog.com/az/1.0.0/) standartına və [Semantik Versiyalaşdırma](https://semver.org/lang/az/) qaydalarına uyğundur.

---

## [1.5.0] - 2026-11-23 — "Core Precision & Offline Engine"

### 🚀 Əlavə edildi (Added)
- **MathCore Mühərriki (`js/math-core.js`)**:
  - Şantinq-Yard (Shunting-Yard / RPN) alqoritmi əsasında sıfır asılılıqlı (zero-dependency) təhlükəsiz riyazi parser.
  - Qeyri-aşkar vurma (implicit multiplication) dəstəyi: `2x`, `2(x+1)`, `2sin(x)`, `(x+1)(x-1)`, `2pi`, `5!2`.
  - Qüvvət əməliyyatının sağdan sola assosiativliyi (`2^3^2 = 512`) və unar mənfi operatorunun riyazi ardıcıllığı (`-2^2 = -4`, `(-2)^2 = 4`, `2^-3 = 0.125`).
  - Bucaq rejimləri: `DEG` və `RAD` rejimlərində bütün triqonometrik (`sin`, `cos`, `tan`, `cot`) və tərs triqonometrik (`asin`, `acos`, `atan`) funksiyalar.
  - Simvolik analitik törəmə mühərriki (`MathCore.derivative`) və sadələşdirici (AST Simplifier).
  - Simpson 1/3 qaydası ilə müəyyən inteqral hesablama (`MathCore.definiteIntegral`).
  - Qrafik çəkilməsi üçün təhlükəsiz funksiya nöqtə generatoru (`MathCore.sampleFunction`).
- **IEEE-754 Dəqiqlik Təmizləyicisi (`MathCore.cleanPrecision`)**:
  - Üzən nöqtəli ədədlərin xətalarının aradan qaldırılması (məsələn, `0.1 + 0.2 === 0.3`, `sin(pi) === 0`, `cos(90) === 0`).
  - Bütün modullara inteqrasiya: Kalkulyator, Həndəsə, Kvadrat və Xətti tənliklər, Faiz, Silsilə, Matrislər və Statistika.
- **Lokal Azərbaycan Xəta Mesajları**:
  - Sıfıra bölmə, mənfi ədədin kvadrat kökü, loqarifmin qeyri-müsbət arqumenti, `tan`/`cot` asimptot nöqtələri və mötərizə uyğunsuzluqları üçün aydın Azərbaycan dilində bildirişlər.
- **Davamlı Tarixçə & Ans Yaddaşı (`MathCore.HistoryStore`)**:
  - `localStorage` üzərində `math_engine_az_history_v1` açarı ilə 100 hesablamayadək davamlı yaddaş.
  - Tarixçədəki nəticəyə kliklədikdə aktiv sahəyə (`Ans`) avtomatik daxil edilməsi.
  - Tarixçəni JSON formatında ixrac etmə düyməsi (`📥 İxrac`).
- **Progressive Web App (PWA) & Oflayn Rejim**:
  - `manifest.json` konfiqurasiyası (`standalone` rejim, tema rəngi `#6366f1`).
  - Yüksək keyfiyyətli PWA nişanları (`icon-192.png`, `icon-512.png`).
  - Şəbəkə-Birinci Keşlə-Ehtiyat (Network-First with Cache Fallback) Service Worker (`sw.js`).
  - İnternet bağlantısı olmadan tam funksional işləmə imkanı.

### 🔒 Təhlükəsizlik və Kod Keyfiyyəti (Security & Quality)
- Layihədəki bütün `eval()` və `new Function()` çağırışları tamamilə ləğv edildi və arxitekturadan təmizləndi.
- Hesablama mühərriki qlobal `window.MathCore` və CommonJS (`module.exports`) modulu olaraq təcrid edildi.

---

## [1.0.0] - 2026-11-22 — "Initial Release"

### 🌟 İlkin Buraxılış
- Standart və Elmi Kalkulyator paneli.
- Müstəvi və fəza fiqurlarının ağıllı həndəsi hesablayıcısı (düsturların vizual əksi ilə).
- Cəbr modulu: Kvadrat tənliklər (diskriminant və köklər), 2 və 3 məchullu xətti tənliklər sistemi (Kramer), faiz və silsilə.
- Riyazi analiz: Törəmə, Simpson inteqralı və HTML5 Canvas funksiya qrafiki.
- Statistika və Matrislər: Ədədi orta, median, moda, dispersiya, standart kənarlaşma, permutasiya, kombinasiya və 2×2 / 3×3 matris əməliyyatları.
- Tünd (Dark Mode) və İşıqlı mövzu keçidi.
- İlkin interfeys və GitHub Pages inteqrasiyası.
