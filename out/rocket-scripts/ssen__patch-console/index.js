"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchConsole = void 0;
const console_1 = require("console");
const methodNames = Object.keys(console).filter((method) => method !== 'Console' && method !== 'context' && typeof console[method] === 'function');
const originMethods = methodNames.reduce((methods, name) => {
    methods.set(name, console[name]);
    return methods;
}, new Map());
class ConsoleRouter {
    constructor() {
        this.consoles = new Set();
        this.add = (console) => this.consoles.add(console);
        this.delete = (console) => this.consoles.delete(console);
        this.size = () => this.consoles.size;
        this.memory = 0;
        this.exception = (...args) => this.consoles.forEach((console) => console.exception(...args));
        this.assert = (...args) => this.consoles.forEach((console) => console.assert(...args));
        this.clear = () => this.consoles.forEach((console) => console.clear());
        this.count = (...args) => this.consoles.forEach((console) => console.count(...args));
        this.countReset = (...args) => this.consoles.forEach((console) => console.countReset(...args));
        this.debug = (...args) => this.consoles.forEach((console) => console.debug(...args));
        this.dir = (...args) => this.consoles.forEach((console) => console.dir(...args));
        this.dirxml = (...args) => this.consoles.forEach((console) => console.dirxml(...args));
        this.error = (...args) => this.consoles.forEach((console) => console.error(...args));
        this.group = (...args) => this.consoles.forEach((console) => console.group(...args));
        this.groupCollapsed = (...args) => this.consoles.forEach((console) => console.groupCollapsed(...args));
        this.groupEnd = () => this.consoles.forEach((console) => console.groupEnd());
        this.info = (...args) => this.consoles.forEach((console) => console.info(...args));
        this.log = (...args) => this.consoles.forEach((console) => console.log(...args));
        this.table = (...args) => this.consoles.forEach((console) => console.table(...args));
        this.time = (...args) => this.consoles.forEach((console) => console.time(...args));
        this.timeEnd = (...args) => this.consoles.forEach((console) => console.timeEnd(...args));
        this.timeLog = (...args) => this.consoles.forEach((console) => console.timeLog(...args));
        this.trace = (...args) => this.consoles.forEach((console) => console.trace(...args));
        this.warn = (...args) => this.consoles.forEach((console) => console.warn(...args));
        this.profile = (...args) => this.consoles.forEach((console) => console.profile(...args));
        this.profileEnd = (...args) => this.consoles.forEach((console) => console.profileEnd(...args));
        this.timeStamp = (...args) => this.consoles.forEach((console) => console.timeStamp(...args));
    }
}
let router;
function patchConsole(options) {
    const childConsole = new console_1.Console(options);
    if (!router) {
        router = new ConsoleRouter();
        for (const method of methodNames) {
            console[method] = router[method];
        }
    }
    router.add(childConsole);
    return () => {
        if (!router)
            return;
        router.delete(childConsole);
        if (router.size() === 0) {
            for (const method of methodNames) {
                console[method] = originMethods.get(method);
            }
            router = null;
        }
    };
}
exports.patchConsole = patchConsole;
//# sourceMappingURL=index.js.map