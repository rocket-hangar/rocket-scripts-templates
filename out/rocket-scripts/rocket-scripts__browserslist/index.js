"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowserslistQuery = exports.defaultQuery = void 0;
const node_1 = require("browserslist/node");
exports.defaultQuery = {
    production: ['chrome > 60', 'firefox > 60', 'safari > 12'],
    development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
    server: 'node 10',
    server_development: 'current node',
    electron: 'last 1 electron version',
    package: ['chrome > 60', 'firefox > 60', 'safari > 12'],
    defaults: 'current node',
};
function getBrowserslistQuery({ cwd, env }) {
    if (env)
        process.env.BROWSERSLIST_ENV = env;
    const query = node_1.loadConfig({ path: cwd });
    return query || exports.defaultQuery[process.env.BROWSERSLIST_ENV || 'defaults'] || exports.defaultQuery.defaults;
}
exports.getBrowserslistQuery = getBrowserslistQuery;
//# sourceMappingURL=index.js.map