# 🧮 Math-Engine-AZ (v1.5.0 — "Core Precision & Offline Engine")

Müasir, yüksək dəqiqlikli, təhlükəsiz və tam oflayn işləyə bilən **Elmi və Həndəsi Kalkulyator Mühərriki**. İstifadəçi interfeysi tam **Azərbaycan dilində** hazırlanmışdır.

[![Canlı Demo](https://img.shields.io/badge/Demo-Canlı%20Sayt-6366f1?style=for-the-badge&logo=githubpages&logoColor=white)](https://sabirliugur.github.io/Math-Engine-AZ/)
[![Lisenziya](https://img.shields.io/badge/Lisenziya-MIT-green?style=for-the-badge)](LICENSE)
[![Versiya](https://img.shields.io/badge/Versiya-v1.5.0-blue?style=for-the-badge)](CHANGELOG.md)
[![PWA Dəstəyi](https://img.shields.io/badge/PWA-Oflayn%20Dəstəkli-orange?style=for-the-badge)](manifest.json)

---

## 🌐 Canlı Keçid (Live Demo)
Tətbiqi heç bir quraşdırma tələb olunmadan birbaşa brauzerinizdə istifadə edin:  
👉 **[https://sabirliugur.github.io/Math-Engine-AZ/](https://sabirliugur.github.io/Math-Engine-AZ/)**

---

## 🚀 v1.5.0 Yenilikləri və Əsas Xüsusiyyətlər

### 1. 🛡️ Təhlükəsiz Riyazi Parser (`MathCore`)
- **Şantinq-Yard (Shunting-Yard / RPN) Alqoritmi**: `eval()` və `new Function()` metodlarından tamamilə imtina edilmişdir. İfadələrin analizi deterministik və təhlükəsiz leksik mühərriklə icra olunur.
- **Qeyri-Aşkar Vurma (Implicit Multiplication)**: `2x`, `2(x+1)`, `2sin(x)`, `(x+1)(x-1)`, `2pi`, `5!2` kimi riyazi yazılışlar avtomatik tanınır.
- **Düzgün Assosiativlik və Unar Mənfi**: `2^3^2 = 512` (sağdan sola qüvvət), `-2^2 = -4`, `(-2)^2 = 4`, `2^-3 = 0.125`.
- **Trigonometrik Rejimlər**: Dərəcə (`DEG`) və Radian (`RAD`) rejimlərində dəqiq hesablamalar, `tan(90°)` və `cot(0°)` kimi asimptotlarda qoruyucu yoxlamalar.

### 2. 🎯 IEEE-754 Üzən Nöqtə Dəqiqliyi (`MathCore.cleanPrecision`)
- Kompüter arxitekturasında yaranan xətalar (`0.1 + 0.2 = 0.30000000000000004`) avtomatik təmizlənir (`0.1 + 0.2 === 0.3`).
- Dövri və asimptotik dəyərlər normallaşdırılır (`sin(π) = 0`, `cos(90°) = 0`).
- Dəqiqlik təmizləyicisi kalkulyator, həndəsə, cəbr, statistika və matrislər daxil olmaqla bütün tətbiqə tətbiq olunmuşdur.

### 3. 📱 Progressive Web App (PWA) & 100% Oflayn Rejim
- **Quraşdırıla bilən Tətbiq**: Kompüterdə (Chrome, Edge) və telefonda (Android, iOS) yerli tətbiq kimi quraşdırıla bilir.
- **Service Worker (`sw.js`)**: *Network-First with Cache Fallback* strategiyası sayəsində internet olan zaman yeniləmələri dərhal alır, internet kəsildikdə isə tam oflayn işləyir.
- **PWA İkonları**: Yüksək keyfiyyətli `icon-192.png` və `icon-512.png` nişanları ilə təmin olunmuşdur.

### 4. 📜 Davamlı Tarixçə & `Ans` Yaddaşı
- Son hesablamalar `localStorage` üzərində (`math_engine_az_history_v1`) saxlanılır və səhifə yeniləndikdə itmir (maksimum 100 qeyd).
- Tarixçədəki istənilən qeydin üzərinə kliklədikdə son nəticə aktiv sahəyə və ya kalkulyatora daxil edilir.
- Tarixçəni JSON faylı kimi kompüterə ixrac etmək üçün **📥 İxrac** düyməsi əlavə edilmişdir.

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
