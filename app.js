/* ============================================================
   ELMI KALKULYATOR — APP.JS (v3.0.1 — "100% Bilingual AZ/EN Localization & Label Cleanup")
   Bütün riyazi hesablamalar lokal olaraq MathCore mühərriki ilə icra olunur.
   Heç bir eval() və ya new Function() istifadə olunmur.
   ============================================================ */

function getActiveLang() {
    return (window.I18n && typeof I18n.getLanguage === 'function')
        ? I18n.getLanguage()
        : ((typeof localStorage !== 'undefined' && localStorage.getItem('math_engine_az_lang')) || 'az');
}

function isEnglish() {
    return getActiveLang() === 'en';
}

document.addEventListener('DOMContentLoaded', () => {
    initSettings();
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

    const activeTabBtn = document.querySelector('.tab-btn.active');
    if (activeTabBtn) {
        updateVisualCard(activeTabBtn.dataset.tab);
    }

    const statInput = document.getElementById('statData');
    if (statInput) {
        statInput.addEventListener('input', () => {
            updateStatisticsChart();
        });
    }

    window.addEventListener('resize', () => {
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer && !canvasContainer.classList.contains('hidden')) {
            plotFunction(undefined, true);
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
   1. SETTINGS HUB, AUTO THEME & BILINGUAL ENGINE
   ========================================================== */
let currentThemeSetting = 'auto'; // 'light' | 'dark' | 'auto'
let isHapticEnabled = true;

function initSettings() {
    // 1. Initialize bilingual engine
    if (window.I18n && typeof I18n.init === 'function') {
        I18n.init();
    }

    // 2. Theme Setting
    const savedTheme = localStorage.getItem('math_engine_az_theme') || localStorage.getItem('calcTheme') || 'auto';
    currentThemeSetting = (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'auto';
    applyThemeSetting(currentThemeSetting);

    // Watch OS theme change when 'auto' is selected
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkQuery && typeof darkQuery.addEventListener === 'function') {
        darkQuery.addEventListener('change', e => {
            if (currentThemeSetting === 'auto') {
                applyTheme(e.matches);
            }
        });
    }

    // Theme Segmented Control
    const themeSegmented = document.getElementById('themeSegmented');
    if (themeSegmented) {
        themeSegmented.querySelectorAll('.seg-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeVal === currentThemeSetting);
            btn.addEventListener('click', () => {
                const val = btn.dataset.themeVal;
                currentThemeSetting = val;
                localStorage.setItem('math_engine_az_theme', val);
                themeSegmented.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b === btn));
                applyThemeSetting(val);
                triggerHaptic();
            });
        });
    }

    // 3. Language Segmented Control
    const langSegmented = document.getElementById('langSegmented');
    if (langSegmented) {
        const curLang = window.I18n ? I18n.getLanguage() : 'az';
        langSegmented.querySelectorAll('.seg-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.langVal === curLang);
            btn.addEventListener('click', () => {
                const lang = btn.dataset.langVal;
                langSegmented.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b === btn));
                if (window.I18n) {
                    I18n.setLanguage(lang);
                }
                if (window.MathCore && typeof MathCore.setLanguage === 'function') {
                    MathCore.setLanguage(lang);
                }
                refreshLocalizedUI();
                triggerHaptic();
            });
        });
    }

    // 4. Haptic Feedback Setting
    const savedHaptic = localStorage.getItem('math_engine_az_haptic');
    isHapticEnabled = savedHaptic !== '0';
    const hapticSegmented = document.getElementById('hapticSegmented');
    if (hapticSegmented) {
        hapticSegmented.querySelectorAll('.seg-btn').forEach(btn => {
            const val = btn.dataset.hapticVal === '1';
            btn.classList.toggle('active', val === isHapticEnabled);
            btn.addEventListener('click', () => {
                isHapticEnabled = btn.dataset.hapticVal === '1';
                localStorage.setItem('math_engine_az_haptic', isHapticEnabled ? '1' : '0');
                hapticSegmented.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b === btn));
                triggerHaptic();
            });
        });
    }
}

function applyThemeSetting(setting) {
    if (setting === 'auto') {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(isDark);
    } else {
        applyTheme(setting === 'dark');
    }
}

function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark', 'dark-theme');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark', 'dark-theme');
        document.body.classList.add('light-theme');
    }
}

function triggerHaptic() {
    if (isHapticEnabled && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
            navigator.vibrate(15);
        } catch (e) {}
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
            triggerHaptic();
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
                triggerHaptic();
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

function refreshLocalizedUI() {
    // 1. Refresh calculator preview & solver
    if (calcState && calcState.expression) {
        try {
            const preview = evalMathExpr(calcState.expression);
            if (preview !== null && isFinite(preview)) {
                calcState.result = formatNumber(preview);
                updateCalcDisplay(false);
            }
        } catch (err) {
            calcState.result = err.message || (window.I18n ? I18n.t('errorGeneric', 'Error') : 'Error');
            updateCalcDisplay(true);
        }
        updateSolverOrGraph(calcState.expression);
    }

    // 2. Refresh history list & section badges
    renderHistory();

    // 3. Refresh Geometry dynamic inputs/modes while preserving entered values
    if (currentShape && shapes[currentShape]) {
        const prevVals = {};
        document.querySelectorAll('#shapeInputs input').forEach(inp => {
            prevVals[inp.id] = inp.value;
        });
        const modeSelect = document.getElementById('inputModeSelect');
        const prevMode = modeSelect ? modeSelect.value : currentMode;
        onShapeSelect(true);
        if (prevMode && document.getElementById('inputModeSelect')) {
            document.getElementById('inputModeSelect').value = prevMode;
            currentMode = prevMode;
            renderShapeInputs();
        }
        Object.keys(prevVals).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = prevVals[id];
        });
        const geoRes = document.getElementById('geoResults');
        if (geoRes && geoRes.innerHTML.trim() !== '') {
            calculateGeometry();
        } else {
            updateGeometryDiagram();
        }
    }

    // 4. Refresh Percentage dynamic labels while preserving values
    const pctVal = document.getElementById('pctVal')?.value;
    const pctPct = document.getElementById('pctPct')?.value;
    const pctPart = document.getElementById('pctPart')?.value;
    const pctWhole = document.getElementById('pctWhole')?.value;
    updatePctInputs();
    if (pctVal !== undefined && document.getElementById('pctVal')) document.getElementById('pctVal').value = pctVal;
    if (pctPct !== undefined && document.getElementById('pctPct')) document.getElementById('pctPct').value = pctPct;
    if (pctPart !== undefined && document.getElementById('pctPart')) document.getElementById('pctPart').value = pctPart;
    if (pctWhole !== undefined && document.getElementById('pctWhole')) document.getElementById('pctWhole').value = pctWhole;

    // 5. Refresh Right Visualization Card header & content for the active tab
    const activeTabBtn = document.querySelector('.tab-btn.active');
    const activeTab = activeTabBtn ? activeTabBtn.dataset.tab : 'calculator';
    const activeSec = document.getElementById('sec-' + activeTab);
    const activeSub = activeSec?.querySelector('.sub-tab.active')?.dataset.subtab;
    updateVisualCard(activeTab, activeSub);
}

function updateVisualCard(tabId, subtabId) {
    const visualTitle = document.getElementById('visual-title');
    const visualSubtitle = document.getElementById('visual-subtitle');
    const gridContainer = document.getElementById('visual-grid-container');
    const canvasContainer = document.getElementById('canvas-container');
    const solverContainer = document.getElementById('solver-container');
    const geoContainer = document.getElementById('geometry-diagram-container');
    const statsContainer = document.getElementById('stats-chart-container');
    const settingsContainer = document.getElementById('settings-info-container');
    const zoomControls = document.getElementById('graphZoomControls');

    if (!visualTitle) return;

    // Hide all subpanels by default
    [gridContainer, canvasContainer, solverContainer, geoContainer, statsContainer, settingsContainer].forEach(el => {
        if (el) el.classList.add('hidden');
    });

    if (tabId === 'calculator') {
        updateSolverOrGraph(calcState.expression);
        return;
    }

    if (tabId === 'analysis') {
        visualTitle.textContent = window.I18n ? I18n.t('subTabGraph', 'Funksiya Qrafiki') : 'Funksiya Qrafiki';
        visualSubtitle.textContent = window.I18n ? I18n.t('visualGraphSubtitle', '2D İnteraktiv Qrafik Müstəvisi') : '2D İnteraktiv Qrafik Müstəvisi';
        if (canvasContainer) canvasContainer.classList.remove('hidden');
        if (zoomControls) zoomControls.style.display = 'flex';
        plotFunction(undefined, true);
    } else if (tabId === 'geometry') {
        visualTitle.textContent = window.I18n ? I18n.t('geoDiagramTitle', '2D Həndəsi Çertyoj') : '2D Həndəsi Çertyoj';
        visualSubtitle.textContent = window.I18n ? I18n.t('geoDiagramSubtitle', 'Dinamik ölçülər və bucaqlar') : 'Dinamik ölçülər və bucaqlar';
        if (geoContainer) geoContainer.classList.remove('hidden');
        if (zoomControls) zoomControls.style.display = 'none';
        updateGeometryDiagram();
    } else if (tabId === 'statistics') {
        visualTitle.textContent = window.I18n ? I18n.t('statsChartTitle', 'Statistik Paylanma Qrafiki') : 'Statistik Paylanma Qrafiki';
        visualSubtitle.textContent = window.I18n ? I18n.t('statsChartSubtitle', 'Verilənlər sütunları və Ədədi Orta (x̄)') : 'Verilənlər sütunları və Ədədi Orta (x̄)';
        if (statsContainer) statsContainer.classList.remove('hidden');
        if (zoomControls) zoomControls.style.display = 'none';
        updateStatisticsChart();
    } else if (tabId === 'settings') {
        visualTitle.textContent = window.I18n ? I18n.t('sysInfoTitle', 'Sistem Məlumatı') : 'Sistem Məlumatı';
        visualSubtitle.textContent = window.I18n ? I18n.t('sysInfoSubtitle', 'PWA mühərriki və cihaz konfiqurasiyası') : 'PWA mühərriki və cihaz konfiqurasiyası';
        if (settingsContainer) settingsContainer.classList.remove('hidden');
        if (zoomControls) zoomControls.style.display = 'none';
    } else {
        // Algebra
        visualTitle.textContent = window.I18n ? I18n.t('secAlgebraTitle', 'Cəbr və Tənliklər') : 'Cəbr və Tənliklər';
        visualSubtitle.textContent = window.I18n ? I18n.t('visualAlgebraSubtitle', 'Funksiya və Tənliklər Müstəvisi') : 'Funksiya və Tənliklər Müstəvisi';
        if (gridContainer) gridContainer.classList.remove('hidden');
        if (zoomControls) zoomControls.style.display = 'none';
    }
}

