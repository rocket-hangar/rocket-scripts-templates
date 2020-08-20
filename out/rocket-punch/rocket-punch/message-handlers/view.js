"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewMessageHandler = void 0;
const chalk_1 = __importDefault(require("chalk"));
async function viewMessageHandler(message) {
    switch (message.type) {
        case 'view':
            console.log(`📦 ${chalk_1.default.bold(message.metadata.name)} <${message.packageConfig.version}@${message.packageConfig.tag}>`);
            const tagList = Object.keys(message.tags);
            const maxLength = Math.max(...tagList.map((tag) => tag.length));
            tagList.forEach((tag) => {
                console.log(message.packageConfig.tag === tag
                    ? chalk_1.default.blueBright(`${tag.padEnd(maxLength, ' ')} : ${message.tags[tag]} `) + '*'
                    : chalk_1.default.gray(`${tag.padEnd(maxLength, ' ')} : ${message.tags[tag]}`));
            });
            console.log('');
            break;
    }
}
exports.viewMessageHandler = viewMessageHandler;
//# sourceMappingURL=view.js.map