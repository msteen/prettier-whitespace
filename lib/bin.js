"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globBase = require("glob-base");
const path_1 = require("path");
const prettier_1 = require("prettier");
const process_1 = require("process");
const trim_trailing_1 = require("trim-trailing");
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
    const wrongIndent = indenter(!options.useTabs);
    const rightIndent = indenter(options.useTabs);
    const indentRegex = new RegExp("^(?:" + wrongIndent + ")+", "gm");
    return (0, trim_trailing_1.editFiles)(args, (contents) => contents
        .replace(indentRegex, (match) => rightIndent.repeat(match.length / wrongIndent.length))
        .replace(/[ \t]+$/gm, ""));
}
main((0, trim_trailing_1.parseArgs)("prettier-strings"));
function indenter(options, useTabs = options.useTabs) {
    return useTabs ? "\t" : " ".repeat(options.tabWidth);
}
//# sourceMappingURL=bin.js.map