/**
 * Live 2D Geometry Diagram Rendering
 */
function updateGeometryDiagram() {
    const geoContainer = document.getElementById('geometry-diagram-container');
    if (!geoContainer || !window.VisualCharts) return;

    const lang = getActiveLang();
    const isEn = lang === 'en';

    if (!currentShape) {
        geoContainer.innerHTML = `<div class="text-text-muted text-xs p-4 text-center">${isEn ? 'Please select a shape to view 2D diagram' : '2D çertyoju görmək üçün fiqur seçin'}</div>`;
        return;
    }

    const shape = shapes[currentShape];
    const mode = shape ? shape.modes.find(m => m.id === currentMode) : null;
    const vals = {};
    if (mode) {
        mode.inputs.forEach(inp => {
            const el = document.getElementById('geo_' + inp.id);
            if (el && el.value.trim()) {
                try {
                    vals[inp.id] = (window.MathCore && MathCore.evaluate)
                        ? MathCore.evaluate(el.value.trim())
                        : parseFloat(el.value.trim());
                } catch {
                    vals[inp.id] = parseFloat(el.value.trim());
                }
            }
        });
    }

    geoContainer.innerHTML = VisualCharts.renderGeometry(currentShape, currentMode, vals, lang);
}

/**
 * Live Statistics Bar / Distribution Chart Rendering
 */
function updateStatisticsChart(dataArray, statsObj) {
    const statsContainer = document.getElementById('stats-chart-container');
    if (!statsContainer || !window.VisualCharts) return;

    const lang = getActiveLang();
    const isEn = lang === 'en';

    if (!dataArray || dataArray.length === 0) {
        const raw = document.getElementById('statData') ? document.getElementById('statData').value.trim() : '';
        dataArray = raw ? raw.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n)) : [];
    }

    if (dataArray.length === 0) {
        statsContainer.innerHTML = `<div class="text-text-muted text-xs p-4 text-center">${isEn ? 'Enter numbers to view statistical distribution chart' : 'Statistik paylanma qrafikini görmək üçün ədədlər daxil edin'}</div>`;
        return;
    }

    statsContainer.innerHTML = VisualCharts.renderStatistics(dataArray, statsObj || {}, lang);
}

/**
 * Dynamically switches Right Workspace between f(x) Graph & Step-by-Step Solver
 */
function updateSolverOrGraph(expr) {
    const activeTab = document.querySelector('.tab-btn.active');
    const tabName = activeTab ? activeTab.dataset.tab : 'calculator';
    if (tabName !== 'calculator') return;

    const visualTitle = document.getElementById('visual-title');
    const visualSubtitle = document.getElementById('visual-subtitle');
    const gridContainer = document.getElementById('visual-grid-container');
    const canvasContainer = document.getElementById('canvas-container');
    const solverContainer = document.getElementById('solver-container');
    const geoContainer = document.getElementById('geometry-diagram-container');
    const statsContainer = document.getElementById('stats-chart-container');
    const settingsContainer = document.getElementById('settings-info-container');
    const zoomControls = document.getElementById('graphZoomControls');

    [gridContainer, geoContainer, statsContainer, settingsContainer].forEach(el => {
        if (el) el.classList.add('hidden');
    });

    const solveData = (window.StepSolver && typeof StepSolver.solve === 'function')
        ? StepSolver.solve(expr, calcState.angleMode)
        : { empty: !expr, hasVariable: false };

    if (solveData.hasVariable) {
        // Plot mode: f(x) dynamic graph
        if (solverContainer) solverContainer.classList.add('hidden');
        if (canvasContainer) canvasContainer.classList.remove('hidden');
        if (zoomControls) zoomControls.style.display = 'flex';

        if (visualTitle) visualTitle.textContent = (window.I18n ? I18n.t('visualTitle') : 'Vizual Model və Qrafik');
        if (visualSubtitle) visualSubtitle.textContent = (window.I18n ? I18n.t('visualGraphSubtitle') : '2D İnteraktiv Qrafik Müstəvisi');

        plotFunction(solveData.expression || expr, true);
    } else {
        // Solver mode: Step-by-step breakdown & alternative representations
        if (canvasContainer) canvasContainer.classList.add('hidden');
        if (solverContainer) solverContainer.classList.remove('hidden');
        if (zoomControls) zoomControls.style.display = 'none';

        if (visualTitle) visualTitle.textContent = (window.I18n ? I18n.t('solverTitle') : 'Həll Addımları');
        if (visualSubtitle) visualSubtitle.textContent = (window.I18n ? I18n.t('solverSubtitle') : 'Addım-addım riyazi izahat');

        renderSolutionSteps(solveData);
    }
}

