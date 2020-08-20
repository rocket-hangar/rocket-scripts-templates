"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectDependencies = exports.collectScripts = exports.collectTypeScript = void 0;
const module_1 = require("module");
const typescript_1 = __importDefault(require("typescript"));
const nodeAPIList = new Set(module_1.builtinModules);
exports.collectTypeScript = {
    extensions: ['.ts', '.tsx'],
    excludes: [
        // exclude tests
        '**/*.(spec|test).(js|jsx|ts|tsx)',
        '**/__*',
        // exclude public
        '**/public',
        '**/bin',
        // exclude javascript
        '**/*.js',
        '**/*.jsx',
    ],
    includes: ['**/*'],
};
exports.collectScripts = {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    excludes: [
        // exclude tests
        '**/*.(spec|test).(js|jsx|ts|tsx)',
        '**/__*',
        // exclude public
        '**/public',
        '**/bin',
        // exclude public
        '**/public',
    ],
    includes: ['**/*'],
};
async function collectDependencies({ rootDir, internalPackages = new Map(), externalPackages, extensions = exports.collectTypeScript.extensions, excludes = exports.collectTypeScript.excludes, includes = exports.collectTypeScript.includes, compilerOptions = {}, selfNames = new Set(), fixImportPath, checkUndefinedPackage = 'error', }) {
    compilerOptions = {
        allowJs: extensions.some((ext) => /^.js/.test(ext)),
        ...compilerOptions,
        rootDir,
    };
    const host = typescript_1.default.createCompilerHost(compilerOptions);
    const files = host.readDirectory(rootDir, extensions, excludes, includes);
    const program = typescript_1.default.createProgram(files, compilerOptions, host);
    const importPaths = new Set();
    for (const file of files) {
        const sourceFile = program.getSourceFile(file);
        if (!sourceFile)
            continue;
        function search(node) {
            // import from '?'
            if (typescript_1.default.isImportDeclaration(node) &&
                typescript_1.default.isStringLiteralLike(node.moduleSpecifier) &&
                node.moduleSpecifier.text) {
                const importPath = node.moduleSpecifier.text;
                importPaths.add(typeof fixImportPath === 'function'
                    ? fixImportPath({
                        importPath,
                        filePath: file,
                    })
                    : importPath);
            }
            // import('?')
            else if (typescript_1.default.isCallExpression(node) &&
                node.expression.kind === typescript_1.default.SyntaxKind.ImportKeyword &&
                typescript_1.default.isStringLiteralLike(node.arguments[0])) {
                const importPath = node.arguments[0].text;
                importPaths.add(typeof fixImportPath === 'function'
                    ? fixImportPath({
                        importPath,
                        filePath: file,
                    })
                    : importPath);
            }
            // require.resolve('?')
            else if (typescript_1.default.isCallExpression(node) &&
                typescript_1.default.isPropertyAccessExpression(node.expression) &&
                typescript_1.default.isIdentifier(node.expression.expression) &&
                node.expression.expression.escapedText === 'require' &&
                node.expression.name.escapedText === 'resolve' &&
                typescript_1.default.isStringLiteralLike(node.arguments[0])) {
                const importPath = node.arguments[0].text;
                importPaths.add(typeof fixImportPath === 'function'
                    ? fixImportPath({
                        importPath,
                        filePath: file,
                    })
                    : importPath);
            }
            // require('?')
            else if (typescript_1.default.isCallExpression(node) &&
                typescript_1.default.isIdentifier(node.expression) &&
                node.expression.escapedText === 'require' &&
                typescript_1.default.isStringLiteralLike(node.arguments[0])) {
                const importPath = node.arguments[0].text;
                importPaths.add(typeof fixImportPath === 'function'
                    ? fixImportPath({
                        importPath,
                        filePath: file,
                    })
                    : importPath);
            }
            typescript_1.default.forEachChild(node, search);
        }
        search(sourceFile);
    }
    const imports = {};
    for (const importPath of importPaths) {
        const packageName = /^@/.test(importPath)
            ? importPath.split('/').slice(0, 2).join('/')
            : importPath.split('/')[0];
        if (!imports[packageName] &&
            !selfNames.has(packageName) &&
            !/^\./.test(packageName) &&
            !nodeAPIList.has(packageName)) {
            const internalPackage = internalPackages.get(packageName);
            if (internalPackage) {
                imports[packageName] = `^${internalPackage.version}`;
            }
            else if (externalPackages[packageName]) {
                imports[packageName] = externalPackages[packageName];
            }
            else if (checkUndefinedPackage === 'error') {
                throw new Error(`Undefined package "${packageName}" from "${importPath}"`);
            }
        }
    }
    return imports;
}
exports.collectDependencies = collectDependencies;
//# sourceMappingURL=collectDependencies.js.map