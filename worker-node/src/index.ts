// Steps:
// 1) Pick/pop from the queue
// 2) Run the Operation
// 3) Made chnages to DB
// 4) send them to Pub-sub
// 5) Do this infinitely

import { createClient } from "redis";

const RedisClient = createClient();

async function Connect() {
	try {
		await RedisClient.connect();
		console.log("Connected to the Redis");

		while (true) {
			try {
				const Submissions = await RedisClient.brPop("Submissions", 0);

				//@ts-ignore
				const { code, lang, problemId } = await JSON.parse(Submissions.element);

				// Do some operations
				await new Promise((r) => setTimeout(r, 1000)); // Simulating some operation)
				console.log("Code passed all testcases");
				RedisClient.publish(
					"problem_done",
					JSON.stringify({ code, lang, problemId })
				);
			} catch (e) {
				console.log("Error getting the data", e);
				// Push the submission back to the queue.
			}
		}
	} catch (e) {
		console.log("Error", e);
	}
}
Connect();
