/* ============================================================
   ELMI KALKULYATOR — APP.JS
   Bütün riyazi hesablamalar lokal olaraq icra olunur.
   math.js kitabxanası yalnız ifadə analizi və törəmə üçün istifadə olunur.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSubTabs();
    initCalculator();
    initGeometry();
    initPercentage();
    initMatrix();
    loadHistory();
    initTheme();
});

/* ==========================================================
   1. THEME
   ========================================================== */
function initTheme() {
    const saved = localStorage.getItem('calcTheme');
    if (saved === 'light') {
        document.body.classList.replace('dark-theme', 'light-theme');
        document.getElementById('themeIcon').textContent = '🌙';
    }
    document.getElementById('themeToggle').addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        if (isLight) {
            document.body.classList.replace('light-theme', 'dark-theme');
            document.getElementById('themeIcon').textContent = '☀️';
            localStorage.setItem('calcTheme', 'dark');
        } else {
            document.body.classList.replace('dark-theme', 'light-theme');
            document.getElementById('themeIcon').textContent = '🌙';
            localStorage.setItem('calcTheme', 'light');
        }
    });
}

/* ==========================================================
   2. TABS
   ========================================================== */
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('sec-' + btn.dataset.tab).classList.add('active');
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
                parent.querySelector('#sub-' + btn.dataset.subtab).classList.add('active');
            });
        });
    });
}

/* ==========================================================
   3. HISTORY
   ========================================================== */
let historyData = [];

function loadHistory() {
    try {
        historyData = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    } catch { historyData = []; }
    renderHistory();
}

function addToHistory(type, expression, result) {
    historyData.unshift({ type, expression, result, time: new Date().toLocaleTimeString('az') });
    if (historyData.length > 100) historyData.pop();
    localStorage.setItem('calcHistory', JSON.stringify(historyData));
    renderHistory();
}

function clearHistory() {
    historyData = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (historyData.length === 0) {
        list.innerHTML = '<p class="history-empty">Hələ hesablama yoxdur</p>';
        return;
    }
    list.innerHTML = historyData.map((h, i) => `
        <div class="history-item" onclick="useHistoryItem(${i})" title="${h.expression}">
            <div class="h-type">${h.type} · ${h.time}</div>
            <div class="h-expr">${escHtml(h.expression)}</div>
            <div class="h-result">= ${escHtml(String(h.result))}</div>
        </div>
    `).join('');
}

function useHistoryItem(index) {
    const item = historyData[index];
    if (!item) return;
    if (item.type === 'Kalkulyator') {
        // Switch to calculator tab
        document.querySelector('[data-tab="calculator"]').click();
        calcState.expression = item.expression;
        calcState.result = String(item.result);
        document.getElementById('calcExpression').textContent = calcState.expression;
        document.getElementById('calcResult').textContent = calcState.result;
    }
}

function toggleHistory() {
    document.getElementById('historyPanel').classList.toggle('open');
}

