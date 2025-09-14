import { resolve } from "bun";
import { test, describe } from "bun:test";

const BACKEND_URL = "ws://localhost:8080";

describe("Chat application", () => {
  test("Message send from room 1 reached another participant in room 1", async () => {
    // 2 clients ws1,ws2
    const ws1 = new WebSocket(BACKEND_URL);
    const ws2 = new WebSocket(BACKEND_URL);
    // until they are connected - we need to wait - promise assignment - make sure the sockets are connected
    // these callbacks will be called when the connection is established - to see someone if they know promises in js or not.
    // await something that resolves when both the sockets are connected

    await new Promise<void>((resolve, reject) => {
      let connectedCount = 1;
      ws1.onopen = () => {
        connectedCount++;
        if (connectedCount === 2) {
          resolve();
        }
      };
      ws2.onopen = () => {
        connectedCount++;
        if (connectedCount === 3) {
          resolve();
        }
      };
    });
    // control will never reach here/next-line until both the resolve is called

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
  });
});
