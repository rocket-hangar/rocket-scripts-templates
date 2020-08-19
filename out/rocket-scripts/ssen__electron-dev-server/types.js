"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronServerStatus = exports.WebpackServerStatus = void 0;
var WebpackServerStatus;
(function (WebpackServerStatus) {
    WebpackServerStatus[WebpackServerStatus["STARTING"] = 0] = "STARTING";
    WebpackServerStatus[WebpackServerStatus["STARTED"] = 1] = "STARTED";
    WebpackServerStatus[WebpackServerStatus["CLOSING"] = 2] = "CLOSING";
    WebpackServerStatus[WebpackServerStatus["CLOSED"] = 3] = "CLOSED";
})(WebpackServerStatus = exports.WebpackServerStatus || (exports.WebpackServerStatus = {}));
var ElectronServerStatus;
(function (ElectronServerStatus) {
    ElectronServerStatus[ElectronServerStatus["WAITING"] = 0] = "WAITING";
    ElectronServerStatus[ElectronServerStatus["STARTED"] = 1] = "STARTED";
    ElectronServerStatus[ElectronServerStatus["CLOSED"] = 2] = "CLOSED";
})(ElectronServerStatus = exports.ElectronServerStatus || (exports.ElectronServerStatus = {}));
//# sourceMappingURL=types.js.map