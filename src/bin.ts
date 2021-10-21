import * as globBase from "glob-base"
import { dirname, join } from "path"
import { resolveConfig, resolveConfigFile } from "prettier"
import { exit } from "process"
import { Args, editFiles, parseArgs } from "trim-trailing"
import { inspect } from "util"

export function prettyprint(arg: any): string {
  return inspect(arg, {
    depth: null,
    colors: true,
    breakLength: 110,
  })
}

export function log(...args: any[]): void {
  console.log(...args.map(prettyprint))
}

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
  const wrongIndentLength = !options.useTabs ? 1 : options.tabWidth
  const rightIndent = options.useTabs ? "\t" : " ".repeat(options.tabWidth)
  const indentRegex = new RegExp("^(?:" + (!options.useTabs ? "\\t" : " ".repeat(options.tabWidth)) + ")+", "gm")
  return editFiles(args, (contents) =>
    contents
      .replace(indentRegex, (match) => rightIndent.repeat(match.length / wrongIndentLength))
      .replace(/[ \t]+$/gm, ""),
  )
}
main(parseArgs(__dirname))
