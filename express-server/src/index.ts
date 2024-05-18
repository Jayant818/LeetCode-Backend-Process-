//sending the incoming request from frontend to queue which will be eventually picked up by the worker

// Steps
// 1) Creating a Server
// 2) Creating a RedisClient to connect to the Redis Server
//    a) create the client and connect to the db
// 3) Creating a POST Request
// 4) push the data to the queue , by using LPush - Pushed to the left of queue - "Submissions"

import express from "express";
import { createClient } from "redis";

const app = express();
// parsing incoming data to json
app.use(express.json());

const RedisClient = createClient();
app.post("/submit", async (req, res) => {
	const { code, lang, problemId } = req.body;
	// sending the data to the queue
	try {
		// maybe the queue is down so use try-catch
		// sending the data to the queue
		await RedisClient.lPush(
			"Submissions",
			JSON.stringify({ code, lang, problemId })
		);
		// store data in DB with status - PENDING
		res.status(200).json({ message: "Code submitted successfully" });
	} catch (e) {
		res
			.status(500)
			.json({ message: "Code Submission Failed Try after some time" });
	}
});

async function Connect() {
	try {
		await RedisClient.connect();
		console.log("Connected to the redis");
		app.listen(3000, () => {
			console.log("Server is running on port 3000");
		});
	} catch (error) {
		console.error("Failed to connect to Redis", error);
	}
}

Connect();
