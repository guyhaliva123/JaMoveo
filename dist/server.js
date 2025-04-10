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
let currentSongData = null; // Global variable for the current song
async function startServer() {
    await app.prepare();
    const httpServer = (0, http_1.createServer)((req, res) => {
        var _a;
        try {
            const parsedUrl = (0, url_1.parse)(req.url || "", true);
            // Log API requests for debugging
            if ((_a = parsedUrl.pathname) === null || _a === void 0 ? void 0 : _a.startsWith("/api/auth")) {
                console.log(`Auth request: ${parsedUrl.pathname}`);
            }
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
            origin: "*", // Adjust this for production
        },
    });
    io.on("connection", (socket) => {
        console.log(`[Socket.IO] Client connected: ${socket.id}`);
        // When a client connects, send the current song (if any)
        socket.on("getCurrentSong", () => {
            if (currentSongData) {
                socket.emit("songSelected", currentSongData);
            }
        });
        // Handle song selection
        socket.on("songSelected", (data) => {
            console.log(`Song selected: ${data.title} by ${data.artist}`);
            currentSongData = data; // Save the song globally
            io.emit("songSelected", data); // Broadcast to all clients
        });
        // Handle scroll syncing (unchanged)
        socket.on("syncScroll", (scrollTop) => {
            io.emit("scrollTo", scrollTop);
        });
        // Handle rehearsal quit:
        socket.on("quitRehearsal", () => {
            console.log("Rehearsal ended");
            currentSongData = null; // Reset the current song
            io.emit("rehearsalEnded"); // Notify all connected clients
        });
        socket.on("disconnect", () => {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
        });
    });
    const port = process.env.PORT || 3000;
    httpServer.listen(port, () => {
        console.log(`> Server ready on http://localhost:${port}`);
    });
}
startServer().catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
});
