/**
 * Comprehensive v3.0.0 Verification Suite for Math-Engine-AZ
 * Tests:
 * 1. MathCore mixed fraction evaluation & precedence
 * 2. VisualMathEditor slot AST, navigation, serialization & atomic deletion
 * 3. StepSolver expandable sub-steps and alternative forms
 * 4. VisualCharts 2D geometry SVG & statistics bar chart
 * 5. I18n 100% bilingual coverage (AZ & EN)
 * 6. HTML & Service Worker v3.0.0 cache consistency
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = __dirname;
console.log('=== Math-Engine-AZ v3.0.0 Verification Suite ===\n');

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
    totalTests++;
    try {
        fn();
        console.log(`  ✓ ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`  ✗ ${name}`);
        console.error(`    ${err.message}`);
    }
}

// -------------------------------------------------------------
// 1. MathCore Mixed Fractions & Calculation Precedence
// -------------------------------------------------------------
console.log('[1] MathCore Evaluation & Mixed Fraction Tests');
const MathCore = require(path.join(ROOT, 'js/math-core.js'));

it('Evaluates mixed fraction in parentheses: 5 * (5 + 1/2) === 27.5', () => {
    const res = MathCore.evaluate('5 * (5 + 1/2)');
    assert.strictEqual(res, 27.5);
});

it('Evaluates raw space-separated mixed fraction: 5 * 5 1/2 === 27.5', () => {
    const res = MathCore.evaluate('5 * 5 1/2');
    assert.strictEqual(res, 27.5);
});

it('Evaluates complex precedence: 5 * 5 1/2 / 2 === 13.75', () => {
    const res = MathCore.evaluate('5 * 5 1/2 / 2');
    assert.strictEqual(res, 13.75);
});

it('Evaluates mixed fraction subtraction: 10 - 2 1/4 === 7.75', () => {
    const res = MathCore.evaluate('10 - 2 1/4');
    assert.strictEqual(res, 7.75);
});

it('Evaluates serialized VisualMathEditor mixed fraction syntax: ((5) + ((1)/(2))) === 5.5', () => {
    const res = MathCore.evaluate('((5) + ((1)/(2)))');
    assert.strictEqual(res, 5.5);
});

it('Evaluates serialized expression: 5 * ((5) + ((1)/(2))) === 27.5', () => {
    const res = MathCore.evaluate('5 * ((5) + ((1)/(2)))');
    assert.strictEqual(res, 27.5);
});

// -------------------------------------------------------------
// 2. VisualMathEditor Slot-based AST, Navigation & Atomic Deletion
// -------------------------------------------------------------
console.log('\n[2] VisualMathEditor Slot AST & Atomic Deletion Tests');
const VisualMathEditor = require(path.join(ROOT, 'js/math-editor.js'));

it('Creates independent editor instance and starts empty', () => {
    const ed = VisualMathEditor.create();
    assert.strictEqual(ed.isEmpty(), true);
    assert.strictEqual(ed.serialize(), '');
});

it('Inserts stacked fraction and serializes cleanly', () => {
    const ed = VisualMathEditor.create();
    ed.insertToken('3 + ');
    const frac = ed.insertFraction();
    ed.insertToken('1');
    ed.navigateRight(); // move to denominator
    ed.insertToken('2');
    assert.strictEqual(ed.serialize(), '3 + ((1) / (2))');
    assert.strictEqual(MathCore.evaluate(ed.serialize()), 3.5);
});

it('Inserts mixed fraction and serializes cleanly', () => {
    const ed = VisualMathEditor.create();
    const mixed = ed.insertMixedFraction();
    ed.insertToken('5'); // whole number
    ed.navigateRight(); // move to numerator
    ed.insertToken('1');
    ed.navigateRight(); // move to denominator
    ed.insertToken('2');
    assert.strictEqual(ed.serialize(), '((5) + ((1) / (2)))');
    assert.strictEqual(MathCore.evaluate(`5 * ${ed.serialize()}`), 27.5);
});

it('Performs bidirectional slot navigation (← / →)', () => {
    const ed = VisualMathEditor.create();
    const mixed = ed.insertMixedFraction();
    const wholeId = mixed.whole.id;
    const numId = mixed.num.id;
    const denId = mixed.den.id;

    assert.strictEqual(ed.getActiveSlotId(), wholeId);
    ed.navigateRight();
    assert.strictEqual(ed.getActiveSlotId(), numId);
    ed.navigateRight();
    assert.strictEqual(ed.getActiveSlotId(), denId);
    ed.navigateLeft();
    assert.strictEqual(ed.getActiveSlotId(), numId);
    ed.navigateLeft();
    assert.strictEqual(ed.getActiveSlotId(), wholeId);
});

it('Atomically deletes multi-letter function prefixes in 1 press: sin(', () => {
    const ed = VisualMathEditor.create();
    ed.insertToken('5 + sin(');
    assert.strictEqual(ed.serialize(), '5 + sin(');
    const deleted = ed.deleteAtomic();
    assert.strictEqual(deleted, true);
    assert.strictEqual(ed.serialize(), '5 +'); // 'sin(' completely gone, no 'si' or 's'
});

it('Atomically deletes multi-letter function prefixes: sqrt(', () => {
    const ed = VisualMathEditor.create();
    ed.insertToken('sqrt(');
    ed.deleteAtomic();
    assert.strictEqual(ed.serialize(), ''); // 'sqrt(' completely gone
});

it('Atomically deletes asin( without confusing with sin(', () => {
    const ed = VisualMathEditor.create();
    ed.insertToken('asin(');
    ed.deleteAtomic();
    assert.strictEqual(ed.serialize(), ''); // 'asin(' completely gone, no 'a'
});

it('Atomically deletes log10( in one press', () => {
    const ed = VisualMathEditor.create();
    ed.insertToken('log10(');
    ed.deleteAtomic();
    assert.strictEqual(ed.serialize(), '');
});

it('Cleanly unwraps/removes empty fraction slot on DEL without orphaned syntax', () => {
    const ed = VisualMathEditor.create();
    ed.insertToken('7 * ');
    ed.insertFraction(); // empty fraction created, cursor in num
    assert.strictEqual(ed.isEmpty(), false);
    ed.deleteAtomic(); // pressed in empty num slot -> removes fraction
    assert.strictEqual(ed.serialize(), '7 *');
});

it('Toggles sign (±) between X and (-X)', () => {
    const ed = VisualMathEditor.create();
    ed.insertToken('5');
    ed.toggleSign();
    assert.strictEqual(ed.serialize(), '(-5)');
    ed.toggleSign();
    assert.strictEqual(ed.serialize(), '5');
});

it('Parses mixed number string into mixed fraction AST via insertParsed', () => {
    const ed = VisualMathEditor.create();
    ed.insertParsed('5 1/2');
    assert.strictEqual(ed.serialize(), '((5) + ((1) / (2)))');
    assert.strictEqual(MathCore.evaluate(ed.serialize()), 5.5);
});

// -------------------------------------------------------------
// 3. StepSolver Expandable Sub-steps & Alternative Forms
// -------------------------------------------------------------
console.log('\n[3] StepSolver Expandable Sub-steps & Alternative Forms Tests');
const StepSolver = require(path.join(ROOT, 'js/step-solver.js'));

it('Generates structured solution for mixed fraction multiplication: 5 * 5 1/2', () => {
    const sol = StepSolver.solve('5 * 5 1/2', 'DEG');
    assert.strictEqual(sol.empty, false);
    assert.strictEqual(Array.isArray(sol.steps), true);
    assert.ok(sol.steps.length >= 2, 'Should have at least 2 primary step cards');
    
    // Check for expandable sub-steps
    const stepWithSub = sol.steps.find(s => Array.isArray(s.substeps) && s.substeps.length > 0);
    assert.ok(stepWithSub, 'Should include detailed intermediate sub-steps');
    assert.ok(stepWithSub.substeps[0].formula, 'Sub-step should have a formula breakdown');
});

it('Generates alternative forms (stacked fraction, mixed number, decimal)', () => {
    const sol = StepSolver.solve('5 * 5 1/2', 'DEG');
    assert.ok(sol.altForms, 'Should provide alternative representations');
    assert.strictEqual(sol.altForms.decimal, '27.5');
    assert.strictEqual(sol.altForms.improper, '55/2');
    assert.strictEqual(sol.altForms.mixed, '27 1/2');
    assert.ok(sol.altForms.improperHtml.includes('calc-frac'), 'Alternative fraction should use stacked HTML');
});

it('Generates steps in English when language is set to EN', () => {
    const I18n = require(path.join(ROOT, 'js/i18n.js'));
    I18n.setLanguage('en');
    const sol = StepSolver.solve('5 * 5 1/2', 'DEG');
    assert.ok(sol.steps[0].title.length > 0);
    // Reset back to az
    I18n.setLanguage('az');
});

// -------------------------------------------------------------
// 4. VisualCharts 2D Geometry & Statistics Distribution
// -------------------------------------------------------------
console.log('\n[4] VisualCharts 2D Geometry & Statistics Tests');
const VisualCharts = require(path.join(ROOT, 'js/visual-charts.js'));

it('Renders 2D SVG diagram for circle with radius', () => {
    const svg = VisualCharts.renderGeometry('circle', 'r', { r: 5 });
    assert.ok(svg.includes('<svg'), 'Should produce SVG element');
    assert.ok(svg.includes('r = 5'), 'Should label radius');
});

it('Renders 2D SVG diagram for right triangle with legs and hypotenuse', () => {
    const svg = VisualCharts.renderGeometry('triangle', 'right', { a: 3, b: 4 });
    assert.ok(svg.includes('<svg'), 'Should produce SVG');
    assert.ok(svg.includes('a = 3'), 'Should label leg a');
    assert.ok(svg.includes('b = 4'), 'Should label leg b');
    assert.ok(svg.includes('c = 5'), 'Should calculate and label hypotenuse c=5');
});

it('Renders 2D SVG diagram for rectangle with dimensions', () => {
    const svg = VisualCharts.renderGeometry('rectangle', 'ab', { a: 6, b: 4 });
    assert.ok(svg.includes('<svg'), 'Should produce SVG');
    assert.ok(svg.includes('a = 6'), 'Should label side a');
    assert.ok(svg.includes('b = 4'), 'Should label side b');
});

it('Renders interactive Statistics bar chart with mean indicator (x̄)', () => {
    const data = [10, 20, 30, 40, 50];
    const stats = { n: 5, mean: 30, median: 30, stdDev: 14.14 };
    const chart = VisualCharts.renderStatistics(data, stats);
    assert.ok(chart.includes('<svg'), 'Should produce SVG chart');
    assert.ok(chart.includes('x̄ = 30'), 'Should render mean indicator line');
    assert.ok(chart.includes('n = 5'), 'Should render sample size');
});

// -------------------------------------------------------------
// 5. I18n 100% Bilingual Coverage (AZ & EN)
// -------------------------------------------------------------
console.log('\n[5] I18n Bilingual Completeness Tests');
const I18n = require(path.join(ROOT, 'js/i18n.js'));

it('Contains all required v3.0.0 translation keys in both AZ and EN', () => {
    const azKeys = Object.keys(I18n.translations.az);
    const enKeys = Object.keys(I18n.translations.en);

    const requiredKeys = [
        'historyEmpty', 'substepsShow', 'substepsHide',
        'geoDiagramTitle', 'geoDiagramSubtitle',
        'statsChartTitle', 'statsChartSubtitle',
        'sysInfoTitle', 'sysInfoSubtitle',
        'appVersion', 'pwaCacheStatus', 'shortcutsTitle',
        'resetDefaultsBtn', 'resetSuccess',
        'navLeft', 'navRight', 'btnFrac', 'btnMixedFrac',
        'solverTitle', 'solverSubtitle'
    ];

    requiredKeys.forEach(key => {
        assert.ok(azKeys.includes(key), `AZ translation missing key: ${key}`);
        assert.ok(enKeys.includes(key), `EN translation missing key: ${key}`);
    });
});

it('Translates historyEmpty correctly in AZ and EN', () => {
    I18n.setLanguage('az');
    assert.strictEqual(I18n.t('historyEmpty'), 'Hələ hesablama yoxdur');
    I18n.setLanguage('en');
    assert.strictEqual(I18n.t('historyEmpty'), 'No calculations yet');
    I18n.setLanguage('az'); // restore
});

// -------------------------------------------------------------
// 6. index.html & sw.js v3.4.0 Verification
// -------------------------------------------------------------
console.log('\n[6] HTML & Service Worker Verification Tests');

it('index.html references all scripts with v3.4.0 query string', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(html.includes('style.css?v=3.4.0'), 'style.css should have v=3.4.0');
    assert.ok(html.includes('js/math-core.js?v=3.4.0'), 'math-core.js should have v=3.4.0');
    assert.ok(html.includes('js/math-editor.js?v=3.4.0'), 'math-editor.js should have v=3.4.0');
    assert.ok(html.includes('js/visual-charts.js?v=3.4.0'), 'visual-charts.js should have v=3.4.0');
    assert.ok(html.includes('js/i18n.js?v=3.4.0'), 'i18n.js should have v=3.4.0');
    assert.ok(html.includes('js/step-solver.js?v=3.4.0'), 'step-solver.js should have v=3.4.0');
    assert.ok(html.includes('app.js?v=3.4.0'), 'app.js should have v=3.4.0');
});

it('index.html has removed "F(X) • ENGINE" header badge', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(!html.includes('F(X) • ENGINE'), '"F(X) • ENGINE" badge should be removed');
});

it('index.html has removed non-interactive "#visual-badge" button', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(!html.includes('id="visual-badge"'), '#visual-badge should be removed');
});

it('index.html includes slot navigation buttons (#slotNavLeft, #slotNavRight)', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(html.includes('id="slotNavLeft"'), '#slotNavLeft should exist');
    assert.ok(html.includes('id="slotNavRight"'), '#slotNavRight should exist');
});

it('index.html isolates Parametrlər with sidebar separator', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(html.includes('sidebar-nav-divider'), 'sidebar-nav-divider should exist before settings');
});

it('sw.js cache name is updated to math-engine-az-v3.4.0', () => {
    const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    assert.ok(sw.includes("const CACHE_NAME = 'math-engine-az-v3.4.0'"), 'CACHE_NAME should be math-engine-az-v3.4.0');
    assert.ok(sw.includes('./js/math-editor.js?v=3.4.0'), 'sw.js should precache math-editor.js?v=3.4.0');
    assert.ok(sw.includes('./js/visual-charts.js?v=3.4.0'), 'sw.js should precache visual-charts.js?v=3.4.0');
});

// -------------------------------------------------------------
// 7. v3.0.1 100% Bilingual Completeness & Clean Step Formatting
// -------------------------------------------------------------
console.log('\n[7] v3.0.1 Localization & Clean Formatting Verification Tests');

it('I18n AZ and EN dictionaries have 100% key parity', () => {
    const azKeys = Object.keys(I18n.TRANSLATIONS.az).sort();
    const enKeys = Object.keys(I18n.TRANSLATIONS.en).sort();
    assert.deepStrictEqual(azKeys, enKeys, 'AZ and EN must have exact same keys');
});

it('Every data-i18n* attribute in index.html exists in both AZ and EN', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const regex = /data-i18n(?:-(?:title|placeholder|label))?="([^"]+)"/g;
    let match;
    const missing = [];
    while ((match = regex.exec(html)) !== null) {
        const key = match[1];
        if (!I18n.TRANSLATIONS.az[key]) missing.push(`az:${key}`);
        if (!I18n.TRANSLATIONS.en[key]) missing.push(`en:${key}`);
    }
    assert.strictEqual(missing.length, 0, `Missing translation keys: ${missing.join(', ')}`);
});

it('Shortcuts list in index.html has no mixed AZ/EN strings', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(!html.includes('Rəqəmlər / Digits'), 'Mixed shortcut string should be removed');
    assert.ok(!html.includes('Atomik silmə / Atomic DEL'), 'Mixed shortcut string should be removed');
});

it('VisualCharts Geometry captions render purely in active language (en vs az)', () => {
    const sphereEn = VisualCharts.renderGeometry('sphere', 'r', { r: 3 }, 'en');
    assert.ok(sphereEn.includes('Sphere: V = (4/3)πr³'), 'EN sphere caption expected');
    assert.ok(!sphereEn.includes('Kürə'), 'AZ text should not appear in EN diagram');

    const sphereAz = VisualCharts.renderGeometry('sphere', 'r', { r: 3 }, 'az');
    assert.ok(sphereAz.includes('Kürə: V = (4/3)πr³'), 'AZ sphere caption expected');
    assert.ok(!sphereAz.includes('Sphere'), 'EN text should not appear in AZ diagram');

    const triEn = VisualCharts.renderGeometry('triangle', 'right', { a: 3, b: 4 }, 'en');
    assert.ok(triEn.includes('Leg a = 3') && triEn.includes('Hypotenuse c = 5') && triEn.includes('Right Triangle'));
    assert.ok(!triEn.includes('Katet') && !triEn.includes('Hipotenuz') && !triEn.includes('Düzbucaqlı'));
});

it('StepSolver produces clean Unicode/HTML without raw LaTeX commands across all patterns', () => {
    const exprs = ['5 + 3', '1/2 + 1/3', '5/7 * 2', '100 + 20%', '(-3)^2', 'sin(30)', '5 * 5 1/2'];
    const rawLatexRegex = /\\text|\\quad|\\frac|\\times|\\rightarrow|\\%|\\circ/;
    for (const lang of ['az', 'en']) {
        I18n.setLanguage(lang);
        for (const ex of exprs) {
            const sol = StepSolver.solve(ex, 'DEG');
            const serialized = JSON.stringify(sol);
            assert.ok(!rawLatexRegex.test(serialized), `Raw LaTeX leaked for "${ex}" (${lang}): ${serialized}`);
        }
    }
    I18n.setLanguage('az');
});

it('StepSolver PEMDAS substep uses clean Unicode arrows', () => {
    I18n.setLanguage('en');
    const sol = StepSolver.solve('5 + 3', 'DEG');
    assert.strictEqual(sol.steps[0].substeps[0].formula, 'PEMDAS: P → E → MD → AS');
    I18n.setLanguage('az');
});

// -------------------------------------------------------------
// 8. v3.1.0 Number Theory, Combinatorics & Multi-Factor Step Solver
// -------------------------------------------------------------
console.log('\n[8] v3.1.0 Number Theory, Combinatorics & Multi-Factor Step Solver');

it('MathCore computes GCD(24, 36, 60) === 12 and LCM(24, 36, 60) === 360', () => {
    assert.strictEqual(MathCore.gcdMulti([24, 36, 60]), 12);
    assert.strictEqual(MathCore.lcmMulti([24, 36, 60]), 360);
});

it('MathCore computes prime factorization of 24 and 60', () => {
    assert.deepStrictEqual(MathCore.primeFactorize(24), [
        { prime: 2, power: 3 },
        { prime: 3, power: 1 }
    ]);
    assert.deepStrictEqual(MathCore.primeFactorize(60), [
        { prime: 2, power: 2 },
        { prime: 3, power: 1 },
        { prime: 5, power: 1 }
    ]);
});

it('MathCore computes C(5, 2) === 10, A(5, 2) === 20, P(5) === 120', () => {
    assert.strictEqual(MathCore.combination(5, 2), 10);
    assert.strictEqual(MathCore.arrangement(5, 2), 20);
    assert.strictEqual(MathCore.permutation(5), 120);
});

it('StepSolver preserves all factors in compound expressions (√5 × 3 2/3 & 2 * (1/3) + 4)', () => {
    I18n.setLanguage('en');
    const sol1 = StepSolver.solve('√5 × 3 2/3', 'DEG');
    assert.ok(sol1.steps.length >= 2, 'Should produce multiple steps');
    const step2Formula = sol1.steps[1].formula;
    assert.ok(step2Formula.includes('√5'), `Step 2 formula should preserve √5, got: ${step2Formula}`);
    assert.ok(step2Formula.includes('11') && step2Formula.includes('3'), `Step 2 should contain improper fraction 11/3, got: ${step2Formula}`);

    const sol2 = StepSolver.solve('2 * (1/3) + 4', 'DEG');
    assert.ok(sol2.steps.length >= 2, 'Should produce multiple steps for 2 * (1/3) + 4');
    const finalFormula = sol2.steps[sol2.steps.length - 1].formula;
    assert.ok(finalFormula.includes('2 * (1/3) + 4'), `Final step should preserve full LHS context, got: ${finalFormula}`);
    I18n.setLanguage('az');
});

it('Service Worker & index.html cache versions are bumped to v3.4.0', () => {
    const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(sw.includes("const CACHE_NAME = 'math-engine-az-v3.4.0';"), 'sw.js CACHE_NAME should be v3.4.0');
    assert.ok(html.includes('app.js?v=3.4.0'), 'index.html should reference ?v=3.4.0');
    assert.ok(!html.includes('?v=3.3.0'), 'index.html should not have stale ?v=3.3.0 queries');
});

// -------------------------------------------------------------
// 9. v3.2.0 2D Geometry, Coordinate Method, Plane Vectors & i18n Fixes
// -------------------------------------------------------------
console.log('\n[9] v3.2.0 2D Geometry, Coordinate Method, Plane Vectors & i18n Fixes');

it('MathCore.regularPolygon computes hexagon (n=6, a=4) accurately', () => {
    const poly = MathCore.regularPolygon(6, 4);
    assert.strictEqual(poly.interiorSum, 720);
    assert.strictEqual(poly.interiorAngle, 120);
    assert.strictEqual(poly.exteriorAngle, 60);
    assert.strictEqual(poly.diagonals, 9);
    assert.strictEqual(poly.perimeter, 24);
    assert.ok(Math.abs(poly.area - (24 * Math.sqrt(3))) < 1e-9, `Expected 24√3, got ${poly.area}`);
});

it('MathCore.coordinateGeometry computes distance, midpoint, slope & equation for A(1,2), B(4,6)', () => {
    const coord = MathCore.coordinateGeometry(1, 2, 4, 6);
    assert.strictEqual(coord.distance, 5);
    assert.deepStrictEqual(coord.midpoint, { x: 2.5, y: 4 });
    assert.ok(Math.abs(coord.slope - 4 / 3) < 1e-9);
    assert.strictEqual(coord.isVertical, false);

    const vert = MathCore.coordinateGeometry(3, -1, 3, 5);
    assert.strictEqual(vert.distance, 6);
    assert.strictEqual(vert.isVertical, true);
    assert.strictEqual(vert.slope, null);
    assert.strictEqual(vert.equation, 'x = 3');
});

it('MathCore.planeVectors computes sum, diff, magnitudes, dot product & angle for orthogonal u(3,0), v(0,4)', () => {
    const vec = MathCore.planeVectors(3, 0, 0, 4);
    assert.deepStrictEqual(vec.sum, { x: 3, y: 4 });
    assert.deepStrictEqual(vec.diff, { x: 3, y: -4 });
    assert.strictEqual(vec.magU, 3);
    assert.strictEqual(vec.magV, 4);
    assert.strictEqual(vec.dot, 0);
    assert.strictEqual(vec.angleDeg, 90);
    assert.ok(Math.abs(vec.angleRad - Math.PI / 2) < 1e-9);
});

it('VisualCharts renders 2D SVG diagrams for polygon, coordinate & vector in AZ and EN', () => {
    const polyEn = VisualCharts.renderGeometry('polygon', 'na', { n: 6, a: 4 }, 'en');
    assert.ok(polyEn.includes('<polygon') && polyEn.includes('Regular 6-gon'));
    const coordAz = VisualCharts.renderGeometry('coordinate', 'pts', { x1: 1, y1: 2, x2: 4, y2: 6 }, 'az');
    assert.ok(coordAz.includes('Koordinatlar Metodu') && coordAz.includes('M(2.5,4)'));
    const vecEn = VisualCharts.renderGeometry('vector', 'uv', { x1: 3, y1: 0, x2: 0, y2: 4 }, 'en');
    assert.ok(vecEn.includes('2D Plane Vectors') && vecEn.includes('vecArrowU'));
});

it('v3.1.0 EN localization fixes (Prime factorization & HISTORY_LABEL_MAP) are present', () => {
    assert.strictEqual(I18n.TRANSLATIONS.en.ntPrimeFactorsLabel, 'Prime factorization:');
    const appSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
    assert.ok(appSrc.includes("['ƏBOB', 'GCD']") && appSrc.includes("['ƏKOB', 'LCM']"));
    assert.ok(appSrc.includes("['Permutasiya', 'Permutation']") && appSrc.includes("['Kombinezon', 'Combination']"));
});

// -------------------------------------------------------------
// 10. v3.3.0 3D Solid Geometry & Wireframe Diagrams
// -------------------------------------------------------------
console.log('\n[10] v3.3.0 3D Solid Geometry & Wireframe Diagrams');

it('MathCore.solidCube(3) & MathCore.solidCuboid(2, 3, 6) compute exact formulas', () => {
    const cube = MathCore.solidCube(3);
    assert.strictEqual(cube.volume, 27);
    assert.strictEqual(cube.totalArea, 54);
    assert.ok(Math.abs(cube.faceDiagonal - 3 * Math.sqrt(2)) < 1e-9);
    assert.ok(Math.abs(cube.spaceDiagonal - 3 * Math.sqrt(3)) < 1e-9);

    const cuboid = MathCore.solidCuboid(2, 3, 6);
    assert.strictEqual(cuboid.volume, 36);
    assert.strictEqual(cuboid.lateralArea, 60);
    assert.strictEqual(cuboid.totalArea, 72);
    assert.strictEqual(cuboid.spaceDiagonal, 7);
});

it('MathCore.solidCylinder(3, 5) & MathCore.solidCone(3, 4) compute exact formulas including Base Area', () => {
    const cyl = MathCore.solidCylinder(3, 5);
    assert.ok(Math.abs(cyl.baseArea - 9 * Math.PI) < 1e-9);
    assert.ok(Math.abs(cyl.lateralArea - 30 * Math.PI) < 1e-9);
    assert.ok(Math.abs(cyl.totalArea - 48 * Math.PI) < 1e-9);
    assert.ok(Math.abs(cyl.volume - 45 * Math.PI) < 1e-9);

    const cone = MathCore.solidCone(3, 4);
    assert.strictEqual(cone.slantHeight, 5);
    assert.ok(Math.abs(cone.baseArea - 9 * Math.PI) < 1e-9);
    assert.ok(Math.abs(cone.lateralArea - 15 * Math.PI) < 1e-9);
    assert.ok(Math.abs(cone.totalArea - 24 * Math.PI) < 1e-9);
    assert.ok(Math.abs(cone.volume - 12 * Math.PI) < 1e-9);
});

it('MathCore.solidPyramid(6, 4) & MathCore.solidFrustum(5, 2, 4) compute exact formulas', () => {
    const pyr = MathCore.solidPyramid(6, 4);
    assert.strictEqual(pyr.slantHeight, 5);
    assert.strictEqual(pyr.baseArea, 36);
    assert.strictEqual(pyr.lateralArea, 60);
    assert.strictEqual(pyr.totalArea, 96);
    assert.strictEqual(pyr.volume, 48);

    const fru = MathCore.solidFrustum(5, 2, 4);
    assert.strictEqual(fru.slantHeight, 5);
    assert.ok(Math.abs(fru.lateralArea - 35 * Math.PI) < 1e-9);
    assert.ok(Math.abs(fru.totalArea - 64 * Math.PI) < 1e-9);
    assert.ok(Math.abs(fru.volume - 52 * Math.PI) < 1e-9);
    assert.strictEqual(MathCore.solidFrustum(2, 5, 4), null, 'R <= r must return null');
});

it('VisualCharts renders wireframe SVG diagrams for cuboid, pyramid & frustum in AZ and EN', () => {
    const cuboidEn = VisualCharts.renderGeometry('cuboid', 'abc', { a: 2, b: 3, c: 6 }, 'en');
    assert.ok(cuboidEn.includes('Rectangular Prism') && cuboidEn.includes('stroke-dasharray'));
    const pyrAz = VisualCharts.renderGeometry('pyramid', 'ah', { a: 6, h: 4 }, 'az');
    assert.ok(pyrAz.includes('Düzgün Dördbucaqlı Piramida') && pyrAz.includes('stroke-dasharray'));
    const fruEn = VisualCharts.renderGeometry('frustum', 'Rrh', { R: 5, r: 2, h: 4 }, 'en');
    assert.ok(fruEn.includes('Conical Frustum') && fruEn.includes('R = 5') && fruEn.includes('r = 2'));
});

// -------------------------------------------------------------
// 11. v3.4.0 Complex Numbers, Inequalities & Geometric Progression
// -------------------------------------------------------------
console.log('\n[11] v3.4.0 Complex Numbers, Inequalities & Geometric Progression');

it('MathCore.complexOps computes arithmetic, moduli, conjugates & arguments accurately', () => {
    const res = MathCore.complexOps(3, 4, 1, -2);
    assert.deepStrictEqual(res.sum, { re: 4, im: 2 });
    assert.deepStrictEqual(res.diff, { re: 2, im: 6 });
    assert.deepStrictEqual(res.prod, { re: 11, im: -2 });
    assert.deepStrictEqual(res.quot, { re: -1, im: 2 });
    assert.strictEqual(res.mod1, 5);
    assert.deepStrictEqual(res.conj1, { re: 3, im: -4 });
    assert.strictEqual(MathCore.complexOps(1, 1, 0, 0).quot, null, 'Division by z2=0 returns null');
});

it('MathCore.solveInequality solves quadratic & linear inequalities with exact intervals', () => {
    const q1 = MathCore.solveInequality(1, -4, 3, '>');
    assert.strictEqual(q1.discriminant, 4);
    assert.deepStrictEqual(q1.roots, [1, 3]);
    assert.strictEqual(q1.intervalStr, '(-∞, 1) ∪ (3, +∞)');

    const q2 = MathCore.solveInequality(1, -4, 3, '<=');
    assert.strictEqual(q2.intervalStr, '[1, 3]');

    const qEmpty = MathCore.solveInequality(1, 0, 4, '<');
    assert.strictEqual(qEmpty.intervalStr, '∅');

    const lin = MathCore.solveInequality(0, -2, 6, '>');
    assert.strictEqual(lin.isLinear, true);
    assert.strictEqual(lin.intervalStr, '(-∞, 3)');
});

it('MathCore.geometricProgression computes b_n, S_n, infinite sum & terms', () => {
    const gp = MathCore.geometricProgression(2, 0.5, 4);
    assert.strictEqual(gp.bn, 0.25);
    assert.strictEqual(gp.Sn, 3.75);
    assert.strictEqual(gp.converges, true);
    assert.strictEqual(gp.infSum, 4);
    assert.strictEqual(gp.terms.length, 4);

    const gpDiv = MathCore.geometricProgression(2, 2, 5);
    assert.strictEqual(gpDiv.bn, 32);
    assert.strictEqual(gpDiv.Sn, 62);
    assert.strictEqual(gpDiv.converges, false);
    assert.strictEqual(gpDiv.infSum, null);
});

it('VisualCharts renders Argand, Inequality & Geometric Progression SVGs in AZ and EN', () => {
    const argEn = VisualCharts.renderComplexArgand(3, 4, 1, -2, 'en');
    assert.ok(argEn.includes('Complex Argand Plane') && argEn.includes('z₁(3,4)'));
    const ineqAz = VisualCharts.renderInequalityGraph(MathCore.solveInequality(1, -4, 3, '>'), 'az');
    assert.ok(ineqAz.includes('Həll') && ineqAz.includes('(-∞, 1) ∪ (3, +∞)'));
    const gpEn = VisualCharts.renderGeometricProgression(MathCore.geometricProgression(2, 0.5, 4), 'en');
    assert.ok(gpEn.includes('Geometric Progression') && gpEn.includes('<rect'));
});

console.log(`\n========================================`);
console.log(`Summary: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
    process.exit(1);
}
