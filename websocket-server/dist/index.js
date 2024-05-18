"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const redis_1 = require("redis");
const map = new Map();
const RedisClient = (0, redis_1.createClient)();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const app = (0, express_1.default)();
            const httpServer = app.listen(8080, () => {
                console.log("Server is listening on port 8080");
            });
            const wss = new ws_1.WebSocketServer({ server: httpServer });
            yield RedisClient.connect();
            wss.on("connection", (ws) => {
                console.log("New WebSocket Connection");
                ws.send("Connected");
                ws.on("message", (message) => {
                    try {
                        const { id } = JSON.parse(message.toString());
                        console.log("message", message);
                        console.log("Received message", id);
                        map.set(id, ws);
                    }
                    catch (e) {
                        console.error("Error parsing WebSocket message:", e);
                    }
                });
            });
            RedisClient.subscribe("problem_done", (message, channel) => {
                console.log("message", message);
                console.log("Received message", channel);
                const { code, lang, problemId, userId } = JSON.parse(message);
                console.log(userId);
                const ws = map.get(userId);
                console.log(ws);
                if (ws) {
                    ws.send(JSON.stringify({ code, lang, problemId }));
                }
            });
        }
        catch (e) {
            console.error("Error starting server:", e);
        }
    });
}
startServer();
