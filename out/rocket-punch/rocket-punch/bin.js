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
exports.run = void 0;
const path_1 = __importDefault(require("path"));
const process = __importStar(require("process"));
const yargs_1 = __importDefault(require("yargs"));
const build_1 = require("./build");
const doctor_1 = require("./doctor");
const readEntry_1 = require("./entry/readEntry");
const build_2 = require("./message-handlers/build");
const doctor_2 = require("./message-handlers/doctor");
const publish_1 = require("./message-handlers/publish");
const view_1 = require("./message-handlers/view");
const publish_2 = require("./publish");
const view_2 = require("./view");
const cwd = process.cwd();
const commonOptions = {
    emit: {
        type: 'boolean',
        default: true,
        describe: 'if you set this false it will only print options without run (e.g. --no-emit or --emit false)',
    },
    'source-root': {
        type: 'string',
        describe: 'source root (e.g. --source-root src)',
    },
};
const buildOptions = {
    'out-dir': {
        type: 'string',
        alias: 'o',
        describe: 'output directory (e.g. --out-dir out/packages)',
    },
    tsconfig: {
        type: 'string',
        alias: 't',
        describe: 'tsconfig file name (e.g. --tsconfig tsconfig.dev.json)',
    },
    svg: {
        type: 'string',
        choices: ['create-react-app', 'default'],
        describe: 'svg compile type <default|create-react-app> (e.g. --svg default)',
    },
};
const publishOptions = {
    'out-dir': buildOptions['out-dir'],
    'skip-selection': {
        type: 'boolean',
        alias: 's',
        describe: 'if true publish all packages without user selection',
    },
    tag: {
        type: 'string',
        alias: 't',
        describe: 'npm publish --tag {tag}',
    },
    access: {
        type: 'string',
        alias: 'a',
        describe: 'npm publish --access <public|private>',
    },
    registry: {
        type: 'string',
        alias: 'r',
        describe: 'npm publish --registry {registry}',
    },
};
function toAbsolutePath(dir) {
    if (typeof dir !== 'string') {
        return undefined;
    }
    else if (path_1.default.isAbsolute(dir)) {
        return dir;
    }
    else {
        return path_1.default.join(cwd, dir);
    }
}
function run() {
    return yargs_1.default
        .command({
        command: 'build',
        describe: 'Build packages',
        builder: (yargs) => yargs
            .options({
            ...buildOptions,
            ...commonOptions,
        })
            .example('$0 build --out-dir /some/directory', 'Build packages to specific directory')
            .example('$0 build --tsconfig tsconfig.build.json', 'Use another tsconfig.json file on build')
            .example('$0 build --svg default', 'SVG transform to `import ReactComponent from "./file.svg"`'),
        handler: ({ emit, outDir, tsconfig, sourceRoot, svg }) => {
            const params = {
                cwd,
                svg: svg === 'default' ? 'default' : 'create-react-app',
                dist: toAbsolutePath(outDir),
                tsconfig,
                sourceRoot,
                entry: readEntry_1.readEntry({ cwd }),
                onMessage: build_2.buildMessageHandler,
            };
            if (emit) {
                build_1.build(params);
            }
            else {
                console.log(params);
            }
        },
    })
        .command({
        command: 'publish',
        describe: 'Publish packages',
        builder: (yargs) => yargs
            .options({
            ...publishOptions,
            ...commonOptions,
        })
            .example('$0 publish', 'Publish packages')
            .example('$0 publish --out-dir /some/directory', 'Publish packages from specific directory')
            .example('$0 publish --skip-selection', 'Publish all packages without user selection (e.g. CI)')
            .example('$0 publish --skip-selection --tag e2e --registry http://localhost:4873', 'E2E test'),
        handler: ({ registry, outDir, sourceRoot, emit, access, skipSelection, tag, }) => {
            const params = {
                cwd,
                dist: toAbsolutePath(outDir),
                entry: readEntry_1.readEntry({ cwd }),
                skipSelection,
                sourceRoot,
                tag,
                access: access === 'public' || access === 'private' ? access : undefined,
                registry,
                onMessage: publish_1.publishMessageHandler,
            };
            if (emit) {
                publish_2.publish(params);
            }
            else {
                console.log(params);
            }
        },
    })
        .command({
        command: 'view',
        describe: 'View packages information',
        builder: (yargs) => yargs.options({ ...commonOptions }).example('$0 view', 'View packages information'),
        handler: ({ emit, sourceRoot }) => {
            const params = {
                cwd,
                sourceRoot,
                entry: readEntry_1.readEntry({ cwd }),
                onMessage: view_1.viewMessageHandler,
            };
            if (emit) {
                view_2.view(params);
            }
            else {
                console.log(params);
            }
        },
    })
        .command({
        command: 'doctor',
        describe: 'Check configs is validate for rocket-punch',
        builder: (yargs) => yargs
            .options({ ...commonOptions })
            .example('$0 doctor', 'Check configs is validate for rocket-punch'),
        handler: ({ emit, sourceRoot }) => {
            const params = {
                cwd,
                sourceRoot,
                entry: readEntry_1.readEntry({ cwd }),
                onMessage: doctor_2.doctorMessageHandler,
            };
            if (emit) {
                doctor_1.doctor(params);
            }
            else {
                console.log(params);
            }
        },
    })
        .wrap(null)
        .help('h')
        .alias('h', 'help')
        .showHelpOnFail(true)
        .demandCommand()
        .recommendCommands()
        .strict()
        .epilog('🚀 Rocket Punch!').argv;
}
exports.run = run;
//# sourceMappingURL=bin.js.map