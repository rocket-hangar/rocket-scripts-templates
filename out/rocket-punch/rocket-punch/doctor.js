"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctor = void 0;
const read_tsconfig_1 = require("@ssen/read-tsconfig");
const depcheck_1 = __importDefault(require("depcheck"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const readPackages_1 = require("./entry/readPackages");
const doctor_1 = require("./message-handlers/doctor");
async function doctor({ cwd = process_1.default.cwd(), entry, sourceRoot = 'src', tsconfig = 'tsconfig.json', onMessage = doctor_1.doctorMessageHandler, }) {
    var _a;
    const internalPackages = await readPackages_1.readPackages({ cwd, sourceRoot, entry });
    const depcheckResult = await depcheck_1.default(cwd, {
        ignoreMatches: [...Array.from(internalPackages.values()).map(({ name }) => name)],
    });
    await onMessage({
        type: 'depcheck',
        result: depcheckResult,
    });
    const { options } = read_tsconfig_1.readTSConfig(path_1.default.join(cwd, tsconfig));
    const tsconfigResult = [];
    // TODO src to be user configurable
    if (!/src$/.test((_a = options.baseUrl) !== null && _a !== void 0 ? _a : '')) {
        tsconfigResult.push({
            message: `compilerOptions.baseUrl should be "src".`,
            fixer: {
                compilerOptions: {
                    baseUrl: 'src',
                },
            },
        });
    }
    if (tsconfigResult.length > 0) {
        await onMessage({
            type: 'tsconfig',
            result: tsconfigResult,
        });
    }
}
exports.doctor = doctor;
//# sourceMappingURL=doctor.js.map