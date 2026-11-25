/**
 * StepSolver v3.1.0 — Interactive Step-by-Step Mathematical Solver for Math Engine AZ
 * Generates transparent, human-readable primary step cards and expandable sub-steps
 * (Photomath-inspired breakdown) with true visual stacked fractions, mixed numbers,
 * and alternative representations in Azerbaijani and English.
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
     * Format a fraction as true HTML stacked fraction
     */
    function renderFracHtml(num, den) {
        if (den === 1) return `<span class="sol-num">${num}</span>`;
        return `<span class="calc-frac"><span class="calc-num">${num}</span><span class="calc-den">${den}</span></span>`;
    }

    /**
     * Format a mixed fraction as HTML
     */
    function renderMixedHtml(whole, num, den) {
        return `<span class="sol-mixed"><span class="sol-whole">${whole}</span>${renderFracHtml(num, den)}</span>`;
    }

    /**
     * Generate step-by-step solution object
     */
    function solve(expr, angleMode = 'DEG') {
        const lang = (I18n && typeof I18n.getLanguage === 'function')
            ? I18n.getLanguage()
            : ((typeof window !== 'undefined' && window.I18n && typeof window.I18n.getLanguage === 'function')
                ? window.I18n.getLanguage()
                : ((typeof localStorage !== 'undefined' && (localStorage.getItem('math_engine_az_lang') === 'en' || localStorage.getItem('math_engine_az_lang') === 'az'))
                    ? localStorage.getItem('math_engine_az_lang')
                    : (MathCore && MathCore.getLanguage ? MathCore.getLanguage() : 'az')));
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
                finalVal = MathCore.evaluate(raw, { angleMode, lang });
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
            if (frac && frac.d > 1 && frac.d <= 50000) {
                altForms = {
                    improper: `${frac.n}/${frac.d}`,
                    improperHtml: renderFracHtml(frac.n, frac.d),
                    mixed: frac.mixed ? `${frac.mixed.whole} ${frac.mixed.rem}/${frac.mixed.d}` : null,
                    mixedHtml: frac.mixed ? renderMixedHtml(frac.mixed.whole, frac.mixed.rem, frac.mixed.d) : null,
                    decimal: String(frac.decimal)
                };
            }
        }

        // PATTERN 0: Mixed Fraction Conversion & Arithmetic (e.g. "5 1/2", "(5 + (1/2))", "5 * 5 1/2", "5 * ((5) + ((1)/(2)))")
        // Normalized match for serialized or plain mixed fractions:
        const mixedRegex = /(?:\(\(?(\d+)\)?\s*\+\s*\(?\(?(\d+)\)?\s*\/\s*\(?(\d+)\)?\)?\)?|(\b\d+)\s+(\d+)\s*\/\s*(\d+\b))/;
        const mixedMatch = raw.match(mixedRegex);

        if (mixedMatch) {
            const whole = parseInt(mixedMatch[1] || mixedMatch[4], 10);
            const num = parseInt(mixedMatch[2] || mixedMatch[5], 10);
            const den = parseInt(mixedMatch[3] || mixedMatch[6], 10);

            if (den > 0) {
                const impNum = whole * den + num;

                // Step 1: Convert mixed number to improper fraction
                steps.push({
                    title: isEn ? "1. Convert mixed number to improper fraction" : "1. Qarışıq kəsri düzgün olmayan kəsrə çevirin",
                    formula: `${renderMixedHtml(whole, num, den)} = ${renderFracHtml(impNum, den)}`,
                    explanation: isEn
                        ? `Multiply the whole number ${whole} by denominator ${den} and add the numerator ${num}: ${whole} × ${den} + ${num} = ${impNum}.`
                        : `Tam hissəni (${whole}) məxrəcə (${den}) vurun və sürəti (${num}) əlavə edin: ${whole} × ${den} + ${num} = ${impNum}.`,
                    substeps: [
                        {
                            formula: `${renderMixedHtml(whole, num, den)} → ${renderFracHtml(`${whole} × ${den} + ${num}`, den)} → ${renderFracHtml(`${whole * den} + ${num}`, den)} → ${renderFracHtml(impNum, den)}`,
                            explanation: isEn
                                ? `Intermediate steps: ${whole} × ${den} = ${whole * den}, then ${whole * den} + ${num} = ${impNum}.`
                                : `Aralıq addımlar: ${whole} × ${den} = ${whole * den}, sonra ${whole * den} + ${num} = ${impNum}.`
                        }
                    ]
                });

                // Check if there is a simple outer operation (e.g. "5 * 5 1/2" or "5 1/2 / 2")
                const escapedMixed = mixedMatch[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const outerMulMatch = raw.match(new RegExp(`^([0-9.]+)\\s*[*×·]\\s*${escapedMixed}$`)) ||
                                      raw.match(new RegExp(`^${escapedMixed}\\s*[*×·]\\s*([0-9.]+)$`));
                const outerDivMatch = raw.match(new RegExp(`^${escapedMixed}\\s*[/÷]\\s*([0-9.]+)$`));

                if (outerMulMatch) {
                    const factor = parseFloat(outerMulMatch[1]);
                    const prodNum = factor * impNum;
                    const g = gcd(prodNum, den);
                    const simpN = prodNum / g;
                    const simpD = den / g;

                    steps.push({
                        title: isEn ? "2. Simplify the expression" : "2. İfadəni sadələşdirin",
                        formula: `${factor} × ${renderFracHtml(impNum, den)} = ${renderFracHtml(`${factor} × ${impNum}`, den)} = ${renderFracHtml(prodNum, den)}${g > 1 ? ` = ${renderFracHtml(simpN, simpD)}` : ''}`,
                        explanation: isEn
                            ? `Multiply the factor ${factor} by the numerator ${impNum}: ${factor} × ${impNum} = ${prodNum}.`
                            : `${factor} vuruğunu kəsrin sürətinə (${impNum}) vurun: ${factor} × ${impNum} = ${prodNum}.`,
                        substeps: [
                            {
                                formula: `${renderFracHtml(factor, 1)} × ${renderFracHtml(impNum, den)} = ${renderFracHtml(`${factor} × ${impNum}`, `1 × ${den}`)} = ${renderFracHtml(prodNum, den)}`,
                                explanation: isEn ? "Multiply numerators and denominators." : "Sürətləri və məxrəcləri ayrı-ayrılıqda vurun."
                            },
                            ...(g > 1 ? [{
                                formula: `${renderFracHtml(prodNum, den)} = ${renderFracHtml(`${prodNum} ÷ ${g}`, `${den} ÷ ${g}`)} = ${renderFracHtml(simpN, simpD)}`,
                                explanation: isEn ? `Simplify fraction by GCD(${prodNum}, ${den}) = ${g}.` : `Sürət və məxrəci ƏBOB(${prodNum}, ${den}) = ${g} ədədinə bölün.`
                            }] : [])
                        ]
                    });
                } else if (outerDivMatch) {
                    const divisor = parseFloat(outerDivMatch[1]);
                    const newDen = den * divisor;
                    const g = gcd(impNum, newDen);
                    const simpN = impNum / g;
                    const simpD = newDen / g;

                    steps.push({
                        title: isEn ? "2. Perform division by reciprocal" : "2. Bölmə əməlini tərs kəsrə vurma ilə əvəz edin",
                        formula: `${renderFracHtml(impNum, den)} ÷ ${divisor} = ${renderFracHtml(impNum, den)} × ${renderFracHtml(1, divisor)} = ${renderFracHtml(impNum, newDen)}${g > 1 ? ` = ${renderFracHtml(simpN, simpD)}` : ''}`,
                        explanation: isEn
                            ? `Dividing by ${divisor} is equivalent to multiplying by ${renderFracHtml(1, divisor)}.`
                            : `${divisor} ədədinə bölmək ${renderFracHtml(1, divisor)} kəsrinə vurmaq deməkdir.`,
                        substeps: [
                            {
                                formula: `${renderFracHtml(impNum, den)} × ${renderFracHtml(1, divisor)} = ${renderFracHtml(impNum, newDen)}`,
                                explanation: isEn ? "Multiply across." : "Sürətləri və məxrəcləri vurun."
                            }
                        ]
                    });
                } else if (steps.length === 1 && finalVal !== null) {
                    const isStandaloneMixed = raw.replace(/\s+/g, '') === mixedMatch[0].replace(/\s+/g, '');
                    if (isStandaloneMixed) {
                        // Only standalone mixed number
                        steps.push({
                            title: isEn ? "2. Decimal equivalent" : "2. Onluq kəsr qarşılığı",
                            formula: `${renderFracHtml(impNum, den)} = ${finalVal}`,
                            explanation: isEn
                                ? `Divide numerator ${impNum} by denominator ${den} to obtain decimal form.`
                                : `Sürəti (${impNum}) məxrəcə (${den}) bölərək onluq kəsr qiymətini əldə edin.`,
                            substeps: [
                                {
                                    formula: `${impNum} ÷ ${den} = ${finalVal}`,
                                    explanation: isEn ? "Long division calculation." : "Bölmə əməliyyatının nəticəsi."
                                }
                            ]
                        });
                    } else {
                        // Compound multi-factor/multi-term expression: preserve full LHS context
                        const replacedHtml = raw.replace(mixedMatch[0], renderFracHtml(impNum, den));
                        const replacedText = raw.replace(mixedMatch[0], `(${impNum}/${den})`);
                        steps.push({
                            title: isEn ? "2. Substitute improper fraction & evaluate" : "2. Düzgün olmayan kəsri yerinə qoyun və hesablayın",
                            formula: `${replacedHtml} = ${finalVal}`,
                            explanation: isEn
                                ? `Substitute ${impNum}/${den} back into the full expression and evaluate.`
                                : `${impNum}/${den} kəsrini tam ifadədə yerinə qoyub hesablayın.`,
                            substeps: [
                                {
                                    formula: `${replacedText} = ${finalVal}`,
                                    explanation: isEn ? "Full expression context preserved." : "Tam ifadə konteksti qorunaraq hesablandı."
                                }
                            ]
                        });
                    }
                }

                // Final Step: Result
                steps.push({
                    title: isEn ? `${steps.length + 1}. Final Result` : `${steps.length + 1}. Yekun nəticə`,
                    formula: `= ${finalVal}`,
                    explanation: isEn
                        ? "Calculated with exact precision arithmetic."
                        : "Dəqiq arifmetik hesablama ilə tamamlandı."
                });

                return {
                    empty: false,
                    hasVariable: false,
                    expression: raw,
                    finalResult: finalVal,
                    steps,
                    altForms
                };
            }
        }

        // PATTERN A: Fraction multiplication / division, e.g. "5/7 * 2", "2 * 5/7", "(5/7) * (2/3)"
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
                let stepNum = 1;
                // Step 1: Write integers as fractions if applicable
                if (d1 === 1 || d2 === 1) {
                    const intVal = d1 === 1 ? n1 : n2;
                    steps.push({
                        title: isEn ? `${stepNum++}. Convert integer to fraction` : `${stepNum++}. Tam ədədi kəsr şəklinə gətirin`,
                        formula: `${intVal} = ${renderFracHtml(intVal, 1)}`,
                        explanation: isEn ? `Any integer a can be written as ${renderFracHtml('a', 1)}.` : `İstənilən tam a ədədi ${renderFracHtml('a', 1)} şəklində yazıla bilər.`,
                        substeps: [
                            {
                                formula: `${intVal} = ${renderFracHtml(intVal, 1)}`,
                                explanation: isEn ? "Place the integer over denominator 1." : "Tam ədədi 1 məxrəci üzərinə qoyun."
                            }
                        ]
                    });
                }

                // Step 2: Multiply numerators and denominators
                const rawNum = n1 * n2;
                const rawDen = d1 * d2;
                const g = gcd(rawNum, rawDen);
                const simpNum = rawNum / g;
                const simpDen = rawDen / g;

                steps.push({
                    title: isEn ? `${stepNum++}. Multiply numerators and denominators` : `${stepNum++}. Sürətləri və məxrəcləri ayrı-ayrılıqda vurun`,
                    formula: `${renderFracHtml(n1, d1)} × ${renderFracHtml(n2, d2)} = ${renderFracHtml(`${n1} × ${n2}`, `${d1} × ${d2}`)} = ${renderFracHtml(rawNum, rawDen)}`,
                    explanation: isEn ? "Multiply top numbers together and bottom numbers together." : "Sürətlər öz aralarında, məxrəclər isə öz aralarında vurulur.",
                    substeps: [
                        {
                            formula: `${isEn ? 'Numerator' : 'Sürət'}: ${n1} × ${n2} = ${rawNum}`,
                            explanation: isEn ? "Multiply numerators." : "Sürətlərin hasili hesablanır."
                        },
                        {
                            formula: `${isEn ? 'Denominator' : 'Məxrəc'}: ${d1} × ${d2} = ${rawDen}`,
                            explanation: isEn ? "Multiply denominators." : "Məxrəclərin hasili hesablanır."
                        },
                        {
                            formula: `${renderFracHtml(rawNum, rawDen)}`,
                            explanation: isEn ? "Combine into single fraction." : "Vurulmuş nəticə tək bir kəsr şəklinə gətirilir."
                        }
                    ]
                });

                if (g > 1) {
                    steps.push({
                        title: isEn ? `${stepNum++}. Simplify fraction by Greatest Common Divisor` : `${stepNum++}. ƏBOB ilə ixtisar edin`,
                        formula: `${renderFracHtml(rawNum, rawDen)} = ${renderFracHtml(`${rawNum} ÷ ${g}`, `${rawDen} ÷ ${g}`)} = ${renderFracHtml(simpNum, simpDen)}`,
                        explanation: isEn ? `Divide numerator and denominator by gcd(${rawNum}, ${rawDen}) = ${g}.` : `Sürət və məxrəci ƏBOB(${rawNum}, ${rawDen}) = ${g} ədədinə bölün.`,
                        substeps: [
                            {
                                formula: `${isEn ? 'GCD' : 'ƏBOB'}(${rawNum}, ${rawDen}) = ${g}`,
                                explanation: isEn ? `Greatest common divisor is ${g}.` : `Ən böyük ortaq bölən ${g}-dir.`
                            },
                            {
                                formula: `${rawNum} ÷ ${g} = ${simpNum}, &nbsp; ${rawDen} ÷ ${g} = ${simpDen}`,
                                explanation: isEn ? "Divide both parts." : "Hər iki hissə ixtisar olunur."
                            }
                        ]
                    });
                }

                steps.push({
                    title: isEn ? `${stepNum++}. Final Result` : `${stepNum++}. Yekun nəticə`,
                    formula: `= ${finalVal}`,
                    explanation: isEn ? "Evaluation complete." : "Hesablama tamamlandı."
                });

                return {
                    empty: false,
                    hasVariable: false,
                    expression: raw,
                    finalResult: finalVal,
                    steps,
                    altForms
                };
            }
        }

        // PATTERN B: Fraction Addition or Subtraction, e.g. "1/2 + 1/3" or "3/4 - 1/8"
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
                    title: isEn ? "1. Find Common Denominator (LCM)" : "1. Ortaq Məxrəc Tapın (ƏKOB)",
                    formula: `${isEn ? 'LCM' : 'ƏKOB'}(${d1}, ${d2}) = ${commonDen}`,
                    explanation: isEn ? `Find least common multiple of denominators ${d1} and ${d2}.` : `${d1} və ${d2} məxrəclərinin Ən Kiçik Ortaq Bölünənini (ƏKOB) tapın.`,
                    substeps: [
                        {
                            formula: `${isEn ? 'Factor 1' : 'Vuruq 1'}: ${commonDen} ÷ ${d1} = ${mult1}`,
                            explanation: isEn ? `Multiplier for fraction 1 is ${mult1}.` : `Birinci kəsr üçün tamamlayıcı vuruq ${mult1}-dir.`
                        },
                        {
                            formula: `${isEn ? 'Factor 2' : 'Vuruq 2'}: ${commonDen} ÷ ${d2} = ${mult2}`,
                            explanation: isEn ? `Multiplier for fraction 2 is ${mult2}.` : `İkinci kəsr üçün tamamlayıcı vuruq ${mult2}-dir.`
                        }
                    ]
                });

                steps.push({
                    title: isEn ? "2. Rewrite fractions with common denominator" : "2. Kəsrləri ortaq məxrəcə gətirin",
                    formula: `${renderFracHtml(n1, d1)} ${op} ${renderFracHtml(n2, d2)} = ${renderFracHtml(adjN1, commonDen)} ${op} ${renderFracHtml(adjN2, commonDen)}`,
                    explanation: isEn ? "Expand each fraction by its corresponding factor." : "Hər bir kəsri uyğun tamamlayıcı vuruğa vurun.",
                    substeps: [
                        {
                            formula: `${renderFracHtml(`${n1} × ${mult1}`, `${d1} × ${mult1}`)} = ${renderFracHtml(adjN1, commonDen)}`,
                            explanation: isEn ? "Expanded fraction 1." : "Birinci kəsrin genişləndirilmiş forması."
                        },
                        {
                            formula: `${renderFracHtml(`${n2} × ${mult2}`, `${d2} × ${mult2}`)} = ${renderFracHtml(adjN2, commonDen)}`,
                            explanation: isEn ? "Expanded fraction 2." : "İkinci kəsrin genişləndirilmiş forması."
                        }
                    ]
                });

                const resN = op === '+' ? adjN1 + adjN2 : adjN1 - adjN2;
                const g = gcd(resN, commonDen);
                const simpN = resN / g;
                const simpD = commonDen / g;

                steps.push({
                    title: isEn ? "3. Combine numerators" : "3. Sürətləri hesablayın",
                    formula: `${renderFracHtml(`${adjN1} ${op} ${adjN2}`, commonDen)} = ${renderFracHtml(resN, commonDen)}`,
                    explanation: isEn ? `Add or subtract numerators over the common denominator ${commonDen}.` : `Ortaq ${commonDen} məxrəcində sürətləri hesablayın.`,
                    substeps: [
                        {
                            formula: `${adjN1} ${op} ${adjN2} = ${resN}`,
                            explanation: isEn ? "Numerator operation." : "Sürətlərin hesablanması."
                        }
                    ]
                });

                if (g > 1) {
                    steps.push({
                        title: isEn ? "4. Simplify by GCD" : "4. ƏBOB ilə ixtisar edin",
                        formula: `${renderFracHtml(resN, commonDen)} = ${renderFracHtml(simpN, simpD)}`,
                        explanation: isEn ? `Divide top and bottom by ${g}.` : `Sürət və məxrəci ${g} ədədinə bölün.`,
                        substeps: [
                            {
                                formula: `${isEn ? 'GCD' : 'ƏBOB'}(${resN}, ${commonDen}) = ${g}`,
                                explanation: isEn ? `Divide both by ${g}.` : `Hər iki ədədi ${g}-yə bölün.`
                            }
                        ]
                    });
                }

                steps.push({
                    title: isEn ? `${steps.length + 1}. Final Result` : `${steps.length + 1}. Yekun nəticə`,
                    formula: `= ${finalVal}`,
                    explanation: isEn ? "Calculation complete." : "Hesablama tamamlandı."
                });

                return {
                    empty: false,
                    hasVariable: false,
                    expression: raw,
                    finalResult: finalVal,
                    steps,
                    altForms
                };
            }
        }

        // PATTERN C: Percentage addition / subtraction: "A + B%" or "A - B%"
        const pctAddMatch = raw.match(/^\(?\s*([0-9.]+)\s*\)?\s*([+\-])\s*([0-9.]+)%$/);
        if (pctAddMatch) {
            const base = parseFloat(pctAddMatch[1]);
            const op = pctAddMatch[2];
            const pct = parseFloat(pctAddMatch[3]);
            const pctVal = (base * pct) / 100;

            steps.push({
                title: isEn ? "1. Calculate percentage value" : "1. Faiz miqdarını hesablayın",
                formula: `${isEn ? `${pct}% of ${base}` : `${base}-in ${pct}%-i`} = ${base} × ${renderFracHtml(pct, 100)} = ${pctVal}`,
                explanation: isEn ? `Multiply base ${base} by ${pct} over 100.` : `${base} əsas qiymətini ${pct}/100 nisbətinə vurun.`,
                substeps: [
                    {
                        formula: `${renderFracHtml(pct, 100)} = ${pct / 100}`,
                        explanation: isEn ? "Convert percentage to decimal." : "Faizi onluq kəsrə çevirin."
                    },
                    {
                        formula: `${base} × ${pct / 100} = ${pctVal}`,
                        explanation: isEn ? "Multiply by base value." : "Əsas qiymətə vurun."
                    }
                ]
            });

            steps.push({
                title: isEn ? (op === '+' ? "2. Add to base value" : "2. Subtract from base value") : (op === '+' ? "2. Əsas qiymətə əlavə edin" : "2. Əsas qiymətdən çıxın"),
                formula: `${base} ${op} ${pctVal} = ${finalVal}`,
                explanation: isEn ? `Perform final operation.` : `Yekun əməliyyatı icra edin.`,
                substeps: [
                    {
                        formula: `${base} ${op} ${pctVal} = ${finalVal}`,
                        explanation: isEn ? "Final arithmetic result." : "Yekun arifmetik nəticə."
                    }
                ]
            });

            return {
                empty: false,
                hasVariable: false,
                expression: raw,
                finalResult: finalVal,
                steps,
                altForms
            };
        }

        // PATTERN D: Negation with exponentiation: "(-A)^B" vs "-A^B"
        const negExpMatch = raw.match(/^(\(-?[0-9.]+\)|-[0-9.]+)\^([0-9.]+)$/);
        if (negExpMatch) {
            const baseStr = negExpMatch[1];
            const expVal = parseFloat(negExpMatch[2]);
            const isParen = baseStr.startsWith('(');

            if (isParen) {
                const innerNum = parseFloat(baseStr.replace(/[()]/g, ''));
                steps.push({
                    title: isEn ? "1. Base is negative inside parentheses" : "1. Əsas mötərizə daxilində mənfidir",
                    formula: `(${innerNum})<sup>${expVal}</sup> = ${Array(Math.min(expVal, 5)).fill(`(${innerNum})`).join(' × ')}`,
                    explanation: isEn ? `Even powers of a negative base result in a positive number.` : `Mənfi ədədin cüt dərəcədən qüvvəti müsbət nəticə verir.`,
                    substeps: [
                        {
                            formula: `(${innerNum}) × (${innerNum}) = ${innerNum * innerNum}`,
                            explanation: isEn ? "Multiply negative numbers (negative × negative = positive)." : "Mənfi ədədlərin vurulması (mənfi × mənfi = müsbət)."
                        }
                    ]
                });
            } else {
                const innerNum = parseFloat(baseStr.replace('-', ''));
                steps.push({
                    title: isEn ? "1. Order of precedence: Exponentiation before Negation" : "1. Əməllər sırası: Qüvvətə yüksəltmə mənfi işarədən əvvəl icra olunur",
                    formula: `-${innerNum}<sup>${expVal}</sup> = -(${innerNum}<sup>${expVal}</sup>) = -(${Math.pow(innerNum, expVal)}) = ${finalVal}`,
                    explanation: isEn ? `Only the base ${innerNum} is raised to power ${expVal}, then negated.` : `Yalnız ${innerNum} əsası qüvvətə yüksəlir, sonra mənfi işarəsi tətbiq olunur.`,
                    substeps: [
                        {
                            formula: `${innerNum}<sup>${expVal}</sup> = ${Math.pow(innerNum, expVal)}`,
                            explanation: isEn ? "Raise base to exponent." : "Əsası qüvvətə yüksəldin."
                        },
                        {
                            formula: `-(${Math.pow(innerNum, expVal)}) = ${finalVal}`,
                            explanation: isEn ? "Apply leading negative sign." : "Mənfi işarəsini tətbiq edin."
                        }
                    ]
                });
            }

            steps.push({
                title: isEn ? "2. Final Result" : "2. Yekun nəticə",
                formula: `= ${finalVal}`,
                explanation: isEn ? "Evaluated successfully." : "Uğurla hesablandı."
            });

            return {
                empty: false,
                hasVariable: false,
                expression: raw,
                finalResult: finalVal,
                steps,
                altForms
            };
        }

        // PATTERN E: Trigonometric function: "sin(30)", "cos(60)", etc.
        const trigMatch = raw.match(/^(sin|cos|tan|cot)\((pi\/[0-9]+|[0-9.]+)\)$/i);
        if (trigMatch) {
            const fn = trigMatch[1].toLowerCase();
            const arg = trigMatch[2];
            steps.push({
                title: isEn ? `1. Trigonometric function: ${fn}` : `1. Triqonometrik funksiya: ${fn}`,
                formula: `${fn}(${arg}${angleMode === 'DEG' && !arg.includes('pi') ? '°' : ''}) = ${finalVal}`,
                explanation: isEn ? `Evaluated respecting ${angleMode} angle mode.` : `${angleMode} bucaq rejiminə uyğun olaraq hesablandı.`,
                substeps: [
                    {
                        formula: angleMode === 'DEG'
                            ? (isEn ? 'Angle mode: Degree (°)' : 'Bucaq rejimi: Dərəcə (°)')
                            : (isEn ? 'Angle mode: Radian (rad)' : 'Bucaq rejimi: Radian (rad)'),
                        explanation: isEn ? `Angle evaluation mode is ${angleMode}.` : `Bucaq vahidi ${angleMode} olaraq təyin olunub.`
                    }
                ]
            });

            steps.push({
                title: isEn ? "2. Final Result" : "2. Yekun nəticə",
                formula: `= ${finalVal}`,
                explanation: isEn ? "Exact numerical value." : "Dəqiq ədədi qiymət."
            });

            return {
                empty: false,
                hasVariable: false,
                expression: raw,
                finalResult: finalVal,
                steps,
                altForms
            };
        }

        // DEFAULT: General Arithmetic Steps (PEMDAS breakdown)
        // Try to build intermediate multi-factor steps that preserve full context
        const intermediateSteps = buildIntermediateSteps(raw, finalVal, isEn, MathCore, angleMode);

        if (intermediateSteps && intermediateSteps.length > 0) {
            intermediateSteps.forEach(s => steps.push(s));
        } else {
            steps.push({
                title: isEn ? "1. Expression structure" : "1. İfadənin strukturu",
                formula: raw,
                explanation: isEn
                    ? "Evaluate following standard mathematical order of operations (PEMDAS)."
                    : "Standart riyazi əməliyyat ardıcıllığı (mötərizələr, qüvvətlər, vurma/bölmə, toplama/çıxma) ilə icra olunur.",
                substeps: [
                    {
                        formula: 'PEMDAS: P → E → MD → AS',
                        explanation: isEn ? "Parentheses → Exponents → Multiplication/Division → Addition/Subtraction." : "Mötərizələr → Qüvvətlər → Vurma/Bölmə → Toplama/Çıxma."
                    }
                ]
            });

            if (finalVal !== null) {
                steps.push({
                    title: isEn ? "2. Evaluated result" : "2. Yekun nəticə",
                    formula: `= ${finalVal}`,
                    explanation: isEn ? "Cleaned of floating-point precision artifacts." : "IEEE-754 üzən nöqtə dəqiqlik təmizləyicisi ilə hesablandı.",
                    substeps: [
                        {
                            formula: `${raw} = ${finalVal}`,
                            explanation: isEn ? "Final value verified." : "Yekun qiymət təsdiqləndi."
                        }
                    ]
                });
            }
        }

        return {
            empty: false,
            hasVariable: false,
            expression: raw,
            finalResult: finalVal,
            steps,
            altForms
        };
    }

    /**
     * Build intermediate step cards that preserve full expression context.
     * For compound expressions like "√5 × 3 2/3", this ensures the LHS
     * of each step shows the complete expression rather than dropping earlier factors.
     */
    function buildIntermediateSteps(raw, finalVal, isEn, MC, angleMode) {
        if (finalVal === null || !isFinite(finalVal)) return null;

        // Tokenize by top-level + or - operators (respecting parentheses)
        const tokens = tokenizeTopLevel(raw);
        if (!tokens || tokens.length < 2) {
            // For single-term or simple compound multiplication: try factor decomposition
            const factors = tokenizeFactors(raw);
            if (!factors || factors.length < 2) return null;

            // Multi-factor expression: evaluate each factor while preserving full context
            const steps = [];
            let stepNum = 1;

            steps.push({
                title: isEn ? `${stepNum++}. Expression structure` : `${stepNum++}. İfadənin strukturu`,
                formula: raw,
                explanation: isEn
                    ? "Identify each factor in the expression and evaluate them following PEMDAS."
                    : "İfadədəki hər bir vuruğu müəyyən edin və PEMDAS qaydasına uyğun hesablayın.",
                substeps: [
                    {
                        formula: 'PEMDAS: P → E → MD → AS',
                        explanation: isEn ? "Parentheses → Exponents → Multiplication/Division → Addition/Subtraction." : "Mötərizələr → Qüvvətlər → Vurma/Bölmə → Toplama/Çıxma."
                    }
                ]
            });

            // Show intermediate evaluations preserving full expression context
            let partialExpr = raw;
            const substepsDetail = [];
            for (let i = 0; i < factors.length; i++) {
                const factor = factors[i].term.trim();
                let factorVal;
                try {
                    factorVal = MC && typeof MC.evaluate === 'function'
                        ? MC.evaluate(factor, { angleMode, lang: isEn ? 'en' : 'az' })
                        : null;
                } catch (e) { factorVal = null; }

                if (factorVal !== null && factor !== String(factorVal)) {
                    substepsDetail.push({
                        formula: `${factor} = ${factorVal}`,
                        explanation: isEn ? `Evaluate factor: ${factor}` : `Vuruğu hesablayın: ${factor}`
                    });
                    // Replace the factor in partial expression with its value
                    partialExpr = partialExpr.replace(factor, String(factorVal));
                }
            }

            if (substepsDetail.length > 0) {
                steps.push({
                    title: isEn ? `${stepNum++}. Evaluate individual factors` : `${stepNum++}. Hər bir vuruğu hesablayın`,
                    formula: `${raw} → ${partialExpr}`,
                    explanation: isEn
                        ? "Evaluate each sub-expression while preserving the full expression context."
                        : "Tam ifadə kontekstini qoruyaraq hər bir alt-ifadəni hesablayın.",
                    substeps: substepsDetail
                });
            }

            steps.push({
                title: isEn ? `${stepNum++}. Final Result` : `${stepNum++}. Yekun nəticə`,
                formula: `${raw} = ${finalVal}`,
                explanation: isEn ? "Full expression evaluated with exact precision." : "Tam ifadə dəqiq arifmetik ilə hesablandı.",
                substeps: [
                    {
                        formula: `= ${finalVal}`,
                        explanation: isEn ? "Final value verified." : "Yekun qiymət təsdiqləndi."
                    }
                ]
            });

            return steps;
        }

        // Multi-term addition/subtraction: show each term evaluation
        const steps = [];
        let stepNum = 1;

        steps.push({
            title: isEn ? `${stepNum++}. Expression structure` : `${stepNum++}. İfadənin strukturu`,
            formula: raw,
            explanation: isEn
                ? "Evaluate following standard mathematical order of operations (PEMDAS)."
                : "Standart riyazi əməliyyat ardıcıllığı ilə icra olunur.",
            substeps: [
                {
                    formula: 'PEMDAS: P → E → MD → AS',
                    explanation: isEn ? "Parentheses → Exponents → Multiplication/Division → Addition/Subtraction." : "Mötərizələr → Qüvvətlər → Vurma/Bölmə → Toplama/Çıxma."
                }
            ]
        });

        const termDetails = [];
        for (const t of tokens) {
            const term = t.term.trim();
            let termVal;
            try {
                termVal = MC && typeof MC.evaluate === 'function'
                    ? MC.evaluate(term, { angleMode, lang: isEn ? 'en' : 'az' })
                    : null;
            } catch (e) { termVal = null; }

            if (termVal !== null && term !== String(termVal)) {
                termDetails.push({
                    formula: `${term} = ${termVal}`,
                    explanation: isEn ? `Evaluate term: ${term}` : `Həddi hesablayın: ${term}`
                });
            }
        }

        if (termDetails.length > 0) {
            steps.push({
                title: isEn ? `${stepNum++}. Evaluate each term` : `${stepNum++}. Hər bir həddi hesablayın`,
                formula: raw,
                explanation: isEn ? "Compute sub-expressions preserving full expression context." : "Tam ifadə kontekstini qoruyaraq alt-ifadələri hesablayın.",
                substeps: termDetails
            });
        }

        steps.push({
            title: isEn ? `${stepNum++}. Final Result` : `${stepNum++}. Yekun nəticə`,
            formula: `${raw} = ${finalVal}`,
            explanation: isEn ? "Cleaned of floating-point precision artifacts." : "IEEE-754 üzən nöqtə dəqiqlik təmizləyicisi ilə hesablandı.",
            substeps: [
                {
                    formula: `= ${finalVal}`,
                    explanation: isEn ? "Final value verified." : "Yekun qiymət təsdiqləndi."
                }
            ]
        });

        return steps;
    }

    /**
     * Tokenize expression into top-level terms split by + or - (outside parentheses).
     */
    function tokenizeTopLevel(expr) {
        const tokens = [];
        let depth = 0;
        let current = '';
        for (let i = 0; i < expr.length; i++) {
            const ch = expr[i];
            if (ch === '(') { depth++; current += ch; }
            else if (ch === ')') { depth--; current += ch; }
            else if (depth === 0 && (ch === '+' || ch === '-') && i > 0 && current.trim()) {
                tokens.push({ term: current.trim(), op: ch });
                current = ch === '-' ? '-' : '';
            }
            else { current += ch; }
        }
        if (current.trim()) tokens.push({ term: current.trim() });
        return tokens.length >= 2 ? tokens : null;
    }

    /**
     * Tokenize expression into top-level multiplication/division factors.
     */
    function tokenizeFactors(expr) {
        const tokens = [];
        let depth = 0;
        let current = '';
        for (let i = 0; i < expr.length; i++) {
            const ch = expr[i];
            if (ch === '(') { depth++; current += ch; }
            else if (ch === ')') { depth--; current += ch; }
            else if (depth === 0 && (ch === '*' || ch === '×' || ch === '·' || ch === '/')) {
                if (current.trim()) tokens.push({ term: current.trim(), op: ch });
                current = '';
            }
            else { current += ch; }
        }
        if (current.trim()) tokens.push({ term: current.trim() });
        return tokens.length >= 2 ? tokens : null;
    }

    return {
        hasVariableX,
        toFraction: MathCore ? MathCore.toFraction : null,
        solve
    };
}));