function renderSolutionSteps(data) {
    const emptyEl = document.getElementById('solver-empty');
    const contentEl = document.getElementById('solver-content');
    if (!emptyEl || !contentEl) return;

    if (!data || data.empty || (!data.steps && !data.error)) {
        emptyEl.classList.remove('hidden');
        contentEl.classList.add('hidden');
        contentEl.innerHTML = '';
        return;
    }

    emptyEl.classList.add('hidden');
    contentEl.classList.remove('hidden');

    let html = '';

    const lang = (window.I18n && typeof I18n.getLanguage === 'function')
        ? I18n.getLanguage()
        : ((typeof localStorage !== 'undefined' && localStorage.getItem('math_engine_az_lang')) || 'az');
    const isEn = lang === 'en';
    const errorBadgeText = isEn ? 'Error' : 'Xəta';
    const stepWord = isEn ? 'Step' : 'Addım';

    if (data.error) {
        html += `
            <div class="step-card">
                <div class="step-header">
                    <span class="step-badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">${errorBadgeText}</span>
                </div>
                <div class="step-explanation" style="color: #ef4444;">${escHtml(data.error)}</div>
            </div>
        `;
        contentEl.innerHTML = html;
        return;
    }

    // Render Steps with Expandable Sub-steps Accordion
    if (Array.isArray(data.steps)) {
        data.steps.forEach((step, idx) => {
            const hasSubsteps = Array.isArray(step.substeps) && step.substeps.length > 0;
            const subStepsHtml = hasSubsteps ? `
                <div class="step-substeps-wrap">
                    <button class="substeps-toggle-btn" type="button" onclick="toggleStepSubsteps(this)">
                        <span class="substeps-toggle-label">${isEn ? 'Show detailed steps' : 'Ətraflı addımları göstər'}</span>
                        <span class="material-symbols-outlined substeps-icon">expand_more</span>
                    </button>
                    <div class="substeps-body hidden">
                        ${step.substeps.map((sub, sIdx) => `
                            <div class="substep-row">
                                <span class="substep-bullet">${sIdx + 1}.</span>
                                <div class="substep-details">
                                    ${sub.formula ? `<div class="substep-formula">${sub.formula}</div>` : ''}
                                    ${sub.explanation ? `<div class="substep-exp">${escHtml(sub.explanation)}</div>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : '';

            html += `
                <div class="step-card">
                    <div class="step-header">
                        <span class="step-badge">${stepWord} ${idx + 1}</span>
                        <span class="step-title">${escHtml(step.title || '')}</span>
                    </div>
                    ${step.formula ? `<div class="step-formula">${step.formula}</div>` : ''}
                    ${step.explanation ? `<div class="step-explanation">${escHtml(step.explanation)}</div>` : ''}
                    ${subStepsHtml}
                </div>
            `;
        });
    }

    // Render Alternative Forms (stacked fractions, mixed numbers, decimals)
    if (data.altForms) {
        const alt = data.altForms;
        html += `
            <div class="alt-forms-card">
                <div class="alt-forms-title">
                    <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
                    <span>${isEn ? 'Alternative Forms' : 'Alternativ Formlar'}</span>
                </div>
                <div class="alt-forms-grid">
                    ${alt.improper ? `
                        <div class="alt-form-item" style="cursor: pointer;" onclick="insertAltForm('${alt.improper}')" title="${isEn ? 'Click to use' : 'İstifadə etmək üçün klikləyin'}">
                            <span class="alt-form-label">${isEn ? 'Fraction' : 'Düzgün/Qeyri-düzgün kəsr'}</span>
                            <span class="alt-form-val">${alt.improperHtml || alt.improper}</span>
                        </div>
                    ` : ''}
                    ${alt.mixed ? `
                        <div class="alt-form-item" style="cursor: pointer;" onclick="insertAltForm('${alt.mixed}')" title="${isEn ? 'Click to use' : 'İstifadə etmək üçün klikləyin'}">
                            <span class="alt-form-label">${isEn ? 'Mixed Number' : 'Qarışıq kəsr'}</span>
                            <span class="alt-form-val">${alt.mixedHtml || alt.mixed}</span>
                        </div>
                    ` : ''}
                    ${alt.decimal !== undefined ? `
                        <div class="alt-form-item" style="cursor: pointer;" onclick="insertAltForm('${alt.decimal}')" title="${isEn ? 'Click to use' : 'İstifadə etmək üçün klikləyin'}">
                            <span class="alt-form-label">${isEn ? 'Decimal' : 'Onluq kəsr'}</span>
                            <span class="alt-form-val">${alt.decimal}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    contentEl.innerHTML = html;
}

window.toggleStepSubsteps = function(btn) {
    if (!btn) return;
    const body = btn.nextElementSibling;
    if (!body) return;
    const isEn = (window.I18n && typeof I18n.getLanguage === 'function') ? I18n.getLanguage() === 'en' : false;
    body.classList.toggle('hidden');
    btn.classList.toggle('is-expanded');
    const isExp = btn.classList.contains('is-expanded');
    const label = btn.querySelector('.substeps-toggle-label');
    if (label) {
        label.textContent = isExp ? (isEn ? 'Hide detailed steps' : 'Ətraflı addımları gizlət') : (isEn ? 'Show detailed steps' : 'Ətraflı addımları göstər');
    }
    triggerHaptic();
};

window.resetSettingsDefaults = function() {
    localStorage.removeItem('math_engine_az_theme');
    localStorage.removeItem('math_engine_az_lang');
    localStorage.removeItem('math_engine_az_haptic');
    localStorage.removeItem('calcTheme');
    localStorage.removeItem('calcKeypadMode');

    currentThemeSetting = 'auto';
    applyThemeSetting('auto');
    isHapticEnabled = true;

    if (window.I18n) {
        I18n.setLanguage('az');
    }
    if (window.MathCore && typeof MathCore.setLanguage === 'function') {
        MathCore.setLanguage('az');
    }

    const themeSeg = document.getElementById('themeSegmented');
    if (themeSeg) {
        themeSeg.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.themeVal === 'auto'));
    }
    const langSeg = document.getElementById('langSegmented');
    if (langSeg) {
        langSeg.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.langVal === 'az'));
    }
    const hapticSeg = document.getElementById('hapticSegmented');
    if (hapticSeg) {
        hapticSeg.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.hapticVal === '1'));
    }

    refreshLocalizedUI();
    alert(window.I18n ? I18n.t('resetSuccess', 'Ayarlar uğurla sıfırlandı!') : 'Ayarlar uğurla sıfırlandı!');
    triggerHaptic();
};

/* ==========================================================
   4. BƏSİT / ELMİ KEYPAD SEGMENTED TOGGLE
   ========================================================== */
function initCalculatorModeToggle() {
    const modeElmi = document.getElementById('mode-elmi');
    const modeBesit = document.getElementById('mode-besit');
    const keypadElmi = document.getElementById('keypad-elmi');
    const keypadBesit = document.getElementById('keypad-besit');

    if (!modeElmi || !modeBesit || !keypadElmi || !keypadBesit) return;

    function setKeypadMode(isElmi) {
        if (isElmi) {
            modeElmi.classList.add('active');
            modeBesit.classList.remove('active');
            keypadElmi.classList.remove('hidden');
            keypadBesit.classList.add('hidden');
            localStorage.setItem('calcKeypadMode', 'elmi');
        } else {
            modeBesit.classList.add('active');
            modeElmi.classList.remove('active');
            keypadBesit.classList.remove('hidden');
            keypadElmi.classList.add('hidden');
            localStorage.setItem('calcKeypadMode', 'besit');
        }
    }

    const savedMode = localStorage.getItem('calcKeypadMode');
    if (savedMode === 'besit') {
        setKeypadMode(false);
    } else {
        setKeypadMode(true);
    }

    modeElmi.addEventListener('click', () => {
        triggerHaptic();
        setKeypadMode(true);
    });
    modeBesit.addEventListener('click', () => {
        triggerHaptic();
        setKeypadMode(false);
    });
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

const HISTORY_LABEL_MAP = [
    ['Kalkulyator', 'Calculator'],
    ['Həndəsə', 'Geometry'],
    ['Cəbr', 'Algebra'],
    ['Analiz', 'Calculus'],
    ['Statistika', 'Statistics'],
    ['Matris', 'Matrix'],
    ['Tam səthi', 'Total Surface Area'],
    ['Yan səthi', 'Lateral Surface Area'],
    ['Üz diaqonalı', 'Face Diagonal'],
    ['Fəza diaqonalı', 'Space Diagonal'],
    ['Çəpər hündürlük', 'Slant Height'],
    ['Yarımperimetr', 'Semiperimeter'],
    ['Məchul katet', 'Unknown leg'],
    ['Bucaq α', 'Angle α'],
    ['Bucaq β', 'Angle β'],
    ['Perimetr', 'Perimeter'],
    ['Diaqonal', 'Diagonal'],
    ['Hipotenuz', 'Hypotenuse'],
    ['Sahə', 'Area'],
    ['Çevrə', 'Circumference'],
    ['Həcm', 'Volume'],
    ['Səthi', 'Surface Area'],
    ['2 məchullu sistem', '2-var system'],
    ['3 məchullu sistem', '3-var system'],
    ['toplama', 'addition'],
    ['çıxma', 'subtraction'],
    ['vurma', 'multiplication'],
    ['nəticə', 'result'],
    ['Ədədi', 'Arithmetic'],
    ['Həndəsi', 'Geometric']
];

function translateHistoryField(str, isEn) {
    let out = String(str || '');
    for (const [az, en] of HISTORY_LABEL_MAP) {
        const from = isEn ? az : en;
        const to = isEn ? en : az;
        if (out.includes(from)) {
            out = out.split(from).join(to);
        }
    }
    return out;
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    const isEn = isEnglish();
    if (historyData.length === 0) {
        const emptyText = window.I18n ? I18n.t('historyEmpty', isEn ? 'No calculations yet' : 'Hələ hesablama yoxdur') : (isEn ? 'No calculations yet' : 'Hələ hesablama yoxdur');
        list.innerHTML = `<p class="history-empty-msg" data-i18n="historyEmpty">${escHtml(emptyText)}</p>`;
        return;
    }
    const insertTitle = window.I18n ? I18n.t('historyInsertTitle', isEn ? 'Click to insert result' : 'Klikləyin: Nəticəni daxil edin') : (isEn ? 'Click to insert result' : 'Klikləyin: Nəticəni daxil edin');
    list.innerHTML = historyData.map((h, i) => `
        <button class="history-item-btn" type="button" onclick="useHistoryItem(${i})" title="${escHtml(insertTitle)} (${escHtml(String(h.result))})">
            <div class="h-top">
                <span>${escHtml(translateHistoryField(h.type, isEn))}</span>
                <span>${escHtml(h.time)}</span>
            </div>
            <div class="h-expr">${escHtml(translateHistoryField(h.expression, isEn))}</div>
            <div class="h-res">= ${escHtml(translateHistoryField(String(h.result), isEn))}</div>
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

    if (window.VisualMathEditor) {
        if (calcState.justCalculated || VisualMathEditor.isEmpty()) {
            VisualMathEditor.setExpression(String(valToInsert));
            calcState.justCalculated = false;
        } else {
            VisualMathEditor.insertParsed(String(valToInsert));
        }
    } else {
        if (calcState.justCalculated || !calcState.expression.trim()) {
            calcState.expression = String(valToInsert);
            calcState.justCalculated = false;
        } else {
            calcState.expression += String(valToInsert);
        }
    }
    calcState.result = String(valToInsert);

    if (window.MathCore && MathCore.HistoryStore) {
        MathCore.HistoryStore.setAns(parseFloat(valToInsert) || 0);
    }

    updateCalcDisplay(false);
    updateSolverOrGraph(calcState.expression);
}

window.insertAltForm = function(val) {
    if (!val) return;
    triggerHaptic();

    if (lastFocusedInput && document.body.contains(lastFocusedInput) && lastFocusedInput.id !== 'calcExpression') {
        lastFocusedInput.value = val;
        lastFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));
        lastFocusedInput.dispatchEvent(new Event('change', { bubbles: true }));
        lastFocusedInput.focus();
        return;
    }

    const calcTab = document.querySelector('[data-tab="calculator"]');
    if (calcTab) calcTab.click();

    if (window.VisualMathEditor) {
        VisualMathEditor.setExpression(String(val));
    } else {
        calcState.expression = String(val);
        calcState.justCalculated = false;
    }
    calcState.result = String(val);

    if (window.MathCore && MathCore.HistoryStore) {
        const numVal = parseFloat(val);
        if (isFinite(numVal)) {
            MathCore.HistoryStore.setAns(numVal);
        }
    }

    updateCalcDisplay(false);
    updateSolverOrGraph(calcState.expression);
};

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
    const exprEl = document.getElementById('calcExpression');
    if (window.VisualMathEditor && exprEl) {
        VisualMathEditor.init(exprEl, (serializedExpr) => {
            calcState.expression = serializedExpr;
            if (!serializedExpr) {
                calcState.result = '0';
                updateCalcDisplay(false);
                updateSolverOrGraph('');
                return;
            }
            try {
                const preview = evalMathExpr(serializedExpr);
                if (preview !== null && isFinite(preview)) {
                    calcState.result = formatNumber(preview);
                    updateCalcDisplay(false);
                }
            } catch {
                // Incomplete syntax while typing
            }
            updateSolverOrGraph(serializedExpr);
        });
    }

    const navToolbar = document.querySelector('.slot-nav-toolbar');
    if (navToolbar) {
        navToolbar.addEventListener('click', e => {
            const btn = e.target.closest('button');
            if (!btn) return;
            triggerHaptic();
            if (btn.id === 'slotNavLeft' || btn.dataset.action === 'navLeft') {
                handleCalcButton('navLeft');
            } else if (btn.id === 'slotNavRight' || btn.dataset.action === 'navRight') {
                handleCalcButton('navRight');
            } else if (btn.dataset.action) {
                handleCalcButton(btn.dataset.action);
            }
        });
    }

    const btns = document.getElementById('calcButtons');
    if (btns) {
        btns.addEventListener('click', e => {
            const btn = e.target.closest('.calc-key, .btn');
            if (!btn) return;
            triggerHaptic();
            handleCalcButton(btn.dataset.action, btn.dataset.value || btn.dataset.val);
        });
    }

    const angleBtn = document.getElementById('angleModeBtn');
    if (angleBtn) {
        angleBtn.addEventListener('click', () => {
            triggerHaptic();
            calcState.angleMode = calcState.angleMode === 'DEG' ? 'RAD' : 'DEG';
            angleBtn.textContent = calcState.angleMode;
            // Re-evaluate live preview if applicable
            if (calcState.expression.trim()) {
                try {
                    const preview = evalMathExpr(calcState.expression);
                    if (preview !== null && isFinite(preview)) {
                        calcState.result = formatNumber(preview);
                    }
                } catch {}
            }
            updateSolverOrGraph(calcState.expression);
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
        else if (key === 'Enter' || key === '=') { e.preventDefault(); handleCalcButton('equals'); }
        else if (key === 'Backspace') { e.preventDefault(); handleCalcButton('backspace'); }
        else if (key === 'Delete') { e.preventDefault(); handleCalcButton('del'); }
        else if (key === 'Escape') handleCalcButton('allClear');
        else if (key === '%') handleCalcButton('percent');
        else if (key === 'ArrowLeft') { e.preventDefault(); handleCalcButton('navLeft'); }
        else if (key === 'ArrowRight') { e.preventDefault(); handleCalcButton('navRight'); }
    });
}

function handleCalcButton(action, value) {
    if (window.VisualMathEditor) {
        switch (action) {
            case 'num':
                if (calcState.justCalculated) { VisualMathEditor.clear(); calcState.justCalculated = false; }
                VisualMathEditor.insertToken(value);
                break;
            case 'decimal':
                if (calcState.justCalculated) { VisualMathEditor.clear(); VisualMathEditor.insertToken('0'); calcState.justCalculated = false; }
                VisualMathEditor.insertToken('.');
                break;
            case 'op':
                calcState.justCalculated = false;
                VisualMathEditor.insertToken(' ' + value + ' ');
                break;
            case 'openParen':
                if (calcState.justCalculated) { VisualMathEditor.clear(); calcState.justCalculated = false; }
                VisualMathEditor.insertToken('(');
                break;
            case 'closeParen':
                VisualMathEditor.insertToken(')');
                break;
            case 'parens':
                if (calcState.justCalculated) { VisualMathEditor.clear(); calcState.justCalculated = false; }
                VisualMathEditor.insertToken('(');
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'cot':
            case 'asin':
            case 'acos':
            case 'atan':
            case 'ln':
            case 'log':
                if (calcState.justCalculated) { VisualMathEditor.clear(); calcState.justCalculated = false; }
                VisualMathEditor.insertToken(action + '(');
                break;
            case 'sqrt':
                if (calcState.justCalculated) { VisualMathEditor.clear(); calcState.justCalculated = false; }
                VisualMathEditor.insertRadical();
                break;
            case 'square':
                VisualMathEditor.insertExponent('2');
                break;
            case 'pow':
                VisualMathEditor.insertExponent();
                break;
            case 'fraction':
                VisualMathEditor.insertFraction();
                break;
            case 'mixedFraction':
                VisualMathEditor.insertMixedFraction();
                break;
            case 'factorial':
                VisualMathEditor.insertToken('!');
                break;
            case 'pi':
                if (calcState.justCalculated) { VisualMathEditor.clear(); calcState.justCalculated = false; }
                VisualMathEditor.insertToken('pi');
                break;
            case 'e':
                if (calcState.justCalculated) { VisualMathEditor.clear(); calcState.justCalculated = false; }
                VisualMathEditor.insertToken('e');
                break;
            case 'ans':
                if (calcState.justCalculated) { VisualMathEditor.clear(); calcState.justCalculated = false; }
                VisualMathEditor.insertToken('ans');
                break;
            case 'percent':
                VisualMathEditor.insertToken('%');
                break;
            case 'negate':
                VisualMathEditor.toggleSign();
                break;
            case 'navLeft':
                VisualMathEditor.navigateLeft();
                break;
            case 'navRight':
                VisualMathEditor.navigateRight();
                break;
            case 'del':
            case 'backspace':
                VisualMathEditor.deleteAtomic();
                break;
            case 'ac':
            case 'clear':
            case 'allClear':
                VisualMathEditor.clear();
                calcState.expression = '';
                calcState.result = '0';
                calcState.justCalculated = false;
                calcState.showingFraction = false;
                updateCalcDisplay(false);
                updateSolverOrGraph('');
                break;
            case 'equals':
                evaluateCalc();
                return;
        }
        return;
    }

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
        case 'fraction':
            if (calcState.justCalculated) {
                // If result is shown, toggle or format result as fraction!
                const num = parseFloat(calcState.result);
                if (isFinite(num) && window.MathCore && MathCore.toFraction) {
                    const frac = MathCore.toFraction(num);
                    if (frac && frac.d > 1) {
                        if (calcState.showingFraction) {
                            calcState.result = String(frac.decimal);
                            calcState.showingFraction = false;
                        } else {
                            calcState.result = `${frac.n}/${frac.d}`;
                            calcState.showingFraction = true;
                        }
                        updateCalcDisplay(false);
                        updateSolverOrGraph(calcState.expression);
                        return;
                    }
                }
            } else {
                const matchNum = calcState.expression.match(/([0-9.]+)$/);
                if (matchNum) {
                    const n = matchNum[1];
                    calcState.expression = calcState.expression.slice(0, -n.length) + `(${n}/`;
                } else if (!calcState.expression || /[+*×÷/(\^-\s]$/.test(calcState.expression)) {
                    calcState.expression += '(';
                } else {
                    calcState.expression += '/';
                }
            }
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
            calcState.showingFraction = false;
            updateSolverOrGraph('');
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
                    updateSolverOrGraph(calcState.expression);
                    return;
                }
            }
        } catch {}
        updateCalcDisplay(false);
        updateSolverOrGraph(calcState.expression);
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

    if (!window.VisualMathEditor) {
        exprEl.textContent = formatExprDisplay(calcState.expression) || '\u00A0';
    }
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
    const lang = (window.I18n && typeof I18n.getLanguage === 'function')
        ? I18n.getLanguage()
        : ((typeof localStorage !== 'undefined' && localStorage.getItem('math_engine_az_lang')) || 'az');
    const isEn = lang === 'en';
    try {
        const result = evalMathExpr(calcState.expression);
        if (result === null || result === undefined || isNaN(result)) {
            throw new Error(window.I18n ? I18n.t('errInvalidSyntax', isEn ? 'Evaluation failed' : 'Hesablana bilmədi') : (isEn ? 'Evaluation failed' : 'Hesablana bilmədi'));
        }
        const display = formatNumber(result);
        addToHistory(window.I18n ? I18n.t('tabCalculator', 'Kalkulyator') : 'Kalkulyator', calcState.expression, display);
        if (window.MathCore && MathCore.HistoryStore) {
            MathCore.HistoryStore.setAns(result);
        }
        calcState.result = display;
        calcState.justCalculated = true;
        calcState.showingFraction = false;
        updateCalcDisplay(false);
        updateSolverOrGraph(calcState.expression);
    } catch (err) {
        calcState.result = err.message || (window.I18n ? I18n.t('errorGeneric', isEn ? 'Error' : 'Xəta') : (isEn ? 'Error' : 'Xəta'));
        updateCalcDisplay(true);
        updateSolverOrGraph(calcState.expression);
    }
}

function evalMathExpr(expr) {
    if (window.MathCore && typeof MathCore.evaluate === 'function') {
        const lang = (window.I18n && typeof I18n.getLanguage === 'function')
            ? I18n.getLanguage()
            : ((typeof localStorage !== 'undefined' && localStorage.getItem('math_engine_az_lang')) || 'az');
        return MathCore.evaluate(expr, {
            angleMode: calcState.angleMode,
            ans: (MathCore.HistoryStore && typeof MathCore.HistoryStore.getAns === 'function') ? MathCore.HistoryStore.getAns() : 0,
            lang: lang
        });
    }
    const isEn = (window.I18n && typeof I18n.getLanguage === 'function') ? I18n.getLanguage() === 'en' : false;
    throw new Error(isEn ? 'MathCore engine not found' : 'MathCore mühərriki tapılmadı');
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
function locLabel(val) {
    if (val && typeof val === 'object') {
        return isEnglish() ? (val.en || val.az) : (val.az || val.en);
    }
    return String(val || '');
}

const shapes = {
    circle: {
        name: { az: 'Dairə', en: 'Circle' },
        modes: [
            { id: 'r', label: { az: 'Radius verilir', en: 'Given radius' }, inputs: [{id:'r', label:{ az: 'Radius (r)', en: 'Radius (r)' }}] }
        ]
    },
    square: {
        name: { az: 'Kvadrat', en: 'Square' },
        modes: [
            { id: 'a', label: { az: 'Tərəf verilir', en: 'Given side' }, inputs: [{id:'a', label:{ az: 'Tərəf (a)', en: 'Side (a)' }}] }
        ]
    },
    rectangle: {
        name: { az: 'Düzbucaqlı', en: 'Rectangle' },
        modes: [
            { id: 'ab', label: { az: 'Tərəflər verilir', en: 'Given sides' }, inputs: [{id:'a', label:{ az: 'Tərəf a', en: 'Side a' }}, {id:'b', label:{ az: 'Tərəf b', en: 'Side b' }}] }
        ]
    },
    triangle: {
        name: { az: 'Üçbucaq', en: 'Triangle' },
        modes: [
            { id: 'bh', label: { az: 'Əsas və hündürlük', en: 'Base & height' }, inputs: [{id:'base', label:{ az: 'Əsas (a)', en: 'Base (a)' }}, {id:'h', label:{ az: 'Hündürlük (h)', en: 'Height (h)' }}] },
            { id: 'heron', label: { az: '3 tərəf (Heron)', en: '3 sides (Heron)' }, inputs: [{id:'a', label:{ az: 'Tərəf a', en: 'Side a' }}, {id:'b', label:{ az: 'Tərəf b', en: 'Side b' }}, {id:'c', label:{ az: 'Tərəf c', en: 'Side c' }}] },
            { id: 'right', label: { az: 'Düzbucaqlı: 2 katet', en: 'Right: 2 legs' }, inputs: [{id:'a', label:{ az: 'Katet a', en: 'Leg a' }}, {id:'b', label:{ az: 'Katet b', en: 'Leg b' }}] },
            { id: 'right_hyp', label: { az: 'Düzbucaqlı: Katet və hipotenuz', en: 'Right: Leg & hypotenuse' }, inputs: [{id:'a', label:{ az: 'Katet (a)', en: 'Leg (a)' }}, {id:'c', label:{ az: 'Hipotenuz (c)', en: 'Hypotenuse (c)' }}] }
        ]
    },
    trapezoid: {
        name: { az: 'Trapesiya', en: 'Trapezoid' },
        modes: [
            { id: 'abh', label: { az: 'Əsaslar və hündürlük', en: 'Bases & height' }, inputs: [{id:'a', label:{ az: 'Üst əsas (a)', en: 'Top base (a)' }}, {id:'b', label:{ az: 'Alt əsas (b)', en: 'Bottom base (b)' }}, {id:'h', label:{ az: 'Hündürlük (h)', en: 'Height (h)' }}] }
        ]
    },
    cube: {
        name: { az: 'Kub', en: 'Cube' },
        modes: [
            { id: 'a', label: { az: 'Tərəf verilir', en: 'Given side' }, inputs: [{id:'a', label:{ az: 'Tərəf (a)', en: 'Side (a)' }}] }
        ]
    },
    cylinder: {
        name: { az: 'Silindr', en: 'Cylinder' },
        modes: [
            { id: 'rh', label: { az: 'Radius və hündürlük', en: 'Radius & height' }, inputs: [{id:'r', label:{ az: 'Radius (r)', en: 'Radius (r)' }}, {id:'h', label:{ az: 'Hündürlük (h)', en: 'Height (h)' }}] }
        ]
    },
    sphere: {
        name: { az: 'Kürə', en: 'Sphere' },
        modes: [
            { id: 'r', label: { az: 'Radius verilir', en: 'Given radius' }, inputs: [{id:'r', label:{ az: 'Radius (r)', en: 'Radius (r)' }}] }
        ]
    },
    cone: {
        name: { az: 'Konus', en: 'Cone' },
        modes: [
            { id: 'rh', label: { az: 'Radius və hündürlük', en: 'Radius & height' }, inputs: [{id:'r', label:{ az: 'Radius (r)', en: 'Radius (r)' }}, {id:'h', label:{ az: 'Hündürlük (h)', en: 'Height (h)' }}] }
        ]
    }
};

let currentShape = null;
let currentMode = null;

function initGeometry() {
    document.getElementById('shapeSelect').addEventListener('change', () => onShapeSelect(false));
}

function onShapeSelect(preserveResults = false) {
    const val = document.getElementById('shapeSelect').value;
    const modeDiv = document.getElementById('shapeInputMode');
    const inputsDiv = document.getElementById('shapeInputs');
    const calcBtn = document.getElementById('geoCalcBtn');
    const resultsDiv = document.getElementById('geoResults');

    if (!preserveResults) {
        resultsDiv.innerHTML = '';
    }

    if (!val || !shapes[val]) {
        modeDiv.style.display = 'none';
        inputsDiv.innerHTML = '';
        calcBtn.style.display = 'none';
        currentShape = null;
        updateGeometryDiagram();
        return;
    }

    currentShape = val;
    const shape = shapes[val];

    if (shape.modes.length > 1) {
        const modeLabel = window.I18n ? I18n.t('geoModeLabel', 'Hesablama üsulu:') : 'Hesablama üsulu:';
        modeDiv.style.display = 'block';
        modeDiv.innerHTML = `<label data-i18n="geoModeLabel">${escHtml(modeLabel)}</label>
            <select id="inputModeSelect" onchange="onInputModeChange()">
                ${shape.modes.map(m => `<option value="${m.id}">${escHtml(locLabel(m.label))}</option>`).join('')}
            </select>`;
        currentMode = shape.modes[0].id;
    } else {
        modeDiv.style.display = 'none';
        currentMode = shape.modes[0].id;
    }

    renderShapeInputs();
    calcBtn.style.display = 'inline-flex';
    updateGeometryDiagram();
}

function onInputModeChange() {
    currentMode = document.getElementById('inputModeSelect').value;
    renderShapeInputs();
    document.getElementById('geoResults').innerHTML = '';
    updateGeometryDiagram();
}

function renderShapeInputs() {
    const shape = shapes[currentShape];
    const mode = shape.modes.find(m => m.id === currentMode);
    if (!mode) return;

    const ph = window.I18n ? I18n.t('geoInputPlaceholder', isEnglish() ? 'Ex: 3, √3, 2√5, π/2' : 'Məs: 3, √3, 2√5, π/2') : 'Məs: 3, √3, 2√5, π/2';

    document.getElementById('shapeInputs').innerHTML = mode.inputs.map(inp =>
        `<div class="input-group">
            <label>${escHtml(locLabel(inp.label))}</label>
            <input type="text" inputmode="text" autocomplete="off" id="geo_${inp.id}" placeholder="${escHtml(ph)}">
        </div>`
    ).join('');

    // Attach focus and input listeners so quick-symbol bar targets active input and 2D diagram updates live
    document.querySelectorAll('#shapeInputs input').forEach(input => {
        input.addEventListener('focus', () => {
            lastFocusedInput = input;
        });
        input.addEventListener('input', () => {
            updateGeometryDiagram();
        });
    });
    updateGeometryDiagram();
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

    const lang = getActiveLang();
    const isEn = lang === 'en';

    mode.inputs.forEach(inp => {
        const el = document.getElementById('geo_' + inp.id);
        const rawVal = el ? el.value.trim() : '';
        const lbl = locLabel(inp.label);
        if (!rawVal) {
            valid = false;
            errorMsg = isEn ? 'Please fill in all fields.' : 'Zəhmət olmasa bütün xanaları doldurun.';
            return;
        }
        let v;
        try {
            v = (window.MathCore && typeof MathCore.evaluate === 'function')
                ? MathCore.evaluate(rawVal, { angleMode: 'DEG', lang })
                : parseFloat(rawVal);
        } catch (e) {
            valid = false;
            errorMsg = (isEn ? 'Error' : 'Xəta') + ' (' + lbl + '): ' + (e.message || (isEn ? 'Please enter a valid mathematical expression' : 'Düzgün riyazi ifadə daxil edin'));
            return;
        }
        if (isNaN(v) || !isFinite(v) || v <= 0) {
            valid = false;
            errorMsg = lbl + (isEn ? ' must be a positive number or valid expression (> 0).' : ' müsbət ədəd və ya düzgün riyazi ifadə olmalıdır (> 0).');
            return;
        }
        vals[inp.id] = v;
    });

    if (!valid) {
        showGeoResult(`<span class="error">${errorMsg || (isEn ? 'Side length must be a positive number or valid expression.' : 'Tərəfin uzunluğu müsbət ədəd və ya düzgün riyazi ifadə olmalıdır.')}</span>`);
        return;
    }

    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    let results = [];
    const π = Math.PI;

    switch (currentShape) {
        case 'circle': {
            const r = vals.r;
            results.push({ label: isEn ? 'Area' : 'Sahə', formula: 'S = π · r²', value: clean(π * r * r) });
            results.push({ label: isEn ? 'Circumference' : 'Çevrə', formula: 'C = 2 · π · r', value: clean(2 * π * r) });
            break;
        }
        case 'square': {
            const a = vals.a;
            results.push({ label: isEn ? 'Area' : 'Sahə', formula: 'S = a²', value: clean(a * a) });
            results.push({ label: isEn ? 'Perimeter' : 'Perimetr', formula: 'P = 4 · a', value: clean(4 * a) });
            results.push({ label: isEn ? 'Diagonal' : 'Diaqonal', formula: 'd = a · √2', value: clean(a * Math.sqrt(2)) });
            break;
        }
        case 'rectangle': {
            const a = vals.a, b = vals.b;
            results.push({ label: isEn ? 'Area' : 'Sahə', formula: 'S = a · b', value: clean(a * b) });
            results.push({ label: isEn ? 'Perimeter' : 'Perimetr', formula: 'P = 2 · (a + b)', value: clean(2 * (a + b)) });
            results.push({ label: isEn ? 'Diagonal' : 'Diaqonal', formula: 'd = √(a² + b²)', value: clean(Math.sqrt(a*a + b*b)) });
            break;
        }
        case 'triangle': {
            if (currentMode === 'bh') {
                const base = vals.base, h = vals.h;
                results.push({ label: isEn ? 'Area' : 'Sahə', formula: 'S = (a · h) / 2', value: clean((base * h) / 2) });
            } else if (currentMode === 'heron') {
                const a = vals.a, b = vals.b, c = vals.c;
                if (a + b <= c || a + c <= b || b + c <= a) {
                    showGeoResult('<span class="error">' + (isEn ? 'Cannot form a triangle with these sides (triangle inequality not satisfied).' : 'Bu tərəflərlə üçbucaq qurmaq mümkün deyil (üçbucaq bərabərsizliyi ödənmir).') + '</span>');
                    return;
                }
                const s = (a + b + c) / 2;
                const area = Math.sqrt(s * (s-a) * (s-b) * (s-c));
                results.push({ label: isEn ? 'Semiperimeter' : 'Yarımperimetr', formula: 's = (a + b + c) / 2', value: clean(s) });
                results.push({ label: isEn ? 'Area' : 'Sahə', formula: 'S = √(s·(s−a)·(s−b)·(s−c))', value: clean(area) });
                results.push({ label: isEn ? 'Perimeter' : 'Perimetr', formula: 'P = a + b + c', value: clean(a + b + c) });
            } else if (currentMode === 'right') {
                const a = vals.a, b = vals.b;
                const hyp = Math.sqrt(a*a + b*b);
                results.push({ label: isEn ? 'Area' : 'Sahə', formula: 'S = (a · b) / 2', value: clean((a * b) / 2) });
                results.push({ label: isEn ? 'Hypotenuse' : 'Hipotenuz', formula: 'c = √(a² + b²)', value: clean(hyp) });
                results.push({ label: isEn ? 'Perimeter' : 'Perimetr', formula: 'P = a + b + c', value: clean(a + b + hyp) });
            } else if (currentMode === 'right_hyp') {
                const a = vals.a, c = vals.c;
                if (a >= c) {
                    showGeoResult('<span class="error">' + (isEn ? 'Error: Hypotenuse must be greater than leg (c > a)' : 'Xəta: Hipotenuz katetdən böyük olmalıdır (c > a)') + '</span>');
                    return;
                }
                const b = clean(Math.sqrt(c * c - a * a));
                const area = clean((a * b) / 2);
                const p = clean(a + b + c);
                const alpha = clean(Math.asin(a / c) * 180 / Math.PI);
                const beta = clean(90 - alpha);

                results.push({ label: isEn ? 'Unknown leg (b)' : 'Məchul katet (b)', formula: 'b = √(c² − a²)', value: b });
                results.push({ label: isEn ? 'Perimeter' : 'Perimetr', formula: 'P = a + b + c', value: p });
                results.push({ label: isEn ? 'Area' : 'Sahə', formula: 'S = (a · b) / 2', value: area });
                results.push({ label: isEn ? 'Angle α (opposite a)' : 'Bucaq α (katet a qarşısı)', formula: 'α = arcsin(a / c)', value: alpha, unit: '°' });
                results.push({ label: isEn ? 'Angle β (opposite b)' : 'Bucaq β (katet b qarşısı)', formula: 'β = 90° − α', value: beta, unit: '°' });
            }
            break;
        }
        case 'trapezoid': {
            const a = vals.a, b = vals.b, h = vals.h;
            results.push({ label: isEn ? 'Area' : 'Sahə', formula: 'S = ((a + b) · h) / 2', value: clean(((a + b) * h) / 2) });
            break;
        }
        case 'cube': {
            const a = vals.a;
            results.push({ label: isEn ? 'Volume' : 'Həcm', formula: 'V = a³', value: clean(a * a * a) });
            results.push({ label: isEn ? 'Total Surface Area' : 'Tam səthi', formula: 'S = 6 · a²', value: clean(6 * a * a) });
            results.push({ label: isEn ? 'Face Diagonal' : 'Üz diaqonalı', formula: 'd_f = a · √2', value: clean(a * Math.sqrt(2)) });
            results.push({ label: isEn ? 'Space Diagonal' : 'Fəza diaqonalı', formula: 'd = a · √3', value: clean(a * Math.sqrt(3)) });
            break;
        }
        case 'cylinder': {
            const r = vals.r, h = vals.h;
            results.push({ label: isEn ? 'Volume' : 'Həcm', formula: 'V = π · r² · h', value: clean(π * r * r * h) });
            results.push({ label: isEn ? 'Lateral Surface Area' : 'Yan səthi', formula: 'S_lat = 2 · π · r · h', value: clean(2 * π * r * h) });
            results.push({ label: isEn ? 'Total Surface Area' : 'Tam səthi', formula: 'S = 2 · π · r · (r + h)', value: clean(2 * π * r * (r + h)) });
            break;
        }
        case 'sphere': {
            const r = vals.r;
            results.push({ label: isEn ? 'Volume' : 'Həcm', formula: 'V = (4/3) · π · r³', value: clean((4/3) * π * r * r * r) });
            results.push({ label: isEn ? 'Surface Area' : 'Səthi', formula: 'S = 4 · π · r²', value: clean(4 * π * r * r) });
            break;
        }
        case 'cone': {
            const r = vals.r, h = vals.h;
            const l = Math.sqrt(r*r + h*h);
            results.push({ label: isEn ? 'Volume' : 'Həcm', formula: 'V = (1/3) · π · r² · h', value: clean((1/3) * π * r * r * h) });
            results.push({ label: isEn ? 'Slant Height' : 'Çəpər hündürlük', formula: 'l = √(r² + h²)', value: clean(l) });
            results.push({ label: isEn ? 'Lateral Surface Area' : 'Yan səthi', formula: 'S_lat = π · r · l', value: clean(π * r * l) });
            results.push({ label: isEn ? 'Total Surface Area' : 'Tam səthi', formula: 'S = π · r · (r + l)', value: clean(π * r * (r + l)) });
            break;
        }
    }

    const html = results.map(r =>
        `<div><span class="label">${r.label}:</span> <span class="value">${formatNumber(r.value)}${r.unit || ''}</span></div>
         <span class="formula">${r.formula}</span>`
    ).join('');

    showGeoResult(html);
    updateGeometryDiagram();
    addToHistory(isEn ? 'Geometry' : 'Həndəsə', `${locLabel(shape.name)} (${locLabel(mode.label)})`, results.map(r => `${r.label} = ${formatNumber(r.value)}`).join(', '));
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
    const isEn = isEnglish();

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        out.innerHTML = `<span class="error">${isEn ? 'Please enter values for a, b, and c.' : 'Zəhmət olmasa a, b, c qiymətlərini daxil edin.'}</span>`;
        return;
    }
    if (a === 0) {
        out.innerHTML = `<span class="error">${isEn ? 'a ≠ 0 is required (otherwise this is a linear equation).' : 'a ≠ 0 olmalıdır (əks halda bu xətti tənlikdir).'}</span>`;
        return;
    }

    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    const D = clean(b * b - 4 * a * c);
    let html = `<span class="formula">D = b² − 4ac = ${b}² − 4·${a}·${c} = ${formatNumber(D)}</span>`;
    const histBadge = isEn ? 'Algebra' : 'Cəbr';

    if (D > 0) {
        const x1 = clean((-b + Math.sqrt(D)) / (2 * a));
        const x2 = clean((-b - Math.sqrt(D)) / (2 * a));
        html += `<div>${isEn ? 'D &gt; 0 → two distinct real roots:' : 'D &gt; 0 → iki fərqli həqiqi kök var:'}</div>`;
        html += `<span class="formula">x₁ = (−b + √D) / 2a = ${formatNumber(x1)}</span>`;
        html += `<span class="formula">x₂ = (−b − √D) / 2a = ${formatNumber(x2)}</span>`;
        addToHistory(histBadge, `${a}x²+${b}x+${c}=0`, `x₁=${formatNumber(x1)}, x₂=${formatNumber(x2)}`);
    } else if (D === 0) {
        const x = clean(-b / (2 * a));
        html += `<div>${isEn ? 'D = 0 → one repeated root:' : 'D = 0 → bir kök (qoşa kök):'}</div>`;
        html += `<span class="formula">x = −b / 2a = ${formatNumber(x)}</span>`;
        addToHistory(histBadge, `${a}x²+${b}x+${c}=0`, `x=${formatNumber(x)}`);
    } else {
        const real = clean(-b / (2 * a));
        const imag = clean(Math.sqrt(-D) / (2 * a));
        html += `<div>${isEn ? 'D &lt; 0 → complex roots:' : 'D &lt; 0 → kompleks köklər:'}</div>`;
        html += `<span class="formula">x₁ = ${formatNumber(real)} + ${formatNumber(imag)}i</span>`;
        html += `<span class="formula">x₂ = ${formatNumber(real)} − ${formatNumber(imag)}i</span>`;
        addToHistory(histBadge, `${a}x²+${b}x+${c}=0`, `${formatNumber(real)}±${formatNumber(imag)}i`);
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
    const isEn = isEnglish();

    if ([a1,b1,c1,a2,b2,c2].some(isNaN)) {
        out.innerHTML = `<span class="error">${isEn ? 'Please enter all coefficients.' : 'Bütün əmsalları daxil edin.'}</span>`;
        return;
    }

    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    const D = clean(a1*b2 - a2*b1);
    const Dx = clean(c1*b2 - c2*b1);
    const Dy = clean(a1*c2 - a2*c1);

    let html = `<span class="formula">D = a₁·b₂ − a₂·b₁ = ${formatNumber(D)}</span>`;

    if (Math.abs(D) < 1e-12) {
        html += `<div class="error">${isEn ? 'D = 0: The system has no unique solution (infinitely many or none).' : 'D = 0: Sistemin yeganə həlli yoxdur (sonsuz sayda həll və ya həll yoxdur).'}</div>`;
    } else {
        const x = clean(Dx / D);
        const y = clean(Dy / D);
        html += `<span class="formula">Dx = c₁·b₂ − c₂·b₁ = ${formatNumber(Dx)}</span>`;
        html += `<span class="formula">Dy = a₁·c₂ − a₂·c₁ = ${formatNumber(Dy)}</span>`;
        html += `<div><span class="label">x = </span><span class="value">${formatNumber(x)}</span></div>`;
        html += `<div><span class="label">y = </span><span class="value">${formatNumber(y)}</span></div>`;
        addToHistory(isEn ? 'Algebra' : 'Cəbr', isEn ? '2-var system' : '2 məchullu sistem', `x=${formatNumber(x)}, y=${formatNumber(y)}`);
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
    const isEn = isEnglish();

    if ([...a.flat(), ...d].some(isNaN)) {
        out.innerHTML = `<span class="error">${isEn ? 'Please enter all coefficients.' : 'Bütün əmsalları daxil edin.'}</span>`;
        return;
    }

    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : n => n;
    const D = det3(a);
    let html = `<span class="formula">D = ${formatNumber(D)}</span>`;

    if (Math.abs(D) < 1e-12) {
        html += `<div class="error">${isEn ? 'D = 0: The system has no unique solution.' : 'D = 0: Sistemin yeganə həlli yoxdur.'}</div>`;
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
        addToHistory(isEn ? 'Algebra' : 'Cəbr', isEn ? '3-var system' : '3 məchullu sistem', `x=${formatNumber(x)}, y=${formatNumber(y)}, z=${formatNumber(z)}`);
    }
    out.innerHTML = html;
}

/* ---------- Percentage ---------- */
function initPercentage() {
    updatePctInputs();
}

function updatePctInputs() {
    const typeEl = document.getElementById('pctType');
    const div = document.getElementById('pctInputs');
    if (!typeEl || !div) return;
    const type = typeEl.value;
    document.getElementById('percentResult').innerHTML = '';
    const isEn = isEnglish();

    const configs = {
        findPercent:  [{id:'pctVal', label: isEn ? 'Number' : 'Ədəd'}, {id:'pctPct', label: isEn ? 'Percent (%)' : 'Faiz (%)'}],
        whatPercent:  [{id:'pctPart', label: isEn ? 'Part' : 'Hissə'}, {id:'pctWhole', label: isEn ? 'Whole' : 'Tam'}],
        findWhole:    [{id:'pctPart', label: isEn ? 'Part (X)' : 'Hissə (X)'}, {id:'pctPct', label: isEn ? 'Percent (%)' : 'Faiz (%)'}],
        increase:     [{id:'pctVal', label: isEn ? 'Number' : 'Ədəd'}, {id:'pctPct', label: isEn ? 'Percent (%)' : 'Faiz (%)'}],
        decrease:     [{id:'pctVal', label: isEn ? 'Number' : 'Ədəd'}, {id:'pctPct', label: isEn ? 'Percent (%)' : 'Faiz (%)'}]
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
    const isEn = isEnglish();

    let result, formula, label;

    switch(type) {
        case 'findPercent': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = `<span class="error">${isEn ? 'Please enter values.' : 'Qiymətləri daxil edin.'}</span>`; return; }
            result = clean(val * pct / 100);
            formula = `${val} × ${pct}% = ${val} × ${pct}/100`;
            label = isEn ? `${pct}% of ${val}` : `${val}-in ${pct}%-i`;
            break;
        }
        case 'whatPercent': {
            const part = g('pctPart'), whole = g('pctWhole');
            if (isNaN(part) || isNaN(whole) || whole === 0) { out.innerHTML = `<span class="error">${isEn ? 'Please enter values (whole ≠ 0).' : 'Qiymətləri daxil edin (tam ≠ 0).'}</span>`; return; }
            result = clean((part / whole) * 100);
            formula = `(${part} / ${whole}) × 100`;
            label = isEn ? 'Percentage ratio' : 'Faiz nisbəti';
            break;
        }
        case 'findWhole': {
            const part = g('pctPart'), pct = g('pctPct');
            if (isNaN(part) || isNaN(pct) || pct === 0) { out.innerHTML = `<span class="error">${isEn ? 'Please enter values (percent ≠ 0).' : 'Qiymətləri daxil edin (faiz ≠ 0).'}</span>`; return; }
            result = clean(part * 100 / pct);
            formula = `${part} × 100 / ${pct}`;
            label = isEn ? 'Whole number' : 'Tam ədəd';
            break;
        }
        case 'increase': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = `<span class="error">${isEn ? 'Please enter values.' : 'Qiymətləri daxil edin.'}</span>`; return; }
            result = clean(val * (1 + pct / 100));
            formula = `${val} × (1 + ${pct}/100)`;
            label = isEn ? `Increased by ${pct}%` : `${pct}% artımla`;
            break;
        }
        case 'decrease': {
            const val = g('pctVal'), pct = g('pctPct');
            if (isNaN(val) || isNaN(pct)) { out.innerHTML = `<span class="error">${isEn ? 'Please enter values.' : 'Qiymətləri daxil edin.'}</span>`; return; }
            result = clean(val * (1 - pct / 100));
            formula = `${val} × (1 − ${pct}/100)`;
            label = isEn ? `Decreased by ${pct}%` : `${pct}% azalma ilə`;
            break;
        }
    }

    out.innerHTML = `<div><span class="label">${label}:</span> <span class="value">${formatNumber(result)}</span></div>
                     <span class="formula">${formula} = ${formatNumber(result)}</span>`;
    addToHistory(isEn ? 'Algebra' : 'Cəbr', label, formatNumber(result));
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
    const isEn = isEnglish();

    if (isNaN(a1) || isNaN(d) || isNaN(n) || n < 1) {
        out.innerHTML = `<span class="error">${isEn ? 'Please enter valid values (n ≥ 1).' : 'Zəhmət olmasa düzgün qiymətlər daxil edin (n ≥ 1).'}</span>`;
        return;
    }

    let html = '';
    const seqPrefix = isEn ? 'Sequence:' : 'Silsilə:';
    const histBadge = isEn ? 'Algebra' : 'Cəbr';
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
        html += `<div style="margin-top:.5rem;color:var(--text-sec)">${seqPrefix} ${terms.join(', ')}</div>`;
        addToHistory(histBadge, `${isEn ? 'Arithmetic' : 'Ədədi'}: a₁=${a1}, d=${d}, n=${n}`, `aₙ=${formatNumber(an)}, Sₙ=${formatNumber(Sn)}`);
    } else {
        if (d === 0) { out.innerHTML = `<span class="error">${isEn ? 'q ≠ 0 is required.' : 'q ≠ 0 olmalıdır.'}</span>`; return; }
        const an = clean(a1 * Math.pow(d, n - 1));
        const Sn = clean(d === 1 ? a1 * n : a1 * (Math.pow(d, n) - 1) / (d - 1));
        html += `<span class="formula">aₙ = a₁ · qⁿ⁻¹ = ${a1} · ${d}^${n-1} = ${formatNumber(an)}</span>`;
        html += `<span class="formula">Sₙ = a₁·(qⁿ − 1)/(q − 1) = ${formatNumber(Sn)}</span>`;
        html += `<div><span class="label">aₙ = </span><span class="value">${formatNumber(an)}</span></div>`;
        html += `<div><span class="label">Sₙ = </span><span class="value">${formatNumber(Sn)}</span></div>`;

        const terms = [];
        for (let i = 0; i < Math.min(n, 8); i++) terms.push(formatNumber(clean(a1 * Math.pow(d, i))));
        if (n > 8) terms.push('...');
        html += `<div style="margin-top:.5rem;color:var(--text-sec)">${seqPrefix} ${terms.join(', ')}</div>`;
        addToHistory(histBadge, `${isEn ? 'Geometric' : 'Həndəsi'}: a₁=${a1}, q=${d}, n=${n}`, `aₙ=${formatNumber(an)}, Sₙ=${formatNumber(Sn)}`);
    }
    out.innerHTML = html;
}

