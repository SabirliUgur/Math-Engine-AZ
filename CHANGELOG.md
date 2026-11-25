# Dəyişikliklər Tarixçəsi (Changelog)

Bütün önəmli dəyişikliklər və yeniliklər bu sənəddə qeyd olunur.
Format [Keep a Changelog](https://keepachangelog.com/az/1.0.0/) standartına və [Semantik Versiyalaşdırma](https://semver.org/lang/az/) qaydalarına uyğundur.

---

## [3.1.0] - 2026-11-25 — "Number Theory, Combinatorics & Multi-Factor Step Solver"

### 🔢 Ədədlər Nəzəriyyəsi və Kombinatorika (`Statistika` bölməsi)
- **Yeni Alt-Vərəq (`Ədədlər və Kombinatorika` / `Number Theory & Combinatorics`)**:
  - **ƏBOB və ƏKOB (`GCD & LCM`)**: Vergüllə ayrılmış 2 və ya daha çox müsbət tam ədəd üçün dəqiq **ƏBOB (`GCD`)**, **ƏKOB (`LCM`)** və hər bir ədəd üçün **Sadə Vuruqlara Ayırma (`Prime Factorization`)** (məs: `24 = 2³ × 3`).
  - **Kombinatorika (`Permutasiya, Aranjeman, Kombinezon`)**: `0 ≤ k ≤ n` tam ədəd yoxlaması ilə:
    - Permutasiya: $P_n = n!$
    - Aranjeman: $A_n^k = \frac{n!}{(n-k)!}$
    - Kombinezon: $C_n^k = \frac{n!}{k!(n-k)!}$
  - Bütün hesablamalar `MathCore.HistoryStore`-a ikidilli (`AZ`/`EN`) etiketlərlə qeyd olunur.

### 🧩 Çoxvuruqlu İfadələrdə Tam Kontekstli Həll Addımları (`js/step-solver.js`)
- **Tam Sol Tərəf Konteksti**: `√5 × 3 2/3` və ya `2 * (1/3) + 4` kimi mürəkkəb çoxvuruqlu ifadələrdə aralıq addım kartları əvvəlki vuruqları itirmədən tam ifadəni sol tərəfdə qoruyur (məs: `√5 × (11/3) = 8.1989159175`).

### 🌐 Tam İkidilli Dəstək və PWA Keş
- Bütün yeni başlıqlar, düymələr, formullar və xəta mesajları `AZ` və `EN` dillərində 100% lokallaşdırıldı.
- `sw.js` keş adı `'math-engine-az-v3.1.0'` olaraq yeniləndi.

---

## [3.0.1] - 2026-11-25 — "100% Bilingual AZ/EN Localization & Label Cleanup"

### 🌐 Tam İkidilli Lokalizasiya və Etiket Təmizliyi (`AZ` / `EN`)
- **Tarixçə və Yan Panel**:
  - Boş tarixçə mətni (`"Hələ hesablama yoxdur"` / `"No calculations yet"`) və tarixçədəki bölmə bəcləri/nəticə etiketləri (`Kalkulyator`/`Calculator`, `Həndəsə`/`Geometry`, `Sahə`/`Area`, `Perimetr`/`Perimeter`, `Həcm`/`Volume`, `Səthi`/`Surface Area`) dil seçiminə uyğun olaraq dinamik tərcümə edilir.
- **Həndəsə Bölməsi**:
  - Bütün fiqur adları, hesablama üsulları, simvol paneli, nəticə etiketləri, səhv bildirişləri və 2D SVG çertyoj başlıqları tam lokallaşdırıldı (məs: `Sphere: V = (4/3)πr³` və ya `Kürə: V = (4/3)πr³`).
- **Cəbr, Analiz və Statistika**:
  - Bütün alt-vərəqlər, xana yer tutucuları (placeholder), düymələr, nəticələr və xətalar tam tərcümə edildi.
  - `Analiz` (`Calculus`) bölməsində sağ kart başlığı düzgün olaraq `"Funksiya Qrafiki"` / `"Function Graph"` göstərəcək şəkildə düzəldildi.
- **Parametrlər Sağ Kartı və Qısayollar**:
  - `Parametrlər` bölməsində sağ kart başlığı `"Sistem Məlumatı"` / `"System Information"` olaraq sabitləndi; qarışıq `AZ / EN` klaviatura qısayol mətnləri tək dildə təmiz göstərilir.
- **Həll Addımlarında Raw LaTeX Təmizliyi (`js/step-solver.js`)**:
  - Akkordeon alt-addımlarındakı `\text{...}`, `\quad`, `\frac{...}`, `\%` kimi render olunmayan xam LaTeX ifadələri oxunaqlı Unicode və HTML formatına (`PEMDAS: P → E → MD → AS`, `<sup>`, kəsr komponentləri) çevrildi.
- **PWA Keş Yenilənməsi**: `sw.js` keş adı `'math-engine-az-v3.0.1'` olaraq yeniləndi.

---

## [3.0.0] - 2026-11-24 — "Structured Math Editor, Interactive Step-by-Step Solver, 2D Geometry & Statistical Charts"

### 📐 Strukturlaşdırılmış Vizual Riyazi Redaktor (Structured WYSIWYG Math Editor)
- **Photomath Tipli Yuva (Slot-based) AST Mühərriki (`js/math-editor.js`)**:
  - Düz mətn sətri əvəzinə tam vizual, yuvalı riyazi redaktor tətbiq edildi.
  - **Vertikal Yığılmış Kəsrlər (`□/□`)**: Sürət və məxrəc xanaları olan həqiqi şaquli kəsr strukturu.
  - **Qarışıq Kəsrlər (`□ □/□`)**: Kəsrin solunda mərkəzləşdirilmiş tam ədəd yuvası (məs: $5\frac{1}{2}$). İstifadəçidən mötərizə və ya süni toplama simvolu tələb etmir.
  - **Qüvvət Üstü İndeks (`x²`, `xⁿ`)**: Əsasın sağ yuxarısında superscript üsulu ilə yerləşən redaktə edilə bilən qüvvət yuvası (`base^{exp}`).
  - **Kökaltı İfadə (`√`)**: Genişlənən üst xətli və daxili radicand yuvalı radikal simvolu.
- **İkitərəfli Yuva Naviqasiyası (`←` və `→`)**:
  - Displey panelində kursorun sola və sağa hərəkətini təmin edən `←` və `→` düymələri əlavə edildi.
  - Fiziki klaviatura `ArrowLeft` və `ArrowRight` düymələrinə bağlandı.
  - Hal-hazırda aktiv olan yuva kəskin neon-bənövşəyi vurğu haşiyəsi və parlaq kursor indikatoru ilə vurğulanır.
- **Təmiz Riyazi Serializasiya və Precedence Qorunması**:
  - Vizual ağac `MathCore.evaluate(...)` üçün avtomatik olaraq dəqiq cəbri sintaksisə çevrilir: $5\frac{1}{2}$ daxil edildikdə `((5) + ((1)/(2)))` şəklində serializasiya olunur.
  - Qat-qat əməliyyatlarda vurma/bölmə sırası qorunur: `5 * 5 1/2 === 27.5` və `5 * 5 1/2 / 2 === 13.75`.

### ⚡ Atomik Funksiya Token Silinməsi (Atomic Function Token Deletion)
- **Bütöv Funksiya Silinməsi (`DEL` və `Backspace`)**:
  - İstifadəçi çoxhərfli funksiya adından sonra `DEL` və ya fiziki `Backspace` basdıqda token simvolbəsimvol deyil, **tam bir vahid kimi** silinir.
  - Əhatə olunan funksiyalar: `sqrt(`, `cbrt(`, `sin(`, `cos(`, `tan(`, `cot(`, `asin(`, `acos(`, `atan(`, `ln(`, `log10(`, `log(`, `abs(`, `exp(`.
  - Ekranda heç vaxt `sqr`, `si` və ya `l` kimi yarımçıq və sintaksisi pozan fraqmentlər qalmır.
- **Boş Yuvaların Təmiz Ləğvi**:
  - Boş kəsr, qüvvət və ya kökaltı yuvasında `DEL` basıldıqda sintaktik xəta yaratmadan bütün boş blok ləğv edilir və kursor əsas səviyyəyə qayıdır.

### 🔍 İnteraktiv Genişlənən Həll Addımları 2.0 (Photomath Akkordeon)
- **Əsas Addım Kartları**: Photomath təcrübəsinə uyğun aydın nömrələnmiş mərhələ kartları (məs: *1. Qarışıq kəsri düzgün olmayan kəsrə çevirin*, *2. İfadəni sadələşdirin*, *3. Yekun nəticə*).
- **Açılan/Qapanan Aralıq İzahlar ("Ətraflı addımları göstər")**:
  - Hər bir əsas kart daxilində chevron ikonu ilə interaktiv akkordeon düyməsi.
  - Toxunduqda detallı aralıq arifmetik addımları nümayiş etdirir (məs: $5\frac{1}{2} \rightarrow \frac{5 \times 2 + 1}{2} \rightarrow \frac{10 + 1}{2} \rightarrow \frac{11}{2}$).
- **Alternativ Formlar Altlığı və Təmizləmə**:
  - Kartın aşağısında yığılmış kəsr, qarışıq kəsr və onluq ekvivalentləri.
  - Qeyri-funksional `#visual-badge` ("Enter a function or select an operation") düyməsi ləğv edildi.

### 🎨 Yan Panel və Başlıq Təmizliyi & Parametrlər Bölməsi
- **Başlıq Təmizlənməsi**: Kalkulyator kartının yuxarısındakı dekorativ `F(X) • ENGINE` etiketi silindi.
- **İzolyasiya Edilmiş Parametrlər Paneli**:
  - Sol yan paneldə 5 riyazi bölmə (`Kalkulyator`, `Həndəsə`, `Cəbr`, `Analiz`, `Statistika`) yuxarı blokda qruplaşdırıldı.
  - Xüsusi ayırıcı xətt (`sidebar-nav-divider`) ilə **`Parametrlər`** ən aşağıya — `Tarixçə` blokunun dərhal üzərinə keçirildi.
- **100% İkidilli Tamlıq (`AZ` / `EN`)**:
  - Bütün interfeys mətnləri, o cümlədən `"Hələ hesablama yoxdur"` (`"No calculations yet"`), həndəsə və statistika başlıqları, həll addımları və xəta bildirişləri tam lokallaşdırıldı.
- **Sistem Məlumatı Sağ Kartı (Settings Info)**:
  - Tətbiq versiyası (`v3.0.0`), PWA oflayn keş vəziyyəti, klaviatura qısayolları bələdçisi və "Ayarları sıfırla / Reset Defaults" funksiyası əlavə edildi.

### 📊 Canlı 2D Həndəsə Çertyojları və Statistika Paylanma Qrafikləri (`js/visual-charts.js`)
- **2D Həndəsə Çertyojları (`Həndəsə`)**:
  - Fiqur seçildikdə (Dairə, Kvadrat, Düzbucaqlı, Üçbucaq, Düzbucaqlı Üçbucaq, Trapesiya, Kub, Silindr, Kürə, Konus) və ölçülər daxil edildikdə sağ paneldə real-vaxt rejimində dinamik, tərəf, hündürlük və bucaqları göstərən SVG çertyoj çəkilir.
  - Pifaqor teoremi üzrə katetlər verildikdə hipotenuz avtomatik hesablanaraq çertyojda qeyd olunur.
- **Statistik Paylanma Qrafiki (`Statistika`)**:
  - Verilənlər daxil edildikdə sağ paneldə avtomatik Sütunlu Paylanma Qrafiki qurulur.
  - Yaşıl kəsik-kəsik xətt ilə **Ədədi Orta ($x̄$)** xətti və nümunə ölçüsü ($n$) qrafikdə vizuallaşdırılır.

### ⌨️ Tam Klaviatura Dəstəyi və PWA Keş Yenilənməsi
- Masaüstü klaviatura dəstəyi: `0-9`, `+`, `-`, `*`, `/`, `^`, `(`, `)`, `.`, `Enter` (`=`), `Escape` (`AC`), `Backspace` / `Delete` (atomik DEL), `ArrowLeft` / `ArrowRight` (yuva naviqasiyası).
- `sw.js` daxilində Service Worker keş adı `'math-engine-az-v3.0.0'` olaraq yeniləndi və bütün yeni skriptlər (`math-editor.js`, `visual-charts.js`) keş siyahısına daxil edildi.

---

## [2.5.1] - 2026-11-24 — "Bilingual Error & Step Badge Localization, Cache Refresh"

### 🌐 Tərcümə və İki Dillilik Təkmilləşdirmələri (I18n Fixes)
- **Həll Addımları Bəcləri (Step Badges)**:
  - İngilis dili seçildikdə `ADDIM 1`, `ADDIM 2` əvəzinə tam lokallaşdırılmış **`STEP 1`**, **`STEP 2`** bəclərinin göstərilməsi təmin edildi.
  - Xəta baş verdikdə bəcin `XƏTA` əvəzinə **`ERROR`** göstərməsi təmin edildi.
- **Riyazi Xəta Bildirişləri (Localized Math Errors)**:
  - `MathCore.evaluate` daxilindəki bütün xəta mesajları dinamik dil yoxlayıcısına (`getActiveLang`) bağlandı.
  - İngilis dilində: `7 ÷ 0` üçün `"Division by zero is undefined"`, `5 ÷` üçün `"Missing operand or operator"`, `sqrt(-4)` üçün `"Cannot take square root of a negative number"` və s. dərhal nümayiş etdirilir.
  - Dil dəyişdirildikdə ekranda aktiv olan xəta və ya nəticə səhifəni yeniləmədən dərhal tərcümə olunur.
- **Keş Yenilənməsi (Service Worker & Assets)**:
  - Mobil və veb istifadəçilərinin köhnə skript keşlərində qalmaması üçün Service Worker keş adı `math-engine-az-v2.5.1` olaraq yeniləndi və `skipWaiting` ilə aktivləşdirildi.

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