function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
    btns.addEventListener('click', e => {
        const btn = e.target.closest('.btn');
        if (!btn) return;
        handleCalcButton(btn.dataset.action, btn.dataset.value);
    });

    document.getElementById('angleModeBtn').addEventListener('click', () => {
        calcState.angleMode = calcState.angleMode === 'DEG' ? 'RAD' : 'DEG';
        document.getElementById('angleModeBtn').textContent = calcState.angleMode;
    });

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
        case 'ln':  appendFunc('log('); break;   // math.js uses log for natural log
        case 'log': appendFunc('log10('); break;
        case 'sqrt': appendFunc('sqrt('); break;
        case 'square':
            calcState.expression += '^2';
            break;
        case 'pow':
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
        case 'percent':
            calcState.expression += '/100';
            break;
        case 'negate':
            if (calcState.expression) {
                if (calcState.expression.startsWith('-(')) {
                    calcState.expression = calcState.expression.slice(2, -1);
                } else {
                    calcState.expression = '-(' + calcState.expression + ')';
                }
            }
            break;
        case 'backspace':
            calcState.expression = calcState.expression.trimEnd();
            if (calcState.expression.endsWith(' ')) {
                // Remove operator + spaces
                calcState.expression = calcState.expression.slice(0, -3);
            } else {
                calcState.expression = calcState.expression.slice(0, -1);
            }
            break;
        case 'clear':
            calcState.expression = '';
            calcState.result = '0';
            calcState.justCalculated = false;
            break;
        case 'allClear':
            calcState.expression = '';
            calcState.result = '0';
            calcState.justCalculated = false;
            break;
        case 'equals':
            evaluateCalc();
            break;
    }

    exprEl.textContent = formatExprDisplay(calcState.expression) || '\u00A0';
    if (action !== 'equals') {
        // Live preview
        try {
            if (calcState.expression.trim()) {
                const preview = evalMathExpr(calcState.expression);
                if (preview !== null && isFinite(preview)) {
                    resEl.textContent = formatNumber(preview);
                }
            }
        } catch {}
    }
    resEl.textContent = calcState.result;
}

function appendFunc(fn) {
    if (calcState.justCalculated) { calcState.expression = ''; calcState.justCalculated = false; }
    calcState.expression += fn;
}

function evaluateCalc() {
    if (!calcState.expression.trim()) return;
    try {
        const result = evalMathExpr(calcState.expression);
        if (result === null || result === undefined) throw new Error('Hesablana bilmədi');
        const display = typeof result === 'object' ? math.format(result, { precision: 10 }) : formatNumber(result);
        addToHistory('Kalkulyator', calcState.expression, display);
        calcState.result = display;
        calcState.justCalculated = true;
    } catch (err) {
        calcState.result = 'Xəta';
    }
    document.getElementById('calcResult').textContent = calcState.result;
}

