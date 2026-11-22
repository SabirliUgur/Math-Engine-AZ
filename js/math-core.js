/**
 * MathCore v1.5.0 ("Core Precision & Offline Engine")
 * Deterministic Shunting-Yard (RPN) mathematical parser, IEEE-754 precision cleaner,
 * localized error handler, symbolic differentiation, numerical integration, and persistent history store.
 * Zero external dependencies.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.MathCore = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Localized Azerbaijani Error Messages
    const ERRORS = {
        DIV_ZERO: "Sıfıra bölmə yolverilməzdir",
        UNBALANCED_PARENS: "Mötərizələr düzgün bağlanmayıb",
        INVALID_SYNTAX: "Sintaksis xətası: ifadə düzgün deyil",
        SQRT_NEGATIVE: "Mənfi ədəddən kvadrat kök almaq olmaz",
        LOG_NON_POSITIVE: "Loqarifmin arqumenti müsbət olmalıdır (x > 0)",
        ASIN_DOMAIN: "asin arqumenti [-1, 1] parçasında olmalıdır",
        ACOS_DOMAIN: "acos arqumenti [-1, 1] parçasında olmalıdır",
        TAN_ASYMPTOTE: "tan funksiyası bu nöqtədə təyin olunmayıb (90° + k·180°)",
        COT_ASYMPTOTE: "cot funksiyası bu nöqtədə təyin olunmayıb (k·180°)",
        FACTORIAL_INVALID: "Faktorial yalnız mənfi olmayan tam ədədlər üçün təyin olunub",
        UNKNOWN_IDENTIFIER: "Naməlum simvol və ya funksiya: ",
        MISSING_OPERAND: "Riyazi əməl və ya ədəd çatışmır",
        EMPTY_EXPRESSION: "İfadə boşdur"
    };

    /**
     * IEEE-754 Floating-Point Precision Cleaner
     * Eliminates artifacts like 0.1 + 0.2 = 0.30000000000000004
     * Snaps values near zero (< 1e-13) and nearby integers.
     */
    function cleanPrecision(num, digits = 12) {
        if (typeof num !== 'number') {
            const parsed = parseFloat(num);
            if (isNaN(parsed)) return num;
            num = parsed;
        }
        if (!isFinite(num)) return num;
        if (Math.abs(num) < 1e-13) return 0;

        // Snap to nearest integer if within 1e-11
        const nearestInt = Math.round(num);
        if (Math.abs(num - nearestInt) < 1e-11) return nearestInt;

        // Precision rounding
        const factor = Math.pow(10, digits);
        const rounded = Math.round(num * factor) / factor;
        const cleaned = parseFloat(rounded.toPrecision(digits));

        if (Math.abs(cleaned) < 1e-13) return 0;
        if (Math.abs(cleaned - Math.round(cleaned)) < 1e-11) return Math.round(cleaned);
        return Object.is(cleaned, -0) ? 0 : cleaned;
    }

    // Supported Constants and Functions
    const CONSTANTS = {
        'pi': Math.PI,
        'π': Math.PI,
        'e': Math.E
    };

    const FUNCTIONS = [
        'sin', 'cos', 'tan', 'cot',
        'asin', 'acos', 'atan',
        'sqrt', 'cbrt', 'abs',
        'ln', 'log', 'log10', 'exp'
    ];

    // Token Types
    const TOKEN_TYPES = {
        NUMBER: 'NUMBER',
        IDENTIFIER: 'IDENTIFIER',
        FUNCTION: 'FUNCTION',
        OPERATOR: 'OPERATOR',
        UNARY_OP: 'UNARY_OP',
        POSTFIX_OP: 'POSTFIX_OP',
        LPAREN: 'LPAREN',
        RPAREN: 'RPAREN',
        COMMA: 'COMMA'
    };

    // Operator definitions
    const OPERATORS = {
        '+': { prec: 1, assoc: 'L', arity: 2 },
        '-': { prec: 1, assoc: 'L', arity: 2 },
        '*': { prec: 2, assoc: 'L', arity: 2 },
        '/': { prec: 2, assoc: 'L', arity: 2 },
        '%': { prec: 2, assoc: 'L', arity: 2 },
        'neg': { prec: 4, assoc: 'R', arity: 1 }, // Unary minus
        'pos': { prec: 4, assoc: 'R', arity: 1 }, // Unary plus
        '^': { prec: 5, assoc: 'R', arity: 2 },
        '!': { prec: 6, assoc: 'L', arity: 1 }  // Factorial postfix
    };

    /**
     * Tokenize raw mathematical expression with normalization and implicit multiplication
     */
    function tokenize(rawExpr) {
        if (!rawExpr || typeof rawExpr !== 'string') {
            throw new Error(ERRORS.EMPTY_EXPRESSION);
        }

        // Normalize special characters
        let str = rawExpr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, 'pi')
            .trim();

        if (!str) throw new Error(ERRORS.EMPTY_EXPRESSION);

        const rawTokens = [];
        let i = 0;
        const len = str.length;

        while (i < len) {
            const ch = str[i];

            if (/\s/.test(ch)) {
                i++;
                continue;
            }

            // Numbers (including decimals and scientific notation like 1e5, 2.5e-3)
            if (/[0-9.]/.test(ch)) {
                let numStr = '';
                let hasDot = false;
                while (i < len && /[0-9.]/.test(str[i])) {
                    if (str[i] === '.') {
                        if (hasDot) throw new Error(ERRORS.INVALID_SYNTAX);
                        hasDot = true;
                    }
                    numStr += str[i];
                    i++;
                }
                // Check for scientific notation exponent
                if (i < len && (str[i] === 'e' || str[i] === 'E') && i + 1 < len) {
                    const nextChar = str[i + 1];
                    if (/[0-9]/.test(nextChar) || ((nextChar === '+' || nextChar === '-') && i + 2 < len && /[0-9]/.test(str[i + 2]))) {
                        numStr += str[i];
                        i++;
                        if (str[i] === '+' || str[i] === '-') {
                            numStr += str[i];
                            i++;
                        }
                        while (i < len && /[0-9]/.test(str[i])) {
                            numStr += str[i];
                            i++;
                        }
                    }
                }
                const val = parseFloat(numStr);
                if (isNaN(val)) throw new Error(ERRORS.INVALID_SYNTAX);
                rawTokens.push({ type: TOKEN_TYPES.NUMBER, value: val, raw: numStr });
                continue;
            }

            // Identifiers (functions, constants, variables)
            if (/[a-zA-Z_]/.test(ch)) {
                let idStr = '';
                while (i < len && /[a-zA-Z0-9_]/.test(str[i])) {
                    idStr += str[i];
                    i++;
                }
                const lower = idStr.toLowerCase();
                if (FUNCTIONS.includes(lower)) {
                    rawTokens.push({ type: TOKEN_TYPES.FUNCTION, value: lower });
                } else {
                    rawTokens.push({ type: TOKEN_TYPES.IDENTIFIER, value: lower });
                }
                continue;
            }

            // Parentheses
            if (ch === '(') {
                rawTokens.push({ type: TOKEN_TYPES.LPAREN, value: '(' });
                i++;
                continue;
            }
            if (ch === ')') {
                rawTokens.push({ type: TOKEN_TYPES.RPAREN, value: ')' });
                i++;
                continue;
            }

            // Factorial postfix
            if (ch === '!') {
                rawTokens.push({ type: TOKEN_TYPES.POSTFIX_OP, value: '!' });
                i++;
                continue;
            }

            // Comma
            if (ch === ',') {
                rawTokens.push({ type: TOKEN_TYPES.COMMA, value: ',' });
                i++;
                continue;
            }

            // Operators
            if ('+-*/%^'.includes(ch)) {
                rawTokens.push({ type: TOKEN_TYPES.OPERATOR, value: ch });
                i++;
                continue;
            }

            throw new Error(ERRORS.UNKNOWN_IDENTIFIER + ch);
        }

        if (rawTokens.length === 0) throw new Error(ERRORS.EMPTY_EXPRESSION);

        // Step 2: Handle Unary Minus and Plus
        const processedTokens = [];
        for (let idx = 0; idx < rawTokens.length; idx++) {
            const tok = rawTokens[idx];
            if (tok.type === TOKEN_TYPES.OPERATOR && (tok.value === '-' || tok.value === '+')) {
                const prev = processedTokens[processedTokens.length - 1];
                const isUnary = !prev ||
                    prev.type === TOKEN_TYPES.OPERATOR ||
                    prev.type === TOKEN_TYPES.UNARY_OP ||
                    prev.type === TOKEN_TYPES.LPAREN ||
                    prev.type === TOKEN_TYPES.COMMA;

                if (isUnary) {
                    if (tok.value === '-') {
                        processedTokens.push({ type: TOKEN_TYPES.UNARY_OP, value: 'neg' });
                    } else {
                        processedTokens.push({ type: TOKEN_TYPES.UNARY_OP, value: 'pos' });
                    }
                    continue;
                }
            }
            processedTokens.push(tok);
        }

        // Step 3: Insert Implicit Multiplication
        // Examples: 2x -> 2*x, 2(x+1) -> 2*(x+1), (x+1)(x-1) -> (x+1)*(x-1), 2sin(x) -> 2*sin(x), x y -> x*y
        const finalTokens = [];
        for (let idx = 0; idx < processedTokens.length; idx++) {
            const current = processedTokens[idx];
            finalTokens.push(current);

            if (idx + 1 < processedTokens.length) {
                const next = processedTokens[idx + 1];

                const currentCanPrecedeMultiply =
                    current.type === TOKEN_TYPES.NUMBER ||
                    current.type === TOKEN_TYPES.IDENTIFIER ||
                    current.type === TOKEN_TYPES.RPAREN ||
                    current.type === TOKEN_TYPES.POSTFIX_OP;

                const nextCanFollowMultiply =
                    next.type === TOKEN_TYPES.NUMBER ||
                    next.type === TOKEN_TYPES.IDENTIFIER ||
                    next.type === TOKEN_TYPES.FUNCTION ||
                    next.type === TOKEN_TYPES.LPAREN;

                if (currentCanPrecedeMultiply && nextCanFollowMultiply) {
                    finalTokens.push({ type: TOKEN_TYPES.OPERATOR, value: '*' });
                }
            }
        }

        return finalTokens;
    }

    /**
     * Convert infix token stream to Reverse Polish Notation (RPN) via Shunting-Yard
     */
    function toRPN(tokens) {
        const outputQueue = [];
        const opStack = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            switch (token.type) {
                case TOKEN_TYPES.NUMBER:
                case TOKEN_TYPES.IDENTIFIER:
                    outputQueue.push(token);
                    break;

                case TOKEN_TYPES.FUNCTION:
                    opStack.push(token);
                    break;

                case TOKEN_TYPES.POSTFIX_OP:
                    outputQueue.push(token);
                    break;

                case TOKEN_TYPES.COMMA:
                    while (opStack.length > 0 && opStack[opStack.length - 1].type !== TOKEN_TYPES.LPAREN) {
                        outputQueue.push(opStack.pop());
                    }
                    if (opStack.length === 0) {
                        throw new Error(ERRORS.INVALID_SYNTAX);
                    }
                    break;

                case TOKEN_TYPES.UNARY_OP: {
                    opStack.push(token);
                    break;
                }
                case TOKEN_TYPES.OPERATOR: {
                    const op1 = token.value;
                    const def1 = OPERATORS[op1];
                    if (!def1) throw new Error(ERRORS.INVALID_SYNTAX);

                    while (opStack.length > 0) {
                        const top = opStack[opStack.length - 1];
                        if (top.type === TOKEN_TYPES.FUNCTION) {
                            outputQueue.push(opStack.pop());
                            continue;
                        }
                        if (top.type === TOKEN_TYPES.OPERATOR || top.type === TOKEN_TYPES.UNARY_OP) {
                            const op2 = top.value;
                            const def2 = OPERATORS[op2];
                            if (def2) {
                                if ((def1.assoc === 'L' && def1.prec <= def2.prec) ||
                                    (def1.assoc === 'R' && def1.prec < def2.prec)) {
                                    outputQueue.push(opStack.pop());
                                    continue;
                                }
                            }
                        }
                        break;
                    }
                    opStack.push(token);
                    break;
                }

                case TOKEN_TYPES.LPAREN:
                    opStack.push(token);
                    break;

                case TOKEN_TYPES.RPAREN: {
                    let matched = false;
                    while (opStack.length > 0) {
                        const top = opStack.pop();
                        if (top.type === TOKEN_TYPES.LPAREN) {
                            matched = true;
                            break;
                        }
                        outputQueue.push(top);
                    }
                    if (!matched) {
                        throw new Error(ERRORS.UNBALANCED_PARENS);
                    }
                    // If a function precedes the parenthesis, pop it to output
                    if (opStack.length > 0 && opStack[opStack.length - 1].type === TOKEN_TYPES.FUNCTION) {
                        outputQueue.push(opStack.pop());
                    }
                    break;
                }

                default:
                    throw new Error(ERRORS.INVALID_SYNTAX);
            }
        }

        while (opStack.length > 0) {
            const top = opStack.pop();
            if (top.type === TOKEN_TYPES.LPAREN || top.type === TOKEN_TYPES.RPAREN) {
                throw new Error(ERRORS.UNBALANCED_PARENS);
            }
            outputQueue.push(top);
        }

        return outputQueue;
    }

    /**
     * Evaluate RPN token queue with given context
     * @param {Array} rpn - RPN tokens
     * @param {Object} context - { x, ans, angleMode: 'DEG'|'RAD', ... }
     */
    function evaluateRPN(rpn, context = {}) {
        const stack = [];
        const angleMode = (context.angleMode || 'DEG').toUpperCase();

        for (let i = 0; i < rpn.length; i++) {
            const token = rpn[i];

            if (token.type === TOKEN_TYPES.NUMBER) {
                stack.push(token.value);
                continue;
            }

            if (token.type === TOKEN_TYPES.IDENTIFIER) {
                const id = token.value;
                if (CONSTANTS[id] !== undefined) {
                    stack.push(CONSTANTS[id]);
                } else if (id === 'ans') {
                    const ansVal = context.ans !== undefined ? Number(context.ans) : (HistoryStore.getAns() || 0);
                    stack.push(ansVal);
                } else if (context[id] !== undefined) {
                    const val = Number(context[id]);
                    if (isNaN(val)) throw new Error(ERRORS.INVALID_SYNTAX);
                    stack.push(val);
                } else {
                    throw new Error(ERRORS.UNKNOWN_IDENTIFIER + id);
                }
                continue;
            }

            if (token.type === TOKEN_TYPES.UNARY_OP) {
                if (stack.length < 1) throw new Error(ERRORS.MISSING_OPERAND);
                const a = stack.pop();
                if (token.value === 'neg') {
                    stack.push(-a);
                } else if (token.value === 'pos') {
                    stack.push(+a);
                }
                continue;
            }

            if (token.type === TOKEN_TYPES.POSTFIX_OP && token.value === '!') {
                if (stack.length < 1) throw new Error(ERRORS.MISSING_OPERAND);
                const a = stack.pop();
                if (a < 0 || !Number.isInteger(Math.round(a)) || Math.abs(a - Math.round(a)) > 1e-10) {
                    throw new Error(ERRORS.FACTORIAL_INVALID);
                }
                const n = Math.round(a);
                if (n > 170) {
                    stack.push(Infinity);
                } else {
                    let fact = 1;
                    for (let f = 2; f <= n; f++) fact *= f;
                    stack.push(fact);
                }
                continue;
            }

            if (token.type === TOKEN_TYPES.OPERATOR) {
                if (stack.length < 2) throw new Error(ERRORS.MISSING_OPERAND);
                const b = stack.pop();
                const a = stack.pop();
                let res;

                switch (token.value) {
                    case '+': res = a + b; break;
                    case '-': res = a - b; break;
                    case '*': res = a * b; break;
                    case '/':
                        if (Math.abs(b) < 1e-15) throw new Error(ERRORS.DIV_ZERO);
                        res = a / b;
                        break;
                    case '%':
                        if (Math.abs(b) < 1e-15) throw new Error(ERRORS.DIV_ZERO);
                        res = a % b;
                        break;
                    case '^':
                        res = Math.pow(a, b);
                        break;
                    default:
                        throw new Error(ERRORS.INVALID_SYNTAX);
                }
                stack.push(res);
                continue;
            }

            if (token.type === TOKEN_TYPES.FUNCTION) {
                if (stack.length < 1) throw new Error(ERRORS.MISSING_OPERAND);
                const a = stack.pop();
                let res;
                const fn = token.value;

                switch (fn) {
                    case 'sin': {
                        const rad = angleMode === 'DEG' ? (a * Math.PI / 180) : a;
                        res = Math.sin(rad);
                        break;
                    }
                    case 'cos': {
                        const rad = angleMode === 'DEG' ? (a * Math.PI / 180) : a;
                        res = Math.cos(rad);
                        break;
                    }
                    case 'tan': {
                        if (angleMode === 'DEG') {
                            const mod = Math.abs((a - 90) % 180);
                            if (mod < 1e-10 || Math.abs(mod - 180) < 1e-10) {
                                throw new Error(ERRORS.TAN_ASYMPTOTE);
                            }
                            res = Math.tan(a * Math.PI / 180);
                        } else {
                            if (Math.abs(Math.cos(a)) < 1e-14) {
                                throw new Error(ERRORS.TAN_ASYMPTOTE);
                            }
                            res = Math.tan(a);
                        }
                        break;
                    }
                    case 'cot': {
                        if (angleMode === 'DEG') {
                            const mod = Math.abs(a % 180);
                            if (mod < 1e-10 || Math.abs(mod - 180) < 1e-10) {
                                throw new Error(ERRORS.COT_ASYMPTOTE);
                            }
                            res = 1 / Math.tan(a * Math.PI / 180);
                        } else {
                            if (Math.abs(Math.sin(a)) < 1e-14) {
                                throw new Error(ERRORS.COT_ASYMPTOTE);
                            }
                            res = 1 / Math.tan(a);
                        }
                        break;
                    }
                    case 'asin': {
                        if (a < -1 || a > 1) throw new Error(ERRORS.ASIN_DOMAIN);
                        res = Math.asin(a);
                        if (angleMode === 'DEG') res = res * 180 / Math.PI;
                        break;
                    }
                    case 'acos': {
                        if (a < -1 || a > 1) throw new Error(ERRORS.ACOS_DOMAIN);
                        res = Math.acos(a);
                        if (angleMode === 'DEG') res = res * 180 / Math.PI;
                        break;
                    }
                    case 'atan': {
                        res = Math.atan(a);
                        if (angleMode === 'DEG') res = res * 180 / Math.PI;
                        break;
                    }
                    case 'sqrt': {
                        if (a < 0) throw new Error(ERRORS.SQRT_NEGATIVE);
                        res = Math.sqrt(a);
                        break;
                    }
                    case 'cbrt': {
                        res = Math.cbrt(a);
                        break;
                    }
                    case 'abs': {
                        res = Math.abs(a);
                        break;
                    }
                    case 'ln': {
                        if (a <= 0) throw new Error(ERRORS.LOG_NON_POSITIVE);
                        res = Math.log(a);
                        break;
                    }
                    case 'log':
                    case 'log10': {
                        if (a <= 0) throw new Error(ERRORS.LOG_NON_POSITIVE);
                        res = Math.log10 ? Math.log10(a) : Math.log(a) / Math.LN10;
                        break;
                    }
                    case 'exp': {
                        res = Math.exp(a);
                        break;
                    }
                    default:
                        throw new Error(ERRORS.UNKNOWN_IDENTIFIER + fn);
                }
                stack.push(res);
                continue;
            }

            throw new Error(ERRORS.INVALID_SYNTAX);
        }

        if (stack.length !== 1) {
            throw new Error(ERRORS.INVALID_SYNTAX);
        }

        return cleanPrecision(stack[0]);
    }

    /**
     * Main evaluation entry point
     */
    function evaluate(expr, context = {}) {
        const tokens = tokenize(expr);
        const rpn = toRPN(tokens);
        return evaluateRPN(rpn, context);
    }

    /* ==========================================================
       SYMBOLIC DIFFERENTIATION ENGINE (AST BASED)
       ========================================================== */

    function buildAST(rpn) {
        const stack = [];
        for (let i = 0; i < rpn.length; i++) {
            const tok = rpn[i];
            if (tok.type === TOKEN_TYPES.NUMBER) {
                stack.push({ type: 'num', value: tok.value });
            } else if (tok.type === TOKEN_TYPES.IDENTIFIER) {
                if (CONSTANTS[tok.value] !== undefined) {
                    stack.push({ type: 'const', name: tok.value });
                } else {
                    stack.push({ type: 'var', name: tok.value });
                }
            } else if (tok.type === TOKEN_TYPES.UNARY_OP) {
                const arg = stack.pop();
                stack.push({ type: 'neg', arg });
            } else if (tok.type === TOKEN_TYPES.OPERATOR) {
                const b = stack.pop();
                const a = stack.pop();
                stack.push({ type: 'bin', op: tok.value, left: a, right: b });
            } else if (tok.type === TOKEN_TYPES.FUNCTION) {
                const arg = stack.pop();
                stack.push({ type: 'func', name: tok.value, arg });
            }
        }
        return stack[0];
    }

    function diffAST(node, varName = 'x') {
        if (!node) return { type: 'num', value: 0 };

        switch (node.type) {
            case 'num':
            case 'const':
                return { type: 'num', value: 0 };

            case 'var':
                return node.name === varName ? { type: 'num', value: 1 } : { type: 'num', value: 0 };

            case 'neg':
                return { type: 'neg', arg: diffAST(node.arg, varName) };

            case 'bin': {
                const u = node.left;
                const v = node.right;
                const du = diffAST(u, varName);
                const dv = diffAST(v, varName);

                if (node.op === '+') {
                    return { type: 'bin', op: '+', left: du, right: dv };
                }
                if (node.op === '-') {
                    return { type: 'bin', op: '-', left: du, right: dv };
                }
                if (node.op === '*') {
                    // (u*v)' = u'*v + u*v'
                    return {
                        type: 'bin', op: '+',
                        left: { type: 'bin', op: '*', left: du, right: v },
                        right: { type: 'bin', op: '*', left: u, right: dv }
                    };
                }
                if (node.op === '/') {
                    // (u/v)' = (u'*v - u*v') / v^2
                    return {
                        type: 'bin', op: '/',
                        left: {
                            type: 'bin', op: '-',
                            left: { type: 'bin', op: '*', left: du, right: v },
                            right: { type: 'bin', op: '*', left: u, right: dv }
                        },
                        right: { type: 'bin', op: '^', left: v, right: { type: 'num', value: 2 } }
                    };
                }
                if (node.op === '^') {
                    // Power rule: u^c where c is constant
                    if (v.type === 'num') {
                        const n = v.value;
                        return {
                            type: 'bin', op: '*',
                            left: {
                                type: 'bin', op: '*',
                                left: { type: 'num', value: n },
                                right: { type: 'bin', op: '^', left: u, right: { type: 'num', value: cleanPrecision(n - 1) } }
                            },
                            right: du
                        };
                    }
                    // General case u^v: u^v * (v'*ln(u) + v*u'/u)
                    return {
                        type: 'bin', op: '*',
                        left: node,
                        right: {
                            type: 'bin', op: '+',
                            left: { type: 'bin', op: '*', left: dv, right: { type: 'func', name: 'ln', arg: u } },
                            right: { type: 'bin', op: '/', left: { type: 'bin', op: '*', left: v, right: du }, right: u }
                        }
                    };
                }
                return { type: 'num', value: 0 };
            }

            case 'func': {
                const u = node.arg;
                const du = diffAST(u, varName);
                const fn = node.name;

                if (fn === 'sin') {
                    return { type: 'bin', op: '*', left: { type: 'func', name: 'cos', arg: u }, right: du };
                }
                if (fn === 'cos') {
                    return { type: 'bin', op: '*', left: { type: 'neg', arg: { type: 'func', name: 'sin', arg: u } }, right: du };
                }
                if (fn === 'tan') {
                    return {
                        type: 'bin', op: '*',
                        left: { type: 'bin', op: '+', left: { type: 'num', value: 1 }, right: { type: 'bin', op: '^', left: node, right: { type: 'num', value: 2 } } },
                        right: du
                    };
                }
                if (fn === 'cot') {
                    return {
                        type: 'bin', op: '*',
                        left: { type: 'neg', arg: { type: 'bin', op: '+', left: { type: 'num', value: 1 }, right: { type: 'bin', op: '^', left: node, right: { type: 'num', value: 2 } } } },
                        right: du
                    };
                }
                if (fn === 'ln') {
                    return { type: 'bin', op: '/', left: du, right: u };
                }
                if (fn === 'log' || fn === 'log10') {
                    return { type: 'bin', op: '/', left: du, right: { type: 'bin', op: '*', left: u, right: { type: 'func', name: 'ln', arg: { type: 'num', value: 10 } } } };
                }
                if (fn === 'exp') {
                    return { type: 'bin', op: '*', left: node, right: du };
                }
                if (fn === 'sqrt') {
                    return {
                        type: 'bin', op: '/',
                        left: du,
                        right: { type: 'bin', op: '*', left: { type: 'num', value: 2 }, right: node }
                    };
                }
                return { type: 'num', value: 0 };
            }

            default:
                return { type: 'num', value: 0 };
        }
    }

    function simplifyAST(node) {
        if (!node) return null;

        if (node.type === 'neg') {
            const inner = simplifyAST(node.arg);
            if (inner.type === 'num') return { type: 'num', value: cleanPrecision(-inner.value) };
            if (inner.type === 'neg') return inner.arg;
            return { type: 'neg', arg: inner };
        }

        if (node.type === 'func') {
            return { type: 'func', name: node.name, arg: simplifyAST(node.arg) };
        }

        if (node.type === 'bin') {
            let left = simplifyAST(node.left);
            let right = simplifyAST(node.right);

            // Constant folding
            if (left.type === 'num' && right.type === 'num') {
                if (node.op === '+') return { type: 'num', value: cleanPrecision(left.value + right.value) };
                if (node.op === '-') return { type: 'num', value: cleanPrecision(left.value - right.value) };
                if (node.op === '*') return { type: 'num', value: cleanPrecision(left.value * right.value) };
                if (node.op === '/' && right.value !== 0) return { type: 'num', value: cleanPrecision(left.value / right.value) };
                if (node.op === '^') return { type: 'num', value: cleanPrecision(Math.pow(left.value, right.value)) };
            }

            if (node.op === '+') {
                if (left.type === 'num' && left.value === 0) return right;
                if (right.type === 'num' && right.value === 0) return left;
            }
            if (node.op === '-') {
                if (right.type === 'num' && right.value === 0) return left;
                if (left.type === 'num' && left.value === 0) return { type: 'neg', arg: right };
            }
            if (node.op === '*') {
                if ((left.type === 'num' && left.value === 0) || (right.type === 'num' && right.value === 0)) {
                    return { type: 'num', value: 0 };
                }
                if (left.type === 'num' && left.value === 1) return right;
                if (right.type === 'num' && right.value === 1) return left;
            }
            if (node.op === '/') {
                if (left.type === 'num' && left.value === 0) return { type: 'num', value: 0 };
                if (right.type === 'num' && right.value === 1) return left;
            }
            if (node.op === '^') {
                if (right.type === 'num' && right.value === 0) return { type: 'num', value: 1 };
                if (right.type === 'num' && right.value === 1) return left;
                if (left.type === 'num' && (left.value === 0 || left.value === 1)) return left;
            }

            return { type: 'bin', op: node.op, left, right };
        }

        return node;
    }

    function astToInfix(node, parentPrec = 0) {
        if (!node) return '';
        if (node.type === 'num') return String(cleanPrecision(node.value));
        if (node.type === 'const') return node.name;
        if (node.type === 'var') return node.name;
        if (node.type === 'neg') {
            const argStr = astToInfix(node.arg, 4);
            return '-' + (node.arg.type === 'bin' ? '(' + argStr + ')' : argStr);
        }
        if (node.type === 'func') {
            return node.name + '(' + astToInfix(node.arg, 0) + ')';
        }
        if (node.type === 'bin') {
            const def = OPERATORS[node.op] || { prec: 1 };
            const myPrec = def.prec;
            let leftStr = astToInfix(node.left, myPrec);
            let rightStr = astToInfix(node.right, myPrec + (def.assoc === 'L' ? 1 : 0));

            const res = leftStr + ' ' + (node.op === '*' ? '·' : node.op) + ' ' + rightStr;
            return myPrec < parentPrec ? '(' + res + ')' : res;
        }
        return '';
    }

    /**
     * Symbolic Differentiation of an expression
     */
    function derivative(expr, varName = 'x') {
        const tokens = tokenize(expr);
        const rpn = toRPN(tokens);
        const ast = buildAST(rpn);
        const diffed = diffAST(ast, varName);
        let simplified = simplifyAST(diffed);
        // Secondary simplification pass
        simplified = simplifyAST(simplified);
        return astToInfix(simplified).replace(/·/g, '*');
    }

    /**
     * Numerical Definite Integral via Simpson's 1/3 Rule
     * @param {string} expr - Function expression in terms of x
     * @param {number} a - Lower limit
     * @param {number} b - Upper limit
     * @param {number} n - Number of sub-intervals (must be even, default 1000)
     * @param {Object} context - Optional context
     */
    function definiteIntegral(expr, a, b, n = 1000, context = {}) {
        if (n % 2 !== 0) n += 1;
        const h = (b - a) / n;

        const evalAt = (xVal) => {
            return evaluate(expr, { ...context, x: xVal, angleMode: 'RAD' });
        };

        let sum = evalAt(a) + evalAt(b);
        for (let i = 1; i < n; i++) {
            const xi = a + i * h;
            const factor = (i % 2 === 0) ? 2 : 4;
            sum += factor * evalAt(xi);
        }

        const result = (h / 3) * sum;
        return cleanPrecision(result);
    }

    /**
     * Sample function values for canvas plotting safely without eval
     */
    function sampleFunction(expr, xMin, xMax, count = 500, context = {}) {
        const step = (xMax - xMin) / count;
        const points = [];

        for (let i = 0; i <= count; i++) {
            const x = xMin + i * step;
            let y = NaN;
            let valid = false;
            try {
                y = evaluate(expr, { ...context, x, angleMode: 'RAD' });
                if (isFinite(y)) valid = true;
            } catch {
                valid = false;
            }
            points.push({ x, y, valid });
        }
        return points;
    }

    /* ==========================================================
       PERSISTENT HISTORY STORE & ANS MEMORY
       ========================================================== */

    const HISTORY_STORAGE_KEY = 'math_engine_az_history_v1';
    const MAX_HISTORY_ENTRIES = 100;

    const HistoryStore = {
        lastResult: 0,

        getAll: function () {
            try {
                if (typeof localStorage === 'undefined') return [];
                const data = localStorage.getItem(HISTORY_STORAGE_KEY);
                return data ? JSON.parse(data) : [];
            } catch {
                return [];
            }
        },

        add: function (type, expression, result) {
            try {
                const history = this.getAll();
                const numResult = typeof result === 'number' ? result : parseFloat(result);
                if (!isNaN(numResult)) {
                    this.setAns(numResult);
                }

                const entry = {
                    id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                    type: type || 'Kalkulyator',
                    expression: String(expression),
                    result: String(result),
                    time: new Date().toLocaleTimeString('az')
                };

                history.unshift(entry);
                if (history.length > MAX_HISTORY_ENTRIES) {
                    history.pop();
                }

                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
                }
                return entry;
            } catch (err) {
                console.error('History save error:', err);
                return null;
            }
        },

        clear: function () {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem(HISTORY_STORAGE_KEY);
                }
            } catch (err) {
                console.error('History clear error:', err);
            }
        },

        getAns: function () {
            return this.lastResult;
        },

        setAns: function (val) {
            const cleanVal = cleanPrecision(val);
            this.lastResult = cleanVal;
            try {
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.setItem('math_engine_az_ans', String(cleanVal));
                }
            } catch {}
        },

        initAns: function () {
            try {
                if (typeof sessionStorage !== 'undefined') {
                    const saved = sessionStorage.getItem('math_engine_az_ans');
                    if (saved !== null) {
                        this.lastResult = parseFloat(saved) || 0;
                        return;
                    }
                }
                const history = this.getAll();
                if (history.length > 0) {
                    const parsed = parseFloat(history[0].result);
                    if (!isNaN(parsed)) this.lastResult = parsed;
                }
            } catch {}
        },

        exportJSON: function () {
            const history = this.getAll();
            const jsonStr = JSON.stringify(history, null, 2);
            if (typeof document !== 'undefined') {
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'math-engine-az-history.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            return jsonStr;
        }
    };

    // Auto-init ans from existing storage if available
    HistoryStore.initAns();

    return {
        evaluate,
        tokenize,
        toRPN,
        cleanPrecision,
        derivative,
        definiteIntegral,
        sampleFunction,
        HistoryStore,
        ERRORS,
        CONSTANTS,
        FUNCTIONS
    };
}));
