"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServerUI = void 0;
const dev_server_components_1 = require("@ssen/dev-server-components");
const child_process_1 = require("child_process");
const date_fns_1 = require("date-fns");
const ink_1 = require("ink");
const os_1 = __importDefault(require("os"));
const react_1 = __importStar(require("react"));
const types_1 = require("./types");
function DevServerUI({ header, devServer, cwd, logfile, proxyMessage, restartAlarm, }) {
    const [status, setStatus] = react_1.useState(types_1.DevServerStatus.STARTING);
    const [webpackStats, setWebpackStats] = react_1.useState({ status: 'waiting' });
    const [restartMessages, setRestartMessages] = react_1.useState(null);
    const [proxyMessages, setProxyMessages] = react_1.useState([]);
    react_1.useEffect(() => {
        const statusSubscription = devServer.status().subscribe(setStatus);
        const webpackStatsSubscription = devServer.webpackStats().subscribe(setWebpackStats);
        return () => {
            statusSubscription.unsubscribe();
            webpackStatsSubscription.unsubscribe();
        };
    }, [devServer]);
    react_1.useEffect(() => {
        if (restartAlarm) {
            const subscription = restartAlarm.subscribe((next) => {
                if (next.some((message) => !!message)) {
                    setRestartMessages(next.filter((message) => !!message));
                }
                else {
                    setRestartMessages(null);
                }
            });
            return () => {
                subscription.unsubscribe();
            };
        }
        else {
            setRestartMessages(null);
        }
    }, [restartAlarm]);
    react_1.useEffect(() => {
        if (proxyMessage) {
            const subscription = proxyMessage.subscribe((messages) => {
                setProxyMessages(messages);
            });
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [proxyMessage]);
    const webpackStatsJson = react_1.useMemo(() => {
        return webpackStats.status === 'done'
            ? webpackStats.statsData.toJson({
                all: false,
                errors: true,
                warnings: true,
                timings: true,
            })
            : null;
    }, [webpackStats]);
    const { isRawModeSupported } = ink_1.useStdin();
    ink_1.useInput((input) => {
        switch (input) {
            case 'b':
                if (os_1.default.platform() === 'win32') {
                    child_process_1.exec(`start ${devServer.url}`);
                }
                else {
                    child_process_1.exec(`open ${devServer.url}`);
                }
                break;
            case 'l':
                child_process_1.exec(`code ${logfile}`);
                break;
            case 'p':
                child_process_1.exec(`code ${cwd}`);
                break;
            case 'q':
                process.exit();
                break;
        }
    }, { isActive: isRawModeSupported === true });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        typeof header === 'string' ? react_1.default.createElement(ink_1.Text, null, header) : header,
        react_1.default.createElement(dev_server_components_1.PadText, { title: "Log", color: "blueBright" }, logfile),
        isRawModeSupported === true && (react_1.default.createElement(dev_server_components_1.PadText, { title: "Keys", color: "blueBright", children: `(b) Open ${devServer.url} (l) Open log with \`code\` (p) Open project with \`code\` (q) Quit` })),
        react_1.default.createElement(dev_server_components_1.PadText, { title: "Server", color: "blueBright" }, status === types_1.DevServerStatus.STARTING
            ? 'DevServer Starting...'
            : status === types_1.DevServerStatus.STARTED
                ? 'DevServer Started!'
                : status === types_1.DevServerStatus.CLOSING
                    ? 'DevServer Closing...'
                    : 'DevServer Closed.'),
        react_1.default.createElement(dev_server_components_1.Divider, { delimiter: "=" }, webpackStats.status === 'waiting'
            ? 'Server Stating...'
            : webpackStats.status === 'invalid'
                ? 'Compiling...'
                : webpackStatsJson
                    ? `Compiled (${webpackStatsJson.time}ms)`
                    : '?? Unknown Webpack Status ??'),
        restartMessages && restartMessages.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true, color: "green" }, "Restart server!"),
            restartMessages.map((message) => (react_1.default.createElement(ink_1.Text, { key: message, color: "green" }, message))))),
        webpackStatsJson && webpackStatsJson.errors.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true, color: "redBright" }, "Error"),
            webpackStatsJson.errors.map((text) => (react_1.default.createElement(ink_1.Text, { key: text, color: "redBright" }, text))))),
        webpackStatsJson && webpackStatsJson.warnings.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true, color: "yellow" }, "Warning"),
            webpackStatsJson.warnings.map((text) => (react_1.default.createElement(ink_1.Text, { key: text, color: "yellow" }, text))))),
        proxyMessages.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true }, "Proxy"),
            proxyMessages
                .slice()
                .reverse()
                .map(({ message, level, time }, i) => (react_1.default.createElement(ink_1.Text, { key: message + time, color: level === 'error' ? 'red' : level === 'warn' ? 'yellow' : undefined, dimColor: i > 3 },
                "[",
                date_fns_1.format(new Date(time), 'hh:mm:ss'),
                "] ",
                message)))))));
}
exports.DevServerUI = DevServerUI;
//# sourceMappingURL=DevServerUI.js.map