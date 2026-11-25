/**
 * VisualCharts v3.0.0 — Live 2D Geometry Drawings & Statistical Distribution Charts
 * Renders dynamic SVG diagrams for geometric shapes (with side lengths, heights, angles)
 * and interactive statistical bar charts with mean line indicator for Math Engine AZ.
 * Zero external dependencies.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.VisualCharts = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function formatVal(v) {
        if (v === undefined || v === null || isNaN(v)) return '';
        const n = parseFloat(v);
        if (Number.isInteger(n)) return String(n);
        return parseFloat(n.toFixed(2)).toString();
    }

    function getActiveLang(explicitLang) {
        if (explicitLang === 'en' || explicitLang === 'az') return explicitLang;
        if (typeof window !== 'undefined' && window.I18n && typeof window.I18n.getLanguage === 'function') {
            return window.I18n.getLanguage();
        }
        if (typeof localStorage !== 'undefined') {
            try {
                const s = localStorage.getItem('math_engine_az_lang');
                if (s === 'en' || s === 'az') return s;
            } catch (e) {}
        }
        return 'az';
    }

    /**
     * Render dynamic 2D Geometric Diagram SVG
     */
    function renderGeometry(shapeKey, modeId, vals = {}, lang) {
        if (!shapeKey) return '';
        const isEn = getActiveLang(lang) === 'en';

        const w = 400;
        const h = 280;
        let content = '';

        const accent = 'var(--accent, #4F46E5)';
        const accentFill = 'rgba(79, 70, 229, 0.12)';
        const textCol = 'var(--text, #0F172A)';
        const textSec = 'var(--text-sec, #475569)';
        const guideCol = '#10B981'; // emerald for height/special
        const fontMono = "'JetBrains Mono', monospace";

        switch (shapeKey) {
            case 'circle': {
                const rVal = formatVal(vals.r) || 'r';
                content = `
                    <circle cx="200" cy="140" r="85" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" />
                    <!-- Center Point -->
                    <circle cx="200" cy="140" r="4.5" fill="${accent}" />
                    <!-- Radius Line -->
                    <line x1="200" y1="140" x2="285" y2="140" stroke="${guideCol}" stroke-width="2" stroke-linecap="round" />
                    <circle cx="285" cy="140" r="3" fill="${guideCol}" />
                    <!-- Label -->
                    <text x="242" y="132" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">r = ${rVal}</text>
                    <text x="200" y="248" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Circle' : 'Dairə'} · O(0,0)</text>
                `;
                break;
            }

            case 'square': {
                const aVal = formatVal(vals.a) || 'a';
                content = `
                    <!-- Square Polygon -->
                    <rect x="130" y="65" width="140" height="140" rx="4" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" />
                    <!-- Right Angle Symbol at bottom-left -->
                    <path d="M 130 190 L 145 190 L 145 205" fill="none" stroke="${accent}" stroke-width="1.5" />
                    <circle cx="137" cy="198" r="1.5" fill="${accent}" />
                    <!-- Side a (Bottom) -->
                    <text x="200" y="225" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">a = ${aVal}</text>
                    <!-- Side a (Left) -->
                    <text x="115" y="140" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">a = ${aVal}</text>
                    <!-- Diagonal Dashed Line -->
                    <line x1="130" y1="205" x2="270" y2="65" stroke="${guideCol}" stroke-width="1.8" stroke-dasharray="4 3" />
                    <text x="215" y="125" fill="${guideCol}" font-family="${fontMono}" font-size="11" font-weight="600">d = a√2</text>
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Square' : 'Kvadrat'}</text>
                `;
                break;
            }

            case 'rectangle': {
                const aVal = formatVal(vals.a) || 'a';
                const bVal = formatVal(vals.b) || 'b';
                content = `
                    <!-- Rectangle Polygon -->
                    <rect x="110" y="80" width="180" height="110" rx="4" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" />
                    <!-- Right Angle Symbol -->
                    <path d="M 110 175 L 125 175 L 125 190" fill="none" stroke="${accent}" stroke-width="1.5" />
                    <!-- Side a (Bottom) -->
                    <text x="200" y="212" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">a = ${aVal}</text>
                    <!-- Side b (Left) -->
                    <text x="95" y="140" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">b = ${bVal}</text>
                    <!-- Diagonal Line -->
                    <line x1="110" y1="190" x2="290" y2="80" stroke="${guideCol}" stroke-width="1.8" stroke-dasharray="4 3" />
                    <text x="215" y="130" fill="${guideCol}" font-family="${fontMono}" font-size="11" font-weight="600">d = √(a²+b²)</text>
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Rectangle' : 'Düzbucaqlı'}</text>
                `;
                break;
            }

            case 'triangle': {
                if (modeId === 'right' || modeId === 'right_hyp') {
                    let a = vals.a;
                    let b = vals.b;
                    let c = vals.c !== undefined ? vals.c : vals.hyp;
                    if (c === undefined && a !== undefined && b !== undefined) {
                        c = Math.round(Math.sqrt(a * a + b * b) * 1000) / 1000;
                    } else if (b === undefined && a !== undefined && c !== undefined && c > a) {
                        b = Math.round(Math.sqrt(c * c - a * a) * 1000) / 1000;
                    }
                    const aVal = formatVal(a) || 'a';
                    const bVal = formatVal(b) || 'b';
                    const cVal = formatVal(c) || 'c';
                    content = `
                        <!-- Right Triangle: corner at (110, 200) -->
                        <polygon points="110,70 110,200 290,200" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round" />
                        <!-- Right Angle Marker -->
                        <rect x="110" y="185" width="15" height="15" fill="none" stroke="${accent}" stroke-width="1.5" />
                        <!-- Leg a (Bottom) -->
                        <text x="200" y="220" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">${isEn ? 'Leg a' : 'Katet a'} = ${aVal}</text>
                        <!-- Leg b (Left) -->
                        <text x="95" y="140" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">${isEn ? 'Leg b' : 'Katet b'} = ${bVal}</text>
                        <!-- Hypotenuse c -->
                        <text x="215" y="125" fill="${guideCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">${isEn ? 'Hypotenuse c' : 'Hipotenuz c'} = ${cVal}</text>
                        <!-- Alpha arc -->
                        <path d="M 260 200 A 30 30 0 0 0 270 185" fill="none" stroke="${guideCol}" stroke-width="1.5" />
                        <text x="250" y="195" fill="${guideCol}" font-size="11" font-weight="bold">α</text>
                        <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Right Triangle' : 'Düzbucaqlı Üçbucaq'}</text>
                    `;
                } else if (modeId === 'bh') {
                    const baseVal = formatVal(vals.base) || 'a';
                    const hVal = formatVal(vals.h) || 'h';
                    content = `
                        <!-- Triangle with base and height -->
                        <polygon points="90,200 310,200 200,65" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round" />
                        <!-- Altitude h (dashed) -->
                        <line x1="200" y1="65" x2="200" y2="200" stroke="${guideCol}" stroke-width="2" stroke-dasharray="4 3" />
                        <!-- Right angle box at foot of altitude -->
                        <path d="M 200 188 L 212 188 L 212 200" fill="none" stroke="${guideCol}" stroke-width="1.3" />
                        <!-- Labels -->
                        <text x="215" y="140" fill="${guideCol}" font-family="${fontMono}" font-size="13" font-weight="600">h = ${hVal}</text>
                        <text x="200" y="222" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">${isEn ? 'Base a' : 'Əsas a'} = ${baseVal}</text>
                        <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Triangle' : 'Üçbucaq'}: S = (a · h) / 2</text>
                    `;
                } else {
                    // Heron 3 sides
                    const aVal = formatVal(vals.a) || 'a';
                    const bVal = formatVal(vals.b) || 'b';
                    const cVal = formatVal(vals.c) || 'c';
                    content = `
                        <polygon points="90,200 310,200 220,65" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round" />
                        <text x="200" y="222" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">a = ${aVal}</text>
                        <text x="280" y="130" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600">b = ${bVal}</text>
                        <text x="135" y="130" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600">c = ${cVal}</text>
                        <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Triangle (3 sides - Heron)' : 'Üçbucaq (3 tərəf - Heron)'}</text>
                    `;
                }
                break;
            }

            case 'trapezoid': {
                const aVal = formatVal(vals.a) || 'a';
                const bVal = formatVal(vals.b) || 'b';
                const hVal = formatVal(vals.h) || 'h';
                content = `
                    <!-- Trapezoid -->
                    <polygon points="145,80 255,80 320,200 80,200" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round" />
                    <!-- Top base a -->
                    <text x="200" y="70" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">${isEn ? 'Top base a' : 'Üst əsas a'} = ${aVal}</text>
                    <!-- Bottom base b -->
                    <text x="200" y="222" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">${isEn ? 'Bottom base b' : 'Alt əsas b'} = ${bVal}</text>
                    <!-- Height h (dashed) -->
                    <line x1="145" y1="80" x2="145" y2="200" stroke="${guideCol}" stroke-width="2" stroke-dasharray="4 3" />
                    <path d="M 145 188 L 157 188 L 157 200" fill="none" stroke="${guideCol}" stroke-width="1.3" />
                    <text x="160" y="145" fill="${guideCol}" font-family="${fontMono}" font-size="13" font-weight="600">h = ${hVal}</text>
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Trapezoid' : 'Trapesiya'}</text>
                `;
                break;
            }

            case 'cube': {
                const aVal = formatVal(vals.a) || 'a';
                content = `
                    <!-- Hidden back edges (dashed wireframe) -->
                    <line x1="170" y1="60" x2="170" y2="160" stroke="${accent}" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.55" />
                    <line x1="130" y1="200" x2="170" y2="160" stroke="${accent}" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.55" />
                    <line x1="170" y1="160" x2="270" y2="160" stroke="${accent}" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.55" />
                    <!-- Front face -->
                    <rect x="130" y="100" width="100" height="100" fill="${accentFill}" stroke="${accent}" stroke-width="2" />
                    <!-- Top face -->
                    <polygon points="130,100 170,60 270,60 230,100" fill="rgba(79, 70, 229, 0.08)" stroke="${accent}" stroke-width="2" />
                    <!-- Right face -->
                    <polygon points="230,100 270,60 270,160 230,200" fill="rgba(79, 70, 229, 0.16)" stroke="${accent}" stroke-width="2" />
                    <!-- Space diagonal -->
                    <line x1="130" y1="200" x2="270" y2="60" stroke="${guideCol}" stroke-width="1.6" stroke-dasharray="3 3" />
                    <!-- Side Label -->
                    <text x="180" y="222" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">a = ${aVal}</text>
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Cube' : 'Kub'}: V = a³ · S = 6a²</text>
                `;
                break;
            }

            case 'cuboid': {
                const aVal = formatVal(vals.a) || 'a';
                const bVal = formatVal(vals.b) || 'b';
                const cVal = formatVal(vals.c) || 'c';
                content = `
                    <!-- Hidden back edges -->
                    <line x1="155" y1="65" x2="155" y2="165" stroke="${accent}" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.55" />
                    <line x1="110" y1="200" x2="155" y2="165" stroke="${accent}" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.55" />
                    <line x1="155" y1="165" x2="295" y2="165" stroke="${accent}" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.55" />
                    <!-- Front face -->
                    <rect x="110" y="100" width="140" height="100" fill="${accentFill}" stroke="${accent}" stroke-width="2" />
                    <!-- Top face -->
                    <polygon points="110,100 155,65 295,65 250,100" fill="rgba(79, 70, 229, 0.08)" stroke="${accent}" stroke-width="2" />
                    <!-- Right face -->
                    <polygon points="250,100 295,65 295,165 250,200" fill="rgba(79, 70, 229, 0.16)" stroke="${accent}" stroke-width="2" />
                    <!-- Labels -->
                    <text x="180" y="220" fill="${textCol}" font-family="${fontMono}" font-size="12" font-weight="600" text-anchor="middle">a = ${aVal}</text>
                    <text x="284" y="190" fill="${textCol}" font-family="${fontMono}" font-size="12" font-weight="600">b = ${bVal}</text>
                    <text x="95" y="154" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600" text-anchor="end">c = ${cVal}</text>
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Rectangular Prism' : 'Düzbucaqlı Paralelepiped'}: V = abc</text>
                `;
                break;
            }

            case 'cylinder': {
                const rVal = formatVal(vals.r) || 'r';
                const hVal = formatVal(vals.h) || 'h';
                content = `
                    <!-- Body -->
                    <rect x="140" y="80" width="120" height="110" fill="${accentFill}" stroke="${accent}" stroke-width="2" />
                    <!-- Bottom ellipse -->
                    <ellipse cx="200" cy="190" rx="60" ry="18" fill="rgba(79, 70, 229, 0.2)" stroke="${accent}" stroke-width="2" />
                    <!-- Top ellipse -->
                    <ellipse cx="200" cy="80" rx="60" ry="18" fill="rgba(79, 70, 229, 0.1)" stroke="${accent}" stroke-width="2" />
                    <!-- Radius -->
                    <line x1="200" y1="80" x2="260" y2="80" stroke="${guideCol}" stroke-width="2" stroke-linecap="round" />
                    <text x="230" y="74" fill="${guideCol}" font-family="${fontMono}" font-size="11" font-weight="600">r = ${rVal}</text>
                    <!-- Height -->
                    <line x1="125" y1="80" x2="125" y2="190" stroke="${guideCol}" stroke-width="1.8" stroke-dasharray="3 3" />
                    <text x="110" y="140" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">h = ${hVal}</text>
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Cylinder' : 'Silindr'}: V = πr²h</text>
                `;
                break;
            }

            case 'sphere': {
                const rVal = formatVal(vals.r) || 'r';
                content = `
                    <circle cx="200" cy="135" r="75" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" />
                    <ellipse cx="200" cy="135" rx="75" ry="22" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 3" />
                    <circle cx="200" cy="135" r="4" fill="${accent}" />
                    <line x1="200" y1="135" x2="275" y2="135" stroke="${guideCol}" stroke-width="2" />
                    <text x="238" y="127" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">r = ${rVal}</text>
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Sphere' : 'Kürə'}: V = (4/3)πr³</text>
                `;
                break;
            }

            case 'cone': {
                const rVal = formatVal(vals.r) || 'r';
                const hVal = formatVal(vals.h) || 'h';
                content = `
                    <!-- Cone body -->
                    <polygon points="200,60 135,190 265,190" fill="${accentFill}" stroke="${accent}" stroke-width="2" stroke-linejoin="round" />
                    <!-- Bottom ellipse (front arc solid, back arc dashed) -->
                    <path d="M 135 190 A 65 18 0 0 1 265 190" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
                    <path d="M 135 190 A 65 18 0 0 0 265 190" fill="rgba(79, 70, 229, 0.15)" stroke="${accent}" stroke-width="2" />
                    <!-- Height line -->
                    <line x1="200" y1="60" x2="200" y2="190" stroke="${guideCol}" stroke-width="2" stroke-dasharray="4 3" />
                    <text x="208" y="130" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">h = ${hVal}</text>
                    <!-- Radius -->
                    <line x1="200" y1="190" x2="265" y2="190" stroke="${guideCol}" stroke-width="2" />
                    <text x="235" y="206" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">r = ${rVal}</text>
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Cone' : 'Konus'}: V = (1/3)πr²h</text>
                `;
                break;
            }

            case 'pyramid': {
                const aVal = formatVal(vals.a) || 'a';
                const hVal = formatVal(vals.h) || 'h';
                content = `
                    <!-- Hidden back edges of square base & apex -->
                    <polygon points="105,205 160,165 295,165 240,205" fill="${accentFill}" stroke="none" />
                    <line x1="105" y1="205" x2="160" y2="165" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
                    <line x1="160" y1="165" x2="295" y2="165" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
                    <line x1="200" y1="55" x2="160" y2="165" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
                    <!-- Visible edges -->
                    <polyline points="105,205 240,205 295,165" fill="none" stroke="${accent}" stroke-width="2" stroke-linejoin="round" />
                    <line x1="200" y1="55" x2="105" y2="205" stroke="${accent}" stroke-width="2" />
                    <line x1="200" y1="55" x2="240" y2="205" stroke="${accent}" stroke-width="2" />
                    <line x1="200" y1="55" x2="295" y2="165" stroke="${accent}" stroke-width="2" />
                    <!-- Height h -->
                    <line x1="200" y1="55" x2="200" y2="185" stroke="${guideCol}" stroke-width="2" stroke-dasharray="4 3" />
                    <circle cx="200" cy="185" r="3" fill="${guideCol}" />
                    <text x="208" y="132" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">h = ${hVal}</text>
                    <text x="172" y="224" fill="${textCol}" font-family="${fontMono}" font-size="12" font-weight="600" text-anchor="middle">a = ${aVal}</text>
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Square Pyramid' : 'Düzgün Dördbucaqlı Piramida'}: V = (1/3)a²h</text>
                `;
                break;
            }

            case 'frustum': {
                const RVal = formatVal(vals.R) || 'R';
                const rVal = formatVal(vals.r) || 'r';
                const hVal = formatVal(vals.h) || 'h';
                content = `
                    <!-- Frustum body -->
                    <polygon points="155,80 245,80 285,195 115,195" fill="${accentFill}" stroke="none" />
                    <line x1="155" y1="80" x2="115" y2="195" stroke="${accent}" stroke-width="2" />
                    <line x1="245" y1="80" x2="285" y2="195" stroke="${accent}" stroke-width="2" />
                    <!-- Top ellipse -->
                    <ellipse cx="200" cy="80" rx="45" ry="13" fill="rgba(79, 70, 229, 0.12)" stroke="${accent}" stroke-width="2" />
                    <!-- Bottom ellipse (back dashed, front solid) -->
                    <path d="M 115 195 A 85 20 0 0 1 285 195" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
                    <path d="M 115 195 A 85 20 0 0 0 285 195" fill="rgba(79, 70, 229, 0.15)" stroke="${accent}" stroke-width="2" />
                    <!-- Height h -->
                    <line x1="200" y1="80" x2="200" y2="195" stroke="${guideCol}" stroke-width="2" stroke-dasharray="4 3" />
                    <text x="206" y="142" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">h = ${hVal}</text>
                    <!-- Radii r & R -->
                    <line x1="200" y1="80" x2="245" y2="80" stroke="${guideCol}" stroke-width="1.8" />
                    <text x="223" y="74" fill="${guideCol}" font-family="${fontMono}" font-size="11" font-weight="600">r = ${rVal}</text>
                    <line x1="200" y1="195" x2="285" y2="195" stroke="${guideCol}" stroke-width="1.8" />
                    <text x="245" y="210" fill="${guideCol}" font-family="${fontMono}" font-size="11" font-weight="600">R = ${RVal}</text>
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Conical Frustum' : 'Kəsik Konus'}: V = (1/3)πh(R²+Rr+r²)</text>
                `;
                break;
            }

            case 'polygon': {
                const nRaw = parseInt(vals.n, 10);
                const n = (!isNaN(nRaw) && nRaw >= 3) ? Math.min(nRaw, 12) : 6;
                const nDisplay = (!isNaN(nRaw) && nRaw >= 3) ? nRaw : 'n';
                const aVal = formatVal(vals.a) || 'a';
                const cx = 200;
                const cy = 132;
                const R = 78;
                const pts = [];
                for (let i = 0; i < n; i++) {
                    const ang = -Math.PI / 2 + (2 * Math.PI * i) / n + Math.PI / n;
                    pts.push({
                        x: +(cx + R * Math.cos(ang)).toFixed(2),
                        y: +(cy + R * Math.sin(ang)).toFixed(2)
                    });
                }
                const ptsAttr = pts.map(p => `${p.x},${p.y}`).join(' ');
                const p0 = pts[0];
                const p1 = pts[1];
                const intAngle = (!isNaN(nRaw) && nRaw >= 3) ? formatVal(((nRaw - 2) * 180) / nRaw) + '°' : 'α';
                content = `
                    <polygon points="${ptsAttr}" fill="${accentFill}" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round" />
                    <circle cx="${cx}" cy="${cy}" r="3.5" fill="${accent}" />
                    <text x="${(p0.x + p1.x) / 2 + 12}" y="${(p0.y + p1.y) / 2 + 4}" fill="${textCol}" font-family="${fontMono}" font-size="12" font-weight="600">a = ${aVal}</text>
                    <text x="${cx}" y="${cy - 8}" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600" text-anchor="middle">α = ${intAngle}</text>
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? `Regular ${nDisplay}-gon` : `Düzgün ${nDisplay}-bucaqlı`}: P = n·a</text>
                `;
                break;
            }

            case 'coordinate': {
                const x1 = typeof vals.x1 === 'number' && !isNaN(vals.x1) ? vals.x1 : -2;
                const y1 = typeof vals.y1 === 'number' && !isNaN(vals.y1) ? vals.y1 : -1;
                const x2 = typeof vals.x2 === 'number' && !isNaN(vals.x2) ? vals.x2 : 4;
                const y2 = typeof vals.y2 === 'number' && !isNaN(vals.y2) ? vals.y2 : 3;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;
                const maxAbs = Math.max(Math.abs(x1), Math.abs(y1), Math.abs(x2), Math.abs(y2), 2) * 1.3;
                const ox = 200;
                const oy = 135;
                const scale = 88 / maxAbs;
                const sx1 = +(ox + x1 * scale).toFixed(1);
                const sy1 = +(oy - y1 * scale).toFixed(1);
                const sx2 = +(ox + x2 * scale).toFixed(1);
                const sy2 = +(oy - y2 * scale).toFixed(1);
                const smx = +(ox + mx * scale).toFixed(1);
                const smy = +(oy - my * scale).toFixed(1);
                content = `
                    <!-- Axes -->
                    <line x1="65" y1="${oy}" x2="335" y2="${oy}" stroke="${textSec}" stroke-width="1.2" opacity="0.55" />
                    <line x1="${ox}" y1="30" x2="${ox}" y2="230" stroke="${textSec}" stroke-width="1.2" opacity="0.55" />
                    <text x="340" y="${oy + 4}" fill="${textSec}" font-family="${fontMono}" font-size="11">x</text>
                    <text x="${ox + 6}" y="35" fill="${textSec}" font-family="${fontMono}" font-size="11">y</text>
                    <!-- Segment AB -->
                    <line x1="${sx1}" y1="${sy1}" x2="${sx2}" y2="${sy2}" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" />
                    <!-- Points A, B, M -->
                    <circle cx="${sx1}" cy="${sy1}" r="4.5" fill="${accent}" />
                    <circle cx="${sx2}" cy="${sy2}" r="4.5" fill="${accent}" />
                    <circle cx="${smx}" cy="${smy}" r="4.5" fill="${guideCol}" />
                    <text x="${sx1 - 6}" y="${sy1 - 8}" fill="${textCol}" font-family="${fontMono}" font-size="11" font-weight="600" text-anchor="end">A(${formatVal(x1)},${formatVal(y1)})</text>
                    <text x="${sx2 + 6}" y="${sy2 - 8}" fill="${textCol}" font-family="${fontMono}" font-size="11" font-weight="600">B(${formatVal(x2)},${formatVal(y2)})</text>
                    <text x="${smx + 8}" y="${smy + 14}" fill="${guideCol}" font-family="${fontMono}" font-size="11" font-weight="600">M(${formatVal(mx)},${formatVal(my)})</text>
                    <text x="200" y="256" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Coordinate Method' : 'Koordinatlar Metodu'}: |AB|</text>
                `;
                break;
            }

            case 'vector': {
                const x1 = typeof vals.x1 === 'number' && !isNaN(vals.x1) ? vals.x1 : 3;
                const y1 = typeof vals.y1 === 'number' && !isNaN(vals.y1) ? vals.y1 : 1;
                const x2 = typeof vals.x2 === 'number' && !isNaN(vals.x2) ? vals.x2 : 1;
                const y2 = typeof vals.y2 === 'number' && !isNaN(vals.y2) ? vals.y2 : 3;
                const maxAbs = Math.max(Math.abs(x1), Math.abs(y1), Math.abs(x2), Math.abs(y2), 2) * 1.3;
                const ox = 200;
                const oy = 140;
                const scale = 88 / maxAbs;
                const ux = +(ox + x1 * scale).toFixed(1);
                const uy = +(oy - y1 * scale).toFixed(1);
                const vx = +(ox + x2 * scale).toFixed(1);
                const vy = +(oy - y2 * scale).toFixed(1);

                // Angle arc between u and v
                let arcSvg = '';
                const mu = Math.hypot(x1, y1);
                const mv = Math.hypot(x2, y2);
                if (mu > 1e-9 && mv > 1e-9) {
                    const angU = Math.atan2(-y1, x1);
                    const angV = Math.atan2(-y2, x2);
                    const ar = 26;
                    const ax1 = +(ox + ar * Math.cos(angU)).toFixed(1);
                    const ay1 = +(oy + ar * Math.sin(angU)).toFixed(1);
                    const ax2 = +(ox + ar * Math.cos(angV)).toFixed(1);
                    const ay2 = +(oy + ar * Math.sin(angV)).toFixed(1);
                    let diffAng = angV - angU;
                    while (diffAng > Math.PI) diffAng -= 2 * Math.PI;
                    while (diffAng < -Math.PI) diffAng += 2 * Math.PI;
                    const sweep = diffAng >= 0 ? 1 : 0;
                    const midAng = angU + diffAng / 2;
                    const tx = +(ox + (ar + 12) * Math.cos(midAng)).toFixed(1);
                    const ty = +(oy + (ar + 12) * Math.sin(midAng)).toFixed(1);
                    arcSvg = `
                        <path d="M ${ax1} ${ay1} A ${ar} ${ar} 0 0 ${sweep} ${ax2} ${ay2}" fill="none" stroke="#F59E0B" stroke-width="1.8" />
                        <text x="${tx}" y="${ty}" fill="#F59E0B" font-family="${fontMono}" font-size="11" font-weight="700" text-anchor="middle">θ</text>
                    `;
                }

                content = `
                    <defs>
                        <marker id="vecArrowU" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L7,3 z" fill="${accent}" />
                        </marker>
                        <marker id="vecArrowV" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L7,3 z" fill="${guideCol}" />
                        </marker>
                    </defs>
                    <!-- Axes -->
                    <line x1="65" y1="${oy}" x2="335" y2="${oy}" stroke="${textSec}" stroke-width="1.2" opacity="0.5" />
                    <line x1="${ox}" y1="30" x2="${ox}" y2="230" stroke="${textSec}" stroke-width="1.2" opacity="0.5" />
                    <circle cx="${ox}" cy="${oy}" r="3.5" fill="${textSec}" />
                    ${arcSvg}
                    <!-- Vector u -->
                    <line x1="${ox}" y1="${oy}" x2="${ux}" y2="${uy}" stroke="${accent}" stroke-width="2.5" marker-end="url(#vecArrowU)" />
                    <text x="${ux + 6}" y="${uy - 6}" fill="${accent}" font-family="${fontMono}" font-size="12" font-weight="600">u(${formatVal(x1)},${formatVal(y1)})</text>
                    <!-- Vector v -->
                    <line x1="${ox}" y1="${oy}" x2="${vx}" y2="${vy}" stroke="${guideCol}" stroke-width="2.5" marker-end="url(#vecArrowV)" />
                    <text x="${vx + 6}" y="${vy - 6}" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">v(${formatVal(x2)},${formatVal(y2)})</text>
                    <text x="200" y="256" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? '2D Plane Vectors' : 'Müstəvi Vektorları'}: u · v</text>
                `;
                break;
            }

            default:
                content = `<text x="200" y="140" fill="${textSec}" font-family="${fontMono}" font-size="13" text-anchor="middle">${isEn ? 'No shape selected' : 'Fiqur seçilməyib'}</text>`;
        }

        return `
            <svg class="w-full h-full" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                ${content}
            </svg>
        `;
    }

    /**
     * Render interactive Statistical Distribution / Bar Chart SVG with Mean Line Indicator
     */
    function renderStatistics(dataArray, statsObj = {}, lang) {
        const isEn = getActiveLang(lang) === 'en';
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return `
                <div class="flex items-center justify-center h-full text-text-muted text-xs">
                    ${isEn ? 'Enter numbers to view statistical distribution chart' : 'Statistik göstəricilər üçün ədəd daxil edin'}
                </div>
            `;
        }

        const w = 400;
        const h = 280;
        const padX = 50;
        const padY = 40;
        const chartW = w - padX * 2;
        const chartH = h - padY * 2;

        const nums = dataArray.map(Number).filter(n => !isNaN(n));
        if (nums.length === 0) return '';

        const minVal = Math.min(...nums);
        const maxVal = Math.max(...nums);
        const mean = typeof statsObj.mean === 'number' ? statsObj.mean : (nums.reduce((a, b) => a + b, 0) / nums.length);

        // Compute Y scale
        const yFloor = Math.min(0, minVal);
        const yCeil = Math.max(maxVal * 1.15, mean * 1.15, 1);
        const yRange = yCeil - yFloor || 1;

        const getY = v => h - padY - ((v - yFloor) / yRange) * chartH;
        const zeroY = getY(0);
        const meanY = getY(mean);

        // Bar layout
        const n = Math.min(nums.length, 16); // up to 16 bars
        const displayNums = nums.slice(0, n);
        const barSpacing = chartW / n;
        const barWidth = Math.min(Math.max(barSpacing * 0.65, 8), 36);

        let barsSvg = '';
        displayNums.forEach((val, i) => {
            const x = padX + i * barSpacing + (barSpacing - barWidth) / 2;
            const y = getY(Math.max(val, 0));
            const barH = Math.max(Math.abs(getY(val) - zeroY), 3);

            barsSvg += `
                <g class="stat-bar-group">
                    <rect x="${x}" y="${val >= 0 ? y : zeroY}" width="${barWidth}" height="${barH}" rx="3"
                          fill="url(#statBarGrad)" stroke="var(--accent, #4F46E5)" stroke-width="1.2" opacity="0.9" />
                    <!-- Bar Value Label -->
                    <text x="${x + barWidth / 2}" y="${val >= 0 ? y - 5 : zeroY + barH + 12}"
                          fill="var(--text, #0F172A)" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" text-anchor="middle">
                        ${formatVal(val)}
                    </text>
                    <!-- X Index Label -->
                    <text x="${x + barWidth / 2}" y="${h - padY + 16}"
                          fill="var(--text-sec, #94A3B8)" font-family="'JetBrains Mono', monospace" font-size="9" text-anchor="middle">
                        #${i + 1}
                    </text>
                </g>
            `;
        });

        return `
            <svg class="w-full h-full" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="statBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="var(--accent, #4F46E5)" stop-opacity="0.9" />
                        <stop offset="100%" stop-color="var(--accent-hover, #4338CA)" stop-opacity="0.4" />
                    </linearGradient>
                </defs>

                <!-- Coordinate Gridlines -->
                <line x1="${padX}" y1="${getY(yCeil * 0.75)}" x2="${w - padX}" y2="${getY(yCeil * 0.75)}" stroke="var(--border, #E2E8F0)" stroke-width="0.8" stroke-dasharray="3 3" />
                <line x1="${padX}" y1="${getY(yCeil * 0.5)}" x2="${w - padX}" y2="${getY(yCeil * 0.5)}" stroke="var(--border, #E2E8F0)" stroke-width="0.8" stroke-dasharray="3 3" />
                <line x1="${padX}" y1="${getY(yCeil * 0.25)}" x2="${w - padX}" y2="${getY(yCeil * 0.25)}" stroke="var(--border, #E2E8F0)" stroke-width="0.8" stroke-dasharray="3 3" />

                <!-- Base Zero Axis -->
                <line x1="${padX - 5}" y1="${zeroY}" x2="${w - padX + 5}" y2="${zeroY}" stroke="var(--border-strong, #CBD5E1)" stroke-width="1.5" />

                <!-- Sample Size & Header Info -->
                <text x="${padX}" y="28" fill="var(--text-sec, #94A3B8)" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600">
                    n = ${nums.length}
                </text>

                <!-- Bars -->
                ${barsSvg}

                <!-- Mean Line Indicator (Green Dashed) -->
                <line x1="${padX - 5}" y1="${meanY}" x2="${w - padX + 5}" y2="${meanY}" stroke="#10B981" stroke-width="2" stroke-dasharray="5 3" />
                <circle cx="${w - padX + 5}" cy="${meanY}" r="3.5" fill="#10B981" />
                <text x="${w - padX - 4}" y="${meanY - 6}" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" text-anchor="end">
                    x̄ = ${formatVal(mean)}
                </text>
            </svg>
        `;
    }

    /**
     * Render Complex Argand Plane (Re vs Im) with z1 and z2 vectors (v3.4.0)
     */
    function renderComplexArgand(a, b, c, d, lang) {
        const isEn = getActiveLang(lang) === 'en';
        const w = 400;
        const h = 280;
        const ox = 200;
        const oy = 140;
        const accent = 'var(--accent, #4F46E5)';
        const guideCol = '#10B981';
        const textCol = 'var(--text, #0F172A)';
        const textSec = 'var(--text-sec, #475569)';
        const fontMono = "'JetBrains Mono', monospace";

        const maxAbs = Math.max(Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d), 2) * 1.3;
        const scale = 90 / maxAbs;
        const x1 = +(ox + a * scale).toFixed(1);
        const y1 = +(oy - b * scale).toFixed(1);
        const x2 = +(ox + c * scale).toFixed(1);
        const y2 = +(oy - d * scale).toFixed(1);

        return `
            <svg class="w-full h-full" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <marker id="argArrow1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L7,3 z" fill="${accent}" />
                    </marker>
                    <marker id="argArrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L7,3 z" fill="${guideCol}" />
                    </marker>
                </defs>
                <line x1="55" y1="${oy}" x2="345" y2="${oy}" stroke="${textSec}" stroke-width="1.2" opacity="0.55" />
                <line x1="${ox}" y1="26" x2="${ox}" y2="238" stroke="${textSec}" stroke-width="1.2" opacity="0.55" />
                <text x="348" y="${oy + 4}" fill="${textSec}" font-family="${fontMono}" font-size="11" font-weight="600">Re</text>
                <text x="${ox + 6}" y="30" fill="${textSec}" font-family="${fontMono}" font-size="11" font-weight="600">Im</text>
                <circle cx="${ox}" cy="${oy}" r="3" fill="${textSec}" />
                <line x1="${ox}" y1="${oy}" x2="${x1}" y2="${y1}" stroke="${accent}" stroke-width="2.5" marker-end="url(#argArrow1)" />
                <text x="${x1 + 6}" y="${y1 - 6}" fill="${accent}" font-family="${fontMono}" font-size="11" font-weight="600">z₁(${formatVal(a)},${formatVal(b)})</text>
                <line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" stroke="${guideCol}" stroke-width="2.5" marker-end="url(#argArrow2)" />
                <text x="${x2 + 6}" y="${y2 + 12}" fill="${guideCol}" font-family="${fontMono}" font-size="11" font-weight="600">z₂(${formatVal(c)},${formatVal(d)})</text>
                <text x="200" y="264" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">${isEn ? 'Complex Argand Plane (Re / Im)' : 'Kompleks Arqan Müstəvisi (Re / Im)'}</text>
            </svg>
        `;
    }

    /**
     * Render Quadratic/Linear Inequality parabola/line & highlighted x-axis solution intervals (v3.4.0)
     */
    function renderInequalityGraph(sol, lang) {
        const isEn = getActiveLang(lang) === 'en';
        const w = 400;
        const h = 280;
        const ox = 200;
        const oy = 148;
        const accent = 'var(--accent, #4F46E5)';
        const guideCol = '#10B981';
        const textSec = 'var(--text-sec, #475569)';
        const fontMono = "'JetBrains Mono', monospace";

        if (!sol) return '';
        const { a, b, c, roots = [], intervals = [], intervalStr } = sol;
        const maxRoot = roots.length ? Math.max(...roots.map(Math.abs), 2) : 4;
        const xSpan = Math.max(maxRoot * 1.8, 5);
        const scaleX = 145 / xSpan;

        // Sample y values to determine vertical scale
        const samples = [];
        for (let i = -40; i <= 40; i++) {
            const x = (i / 40) * xSpan;
            const y = a * x * x + b * x + c;
            samples.push({ x, y });
        }
        const maxAbsY = Math.max(...samples.map(s => Math.abs(s.y)), 4);
        const scaleY = 85 / maxAbsY;

        const pathPts = samples.map((s, idx) => {
            const sx = +(ox + s.x * scaleX).toFixed(1);
            const sy = +(oy - s.y * scaleY).toFixed(1);
            return `${idx === 0 ? 'M' : 'L'} ${sx} ${Math.max(24, Math.min(242, sy))}`;
        }).join(' ');

        // Highlight solution intervals along x-axis
        const intervalSvg = intervals.map(iv => {
            const sx1 = iv.from === -Infinity ? 40 : Math.max(40, Math.min(360, ox + iv.from * scaleX));
            const sx2 = iv.to === Infinity ? 360 : Math.max(40, Math.min(360, ox + iv.to * scaleX));
            let marks = `<line x1="${sx1}" y1="${oy}" x2="${sx2}" y2="${oy}" stroke="${guideCol}" stroke-width="5" opacity="0.85" />`;
            if (isFinite(iv.from)) {
                marks += `<circle cx="${sx1}" cy="${oy}" r="4.5" fill="${iv.leftClosed ? guideCol : '#FFFFFF'}" stroke="${guideCol}" stroke-width="2" />`;
            }
            if (isFinite(iv.to)) {
                marks += `<circle cx="${sx2}" cy="${oy}" r="4.5" fill="${iv.rightClosed ? guideCol : '#FFFFFF'}" stroke="${guideCol}" stroke-width="2" />`;
            }
            return marks;
        }).join('');

        return `
            <svg class="w-full h-full" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <line x1="40" y1="${oy}" x2="360" y2="${oy}" stroke="${textSec}" stroke-width="1.2" opacity="0.55" />
                <line x1="${ox}" y1="24" x2="${ox}" y2="242" stroke="${textSec}" stroke-width="1.2" opacity="0.55" />
                <path d="${pathPts}" fill="none" stroke="${accent}" stroke-width="2.2" />
                ${intervalSvg}
                <text x="200" y="264" fill="${textSec}" font-family="${fontMono}" font-size="11.5" text-anchor="middle">${isEn ? 'Solution' : 'Həll'}: ${intervalStr}</text>
            </svg>
        `;
    }

    /**
     * Render Geometric Progression discrete terms (k, b_k) up to min(n, 12) (v3.4.0)
     */
    function renderGeometricProgression(gp, lang) {
        const isEn = getActiveLang(lang) === 'en';
        if (!gp || !Array.isArray(gp.terms) || gp.terms.length === 0) return '';
        const statsObj = {
            mean: gp.terms.reduce((acc, t) => acc + t.value, 0) / gp.terms.length
        };
        const w = 400;
        const h = 280;
        const padX = 48;
        const padY = 40;
        const chartW = w - padX * 2;
        const chartH = h - padY * 2;
        const accent = 'var(--accent, #4F46E5)';
        const textCol = 'var(--text, #0F172A)';
        const textSec = 'var(--text-sec, #475569)';
        const fontMono = "'JetBrains Mono', monospace";

        const vals = gp.terms.map(t => t.value);
        const yMin = Math.min(0, ...vals);
        const yMax = Math.max(0, ...vals, 1);
        const yRange = (yMax - yMin) || 1;
        const getY = v => h - padY - ((v - yMin) / yRange) * chartH;
        const zeroY = getY(0);
        const stepW = chartW / gp.terms.length;
        const barW = Math.max(8, Math.min(28, stepW * 0.6));

        const bars = gp.terms.map((t, i) => {
            const cx = padX + i * stepW + stepW / 2;
            const yVal = getY(t.value);
            const topY = Math.min(yVal, zeroY);
            const barH = Math.max(2, Math.abs(zeroY - yVal));
            return `
                <rect x="${(cx - barW / 2).toFixed(1)}" y="${topY.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="3" fill="${accent}" opacity="0.82" />
                <circle cx="${cx.toFixed(1)}" cy="${yVal.toFixed(1)}" r="3.2" fill="#10B981" />
                <text x="${cx.toFixed(1)}" y="${h - padY + 14}" fill="${textSec}" font-family="${fontMono}" font-size="9.5" text-anchor="middle">${t.k}</text>
            `;
        }).join('');

        return `
            <svg class="w-full h-full" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <line x1="${padX}" y1="${zeroY.toFixed(1)}" x2="${w - padX}" y2="${zeroY.toFixed(1)}" stroke="${textSec}" stroke-width="1.2" opacity="0.65" />
                ${bars}
                <text x="200" y="26" fill="${textCol}" font-family="${fontMono}" font-size="11.5" font-weight="600" text-anchor="middle">${isEn ? `Geometric Progression (b₁=${formatVal(gp.b1)}, q=${formatVal(gp.q)})` : `Həndəsi Silsilə (b₁=${formatVal(gp.b1)}, q=${formatVal(gp.q)})`}</text>
                <text x="200" y="266" fill="${textSec}" font-family="${fontMono}" font-size="11" text-anchor="middle">${isEn ? `Showing first ${gp.terms.length} terms (bₖ)` : `İlk ${gp.terms.length} hədd (bₖ)`}</text>
            </svg>
        `;
    }

    return {
        renderGeometry,
        renderStatistics,
        renderComplexArgand,
        renderInequalityGraph,
        renderGeometricProgression
    };
}));