/* ==========================================================
   7. ANALYSIS — Derivative, Integral, Graph
   ========================================================== */
function calcDerivative() {
    const expr = document.getElementById('derivFunc').value.trim();
    const out = document.getElementById('derivativeResult');
    const isEn = isEnglish();

    if (!expr) { out.innerHTML = `<span class="error">${isEn ? 'Please enter a function.' : 'Funksiya daxil edin.'}</span>`; return; }

    try {
        let simplified;
        if (window.MathCore && typeof MathCore.derivative === 'function') {
            simplified = MathCore.derivative(expr, 'x');
        } else if (typeof math !== 'undefined' && math.derivative) {
            simplified = math.derivative(expr, 'x').toString();
        } else {
            throw new Error(isEn ? 'Derivative engine not found' : 'Törəmə mühərriki tapılmadı');
        }

        out.innerHTML = `<div><span class="label">f(x) = </span>${escHtml(expr)}</div>
                         <div><span class="label">f′(x) = </span><span class="value">${escHtml(simplified)}</span></div>
                         <span class="formula">d/dx [${expr}] = ${escHtml(simplified)}</span>`;
        addToHistory(isEn ? 'Calculus' : 'Analiz', `d/dx [${expr}]`, simplified);
    } catch (err) {
        out.innerHTML = `<span class="error">${isEn ? 'Error' : 'Xəta'}: ${escHtml(err.message)}</span>`;
    }
}

