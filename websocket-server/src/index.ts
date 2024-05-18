import express from "express";
import { WebSocketServer } from "ws";
import { createClient } from "redis";

const map = new Map();
const RedisClient = createClient();

async function startServer() {
	try {
		const app = express();

		const httpServer = app.listen(8080, () => {
			console.log("Server is listening on port 8080");
		});

		const wss = new WebSocketServer({ server: httpServer });

		await RedisClient.connect();

		wss.on("connection", (ws) => {
			console.log("New WebSocket Connection");

			ws.send("Connected");

			ws.on("message", (message) => {
				try {
					const { id } = JSON.parse(message.toString());
					console.log("message", message);
					console.log("Received message", id);

					map.set(id, ws);
				} catch (e) {
					console.error("Error parsing WebSocket message:", e);
				}
			});
		});

		RedisClient.subscribe("problem_done", (message, channel) => {
			const { code, lang, problemId, userId } = JSON.parse(message);
			const ws = map.get(userId);
			console.log(ws);
			if (ws) {
				ws.send(JSON.stringify({ code, lang, problemId }));
			}
		});
	} catch (e) {
		console.error("Error starting server:", e);
	}
}

startServer();
