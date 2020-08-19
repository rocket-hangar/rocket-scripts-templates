"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observeAppEntryChange = void 0;
const chokidar_1 = require("chokidar");
const rxjs_1 = require("rxjs");
const getAppEntry_1 = require("./getAppEntry");
function observeAppEntryChange({ appDir, current }) {
    return new rxjs_1.Observable((subscriber) => {
        function update() {
            const next = getAppEntry_1.getAppEntry({ appDir });
            if (current.length !== next.length ||
                current.map(({ name }) => name).join('') !== next.map(({ name }) => name).join('')) {
                const message = [
                    `entry changed : `,
                    current.map(({ name }) => name).join(', '),
                    ` > `,
                    next.map(({ name }) => name).join(', '),
                ];
                subscriber.next(message.join(''));
            }
            else {
                subscriber.next(null);
            }
        }
        const watcher = chokidar_1.watch([`${appDir}/*.{js,jsx,ts,tsx}`, `${appDir}/*.html`])
            .on('add', update)
            .on('unlink', update);
        return () => {
            watcher.close();
        };
    });
}
exports.observeAppEntryChange = observeAppEntryChange;
//# sourceMappingURL=observeAppEntryChange.js.map