// app/api/socket/route.ts
import { NextResponse } from "next/server";
import { Server } from "socket.io";

export const runtime = "nodejs"; // ensure we run on Node.js, not the Edge
export const dynamic = "force-dynamic"; // no caching

export async function GET() {
  const res = NextResponse.next();
  // @ts-expect-error Server implementation is not fully typed
  const { server } = res.socket;
  if (!server.io) {
    console.log("🚀 Initializing Socket.IO on /api/socket");
    const io = new Server(server, {
      path: "/api/socket", // matches this file's URL
      addTrailingSlash: false,
    });
    server.io = io;

    io.on("connection", (socket) => {
      console.log("🔌 client connected:", socket.id);

      socket.on("joinRehearsal", (data) => {
        console.log(
          `Client ${socket.id} joined rehearsal room with instrument: ${data.instrument}`
        );
        socket.data.instrument = data.instrument;
        socket.join("rehearsal");
      });

      socket.on("selectSong", (song) => {
        console.log(`Song selected by ${socket.id}:`, song);
        const clients = io.sockets.adapter.rooms.get("rehearsal");
        if (clients) {
          clients.forEach((clientId) => {
            const clientSocket = io.sockets.sockets.get(clientId);
            if (clientSocket) {
              const instrument = clientSocket.data.instrument;
              if (instrument && instrument.toUpperCase() === "VOCALS") {
                clientSocket.emit("songSelected", { lyrics: song.lyrics });
              } else {
                clientSocket.emit("songSelected", song);
              }
            }
          });
        }
      });

      socket.on("syncScroll", (y: number) => {
        socket.to("rehearsal").emit("scrollTo", y);
      });

      socket.on("quitRehearsal", () => {
        io.to("rehearsal").emit("rehearsalEnded");
      });

      socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`);
      });
    });
  }
  return res;
}
