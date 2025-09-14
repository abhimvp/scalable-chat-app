// console.log("Hello via Bun!");
import { server } from "typescript";
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 3001 });

// global array - servers
const servers: WebSocket[] = [];

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  //   whenever there is a new connection we do
  servers.push(ws);
  ws.on("message", function message(data: string) {
    servers.map((socket) => {
      socket.send(data);
    });
  });

  //   ws.send("something");
});
