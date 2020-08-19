"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observeAliasChange = void 0;
const utils_1 = require("@rocket-scripts/utils");
const rxjs_1 = require("rxjs");
const timers_1 = require("timers");
function observeAliasChange({ cwd, current, interval = 10000 }) {
    return new rxjs_1.Observable((subscriber) => {
        let intervalId = null;
        const currentString = Object.keys(current).sort().join(', ');
        function update() {
            const next = utils_1.getWebpackAlias(cwd);
            const nextString = Object.keys(next).sort().join(', ');
            if (currentString !== nextString) {
                subscriber.next(`alias changed : ${currentString} > ${nextString}`);
            }
            else {
                subscriber.next(null);
            }
        }
        intervalId = timers_1.setInterval(update, interval);
        return () => {
            if (intervalId) {
                timers_1.clearInterval(intervalId);
                intervalId = null;
            }
        };
    });
}
exports.observeAliasChange = observeAliasChange;
//# sourceMappingURL=observeAliasChange.js.map