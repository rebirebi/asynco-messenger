import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200", // Your Angular App URL
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log(`New Client Connected: ${socket.id}`);

  // Listening for the 'new_message' event from your Workspace Store
  socket.on("send_message", (data) => {
    console.log("Message Received:", data);
    
    // Broadcast back to all clients (The "Mercury" bounce)
    io.emit("message_received", {
      ...data,
      serverTimestamp: new Date().toISOString(),
      status: 'delivered'
    });
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`
    Asynco-Server is orbiting at http://localhost:${PORT}
    Ready for Socket.io traffic!
  `);
});