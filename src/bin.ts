import * as globBase from "glob-base"
import { dirname, join } from "path"
import { resolveConfig, resolveConfigFile } from "prettier"
import { exit } from "process"
import { Args, editFiles, parseArgs } from "trim-trailing"

async function main(args: Args) {
  const base = globBase(args.glob).base
  if (!args.ignoreFile) {
    const prettierConfigFile = await resolveConfigFile(base)
    if (prettierConfigFile) {
      args.ignoreFile = join(dirname(prettierConfigFile), ".prettierignore")
    }
  }
  const options = await resolveConfig(base)
  if (!options) {
    console.error("Could not find prettier options.", base)
    exit(1)
  }
  const wrongIndent = indenter(!options.useTabs)
  const rightIndent = indenter(options.useTabs)
  const indentRegex = new RegExp("^(?:" + wrongIndent + ")+", "gm")
  return editFiles(args, (contents) =>
    contents
      .replace(indentRegex, (match) => rightIndent.repeat(match.length / wrongIndent.length))
      .replace(/[ \t]+$/gm, ""),
  )
}
main(parseArgs(__dirname))

function indenter(options: any, useTabs: boolean = options.useTabs): string {
  return useTabs ? "\t" : " ".repeat(options.tabWidth)
}
