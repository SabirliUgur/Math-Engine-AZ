/* ============================================================
   ELMI KALKULYATOR — APP.JS (v2.0.0 — "Modern Split-Workspace UI & Dual-Theme Overhaul")
   Bütün riyazi hesablamalar lokal olaraq MathCore mühərriki ilə icra olunur.
   Heç bir eval() və ya new Function() istifadə olunmur.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebarDrawer();
    initTabs();
    initSubTabs();
    initCalculator();
    initCalculatorModeToggle();
    initCopyButton();
    initVisualCardZoom();
    initGeometry();
    initPercentage();
    initMatrix();
    loadHistory();
    initInputFocusTracking();

    window.addEventListener('resize', () => {
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer && !canvasContainer.classList.contains('hidden')) {
            plotFunction();
        }
    });
});

/* Track last focused input for Tarixçə / Ans injection */
let lastFocusedInput = null;
function initInputFocusTracking() {
    document.addEventListener('focusin', (e) => {
        if (e.target && e.target.matches('input[type="text"], input[type="number"]')) {
            lastFocusedInput = e.target;
        }
    });
}

/* ==========================================================
   1. THEME MANAGEMENT (Dual-Theme: Light & Dark)
   ========================================================== */
function initTheme() {
    const saved = localStorage.getItem('calcTheme') || 'dark';
    applyTheme(saved === 'dark');

    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark-theme');
            applyTheme(!isDark);
        });
    }
}

function applyTheme(isDark) {
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');

    if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark', 'dark-theme');
        if (icon) icon.textContent = 'light_mode';
        if (label) label.textContent = 'İşıqlı';
        localStorage.setItem('calcTheme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark', 'dark-theme');
        document.body.classList.add('light-theme');
        if (icon) icon.textContent = 'dark_mode';
        if (label) label.textContent = 'Qaranlıq';
        localStorage.setItem('calcTheme', 'light');
    }
}

/* ==========================================================
   2. MOBILE SIDEBAR DRAWER
   ========================================================== */
function initSidebarDrawer() {
    const sidebar = document.getElementById('appSidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const backdrop = document.getElementById('sidebarBackdrop');

    if (!sidebar || !toggleBtn || !backdrop) return;

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('open');
    });

    backdrop.addEventListener('click', closeMobileSidebar);
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
}

/* ==========================================================
   3. TABS & VISUAL CARD INTEGRATION
   ========================================================== */
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById('sec-' + btn.dataset.tab);
            if (target) target.classList.add('active');
            updateVisualCard(btn.dataset.tab);
            closeMobileSidebar();
        });
    });
}

function initSubTabs() {
    document.querySelectorAll('.sub-tabs').forEach(container => {
        container.querySelectorAll('.sub-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.closest('.tab-section');
                parent.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
                parent.querySelectorAll('.sub-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const targetSub = parent.querySelector('#sub-' + btn.dataset.subtab);
                if (targetSub) targetSub.classList.add('active');

                // If switching to Graph subtab in Analysis, activate canvas
                if (parent.id === 'sec-analysis') {
                    updateVisualCard('analysis', btn.dataset.subtab);
                }
            });
        });
    });
}

function updateVisualCard(tabId, subtabId) {
    const visualTitle = document.getElementById('visual-title');
    const visualSubtitle = document.getElementById('visual-subtitle');
    const visualBadgeText = document.getElementById('visual-badge-text');
    const gridContainer = document.getElementById('visual-grid-container');
    const canvasContainer = document.getElementById('canvas-container');

    if (!visualTitle) return;

    if (tabId === 'analysis' && subtabId === 'graph') {
        visualTitle.textContent = 'Funksiya Qrafiki';
        visualSubtitle.textContent = '2D İnteraktiv Qrafik Müstəvisi';
        if (visualBadgeText) visualBadgeText.textContent = 'f(x) qrafiki aktivdir';
        if (gridContainer) gridContainer.classList.add('hidden');
        if (canvasContainer) canvasContainer.classList.remove('hidden');
        plotFunction();
    } else {
        if (gridContainer) gridContainer.classList.remove('hidden');
        if (canvasContainer) canvasContainer.classList.add('hidden');

        switch (tabId) {
            case 'calculator':
                visualTitle.textContent = 'Vizual Model və Qrafik';
                visualSubtitle.textContent = 'Koordinat müstəvisi · 2D';
                if (visualBadgeText) visualBadgeText.textContent = 'Funksiyanı daxil edin və ya əməliyyatı seçin';
                break;
            case 'geometry':
                visualTitle.textContent = 'Həndəsi Fiqur Modeli';
                visualSubtitle.textContent = '2D / 3D Həndəsə Müstəvisi';
                if (visualBadgeText) visualBadgeText.textContent = 'Seçilmiş fiqurun həndəsi parametrləri';
                break;
            case 'algebra':
                visualTitle.textContent = 'Cəbri Analiz və Köklər';
                visualSubtitle.textContent = 'Funksiya və Tənliklər Müstəvisi';
                if (visualBadgeText) visualBadgeText.textContent = 'Tənlik kökləri və asılılıqlar';
                break;
            case 'analysis':
                visualTitle.textContent = 'Riyazi Analiz Müstəvisi';
                visualSubtitle.textContent = 'Törəmə və İnteqral Dinamikası';
                if (visualBadgeText) visualBadgeText.textContent = 'Analitik əyrilər və sahələr';
                break;
            case 'statistics':
                visualTitle.textContent = 'Statistik Paylanma Modeli';
                visualSubtitle.textContent = 'Ehtimal və Paylanma Əyrisi';
                if (visualBadgeText) visualBadgeText.textContent = 'Statistik paylanma və matrislər';
                break;
        }
    }
}

/* ==========================================================
   4. BƏSİT / ELMİ KEYPAD SEGMENTED TOGGLE
   ========================================================== */
function initCalculatorModeToggle() {
    const modeElmi = document.getElementById('mode-elmi');
    const modeBesit = document.getElementById('mode-besit');
    const keypad = document.getElementById('calcButtons');
    const sciKeys = document.querySelectorAll('[data-sci="true"]');

    if (!modeElmi || !modeBesit || !keypad) return;

    function setKeypadMode(isElmi) {
        if (isElmi) {
            modeElmi.classList.add('active');
            modeBesit.classList.remove('active');
            keypad.classList.remove('is-besit');
            sciKeys.forEach(k => {
                k.style.display = '';
            });
        } else {
            modeBesit.classList.add('active');
            modeElmi.classList.remove('active');
            keypad.classList.add('is-besit');
            sciKeys.forEach(k => {
                k.style.display = 'none';
            });
        }
    }

    modeElmi.addEventListener('click', () => setKeypadMode(true));
    modeBesit.addEventListener('click', () => setKeypadMode(false));
}

/* ==========================================================
   5. COPY RESULT ACTION
   ========================================================== */
function initCopyButton() {
    const copyBtn = document.getElementById('copy-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const textToCopy = (calcState.result || '0').trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopySuccess();
            }).catch(() => {
                fallbackCopy(textToCopy);
            });
        } else {
            fallbackCopy(textToCopy);
        }
    });

    function showCopySuccess() {
        const icon = document.getElementById('copy-icon');
        if (icon) {
            icon.textContent = 'check';
            setTimeout(() => {
                icon.textContent = 'content_copy';
            }, 1500);
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showCopySuccess();
        } catch {}
        document.body.removeChild(ta);
    }
}

/* ==========================================================
   6. VISUAL CARD ZOOM CONTROLS
   ========================================================== */
