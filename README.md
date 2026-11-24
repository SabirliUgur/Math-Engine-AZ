# 🧮 Math-Engine-AZ (v2.5.0 — "Settings Hub, Stacked Fractions & Step-by-Step Solver")

Müasir, bölünmüş iş masalı (split-workspace), parametrlər panelli, ikidilli (Azərbaycan / English), haptik əks-əlaqəli, yığılmış kəsr və addım-addım həll mühərrikli **Elmi və Həndəsi Riyazi Mühərrik**.

[![Canlı Demo](https://img.shields.io/badge/Demo-Canlı%20Sayt-6366f1?style=for-the-badge&logo=githubpages&logoColor=white)](https://sabirliugur.github.io/Math-Engine-AZ/)
[![Lisenziya](https://img.shields.io/badge/Lisenziya-MIT-green?style=for-the-badge)](LICENSE)
[![Versiya](https://img.shields.io/badge/Versiya-v2.5.0-blue?style=for-the-badge)](CHANGELOG.md)
[![PWA Dəstəyi](https://img.shields.io/badge/PWA-Oflayn%20Dəstəkli-orange?style=for-the-badge)](manifest.json)

---

## 🌐 Canlı Keçid (Live Demo)
Tətbiqi heç bir quraşdırma tələb olunmadan birbaşa brauzerinizdə istifadə edin:  
👉 **[https://sabirliugur.github.io/Math-Engine-AZ/](https://sabirliugur.github.io/Math-Engine-AZ/)**

---

## 🚀 v2.5.0 Yenilikləri və Təkmilləşdirmələr

### 1. ⚙️ Parametrlər Bölməsi (Settings Hub) və İkidilli Dəstək (AZ / EN)
- **Sol Naviqasiyada Parametrlər**: 6-cı naviqasiya vərəqi kimi dişli çarx ikonu ilə xüsusi parametrlər mərkəzi.
- **Görünüş (Tema)**:
  - 3-seçimli seqment idarəetməsi: **`Aydınlıq`** (Light), **`Qaranlıq`** (Dark) və **`Avtomatik`** (Auto).
  - `Avtomatik` rejim seçildikdə əməliyyat sisteminin / brauzerin mövzusu (`prefers-color-scheme`) canlı izlənilir və dərhal uyğunlaşdırılır.
- **İnterfeys Dili**:
  - **`Azərbaycan`** və **`English`** dilləri arasında səhifəni yeniləmədən anlıq keçid (`js/i18n.js`).
- **Düymə Vibrasiyası (Haptic Feedback)**:
  - Dəstəklənən mobil brauzerlərdə (Android Chrome, Samsung Internet) düyməyə toxunarkən incə haptik əks-əlaqə (15ms). Kompüter və iOS-da səssiz ötürülür.
- **Estetik Təmizləmə**: Yuxarı sağdakı köhnə üzən tema düyməsi ləğv edildi, kartların yuxarı hizalanması tam düz və estetik hala gətirildi.

### 2. 📐 Yığılmış Kəsrlər (Stacked Fractions) və Addım-Addım Həll (Step-by-Step Solver)
- **Kəsr Düyməsi (`[ a/b ]`)**:
  - Elmi klaviaturaya xüsusi kəsr şablonu düyməsi əlavə edildi. Nəticə çıxdıqda onluq və kəsr formatları arasında keçid təmin edir.
  - Alternativ formlar: Düzgün/qeyri-düzgün kəsr ($\frac{n}{d}$), qarışıq kəsr ($W\frac{r}{d}$) və onluq kəsr formatları.
- **Şərti Həll Addımları vs 2D Qrafik**:
  - Kalkulyatorda sabit və ya sırf ədədi ifadələrdə (məs: `5/7 * 2`, `1/2 + 1/3`, `100 + 20%`, `(-3)^2`) statik qrafik əvəzinə sağ paneldə ətraflı **`Həll Addımları`** göstərilir.
  - İfadə daxilində dəyişən (`x`, məs: `2x + 1`, `sin(x)`) daxil edildikdə, sağ kart avtomatik olaraq 2D koordinat müstəvisinə (**`Vizual Model və Qrafik`**) keçir və funksiyanın qrafikini interaktiv çəkir.

### 3. 🎛️ Bəsit Klaviaturanın 6-cı Sətri və İkon Təmizliyi
- **Bəsit Klaviaturanın 6-cı Sətri**:
  - `[ 0 ]` (1 sütun), `[ . ]` (1 sütun) və `[ = ]` (2 sütun enində vurğulanmış bənövşəyi).
- **Vektor İkonlar**:
  - Bölmə başlıqlarındakı emojilər Material Symbols SVG vektor ikonları ilə əvəzləndi.

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
