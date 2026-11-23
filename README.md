# 🧮 Math-Engine-AZ (v1.7.0 — "Expression Geometry, Percentage Engine & Bug Fixes")

Müasir, yüksək dəqiqlikli, təhlükəsiz və tam oflayn işləyə bilən **Elmi və Həndəsi Kalkulyator Mühərriki**. İstifadəçi interfeysi tam **Azərbaycan dilində** hazırlanmışdır.

[![Canlı Demo](https://img.shields.io/badge/Demo-Canlı%20Sayt-6366f1?style=for-the-badge&logo=githubpages&logoColor=white)](https://sabirliugur.github.io/Math-Engine-AZ/)
[![Lisenziya](https://img.shields.io/badge/Lisenziya-MIT-green?style=for-the-badge)](LICENSE)
[![Versiya](https://img.shields.io/badge/Versiya-v1.7.0-blue?style=for-the-badge)](CHANGELOG.md)
[![PWA Dəstəyi](https://img.shields.io/badge/PWA-Oflayn%20Dəstəkli-orange?style=for-the-badge)](manifest.json)

---

## 🌐 Canlı Keçid (Live Demo)
Tətbiqi heç bir quraşdırma tələb olunmadan birbaşa brauzerinizdə istifadə edin:  
👉 **[https://sabirliugur.github.io/Math-Engine-AZ/](https://sabirliugur.github.io/Math-Engine-AZ/)**

---

## 🚀 v1.7.0 Yenilikləri və Təkmilləşdirmələr

### 1. 📊 Postfiks Faiz (`%`) Mühərriki
- **Həqiqi Kalkulyator Faizi**: `%` operatoru binar qalıqdan tam hüquqlu postfiks faiz operatoruna çevrilmişdir.
- **Sərbəst və Vurma/Bölmə Faizi**: `70% = 0.7`, `100 × (70%) = 70`, `100 × 70% = 70`, `200 ÷ 50% = 400`.
- **Toplama və Çıxma Faizi**: `A + B% = A + (A · B / 100)` (məs: `100 + 20% = 120`), `A - B% = 80`.
- **Zəncirvari Hesablamalar**: `100 + 20% + 10% = 132`.

### 2. ⚡ Mənfi Əsaslı Qüvvət UX (`(-3)^2`)
- Mənfi ədəd daxil edildikdə və ya `±` ilə işarə dəyişdirildikdə, ardınca `x²` və ya `xⁿ` basıldıqda mənfi əsas avtomatik mötərizəyə alınır: məsələn, `-3` ardınca `x²` vurulduqda ekranda `(-3)^2` formalaşır və düzgün olaraq `9` nəticəsini verir.
- Riyazi cəbr qaydaları qorunur: `(-3)^2 === 9` və `-3^2 === -9`.

### 3. 📐 Həndəsədə Simvolik İfadə Daxiletməsi (`√`, `π`, `/`, `^`)
- `MathCore` unaykod radikal simvolu `√` birbaşa dəstəkləyir (`√3`, `√(3+1)`, `2√3`, `√3/2`, `2√5`, `π`).
- Bütün həndəsi daxiletmə sahələri mətn rejiminə keçirilib; istifadəçilər birbaşa `√3`, `2√5`, `π/2` daxil edə bilərlər.
- Mobil cihazlar üçün bir toxunuşla simvol daxiletmə köməkçi paneli (`√`, `π`, `/`, `^`, `(`, `)`) əlavə edilmişdir.

### 4. 📐 Düzbucaqlı Üçbucaq: Katet və Hipotenuz Rejimi
- **Yeni Hesablama Modu**: Üçbucaq bölməsində `"Düzbucaqlı: Katet və hipotenuz"` seçimi.
- Katet `a` və hipotenuz `c` üçün avtomatik `c > a` yoxlanışı.
- Məchul katet `b = √(c² − a²)`, perimetr `P`, sahə `S` və iti bucaqlar `α`, `β` dərəcə ilə hesablanır.

### 5. 📱 Ekranda Dinamik Mətn və Şrift Tənzimləməsi
- Uzun Azərbaycan xəta bildirişləri (`"Riyazi əməl və ya ədəd çatışmır"`) mobil ekranlarda heç vaxt kəsilmir (`is-error`, `text-long` dinamik sinifləri ilə avtomatik sətrə keçid və şrift kiçilməsi).
- PWA keş versiyası `'math-engine-az-v1.7.0'` ilə tam oflayn sinxronlaşdırılmışdır.

---

## 🧮 Tətbiqin Modulları

| Bölmə | Əsas Funksiyalar |
|---|---|
| **🔢 Standart və Elmi Kalkulyator** | Əsas əməllər, `sin`, `cos`, `tan`, `cot`, `asin`, `acos`, `atan`, `ln`, `log`, `√`, `∛`, `x²`, `xⁿ`, `n!`, `π`, `e`, `DEG`/`RAD`, klaviatura dəstəyi. |
| **📐 Həndəsə (Ağıllı Hesablama)** | Dairə, Kvadrat, Düzbucaqlı, Üçbucaq (3 fərqli hesablama üsulu, o cümlədən Heron və Pifaqor), Trapesiya, Kub, Silindr, Kürə, Konus. Hər addımda istifadə olunan riyazi düstur ekranda nümayiş olunur. |
| **✖️ Cəbr və Tənliklər** | Kvadrat tənliklərin həlli (diskriminant, həqiqi və kompleks köklər), 2 və 3 məchullu xətti tənliklər sistemi (Kramer qaydası), 5 növ faiz hesablama, ədədi və həndəsi silsilələr. |
| **📈 Riyazi Analiz** | Analitik simvolik törəmə (`d/dx`), Simpson qaydası ilə müəyyən inteqral, HTML5 Canvas ilə funksiyanın interaktiv qrafiki. |
| **🎲 Statistika və Matrislər** | Ədədi orta, median, moda, dispersiya, standart kənarlaşma, Permutasiya $P(n, r)$, Kombinasiya $C(n, r)$, 2×2 və 3×3 matrislərin toplanması, çıxılması, vurulması və determinantı. |

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
├── index.html          # Əsas HTML5 strukturu və modul teqləri
├── style.css           # Bütün mövzu (Dark/Light) və responsive CSS qaydaları
├── app.js              # UI qarşılıqlı əlaqəsi və idarəetmə kontrolleri
├── js/
│   └── math-core.js    # MathCore: Şantinq-Yard parseri, dəqiqlik mühərriki, törəmə və tarixçə
├── sw.js               # Service Worker (Network-First oflayn keşləmə)
├── manifest.json       # PWA manifesti
├── icon-192.png        # 192x192 PWA tətbiq nişanı
├── icon-512.png        # 512x512 PWA tətbiq nişanı
├── CHANGELOG.md        # Dəyişikliklər tarixi (Keep a Changelog)
├── LICENSE             # MIT Lisenziyası
└── README.md           # Layihə sənədləşməsi
```

---

## 🛣️ İnkişaf Yol Xəritəsi (Roadmap)

- **v1.6.0 — Addım-addım Həll Mühərriki (Step-by-Step Solver)**:
  - Kvadrat tənliklər və xətti sistemlər üçün hər aralıq addımın izahlı açılışı.
  - Törəmə və inteqral qaydalarının mərhələli vizual izahı.
- **v1.7.0 — İnteraktiv Çoxfunksiyalı Qrafik 2.0 (Multi-Function Graph 2.0)**:
  - Eyni anda bir neçə funksiyanın ($f(x), g(x)$) qrafikinin kəsişmə nöqtələri ilə çəkilməsi.
  - Siçan və toxunuşla miqyaslama (zoom) və sürüşdürmə (pan) imkanları.

---

## 📄 Lisenziya

Bu layihə [MIT Lisenziyası](LICENSE) altında açıq mənbəlidir.
Sərbəst şəkildə istifadə edə, təkmilləşdirə və paylaya bilərsiniz.

---

🇦🇿 **Math-Engine-AZ** — Elm və təhsil üçün yaradılmış milli riyazi mühərrik.