function initVisualCardZoom() {
    const graphSvg = document.getElementById('graph-svg');
    const canvas = document.getElementById('graphCanvas');
    const zoomIn = document.getElementById('zoom-in-btn');
    const zoomOut = document.getElementById('zoom-out-btn');
    const zoomReset = document.getElementById('zoom-reset-btn');

    if (!zoomIn || !zoomOut || !zoomReset) return;

    let zoomLevel = 1;

    zoomIn.addEventListener('click', () => {
        zoomLevel = Math.min(2.5, zoomLevel + 0.2);
        applyZoom();
    });

    zoomOut.addEventListener('click', () => {
        zoomLevel = Math.max(0.5, zoomLevel - 0.2);
        applyZoom();
    });

    zoomReset.addEventListener('click', () => {
        zoomLevel = 1;
        applyZoom();
    });

    function applyZoom() {
        if (graphSvg) graphSvg.style.transform = `scale(${zoomLevel})`;
        if (canvas && !canvas.parentElement.classList.contains('hidden')) {
            canvas.style.transform = `scale(${zoomLevel})`;
            canvas.style.transformOrigin = 'center center';
        }
    }
}

/* ==========================================================
   7. PERSISTENT HISTORY & ANS MEMORY
   ========================================================== */
let historyData = [];

function loadHistory() {
    if (window.MathCore && MathCore.HistoryStore) {
        historyData = MathCore.HistoryStore.getAll();
    } else {
        try {
            historyData = JSON.parse(localStorage.getItem('math_engine_az_history_v1') || '[]');
        } catch { historyData = []; }
    }
    renderHistory();
}

function addToHistory(type, expression, result) {
    if (window.MathCore && MathCore.HistoryStore) {
        MathCore.HistoryStore.add(type, expression, result);
        historyData = MathCore.HistoryStore.getAll();
    } else {
        historyData.unshift({
            id: Date.now(),
            type,
            expression,
            result: String(result),
            time: new Date().toLocaleTimeString('az')
        });
        if (historyData.length > 100) historyData.pop();
        localStorage.setItem('math_engine_az_history_v1', JSON.stringify(historyData));
    }
    renderHistory();
}

function clearHistory() {
    if (window.MathCore && MathCore.HistoryStore) {
        MathCore.HistoryStore.clear();
    } else {
        localStorage.removeItem('math_engine_az_history_v1');
    }
    historyData = [];
    renderHistory();
}

function exportHistory() {
    if (window.MathCore && MathCore.HistoryStore) {
        MathCore.HistoryStore.exportJSON();
    }
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    if (historyData.length === 0) {
        list.innerHTML = '<p class="history-empty-msg">Hələ hesablama yoxdur</p>';
        return;
    }
    list.innerHTML = historyData.map((h, i) => `
        <button class="history-item-btn" type="button" onclick="useHistoryItem(${i})" title="Klikləyin: Nəticəni daxil edin (${escHtml(String(h.result))})">
            <div class="h-top">
                <span>${escHtml(h.type)}</span>
                <span>${escHtml(h.time)}</span>
            </div>
            <div class="h-expr">${escHtml(h.expression)}</div>
            <div class="h-res">= ${escHtml(String(h.result))}</div>
        </button>
    `).join('');
}

function useHistoryItem(index) {
    const item = historyData[index];
    if (!item) return;

    const valToInsert = item.result;

    // If an input is currently active/focused elsewhere, insert value there
    if (lastFocusedInput && document.body.contains(lastFocusedInput) && lastFocusedInput.id !== 'calcExpression') {
        lastFocusedInput.value = valToInsert;
        lastFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));
        lastFocusedInput.dispatchEvent(new Event('change', { bubbles: true }));
        lastFocusedInput.focus();
        return;
    }

    // Default to Calculator tab
    const calcTab = document.querySelector('[data-tab="calculator"]');
    if (calcTab) calcTab.click();

    if (calcState.justCalculated || !calcState.expression.trim()) {
        calcState.expression = String(valToInsert);
        calcState.justCalculated = false;
    } else {
        calcState.expression += String(valToInsert);
    }
    calcState.result = String(valToInsert);

    if (window.MathCore && MathCore.HistoryStore) {
        MathCore.HistoryStore.setAns(parseFloat(valToInsert) || 0);
    }

    document.getElementById('calcExpression').textContent = formatExprDisplay(calcState.expression);
    document.getElementById('calcResult').textContent = calcState.result;
}

function toggleHistory() {
    const p = document.getElementById('historyPanel');
    if (p) p.classList.toggle('open');
}

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================
   4. SCIENTIFIC CALCULATOR
   ========================================================== */
const calcState = {
    expression: '',
    result: '0',
    angleMode: 'DEG', // DEG or RAD
    justCalculated: false
};

function initCalculator() {
    const btns = document.getElementById('calcButtons');
    if (btns) {
        btns.addEventListener('click', e => {
            const btn = e.target.closest('.calc-key, .btn');
            if (!btn) return;
            handleCalcButton(btn.dataset.action, btn.dataset.value || btn.dataset.val);
        });
    }

    const angleBtn = document.getElementById('angleModeBtn');
    if (angleBtn) {
        angleBtn.addEventListener('click', () => {
            calcState.angleMode = calcState.angleMode === 'DEG' ? 'RAD' : 'DEG';
            angleBtn.textContent = calcState.angleMode;
            // Re-evaluate live preview if applicable
            if (calcState.expression.trim()) {
                try {
                    const preview = evalMathExpr(calcState.expression);
                    if (preview !== null && isFinite(preview)) {
                        document.getElementById('calcResult').textContent = formatNumber(preview);
                    }
                } catch {}
            }
        });
    }

    // Keyboard support
    document.addEventListener('keydown', e => {
        const active = document.querySelector('.tab-section.active');
        if (!active || active.id !== 'sec-calculator') return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        const key = e.key;
        if (/^[0-9]$/.test(key)) handleCalcButton('num', key);
        else if (key === '.') handleCalcButton('decimal');
        else if (key === '+') handleCalcButton('op', '+');
        else if (key === '-') handleCalcButton('op', '-');
        else if (key === '*') handleCalcButton('op', '*');
        else if (key === '/') { e.preventDefault(); handleCalcButton('op', '/'); }
        else if (key === '(') handleCalcButton('openParen');
        else if (key === ')') handleCalcButton('closeParen');
        else if (key === '^') handleCalcButton('pow');
        else if (key === '!') handleCalcButton('factorial');
        else if (key === 'Enter' || key === '=') handleCalcButton('equals');
        else if (key === 'Backspace') handleCalcButton('backspace');
        else if (key === 'Escape') handleCalcButton('allClear');
        else if (key === '%') handleCalcButton('percent');
    });
}

function handleCalcButton(action, value) {
    const exprEl = document.getElementById('calcExpression');
    const resEl = document.getElementById('calcResult');

    switch (action) {
        case 'num':
            if (calcState.justCalculated) { calcState.expression = ''; calcState.justCalculated = false; }
            calcState.expression += value;
            break;
        case 'decimal':
            if (calcState.justCalculated) { calcState.expression = '0'; calcState.justCalculated = false; }
            calcState.expression += '.';
            break;
        case 'op':
            calcState.justCalculated = false;
            calcState.expression += ' ' + value + ' ';
            break;
        case 'openParen':
            if (calcState.justCalculated) { calcState.expression = ''; calcState.justCalculated = false; }
            calcState.expression += '(';
            break;
        case 'closeParen':
            calcState.expression += ')';
            break;
        case 'sin': appendFunc('sin('); break;
        case 'cos': appendFunc('cos('); break;
        case 'tan': appendFunc('tan('); break;
        case 'cot': appendFunc('cot('); break;
        case 'ln':  appendFunc('ln('); break;
        case 'log': appendFunc('log('); break;
        case 'sqrt': appendFunc('sqrt('); break;
        case 'square':
            wrapNegativeBaseIfNeeded();
            calcState.expression += '^2';
            break;
        case 'pow':
            wrapNegativeBaseIfNeeded();
            calcState.expression += '^';
            break;
        case 'factorial':
            calcState.expression += '!';
            break;
        case 'pi':
            if (calcState.justCalculated) { calcState.expression = ''; calcState.justCalculated = false; }
            calcState.expression += 'pi';
            break;
        case 'e':
            if (calcState.justCalculated) { calcState.expression = ''; calcState.justCalculated = false; }
            calcState.expression += 'e';
            break;
        case 'ans':
            if (calcState.justCalculated) { calcState.expression = ''; calcState.justCalculated = false; }
            calcState.expression += 'ans';
            break;
        case 'percent':
            calcState.expression += '%';
            break;
        case 'negate':
            toggleSign();
            break;
        case 'del':
        case 'backspace':
            calcState.expression = calcState.expression.trimEnd();
            if (calcState.expression.endsWith(' ')) {
                calcState.expression = calcState.expression.slice(0, -3);
            } else {
                calcState.expression = calcState.expression.slice(0, -1);
            }
            break;
        case 'ac':
        case 'clear':
        case 'allClear':
            calcState.expression = '';
            calcState.result = '0';
            calcState.justCalculated = false;
            break;
        case 'equals':
            evaluateCalc();
            return;
    }

    if (action !== 'equals') {
        // Live preview
        try {
            if (calcState.expression.trim()) {
                const preview = evalMathExpr(calcState.expression);
                if (preview !== null && isFinite(preview)) {
                    calcState.result = formatNumber(preview);
                    updateCalcDisplay(false);
                    return;
                }
            }
        } catch {}
        updateCalcDisplay(false);
    }
}

