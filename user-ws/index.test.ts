import { resolve } from "bun";
import { test, describe, expect } from "bun:test";

const BACKEND_URL1 = "ws://localhost:8080";
const BACKEND_URL2 = "ws://localhost:8081";

describe("Chat application", () => {
  test("Message send from room 1 reached another participant in room 1", async () => {
    // 2 clients ws1,ws2
    const ws1 = new WebSocket(BACKEND_URL1);
    const ws2 = new WebSocket(BACKEND_URL2);
    // until they are connected - we need to wait - promise assignment - make sure the sockets are connected
    // these callbacks will be called when the connection is established - to see someone if they know promises in js or not.
    // await something that resolves when both the sockets are connected

    await new Promise<void>((resolve, reject) => {
      let connectedCount = 0;
      ws1.onopen = () => {
        connectedCount++;
        if (connectedCount == 2) {
          resolve();
        }
      };
      ws2.onopen = () => {
        connectedCount++;
        if (connectedCount == 2) {
          resolve();
        }
      };
    });
    // control will never reach here/next-line until both the resolve is called
    console.log("Both the sockets are connected");

    // control reaches here only when both the sockets are connected
    ws1.send(
      JSON.stringify({
        type: "join-room",
        room: "room1",
      })
    );
    ws2.send(
      JSON.stringify({
        type: "join-room",
        room: "room1",
      })
    );

    await new Promise<void>((resolve) => {
      // wait for the message to be received by ws2
      ws2.onmessage = ({ data }) => {
        //comes in as object so destructure it
        console.log("ws2 received message", data);
        const parsedData = JSON.parse(data);
        expect(parsedData.type == "chat");
        expect(parsedData.message == "Hello there");
        resolve(); // only after checks happen then we are done.
      }; //ws2

      // send a message from ws1
      ws1.send(
        JSON.stringify({
          type: "chat",
          room: "room1",
          message: "Hello there",
        })
      ); //ws1
    });
  });
});
