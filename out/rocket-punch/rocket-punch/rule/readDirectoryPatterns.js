"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDirectoryPatterns = void 0;
exports.readDirectoryPatterns = [
    // extensions
    ['.ts', '.tsx', '.js', '.jsx'],
    // excludes
    [
        // exclude tests
        '**/*.(spec|test).(js|jsx|ts|tsx)',
        '**/__*',
        // exclude public
        '**/public',
        '**/bin',
    ],
    // includes
    ['**/*'],
];
//# sourceMappingURL=readDirectoryPatterns.js.map