/**
 * Automatically wrap negative base in parentheses when applying power (^ or ^2)
 * e.g. -3 followed by x² becomes (-3)^2 which evaluates to 9 instead of -9
 */
function wrapNegativeBaseIfNeeded() {
    if (calcState.justCalculated) {
        let res = String(calcState.result).trim();
        calcState.justCalculated = false;
        if (res.startsWith('-')) {
            calcState.expression = `(${res})`;
            return;
        }
    }

    let expr = calcState.expression.trimEnd();
    if (!expr) return;
    if (/\(-[0-9.]+\)$/.test(expr)) return;

    // Check if expression ends with unary negative number or variable
    const match = expr.match(/(^|[+*/(,]\s*)-\s*([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)$/);
    if (match) {
        const prefix = match[1] || '';
        const base = match[2];
        const beforeMatch = expr.slice(0, expr.length - match[0].length);
        calcState.expression = beforeMatch + prefix + `(-${base})`;
    }
}

/**
 * Cleanly toggle sign (±) between X and (-X), or -X and X
 */
function toggleSign() {
    if (calcState.justCalculated) {
        let val = String(calcState.result).trim();
        calcState.justCalculated = false;
        if (val.startsWith('-')) {
            calcState.expression = val.slice(1);
        } else if (val.startsWith('(-') && val.endsWith(')')) {
            calcState.expression = val.slice(2, -1);
        } else if (val !== '0') {
            calcState.expression = `(-${val})`;
        }
        calcState.result = calcState.expression;
        updateCalcDisplay(false);
        return;
    }

    let expr = calcState.expression.trim();
    if (!expr) {
        calcState.expression = '(-';
        return;
    }

    // If ends with (-number) -> unwrap to number
    if (/\(-([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)\)$/.test(expr)) {
        calcState.expression = expr.replace(/\(-([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)\)$/, '$1');
        return;
    }

    // If entire expression is -(...) -> unwrap to ...
    if (expr.startsWith('-(') && expr.endsWith(')')) {
        calcState.expression = expr.slice(2, -1);
        return;
    }

    // If expression ends with unary negative: -number -> toggle to number
    const negMatch = expr.match(/(^|[+*/(,]\s*)-\s*([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)$/);
    if (negMatch) {
        const prefix = negMatch[1] || '';
        const base = negMatch[2];
        const beforeMatch = expr.slice(0, expr.length - negMatch[0].length);
        calcState.expression = beforeMatch + prefix + base;
        return;
    }

    // If expression ends with a positive number/identifier:
    const posMatch = expr.match(/(^|[+*/(,]\s*)([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)$/);
    if (posMatch) {
        const prefix = posMatch[1] || '';
        const base = posMatch[2];
        const beforeMatch = expr.slice(0, expr.length - posMatch[0].length);
        calcState.expression = beforeMatch + prefix + `(-${base})`;
        return;
    }

    // Fallback: wrap whole expr
    calcState.expression = '-(' + expr + ')';
}

/**
 * Update Calculator screen with dynamic font size and error styling
 */
function updateCalcDisplay(isError = false) {
    const resEl = document.getElementById('calcResult');
    const exprEl = document.getElementById('calcExpression');
    if (!resEl || !exprEl) return;

    exprEl.textContent = formatExprDisplay(calcState.expression) || '\u00A0';
    resEl.textContent = calcState.result;

    resEl.classList.remove('is-error', 'text-medium', 'text-long');
    if (isError) {
        resEl.classList.add('is-error');
    } else {
        const len = (calcState.result || '').length;
        if (len > 18) {
            resEl.classList.add('text-long');
        } else if (len > 10) {
            resEl.classList.add('text-medium');
        }
    }
}

function appendFunc(fn) {
    if (calcState.justCalculated) { calcState.expression = ''; calcState.justCalculated = false; }
    calcState.expression += fn;
}

function evaluateCalc() {
    if (!calcState.expression.trim()) return;
    try {
        const result = evalMathExpr(calcState.expression);
        if (result === null || result === undefined || isNaN(result)) {
            throw new Error('Hesablana bilmədi');
        }
        const display = formatNumber(result);
        addToHistory('Kalkulyator', calcState.expression, display);
        if (window.MathCore && MathCore.HistoryStore) {
            MathCore.HistoryStore.setAns(result);
        }
        calcState.result = display;
        calcState.justCalculated = true;
        updateCalcDisplay(false);
    } catch (err) {
        calcState.result = err.message || 'Xəta';
        updateCalcDisplay(true);
    }
}

function evalMathExpr(expr) {
    if (window.MathCore && typeof MathCore.evaluate === 'function') {
        return MathCore.evaluate(expr, {
            angleMode: calcState.angleMode,
            ans: MathCore.HistoryStore.getAns()
        });
    }
    throw new Error('MathCore mühərriki tapılmadı');
}

function formatNumber(n) {
    if (typeof n !== 'number') {
        const p = parseFloat(n);
        if (isNaN(p)) return String(n);
        n = p;
    }
    if (window.MathCore && typeof MathCore.cleanPrecision === 'function') {
        n = MathCore.cleanPrecision(n);
    }
    if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();

    let s = n.toPrecision(10);
    if (s.includes('.')) s = s.replace(/\.?0+$/, '');
    if (Math.abs(n) > 1e15 || (Math.abs(n) < 1e-6 && n !== 0)) {
        return n.toExponential(6);
    }
    return s;
}

function formatExprDisplay(expr) {
    return expr
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/pi/g, 'π')
        .replace(/sqrt/g, '√')
        .replace(/log10/g, 'log₁₀');
}

/* ==========================================================
   5. GEOMETRY
   ========================================================== */
const shapes = {
    circle: {
        name: 'Dairə',
        modes: [
            { id: 'r', label: 'Radius verilir', inputs: [{id:'r', label:'Radius (r)'}] }
        ]
    },
    square: {
        name: 'Kvadrat',
        modes: [
            { id: 'a', label: 'Tərəf verilir', inputs: [{id:'a', label:'Tərəf (a)'}] }
        ]
    },
    rectangle: {
        name: 'Düzbucaqlı',
        modes: [
            { id: 'ab', label: 'Tərəflər verilir', inputs: [{id:'a', label:'Tərəf a'}, {id:'b', label:'Tərəf b'}] }
        ]
    },
    triangle: {
        name: 'Üçbucaq',
        modes: [
            { id: 'bh', label: 'Əsas və hündürlük', inputs: [{id:'base', label:'Əsas (a)'}, {id:'h', label:'Hündürlük (h)'}] },
            { id: 'heron', label: '3 tərəf (Heron)', inputs: [{id:'a', label:'Tərəf a'}, {id:'b', label:'Tərəf b'}, {id:'c', label:'Tərəf c'}] },
            { id: 'right', label: 'Düzbucaqlı: 2 katet', inputs: [{id:'a', label:'Katet a'}, {id:'b', label:'Katet b'}] },
            { id: 'right_hyp', label: 'Düzbucaqlı: Katet və hipotenuz', inputs: [{id:'a', label:'Katet (a)'}, {id:'c', label:'Hipotenuz (c)'}] }
        ]
    },
    trapezoid: {
        name: 'Trapesiya',
        modes: [
            { id: 'abh', label: 'Əsaslar və hündürlük', inputs: [{id:'a', label:'Üst əsas (a)'}, {id:'b', label:'Alt əsas (b)'}, {id:'h', label:'Hündürlük (h)'}] }
        ]
    },
    cube: {
        name: 'Kub',
        modes: [
            { id: 'a', label: 'Tərəf verilir', inputs: [{id:'a', label:'Tərəf (a)'}] }
        ]
    },
    cylinder: {
        name: 'Silindr',
        modes: [
            { id: 'rh', label: 'Radius və hündürlük', inputs: [{id:'r', label:'Radius (r)'}, {id:'h', label:'Hündürlük (h)'}] }
        ]
    },
    sphere: {
        name: 'Kürə',
        modes: [
            { id: 'r', label: 'Radius verilir', inputs: [{id:'r', label:'Radius (r)'}] }
        ]
    },
    cone: {
        name: 'Konus',
        modes: [
            { id: 'rh', label: 'Radius və hündürlük', inputs: [{id:'r', label:'Radius (r)'}, {id:'h', label:'Hündürlük (h)'}] }
        ]
    }
};

let currentShape = null;
let currentMode = null;

function initGeometry() {
    document.getElementById('shapeSelect').addEventListener('change', onShapeSelect);
}

function onShapeSelect() {
    const val = document.getElementById('shapeSelect').value;
    const modeDiv = document.getElementById('shapeInputMode');
    const inputsDiv = document.getElementById('shapeInputs');
    const calcBtn = document.getElementById('geoCalcBtn');
    const resultsDiv = document.getElementById('geoResults');

    resultsDiv.innerHTML = '';

    if (!val || !shapes[val]) {
        modeDiv.style.display = 'none';
        inputsDiv.innerHTML = '';
        calcBtn.style.display = 'none';
        currentShape = null;
        return;
    }

    currentShape = val;
    const shape = shapes[val];

    if (shape.modes.length > 1) {
        modeDiv.style.display = 'block';
        modeDiv.innerHTML = `<label>Hesablama üsulu:</label>
            <select id="inputModeSelect" onchange="onInputModeChange()">
                ${shape.modes.map(m => `<option value="${m.id}">${m.label}</option>`).join('')}
            </select>`;
        currentMode = shape.modes[0].id;
    } else {
        modeDiv.style.display = 'none';
        currentMode = shape.modes[0].id;
    }

    renderShapeInputs();
    calcBtn.style.display = 'inline-flex';
}

function onInputModeChange() {
    currentMode = document.getElementById('inputModeSelect').value;
    renderShapeInputs();
    document.getElementById('geoResults').innerHTML = '';
}

function renderShapeInputs() {
    const shape = shapes[currentShape];
    const mode = shape.modes.find(m => m.id === currentMode);
    if (!mode) return;

    document.getElementById('shapeInputs').innerHTML = mode.inputs.map(inp =>
        `<div class="input-group">
            <label>${inp.label}</label>
            <input type="text" inputmode="text" autocomplete="off" id="geo_${inp.id}" placeholder="Məs: 3, √3, 2√5, π/2">
        </div>`
    ).join('');

    // Attach focus listeners so quick-symbol bar targets active input
    document.querySelectorAll('#shapeInputs input').forEach(input => {
        input.addEventListener('focus', () => {
            lastFocusedInput = input;
        });
    });
}

function insertGeoSymbol(sym) {
    let target = lastFocusedInput;
    const container = document.getElementById('shapeInputs');
    if (!target || !container || !container.contains(target)) {
        target = document.querySelector('#shapeInputs input');
    }
    if (!target) return;

    const start = target.selectionStart !== null ? target.selectionStart : target.value.length;
    const end = target.selectionEnd !== null ? target.selectionEnd : target.value.length;
    const val = target.value;
    target.value = val.substring(0, start) + sym + val.substring(end);
    target.selectionStart = target.selectionEnd = start + sym.length;
    target.focus();
    target.dispatchEvent(new Event('input', { bubbles: true }));
}

function calculateGeometry() {
    if (!currentShape) return;
    const shape = shapes[currentShape];
    const mode = shape.modes.find(m => m.id === currentMode);
    const vals = {};
    let valid = true;
    let errorMsg = '';

    mode.inputs.forEach(inp => {
        const el = document.getElementById('geo_' + inp.id);
        const rawVal = el ? el.value.trim() : '';
        if (!rawVal) {
            valid = false;
            errorMsg = 'Zəhmət olmasa bütün xanaları doldurun.';
            return;
        }
        let v;
        try {
            v = (window.MathCore && typeof MathCore.evaluate === 'function')
                ? MathCore.evaluate(rawVal, { angleMode: 'DEG' })
                : parseFloat(rawVal);
        } catch (e) {
            valid = false;
            errorMsg = 'Xəta (' + inp.label + '): ' + (e.message || 'Düzgün riyazi ifadə daxil edin');
            return;
        }
        if (isNaN(v) || !isFinite(v) || v <= 0) {
            valid = false;
            errorMsg = inp.label + ' müsbət ədəd və ya düzgün riyazi ifadə olmalıdır (> 0).';
            return;
        }
        vals[inp.id] = v;
    });

    if (!valid) {
        showGeoResult(`<span class="error">${errorMsg || 'Tərəfin uzunluğu müsbət ədəd və ya düzgün riyazi ifadə olmalıdır.'}</span>`);
        return;
    }

    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    let results = [];
    const π = Math.PI;

    switch (currentShape) {
        case 'circle': {
            const r = vals.r;
            results.push({ label: 'Sahə', formula: 'S = π · r²', value: clean(π * r * r) });
            results.push({ label: 'Çevrə', formula: 'C = 2 · π · r', value: clean(2 * π * r) });
            break;
        }
        case 'square': {
            const a = vals.a;
            results.push({ label: 'Sahə', formula: 'S = a²', value: clean(a * a) });
            results.push({ label: 'Perimetr', formula: 'P = 4 · a', value: clean(4 * a) });
            results.push({ label: 'Diaqonal', formula: 'd = a · √2', value: clean(a * Math.sqrt(2)) });
            break;
        }
        case 'rectangle': {
            const a = vals.a, b = vals.b;
            results.push({ label: 'Sahə', formula: 'S = a · b', value: clean(a * b) });
            results.push({ label: 'Perimetr', formula: 'P = 2 · (a + b)', value: clean(2 * (a + b)) });
            results.push({ label: 'Diaqonal', formula: 'd = √(a² + b²)', value: clean(Math.sqrt(a*a + b*b)) });
            break;
        }
        case 'triangle': {
            if (currentMode === 'bh') {
                const base = vals.base, h = vals.h;
                results.push({ label: 'Sahə', formula: 'S = (a · h) / 2', value: clean((base * h) / 2) });
            } else if (currentMode === 'heron') {
                const a = vals.a, b = vals.b, c = vals.c;
                if (a + b <= c || a + c <= b || b + c <= a) {
                    showGeoResult('<span class="error">Bu tərəflərlə üçbucaq qurmaq mümkün deyil (üçbucaq bərabərsizliyi ödənmir).</span>');
                    return;
                }
                const s = (a + b + c) / 2;
                const area = Math.sqrt(s * (s-a) * (s-b) * (s-c));
                results.push({ label: 'Yarımperimetr', formula: 's = (a + b + c) / 2', value: clean(s) });
                results.push({ label: 'Sahə', formula: 'S = √(s·(s−a)·(s−b)·(s−c))', value: clean(area) });
                results.push({ label: 'Perimetr', formula: 'P = a + b + c', value: clean(a + b + c) });
            } else if (currentMode === 'right') {
                const a = vals.a, b = vals.b;
                const hyp = Math.sqrt(a*a + b*b);
                results.push({ label: 'Sahə', formula: 'S = (a · b) / 2', value: clean((a * b) / 2) });
                results.push({ label: 'Hipotenuz', formula: 'c = √(a² + b²)', value: clean(hyp) });
                results.push({ label: 'Perimetr', formula: 'P = a + b + c', value: clean(a + b + hyp) });
            } else if (currentMode === 'right_hyp') {
                const a = vals.a, c = vals.c;
                if (a >= c) {
                    showGeoResult('<span class="error">Xəta: Hipotenuz katetdən böyük olmalıdır (c > a)</span>');
                    return;
                }
                const b = clean(Math.sqrt(c * c - a * a));
                const area = clean((a * b) / 2);
                const p = clean(a + b + c);
                const alpha = clean(Math.asin(a / c) * 180 / Math.PI);
                const beta = clean(90 - alpha);

                results.push({ label: 'Məchul katet (b)', formula: 'b = √(c² − a²)', value: b });
                results.push({ label: 'Perimetr', formula: 'P = a + b + c', value: p });
                results.push({ label: 'Sahə', formula: 'S = (a · b) / 2', value: area });
                results.push({ label: 'Bucaq α (katet a qarşısı)', formula: 'α = arcsin(a / c)', value: alpha, unit: '°' });
                results.push({ label: 'Bucaq β (katet b qarşısı)', formula: 'β = 90° − α', value: beta, unit: '°' });
            }
            break;
        }
        case 'trapezoid': {
            const a = vals.a, b = vals.b, h = vals.h;
            results.push({ label: 'Sahə', formula: 'S = ((a + b) · h) / 2', value: clean(((a + b) * h) / 2) });
            break;
        }
        case 'cube': {
            const a = vals.a;
            results.push({ label: 'Həcm', formula: 'V = a³', value: clean(a * a * a) });
            results.push({ label: 'Tam səthi', formula: 'S = 6 · a²', value: clean(6 * a * a) });
            results.push({ label: 'Üz diaqonalı', formula: 'd_üz = a · √2', value: clean(a * Math.sqrt(2)) });
            results.push({ label: 'Fəza diaqonalı', formula: 'd = a · √3', value: clean(a * Math.sqrt(3)) });
            break;
        }
        case 'cylinder': {
            const r = vals.r, h = vals.h;
            results.push({ label: 'Həcm', formula: 'V = π · r² · h', value: clean(π * r * r * h) });
            results.push({ label: 'Yan səthi', formula: 'S_yan = 2 · π · r · h', value: clean(2 * π * r * h) });
            results.push({ label: 'Tam səthi', formula: 'S = 2 · π · r · (r + h)', value: clean(2 * π * r * (r + h)) });
            break;
        }
        case 'sphere': {
            const r = vals.r;
            results.push({ label: 'Həcm', formula: 'V = (4/3) · π · r³', value: clean((4/3) * π * r * r * r) });
            results.push({ label: 'Səthi', formula: 'S = 4 · π · r²', value: clean(4 * π * r * r) });
            break;
        }
        case 'cone': {
            const r = vals.r, h = vals.h;
            const l = Math.sqrt(r*r + h*h);
            results.push({ label: 'Həcm', formula: 'V = (1/3) · π · r² · h', value: clean((1/3) * π * r * r * h) });
            results.push({ label: 'Çəpər hündürlük', formula: 'l = √(r² + h²)', value: clean(l) });
            results.push({ label: 'Yan səthi', formula: 'S_yan = π · r · l', value: clean(π * r * l) });
            results.push({ label: 'Tam səthi', formula: 'S = π · r · (r + l)', value: clean(π * r * (r + l)) });
            break;
        }
    }

    const html = results.map(r =>
        `<div><span class="label">${r.label}:</span> <span class="value">${formatNumber(r.value)}</span></div>
         <span class="formula">${r.formula}</span>`
    ).join('');

    showGeoResult(html);
    addToHistory('Həndəsə', `${shape.name} (${mode.label})`, results.map(r => `${r.label} = ${formatNumber(r.value)}`).join(', '));
}

function showGeoResult(html) {
    document.getElementById('geoResults').innerHTML = html;
}

/* ==========================================================
   6. ALGEBRA — Quadratic, Linear Systems, Percent, Sequence
   ========================================================== */
function solveQuadratic() {
    const a = parseFloat(document.getElementById('qa').value);
    const b = parseFloat(document.getElementById('qb').value);
    const c = parseFloat(document.getElementById('qc').value);
    const out = document.getElementById('quadraticResult');

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        out.innerHTML = '<span class="error">Zəhmət olmasa a, b, c qiymətlərini daxil edin.</span>';
        return;
    }
    if (a === 0) {
        out.innerHTML = '<span class="error">a ≠ 0 olmalıdır (əks halda bu xətti tənlikdir).</span>';
        return;
    }

    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    const D = clean(b * b - 4 * a * c);
    let html = `<span class="formula">D = b² − 4ac = ${b}² − 4·${a}·${c} = ${formatNumber(D)}</span>`;

    if (D > 0) {
        const x1 = clean((-b + Math.sqrt(D)) / (2 * a));
        const x2 = clean((-b - Math.sqrt(D)) / (2 * a));
        html += `<div>D &gt; 0 → iki fərqli həqiqi kök var:</div>`;
        html += `<span class="formula">x₁ = (−b + √D) / 2a = ${formatNumber(x1)}</span>`;
        html += `<span class="formula">x₂ = (−b − √D) / 2a = ${formatNumber(x2)}</span>`;
        addToHistory('Cəbr', `${a}x²+${b}x+${c}=0`, `x₁=${formatNumber(x1)}, x₂=${formatNumber(x2)}`);
    } else if (D === 0) {
        const x = clean(-b / (2 * a));
        html += `<div>D = 0 → bir kök (qoşa kök):</div>`;
        html += `<span class="formula">x = −b / 2a = ${formatNumber(x)}</span>`;
        addToHistory('Cəbr', `${a}x²+${b}x+${c}=0`, `x=${formatNumber(x)}`);
    } else {
        const real = clean(-b / (2 * a));
        const imag = clean(Math.sqrt(-D) / (2 * a));
        html += `<div>D &lt; 0 → kompleks köklər:</div>`;
        html += `<span class="formula">x₁ = ${formatNumber(real)} + ${formatNumber(imag)}i</span>`;
        html += `<span class="formula">x₂ = ${formatNumber(real)} − ${formatNumber(imag)}i</span>`;
        addToHistory('Cəbr', `${a}x²+${b}x+${c}=0`, `${formatNumber(real)}±${formatNumber(imag)}i`);
    }

    out.innerHTML = html;
}

/* ---------- Linear 2x2 ---------- */
function solveLinear2() {
    const a1 = parseFloat(document.getElementById('l2a1').value);
    const b1 = parseFloat(document.getElementById('l2b1').value);
    const c1 = parseFloat(document.getElementById('l2c1').value);
    const a2 = parseFloat(document.getElementById('l2a2').value);
    const b2 = parseFloat(document.getElementById('l2b2').value);
    const c2 = parseFloat(document.getElementById('l2c2').value);
    const out = document.getElementById('linear2Result');

    if ([a1,b1,c1,a2,b2,c2].some(isNaN)) {
        out.innerHTML = '<span class="error">Bütün əmsalları daxil edin.</span>';
        return;
    }

    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    const D = clean(a1*b2 - a2*b1);
    const Dx = clean(c1*b2 - c2*b1);
    const Dy = clean(a1*c2 - a2*c1);

    let html = `<span class="formula">D = a₁·b₂ − a₂·b₁ = ${formatNumber(D)}</span>`;

    if (Math.abs(D) < 1e-12) {
        html += `<div class="error">D = 0: Sistemin yeganə həlli yoxdur (sonsuz sayda həll və ya həll yoxdur).</div>`;
    } else {
        const x = clean(Dx / D);
        const y = clean(Dy / D);
        html += `<span class="formula">Dx = c₁·b₂ − c₂·b₁ = ${formatNumber(Dx)}</span>`;
        html += `<span class="formula">Dy = a₁·c₂ − a₂·c₁ = ${formatNumber(Dy)}</span>`;
        html += `<div><span class="label">x = </span><span class="value">${formatNumber(x)}</span></div>`;
        html += `<div><span class="label">y = </span><span class="value">${formatNumber(y)}</span></div>`;
        addToHistory('Cəbr', '2 məchullu sistem', `x=${formatNumber(x)}, y=${formatNumber(y)}`);
    }
    out.innerHTML = html;
}

/* ---------- Linear 3x3 ---------- */
function det3(m) {
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    return clean(
        m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
      - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
      + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0])
    );
}

function solveLinear3() {
    const g = id => parseFloat(document.getElementById(id).value);
    const a = [[g('l3a1'),g('l3b1'),g('l3c1')],
               [g('l3a2'),g('l3b2'),g('l3c2')],
               [g('l3a3'),g('l3b3'),g('l3c3')]];
    const d = [g('l3d1'), g('l3d2'), g('l3d3')];
    const out = document.getElementById('linear3Result');

    if ([...a.flat(), ...d].some(isNaN)) {
        out.innerHTML = '<span class="error">Bütün əmsalları daxil edin.</span>';
        return;
    }

    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    const D = det3(a);
    let html = `<span class="formula">D = ${formatNumber(D)}</span>`;

    if (Math.abs(D) < 1e-12) {
        html += `<div class="error">D = 0: Sistemin yeganə həlli yoxdur.</div>`;
    } else {
        const Dx = det3([[d[0],a[0][1],a[0][2]],[d[1],a[1][1],a[1][2]],[d[2],a[2][1],a[2][2]]]);
        const Dy = det3([[a[0][0],d[0],a[0][2]],[a[1][0],d[1],a[1][2]],[a[2][0],d[2],a[2][2]]]);
        const Dz = det3([[a[0][0],a[0][1],d[0]],[a[1][0],a[1][1],d[1]],[a[2][0],a[2][1],d[2]]]);
        const x = clean(Dx / D);
        const y = clean(Dy / D);
        const z = clean(Dz / D);
        html += `<div><span class="label">x = </span><span class="value">${formatNumber(x)}</span></div>`;
        html += `<div><span class="label">y = </span><span class="value">${formatNumber(y)}</span></div>`;
        html += `<div><span class="label">z = </span><span class="value">${formatNumber(z)}</span></div>`;
        addToHistory('Cəbr', '3 məchullu sistem', `x=${formatNumber(x)}, y=${formatNumber(y)}, z=${formatNumber(z)}`);
    }
    out.innerHTML = html;
}

/* ---------- Percentage ---------- */
function initPercentage() {
    updatePctInputs();
}

function updatePctInputs() {
    const type = document.getElementById('pctType').value;
    const div = document.getElementById('pctInputs');
    document.getElementById('percentResult').innerHTML = '';

    const configs = {
        findPercent:  [{id:'pctVal', label:'Ədəd'}, {id:'pctPct', label:'Faiz (%)'}],
        whatPercent:  [{id:'pctPart', label:'Hissə'}, {id:'pctWhole', label:'Tam'}],
        findWhole:    [{id:'pctPart', label:'Hissə (X)'}, {id:'pctPct', label:'Faiz (%)'}],
        increase:     [{id:'pctVal', label:'Ədəd'}, {id:'pctPct', label:'Faiz (%)'}],
        decrease:     [{id:'pctVal', label:'Ədəd'}, {id:'pctPct', label:'Faiz (%)'}]
    };

    const inputs = configs[type] || [];
    div.innerHTML = inputs.map(inp =>
        `<div class="input-group"><label>${inp.label}</label><input type="number" id="${inp.id}" step="any"></div>`
    ).join('');
}

function calcPercentage() {
    const type = document.getElementById('pctType').value;
    const out = document.getElementById('percentResult');
    const g = id => { const el = document.getElementById(id); return el ? parseFloat(el.value) : NaN; };
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;

    let result, formula, label;

    switch(type) {
        case 'findPercent': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = '<span class="error">Qiymətləri daxil edin.</span>'; return; }
            result = clean(val * pct / 100);
            formula = `${val} × ${pct}% = ${val} × ${pct}/100`;
            label = `${val}-in ${pct}%-i`;
            break;
        }
        case 'whatPercent': {
            const part = g('pctPart'), whole = g('pctWhole');
            if (isNaN(part) || isNaN(whole) || whole === 0) { out.innerHTML = '<span class="error">Qiymətləri daxil edin (tam ≠ 0).</span>'; return; }
            result = clean((part / whole) * 100);
            formula = `(${part} / ${whole}) × 100`;
            label = `Faiz nisbəti`;
            break;
        }
        case 'findWhole': {
            const part = g('pctPart'), pct = g('pctPct');
            if (isNaN(part) || isNaN(pct) || pct === 0) { out.innerHTML = '<span class="error">Qiymətləri daxil edin (faiz ≠ 0).</span>'; return; }
            result = clean(part * 100 / pct);
            formula = `${part} × 100 / ${pct}`;
            label = `Tam ədəd`;
            break;
        }
        case 'increase': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = '<span class="error">Qiymətləri daxil edin.</span>'; return; }
            result = clean(val * (1 + pct / 100));
            formula = `${val} × (1 + ${pct}/100)`;
            label = `${pct}% artımla`;
            break;
        }
        case 'decrease': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = '<span class="error">Qiymətləri daxil edin.</span>'; return; }
            result = clean(val * (1 - pct / 100));
            formula = `${val} × (1 − ${pct}/100)`;
            label = `${pct}% azalma ilə`;
            break;
        }
    }

    out.innerHTML = `<div><span class="label">${label}:</span> <span class="value">${formatNumber(result)}</span></div>
                     <span class="formula">${formula} = ${formatNumber(result)}</span>`;
    addToHistory('Cəbr', label, formatNumber(result));
}

