"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePackageJson = void 0;
async function computePackageJson({ packageDir, packageInfo, dependencies, sharedConfig = {}, }) {
    var _a, _b;
    const shared = { ...sharedConfig };
    Object.keys(shared).forEach((key) => {
        const value = shared[key];
        if (typeof value === 'string') {
            shared[key] = value
                .replace(/({name})/g, packageInfo.name) // {name}
                .replace(/({version})/g, packageInfo.version); // {version}
        }
    });
    const computedConfig = {
        ...shared,
        main: 'index.js',
        typings: 'index.d.ts',
        ...packageInfo.packageJson,
        name: packageInfo.name,
        version: packageInfo.version,
        dependencies: dependencies,
    };
    if (packageInfo.module === 'esm') {
        computedConfig.type = 'module';
        computedConfig.engines = (_a = computedConfig.engines) !== null && _a !== void 0 ? _a : {};
        computedConfig.engines.node = (_b = computedConfig.engines.node) !== null && _b !== void 0 ? _b : '>=14';
    }
    return computedConfig;
    //const factoryFile: string = path.join(packageDir, packageTransformFile);
    //
    //try {
    //  const { transformPackageJson } = requireTypescript<PackageTransformFile>(factoryFile);
    //  return typeof transformPackageJson === 'function' ? transformPackageJson(computedConfig) : computedConfig;
    //} catch {
    //  return computedConfig;
    //}
}
exports.computePackageJson = computePackageJson;
//# sourceMappingURL=computePackageJson.js.map