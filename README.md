# 🧮 Math-Engine-AZ (v3.1.0 — "Number Theory, Combinatorics & Multi-Factor Step Solver")

Müasir, bölünmüş iş masalı (split-workspace), strukturlaşdırılmış vizual riyazi redaktorlu (WYSIWYG Slot AST), interaktiv həll addımlı (Photomath tipli akkordeon), 2D həndəsə çertyojlu, statistik paylanma qrafikli, ədədlər nəzəriyyəsi və kombinatorika modullu, ikidilli (Azərbaycan / English) **Elmi və Həndəsi Riyazi Mühərrik**.

[![Canlı Demo](https://img.shields.io/badge/Demo-Canlı%20Sayt-6366f1?style=for-the-badge&logo=githubpages&logoColor=white)](https://sabirliugur.github.io/Math-Engine-AZ/)
[![Lisenziya](https://img.shields.io/badge/Lisenziya-MIT-green?style=for-the-badge)](LICENSE)
[![Versiya](https://img.shields.io/badge/Versiya-v3.1.0-blue?style=for-the-badge)](CHANGELOG.md)
[![PWA Dəstəyi](https://img.shields.io/badge/PWA-Oflayn%20Dəstəkli-orange?style=for-the-badge)](manifest.json)

---

## 🌐 Canlı Keçid (Live Demo)
Tətbiqi heç bir quraşdırma tələb olunmadan birbaşa brauzerinizdə istifadə edin:  
👉 **[https://sabirliugur.github.io/Math-Engine-AZ/](https://sabirliugur.github.io/Math-Engine-AZ/)**

---

## ✨ v3.1.0 Yenilikləri
- **Ədədlər Nəzəriyyəsi və Kombinatorika (`Statistika` → `Ədədlər və Kombinatorika`)**:
  - **ƏBOB və ƏKOB (`GCD & LCM`)**: İstənilən sayda (2+) müsbət tam ədəd üçün ƏBOB, ƏKOB və sadə vuruqlara ayırma ($24 = 2^3 \times 3$).
  - **Kombinatorika**: Permutasiya ($P_n = n!$), Aranjeman ($A_n^k = \frac{n!}{(n-k)!}$) və Kombinezon ($C_n^k = \frac{n!}{k!(n-k)!}$) hesablayıcısı.
- **Çoxvuruqlu Həll Addımları (`js/step-solver.js`)**: Mürəkkəb ifadələrdə (`√5 × 3 2/3`, `2 * (1/3) + 4`) bütün vuruqları sol tərəfdə qoruyan aralıq addım kartları.

---

## 🚀 v3.0.0 Yenilikləri və Təkmilləşdirmələr

### 1. 📐 Strukturlaşdırılmış Vizual Riyazi Redaktor (Photomath Tipli WYSIWYG Slot AST)
- **Yuva Əsaslı (Slot-based) İnteraktiv Redaktor (`js/math-editor.js`)**:
  - Düz mətn sətri əvəzinə hər elementi ayrı redaktə edilə bilən yuvalı arxitektura.
  - **Vertikal Yığılmış Kəsrlər (`□/□`)**: Sürət və məxrəc xanaları olan həqiqi şaquli kəsr.
  - **Qarışıq Kəsrlər (`□ □/□`)**: Kəsrin solunda mərkəzləşdirilmiş tam ədəd yuvası (məs: $5\frac{1}{2}$). İstifadəçidən mötərizə və ya süni toplama simvolu tələb etmir.
  - **Qüvvət Üstü İndeks (`x²`, `xⁿ`)**: Əsasın sağ yuxarısında superscript yuvası (`base^{exp}`).
  - **Kökaltı İfadə (`√`)**: Genişlənən üst xətli və daxili radicand yuvalı radikal simvolu.
- **İkitərəfli Yuva Naviqasiyası (`←` və `→`)**:
  - Displey panelində kursorun sola və sağa hərəkətini təmin edən `←` və `→` düymələri.
  - Fiziki klaviatura `ArrowLeft` və `ArrowRight` düymələrinə bağlandı.
  - Hal-hazırda aktiv olan yuva kəskin neon-bənövşəyi vurğu haşiyəsi ilə işıqlandırılır.
- **Dəqiq Cəbri Serializasiya**:
  - $5\frac{1}{2}$ daxil edildikdə avtomatik olaraq `((5) + ((1)/(2)))` şəklində serializasiya olunur və `MathCore.evaluate` ilə tam riyazi dəqiqliklə hesablanır ($5 \times 5\frac{1}{2} = 27.5$).

### 2. ⚡ Atomik Funksiya Token Silinməsi (`DEL` & `Backspace`)
- **Bütöv Funksiya Silinməsi**:
  - İstifadəçi çoxhərfli funksiya adından sonra `DEL` və ya fiziki `Backspace` basdıqda token simvolbəsimvol deyil, **tam bir vahid kimi** silinir.
  - Əhatə olunan funksiyalar: `sqrt(`, `cbrt(`, `sin(`, `cos(`, `tan(`, `cot(`, `asin(`, `acos(`, `atan(`, `ln(`, `log10(`, `log(`, `abs(`, `exp(`.
  - Ekranda heç vaxt `sqr` və ya `si` kimi yarımçıq fraqmentlər qalmır.
- **Boş Yuvaların Təmiz Ləğvi**:
  - Boş kəsr, qüvvət və ya kökaltı yuvasında `DEL` basıldıqda sintaktik xəta yaratmadan bütün boş struktur ləğv edilir.

### 3. 🔍 İnteraktiv Genişlənən Həll Addımları 2.0 (Photomath Akkordeon)
- **Əsas Addım Kartları**: Nömrələnmiş mərhələ kartları və içərisində həqiqi yığılmış kəsrlər.
- **"Ətraflı addımları göstər" (Show detailed steps)**:
  - Hər bir əsas kart daxilində chevron ikonu ilə interaktiv akkordeon düyməsi.
  - Toxunduqda detallı aralıq arifmetik addımları nümayiş etdirir (məs: $5\frac{1}{2} \rightarrow \frac{5 \times 2 + 1}{2} \rightarrow \frac{10 + 1}{2} \rightarrow \frac{11}{2}$).
- **Alternativ Formlar Altlığı**:
  - Yığılmış kəsr, qarışıq kəsr və onluq ekvivalentləri. Qeyri-funksional `#visual-badge` düyməsi ləğv edildi.

### 4. 📊 Canlı 2D Həndəsə Çertyojları və Statistika Qrafikləri (`js/visual-charts.js`)
- **2D Həndəsə Çertyojları (`Həndəsə`)**:
  - Fiqur seçildikdə (Dairə, Kvadrat, Düzbucaqlı, Üçbucaq, Düzbucaqlı Üçbucaq, Trapesiya, Kub, Silindr, Kürə, Konus) və ölçülər daxil edildikdə sağ paneldə real-vaxt rejimində dinamik, tərəf, hündürlük və bucaqları göstərən SVG çertyoj çəkilir.
  - Pifaqor teoremi üzrə katetlər verildikdə hipotenuz avtomatik hesablanaraq çertyojda qeyd olunur.
- **Statistik Paylanma Qrafiki (`Statistika`)**:
  - Verilənlər daxil edildikdə sağ paneldə avtomatik Sütunlu Paylanma Qrafiki qurulur.
  - Yaşıl kəsik-kəsik xətt ilə **Ədədi Orta ($x̄$)** xətti və nümunə ölçüsü ($n$) qrafikdə vizuallaşdırılır.

### 5. 🎨 Yan Panel və Başlıq Təmizliyi & Parametrlər Bölməsi
- **Başlıq Təmizlənməsi**: Kalkulyator kartının yuxarısındakı dekorativ `F(X) • ENGINE` etiketi silindi.
- **İzolyasiya Edilmiş Parametrlər Paneli**:
  - 5 riyazi bölmə yuxarı blokda qruplaşdırıldı, xüsusi ayırıcı xətt (`sidebar-nav-divider`) ilə **`Parametrlər`** ən aşağıya — `Tarixçə` blokunun üzərinə keçirildi.
- **100% İkidilli Tamlıq (`AZ` / `EN`)**:
  - Bütün interfeys mətnləri, o cümlədən `"Hələ hesablama yoxdur"` (`"No calculations yet"`), həndəsə və statistika başlıqları tam lokallaşdırıldı.
- **Sistem Məlumatı Sağ Kartı**:
  - Tətbiq versiyası (`v3.0.0`), PWA oflayn keş vəziyyəti, klaviatura qısayolları cədvəli və "Ayarları sıfırla / Reset Defaults" funksiyası.

### 6. ⌨️ Tam Klaviatura Dəstəyi və PWA Keş
- Masaüstü klaviatura dəstəyi: `0-9`, `+`, `-`, `*`, `/`, `^`, `(`, `)`, `.`, `Enter`, `Escape`, `Backspace` / `Delete`, `ArrowLeft` / `ArrowRight`.
- `sw.js` Service Worker keş adı `'math-engine-az-v3.0.0'` olaraq yeniləndi.

---

## 🧮 Tətbiqin Əsas Modulları

| Bölmə | Əsas Funksiyalar |
|---|---|
| **🔢 Standart və Elmi Kalkulyator** | Strukturlaşdırılmış vizual riyazi redaktor (yığılmış kəsrlər, qarışıq kəsrlər, qüvvət, kökaltı), əsas əməllər, `sin`, `cos`, `tan`, `cot`, `asin`, `acos`, `atan`, `ln`, `log`, `√`, `x²`, `xⁿ`, `n!`, `π`, `e`, `DEG`/`RAD`, tam klaviatura və yuva naviqasiyası dəstəyi. |
| **📐 Həndəsə (Ağıllı Hesablama & 2D Çertyoj)** | Dairə, Kvadrat, Düzbucaqlı, Üçbucaq (3 fərqli üsul, o cümlədən Heron və Pifaqor), Trapesiya, Kub, Silindr, Kürə, Konus. Canlı 2D SVG çertyoj və düstur izahatı. |
| **✖️ Cəbr və Tənliklər** | Kvadrat tənliklərin həlli (diskriminant, həqiqi və kompleks köklər), 2 və 3 məchullu xətti tənliklər sistemi (Kramer qaydası), 5 növ faiz hesablama, ədədi və həndəsi silsilələr. |
| **📈 Riyazi Analiz** | Analitik simvolik törəmə (`d/dx`), Simpson qaydası ilə müəyyən inteqral, HTML5 Canvas ilə funksiyanın interaktiv qrafiki. |
| **🎲 Statistika və Matrislər** | Canlı statistik sütunlu paylanma qrafiki, ədədi orta ($x̄$), median, moda, dispersiya, standart kənarlaşma, Permutasiya $P(n, r)$, Kombinasiya $C(n, r)$, 2×2 və 3×3 matrislərin toplanması, çıxılması, vurulması və determinantı. |
| **⚙️ Parametrlər və Sistem Məlumatı** | Tema seçimi (Aydınlıq, Qaranlıq, Avtomatik), İnterfeys Dili (Azərbaycan, English), Düymə vibrasiyası (Haptic), PWA oflayn keş vəziyyəti, klaviatura qısayolları və ilkin ayarlara sıfırlama. |

---

## 📲 PWA Quraşdırma Bələdçisi

### Masaüstü Kompüterdə (Windows, macOS, Linux):
1. **Google Chrome** və ya **Microsoft Edge** ilə [saytı açın](https://sabirliugur.github.io/Math-Engine-AZ/).
2. Ünvan sətrinin sağ tərəfindəki **"Quraşdır" (Install App)** nişanına klikləyin.
3. Tətbiq masaüstünüzə əlavə olunacaq və internet olmadan da tam sürətlə açılacaq.

### Mobil Telefonda (Android & iOS):
- **Android (Chrome)**: Menyudan (üç nöqtə) **"Əsas ekrana əlavə et" (Install / Add to Home screen)** seçin.
- **iOS / iPhone (Safari)**: **Paylaş (Share)** düyməsinə klikləyin və **"Ana ekrana əlavə et" (Add to Home Screen)** seçin.

---

## 📁 Layihə Strukturu

```
Math-Engine-AZ/
├── index.html          # Əsas HTML5 strukturu və modul teqləri (v3.0.0)
├── style.css           # Bütün mövzu (Dark/Light) və responsive CSS qaydaları
├── app.js              # UI kontrolleri, klaviatura və vizual redaktor inteqrasiyası
├── js/
│   ├── math-core.js    # MathCore: Şantinq-Yard parseri, qarışıq kəsr və dəqiqlik mühərriki
│   ├── math-editor.js  # VisualMathEditor: Photomath tipli slot-based AST vizual redaktor
│   ├── step-solver.js  # StepSolver: Genişlənən akkordeon həll addımları və alternativ formlar
│   ├── visual-charts.js# VisualCharts: 2D Həndəsə SVG çertyojları və Statistika paylanma qrafiki
│   └── i18n.js         # İkidilli tərcümə mühərriki (Azərbaycan & English)
├── sw.js               # Service Worker (Network-First oflayn keşləmə, v3.0.0)
├── manifest.json       # PWA manifesti
├── icon-192.png        # 192x192 PWA tətbiq nişanı
├── icon-512.png        # 512x512 PWA tətbiq nişanı
├── CHANGELOG.md        # Dəyişikliklər tarixi (Keep a Changelog)
├── LICENSE             # MIT Lisenziyası
└── README.md           # Layihə sənədləşməsi
```

---

## 📄 Lisenziya

Bu layihə [MIT Lisenziyası](LICENSE) altında açıq mənbəlidir.
Sərbəst şəkildə istifadə edə, təkmilləşdirə və paylaya bilərsiniz.

---

🇦🇿 **Math-Engine-AZ** — Elm və təhsil üçün yaradılmış milli riyazi mühərrik.
