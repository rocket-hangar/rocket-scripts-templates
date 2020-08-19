"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterReactEnv = void 0;
function filterReactEnv(env) {
    return Object.keys(env)
        .filter((key) => /^REACT_APP_/i.test(key))
        .reduce((e, key) => {
        e[key] = env[key];
        return e;
    }, {});
}
exports.filterReactEnv = filterReactEnv;
//# sourceMappingURL=filterReactEnv.js.map