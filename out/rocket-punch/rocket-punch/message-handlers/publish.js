"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMessageHandler = void 0;
const promised_1 = require("@ssen/promised");
const chalk_1 = __importDefault(require("chalk"));
async function publishMessageHandler(message) {
    switch (message.type) {
        case 'exec':
            console.log(chalk_1.default.bold(message.command));
            console.log('');
            const { stderr, stdout } = await promised_1.exec(message.command, { encoding: 'utf8' });
            console.log(stdout);
            console.error(chalk_1.default.grey(stderr));
            break;
    }
}
exports.publishMessageHandler = publishMessageHandler;
//# sourceMappingURL=publish.js.map