/* ---------- Sequence ---------- */
function updateSeqLabel() {
    const type = document.querySelector('input[name="seqType"]:checked').value;
    document.getElementById('seqDLabel').textContent = type === 'arithmetic' ? 'd =' : 'q =';
}

function calcSequence() {
    const type = document.querySelector('input[name="seqType"]:checked').value;
    const a1 = parseFloat(document.getElementById('seqA1').value);
    const d = parseFloat(document.getElementById('seqD').value);
    const n = parseInt(document.getElementById('seqN').value);
    const out = document.getElementById('sequenceResult');
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;

    if (isNaN(a1) || isNaN(d) || isNaN(n) || n < 1) {
        out.innerHTML = '<span class="error">Zəhmət olmasa düzgün qiymətlər daxil edin (n ≥ 1).</span>';
        return;
    }

    let html = '';
    if (type === 'arithmetic') {
        const an = clean(a1 + (n - 1) * d);
        const Sn = clean(n * (a1 + an) / 2);
        html += `<span class="formula">aₙ = a₁ + (n−1)·d = ${a1} + ${n-1}·${d} = ${formatNumber(an)}</span>`;
        html += `<span class="formula">Sₙ = n·(a₁ + aₙ)/2 = ${n}·(${a1} + ${formatNumber(an)})/2 = ${formatNumber(Sn)}</span>`;
        html += `<div><span class="label">aₙ = </span><span class="value">${formatNumber(an)}</span></div>`;
        html += `<div><span class="label">Sₙ = </span><span class="value">${formatNumber(Sn)}</span></div>`;

        const terms = [];
        for (let i = 0; i < Math.min(n, 8); i++) terms.push(formatNumber(clean(a1 + i * d)));
        if (n > 8) terms.push('...');
        html += `<div style="margin-top:.5rem;color:var(--text-sec)">Silsilə: ${terms.join(', ')}</div>`;
        addToHistory('Cəbr', `Ədədi: a₁=${a1}, d=${d}, n=${n}`, `aₙ=${formatNumber(an)}, Sₙ=${formatNumber(Sn)}`);
    } else {
        if (d === 0) { out.innerHTML = '<span class="error">q ≠ 0 olmalıdır.</span>'; return; }
        const an = clean(a1 * Math.pow(d, n - 1));
        const Sn = clean(d === 1 ? a1 * n : a1 * (Math.pow(d, n) - 1) / (d - 1));
        html += `<span class="formula">aₙ = a₁ · qⁿ⁻¹ = ${a1} · ${d}^${n-1} = ${formatNumber(an)}</span>`;
        html += `<span class="formula">Sₙ = a₁·(qⁿ − 1)/(q − 1) = ${formatNumber(Sn)}</span>`;
        html += `<div><span class="label">aₙ = </span><span class="value">${formatNumber(an)}</span></div>`;
        html += `<div><span class="label">Sₙ = </span><span class="value">${formatNumber(Sn)}</span></div>`;

        const terms = [];
        for (let i = 0; i < Math.min(n, 8); i++) terms.push(formatNumber(clean(a1 * Math.pow(d, i))));
        if (n > 8) terms.push('...');
        html += `<div style="margin-top:.5rem;color:var(--text-sec)">Silsilə: ${terms.join(', ')}</div>`;
        addToHistory('Cəbr', `Həndəsi: a₁=${a1}, q=${d}, n=${n}`, `aₙ=${formatNumber(an)}, Sₙ=${formatNumber(Sn)}`);
    }
    out.innerHTML = html;
}

