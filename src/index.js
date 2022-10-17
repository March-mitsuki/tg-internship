// dependencies lib
import got from "got";
import { createWriteStream } from "node:fs";
import {promisify} from 'node:util';
import stream from 'node:stream';
import { Command } from "commander";

// local dependencies
import { BEARER_TOKEN } from "./env-setting.js";

const pipeline = promisify(stream.pipeline);
const program = new Command()

const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL = "https://api.twitter.com/2/tweets/search/stream";

const setRules = async ({tag, value}) => {
  console.log("[log]set rules called");
  const rules = [{
    "value": value,
    "tag": tag,
  }]
  const data = {
    "add": rules
  }
  const response = await got.post(rulesURL, {
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify(data),
  })
  const body = response.body
  console.log(`[log] set rules response: ${body} \n`);
  return body
}

const getAllRules = async () => {
  console.log("[log]get all rules called");
  const response = await got.get(rulesURL, {
    headers: {
      "authorization": `Bearer ${BEARER_TOKEN}`
    },
    responseType: "json",
  })
  const body = response.body
  console.log(`[log] get all rules response: `, body, "");
  return body
}

const delAllRules = async () => {
  const rules = await getAllRules()
  const ids = rules.data.map(elem => elem.id);
  const data = {
    "delete": {
      "ids": ids
    }
  }
  const response = await got.post(rulesURL, {
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${BEARER_TOKEN}`,
    },
    body: JSON.stringify(data),
  })
  const body = response.body
  console.log(`[log] del all rules response: `, body, "");
  return body
}

const streamConnect = () => {
  console.log("[log]stream connect called");
  const stream = got.stream(streamURL, {
    headers: {
      "User-Agent": "v2FilterStreamJS",
      "Authorization": `Bearer ${BEARER_TOKEN}`
    }
  })
  stream.on("data", async (data) => {
    try {
      console.log("[log]on stream data: ", JSON.parse(data));
      await pipeline(
        stream,
        createWriteStream("./readStream.log")
      )
      console.log("[log]readable success");
    } catch (err) {
      console.log("[error]", err);
    }
  })
  stream.once("error", err => console.log("[error]", err))
  stream.once("end", () => console.log("[log]stream end"))
}

program.command("set-rules")
  .option("--value <char>", "set the value of rules")
  .option("--tag <char>", "set the description of the value")
  .action((inputData) => {
    console.log(inputData);
    const value = inputData.value
    const tag = inputData.tag
    console.log(value, "||", tag);
    setRules({tag: tag, value: value})
  })

program.command("del-rules")
  .action(() => {
    delAllRules()
  })

program.command("get-rules")
  .action(() => {
    getAllRules()
  })

program.command("conn-stream")
  .action(() => {
    streamConnect()
  })

program.parse()
