// dependencies lib
import got from "got";
import { createWriteStream } from "node:fs";
import {promisify} from 'node:util';
import stream from 'node:stream';
import dotenv from "dotenv"

dotenv.config()

const BEARER_TOKEN =  process.env.BEARER_TOKEN

const pipeline = promisify(stream.pipeline);


const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL = "https://api.twitter.com/2/tweets/search/stream";

export const setRules = async ({tag, value}) => {
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

export const getAllRules = async () => {
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

export const delAllRules = async () => {
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

export const streamConnect = () => {
  console.log("[log]stream connect called");
  const stream = got.stream(streamURL, {
    headers: {
      "User-Agent": "v2FilterStreamJS",
      "Authorization": `Bearer ${BEARER_TOKEN}`
    }
  })
  return stream
}

export const defaultStreamMonitor = () => {
  const stream = streamConnect()
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

export const fmtStreamMonitor = () => {
  const stream = streamConnect()
  stream.on("data", async (data) => {
    try {
      const dataObj = JSON.parse(data)
      console.log(`
        \n
        ---twitter: ${dataObj.data.text} \n
        |--tag: ${dataObj.matching_rules[0].tag} \n
      `);
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
