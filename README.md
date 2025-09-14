# Scalable - Stateful - App

This project is a real-time chat application built with **Node.js** and **WebSockets**, designed to be scalable and handle a large number of concurrent users. It addresses the challenges of scaling stateful applications by implementing a "relayer" architecture for server-to-server communication.

---

## 🚀 Core Concepts

### Stateless vs. Stateful Applications

- **Stateless applications** are easy to scale. Since they don't store data in memory, you can simply add more servers to handle increased traffic. A load balancer can distribute requests evenly, and the final state is always persisted in a database.
- **Stateful applications**, like chat apps or online games, are more complex. They maintain active connections and store data on the server (e.g., which users are in which chat room). This makes scaling difficult because if a server goes down, all its connections are lost.

### WebSockets for Real-Time Communication WebSocket is a protocol that provides **bidirectional communication** between a client and a server over a single, long-lived connection. This is perfect for real-time applications like chat, where you need instant message delivery without the client having to constantly poll the server.

---

## The Scaling Challenge with WebSockets

A single Node.js server can only handle a limited number of WebSocket connections (around 10,000). So, what happens when you have 100,000 users?

The naive solution is to add more servers. However, this creates a new problem: **users in the same chat room might be connected to different servers**. The servers are unaware of each other, so a message sent to one server will not be received by users connected to another.

---

## Architecture: The Relayer Pattern

To solve this, we introduce a "relayer" service. The relayer is a central hub that all WebSocket servers connect to. Here's how it works:

1. **User Connections**: Users connect to different WebSocket servers, distributed by a load balancer.
2. **Server-to-Relayer Connections**: Each WebSocket server establishes a connection with the central relayer service.
3. **Message Flow**:
   - When a user sends a message, their connected server receives it.
   - The server then forwards this message to the relayer.
   - The relayer broadcasts the message to **all** other connected WebSocket servers.
   - Each server, upon receiving the message from the relayer, sends it to the clients in the relevant chat room.

This architecture ensures that all users in a chat room receive messages, regardless of which server they are connected to.

---

## 🛠️ Implementation Details

- **Backend**: Node.js
- **WebSocket Library**: `ws` (a popular Node.js WebSocket library)
- **Runtime**: Bun (a fast all-in-one JavaScript runtime)
- **Message Types**: The application handles two main types of messages:
  1. `join room`: When a user joins a room, this message is handled locally by the server to map the user's connection to the room.
  2. `chat message`: This message is forwarded to the relayer to be broadcast to other servers.

---

## ⚙️ How to Run the Project

1.**Initialize the project**:

```bash
   bun init
```

2.**Install the WebSocket library**:

```bash
   bun add ws
```

3.**Start the server**:

```bash
   bun run index.ts
```

The project includes tests that simulate clients connecting to different servers to verify that the relayer correctly broadcasts messages between them.

---

## ✨ Future Improvements & Optimizations

The current relayer broadcasts every message to every server, which can be inefficient. A more optimized solution would be to use a **Pub/Sub (Publish/Subscribe) system like Redis**.

With a Pub/Sub model:

- Servers would **subscribe** to specific chat rooms (channels) with the Redis server.
- When a message is sent, it would be **published** to the corresponding channel in Redis.
- Redis would then only push the message to the servers that have subscribed to that channel (i.e., servers that have active users in that room).

This would significantly reduce redundant message traffic and make the application even more scalable.
