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
// 6. index.html & sw.js v3.0.0 Verification
// -------------------------------------------------------------
console.log('\n[6] HTML & Service Worker Verification Tests');

it('index.html references all scripts with v3.0.0 query string', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.ok(html.includes('style.css?v=3.0.0'), 'style.css should have v=3.0.0');
    assert.ok(html.includes('js/math-core.js?v=3.0.0'), 'math-core.js should have v=3.0.0');
    assert.ok(html.includes('js/math-editor.js?v=3.0.0'), 'math-editor.js should have v=3.0.0');
    assert.ok(html.includes('js/visual-charts.js?v=3.0.0'), 'visual-charts.js should have v=3.0.0');
    assert.ok(html.includes('js/i18n.js?v=3.0.0'), 'i18n.js should have v=3.0.0');
    assert.ok(html.includes('js/step-solver.js?v=3.0.0'), 'step-solver.js should have v=3.0.0');
    assert.ok(html.includes('app.js?v=3.0.0'), 'app.js should have v=3.0.0');
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

it('sw.js cache name is updated to math-engine-az-v3.0.0', () => {
    const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    assert.ok(sw.includes("const CACHE_NAME = 'math-engine-az-v3.0.0'"), 'CACHE_NAME should be math-engine-az-v3.0.0');
    assert.ok(sw.includes('./js/math-editor.js?v=3.0.0'), 'sw.js should precache math-editor.js?v=3.0.0');
    assert.ok(sw.includes('./js/visual-charts.js?v=3.0.0'), 'sw.js should precache visual-charts.js?v=3.0.0');
});

console.log(`\n========================================`);
console.log(`Summary: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
    process.exit(1);
}
