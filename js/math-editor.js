/**
 * VisualMathEditor — Structured WYSIWYG Math Editor for Math Engine AZ (v3.0.0)
 * Slot-based AST renderer for stacked fractions, mixed numbers, exponents, and radicals.
 * Supports bidirectional slot navigation (← / →), atomic function deletion,
 * and clean algebraic serialization to MathCore.
 * Zero external dependencies.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.VisualMathEditor = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const ATOMIC_FUNCTIONS = [
        'log10(', 'asin(', 'acos(', 'atan(', 'sqrt(', 'cbrt(',
        'sin(', 'cos(', 'tan(', 'cot(', 'abs(', 'exp(',
        'ln(', 'log('
    ];

    let idCounter = 1;
    function nextId(prefix = 'node') {
        return `${prefix}_${idCounter++}`;
    }

    /**
     * Create a slot object
     */
    function createSlot(id, parentNode = null, slotType = 'text') {
        return {
            id,
            parentNode,
            slotType,
            items: [] // array of strings or child node objects
        };
    }

    /**
     * Create an editor instance
     */
    function createEditor() {
        const rootSlot = createSlot('root', null, 'root');
        let slotsMap = { 'root': rootSlot };
        let activeSlotId = 'root';
        let containerElement = null;
        let changeCallback = null;

        function getActiveSlot() {
            return slotsMap[activeSlotId] || rootSlot;
        }

        function setChangeCallback(cb) {
            changeCallback = cb;
        }

        function notifyChange() {
            if (typeof changeCallback === 'function') {
                changeCallback(serialize(), renderHtml());
            }
        }

        /**
         * Rebuild linear order of slots for arrow navigation
         */
        function getLinearSlots(slot = rootSlot, list = []) {
            list.push(slot.id);
            for (const item of slot.items) {
                if (typeof item === 'object' && item !== null) {
                    if (item.type === 'mixed') {
                        if (item.whole) getLinearSlots(item.whole, list);
                        if (item.num) getLinearSlots(item.num, list);
                        if (item.den) getLinearSlots(item.den, list);
                    } else if (item.type === 'frac') {
                        if (item.num) getLinearSlots(item.num, list);
                        if (item.den) getLinearSlots(item.den, list);
                    } else if (item.type === 'pow') {
                        if (item.exp) getLinearSlots(item.exp, list);
                    } else if (item.type === 'sqrt') {
                        if (item.radicand) getLinearSlots(item.radicand, list);
                    }
                }
            }
            return list;
        }

        /**
         * Navigation: Left (←)
         */
        function navigateLeft() {
            const linear = getLinearSlots();
            const idx = linear.indexOf(activeSlotId);
            if (idx > 0) {
                activeSlotId = linear[idx - 1];
                render();
                return true;
            }
            return false;
        }

        /**
         * Navigation: Right (→)
         */
        function navigateRight() {
            const linear = getLinearSlots();
            const idx = linear.indexOf(activeSlotId);
            if (idx >= 0 && idx < linear.length - 1) {
                activeSlotId = linear[idx + 1];
                render();
                return true;
            }
            return false;
        }

        /**
         * Set active slot directly
         */
        function setActiveSlot(slotId) {
            if (slotsMap[slotId]) {
                activeSlotId = slotId;
                render();
                return true;
            }
            return false;
        }

        /**
         * Insert string token into current active slot
         */
        function insertToken(token) {
            const slot = getActiveSlot();
            const items = slot.items;
            const last = items[items.length - 1];

            // If last item is a string, append to it (unless token is an operator with space)
            if (typeof last === 'string') {
                items[items.length - 1] = last + token;
            } else {
                items.push(token);
            }
            render();
            notifyChange();
        }

        /**
         * Insert Stacked Fraction (□/□)
         */
        function insertFraction() {
            const slot = getActiveSlot();
            const fracId = nextId('frac');
            const numSlot = createSlot(`${fracId}_num`, fracId, 'num');
            const denSlot = createSlot(`${fracId}_den`, fracId, 'den');

            slotsMap[numSlot.id] = numSlot;
            slotsMap[denSlot.id] = denSlot;

            const node = {
                type: 'frac',
                id: fracId,
                parentSlotId: slot.id,
                num: numSlot,
                den: denSlot
            };

            // If slot ends with a simple integer or variable, migrate it to numerator
            const last = slot.items[slot.items.length - 1];
            if (typeof last === 'string') {
                const match = last.match(/([0-9.]+|[a-zA-Z_]+)$/);
                if (match) {
                    const extracted = match[1];
                    slot.items[slot.items.length - 1] = last.slice(0, -extracted.length);
                    if (slot.items[slot.items.length - 1] === '') {
                        slot.items.pop();
                    }
                    numSlot.items.push(extracted);
                    slot.items.push(node);
                    activeSlotId = denSlot.id; // move cursor to denominator
                    render();
                    notifyChange();
                    return node;
                }
            }

            slot.items.push(node);
            activeSlotId = numSlot.id; // focus numerator
            render();
            notifyChange();
            return node;
        }

        /**
         * Insert Mixed Fraction (□ □/□)
         */
        function insertMixedFraction() {
            const slot = getActiveSlot();
            const mixedId = nextId('mixed');
            const wholeSlot = createSlot(`${mixedId}_whole`, mixedId, 'whole');
            const numSlot = createSlot(`${mixedId}_num`, mixedId, 'num');
            const denSlot = createSlot(`${mixedId}_den`, mixedId, 'den');

            slotsMap[wholeSlot.id] = wholeSlot;
            slotsMap[numSlot.id] = numSlot;
            slotsMap[denSlot.id] = denSlot;

            const node = {
                type: 'mixed',
                id: mixedId,
                parentSlotId: slot.id,
                whole: wholeSlot,
                num: numSlot,
                den: denSlot
            };

            // If slot ends with an integer, adopt it as whole number
            const last = slot.items[slot.items.length - 1];
            if (typeof last === 'string') {
                const match = last.match(/([0-9]+)$/);
                if (match) {
                    const wholeVal = match[1];
                    slot.items[slot.items.length - 1] = last.slice(0, -wholeVal.length);
                    if (slot.items[slot.items.length - 1] === '') {
                        slot.items.pop();
                    }
                    wholeSlot.items.push(wholeVal);
                    slot.items.push(node);
                    activeSlotId = numSlot.id; // focus numerator
                    render();
                    notifyChange();
                    return node;
                }
            }

            slot.items.push(node);
            activeSlotId = wholeSlot.id; // focus whole number
            render();
            notifyChange();
            return node;
        }

        /**
         * Insert Superscript Exponent (base^{exp})
         */
        function insertExponent(defaultExp = null) {
            const slot = getActiveSlot();

            // Auto-wrap negative base in parentheses if needed: e.g. -3 -> (-3)
            const last = slot.items[slot.items.length - 1];
            if (typeof last === 'string') {
                const negMatch = last.match(/(^|[+*/(,]\s*)-\s*([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)$/);
                if (negMatch && !/\(-[0-9.]+\)$/.test(last)) {
                    const prefix = negMatch[1] || '';
                    const base = negMatch[2];
                    const beforeMatch = last.slice(0, last.length - negMatch[0].length);
                    slot.items[slot.items.length - 1] = beforeMatch + prefix + `(-${base})`;
                }
            }

            const powId = nextId('pow');
            const expSlot = createSlot(`${powId}_exp`, powId, 'exp');
            slotsMap[expSlot.id] = expSlot;

            if (defaultExp !== null) {
                expSlot.items.push(String(defaultExp));
            }

            const node = {
                type: 'pow',
                id: powId,
                parentSlotId: slot.id,
                exp: expSlot
            };

            slot.items.push(node);

            if (defaultExp === null) {
                activeSlotId = expSlot.id; // focus exponent
            } else {
                // If default exponent (like x^2), advance to parent or next slot
                activeSlotId = slot.id;
            }

            render();
            notifyChange();
            return node;
        }

        /**
         * Insert Radical (√radicand)
         */
        function insertRadical() {
            const slot = getActiveSlot();
            const sqrtId = nextId('sqrt');
            const radSlot = createSlot(`${sqrtId}_radicand`, sqrtId, 'radicand');
            slotsMap[radSlot.id] = radSlot;

            const node = {
                type: 'sqrt',
                id: sqrtId,
                parentSlotId: slot.id,
                radicand: radSlot
            };

            slot.items.push(node);
            activeSlotId = radSlot.id; // focus radicand
            render();
            notifyChange();
            return node;
        }

        /**
         * Atomic Deletion (DEL & Backspace)
         * Deletes multi-letter function prefixes atomically,
         * or unwraps/removes empty nested slots without leaving orphan syntax.
         */
        function deleteAtomic() {
            const slot = getActiveSlot();

            // 1. If slot has text/items:
            if (slot.items.length > 0) {
                const lastIdx = slot.items.length - 1;
                const last = slot.items[lastIdx];

                if (typeof last === 'string') {
                    // Check for atomic function prefixes
                    let matchedFn = null;
                    for (const fn of ATOMIC_FUNCTIONS) {
                        if (last.endsWith(fn)) {
                            matchedFn = fn;
                            break;
                        }
                    }

                    if (matchedFn) {
                        // Delete whole function token atomically in one press
                        const newStr = last.slice(0, -matchedFn.length);
                        if (newStr.length === 0) {
                            slot.items.pop();
                        } else {
                            slot.items[lastIdx] = newStr;
                        }
                        render();
                        notifyChange();
                        return true;
                    }

                    // Check for space-padded binary operator e.g. " + "
                    if (/\s[+\-*/]\s$/.test(last)) {
                        const newStr = last.slice(0, -3);
                        if (newStr.length === 0) {
                            slot.items.pop();
                        } else {
                            slot.items[lastIdx] = newStr;
                        }
                        render();
                        notifyChange();
                        return true;
                    }

                    // Default: delete 1 character from string
                    const newStr = last.slice(0, -1);
                    if (newStr.length === 0) {
                        slot.items.pop();
                    } else {
                        slot.items[lastIdx] = newStr;
                    }
                    render();
                    notifyChange();
                    return true;
                } else if (typeof last === 'object' && last !== null) {
                    // The last item is a child structure.
                    // If the user presses DEL when right after it, enter the last sub-slot or remove if empty
                    const subSlots = getChildSlotsOfNode(last);
                    const lastSubSlot = subSlots[subSlots.length - 1];
                    if (lastSubSlot && isSlotEmpty(lastSubSlot)) {
                        // Remove empty structure
                        slot.items.pop();
                        removeSlotsFromMap(subSlots);
                        render();
                        notifyChange();
                        return true;
                    } else if (lastSubSlot) {
                        activeSlotId = lastSubSlot.id;
                        render();
                        return true;
                    }
                }
            }

            // 2. Slot is EMPTY and is NOT root: Cleanly unwrap or remove parent structure!
            if (slot.id !== 'root') {
                const parentNodeId = slot.parentNode;
                const parentContainerSlotId = findParentSlotIdOfNode(parentNodeId);
                const parentContainer = slotsMap[parentContainerSlotId] || rootSlot;

                // Find index of parent node in parent container
                const nodeIdx = parentContainer.items.findIndex(
                    item => typeof item === 'object' && item !== null && item.id === parentNodeId
                );

                if (nodeIdx >= 0) {
                    const node = parentContainer.items[nodeIdx];
                    const childSlots = getChildSlotsOfNode(node);

                    // Remove node from parent container items
                    parentContainer.items.splice(nodeIdx, 1);
                    removeSlotsFromMap(childSlots);

                    // Focus back to parent container slot
                    activeSlotId = parentContainer.id;
                    render();
                    notifyChange();
                    return true;
                }
            }

            return false;
        }

        function getChildSlotsOfNode(node) {
            const res = [];
            if (!node) return res;
            if (node.whole) res.push(node.whole);
            if (node.num) res.push(node.num);
            if (node.den) res.push(node.den);
            if (node.exp) res.push(node.exp);
            if (node.radicand) res.push(node.radicand);
            return res;
        }

        function isSlotEmpty(slot) {
            return !slot || slot.items.length === 0 || (slot.items.length === 1 && slot.items[0] === '');
        }

        function findParentSlotIdOfNode(nodeId) {
            for (const sId in slotsMap) {
                const s = slotsMap[sId];
                if (s.items.some(item => typeof item === 'object' && item !== null && item.id === nodeId)) {
                    return s.id;
                }
            }
            return 'root';
        }

        function removeSlotsFromMap(slotList) {
            slotList.forEach(s => {
                delete slotsMap[s.id];
            });
        }

        /**
         * Clear all contents
         */
        function clear() {
            rootSlot.items = [];
            slotsMap = { 'root': rootSlot };
            activeSlotId = 'root';
            render();
            notifyChange();
        }

        /**
         * Toggle Sign (±) in current active slot
         */
        function toggleSign() {
            const slot = getActiveSlot();
            if (slot.items.length === 0) {
                slot.items.push('(-');
                render();
                notifyChange();
                return;
            }
            const lastIdx = slot.items.length - 1;
            const last = slot.items[lastIdx];
            if (typeof last === 'string') {
                if (/\(-([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)\)$/.test(last)) {
                    slot.items[lastIdx] = last.replace(/\(-([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)\)$/, '$1');
                } else if (/(^|[+*/(,]\s*)-\s*([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)$/.test(last)) {
                    slot.items[lastIdx] = last.replace(/(^|[+*/(,]\s*)-\s*([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)$/, '$1$2');
                } else if (/(^|[+*/(,]\s*)([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)$/.test(last)) {
                    slot.items[lastIdx] = last.replace(/(^|[+*/(,]\s*)([0-9.]+(?:e[+-]?[0-9]+)?|[a-zA-Z_]+)$/, '$1(-$2)');
                } else if (last.endsWith('(-')) {
                    slot.items[lastIdx] = last.slice(0, -2);
                    if (!slot.items[lastIdx]) slot.items.pop();
                } else {
                    slot.items[lastIdx] = last + '(-';
                }
            } else {
                slot.items.push('(-');
            }
            render();
            notifyChange();
        }

        /**
         * Insert string or parsed number/fraction/mixed number
         */
        function insertParsed(str) {
            if (!str) return;
            const text = String(str).trim();
            // Check mixed fraction format: "5 1/2"
            const mixedMatch = text.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
            if (mixedMatch) {
                const node = insertMixedFraction();
                node.whole.items = [mixedMatch[1]];
                node.num.items = [mixedMatch[2]];
                node.den.items = [mixedMatch[3]];
                activeSlotId = node.den.id;
                render();
                notifyChange();
                return;
            }
            // Check fraction format: "11/2"
            const fracMatch = text.match(/^(\d+)\s*\/\s*(\d+)$/);
            if (fracMatch) {
                const node = insertFraction();
                node.num.items = [fracMatch[1]];
                node.den.items = [fracMatch[2]];
                activeSlotId = node.den.id;
                render();
                notifyChange();
                return;
            }
            insertToken(text);
        }

        /**
         * Set complete expression (clears first)
         */
        function setExpression(expr) {
            clear();
            if (expr) {
                insertParsed(expr);
            }
        }

        /**
         * Check if editor is visually empty
         */
        function isEmpty() {
            return isSlotEmpty(rootSlot);
        }

        /**
         * Serialize AST cleanly to standard algebraic syntax for MathCore
         * Mixed numbers e.g. 5 1/2 serialize to ((5) + ((1)/(2)))
         * Stacked fractions serialize to ((num) / (den))
         * Exponents serialize to ^(exp)
         * Radicals serialize to sqrt(radicand)
         */
        function serializeSlot(slot) {
            if (!slot || !slot.items) return '';
            let out = '';
            for (let i = 0; i < slot.items.length; i++) {
                const item = slot.items[i];
                if (typeof item === 'string') {
                    out += item;
                } else if (typeof item === 'object' && item !== null) {
                    if (item.type === 'frac') {
                        const numStr = serializeSlot(item.num).trim() || '0';
                        const denStr = serializeSlot(item.den).trim() || '1';
                        out += `((${numStr}) / (${denStr}))`;
                    } else if (item.type === 'mixed') {
                        const wholeStr = serializeSlot(item.whole).trim() || '0';
                        const numStr = serializeSlot(item.num).trim() || '0';
                        const denStr = serializeSlot(item.den).trim() || '1';
                        out += `((${wholeStr}) + ((${numStr}) / (${denStr})))`;
                    } else if (item.type === 'pow') {
                        const expStr = serializeSlot(item.exp).trim() || '1';
                        out += `^(${expStr})`;
                    } else if (item.type === 'sqrt') {
                        const radStr = serializeSlot(item.radicand).trim() || '0';
                        out += `sqrt(${radStr})`;
                    }
                }
            }
            return out;
        }

        function serialize() {
            return serializeSlot(rootSlot).trim();
        }

        /**
         * Render HTML structure
         */
        function renderSlotHtml(slot, isRoot = false) {
            const isActive = slot.id === activeSlotId;
            let innerHtml = '';

            for (const item of slot.items) {
                if (typeof item === 'string') {
                    // Escape basic HTML chars
                    const esc = item
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                    innerHtml += `<span class="vmath-text">${esc}</span>`;
                } else if (typeof item === 'object' && item !== null) {
                    if (item.type === 'frac') {
                        innerHtml += `
                            <span class="vmath-frac" data-node-id="${item.id}">
                                ${renderSlotHtml(item.num)}
                                <span class="vmath-frac-bar"></span>
                                ${renderSlotHtml(item.den)}
                            </span>
                        `;
                    } else if (item.type === 'mixed') {
                        innerHtml += `
                            <span class="vmath-mixed" data-node-id="${item.id}">
                                ${renderSlotHtml(item.whole)}
                                <span class="vmath-frac">
                                    ${renderSlotHtml(item.num)}
                                    <span class="vmath-frac-bar"></span>
                                    ${renderSlotHtml(item.den)}
                                </span>
                            </span>
                        `;
                    } else if (item.type === 'pow') {
                        innerHtml += `
                            <sup class="vmath-pow" data-node-id="${item.id}">
                                ${renderSlotHtml(item.exp)}
                            </sup>
                        `;
                    } else if (item.type === 'sqrt') {
                        innerHtml += `
                            <span class="vmath-sqrt" data-node-id="${item.id}">
                                <span class="vmath-radical-symbol">√</span>
                                <span class="vmath-radicand-wrap">
                                    <span class="vmath-radicand-overline"></span>
                                    ${renderSlotHtml(item.radicand)}
                                </span>
                            </span>
                        `;
                    }
                }
            }

            if (isRoot) {
                const activeClass = isActive ? ' is-active-slot' : '';
                return `<div class="vmath-root-slot${activeClass}" data-slot-id="${slot.id}" onclick="VisualMathEditor.setActiveSlot('${slot.id}', event)">${innerHtml || '<span class="vmath-placeholder">&nbsp;</span>'}</div>`;
            }

            const slotTypeClass = ` vmath-${slot.slotType || 'box'}`;
            const activeClass = isActive ? ' is-active-slot' : '';
            return `<span class="vmath-slot${slotTypeClass}${activeClass}" data-slot-id="${slot.id}" onclick="VisualMathEditor.setActiveSlot('${slot.id}', event)">${innerHtml}</span>`;
        }

        function renderHtml() {
            return renderSlotHtml(rootSlot, true);
        }

        function render() {
            if (containerElement) {
                containerElement.innerHTML = renderHtml();
            }
        }

        function init(container, onChange) {
            containerElement = container;
            changeCallback = onChange;
            render();
        }

        return {
            init,
            insertToken,
            insertParsed,
            setExpression,
            toggleSign,
            insertFraction,
            insertMixedFraction,
            insertExponent,
            insertRadical,
            deleteAtomic,
            navigateLeft,
            navigateRight,
            setActiveSlot,
            clear,
            isEmpty,
            serialize,
            renderHtml,
            render,
            setChangeCallback,
            getActiveSlotId: () => activeSlotId
        };
    }

    // Default global singleton instance
    const defaultInstance = createEditor();

    return {
        create: createEditor,
        default: defaultInstance,
        init: defaultInstance.init,
        insertToken: defaultInstance.insertToken,
        insertParsed: defaultInstance.insertParsed,
        setExpression: defaultInstance.setExpression,
        toggleSign: defaultInstance.toggleSign,
        insertFraction: defaultInstance.insertFraction,
        insertMixedFraction: defaultInstance.insertMixedFraction,
        insertExponent: defaultInstance.insertExponent,
        insertRadical: defaultInstance.insertRadical,
        deleteAtomic: defaultInstance.deleteAtomic,
        navigateLeft: defaultInstance.navigateLeft,
        navigateRight: defaultInstance.navigateRight,
        setActiveSlot: function (slotId, e) {
            if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
            return defaultInstance.setActiveSlot(slotId);
        },
        clear: defaultInstance.clear,
        isEmpty: defaultInstance.isEmpty,
        serialize: defaultInstance.serialize,
        renderHtml: defaultInstance.renderHtml,
        render: defaultInstance.render
    };
}));
