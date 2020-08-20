"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.view = void 0;
const package_json_1 = __importDefault(require("package-json"));
const process_1 = __importDefault(require("process"));
const readPackages_1 = require("./entry/readPackages");
const view_1 = require("./message-handlers/view");
async function view({ cwd = process_1.default.cwd(), sourceRoot = 'src', entry, onMessage = view_1.viewMessageHandler, }) {
    const internalPackages = await readPackages_1.readPackages({ cwd, sourceRoot, entry });
    const originMetadatas = await Promise.all(Array.from(internalPackages.keys()).map((name) => package_json_1.default(name, {
        fullMetadata: true,
        allVersions: true,
    }).catch(() => undefined)));
    const metadatas = originMetadatas.filter((metadata) => !!metadata);
    for (const metadata of metadatas) {
        if (!internalPackages.has(metadata.name)) {
            throw new Error(`undefined package ${metadata.name}`);
        }
        const info = internalPackages.get(metadata.name);
        const tags = metadata['dist-tags'];
        await onMessage({
            type: 'view',
            metadata,
            tags,
            packageConfig: info,
        });
    }
}
exports.view = view;
//# sourceMappingURL=view.js.map