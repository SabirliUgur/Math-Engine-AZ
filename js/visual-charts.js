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

    /**
     * Render dynamic 2D Geometric Diagram SVG
     */
    function renderGeometry(shapeKey, modeId, vals = {}) {
        if (!shapeKey) return '';

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
                    <text x="200" y="248" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Dairə (Circle) · O(0,0)</text>
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
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Kvadrat (Square)</text>
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
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Düzbucaqlı (Rectangle)</text>
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
                        <text x="200" y="220" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">Katet a = ${aVal}</text>
                        <!-- Leg b (Left) -->
                        <text x="95" y="140" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">Katet b = ${bVal}</text>
                        <!-- Hypotenuse c -->
                        <text x="215" y="125" fill="${guideCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">Hipotenuz c = ${cVal}</text>
                        <!-- Alpha arc -->
                        <path d="M 260 200 A 30 30 0 0 0 270 185" fill="none" stroke="${guideCol}" stroke-width="1.5" />
                        <text x="250" y="195" fill="${guideCol}" font-size="11" font-weight="bold">α</text>
                        <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Düzbucaqlı Üçbucaq (Right Triangle)</text>
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
                        <text x="200" y="222" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">Əsas a = ${baseVal}</text>
                        <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Üçbucaq: S = (a · h) / 2</text>
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
                        <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Üçbucaq (3 tərəf - Heron)</text>
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
                    <text x="200" y="70" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">Üst əsas a = ${aVal}</text>
                    <!-- Bottom base b -->
                    <text x="200" y="222" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">Alt əsas b = ${bVal}</text>
                    <!-- Height h (dashed) -->
                    <line x1="145" y1="80" x2="145" y2="200" stroke="${guideCol}" stroke-width="2" stroke-dasharray="4 3" />
                    <path d="M 145 188 L 157 188 L 157 200" fill="none" stroke="${guideCol}" stroke-width="1.3" />
                    <text x="160" y="145" fill="${guideCol}" font-family="${fontMono}" font-size="13" font-weight="600">h = ${hVal}</text>
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Trapesiya (Trapezoid)</text>
                `;
                break;
            }

            case 'cube': {
                const aVal = formatVal(vals.a) || 'a';
                content = `
                    <!-- Front face -->
                    <rect x="130" y="100" width="100" height="100" fill="${accentFill}" stroke="${accent}" stroke-width="2" />
                    <!-- Top face -->
                    <polygon points="130,100 170,60 270,60 230,100" fill="rgba(79, 70, 229, 0.08)" stroke="${accent}" stroke-width="2" />
                    <!-- Right face -->
                    <polygon points="230,100 270,60 270,160 230,200" fill="rgba(79, 70, 229, 0.16)" stroke="${accent}" stroke-width="2" />
                    <!-- Side Label -->
                    <text x="180" y="222" fill="${textCol}" font-family="${fontMono}" font-size="13" font-weight="600" text-anchor="middle">a = ${aVal}</text>
                    <text x="200" y="255" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Kub: V = a³ · S = 6a²</text>
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
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Silindr (Cylinder)</text>
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
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Kürə (Sphere): V = (4/3)πr³</text>
                `;
                break;
            }

            case 'cone': {
                const rVal = formatVal(vals.r) || 'r';
                const hVal = formatVal(vals.h) || 'h';
                content = `
                    <!-- Cone body -->
                    <polygon points="200,60 135,190 265,190" fill="${accentFill}" stroke="${accent}" stroke-width="2" stroke-linejoin="round" />
                    <!-- Bottom ellipse -->
                    <ellipse cx="200" cy="190" rx="65" ry="18" fill="rgba(79, 70, 229, 0.15)" stroke="${accent}" stroke-width="2" />
                    <!-- Height line -->
                    <line x1="200" y1="60" x2="200" y2="190" stroke="${guideCol}" stroke-width="2" stroke-dasharray="4 3" />
                    <text x="208" y="130" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">h = ${hVal}</text>
                    <!-- Radius -->
                    <line x1="200" y1="190" x2="265" y2="190" stroke="${guideCol}" stroke-width="2" />
                    <text x="235" y="206" fill="${guideCol}" font-family="${fontMono}" font-size="12" font-weight="600">r = ${rVal}</text>
                    <text x="200" y="250" fill="${textSec}" font-family="${fontMono}" font-size="12" text-anchor="middle">Konus (Cone)</text>
                `;
                break;
            }

            default:
                content = `<text x="200" y="140" fill="${textSec}" font-family="${fontMono}" font-size="13" text-anchor="middle">Fiqur seçilməyib</text>`;
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
    function renderStatistics(dataArray, statsObj = {}) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return `
                <div class="flex items-center justify-center h-full text-text-muted text-xs">
                    Statistik göstəricilər üçün ədəd daxil edin
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

    return {
        renderGeometry,
        renderStatistics
    };
}));
