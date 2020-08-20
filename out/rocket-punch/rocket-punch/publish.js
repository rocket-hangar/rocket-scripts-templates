"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = void 0;
const flat_package_name_1 = require("@ssen/flat-package-name");
const publish_packages_1 = require("@ssen/publish-packages");
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const readPackages_1 = require("./entry/readPackages");
const publish_1 = require("./message-handlers/publish");
async function publish({ cwd = process_1.default.cwd(), sourceRoot = 'src', dist = path_1.default.join(cwd, 'out/packages'), skipSelection = false, tag, access, entry, registry, onMessage = publish_1.publishMessageHandler, }) {
    const packages = await readPackages_1.readPackages({
        cwd,
        sourceRoot,
        entry,
    });
    const publishOptions = await publish_packages_1.getPublishOptions({
        packages,
        outDir: dist,
        tag,
        registry,
    });
    const selectedPublishOptions = await publish_packages_1.selectPublishOptions({
        publishOptions,
        skipSelection,
    });
    for (const publishOption of selectedPublishOptions) {
        const packageInfo = packages.get(publishOption.name);
        if (!packageInfo) {
            throw new Error(`Undefined packageInfo "${publishOption.name}"`);
        }
        const p = [`--tag ${tag || publishOption.tag}`];
        if (access) {
            p.push(`--access ${access}`);
        }
        else if (packageInfo.access) {
            p.push(`--access ${packageInfo.access}`);
        }
        if (registry) {
            p.push(`--registry "${registry}"`);
        }
        else if (packageInfo.registry) {
            p.push(`--registry "${packageInfo.registry}"`);
        }
        const command = process_1.default.platform === 'win32'
            ? `cd "${path_1.default.join(dist, flat_package_name_1.flatPackageName(publishOption.name))}" && npm publish ${p.join(' ')}`
            : `cd "${path_1.default.join(dist, flat_package_name_1.flatPackageName(publishOption.name))}"; npm publish ${p.join(' ')};`;
        await onMessage({
            type: 'exec',
            command,
            publishOption,
        });
    }
}
exports.publish = publish;
//# sourceMappingURL=publish.js.map