/* ==========================================================
   7. ANALYSIS — Derivative, Integral, Graph
   ========================================================== */
function calcDerivative() {
    const expr = document.getElementById('derivFunc').value.trim();
    const out = document.getElementById('derivativeResult');

    if (!expr) { out.innerHTML = '<span class="error">Funksiya daxil edin.</span>'; return; }

    try {
        let simplified;
        if (window.MathCore && typeof MathCore.derivative === 'function') {
            simplified = MathCore.derivative(expr, 'x');
        } else if (typeof math !== 'undefined' && math.derivative) {
            simplified = math.derivative(expr, 'x').toString();
        } else {
            throw new Error('Törəmə mühərriki tapılmadı');
        }

        out.innerHTML = `<div><span class="label">f(x) = </span>${escHtml(expr)}</div>
                         <div><span class="label">f′(x) = </span><span class="value">${escHtml(simplified)}</span></div>
                         <span class="formula">d/dx [${expr}] = ${escHtml(simplified)}</span>`;
        addToHistory('Analiz', `d/dx [${expr}]`, simplified);
    } catch (err) {
        out.innerHTML = `<span class="error">Xəta: ${escHtml(err.message)}</span>`;
    }
}

/* ---------- Integral (Simpson's Rule) ---------- */
function calcIntegral() {
    const expr = document.getElementById('intFunc').value.trim();
    const a = parseFloat(document.getElementById('intA').value);
    const b = parseFloat(document.getElementById('intB').value);
    const out = document.getElementById('integralResult');

    if (!expr) { out.innerHTML = '<span class="error">Funksiya daxil edin.</span>'; return; }
    if (isNaN(a) || isNaN(b)) { out.innerHTML = '<span class="error">Hədləri daxil edin.</span>'; return; }

    try {
        let result;
        if (window.MathCore && typeof MathCore.definiteIntegral === 'function') {
            result = MathCore.definiteIntegral(expr, a, b, 1000);
        } else {
            throw new Error('İnteqral mühərriki tapılmadı');
        }

        out.innerHTML = `<div><span class="label">∫ f(x) dx = </span><span class="value">${formatNumber(result)}</span></div>
                         <span class="formula">∫[${a}, ${b}] (${expr}) dx ≈ ${formatNumber(result)}</span>
                         <div style="color:var(--text-muted);font-size:.82rem;margin-top:.4rem">Simpson qaydası ilə (n=1000)</div>`;
        addToHistory('Analiz', `∫[${a},${b}] ${expr} dx`, formatNumber(result));
    } catch (err) {
        out.innerHTML = `<span class="error">Xəta: ${escHtml(err.message)}</span>`;
    }
}

