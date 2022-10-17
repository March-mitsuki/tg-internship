// dependencies lib
import got from "got";

// local dependencies
import { TOKEN } from "./env-setting";

const main = async () => {
  const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
  const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

  await got.get()
  return
}