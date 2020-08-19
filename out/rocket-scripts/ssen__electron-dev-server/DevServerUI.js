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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServerUI = void 0;
const dev_server_components_1 = require("@ssen/dev-server-components");
const child_process_1 = require("child_process");
const ink_1 = require("ink");
const react_1 = __importStar(require("react"));
const types_1 = require("./types");
const date_fns_1 = require("date-fns");
function DevServerUI({ header, webpackServer, electronServer, syncStaticFiles, cwd, logfile, restartAlarm, }) {
    const [webpackServerStatus, setWebpackServerStatus] = react_1.useState(types_1.WebpackServerStatus.STARTING);
    const [webpackMainStats, setWebpackMainStats] = react_1.useState({ status: 'waiting' });
    const [webpackRendererStats, setWebpackRendererStats] = react_1.useState({ status: 'waiting' });
    const [restartMessages, setRestartMessages] = react_1.useState(null);
    const [syncStaticFilesMessages, setSyncStaticFilesMessages] = react_1.useState([]);
    react_1.useEffect(() => {
        const statusSubscription = webpackServer.status().subscribe(setWebpackServerStatus);
        const mainStatsSubscription = webpackServer.mainWebpackStats().subscribe(setWebpackMainStats);
        const rendererStatsSubscription = webpackServer.rendererWebpackStats().subscribe(setWebpackRendererStats);
        return () => {
            statusSubscription.unsubscribe();
            mainStatsSubscription.unsubscribe();
            rendererStatsSubscription.unsubscribe();
        };
    }, [webpackServer]);
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
        if (syncStaticFiles) {
            const subscription = syncStaticFiles.subscribe((message) => {
                setSyncStaticFilesMessages((prev) => {
                    return [message, ...prev].slice(0, 5);
                });
            });
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [syncStaticFiles]);
    const webpackMainStatsJson = react_1.useMemo(() => {
        return webpackMainStats.status === 'done'
            ? webpackMainStats.statsData.toJson({
                all: false,
                errors: true,
                warnings: true,
                timings: true,
            })
            : null;
    }, [webpackMainStats]);
    const webpackRendererStatsJson = react_1.useMemo(() => {
        return webpackRendererStats.status === 'done'
            ? webpackRendererStats.statsData.toJson({
                all: false,
                errors: true,
                warnings: true,
                timings: true,
            })
            : null;
    }, [webpackRendererStats]);
    const { isRawModeSupported } = ink_1.useStdin();
    ink_1.useInput((input) => {
        switch (input) {
            case 'r':
                electronServer.restart();
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
        isRawModeSupported === true && (react_1.default.createElement(dev_server_components_1.PadText, { title: "Keys", color: "blueBright", children: `(r) Restart Electron Main (l) Open log with \`code\` (p) Open project with \`code\` (q) Quit` })),
        react_1.default.createElement(dev_server_components_1.PadText, { title: "Server", color: "blueBright" }, webpackServerStatus === types_1.WebpackServerStatus.STARTING
            ? 'Webpack Starting...'
            : webpackServerStatus === types_1.WebpackServerStatus.STARTED
                ? 'Webpack Started!'
                : webpackServerStatus === types_1.WebpackServerStatus.CLOSING
                    ? 'Webpack Closing...'
                    : 'Webpack Closed.'),
        restartMessages && restartMessages.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true, color: "green", delimiter: "=" }, "Restart Dev Server!"),
            restartMessages.map((message) => (react_1.default.createElement(ink_1.Text, { key: message, color: "green" }, message))))),
        react_1.default.createElement(dev_server_components_1.Divider, { delimiter: "=" }, webpackMainStats.status === 'waiting'
            ? 'Webpack<main, preload> Stating...'
            : webpackMainStats.status === 'invalid'
                ? 'Webpack<main, preload> Compiling...'
                : webpackMainStatsJson
                    ? `Webpack<main, preload> Compiled (${webpackMainStatsJson.time}ms)`
                    : '?? Webpack<main, preload> Unknown Webpack Status ??'),
        webpackMainStatsJson && webpackMainStatsJson.errors.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true, color: "redBright" }, "Error"),
            webpackMainStatsJson.errors.map((text) => (react_1.default.createElement(ink_1.Text, { key: text, color: "redBright" }, text))))),
        webpackMainStatsJson && webpackMainStatsJson.warnings.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true, color: "yellow" }, "Warning"),
            webpackMainStatsJson.warnings.map((text) => (react_1.default.createElement(ink_1.Text, { key: text, color: "yellow" }, text))))),
        react_1.default.createElement(dev_server_components_1.Divider, { delimiter: "=" }, webpackRendererStats.status === 'waiting'
            ? 'Webpack<renderer> Stating...'
            : webpackRendererStats.status === 'invalid'
                ? 'Webpack<renderer> Compiling...'
                : webpackRendererStatsJson
                    ? `Webpack<renderer> Compiled (${webpackRendererStatsJson.time}ms)`
                    : '?? Webpack<renderer> Unknown Webpack Status ??'),
        webpackRendererStatsJson && webpackRendererStatsJson.errors.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true, color: "redBright" }, "Error"),
            webpackRendererStatsJson.errors.map((text) => (react_1.default.createElement(ink_1.Text, { key: text, color: "redBright" }, text))))),
        webpackRendererStatsJson && webpackRendererStatsJson.warnings.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true, color: "yellow" }, "Warning"),
            webpackRendererStatsJson.warnings.map((text) => (react_1.default.createElement(ink_1.Text, { key: text, color: "yellow" }, text))))),
        syncStaticFilesMessages.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(dev_server_components_1.Divider, { bold: true }, "Sync Static Files"),
            syncStaticFilesMessages.map(({ type, file, time }, i) => (react_1.default.createElement(ink_1.Text, { key: file + time.getTime(), color: type === 'undefined' ? 'red' : undefined, dimColor: i > 3 },
                "[",
                date_fns_1.format(time, 'hh:mm:ss'),
                "] [",
                type,
                "] ",
                file)))))));
}
exports.DevServerUI = DevServerUI;
//# sourceMappingURL=DevServerUI.js.map