/* ---------- Graph ---------- */
function plotFunction() {
    const exprInput = document.getElementById('graphFunc');
    if (!exprInput) return;
    const expr = exprInput.value.trim();
    const xMinEl = document.getElementById('graphXMin');
    const xMaxEl = document.getElementById('graphXMax');
    const xMin = xMinEl ? (parseFloat(xMinEl.value) || -10) : -10;
    const xMax = xMaxEl ? (parseFloat(xMaxEl.value) || 10) : 10;
    const canvas = document.getElementById('graphCanvas');

    if (!canvas || !expr) return;

    const wrapper = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const w = (wrapper && wrapper.clientWidth > 50) ? wrapper.clientWidth : 400;
    const h = (wrapper && wrapper.clientHeight > 50) ? wrapper.clientHeight : Math.min(w * 0.65, 450);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const f = x => {
        try {
            if (window.MathCore && typeof MathCore.evaluate === 'function') {
                return MathCore.evaluate(expr, { x, angleMode: 'RAD' });
            }
            return NaN;
        } catch { return NaN; }
    };

    // Sample the function across pixels to find y range
    const samples = [];
    const step = (xMax - xMin) / w;
    for (let px = 0; px <= w; px++) {
        const x = xMin + px * step;
        const y = f(x);
        if (isFinite(y)) samples.push(y);
    }

    if (samples.length === 0) return;

    let yMin = Math.min(...samples);
    let yMax = Math.max(...samples);
    const yPad = (yMax - yMin) * 0.1 || 1;
    yMin -= yPad;
    yMax += yPad;

    const style = getComputedStyle(document.body);
    const bgColor = style.getPropertyValue('--bg-card').trim() || '#1a1a36';
    const gridColor = style.getPropertyValue('--graph-grid').trim() || '#2a2a4e';
    const axisColor = style.getPropertyValue('--graph-axis').trim() || '#64748b';
    const lineColor = style.getPropertyValue('--graph-line').trim() || '#6366f1';
    const textColor = style.getPropertyValue('--text-sec').trim() || '#94a3b8';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    const toCanvasX = x => ((x - xMin) / (xMax - xMin)) * w;
    const toCanvasY = y => h - ((y - yMin) / (yMax - yMin)) * h;

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    ctx.font = '11px sans-serif';
    ctx.fillStyle = textColor;

    const xStep = niceStep(xMax - xMin, 8);
    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const px = toCanvasX(x);
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
        ctx.fillText(formatAxis(x), px + 3, h - 5);
    }

    const yStep = niceStep(yMax - yMin, 6);
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const py = toCanvasY(y);
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
        ctx.fillText(formatAxis(y), 4, py - 4);
    }

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    if (yMin <= 0 && yMax >= 0) {
        const py = toCanvasY(0);
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }
    if (xMin <= 0 && xMax >= 0) {
        const px = toCanvasX(0);
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }

    // Curve
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;

    for (let px = 0; px <= w; px++) {
        const x = xMin + px * step;
        const y = f(x);
        const cy = toCanvasY(y);

        if (!isFinite(y) || cy < -h * 2 || cy > h * 3) {
            started = false;
            continue;
        }
        if (!started) {
            ctx.moveTo(px, cy);
            started = true;
        } else {
            ctx.lineTo(px, cy);
        }
    }
    ctx.stroke();

    addToHistory('Analiz', `y = ${expr}`, `[${xMin}, ${xMax}]`);
}