function evalMathExpr(expr) {
    if (typeof math === 'undefined') {
        // Fallback: basic eval (limited)
        let e = expr.replace(/π/g, Math.PI).replace(/pi/g, Math.PI);
        return Function('"use strict"; return (' + e + ')')();
    }
    // If DEG mode, wrap trig functions to convert
    let processedExpr = expr;
    if (calcState.angleMode === 'DEG') {
        // Replace trig functions so their argument is converted from degrees to radians
        processedExpr = processedExpr.replace(/\b(sin|cos|tan|cot)\s*\(/g, (match, fn) => {
            return `__${fn}DEG(`;
        });
    }

    const scope = {};
    // Define degree-mode trig functions
    if (calcState.angleMode === 'DEG') {
        scope.__sinDEG = (x) => Math.sin(x * Math.PI / 180);
        scope.__cosDEG = (x) => Math.cos(x * Math.PI / 180);
        scope.__tanDEG = (x) => Math.tan(x * Math.PI / 180);
        scope.__cotDEG = (x) => 1 / Math.tan(x * Math.PI / 180);
    }

    // Handle cot for RAD mode
    if (calcState.angleMode === 'RAD') {
        processedExpr = processedExpr.replace(/\bcot\s*\(/g, '__cotRAD(');
        scope.__cotRAD = (x) => 1 / Math.tan(x);
    }

    return math.evaluate(processedExpr, scope);
}

function formatNumber(n) {
    if (typeof n !== 'number') return String(n);
    if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
    // Up to 10 significant digits, remove trailing zeros
    let s = n.toPrecision(10);
    if (s.includes('.')) s = s.replace(/\.?0+$/, '');
    // If result is in scientific notation and large, keep it
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
            { id: 'right', label: 'Düzbucaqlı: 2 katet', inputs: [{id:'a', label:'Katet a'}, {id:'b', label:'Katet b'}] }
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
            <input type="number" id="geo_${inp.id}" step="any" min="0">
        </div>`
    ).join('');
}

function calculateGeometry() {
    if (!currentShape) return;
    const shape = shapes[currentShape];
    const mode = shape.modes.find(m => m.id === currentMode);
    const vals = {};
    let valid = true;

    mode.inputs.forEach(inp => {
        const el = document.getElementById('geo_' + inp.id);
        const v = parseFloat(el.value);
        if (isNaN(v) || v <= 0) valid = false;
        vals[inp.id] = v;
    });

    if (!valid) {
        showGeoResult('<span class="error">Zəhmət olmasa müsbət ədədlər daxil edin.</span>');
        return;
    }

    let results = [];
    const π = Math.PI;

    switch (currentShape) {
        case 'circle': {
            const r = vals.r;
            results.push({ label: 'Sahə', formula: 'S = π · r²', value: π * r * r });
            results.push({ label: 'Çevrə', formula: 'C = 2 · π · r', value: 2 * π * r });
            break;
        }
        case 'square': {
            const a = vals.a;
            results.push({ label: 'Sahə', formula: 'S = a²', value: a * a });
            results.push({ label: 'Perimetr', formula: 'P = 4 · a', value: 4 * a });
            results.push({ label: 'Diaqonal', formula: 'd = a · √2', value: a * Math.sqrt(2) });
            break;
        }
        case 'rectangle': {
            const a = vals.a, b = vals.b;
            results.push({ label: 'Sahə', formula: 'S = a · b', value: a * b });
            results.push({ label: 'Perimetr', formula: 'P = 2 · (a + b)', value: 2 * (a + b) });
            results.push({ label: 'Diaqonal', formula: 'd = √(a² + b²)', value: Math.sqrt(a*a + b*b) });
            break;
        }
        case 'triangle': {
            if (currentMode === 'bh') {
                const base = vals.base, h = vals.h;
                results.push({ label: 'Sahə', formula: 'S = (a · h) / 2', value: (base * h) / 2 });
            } else if (currentMode === 'heron') {
                const a = vals.a, b = vals.b, c = vals.c;
                if (a + b <= c || a + c <= b || b + c <= a) {
                    showGeoResult('<span class="error">Bu tərəflərlə üçbucaq qurmaq mümkün deyil.</span>');
                    return;
                }
                const s = (a + b + c) / 2;
                const area = Math.sqrt(s * (s-a) * (s-b) * (s-c));
                results.push({ label: 'Yarımperimetr', formula: 's = (a + b + c) / 2', value: s });
                results.push({ label: 'Sahə', formula: 'S = √(s·(s−a)·(s−b)·(s−c))', value: area });
                results.push({ label: 'Perimetr', formula: 'P = a + b + c', value: a + b + c });
            } else if (currentMode === 'right') {
                const a = vals.a, b = vals.b;
                const hyp = Math.sqrt(a*a + b*b);
                results.push({ label: 'Sahə', formula: 'S = (a · b) / 2', value: (a * b) / 2 });
                results.push({ label: 'Hipotenuz', formula: 'c = √(a² + b²)', value: hyp });
                results.push({ label: 'Perimetr', formula: 'P = a + b + c', value: a + b + hyp });
            }
            break;
        }
        case 'trapezoid': {
            const a = vals.a, b = vals.b, h = vals.h;
            results.push({ label: 'Sahə', formula: 'S = ((a + b) · h) / 2', value: ((a + b) * h) / 2 });
            break;
        }
        case 'cube': {
            const a = vals.a;
            results.push({ label: 'Həcm', formula: 'V = a³', value: a * a * a });
            results.push({ label: 'Tam səthi', formula: 'S = 6 · a²', value: 6 * a * a });
            results.push({ label: 'Üz diaqonalı', formula: 'd_üz = a · √2', value: a * Math.sqrt(2) });
            results.push({ label: 'Fəza diaqonalı', formula: 'd = a · √3', value: a * Math.sqrt(3) });
            break;
        }
        case 'cylinder': {
            const r = vals.r, h = vals.h;
            results.push({ label: 'Həcm', formula: 'V = π · r² · h', value: π * r * r * h });
            results.push({ label: 'Yan səthi', formula: 'S_yan = 2 · π · r · h', value: 2 * π * r * h });
            results.push({ label: 'Tam səthi', formula: 'S = 2 · π · r · (r + h)', value: 2 * π * r * (r + h) });
            break;
        }
        case 'sphere': {
            const r = vals.r;
            results.push({ label: 'Həcm', formula: 'V = (4/3) · π · r³', value: (4/3) * π * r * r * r });
            results.push({ label: 'Səthi', formula: 'S = 4 · π · r²', value: 4 * π * r * r });
            break;
        }
        case 'cone': {
            const r = vals.r, h = vals.h;
            const l = Math.sqrt(r*r + h*h);
            results.push({ label: 'Həcm', formula: 'V = (1/3) · π · r² · h', value: (1/3) * π * r * r * h });
            results.push({ label: 'Çəpər hündürlük', formula: 'l = √(r² + h²)', value: l });
            results.push({ label: 'Yan səthi', formula: 'S_yan = π · r · l', value: π * r * l });
            results.push({ label: 'Tam səthi', formula: 'S = π · r · (r + l)', value: π * r * (r + l) });
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
   6. ALGEBRA — Quadratic
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

    const D = b * b - 4 * a * c;
    let html = `<span class="formula">D = b² − 4ac = ${b}² − 4·${a}·${c} = ${formatNumber(D)}</span>`;

    if (D > 0) {
        const x1 = (-b + Math.sqrt(D)) / (2 * a);
        const x2 = (-b - Math.sqrt(D)) / (2 * a);
        html += `<div>D &gt; 0 → iki fərqli həqiqi kök var:</div>`;
        html += `<span class="formula">x₁ = (−b + √D) / 2a = ${formatNumber(x1)}</span>`;
        html += `<span class="formula">x₂ = (−b − √D) / 2a = ${formatNumber(x2)}</span>`;
        addToHistory('Cəbr', `${a}x²+${b}x+${c}=0`, `x₁=${formatNumber(x1)}, x₂=${formatNumber(x2)}`);
    } else if (D === 0) {
        const x = -b / (2 * a);
        html += `<div>D = 0 → bir kök (qoşa kök):</div>`;
        html += `<span class="formula">x = −b / 2a = ${formatNumber(x)}</span>`;
        addToHistory('Cəbr', `${a}x²+${b}x+${c}=0`, `x=${formatNumber(x)}`);
    } else {
        const real = -b / (2 * a);
        const imag = Math.sqrt(-D) / (2 * a);
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

    const D = a1*b2 - a2*b1;
    const Dx = c1*b2 - c2*b1;
    const Dy = a1*c2 - a2*c1;

    let html = `<span class="formula">D = a₁·b₂ − a₂·b₁ = ${formatNumber(D)}</span>`;

    if (D === 0) {
        html += `<div class="error">D = 0: Sistemin yeganə həlli yoxdur (ya sonsuz həll, ya da həllsiz).</div>`;
    } else {
        const x = Dx / D;
        const y = Dy / D;
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
    return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
         - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
         + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
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

    const D = det3(a);
    let html = `<span class="formula">D = ${formatNumber(D)}</span>`;

    if (D === 0) {
        html += `<div class="error">D = 0: Sistemin yeganə həlli yoxdur.</div>`;
    } else {
        const Dx = det3([[d[0],a[0][1],a[0][2]],[d[1],a[1][1],a[1][2]],[d[2],a[2][1],a[2][2]]]);
        const Dy = det3([[a[0][0],d[0],a[0][2]],[a[1][0],d[1],a[1][2]],[a[2][0],d[2],a[2][2]]]);
        const Dz = det3([[a[0][0],a[0][1],d[0]],[a[1][0],a[1][1],d[1]],[a[2][0],a[2][1],d[2]]]);
        const x = Dx/D, y = Dy/D, z = Dz/D;
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

    let result, formula, label;

    switch(type) {
        case 'findPercent': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = '<span class="error">Qiymətləri daxil edin.</span>'; return; }
            result = val * pct / 100;
            formula = `${val} × ${pct}% = ${val} × ${pct}/100`;
            label = `${val}-in ${pct}%-i`;
            break;
        }
        case 'whatPercent': {
            const part = g('pctPart'), whole = g('pctWhole');
            if (isNaN(part) || isNaN(whole) || whole === 0) { out.innerHTML = '<span class="error">Qiymətləri daxil edin (tam ≠ 0).</span>'; return; }
            result = (part / whole) * 100;
            formula = `(${part} / ${whole}) × 100`;
            label = `Faiz nisbəti`;
            break;
        }
        case 'findWhole': {
            const part = g('pctPart'), pct = g('pctPct');
            if (isNaN(part) || isNaN(pct) || pct === 0) { out.innerHTML = '<span class="error">Qiymətləri daxil edin (faiz ≠ 0).</span>'; return; }
            result = part * 100 / pct;
            formula = `${part} × 100 / ${pct}`;
            label = `Tam ədəd`;
            break;
        }
        case 'increase': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = '<span class="error">Qiymətləri daxil edin.</span>'; return; }
            result = val * (1 + pct / 100);
            formula = `${val} × (1 + ${pct}/100)`;
            label = `${pct}% artımla`;
            break;
        }
        case 'decrease': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = '<span class="error">Qiymətləri daxil edin.</span>'; return; }
            result = val * (1 - pct / 100);
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

    if (isNaN(a1) || isNaN(d) || isNaN(n) || n < 1) {
        out.innerHTML = '<span class="error">Zəhmət olmasa düzgün qiymətlər daxil edin (n ≥ 1).</span>';
        return;
    }

    let html = '';
    if (type === 'arithmetic') {
        const an = a1 + (n - 1) * d;
        const Sn = n * (a1 + an) / 2;
        html += `<span class="formula">aₙ = a₁ + (n−1)·d = ${a1} + ${n-1}·${d} = ${formatNumber(an)}</span>`;
        html += `<span class="formula">Sₙ = n·(a₁ + aₙ)/2 = ${n}·(${a1} + ${formatNumber(an)})/2 = ${formatNumber(Sn)}</span>`;
        html += `<div><span class="label">aₙ = </span><span class="value">${formatNumber(an)}</span></div>`;
        html += `<div><span class="label">Sₙ = </span><span class="value">${formatNumber(Sn)}</span></div>`;

        // Show first few terms
        const terms = [];
        for (let i = 0; i < Math.min(n, 8); i++) terms.push(formatNumber(a1 + i * d));
        if (n > 8) terms.push('...');
        html += `<div style="margin-top:.5rem;color:var(--text-sec)">Silsilə: ${terms.join(', ')}</div>`;
        addToHistory('Cəbr', `Ədədi: a₁=${a1}, d=${d}, n=${n}`, `aₙ=${formatNumber(an)}, Sₙ=${formatNumber(Sn)}`);
    } else {
        if (d === 0) { out.innerHTML = '<span class="error">q ≠ 0 olmalıdır.</span>'; return; }
        const an = a1 * Math.pow(d, n - 1);
        const Sn = d === 1 ? a1 * n : a1 * (Math.pow(d, n) - 1) / (d - 1);
        html += `<span class="formula">aₙ = a₁ · qⁿ⁻¹ = ${a1} · ${d}^${n-1} = ${formatNumber(an)}</span>`;
        html += `<span class="formula">Sₙ = a₁·(qⁿ − 1)/(q − 1) = ${formatNumber(Sn)}</span>`;
        html += `<div><span class="label">aₙ = </span><span class="value">${formatNumber(an)}</span></div>`;
        html += `<div><span class="label">Sₙ = </span><span class="value">${formatNumber(Sn)}</span></div>`;

        const terms = [];
        for (let i = 0; i < Math.min(n, 8); i++) terms.push(formatNumber(a1 * Math.pow(d, i)));
        if (n > 8) terms.push('...');
        html += `<div style="margin-top:.5rem;color:var(--text-sec)">Silsilə: ${terms.join(', ')}</div>`;
        addToHistory('Cəbr', `Həndəsi: a₁=${a1}, q=${d}, n=${n}`, `aₙ=${formatNumber(an)}, Sₙ=${formatNumber(Sn)}`);
    }
    out.innerHTML = html;
}


/* ==========================================================
   7. ANALYSIS — Derivative
   ========================================================== */
function calcDerivative() {
    const expr = document.getElementById('derivFunc').value.trim();
    const out = document.getElementById('derivativeResult');

    if (!expr) { out.innerHTML = '<span class="error">Funksiya daxil edin.</span>'; return; }

    if (typeof math === 'undefined') {
        out.innerHTML = '<span class="error">math.js kitabxanası yüklənməyib. İnternet bağlantınızı yoxlayın.</span>';
        return;
    }

    try {
        const derivative = math.derivative(expr, 'x');
        const simplified = derivative.toString();
        out.innerHTML = `<div><span class="label">f(x) = </span>${escHtml(expr)}</div>
                         <div><span class="label">f′(x) = </span><span class="value">${escHtml(simplified)}</span></div>
                         <span class="formula">d/dx [${expr}] = ${simplified}</span>`;
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
        const n = 1000; // number of intervals (must be even)
        const h = (b - a) / n;

        const f = x => {
            if (typeof math !== 'undefined') {
                return math.evaluate(expr, { x });
            }
            return Function('x', '"use strict"; return (' + expr.replace(/\^/g, '**') + ')')(x);
        };

        // Simpson's 1/3 rule
        let sum = f(a) + f(b);
        for (let i = 1; i < n; i++) {
            const xi = a + i * h;
            sum += (i % 2 === 0 ? 2 : 4) * f(xi);
        }
        const result = (h / 3) * sum;

        out.innerHTML = `<div><span class="label">∫ f(x) dx = </span><span class="value">${formatNumber(result)}</span></div>
                         <span class="formula">∫[${a}, ${b}] (${expr}) dx ≈ ${formatNumber(result)}</span>
                         <div style="color:var(--text-muted);font-size:.82rem;margin-top:.4rem">Simpson qaydası ilə (n=${n})</div>`;
        addToHistory('Analiz', `∫[${a},${b}] ${expr} dx`, formatNumber(result));
    } catch (err) {
        out.innerHTML = `<span class="error">Xəta: ${escHtml(err.message)}</span>`;
    }
}

/* ---------- Graph ---------- */
function plotFunction() {
    const expr = document.getElementById('graphFunc').value.trim();
    const xMin = parseFloat(document.getElementById('graphXMin').value) || -10;
    const xMax = parseFloat(document.getElementById('graphXMax').value) || 10;
    const canvas = document.getElementById('graphCanvas');

    if (!expr) return;

    // Set canvas resolution
    const wrapper = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const w = wrapper.clientWidth;
    const h = Math.min(w * 0.65, 500);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const f = x => {
        try {
            if (typeof math !== 'undefined') return math.evaluate(expr, { x });
            return Function('x', '"use strict"; return (' + expr.replace(/\^/g, '**') + ')')(x);
        } catch { return NaN; }
    };

    // Sample the function to find y range
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
    // Add some padding
    const yPad = (yMax - yMin) * 0.1 || 1;
    yMin -= yPad;
    yMax += yPad;

    // Get theme colors from CSS variables
    const style = getComputedStyle(document.body);
    const bgColor = style.getPropertyValue('--bg-card').trim() || '#1a1a36';
    const gridColor = style.getPropertyValue('--graph-grid').trim() || '#2a2a4e';
    const axisColor = style.getPropertyValue('--graph-axis').trim() || '#64748b';
    const lineColor = style.getPropertyValue('--graph-line').trim() || '#6366f1';
    const textColor = style.getPropertyValue('--text-sec').trim() || '#94a3b8';

    // Clear
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Helper: data coords to canvas
    const toCanvasX = x => ((x - xMin) / (xMax - xMin)) * w;
    const toCanvasY = y => h - ((y - yMin) / (yMax - yMin)) * h;

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    ctx.font = '11px sans-serif';
    ctx.fillStyle = textColor;

    // X grid
    const xStep = niceStep(xMax - xMin, 8);
    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const px = toCanvasX(x);
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
        ctx.fillText(formatAxis(x), px + 3, h - 5);
    }

    // Y grid
    const yStep = niceStep(yMax - yMin, 6);
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const py = toCanvasY(y);
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
        ctx.fillText(formatAxis(y), 4, py - 4);
    }

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    // X axis (y=0)
    if (yMin <= 0 && yMax >= 0) {
        const py = toCanvasY(0);
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }
    // Y axis (x=0)
    if (xMin <= 0 && xMax >= 0) {
        const px = toCanvasX(0);
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }

    // Plot function
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
   8. STATISTICS
   ========================================================== */
function calcStatistics() {
    const raw = document.getElementById('statData').value.trim();
    const out = document.getElementById('statsResult');

    if (!raw) { out.innerHTML = '<span class="error">Ədədlər daxil edin.</span>'; return; }

    const data = raw.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n));
    if (data.length === 0) { out.innerHTML = '<span class="error">Düzgün ədədlər tapılmadı.</span>'; return; }

    const n = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    const sorted = [...data].sort((a, b) => a - b);
    const median = n % 2 === 1 ? sorted[Math.floor(n/2)] : (sorted[n/2 - 1] + sorted[n/2]) / 2;

    // Mode
    const freq = {};
    data.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    const modeStr = maxFreq === 1 ? 'yoxdur (bütün ədədlər fərqlidir)' : modes.join(', ');

    // Std deviation (population)
    const variance = data.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);

    // Range
    const range = sorted[n-1] - sorted[0];

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

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
        out.innerHTML = '<span class="error">n və r müsbət tam ədəd olmalıdır.</span>'; return;
    }
    if (r > n) {
        out.innerHTML = '<span class="error">r ≤ n olmalıdır.</span>'; return;
    }

    const result = factorial(n) / factorial(n - r);
    out.innerHTML = `<div><span class="label">P(${n}, ${r}) = </span><span class="value">${formatNumber(result)}</span></div>
                     <span class="formula">P(n, r) = n! / (n−r)! = ${n}! / ${n-r}! = ${formatNumber(result)}</span>`;
    addToHistory('Statistika', `P(${n},${r})`, formatNumber(result));
}

function calcCombination() {
    const n = parseInt(document.getElementById('probN').value);
    const r = parseInt(document.getElementById('probR').value);
    const out = document.getElementById('probResult');

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
        out.innerHTML = '<span class="error">n və r müsbət tam ədəd olmalıdır.</span>'; return;
    }
    if (r > n) {
        out.innerHTML = '<span class="error">r ≤ n olmalıdır.</span>'; return;
    }

    const result = factorial(n) / (factorial(r) * factorial(n - r));
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

    let html = '';

    if (op === 'detA') {
        const d = size === 2 ? det2(A) : det3(A);
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

function det2(m) { return m[0][0]*m[1][1] - m[0][1]*m[1][0]; }

function matAdd(A, B, n) {
    const R = [];
    for (let i = 0; i < n; i++) {
        R.push([]);
        for (let j = 0; j < n; j++) R[i].push(A[i][j] + B[i][j]);
    }
    return R;
}

function matSubtract(A, B, n) {
    const R = [];
    for (let i = 0; i < n; i++) {
        R.push([]);
        for (let j = 0; j < n; j++) R[i].push(A[i][j] - B[i][j]);
    }
    return R;
}

function matMultiply(A, B, n) {
    const R = [];
    for (let i = 0; i < n; i++) {
        R.push([]);
        for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < n; k++) sum += A[i][k] * B[k][j];
            R[i].push(sum);
        }
    }
    return R;
}
