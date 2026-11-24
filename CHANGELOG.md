# Dəyişikliklər Tarixçəsi (Changelog)

Bütün önəmli dəyişikliklər və yeniliklər bu sənəddə qeyd olunur.
Format [Keep a Changelog](https://keepachangelog.com/az/1.0.0/) standartına və [Semantik Versiyalaşdırma](https://semver.org/lang/az/) qaydalarına uyğundur.

---

## [2.5.0] - 2026-11-24 — "Settings Hub, Stacked Fractions, Step-by-Step Solver, Bilingual Support & Haptic Keypad"

### ⚙️ Parametrlər Paneli və Çoxdilli Dəstək (Settings & Bilingual)
- **Parametrlər Bölməsi (Settings Hub)**:
  - Sol yan paneldə 6-cı naviqasiya vərəqi kimi dişli çarx ikonu ilə **`Parametrlər`** bölməsi əlavə edildi.
  - **Görünüş (Tema)**: 3-seçimli seqment idarəetməsi — **`Aydınlıq`** (Light), **`Qaranlıq`** (Dark) və **`Avtomatik`** (Auto).
    - `Avtomatik` rejimdə sistemin/brauzerin rəng rejimi `matchMedia('(prefers-color-scheme: dark)')` ilə canlı izlənilir və cihaz rejimi dəyişdikdə interfeys dərhal yenilənir.
  - **İnterfeys Dili**: 2-seçimli seqment idarəetməsi — **`Azərbaycan`** (`az`) və **`English`** (`en`). Sıfır asılılıqlı `js/i18n.js` mühərriki vasitəsilə səhifə yenilənmədən bütün başlıqlar, düymələr, izahatlar və xəta mesajları dərhal tərcümə olunur.
  - **Düymə Vibrasiyası (Haptic Feedback)**: `Aktiv` və ya `Deaktiv` edilə bilən haptik toxunma əks-əlaqəsi. Kalkulyator düymələrinə kliklədikdə dəstəklənən mobil brauzerlərdə (Android Chrome, Samsung Internet) 15ms vibrasiya çağırılır; iOS Safari və kompüterlərdə təhlükəsiz şəkildə ötürülür.
  - İş masasının yuxarı sağındakı köhnə üzən tema düyməsi ləğv edildi, kartların yuxarı hizalanması tam düz və estetik hala gətirildi.

### 📐 Yığılmış Kəsrlər və Addım-Addım Həll Mühərriki (Stacked Fractions & Step Solver)
- **Kəsr Düyməsi (`[ a/b ]`)**:
  - Elmi rejim klaviaturasına xüsusi `[ a/b ]` kəsr şablonu düyməsi əlavə edildi. Kəsrli ifadələri daxil etməyə və ya nəticə alındıqdan sonra onluq ilə kəsr təqdimatı arasında keçid etməyə imkan verir.
  - Nəticələr üçün alternativ formlar kartı: Düzgün/qeyri-düzgün kəsr ($\frac{n}{d}$), qarışıq kəsr ($W\frac{r}{d}$) və onluq kəsr formatları.
- **Şərti Həll Addımları (Step-by-Step Solver) vs 2D Qrafik**:
  - `Kalkulyator` vərəqində sabit və sırf ədədi hesablamalarda (məs: `5/7 * 2`, `1/2 + 1/3`, `100 + 20%`, `(-3)^2`) statik qrafik əvəzinə sağ kartda **`Həll Addımları`** nümayiş etdirilir.
  - Həll addımları tam ədədin kəsrə çevrilməsi ($a = \frac{a}{1}$), sürət və məxrəclərin vurulması, ortaq məxrəc (ƏKOB), ƏBOB ilə ixtisar, faiz ardıcıllığı və PEMDAS qaydalarını aydın kartlarla göstərir.
  - İfadə daxilində dəyişən (`x`, məs: `2x + 1`, `sin(x)`) daxil edildikdə, sağ kart avtomatik olaraq 2D koordinat müstəvisinə (**`Vizual Model və Qrafik`**) keçir və funksiyanın qrafikini interaktiv çəkir.

### 🎛️ Bəsit Rejim Klaviaturası və İkon Standartlaşdırılması
- **Bəsit Rejimin 6-cı Sətri**:
  - 4 sütunlu tor üçün: `[ 0 ]` (1 sütun), `[ . ]` (1 sütun) və `[ = ]` (2 sütun enində vurğulanmış bənövşəyi düymə).
- **Vektor İkonlar**:
  - Bölmə başlıqlarındakı bütün emojilər ləğv edilərək yan paneldəki Material Symbols vektor ikonları ilə əvəzləndi.

### 🌐 PWA və Keş Yenilənməsi
- Service Worker keş adı `'math-engine-az-v2.5.0'` olaraq yeniləndi.
- `./js/i18n.js` və `./js/step-solver.js` ilkin keşə əlavə edildi.

---

## [2.0.0] - 2026-11-24 — "Modern Split-Workspace UI & Dual-Theme Overhaul"

### 🎨 Vizual və İnterfeys Yenilikləri (UI/UX Redesign)
- **İki Sütunlu Bölünmüş İş Masası (Split-Workspace Architecture)**:
  - Ekranın yuxarı hissəsindəki köhnə tam enli başlıq və abakus emojisi ləğv edildi; müasir iki sütunlu korporativ arxitekturaya keçildi.
  - **Sol Panel (Sidebar, ~280px)**:
    - Minimalist həndəsi SVG loqo və "Math Engine AZ" brend başlığı.
    - Şaquli naviqasiya vərəqləri (`Kalkulyator`, `Həndəsə`, `Cəbr`, `Analiz`, `Statistika`) və aktiv pill vurğusu (`#4F46E5`).
    - Sol panelə inteqrasiya edilmiş, müstəqil sürüşdürülə bilən (`overflow-y: auto`) **Tarixçə** bölməsi. Başlıqda kompakt **İxrac (.json)** və **Təmizlə** ikon düymələri. Tarixçə qeydinə kliklədikdə nəticə birbaşa aktiv kalkulyatora və ya fokuslanan xanaya (`Ans`) ötürülür.
    - Mobil ekranlar üçün intuitiv sürüşən menyu (drawer) və kölgəlik (backdrop).
  - **Sağ Əsas Sahə (Main Workspace)**:
    - Yuxarı sağ küncdə Dark / Light rejim keçid düyməsi.
    - İki paralel kart düzülüşü:
      - **Sol Kart**: İnteraktiv daxiletmə və kalkulyator / tənlik / həndəsə / statistika parametrləri.
      - **Sağ Kart (`Vizual Model və Qrafik`)**: Həndəsi koordinat toru (`coordinate grid pattern`) fonu, miqyaslama (zoom in, zoom out, reset) idarəediciləri və dinamik vizual vəziyyət göstəricisi.
- **Bəsit / Elmi Rejim Keçidi (Segmented Pill Toggle)**:
  - Kalkulyator kartının yuxarısında **Bəsit** və **Elmi** rejimləri arasında bir toxunuşla keçid edən pill düyməsi əlavə edildi.
  - `Bəsit` rejim seçildikdə mürəkkəb elmi funksiya cərgələri gizlədilir və 4 sütunlu böyüdülmüş bəsit klaviatura göstərilir; `Elmi` rejim seçildikdə tam 5 sütunlu qabaqcıl elmi klaviatura bərpa olunur.
- **Yüksək Kontrastlı İkiqat Tema (Light & Dark Themes)**:
  - Həm İşıqlı (Light), həm də Qaranlıq (Dark) rejimlərdə mükəmməl rəng kontrastı, dəqiq `#E2E8F0` / `#2D3748` haşiyələr və aydın oxunan düymə yazıları.
  - Toxunuş dinamikası: 5 sütunlu kalkulyatorda rəng iyerarxiyası (ədədlər, elmi funksiyalar, əməliyyatlar `#4F46E5`, təmizləmə `#EF4444`).
- **Analiz Qrafikinin İnteqrasiyası**:
  - `Analiz -> Qrafik` vərəqi seçildikdə, interaktiv `<canvas>` funksiya qrafiki birbaşa sağ vizual karta köçürülür və dinamik olaraq vizual müstəvidə canlandırılır.
- **Təhlükəsizlik və Dəqiqlik**:
  - Bütün riyazi mühərrik (`MathCore`), simvolik kök/faiz/bucaq hesablamaları və davamlı yaddaş toxunulmaz saxlanıldı. Sıfır `eval()` / `new Function()`.
- **PWA Service Worker Keş**:
  - Keş versiyası `'math-engine-az-v2.0.0'` səviyyəsinə yüksəldildi.

---

## [1.7.0] - 2026-11-23 — "Expression Geometry, Percentage Engine & Bug Fixes"

### 🚀 Təkmilləşdirmələr və Yeniliklər (Added & Improved)
- **Postfiks Faiz (`%`) Mühərriki**:
  - `%` simvolu binar qalıq operatorundan çıxarılaraq tam hüquqlu postfiks faiz operatoruna çevrildi.
  - Sərbəst və ya mötərizə/vurma/bölmə daxilində hesablamalar: `70% = 0.7`, `100 × (70%) = 70`, `100 × 70% = 70`, `200 ÷ 50% = 400`.
  - Standart kalkulyator əlavə/çıxma faizi: `A + B% = A + (A · B / 100)` (məs: `100 + 20% = 120`), `A - B% = A - (A · B / 100)` (məs: `100 - 20% = 80`).
  - Zəncirvari faiz hesablamaları (`100 + 20% + 10% = 132`) və mürəkkəb ifadələr tam dəqiqliklə icra olunur.
- **Mənfi Əsaslı Qüvvət İstifadəçi Təcrübəsi (UX)**:
  - Mənfi ədəd daxil edildikdə və ya `±` ilə işarə dəyişdirildikdə, dərhal `x²` və ya `xⁿ` basıldıqda mənfi əsas avtomatik mötərizəyə alınır: məsələn, `-3` ardınca `x²` basıldıqda ekranda `(-3)^2` formalaşır və düzgün olaraq `9` nəticəsini verir.
  - Riyazi cəbr qanunları və standart assosiativlik tam qorunur (`(-3)^2 === 9` və `-3^2 === -9`).
  - `±` işarə çeviricisi `X` və `(-X)` arasında səlis və təmiz keçid edir.
- **Həndəsədə Simvolik və İfadə Daxiletməsi (`√`, `π`, `/`, `^`)**:
  - `MathCore` parserinə unaykod radikal simvolu `√` inteqrasiya edildi (`√3` -> `sqrt(3)`, `√(3+1)` -> `sqrt(3+1)`, `2√3` -> `2*sqrt(3)`, `√3/2` -> `sqrt(3)/2`).
  - Həndəsə bölməsindəki bütün daxiletmə sahələri `type="text"` rejiminə keçirildi; istifadəçilər `√3`, `√3/2`, `2√5`, `π`, `3/4` və s. riyazi ifadələri birbaşa daxil edə bilərlər.
  - Həndəsə kartının daxilinə mobil cihazlar üçün bir toxunuşla simvol daxiletmə paneli (`√`, `π`, `/`, `^`, `(`, `)`) əlavə edildi.
  - Müsbət ədəd və riyazi ifadə yoxlanışı və aydın Azərbaycan dilində xəta bildirişləri tətbiq edildi.
- **Düzbucaqlı Üçbucaq: Katet və Hipotenuz Rejimi**:
  - Həndəsə -> Üçbucaq bölməsinə yeni hesablama üsulu əlavə edildi: **`"Düzbucaqlı: Katet və hipotenuz"`**.
  - Daxil edilən katet `a` və hipotenuz `c` üçün `c > a` həndəsi şərti yoxlanılır.
  - Məchul katet `b = √(c² − a²)`, perimetr `P = a + b + c`, sahə `S = (a · b) / 2` və iti bucaqlar `α = arcsin(a / c)`, `β = 90° − α` yüksək dəqiqliklə hesablanır.
- **Kalkulyator Ekranının Dinamik Şrifti və Mətn Daşmasının Qarşısının Alınması**:
  - Azərbaycan dilində uzun xəta mesajlarının mobil ekranlarda kəsilməsinin (`çatı...`) qarşısı alındı.
  - `.calc-result` sahəsinə mətnin uzunluğuna uyğun olaraq dinamik `text-medium`, `text-long` və `is-error` sinifləri tətbiq edildi; sözlər kəsilmədən səlis şəkildə növbəti sətrə keçir.
- **PWA Service Worker Keş Yenilənməsi**:
  - Keş versiyası `'math-engine-az-v1.7.0'` səviyyəsinə yüksəldildi, köhnə keşlər avtomatik təmizlənir.

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
