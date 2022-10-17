// dependencies lib
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

// local dependencies
import { tfs } from './controlelrs/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/dist"))

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

io.on("connection", (socket) => {
  console.log("a user connection: ", socket.id);
  socket.on("change_rules", async (data) => {
    // console.log(data)
    const tag = data.tag
    const valueStr = data.value
    const keywords = valueStr.split(" ")
    const value = keywords.join(" OR ") + ` lang:jp`
    const resBody = await tfs.setRules({tag: tag, value: value})
    socket.emit("recive_rules", resBody)
  })
  socket.on("start_monitor_fmt", () => {
    console.log("server start monitor");
    const stream = tfs.streamConnect()
    stream.on("data", async (data) => {
      try {
        const dataObj = JSON.parse(data)
        socket.emit("data_recive", `
          \n
          ---twitter: ${dataObj.data.text} \n
          |--tag: ${dataObj.matching_rules[0].tag} \n
        `)
      } catch (err) {
        console.log("[error]", err);
      }
    })
    stream.once("error", err => console.log("[error]", err))
    stream.once("end", () => console.log("[log]stream end"))
  })
})

server.listen(3939, () => {
  console.log('listening on localhost:3939');
});
