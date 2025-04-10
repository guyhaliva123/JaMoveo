// server.ts
import { createServer } from "http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let currentSongData: any = null; // global variable for the current song

async function startServer() {
  await app.prepare();

  const httpServer = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url || "", true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // You can tighten this up in prod
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on("getCurrentSong", () => {
      if (currentSongData) {
        socket.emit("songSelected", currentSongData);
      }
    });

    socket.on("songSelected", (data) => {
      console.log(`Song selected: ${data.title} by ${data.artist}`);
      currentSongData = data;
      io.emit("songSelected", data);
    });

    socket.on("syncScroll", (scrollTop: number) => {
      io.emit("scrollTo", scrollTop);
    });

    socket.on("quitRehearsal", () => {
      console.log("Rehearsal ended");
      currentSongData = null;
      io.emit("rehearsalEnded");
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  const port = parseInt(process.env.PORT || "8080", 10);
  const host = "0.0.0.0"; // 👈 Required for Railway and Docker

  httpServer.listen(port, host, () => {
    console.log(`> Server ready on http://${host}:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
