"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Divider = void 0;
const ink_1 = require("ink");
const react_1 = __importDefault(require("react"));
function Divider({ indent = 1, children, width = process.stdout.columns - 9, delimiter = '-', ...textProps }) {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Text, Object.assign({}, textProps),
            ' ',
            '\n',
            delimiter.repeat(indent),
            (' ' + children + ' ').padEnd(width, delimiter))));
}
exports.Divider = Divider;
//# sourceMappingURL=Divider.js.map