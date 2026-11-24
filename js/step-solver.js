/**
 * StepSolver — Dynamic Step-by-Step Mathematical Solver for Math Engine AZ (v2.5.0)
 * Generates transparent, human-readable intermediate steps and alternative representations
 * (stacked fractions, mixed numbers, decimals) in Azerbaijani and English.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./math-core', './i18n'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./math-core'), require('./i18n'));
    } else {
        root.StepSolver = factory(root.MathCore, root.I18n);
    }
}(typeof self !== 'undefined' ? self : this, function (MathCore, I18n) {
    'use strict';

    function gcd(a, b) {
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    function lcm(a, b) {
        if (!a || !b) return 0;
        return Math.abs(Math.round((a * b) / gcd(a, b)));
    }

    function hasVariableX(expr) {
        if (!expr) return false;
        // Replace 'exp(' with empty to avoid false positive for exp() function
        const sanitized = expr.replace(/exp\s*\(/gi, '');
        return /\bx\b/i.test(sanitized) ||
               /\d\s*x\b/i.test(sanitized) ||
               /\bx\s*\d/i.test(sanitized) ||
               /\(x\b/i.test(sanitized) ||
               /\bx\)/i.test(sanitized) ||
               /[\+\-\*\/\^\(]\s*x\b/i.test(sanitized);
    }

    /**
     * Parse simple fraction pattern like "5/7", "(-3/4)", "10"
     */
    function parseSimpleFraction(token) {
        token = token.trim().replace(/^\(|\)$/g, '').trim();
        const fracMatch = token.match(/^(-?\d+)\s*\/\s*(\d+)$/);
        if (fracMatch) {
            const num = parseInt(fracMatch[1], 10);
            const den = parseInt(fracMatch[2], 10);
            return den === 0 ? null : { num, den };
        }
        const intMatch = token.match(/^(-?\d+)$/);
        if (intMatch) {
            return { num: parseInt(intMatch[1], 10), den: 1 };
        }
        return null;
    }

    /**
     * Format a fraction as HTML stacked fraction
     */
    function renderFracHtml(num, den) {
        if (den === 1) return `<span class="sol-num">${num}</span>`;
        return `<span class="calc-frac"><span class="calc-num">${num}</span><span class="calc-den">${den}</span></span>`;
    }

    /**
     * Generate step-by-step solution object
     */
    function solve(expr, angleMode = 'DEG') {
        const lang = (I18n && typeof I18n.getLanguage === 'function') ? I18n.getLanguage() : 'az';
        const isEn = lang === 'en';

        if (!expr || !expr.trim()) {
            return {
                empty: true,
                hasVariable: false
            };
        }

        const raw = expr.trim();

        // 1. Check if expression has variable 'x' -> Plotter mode
        if (hasVariableX(raw)) {
            return {
                hasVariable: true,
                expression: raw
            };
        }

        // Evaluate overall result using MathCore
        let finalVal = null;
        try {
            if (MathCore && typeof MathCore.evaluate === 'function') {
                finalVal = MathCore.evaluate(raw, { angleMode });
            }
        } catch (e) {
            return {
                hasVariable: false,
                error: e.message
            };
        }

        const steps = [];
        let altForms = null;

        // Calculate fraction alternative representation if finite
        if (finalVal !== null && isFinite(finalVal) && MathCore && typeof MathCore.toFraction === 'function') {
            const frac = MathCore.toFraction(finalVal);
            if (frac && frac.d > 1 && frac.d <= 5000) {
                altForms = {
                    improper: `${frac.n}/${frac.d}`,
                    improperHtml: renderFracHtml(frac.n, frac.d),
                    mixed: frac.mixed ? `${frac.mixed.whole} ${frac.mixed.rem}/${frac.mixed.d}` : null,
                    mixedHtml: frac.mixed ? `<span class="sol-mixed"><span class="sol-whole">${frac.mixed.whole}</span>${renderFracHtml(frac.mixed.rem, frac.mixed.d)}</span>` : null,
                    decimal: frac.decimal
                };
            }
        }

        // Pattern A: Fraction multiplication / division, e.g. "5/7 * 2", "2 * 5/7", "(5/7) * (2/3)"
        const fracMulMatch = raw.match(/^\(?\s*(-?\d+)\s*\/\s*(\d+)\s*\)?\s*([*×·])\s*\(?\s*(-?\d+)(?:\s*\/\s*(\d+))?\s*\)?$/) ||
                             raw.match(/^\(?\s*(-?\d+)\s*\)?\s*([*×·])\s*\(?\s*(-?\d+)\s*\/\s*(\d+)\s*\)?$/);
        
        if (fracMulMatch) {
            let n1, d1, n2, d2;
            if (fracMulMatch.length === 6) {
                n1 = parseInt(fracMulMatch[1], 10);
                d1 = parseInt(fracMulMatch[2], 10);
                n2 = parseInt(fracMulMatch[4], 10);
                d2 = fracMulMatch[5] ? parseInt(fracMulMatch[5], 10) : 1;
            } else {
                n1 = parseInt(fracMulMatch[1], 10);
                d1 = 1;
                n2 = parseInt(fracMulMatch[3], 10);
                d2 = parseInt(fracMulMatch[4], 10);
            }

            if (d1 !== 0 && d2 !== 0) {
                // Step 1: Write integers as fractions
                if (d1 === 1) {
                    steps.push({
                        title: isEn ? "Convert integer to fraction" : "Tam ədədi kəsr şəklinə gətirin",
                        formula: `${n1} = ${renderFracHtml(n1, 1)}`,
                        explanation: isEn ? `Any integer a can be written as ${renderFracHtml('a', 1)}.` : `İstənilən tam a ədədi ${renderFracHtml('a', 1)} şəklində yazıla bilər.`
                    });
                }
                if (d2 === 1) {
                    steps.push({
                        title: isEn ? "Convert integer to fraction" : "Tam ədədi kəsr şəklinə gətirin",
                        formula: `${n2} = ${renderFracHtml(n2, 1)}`,
                        explanation: isEn ? `Any integer a can be written as ${renderFracHtml('a', 1)}.` : `İstənilən tam a ədədi ${renderFracHtml('a', 1)} şəklində yazıla bilər.`
                    });
                }

                // Step 2: Multiply numerators and denominators
                const rawNum = n1 * n2;
                const rawDen = d1 * d2;
                steps.push({
                    title: isEn ? "Multiply numerators and denominators" : "Sürətləri və məxrəcləri ayrı-ayrılıqda vurun",
                    formula: `${renderFracHtml(n1, d1)} × ${renderFracHtml(n2, d2)} = ${renderFracHtml(`${n1} × ${n2}`, `${d1} × ${d2}`)} = ${renderFracHtml(rawNum, rawDen)}`,
                    explanation: isEn ? "Multiply top numbers together and bottom numbers together." : "Sürətlər öz aralarında, məxrəclər isə öz aralarında vurulur."
                });

                // Step 3: Simplify if possible
                const g = gcd(rawNum, rawDen);
                const simpNum = rawNum / g;
                const simpDen = rawDen / g;

                if (g > 1) {
                    steps.push({
                        title: isEn ? "Simplify fraction by Greatest Common Divisor" : "Ən Böyük Ortaq Bölən (ƏBOB) ilə ixtisar edin",
                        formula: `${renderFracHtml(rawNum, rawDen)} = ${renderFracHtml(`${rawNum} ÷ ${g}`, `${rawDen} ÷ ${g}`)} = ${renderFracHtml(simpNum, simpDen)}`,
                        explanation: isEn ? `Divide numerator and denominator by gcd(${rawNum}, ${rawDen}) = ${g}.` : `Sürət və məxrəci ƏBOB(${rawNum}, ${rawDen}) = ${g} ədədinə bölün.`
                    });
                }

                return {
                    hasVariable: false,
                    expression: raw,
                    finalResult: finalVal,
                    steps,
                    altForms
                };
            }
        }

        // Pattern B: Fraction Addition or Subtraction, e.g. "1/2 + 1/3" or "3/4 - 1/8"
        const fracAddMatch = raw.match(/^\(?\s*(-?\d+)\s*\/\s*(\d+)\s*\)?\s*([+\-])\s*\(?\s*(-?\d+)\s*\/\s*(\d+)\s*\)?$/);
        if (fracAddMatch) {
            const n1 = parseInt(fracAddMatch[1], 10);
            const d1 = parseInt(fracAddMatch[2], 10);
            const op = fracAddMatch[3];
            const n2 = parseInt(fracAddMatch[4], 10);
            const d2 = parseInt(fracAddMatch[5], 10);

            if (d1 !== 0 && d2 !== 0) {
                const commonDen = lcm(d1, d2);
                const mult1 = commonDen / d1;
                const mult2 = commonDen / d2;
                const adjN1 = n1 * mult1;
                const adjN2 = n2 * mult2;

                steps.push({
                    title: isEn ? "Find Common Denominator (LCM)" : "Ortaq Məxrəc Tapın (ƏKOB)",
                    formula: `\\text{LCM}(${d1}, ${d2}) = ${commonDen}`,
                    explanation: isEn ? `Find least common multiple of denominators ${d1} and ${d2}.` : `${d1} və ${d2} məxrəclərinin Ən Kiçik Ortaq Bölünənini (ƏKOB) tapın.`
                });

                steps.push({
                    title: isEn ? "Rewrite fractions with common denominator" : "Kəsrləri ortaq məxrəcə gətirin",
                    formula: `${renderFracHtml(n1, d1)} ${op} ${renderFracHtml(n2, d2)} = ${renderFracHtml(adjN1, commonDen)} ${op} ${renderFracHtml(adjN2, commonDen)}`,
                    explanation: isEn ? "Expand each fraction by its corresponding factor." : "Hər bir kəsri uyğun tamamlayıcı vuruğa vurun."
                });

                const resN = op === '+' ? adjN1 + adjN2 : adjN1 - adjN2;
                const g = gcd(resN, commonDen);
                const simpN = resN / g;
                const simpD = commonDen / g;

                steps.push({
                    title: isEn ? "Combine numerators" : "Sürətləri hesablayın",
                    formula: `${renderFracHtml(`${adjN1} ${op} ${adjN2}`, commonDen)} = ${renderFracHtml(resN, commonDen)}`,
                    explanation: isEn ? `Add or subtract numerators over the common denominator ${commonDen}.` : `Ortaq ${commonDen} məxrəcində sürətləri hesablayın.`
                });

                if (g > 1) {
                    steps.push({
                        title: isEn ? "Simplify by GCD" : "ƏBOB ilə ixtisar edin",
                        formula: `${renderFracHtml(resN, commonDen)} = ${renderFracHtml(simpN, simpD)}`,
                        explanation: isEn ? `Divide top and bottom by ${g}.` : `Sürət və məxrəci ${g} ədədinə bölün.`
                    });
                }

                return {
                    hasVariable: false,
                    expression: raw,
                    finalResult: finalVal,
                    steps,
                    altForms
                };
            }
        }

        // Pattern C: Percentage addition / subtraction: "A + B%" or "A - B%"
        const pctAddMatch = raw.match(/^\(?\s*([0-9.]+)\s*\)?\s*([+\-])\s*([0-9.]+)%$/);
        if (pctAddMatch) {
            const base = parseFloat(pctAddMatch[1]);
            const op = pctAddMatch[2];
            const pct = parseFloat(pctAddMatch[3]);
            const pctVal = (base * pct) / 100;

            steps.push({
                title: isEn ? "Calculate percentage value" : "Faiz miqdarını hesablayın",
                formula: `${pct}\\% \\text{ of } ${base} = ${base} × \\frac{${pct}}{100} = ${pctVal}`,
                explanation: isEn ? `Multiply base ${base} by ${pct} over 100.` : `${base} əsas qiymətini ${pct}/100 nisbətinə vurun.`
            });

            steps.push({
                title: op === '+' ? (isEn ? "Add to base value" : "Əsas qiymətə əlavə edin") : (isEn ? "Subtract from base value" : "Əsas qiymətdən çıxın"),
                formula: `${base} ${op} ${pctVal} = ${finalVal}`,
                explanation: isEn ? `Perform final operation.` : `Yekun əməliyyatı icra edin.`
            });

            return {
                hasVariable: false,
                expression: raw,
                finalResult: finalVal,
                steps,
                altForms
            };
        }

        // Pattern D: Negation with exponentiation: "(-A)^B" vs "-A^B"
        const negExpMatch = raw.match(/^(\(-?[0-9.]+\)|-[0-9.]+)\^([0-9.]+)$/);
        if (negExpMatch) {
            const baseStr = negExpMatch[1];
            const expVal = parseFloat(negExpMatch[2]);
            const isParen = baseStr.startsWith('(');

            if (isParen) {
                const innerNum = parseFloat(baseStr.replace(/[()]/g, ''));
                steps.push({
                    title: isEn ? "Base is negative inside parentheses" : "Əsas mötərizə daxilində mənfidir",
                    formula: `(${innerNum})^{${expVal}} = ${Array(Math.min(expVal, 5)).fill(`(${innerNum})`).join(' × ')}`,
                    explanation: isEn ? `Even powers of a negative base result in a positive number.` : `Mənfi ədədin cüt dərəcədən qüvvəti müsbət nəticə verir.`
                });
            } else {
                const innerNum = parseFloat(baseStr.replace('-', ''));
                steps.push({
                    title: isEn ? "Order of precedence: Exponentiation before Negation" : "Əməllər sırası: Qüvvətə yüksəltmə mənfi işarədən əvvəl icra olunur",
                    formula: `-${innerNum}^{${expVal}} = -(${innerNum}^{${expVal}}) = -(${Math.pow(innerNum, expVal)}) = ${finalVal}`,
                    explanation: isEn ? `Only the base ${innerNum} is raised to power ${expVal}, then negated.` : `Yalnız ${innerNum} əsası qüvvətə yüksəlir, sonra mənfi işarəsi tətbiq olunur.`
                });
            }

            return {
                hasVariable: false,
                expression: raw,
                finalResult: finalVal,
                steps,
                altForms
            };
        }

        // Pattern E: Trigonometry special angles: "sin(30)", "cos(60)", etc.
        const trigMatch = raw.match(/^(sin|cos|tan|cot)\((pi\/[0-9]+|[0-9.]+)\)$/i);
        if (trigMatch) {
            const fn = trigMatch[1].toLowerCase();
            const arg = trigMatch[2];
            steps.push({
                title: isEn ? `Trigonometric function: ${fn}` : `Triqonometrik funksiya: ${fn}`,
                formula: `${fn}(${arg}${angleMode === 'DEG' && !arg.includes('pi') ? '^\\circ' : ''}) = ${finalVal}`,
                explanation: isEn ? `Evaluated respecting ${angleMode} angle mode.` : `${angleMode} bucaq rejiminə uyğun olaraq hesablandı.`
            });

            return {
                hasVariable: false,
                expression: raw,
                finalResult: finalVal,
                steps,
                altForms
            };
        }

        // Default General Arithmetic Steps (PEMDAS breakdown)
        steps.push({
            title: isEn ? "1. Expression structure" : "1. İfadənin strukturu",
            formula: raw,
            explanation: isEn ? "Evaluate following standard mathematical order of operations (PEMDAS)." : "Standart riyazi əməliyyat ardıcıllığı (mötərizələr, qüvvətlər, vurma/bölmə, toplama/çıxma) ilə icra olunur."
        });

        if (finalVal !== null) {
            steps.push({
                title: isEn ? "2. Evaluated result" : "2. Hesablanmış nəticə",
                formula: `= ${finalVal}`,
                explanation: isEn ? "Cleaned of floating-point precision artifacts." : "IEEE-754 üzən nöqtə dəqiqlik təmizləyicisi ilə hesablandı."
            });
        }

        return {
            hasVariable: false,
            expression: raw,
            finalResult: finalVal,
            steps,
            altForms
        };
    }

    return {
        hasVariableX,
        toFraction: MathCore ? MathCore.toFraction : null,
        solve
    };
}));
