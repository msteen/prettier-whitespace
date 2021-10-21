"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.prettyprint = void 0;
const globBase = require("glob-base");
const path_1 = require("path");
const prettier_1 = require("prettier");
const process_1 = require("process");
const trim_trailing_1 = require("trim-trailing");
const util_1 = require("util");
function prettyprint(arg) {
    return (0, util_1.inspect)(arg, {
        depth: null,
        colors: true,
        breakLength: 110,
    });
}
exports.prettyprint = prettyprint;
function log(...args) {
    console.log(...args.map(prettyprint));
}
exports.log = log;
async function main(args) {
    const base = globBase(args.glob).base;
    if (!args.ignoreFile) {
        const prettierConfigFile = await (0, prettier_1.resolveConfigFile)(base);
        if (prettierConfigFile) {
            args.ignoreFile = (0, path_1.join)((0, path_1.dirname)(prettierConfigFile), ".prettierignore");
        }
    }
    const options = await (0, prettier_1.resolveConfig)(base);
    if (!options) {
        console.error("Could not find prettier options.", base);
        (0, process_1.exit)(1);
    }
    const wrongIndentLength = !options.useTabs ? 1 : options.tabWidth;
    const rightIndent = options.useTabs ? "\t" : " ".repeat(options.tabWidth);
    const indentRegex = new RegExp("^(?:" + (!options.useTabs ? "\\t" : " ".repeat(options.tabWidth)) + ")+", "gm");
    return (0, trim_trailing_1.editFiles)(args, (contents) => contents
        .replace(indentRegex, (match) => rightIndent.repeat(match.length / wrongIndentLength))
        .replace(/[ \t]+$/gm, ""));
}
main((0, trim_trailing_1.parseArgs)(__dirname));
//# sourceMappingURL=bin.js.map