/* ---------- Integral (Simpson's Rule) ---------- */
function calcIntegral() {
    const expr = document.getElementById('intFunc').value.trim();
    const a = parseFloat(document.getElementById('intA').value);
    const b = parseFloat(document.getElementById('intB').value);
    const out = document.getElementById('integralResult');
    const isEn = isEnglish();

    if (!expr) { out.innerHTML = `<span class="error">${isEn ? 'Please enter a function.' : 'Funksiya daxil edin.'}</span>`; return; }
    if (isNaN(a) || isNaN(b)) { out.innerHTML = `<span class="error">${isEn ? 'Please enter integration limits.' : 'Hədləri daxil edin.'}</span>`; return; }

    try {
        let result;
        if (window.MathCore && typeof MathCore.definiteIntegral === 'function') {
            result = MathCore.definiteIntegral(expr, a, b, 1000);
        } else {
            throw new Error(isEn ? 'Integral engine not found' : 'İnteqral mühərriki tapılmadı');
        }

        out.innerHTML = `<div><span class="label">∫ f(x) dx = </span><span class="value">${formatNumber(result)}</span></div>
                         <span class="formula">∫[${a}, ${b}] (${expr}) dx ≈ ${formatNumber(result)}</span>
                         <div style="color:var(--text-muted);font-size:.82rem;margin-top:.4rem">${isEn ? "Via Simpson's rule (n=1000)" : 'Simpson qaydası ilə (n=1000)'}</div>`;
        addToHistory(isEn ? 'Calculus' : 'Analiz', `∫[${a},${b}] ${expr} dx`, formatNumber(result));
    } catch (err) {
        out.innerHTML = `<span class="error">${isEn ? 'Error' : 'Xəta'}: ${escHtml(err.message)}</span>`;
    }
}

