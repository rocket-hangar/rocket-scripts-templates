"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPathRewrite = void 0;
const rewrite_src_path_1 = require("@ssen/rewrite-src-path");
const typescript_1 = __importDefault(require("typescript"));
function createVisitor({ src, ctx, fileName, }) {
    const visitor = (node) => {
        // import from '?'
        if (typescript_1.default.isImportDeclaration(node) &&
            typescript_1.default.isStringLiteralLike(node.moduleSpecifier) &&
            node.moduleSpecifier.text) {
            const importPath = node.moduleSpecifier.text;
            const rewrittenImportPath = rewrite_src_path_1.rewriteSrcPath({
                importPath,
                filePath: fileName || node.getSourceFile().fileName,
                rootDir: src,
            });
            if (importPath !== rewrittenImportPath) {
                return typescript_1.default.factory.updateImportDeclaration(node, undefined, undefined, undefined, typescript_1.default.createLiteral(rewrittenImportPath));
            }
        }
        // import('?')
        else if (typescript_1.default.isCallExpression(node) &&
            node.expression.kind === typescript_1.default.SyntaxKind.ImportKeyword &&
            typescript_1.default.isStringLiteralLike(node.arguments[0])) {
            const importPath = node.arguments[0].text;
            const rewrittenImportPath = rewrite_src_path_1.rewriteSrcPath({
                importPath,
                filePath: fileName || node.getSourceFile().fileName,
                rootDir: src,
            });
            if (importPath !== rewrittenImportPath) {
                return typescript_1.default.factory.updateCallExpression(node, node.expression, node.typeArguments, [
                    typescript_1.default.createStringLiteral(rewrittenImportPath),
                    ...node.arguments.slice(1),
                ]);
            }
        }
        // require.resolve('?')
        else if (typescript_1.default.isCallExpression(node) &&
            typescript_1.default.isPropertyAccessExpression(node.expression) &&
            typescript_1.default.isIdentifier(node.expression.expression) &&
            node.expression.expression.escapedText === 'require' &&
            node.expression.name.escapedText === 'resolve' &&
            typescript_1.default.isStringLiteralLike(node.arguments[0])) {
            const importPath = node.arguments[0].text;
            const rewrittenImportPath = rewrite_src_path_1.rewriteSrcPath({
                importPath,
                filePath: fileName || node.getSourceFile().fileName,
                rootDir: src,
            });
            if (importPath !== rewrittenImportPath) {
                return typescript_1.default.factory.updateCallExpression(node, node.expression, node.typeArguments, [
                    typescript_1.default.createStringLiteral(rewrittenImportPath),
                    ...node.arguments.slice(1),
                ]);
            }
        }
        // require('?')
        else if (typescript_1.default.isCallExpression(node) &&
            typescript_1.default.isIdentifier(node.expression) &&
            node.expression.escapedText === 'require' &&
            typescript_1.default.isStringLiteralLike(node.arguments[0])) {
            const importPath = node.arguments[0].text;
            const rewrittenImportPath = rewrite_src_path_1.rewriteSrcPath({
                importPath,
                filePath: fileName || node.getSourceFile().fileName,
                rootDir: src,
            });
            if (importPath !== rewrittenImportPath) {
                return typescript_1.default.factory.updateCallExpression(node, node.expression, node.typeArguments, [
                    typescript_1.default.createStringLiteral(rewrittenImportPath),
                    ...node.arguments.slice(1),
                ]);
            }
        }
        return typescript_1.default.visitEachChild(node, visitor, ctx);
    };
    return visitor;
}
exports.importPathRewrite = (config) => (ctx) => (node) => {
    return typescript_1.default.visitNode(node, createVisitor({ ...config, ctx }));
};
//# sourceMappingURL=index.js.map