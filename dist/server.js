"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const http_1 = require("http");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const url_1 = require("url");
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
let currentSongData = null; // global variable for the current song
async function startServer() {
    await app.prepare();
    const httpServer = (0, http_1.createServer)((req, res) => {
        try {
            const parsedUrl = (0, url_1.parse)(req.url || "", true);
            handle(req, res, parsedUrl);
        }
        catch (err) {
            console.error("Error handling request:", err);
            res.statusCode = 500;
            res.end("Internal Server Error");
        }
    });
    const io = new socket_io_1.Server(httpServer, {
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
        socket.on("syncScroll", (scrollTop) => {
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