/* ---------- Graph ---------- */
function plotFunction(customExpr, skipHistory = false) {
    const exprInput = document.getElementById('graphFunc');
    const expr = (typeof customExpr === 'string' && customExpr.trim()) ? customExpr.trim() : (exprInput ? exprInput.value.trim() : '');
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

    if (!skipHistory) {
        addToHistory(isEnglish() ? 'Calculus' : 'Analiz', `y = ${expr}`, `[${xMin}, ${xMax}]`);
    }
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
    const isEn = isEnglish();

    if (!raw) { out.innerHTML = `<span class="error">${isEn ? 'Please enter numbers.' : 'Ədədlər daxil edin.'}</span>`; return; }

    const data = raw.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n));
    if (data.length === 0) { out.innerHTML = `<span class="error">${isEn ? 'No valid numbers found.' : 'Düzgün ədədlər tapılmadı.'}</span>`; return; }

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
    const modeStr = maxFreq === 1
        ? (isEn ? 'none (all values are unique)' : 'yoxdur (bütün ədədlər fərqlidir)')
        : modes.join(', ');

    // Variance & Std deviation
    const variance = clean(data.reduce((s, v) => s + (v - mean) ** 2, 0) / n);
    const stdDev = clean(Math.sqrt(variance));
    const range = clean(sorted[n-1] - sorted[0]);

    let html = `
        <div><span class="label">${isEn ? 'Count (n):' : 'Ədəd sayı (n):'}</span> <span class="value">${n}</span></div>
        <div><span class="label">${isEn ? 'Sum:' : 'Cəmi:'}</span> <span class="value">${formatNumber(sum)}</span></div>
        <div><span class="label">${isEn ? 'Mean (x̄):' : 'Ədədi orta (x̄):'}</span> <span class="value">${formatNumber(mean)}</span></div>
        <span class="formula">x̄ = Σxᵢ / n = ${formatNumber(sum)} / ${n} = ${formatNumber(mean)}</span>
        <div><span class="label">${isEn ? 'Median:' : 'Median:'}</span> <span class="value">${formatNumber(median)}</span></div>
        <div><span class="label">${isEn ? 'Mode:' : 'Moda:'}</span> <span class="value">${modeStr}</span></div>
        <div><span class="label">${isEn ? 'Range:' : 'Yayılma (Range):'}</span> <span class="value">${formatNumber(range)}</span></div>
        <div><span class="label">${isEn ? 'Variance (σ²):' : 'Dispersiya (σ²):'}</span> <span class="value">${formatNumber(variance)}</span></div>
        <div><span class="label">${isEn ? 'Standard Deviation (σ):' : 'Standart kənarlaşma (σ):'}</span> <span class="value">${formatNumber(stdDev)}</span></div>
        <span class="formula">σ = √(Σ(xᵢ − x̄)² / n) = ${formatNumber(stdDev)}</span>
    `;
    out.innerHTML = html;
    updateStatisticsChart(data, { n, sum, mean, median, modes, variance, stdDev, range });
    addToHistory(isEn ? 'Statistics' : 'Statistika', `n=${n}`, `x̄=${formatNumber(mean)}, σ=${formatNumber(stdDev)}`);
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
    const isEn = isEnglish();

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
        out.innerHTML = `<span class="error">${isEn ? 'n and r must be non-negative integers.' : 'n və r müsbət tam ədəd olmalıdır.'}</span>`; return;
    }
    if (r > n) {
        out.innerHTML = `<span class="error">${isEn ? 'r ≤ n is required.' : 'r ≤ n olmalıdır.'}</span>`; return;
    }

    const result = clean(factorial(n) / factorial(n - r));
    out.innerHTML = `<div><span class="label">P(${n}, ${r}) = </span><span class="value">${formatNumber(result)}</span></div>
                     <span class="formula">P(n, r) = n! / (n−r)! = ${n}! / ${n-r}! = ${formatNumber(result)}</span>`;
    addToHistory(isEn ? 'Statistics' : 'Statistika', `P(${n},${r})`, formatNumber(result));
}