function niceStep(range, maxTicks) {
    const rough = range / maxTicks;
    const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
    const frac = rough / pow10;
    let nice;
    if (frac <= 1.5) nice = 1;
    else if (frac <= 3) nice = 2;
    else if (frac <= 7) nice = 5;
    else nice = 10;
    return nice * pow10;
}

function formatAxis(n) {
    if (Math.abs(n) < 1e-10) return '0';
    if (Math.abs(n) >= 1000 || (Math.abs(n) < 0.01 && n !== 0)) return n.toExponential(1);
    return parseFloat(n.toPrecision(4)).toString();
}

/* ==========================================================
   8. STATISTICS & PROBABILITY
   ========================================================== */
function calcStatistics() {
    const raw = document.getElementById('statData').value.trim();
    const out = document.getElementById('statsResult');
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;

    if (!raw) { out.innerHTML = '<span class="error">Ədədlər daxil edin.</span>'; return; }

    const data = raw.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n));
    if (data.length === 0) { out.innerHTML = '<span class="error">Düzgün ədədlər tapılmadı.</span>'; return; }

    const n = data.length;
    const sum = clean(data.reduce((a, b) => a + b, 0));
    const mean = clean(sum / n);

    // Median
    const sorted = [...data].sort((a, b) => a - b);
    const median = clean(n % 2 === 1 ? sorted[Math.floor(n/2)] : (sorted[n/2 - 1] + sorted[n/2]) / 2);

    // Mode
    const freq = {};
    data.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    const modeStr = maxFreq === 1 ? 'yoxdur (bütün ədədlər fərqlidir)' : modes.join(', ');

    // Variance & Std deviation
    const variance = clean(data.reduce((s, v) => s + (v - mean) ** 2, 0) / n);
    const stdDev = clean(Math.sqrt(variance));
    const range = clean(sorted[n-1] - sorted[0]);

    let html = `
        <div><span class="label">Ədəd sayı (n):</span> <span class="value">${n}</span></div>
        <div><span class="label">Cəmi:</span> <span class="value">${formatNumber(sum)}</span></div>
        <div><span class="label">Ədədi orta (x̄):</span> <span class="value">${formatNumber(mean)}</span></div>
        <span class="formula">x̄ = Σxᵢ / n = ${formatNumber(sum)} / ${n} = ${formatNumber(mean)}</span>
        <div><span class="label">Median:</span> <span class="value">${formatNumber(median)}</span></div>
        <div><span class="label">Moda:</span> <span class="value">${modeStr}</span></div>
        <div><span class="label">Yayılma (Range):</span> <span class="value">${formatNumber(range)}</span></div>
        <div><span class="label">Dispersiya (σ²):</span> <span class="value">${formatNumber(variance)}</span></div>
        <div><span class="label">Standart kənarlaşma (σ):</span> <span class="value">${formatNumber(stdDev)}</span></div>
        <span class="formula">σ = √(Σ(xᵢ − x̄)² / n) = ${formatNumber(stdDev)}</span>
    `;
    out.innerHTML = html;
    addToHistory('Statistika', `n=${n}`, `x̄=${formatNumber(mean)}, σ=${formatNumber(stdDev)}`);
}

