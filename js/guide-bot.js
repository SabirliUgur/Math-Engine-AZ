/**
 * GuideBot v3.6.0 — 100% Offline Interactive Guide & Formula Assistant
 * Context-aware quick chips, bilingual (AZ/EN) curriculum search,
 * direct module navigation, and 4-step interactive Quick Tour.
 * Zero external dependencies or network APIs.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GuideBot = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const TOPICS = [
        {
            id: 'fractions',
            tab: 'calculator',
            keywords: ['kəsr', 'qarışıq', 'yuva', 'alt-alta', 'fraction', 'mixed', 'slot', 'navigation'],
            az: {
                title: 'Alt-alta və Qarışıq Kəsrlər',
                formula: '□/□  ·  □ □/□  ·  ← / →',
                desc: 'Elmi rejimdə □/□ düyməsi ilə şaquli kəsr, □ □/□ ilə qarışıq kəsr yaradın. Yuvalar arasında ← və → düymələri ilə keçid edin.'
            },
            en: {
                title: 'Stacked & Mixed Fractions',
                formula: '□/□  ·  □ □/□  ·  ← / →',
                desc: 'Use □/□ for stacked fractions and □ □/□ for mixed numbers. Navigate between slots using the ← and → keys.'
            }
        },
        {
            id: 'radicals',
            tab: 'calculator',
            keywords: ['kök', 'qüvvət', 'radikal', 'sqrt', 'power', 'exponent', 'radical', 'x^n'],
            az: {
                title: 'Kökaltı İfadələr və Qüvvət',
                formula: '√(x)  ·  xⁿ  ·  x²',
                desc: '√ düyməsi genişlənən kökaltı yuva açır, xⁿ isə üst indeks (eksponent) yuvası yaradır. DEL funksiyanı tək basışda atomik silir.'
            },
            en: {
                title: 'Radicals & Exponents',
                formula: '√(x)  ·  xⁿ  ·  x²',
                desc: 'The √ key opens an expanding radical slot, and xⁿ creates a superscript exponent slot. DEL atomically removes prefixes in one press.'
            }
        },
        {
            id: 'polygons',
            tab: 'geometry',
            keywords: ['çoxbucaqlı', 'dairə', 'kvadrat', 'üçbucaq', 'trapesiya', 'sahə', 'perimetr', 'polygon', 'circle', 'triangle', 'area'],
            az: {
                title: 'Müstəvi Fiqurları və Düzgün Çoxbucaqlılar',
                formula: 'S = (n·a²) / (4·tan(π/n))  ·  α = (n−2)·180°/n',
                desc: 'Həndəsə bölməsində dairə, üçbucaq, trapesiya və n-bucaqlı seçin. Daxiletmədə √3 və π simvollarından istifadə edə bilərsiniz.'
            },
            en: {
                title: '2D Plane Shapes & Regular Polygons',
                formula: 'S = (n·a²) / (4·tan(π/n))  ·  α = (n−2)·180°/n',
                desc: 'Select Circle, Triangle, Trapezoid, or Regular Polygons in Geometry. You can type √3 and π directly in input fields.'
            }
        },
        {
            id: 'solids',
            tab: 'geometry',
            keywords: ['konus', 'kub', 'silindr', 'piramida', 'kəsik', 'kürə', 'paralelepiped', 'həcm', 'cone', 'cube', 'cylinder', 'pyramid', 'frustum', 'sphere', 'volume'],
            az: {
                title: '3D Fəza Fiqurları (Konus, Silindr, Piramida)',
                formula: 'V_konus = (1/3)πr²h  ·  V_kəsik = (1/3)πh(R²+Rr+r²)',
                desc: 'Kub, paralelepiped, silindr, konus, piramida, kəsik konus və kürə üçün həcm, yan/tam səth sahəsi və wireframe SVG çertyoj.'
            },
            en: {
                title: '3D Solid Geometry (Cone, Cylinder, Pyramid)',
                formula: 'V_cone = (1/3)πr²h  ·  V_frustum = (1/3)πh(R²+Rr+r²)',
                desc: 'Compute volume, lateral/total surface area, and view wireframe 2D SVG diagrams for Cube, Cuboid, Cylinder, Cone, Pyramid, Frustum, and Sphere.'
            }
        },
        {
            id: 'coordinate',
            tab: 'geometry',
            keywords: ['koordinat', 'məsafə', 'orta nöqtə', 'bucaq əmsalı', 'düz xətt', 'coordinate', 'distance', 'midpoint', 'slope'],
            az: {
                title: 'Koordinatlar Metodu',
                formula: '|AB| = √((x₂−x₁)² + (y₂−y₁)²)  ·  y = kx + b',
                desc: 'İki A(x₁,y₁) və B(x₂,y₂) nöqtəsi arasındakı məsafəni, orta nöqtə M-i, bucaq əmsalı k-nı və düz xətt tənliyini hesablayır.'
            },
            en: {
                title: 'Coordinate Method',
                formula: '|AB| = √((x₂−x₁)² + (y₂−y₁)²)  ·  y = kx + b',
                desc: 'Finds the distance |AB|, midpoint M, slope k, and line equation between two points A(x₁,y₁) and B(x₂,y₂).'
            }
        },
        {
            id: 'vectors',
            tab: 'geometry',
            keywords: ['vektor', 'skalyar', 'hasil', 'bucaq', 'vector', 'dot', 'magnitude', 'angle'],
            az: {
                title: 'Müstəvi Vektorları',
                formula: 'u·v = x₁x₂ + y₁y₂  ·  cos(θ) = (u·v)/(|u|·|v|)',
                desc: 'u ve v vektorlarının cəmini, fərqini, modullarını, skalyar hasilini və aralarındakı θ bucağını ox uclu SVG diaqramla göstərir.'
            },
            en: {
                title: '2D Plane Vectors',
                formula: 'u·v = x₁x₂ + y₁y₂  ·  cos(θ) = (u·v)/(|u|·|v|)',
                desc: 'Calculates vector sum, difference, magnitudes, dot product, and angle θ with an arrowed 2D vector diagram.'
            }
        },
        {
            id: 'quadratic',
            tab: 'algebra',
            subtab: 'quadratic',
            keywords: ['kvadrat', 'diskriminant', 'kök', 'tənlik', 'quadratic', 'discriminant', 'roots', 'vieta'],
            az: {
                title: 'Kvadrat Tənlik və Diskriminant',
                formula: 'D = b² − 4ac  ·  x = (−b ± √D) / (2a)',
                desc: 'ax² + bx + c = 0 tənliyinin diskriminantını, həqiqi/kompleks köklərini və Viyet teoremi cəm/hasilini hesablayır.'
            },
            en: {
                title: 'Quadratic Equation & Discriminant',
                formula: 'D = b² − 4ac  ·  x = (−b ± √D) / (2a)',
                desc: 'Solves ax² + bx + c = 0 with discriminant D, real/complex roots, and Vieta sum/product.'
            }
        },
        {
            id: 'complex',
            tab: 'algebra',
            subtab: 'complex',
            keywords: ['kompleks', 'arqan', 'qoşma', 'modul', 'xəyali', 'complex', 'argand', 'conjugate', 'modulus'],
            az: {
                title: 'Kompleks Ədədlər və Arqan Müstəvisi',
                formula: 'z = a + bi  ·  |z| = √(a² + b²)  ·  z̄ = a − bi',
                desc: 'z₁ və z₂ kompleks ədədləri üzərində +, −, ×, ÷ əməlləri, qoşma, modul, arqument və Arqan müstəvisi qrafiki.'
            },
            en: {
                title: 'Complex Numbers & Argand Plane',
                formula: 'z = a + bi  ·  |z| = √(a² + b²)  ·  z̄ = a − bi',
                desc: 'Performs +, −, ×, ÷ on z₁ and z₂ along with conjugates, moduli, arguments, and an interactive Argand diagram.'
            }
        },
        {
            id: 'inequality',
            tab: 'algebra',
            subtab: 'inequality',
            keywords: ['bərabərsizlik', 'interval', 'parabola', 'inequality', 'intervals'],
            az: {
                title: 'Kvadrat və Xətti Bərabərsizliklər',
                formula: 'ax² + bx + c > 0  ⇒  (−∞, x₁) ∪ (x₂, +∞)',
                desc: 'Kvadrat və xətti bərabərsizliklərin dəqiq interval həllini tapır və x-oxu üzərində işıqlandırılmış qrafiklə göstərir.'
            },
            en: {
                title: 'Quadratic & Linear Inequalities',
                formula: 'ax² + bx + c > 0  ⇒  (−∞, x₁) ∪ (x₂, +∞)',
                desc: 'Finds exact interval solutions for quadratic and linear inequalities and highlights them on the x-axis.'
            }
        },
        {
            id: 'gp',
            tab: 'algebra',
            subtab: 'gp',
            keywords: ['həndəsi silsilə', 'silsilə', 'sonsuz', 'vuruq', 'geometric progression', 'sequence', 'infinite sum'],
            az: {
                title: 'Həndəsi Silsilə',
                formula: 'bₙ = b₁·qⁿ⁻¹  ·  Sₙ = b₁(qⁿ−1)/(q−1)  ·  S = b₁/(1−q)',
                desc: 'n-ci həddi, ilk n həddin cəmini və |q| < 1 olduqda sonsuz azalan silsilənin cəmini diskret qrafiklə hesablayır.'
            },
            en: {
                title: 'Geometric Progression',
                formula: 'bₙ = b₁·qⁿ⁻¹  ·  Sₙ = b₁(qⁿ−1)/(q−1)  ·  S = b₁/(1−q)',
                desc: 'Computes the n-th term, partial sum Sₙ, infinite sum when |q| < 1, and plots discrete terms.'
            }
        },
        {
            id: 'derivative',
            tab: 'analysis',
            subtab: 'derivative',
            keywords: ['törəmə', 'diferensial', 'derivative', 'diff', 'dx'],
            az: {
                title: 'Simvolik Törəmə',
                formula: 'd/dx [f(x)] = f′(x)',
                desc: 'Polinom, triqonometrik, loqarifmik və mürəkkəb funksiyaların simvolik törəməsini AST mühərriki ilə tapır.'
            },
            en: {
                title: 'Symbolic Derivative',
                formula: 'd/dx [f(x)] = f′(x)',
                desc: 'Computes symbolic derivatives of polynomials, trigonometric, logarithmic, and composite functions via AST.'
            }
        },
        {
            id: 'integral',
            tab: 'analysis',
            subtab: 'integral',
            keywords: ['inteqral', 'simpson', 'müəyyən', 'integral', 'definite'],
            az: {
                title: 'Müəyyən İnteqral (Simpson Qaydası)',
                formula: '∫[a, b] f(x) dx  (n = 1000)',
                desc: 'Verilmiş [a, b] parçasında funksiyanın müəyyən inteqralını yüksək dəqiqlikli Simpson 1/3 qaydası ilə hesablayır.'
            },
            en: {
                title: 'Definite Integral (Simpson\'s Rule)',
                formula: '∫[a, b] f(x) dx  (n = 1000)',
                desc: 'Evaluates definite integrals over [a, b] using high-precision Simpson\'s 1/3 rule.'
            }
        },
        {
            id: 'limit',
            tab: 'analysis',
            subtab: 'limit',
            keywords: ['limit', 'kəsilmə', 'asimptot', 'sonsuzluq', 'inf', 'discontinuity', 'asymptote', 'infinity'],
            az: {
                title: 'Funksiya Limiti (v3.5.0)',
                formula: 'lim (x → a) f(x)  ·  x → a⁻ / x → a⁺ / ±∞',
                desc: 'Sol, sağ və ikitərəfli limitləri hesablayır, aradan qaldırıla bilən və sıçrayışlı kəsilmələri aşkarlayıb qrafikdə (a, L) nöqtəsini işarələyir.'
            },
            en: {
                title: 'Function Limits (v3.5.0)',
                formula: 'lim (x → a) f(x)  ·  x → a⁻ / x → a⁺ / ±∞',
                desc: 'Computes left, right, and two-sided limits, detects removable/jump discontinuities, and marks (a, L) on the plot.'
            }
        },
        {
            id: 'graph',
            tab: 'analysis',
            subtab: 'graph',
            keywords: ['qrafik', 'ikiqat', 'kəsişmə', 'crosshair', 'graph', 'plot', 'dual', 'intersection'],
            az: {
                title: 'İnteraktiv Qrafik 2.0 (f(x) & g(x))',
                formula: 'f(x) = 0  ·  f(x) = g(x)  ·  (x, f(x))',
                desc: 'Eyni müstəvidə iki funksiya çəkir, kökləri və kəsişmə nöqtələrini tapır, kursor üzərində canlı koordinatları göstərir.'
            },
            en: {
                title: 'Interactive Graph 2.0 (f(x) & g(x))',
                formula: 'f(x) = 0  ·  f(x) = g(x)  ·  (x, f(x))',
                desc: 'Plots dual functions f(x) and g(x), highlights roots and intersections, and shows live crosshair coordinates.'
            }
        },
        {
            id: 'statistics',
            tab: 'statistics',
            subtab: 'stats',
            keywords: ['statistika', 'orta', 'median', 'moda', 'dispersiya', 'standart', 'qrafik', 'statistics', 'mean', 'variance', 'bar chart'],
            az: {
                title: 'Statistika və Paylanma Sütun Qrafiki',
                formula: 'x̄ = Σxᵢ / n  ·  σ = √(Σ(xᵢ − x̄)² / n)',
                desc: 'Ədədi orta, median, moda, dispersiya və standart kənarlaşmanı hesablayır; sağ paneldə orta xətli (Orta: x̄) sütun qrafiki çəkir.'
            },
            en: {
                title: 'Statistics & Mean Bar Chart',
                formula: 'x̄ = Σxᵢ / n  ·  σ = √(Σ(xᵢ − x̄)² / n)',
                desc: 'Computes mean, median, mode, variance, and std deviation, rendering a responsive bar chart with a dashed Mean indicator line.'
            }
        },
        {
            id: 'numbertheory',
            tab: 'statistics',
            subtab: 'numbertheory',
            keywords: ['əbob', 'əkob', 'sadə', 'vuruq', 'permutasiya', 'aranjeman', 'kombinezon', 'gcd', 'lcm', 'prime', 'permutation', 'combination'],
            az: {
                title: 'ƏBOB, ƏKOB və Kombinatorika',
                formula: 'Pₙ = n!  ·  Aₙᵏ = n!/(n−k)!  ·  Cₙᵏ = n!/(k!(n−k)!)',
                desc: 'Çoxlu tam ədədlər üçün ƏBOB/ƏKOB, sadə vuruqlara ayırma, eləcə də Pₙ, Aₙᵏ və Cₙᵏ hesablamaları.'
            },
            en: {
                title: 'GCD, LCM & Combinatorics',
                formula: 'Pₙ = n!  ·  Aₙᵏ = n!/(n−k)!  ·  Cₙᵏ = n!/(k!(n−k)!)',
                desc: 'Computes GCD, LCM, prime factorization, permutations Pₙ, arrangements Aₙᵏ, and combinations Cₙᵏ.'
            }
        },
        {
            id: 'matrix',
            tab: 'statistics',
            subtab: 'matrix',
            keywords: ['matris', 'determinant', 'matrix', 'det'],
            az: {
                title: 'Matris Əməliyyatları (2×2 & 3×3)',
                formula: 'A + B  ·  A − B  ·  A × B  ·  |A|',
                desc: '2×2 və 3×3 matrislər üzərində toplama, çıxma, vurma və determinant hesablamaları.'
            },
            en: {
                title: 'Matrix Operations (2×2 & 3×3)',
                formula: 'A + B  ·  A − B  ·  A × B  ·  |A|',
                desc: 'Addition, subtraction, multiplication, and determinant calculation for 2×2 and 3×3 matrices.'
            }
        }
    ];

    const CONTEXT_CHIPS = {
        calculator: ['fractions', 'radicals', 'limit'],
        geometry: ['polygons', 'solids', 'vectors', 'coordinate'],
        algebra: ['quadratic', 'complex', 'inequality', 'gp'],
        analysis: ['limit', 'graph', 'derivative', 'integral'],
        statistics: ['statistics', 'numbertheory', 'matrix'],
        settings: ['fractions', 'limit', 'statistics']
    };

    const TOUR_STEPS = [
        {
            target: '#calcExpression',
            tab: 'calculator',
            az: { title: '1. Vizual Kəsr və Yuva Redaktoru', desc: 'Kəsrlər (□/□), qarışıq kəsrlər (□ □/□) və qüvvətlər burada canlı yuvalarla redaktə olunur.' },
            en: { title: '1. Visual Fraction & Slot Editor', desc: 'Edit stacked fractions (□/□), mixed numbers (□ □/□), and exponents in interactive slots.' }
        },
        {
            target: '#rightWorkspaceCard',
            tab: 'calculator',
            az: { title: '2. Addım-addım Həll və Alternativ Formlar', desc: 'Sağ paneldə ifadənin PEMDAS addımları, düzgün/qarışıq kəsr və onluq formaları göstərilir.' },
            en: { title: '2. Step-by-Step Solution & Alt Forms', desc: 'The right panel displays PEMDAS solution steps along with fraction, mixed, and decimal forms.' }
        },
        {
            target: '#visualViewport',
            tab: 'analysis',
            subtab: 'graph',
            az: { title: '3. 2D/3D Vizualizasiya və Qrafik 2.0', desc: 'Həndəsə çertyojları, statistik sütun qrafikləri, limit nöqtələri və ikiqat funksiya qrafikləri burada görünür.' },
            en: { title: '3. 2D/3D Visualizations & Graph 2.0', desc: 'Geometry diagrams, statistical bar charts, limit markers, and dual-function plots appear here.' }
        },
        {
            target: '[data-tab="settings"]',
            tab: 'settings',
            az: { title: '4. Oflayn PWA və Ayarlar', desc: 'Açıq/Qaranlıq tema, AZ/EN dili, vibrasiya və oflayn keş statusunu buradan idarə edin.' },
            en: { title: '4. Offline PWA & Settings', desc: 'Manage Light/Dark theme, AZ/EN language, haptic feedback, and offline cache status here.' }
        }
    ];

    function getActiveLang(explicitLang) {
        if (explicitLang === 'az' || explicitLang === 'en') return explicitLang;
        if (typeof window !== 'undefined' && window.I18n && typeof window.I18n.getLanguage === 'function') {
            return window.I18n.getLanguage();
        }
        return 'az';
    }

    function getActiveTabId() {
        if (typeof document === 'undefined') return 'calculator';
        const btn = document.querySelector('.tab-btn.active');
        return (btn && btn.dataset && btn.dataset.tab) ? btn.dataset.tab : 'calculator';
    }

    /**
     * Get 3-4 context-aware topic objects for the active tab.
     */
    function getQuickChips(tabId, lang) {
        const ids = CONTEXT_CHIPS[tabId] || CONTEXT_CHIPS.calculator;
        const l = getActiveLang(lang);
        return ids.map(id => {
            const topic = TOPICS.find(t => t.id === id);
            if (!topic) return null;
            return {
                id: topic.id,
                tab: topic.tab,
                subtab: topic.subtab || null,
                title: topic[l].title,
                formula: topic[l].formula,
                desc: topic[l].desc
            };
        }).filter(Boolean);
    }

    /**
     * Search offline curriculum knowledge base in AZ or EN.
     */
    function searchTopics(query, lang) {
        const l = getActiveLang(lang);
        const q = String(query || '').trim().toLowerCase();
        if (!q) return [];

        const scored = [];
        for (const topic of TOPICS) {
            const loc = topic[l];
            let score = 0;
            for (const kw of topic.keywords) {
                const k = kw.toLowerCase();
                if (k === q) score += 100;
                else if (k.startsWith(q)) score += 60;
                else if (k.includes(q) || q.includes(k)) score += 35;
            }
            if (loc.title.toLowerCase().includes(q)) score += 40;
            if (loc.desc.toLowerCase().includes(q)) score += 15;
            if (loc.formula.toLowerCase().includes(q)) score += 10;

            if (score > 0) {
                scored.push({
                    score,
                    id: topic.id,
                    tab: topic.tab,
                    subtab: topic.subtab || null,
                    title: loc.title,
                    formula: loc.formula,
                    desc: loc.desc
                });
            }
        }

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, 5);
    }

    function getTopicById(id, lang) {
        const l = getActiveLang(lang);
        const topic = TOPICS.find(t => t.id === id);
        if (!topic) return null;
        return {
            id: topic.id,
            tab: topic.tab,
            subtab: topic.subtab || null,
            title: topic[l].title,
            formula: topic[l].formula,
            desc: topic[l].desc
        };
    }

    // ---- Browser DOM Controller ----
    let isOpen = false;
    let selectedTopicId = null;
    let tourIndex = -1;

    function clearTourHighlight() {
        if (typeof document === 'undefined') return;
        document.querySelectorAll('.guide-tour-highlight').forEach(el => {
            el.classList.remove('guide-tour-highlight');
        });
    }

    function navigateTo(tabId, subtabId) {
        if (typeof window !== 'undefined' && typeof window.navigateToModule === 'function') {
            window.navigateToModule(tabId, subtabId);
            return;
        }
        if (typeof document === 'undefined') return;
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (tabBtn) tabBtn.click();
        if (subtabId) {
            const sec = document.getElementById(`sec-${tabId}`);
            const subBtn = sec ? sec.querySelector(`.sub-tab[data-subtab="${subtabId}"]`) : null;
            if (subBtn) subBtn.click();
        }
    }

    function esc(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function renderPopover() {
        if (typeof document === 'undefined') return;
        const popover = document.getElementById('guideBotPopover');
        if (!popover) return;

        const lang = getActiveLang();
        const isEn = lang === 'en';
        const activeTab = getActiveTabId();

        const titleEl = document.getElementById('guideBotTitle');
        const tourBtn = document.getElementById('guideBotTourBtn');
        const searchInput = document.getElementById('guideBotSearch');
        const chipsEl = document.getElementById('guideBotChips');
        const bodyEl = document.getElementById('guideBotBody');

        if (titleEl) titleEl.textContent = isEn ? 'Interactive Guide' : 'İnteraktiv Bələdçi';
        if (tourBtn) tourBtn.textContent = isEn ? 'Quick Tour' : 'İnterfeys turu';
        if (searchInput) searchInput.placeholder = isEn ? 'Search formula or topic (e.g. cone, limit)...' : 'Formula və ya mövzu axtar (məs: konus, limit)...';

        // Tour mode
        if (tourIndex >= 0 && tourIndex < TOUR_STEPS.length) {
            const step = TOUR_STEPS[tourIndex];
            const loc = step[lang];
            if (chipsEl) chipsEl.innerHTML = '';
            if (bodyEl) {
                bodyEl.innerHTML = `
                    <div class="guide-topic-card">
                        <div class="guide-topic-title">${esc(loc.title)}</div>
                        <p class="guide-topic-desc">${esc(loc.desc)}</p>
                        <div class="guide-tour-controls">
                            <button type="button" class="guide-nav-btn" data-tour-action="prev" ${tourIndex === 0 ? 'disabled' : ''}>${isEn ? 'Back' : 'Geri'}</button>
                            <span class="guide-tour-step">${tourIndex + 1} / ${TOUR_STEPS.length}</span>
                            <button type="button" class="guide-nav-btn is-primary" data-tour-action="next">${tourIndex === TOUR_STEPS.length - 1 ? (isEn ? 'Finish' : 'Bitir') : (isEn ? 'Next' : 'Növbəti')}</button>
                        </div>
                    </div>
                `;
            }
            return;
        }

        // Context-aware quick chips
        const chips = getQuickChips(activeTab, lang);
        if (chipsEl) {
            chipsEl.innerHTML = chips.map(c =>
                `<button type="button" class="guide-chip ${selectedTopicId === c.id ? 'active' : ''}" data-topic-id="${esc(c.id)}">${esc(c.title)}</button>`
            ).join('');
        }

        // Search results or selected chip card
        const query = searchInput ? searchInput.value.trim() : '';
        let items = [];
        if (query) {
            items = searchTopics(query, lang);
        } else if (selectedTopicId) {
            const t = getTopicById(selectedTopicId, lang);
            if (t) items = [t];
        } else if (chips.length > 0) {
            items = [chips[0]];
        }

        if (bodyEl) {
            if (query && items.length === 0) {
                bodyEl.innerHTML = `<div class="guide-empty">${isEn ? 'No matching topic found.' : 'Uyğun mövzu tapılmadı.'}</div>`;
            } else {
                bodyEl.innerHTML = items.map(item => `
                    <div class="guide-topic-card">
                        <div class="guide-topic-title">${esc(item.title)}</div>
                        <div class="guide-topic-formula">${esc(item.formula)}</div>
                        <p class="guide-topic-desc">${esc(item.desc)}</p>
                        <button type="button" class="guide-open-btn" data-open-tab="${esc(item.tab)}" data-open-subtab="${esc(item.subtab || '')}">
                            ${isEn ? 'Open Module' : 'Bölməyə keç'} →
                        </button>
                    </div>
                `).join('');
            }
        }
    }

    function applyTourStep(idx) {
        clearTourHighlight();
        tourIndex = idx;
        if (tourIndex < 0 || tourIndex >= TOUR_STEPS.length) {
            tourIndex = -1;
            renderPopover();
            return;
        }
        const step = TOUR_STEPS[tourIndex];
        navigateTo(step.tab, step.subtab);
        setTimeout(() => {
            const el = document.querySelector(step.target);
            if (el) {
                el.classList.add('guide-tour-highlight');
                if (typeof el.scrollIntoView === 'function') {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
            renderPopover();
        }, 60);
    }

    function init() {
        if (typeof document === 'undefined') return;
        const trigger = document.getElementById('guideBotTrigger');
        const popover = document.getElementById('guideBotPopover');
        const closeBtn = document.getElementById('guideBotClose');
        const tourBtn = document.getElementById('guideBotTourBtn');
        const searchInput = document.getElementById('guideBotSearch');
        const chipsEl = document.getElementById('guideBotChips');
        const bodyEl = document.getElementById('guideBotBody');

        if (!trigger || !popover) return;

        const toggle = (force) => {
            isOpen = typeof force === 'boolean' ? force : !isOpen;
            popover.classList.toggle('hidden', !isOpen);
            trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (!isOpen) {
                tourIndex = -1;
                clearTourHighlight();
            } else {
                renderPopover();
            }
        };

        trigger.addEventListener('click', () => toggle());
        if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));

        if (tourBtn) {
            tourBtn.addEventListener('click', () => {
                applyTourStep(0);
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                tourIndex = -1;
                clearTourHighlight();
                renderPopover();
            });
        }

        if (chipsEl) {
            chipsEl.addEventListener('click', (e) => {
                const chip = e.target.closest('[data-topic-id]');
                if (!chip) return;
                selectedTopicId = chip.dataset.topicId;
                if (searchInput) searchInput.value = '';
                tourIndex = -1;
                clearTourHighlight();
                renderPopover();
            });
        }

        if (bodyEl) {
            bodyEl.addEventListener('click', (e) => {
                const openBtn = e.target.closest('[data-open-tab]');
                if (openBtn) {
                    const tab = openBtn.dataset.openTab;
                    const subtab = openBtn.dataset.openSubtab || undefined;
                    navigateTo(tab, subtab);
                    toggle(false);
                    return;
                }
                const tourNav = e.target.closest('[data-tour-action]');
                if (tourNav) {
                    const act = tourNav.dataset.tourAction;
                    if (act === 'prev') applyTourStep(tourIndex - 1);
                    else if (act === 'next') applyTourStep(tourIndex + 1);
                }
            });
        }

        // Refresh chips & labels on tab change or language change
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (isOpen && tourIndex === -1) {
                    selectedTopicId = null;
                    setTimeout(renderPopover, 20);
                }
            });
        });

        if (typeof window !== 'undefined') {
            window.addEventListener('languagechange', () => {
                if (isOpen) renderPopover();
            });
        }
    }

    return {
        TOPICS,
        CONTEXT_CHIPS,
        TOUR_STEPS,
        getQuickChips,
        searchTopics,
        getTopicById,
        init,
        renderPopover
    };
}));