function calcCombination() {
    const n = parseInt(document.getElementById('probN').value);
    const r = parseInt(document.getElementById('probR').value);
    const out = document.getElementById('probResult');
    const clean = (window.MathCore && MathCore.cleanPrecision) ? MathCore.cleanPrecision : val => val;
    const isEn = isEnglish();

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
        out.innerHTML = `<span class="error">${isEn ? 'n and r must be non-negative integers.' : 'n və r müsbət tam ədəd olmalıdır.'}</span>`; return;
    }
    if (r > n) {
        out.innerHTML = `<span class="error">${isEn ? 'r ≤ n is required.' : 'r ≤ n olmalıdır.'}</span>`; return;
    }

    const result = clean(factorial(n) / (factorial(r) * factorial(n - r)));
    out.innerHTML = `<div><span class="label">C(${n}, ${r}) = </span><span class="value">${formatNumber(result)}</span></div>
                     <span class="formula">C(n, r) = n! / (r! · (n−r)!) = ${n}! / (${r}! · ${n-r}!) = ${formatNumber(result)}</span>`;
    addToHistory(isEn ? 'Statistics' : 'Statistika', `C(${n},${r})`, formatNumber(result));
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
    const isEn = isEnglish();
    const histBadge = isEn ? 'Matrix' : 'Matris';
    const resWord = isEn ? 'result' : 'nəticə';

    let html = '';

    if (op === 'detA') {
        const d = clean(size === 2 ? det2(A) : det3(A));
        html = `<div><span class="label">|A| = </span><span class="value">${formatNumber(d)}</span></div>`;
        if (size === 2) {
            html += `<span class="formula">|A| = a₁₁·a₂₂ − a₁₂·a₂₁ = ${A[0][0]}·${A[1][1]} − ${A[0][1]}·${A[1][0]}</span>`;
        }
        addToHistory(histBadge, `det ${size}×${size}`, formatNumber(d));
    } else {
        const B = getMatrix('matrixB', size);
        let result;

        if (op === 'add') {
            result = matAdd(A, B, size);
            html = `<div><span class="label">A + B =</span></div><pre style="color:var(--text);margin:.4rem 0">${matToStr(result)}</pre>`;
            addToHistory(histBadge, `${size}×${size} ${isEn ? 'addition' : 'toplama'}`, resWord);
        } else if (op === 'subtract') {
            result = matSubtract(A, B, size);
            html = `<div><span class="label">A − B =</span></div><pre style="color:var(--text);margin:.4rem 0">${matToStr(result)}</pre>`;
            addToHistory(histBadge, `${size}×${size} ${isEn ? 'subtraction' : 'çıxma'}`, resWord);
        } else if (op === 'multiply') {
            result = matMultiply(A, B, size);
            html = `<div><span class="label">A × B =</span></div><pre style="color:var(--text);margin:.4rem 0">${matToStr(result)}</pre>`;
            addToHistory(histBadge, `${size}×${size} ${isEn ? 'multiplication' : 'vurma'}`, resWord);
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

/* ==========================================================
   10. NUMBER THEORY & COMBINATORICS (v3.1.0)
   ========================================================== */
function toSuperscriptNum(n) {
    const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return String(n).split('').map(c => map[c] || c).join('');
}

function formatPrimeFactorization(n) {
    if (n === 1) return '1 = 1';
    const factors = (window.MathCore && MathCore.primeFactorize) ? MathCore.primeFactorize(n) : [];
    if (!factors.length) return `${n} = ${n}`;
    const rhs = factors.map(f => f.power > 1 ? `${f.prime}${toSuperscriptNum(f.power)}` : `${f.prime}`).join(' × ');
    return `${n} = ${rhs}`;
}

function calcGcdLcm() {
    const raw = document.getElementById('gcdLcmInput').value.trim();
    const out = document.getElementById('gcdLcmResult');
    const isEn = isEnglish();

    if (!raw) {
        out.innerHTML = `<span class="error">${isEn ? 'Please enter 2 or more positive integers.' : 'Zəhmət olmasa 2 və ya daha çox müsbət tam ədəd daxil edin.'}</span>`;
        return;
    }

    const parts = raw.split(',').map(s => s.trim()).filter(s => s !== '');
    if (parts.length < 2) {
        out.innerHTML = `<span class="error">${isEn ? 'Please enter at least 2 comma-separated positive integers.' : 'Vergüllə ayrılmış ən azı 2 müsbət tam ədəd daxil edin.'}</span>`;
        return;
    }

    const nums = [];
    for (const p of parts) {
        if (!/^\d+$/.test(p)) {
            out.innerHTML = `<span class="error">${isEn ? 'All values must be positive integers.' : 'Bütün qiymətlər müsbət tam ədəd olmalıdır.'}</span>`;
            return;
        }
        const val = parseInt(p, 10);
        if (val <= 0) {
            out.innerHTML = `<span class="error">${isEn ? 'All integers must be greater than 0.' : 'Bütün tam ədədlər 0-dan böyük olmalıdır.'}</span>`;
            return;
        }
        nums.push(val);
    }

    const gcdVal = MathCore.gcdMulti(nums);
    const lcmVal = MathCore.lcmMulti(nums);
    const gcdLabel = isEn ? 'GCD' : 'ƏBOB';
    const lcmLabel = isEn ? 'LCM' : 'ƏKOB';
    const primeLabel = isEn ? 'Prime Factorization:' : 'Sadə vuruqlara ayırma:';
    const factorLines = nums.map(n => `<div class="formula">${formatPrimeFactorization(n)}</div>`).join('');

    out.innerHTML = `
        <div><span class="label">${gcdLabel}(${nums.join(', ')}) = </span><span class="value">${formatNumber(gcdVal)}</span></div>
        <div><span class="label">${lcmLabel}(${nums.join(', ')}) = </span><span class="value">${formatNumber(lcmVal)}</span></div>
        <div class="mt-2"><span class="label">${primeLabel}</span></div>
        ${factorLines}
    `;

    addToHistory(
        isEn ? 'Statistics' : 'Statistika',
        `${gcdLabel}/${lcmLabel}(${nums.join(', ')})`,
        `${gcdLabel}=${formatNumber(gcdVal)}, ${lcmLabel}=${formatNumber(lcmVal)}`
    );
}

function readNtCombInputs(requireK) {
    const nRaw = document.getElementById('ntCombN').value.trim();
    const kRaw = document.getElementById('ntCombK').value.trim();
    const isEn = isEnglish();

    if (!/^\d+$/.test(nRaw)) {
        return { error: isEn ? 'n must be a non-negative integer.' : 'n mənfi olmayan tam ədəd olmalıdır.' };
    }
    const n = parseInt(nRaw, 10);
    if (!requireK) {
        if (n > 170) return { error: isEn ? 'n must be ≤ 170 to avoid overflow.' : 'Daşmanın qarşısını almaq üçün n ≤ 170 olmalıdır.' };
        return { n, k: 0 };
    }

    if (!/^\d+$/.test(kRaw)) {
        return { error: isEn ? 'n and k must be non-negative integers.' : 'n və k mənfi olmayan tam ədəd olmalıdır.' };
    }
    const k = parseInt(kRaw, 10);
    if (k < 0 || k > n) {
        return { error: isEn ? '0 ≤ k ≤ n is required.' : '0 ≤ k ≤ n şərti ödənilməlidir.' };
    }
    if (n > 170) {
        return { error: isEn ? 'n must be ≤ 170 to avoid overflow.' : 'Daşmanın qarşısını almaq üçün n ≤ 170 olmalıdır.' };
    }
    return { n, k };
}

function calcFullPermutation() {
    const out = document.getElementById('ntCombResult');
    const isEn = isEnglish();
    const parsed = readNtCombInputs(false);
    if (parsed.error) {
        out.innerHTML = `<span class="error">${parsed.error}</span>`;
        return;
    }
    const { n } = parsed;
    const res = MathCore.permutation(n);
    out.innerHTML = `
        <div><span class="label">${isEn ? 'Permutation' : 'Permutasiya'} P(${n}) = </span><span class="value">${formatNumber(res)}</span></div>
        <span class="formula">Pₙ = n! = ${n}! = ${formatNumber(res)}</span>
    `;
    addToHistory(isEn ? 'Statistics' : 'Statistika', `P(${n})`, formatNumber(res));
}

function calcArrangement() {
    const out = document.getElementById('ntCombResult');
    const isEn = isEnglish();
    const parsed = readNtCombInputs(true);
    if (parsed.error) {
        out.innerHTML = `<span class="error">${parsed.error}</span>`;
        return;
    }
    const { n, k } = parsed;
    const res = MathCore.arrangement(n, k);
    out.innerHTML = `
        <div><span class="label">${isEn ? 'Arrangement' : 'Aranjeman'} A(${n}, ${k}) = </span><span class="value">${formatNumber(res)}</span></div>
        <span class="formula">Aₙᵏ = n! / (n − k)! = ${n}! / ${n - k}! = ${formatNumber(res)}</span>
    `;
    addToHistory(isEn ? 'Statistics' : 'Statistika', `A(${n},${k})`, formatNumber(res));
}

function calcFullCombination() {
    const out = document.getElementById('ntCombResult');
    const isEn = isEnglish();
    const parsed = readNtCombInputs(true);
    if (parsed.error) {
        out.innerHTML = `<span class="error">${parsed.error}</span>`;
        return;
    }
    const { n, k } = parsed;
    const res = MathCore.combination(n, k);
    out.innerHTML = `
        <div><span class="label">${isEn ? 'Combination' : 'Kombinezon'} C(${n}, ${k}) = </span><span class="value">${formatNumber(res)}</span></div>
        <span class="formula">Cₙᵏ = n! / (k!(n − k)!) = ${n}! / (${k}! · ${n - k}!) = ${formatNumber(res)}</span>
    `;
    addToHistory(isEn ? 'Statistics' : 'Statistika', `C(${n},${k})`, formatNumber(res));
}
