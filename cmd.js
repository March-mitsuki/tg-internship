// dependencies lib
import { Command } from "commander";

// local dependencies
import { tfs } from "./controlelrs/index.js";

const program = new Command()

program.command("set-rules")
  .option("--value <char>", "set the value of rules")
  .option("--tag <char>", "set the description of the value")
  .action((inputData) => {
    const value = inputData.value
    const tag = inputData.tag
    tfs.setRules({tag: tag, value: value})
  })

program.command("set-keyword-rules")
  .option("--keyword <char>", "set the keyword with space")
  .option("--tag <char>", "set the description")
  .option("--lang <char>", "set the monitor lang, default to ja")
  .action((inputData) => {
    console.log(inputData);
    let lang = ""
    if (typeof inputData.lang === "undefined") {
      lang = "ja"
    }
    const keywordStr = inputData.keyword
    const tag = inputData.tag
    const keywords = keywordStr.split(" ")
    const value = keywords.join(" OR ") + ` lang:${lang}`
    tfs.setRules({tag: tag, value: value})
  })

program.command("del-rules")
  .action(() => {
    tfs.delAllRules()
  })

program.command("get-rules")
  .action(() => {
    tfs.getAllRules()
  })

program.command("conn-stream")
  .action(() => {
    tfs.defaultStreamMonitor()
  })

program.command("fmt-keyword-stream")
  .action(() => {
    tfs.fmtStreamMonitor()
  })

program.parse()
