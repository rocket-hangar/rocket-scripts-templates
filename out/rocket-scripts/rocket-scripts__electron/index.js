"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./params"), exports);
__exportStar(require("./start"), exports);
__exportStar(require("./build"), exports);
var react_preset_1 = require("@rocket-scripts/react-preset");
Object.defineProperty(exports, "jestPreset", { enumerable: true, get: function () { return react_preset_1.jestPreset; } });
//# sourceMappingURL=index.js.map