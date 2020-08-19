"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inkToString = exports.createInkWriteStream = exports.InkWritableStream = void 0;
const events_1 = require("events");
const ink_1 = require("ink");
class InkWritableStream extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.frames = [];
        this.write = (frame) => {
            this.frames.push(frame);
            this._lastFrame = frame;
        };
        this.lastFrame = () => {
            return this._lastFrame;
        };
    }
    get columns() {
        return 100;
    }
}
exports.InkWritableStream = InkWritableStream;
function createInkWriteStream() {
    return new InkWritableStream();
}
exports.createInkWriteStream = createInkWriteStream;
function inkToString(element) {
    var _a;
    const stdout = createInkWriteStream();
    const { unmount } = ink_1.render(element, { stdout, patchConsole: false });
    unmount();
    return (_a = stdout.lastFrame()) !== null && _a !== void 0 ? _a : '';
}
exports.inkToString = inkToString;
//# sourceMappingURL=index.js.map