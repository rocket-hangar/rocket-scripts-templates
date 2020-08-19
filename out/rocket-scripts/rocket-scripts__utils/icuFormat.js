"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.icuFormat = void 0;
const intl_messageformat_1 = require("intl-messageformat");
/**
 * icu format based https://formatjs.io/docs/intl-messageformat
 * @param text source text (e.g. "Hello, {name}!")
 * @param vars variables (e.g. { name: "Jane" })
 * @return formatted text (e.g. "Hello, Jane!")
 */
function icuFormat(text, vars) {
    const { format } = new intl_messageformat_1.IntlMessageFormat(text);
    const result = format(vars);
    return Array.isArray(result) ? result.join(' ') : result.toString();
}
exports.icuFormat = icuFormat;
//# sourceMappingURL=icuFormat.js.map