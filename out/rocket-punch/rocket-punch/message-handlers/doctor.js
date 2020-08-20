"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorMessageHandler = void 0;
const chalk_1 = __importDefault(require("chalk"));
async function doctorMessageHandler(message) {
    switch (message.type) {
        case 'depcheck':
            const { dependencies, devDependencies, missing } = message.result;
            if (dependencies.length > 0) {
                console.log(chalk_1.default.bold(`Do you use these dependencies? couldn't find your source codes that using these dependencies.`));
                for (const packageName of dependencies) {
                    console.log(chalk_1.default.yellow(`- ${packageName}`));
                }
                console.log('');
            }
            if (devDependencies.length > 0) {
                console.log(chalk_1.default.bold(`Do you use these devDependencies? couldn't find your source codes that using these devDependencies.`));
                for (const packageName of devDependencies) {
                    console.log(chalk_1.default.yellow(`- ${packageName}`));
                }
                console.log('');
            }
            const missingKeys = Object.keys(missing);
            if (missingKeys.length > 0) {
                console.log(chalk_1.default.bold(`Did you install these dependencies? couldn't find these dependencies in your package.json.`));
                for (const packageName of missingKeys) {
                    console.log(chalk_1.default.yellow(`- ${packageName}`));
                }
                console.log('');
            }
            break;
        case 'tsconfig':
            for (const result of message.result) {
                console.log(chalk_1.default.bold(result.message));
                console.log(chalk_1.default.blueBright(JSON.stringify(result.fixer, null, 2)));
            }
            break;
    }
}
exports.doctorMessageHandler = doctorMessageHandler;
//# sourceMappingURL=doctor.js.map