/* ---------- Permutation & Combination ---------- */
function factorial(n) {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function calcPermutation() {
    const n = parseInt(document.getElementById('probN').value);
    const r = parseInt(document.getElementById('probR').value);
    const out = document.getElementById('probResult');
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : val => val;

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
        out.innerHTML = '<span class="error">n və r müsbət tam ədəd olmalıdır.</span>'; return;
    }
    if (r > n) {
        out.innerHTML = '<span class="error">r ≤ n olmalıdır.</span>'; return;
    }

    const result = clean(factorial(n) / factorial(n - r));
    out.innerHTML = `<div><span class="label">P(${n}, ${r}) = </span><span class="value">${formatNumber(result)}</span></div>
                     <span class="formula">P(n, r) = n! / (n−r)! = ${n}! / ${n-r}! = ${formatNumber(result)}</span>`;
    addToHistory('Statistika', `P(${n},${r})`, formatNumber(result));
}

function calcCombination() {
    const n = parseInt(document.getElementById('probN').value);
    const r = parseInt(document.getElementById('probR').value);
    const out = document.getElementById('probResult');
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : val => val;

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
        out.innerHTML = '<span class="error">n və r müsbət tam ədəd olmalıdır.</span>'; return;
    }
    if (r > n) {
        out.innerHTML = '<span class="error">r ≤ n olmalıdır.</span>'; return;
    }

    const result = clean(factorial(n) / (factorial(r) * factorial(n - r)));
    out.innerHTML = `<div><span class="label">C(${n}, ${r}) = </span><span class="value">${formatNumber(result)}</span></div>
                     <span class="formula">C(n, r) = n! / (r! · (n−r)!) = ${n}! / (${r}! · ${n-r}!) = ${formatNumber(result)}</span>`;
    addToHistory('Statistika', `C(${n},${r})`, formatNumber(result));
}

/* ==========================================================
   9. MATRICES
   ========================================================== */
function initMatrix() {
    buildMatrixInputs();
}

function buildMatrixInputs() {
    const size = parseInt(document.getElementById('matrixSize').value);
    buildGrid('matrixA', size);
    buildGrid('matrixB', size);
    onMatrixOpChange();
}

function buildGrid(containerId, size) {
    const container = document.getElementById(containerId);
    container.style.gridTemplateColumns = `repeat(${size}, 60px)`;
    container.innerHTML = '';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const inp = document.createElement('input');
            inp.type = 'number';
            inp.step = 'any';
            inp.id = `${containerId}_${i}_${j}`;
            inp.value = '0';
            container.appendChild(inp);
        }
    }
}

function onMatrixOpChange() {
    const op = document.getElementById('matrixOp').value;
    const bBlock = document.getElementById('matrixBBlock');
    bBlock.style.display = op === 'detA' ? 'none' : '';
}

function getMatrix(containerId, size) {
    const m = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(parseFloat(document.getElementById(`${containerId}_${i}_${j}`).value) || 0);
        }
        m.push(row);
    }
    return m;
}

function matToStr(m) {
    return m.map(row => '│ ' + row.map(v => formatNumber(v).padStart(8)).join('  ') + ' │').join('\n');
}

function calcMatrix() {
    const size = parseInt(document.getElementById('matrixSize').value);
    const op = document.getElementById('matrixOp').value;
    const A = getMatrix('matrixA', size);
    const out = document.getElementById('matrixResult');
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : val => val;

    let html = '';

    if (op === 'detA') {
        const d = clean(size === 2 ? det2(A) : det3(A));
        html = `<div><span class="label">|A| = </span><span class="value">${formatNumber(d)}</span></div>`;
        if (size === 2) {
            html += `<span class="formula">|A| = a₁₁·a₂₂ − a₁₂·a₂₁ = ${A[0][0]}·${A[1][1]} − ${A[0][1]}·${A[1][0]}</span>`;
        }
        addToHistory('Matris', `det ${size}×${size}`, formatNumber(d));
    } else {
        const B = getMatrix('matrixB', size);
        let result;

        if (op === 'add') {
            result = matAdd(A, B, size);
            html = `<div><span class="label">A + B =</span></div><pre style="color:var(--text);margin:.4rem 0">${matToStr(result)}</pre>`;
            addToHistory('Matris', `${size}×${size} toplama`, 'nəticə');
        } else if (op === 'subtract') {
            result = matSubtract(A, B, size);
            html = `<div><span class="label">A − B =</span></div><pre style="color:var(--text);margin:.4rem 0">${matToStr(result)}</pre>`;
            addToHistory('Matris', `${size}×${size} çıxma`, 'nəticə');
        } else if (op === 'multiply') {
            result = matMultiply(A, B, size);
            html = `<div><span class="label">A × B =</span></div><pre style="color:var(--text);margin:.4rem 0">${matToStr(result)}</pre>`;
            addToHistory('Matris', `${size}×${size} vurma`, 'nəticə');
        }
    }

    out.innerHTML = html;
}

function det2(m) {
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : val => val;
    return clean(m[0][0]*m[1][1] - m[0][1]*m[1][0]);
}

function matAdd(A, B, n) {
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : val => val;
    const R = [];
    for (let i = 0; i < n; i++) {
        R.push([]);
        for (let j = 0; j < n; j++) R[i].push(clean(A[i][j] + B[i][j]));
    }
    return R;
}

function matSubtract(A, B, n) {
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : val => val;
    const R = [];
    for (let i = 0; i < n; i++) {
        R.push([]);
        for (let j = 0; j < n; j++) R[i].push(clean(A[i][j] - B[i][j]));
    }
    return R;
}

function matMultiply(A, B, n) {
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : val => val;
    const R = [];
    for (let i = 0; i < n; i++) {
        R.push([]);
        for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < n; k++) sum += A[i][k] * B[k][j];
            R[i].push(clean(sum));
        }
    }
    return R;
}
