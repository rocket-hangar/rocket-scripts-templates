"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PadText = void 0;
const ink_1 = require("ink");
const react_1 = __importDefault(require("react"));
function PadText({ title, children, indent = 1, titleWidth = 7, ...textProps }) {
    return (react_1.default.createElement(ink_1.Text, Object.assign({}, textProps),
        ' '.repeat(indent),
        title.padEnd(titleWidth, ' '),
        " : ",
        children));
}
exports.PadText = PadText;
//# sourceMappingURL=PadText.js.map