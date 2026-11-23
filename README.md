# 🧮 Math-Engine-AZ (v2.0.0 — "Modern Split-Workspace UI & Dual-Theme Overhaul")

Müasir, bölünmüş iş masalı (split-workspace), yüksək dəqiqlikli, təhlükəsiz və tam oflayn işləyə bilən **Elmi və Həndəsi Kalkulyator Mühərriki**. İstifadəçi interfeysi tam **Azərbaycan dilində** hazırlanmışdır.

[![Canlı Demo](https://img.shields.io/badge/Demo-Canlı%20Sayt-6366f1?style=for-the-badge&logo=githubpages&logoColor=white)](https://sabirliugur.github.io/Math-Engine-AZ/)
[![Lisenziya](https://img.shields.io/badge/Lisenziya-MIT-green?style=for-the-badge)](LICENSE)
[![Versiya](https://img.shields.io/badge/Versiya-v2.0.0-blue?style=for-the-badge)](CHANGELOG.md)
[![PWA Dəstəyi](https://img.shields.io/badge/PWA-Oflayn%20Dəstəkli-orange?style=for-the-badge)](manifest.json)

---

## 🌐 Canlı Keçid (Live Demo)
Tətbiqi heç bir quraşdırma tələb olunmadan birbaşa brauzerinizdə istifadə edin:  
👉 **[https://sabirliugur.github.io/Math-Engine-AZ/](https://sabirliugur.github.io/Math-Engine-AZ/)**

---

## 🚀 v2.0.0 Yenilikləri və Təkmilləşdirmələr

### 1. 🖥️ İki Sütunlu Bölünmüş İş Masası (Split-Workspace Architecture)
- **Sol Panel (Sidebar, ~280px)**:
  - Minimalist həndəsi loqo və "Math Engine AZ" brend başlığı.
  - Şaquli naviqasiya vərəqləri (`Kalkulyator`, `Həndəsə`, `Cəbr`, `Analiz`, `Statistika`) və aktiv pill vurğusu (`#4F46E5`).
  - Sol panelə inteqrasiya edilmiş, müstəqil sürüşdürülə bilən **Tarixçə** paneli (kompakt **İxrac (.json)** və **Təmizlə** düymələri ilə). Kliklədikdə nəticə birbaşa daxil edilir (`Ans`).
  - Mobil cihazlar üçün intuitiv sürüşən menyu (drawer) və qaranlıq kölgəlik (backdrop).
- **Sağ Əsas Sahə (Main Workspace)**:
  - **Sol Kart**: İnteraktiv daxiletmə və hesablamalar.
  - **Sağ Kart (`Vizual Model və Qrafik`)**: Həndəsi koordinat toru (`coordinate grid pattern`) fonu, miqyaslama (zoom in, zoom out, reset) idarəediciləri və dinamik vizual vəziyyət göstəricisi.

### 2. 🎛️ Bəsit / Elmi Rejim Keçidi (Segmented Pill Toggle)
- Kalkulyatorun yuxarısında **Bəsit** və **Elmi** rejimləri arasında sürətli keçid imkanı.
- `Bəsit` rejim seçildikdə mürəkkəb elmi funksiyalar gizlədilir və 4 sütunlu böyüdülmüş bəsit klaviatura göstərilir.
- `Elmi` rejim seçildikdə tam 5 sütunlu qabaqcıl klaviatura nümayiş olunur.

### 3. 🌗 Yüksək Kontrastlı İkiqat Tema (Light & Dark)
- Həm İşıqlı (Light), həm də Qaranlıq (Dark) rejimlərdə mükəmməl rəng kontrastı, dəqiq `#E2E8F0` / `#2D3748` haşiyələr və aydın oxunan düymə yazıları.
- Yuxarı sağ küncdə Dark/Light keçid düyməsi.

### 4. 📈 İnteraktiv Qrafik İnteqrasiyası
- `Analiz -> Qrafik` seçildikdə, `<canvas>` funksiya qrafiki birbaşa sağ vizual kartda canlandırılır.

---

## 🧮 Tətbiqin Əsas Modulları

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
