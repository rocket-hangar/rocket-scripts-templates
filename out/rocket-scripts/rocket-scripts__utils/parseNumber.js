"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNumber = void 0;
function parseNumber(source) {
    const n = typeof source === 'number' ? source : Number(source);
    return !isNaN(n) ? n : undefined;
}
exports.parseNumber = parseNumber;
//# sourceMappingURL=parseNumber.js.map