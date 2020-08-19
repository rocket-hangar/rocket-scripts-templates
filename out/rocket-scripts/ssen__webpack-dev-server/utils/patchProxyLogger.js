"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchProxyLogger = void 0;
function toMessage(args, level) {
    return {
        time: Date.now(),
        level,
        message: args.join(' '),
    };
}
function patchProxyLogger({ proxyConfig, subject }) {
    let messages = [];
    function next(args, level) {
        const prevMessages = messages.length > 9 ? messages.slice(messages.length - 9) : messages;
        const nextMessages = [...prevMessages, toMessage(args, level)];
        subject.next(nextMessages);
        messages = nextMessages;
    }
    const logProvider = {
        log: (...args) => {
            console.log(...args);
            next(args, 'log');
        },
        info: (...args) => {
            console.info(...args);
            next(args, 'info');
        },
        debug: (...args) => {
            console.debug(...args);
            next(args, 'debug');
        },
        warn: (...args) => {
            console.warn(...args);
            next(args, 'warn');
        },
        error: (...args) => {
            console.error(...args);
            next(args, 'error');
        },
    };
    if (Array.isArray(proxyConfig)) {
        return proxyConfig.map((config) => ({
            ...config,
            logProvider: () => logProvider,
        }));
    }
    else {
        return Object.keys(proxyConfig).reduce((config, context) => {
            const contextConfig = proxyConfig[context];
            config[context] =
                typeof contextConfig === 'string'
                    ? {
                        // https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L242
                        target: contextConfig,
                    }
                    : {
                        ...contextConfig,
                        logProvider: () => logProvider,
                    };
            return config;
        }, {});
    }
}
exports.patchProxyLogger = patchProxyLogger;
//# sourceMappingURL=patchProxyLogger.js.map