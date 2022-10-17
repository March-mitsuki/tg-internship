// dependencies lib
import got from "got";

// local dependencies
import { BEARER_TOKEN } from "./env-setting.js";


const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL = "https://api.twitter.com/2/tweets/search/stream";

const rules = [{
  "value": "cat has:images",
  "tag": "cat with images",
}]

const setRules = async () => {
  console.log("set rules called");
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
  console.log("get all rules called");
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

const delAllRules = async (rules) => {
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

const main = async () => {
  // const setRulesRes = await setRules()
  const getRulesRes = await getAllRules()
  return
}

main()
