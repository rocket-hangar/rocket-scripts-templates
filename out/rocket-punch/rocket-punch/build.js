"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const collect_dependencies_1 = require("@ssen/collect-dependencies");
const extended_compiler_host_1 = require("@ssen/extended-compiler-host");
const flat_package_name_1 = require("@ssen/flat-package-name");
const import_path_rewrite_compiler_host_1 = require("@ssen/import-path-rewrite-compiler-host");
const promised_1 = require("@ssen/promised");
const rewrite_src_path_1 = require("@ssen/rewrite-src-path");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const typescript_1 = __importDefault(require("typescript"));
const readPackages_1 = require("./entry/readPackages");
const build_1 = require("./message-handlers/build");
const computePackageJson_1 = require("./package-json/computePackageJson");
const getRootDependencies_1 = require("./package-json/getRootDependencies");
const getSharedPackageJson_1 = require("./package-json/getSharedPackageJson");
const fsCopyFilter_1 = require("./rule/fsCopyFilter");
const getCompilerOptions_1 = require("./rule/getCompilerOptions");
const readDirectoryPatterns_1 = require("./rule/readDirectoryPatterns");
async function build({ cwd = process_1.default.cwd(), sourceRoot = 'src', dist = path_1.default.resolve(cwd, 'out/packages'), tsconfig = 'tsconfig.json', entry, svg = 'create-react-app', transformPackageJson, transformCompilerHost, transformCompilerOptions, emitCustomTransformers, onMessage = build_1.buildMessageHandler, }) {
    // ---------------------------------------------
    // set env
    // ---------------------------------------------
    if (svg === 'default') {
        process_1.default.env.TS_SVG_EXPORT = 'default';
    }
    // ---------------------------------------------
    // rule
    // collect information based on directory rules
    // ---------------------------------------------
    const internalPackages = await readPackages_1.readPackages({ cwd, sourceRoot, entry });
    const externalPackages = await getRootDependencies_1.getRootDependencies({ cwd });
    const sharedConfig = await getSharedPackageJson_1.getSharedPackageJson({ cwd });
    // ---------------------------------------------
    // entry
    // create build options based on rule output
    // ---------------------------------------------
    const dependenciesMap = new Map();
    // collect dependencies each package
    for (const packageName of internalPackages.keys()) {
        const imports = await collect_dependencies_1.collectDependencies({
            // collect dependencies from sources on {cwd}/src/{package}
            rootDir: path_1.default.resolve(cwd, sourceRoot, packageName),
            internalPackages: internalPackages,
            externalPackages,
            selfNames: new Set([packageName]),
            checkUndefinedPackage: 'error',
            fixImportPath: ({ importPath, filePath }) => rewrite_src_path_1.rewriteSrcPath({
                rootDir: path_1.default.resolve(cwd, sourceRoot),
                importPath,
                filePath,
            }),
            ...collect_dependencies_1.collectScripts,
        });
        dependenciesMap.set(packageName, imports);
    }
    const packageJsonMap = new Map();
    // compute package.json contents each package
    for (const [packageName, packageInfo] of internalPackages) {
        const dependencies = dependenciesMap.get(packageName);
        if (!dependencies) {
            throw new Error(`undefiend dependencies of ${packageName}`);
        }
        const packageDir = path_1.default.resolve(cwd, sourceRoot, packageName);
        // compute package.json
        const computedPackageJson = await computePackageJson_1.computePackageJson({
            packageInfo,
            sharedConfig,
            packageDir,
            dependencies,
        });
        // transform package.json contents if user did set the transformPackageJson() function
        const packageJson = typeof transformPackageJson === 'function'
            ? transformPackageJson(packageName)(computedPackageJson)
            : computedPackageJson;
        packageJsonMap.set(packageName, packageJson);
    }
    // get package build order
    // it will sort depends on packages dependency relationship
    const order = await collect_dependencies_1.getPackagesOrder({
        packageJsonContents: Array.from(packageJsonMap.values()),
    });
    // ---------------------------------------------
    // run
    // build packages
    // ---------------------------------------------
    const symlinkDirs = [];
    // ================================================================
    // build each packages
    // ================================================================
    for (const packageName of order) {
        const packageInfo = internalPackages.get(packageName);
        if (!packageInfo) {
            throw new Error(`Undefined packageInfo of ${packageName}`);
        }
        const sourceDir = path_1.default.resolve(cwd, sourceRoot, packageName);
        const outDir = path_1.default.resolve(dist, flat_package_name_1.flatPackageName(packageName));
        const packageJson = packageJsonMap.get(packageName);
        if (!packageJson) {
            throw new Error(`undefined packagejson content!`);
        }
        await onMessage({
            type: 'begin',
            packageName,
            sourceDir,
            outDir,
        });
        // ---------------------------------------------
        // clean
        // ---------------------------------------------
        await promised_1.rimraf(outDir);
        await fs_extra_1.default.mkdirp(outDir);
        // ---------------------------------------------
        // symlink
        // this symlink will be reference to next build packages
        // ---------------------------------------------
        const symlink = path_1.default.resolve(cwd, 'node_modules', packageName);
        if (fs_extra_1.default.existsSync(symlink) && fs_extra_1.default.lstatSync(symlink).isSymbolicLink()) {
            fs_extra_1.default.unlinkSync(symlink);
        }
        await fs_extra_1.default.mkdirp(path_1.default.dirname(symlink));
        await fs_extra_1.default.symlink(outDir, symlink);
        symlinkDirs.push(symlink);
        // ---------------------------------------------
        // tsc
        // ---------------------------------------------
        // read compilerOptions from {cwd}/tsconfig.json
        const userCompilerOptions = getCompilerOptions_1.getCompilerOptions({
            searchPath: cwd,
            configName: tsconfig,
            packageInfo,
        });
        // compute package.json with add some build information
        const computedCompilerOptions = {
            ...userCompilerOptions,
            baseUrl: sourceDir,
            paths: {
                ...userCompilerOptions.paths,
                [packageName]: [sourceDir],
            },
            rootDir: sourceDir,
            outDir,
        };
        // transform compilerOptions if user set the transformCompilerOptions() function
        const compilerOptions = typeof transformCompilerOptions === 'function'
            ? transformCompilerOptions(packageName)(computedCompilerOptions)
            : computedCompilerOptions;
        // create compilerHost
        const extendedHost = extended_compiler_host_1.createExtendedCompilerHost(compilerOptions);
        const pathRewriteHost = import_path_rewrite_compiler_host_1.createImportPathRewriteCompilerHost({
            src: path_1.default.resolve(cwd, sourceRoot),
            rootDir: sourceDir,
        })(compilerOptions, undefined, extendedHost);
        // transform compilerHost if user set the transformCompilerHost() function
        const host = typeof transformCompilerHost === 'function'
            ? transformCompilerHost(packageName)(compilerOptions, pathRewriteHost)
            : pathRewriteHost;
        const files = host.readDirectory(sourceDir, ...readDirectoryPatterns_1.readDirectoryPatterns);
        const program = typescript_1.default.createProgram(files, compilerOptions, host);
        // 🔥 compile!!!!!!!!!
        const emitResult = program.emit(undefined, undefined, undefined, undefined, typeof emitCustomTransformers === 'function' ? emitCustomTransformers(packageName)() : undefined);
        const diagnostics = typescript_1.default.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        await onMessage({
            type: 'tsc',
            packageName,
            compilerOptions,
            diagnostics,
        });
        if (emitResult.emitSkipped) {
            throw new Error(`Build "${packageName}" is failed`);
        }
        // ---------------------------------------------
        // copy static files
        // ---------------------------------------------
        await fs_extra_1.default.copy(path_1.default.resolve(cwd, sourceRoot, packageName), outDir, {
            filter: fsCopyFilter_1.fsCopyFilter,
        });
        // ---------------------------------------------
        // create package.json
        // ---------------------------------------------
        await fs_extra_1.default.writeJson(path_1.default.resolve(outDir, 'package.json'), packageJson, { encoding: 'utf8', spaces: 2 });
        await onMessage({
            type: 'package-json',
            packageName,
            packageJson,
        });
        await onMessage({
            type: 'success',
            packageJson,
            packageName,
            sourceDir,
            outDir,
        });
    }
    // clean symlinks on node_modules
    for (const symlink of symlinkDirs) {
        fs_extra_1.default.unlinkSync(symlink);
    }
}
exports.build = build;
//# sourceMappingURL=build.js.map