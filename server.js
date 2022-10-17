// dependencies lib
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

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
  socket.on("change_rules", (data) => {
    console.log(data)
  })
})

server.listen(3939, () => {
  console.log('listening on localhost:3939');
});
