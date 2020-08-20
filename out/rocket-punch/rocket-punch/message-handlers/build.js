"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMessageHandler = void 0;
const typescript_1 = __importDefault(require("typescript"));
const chalk_1 = __importDefault(require("chalk"));
async function buildMessageHandler(message) {
    switch (message.type) {
        case 'begin':
            console.log(chalk_1.default.bold(`Build "${message.packageName}"`));
            console.log('');
            break;
        case 'tsc':
            for (const diagnostic of message.diagnostics) {
                if (diagnostic.file && diagnostic.start) {
                    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    const message = typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                    console.log(chalk_1.default.yellow(`TS${diagnostic.code} : ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`));
                }
                else {
                    console.log(chalk_1.default.yellow(`TS${diagnostic.code} : ${typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`));
                }
            }
            break;
        case 'package-json':
            console.log(chalk_1.default.gray(JSON.stringify(message.packageJson, null, 2)));
            console.log('');
            break;
        case 'success':
            console.log(chalk_1.default.blueBright(`👍 ${message.packageName}@${message.packageJson.version} → ${message.outDir}`));
            console.log('');
            break;
    }
}
exports.buildMessageHandler = buildMessageHandler;
//# sourceMappingURL=build.js.map