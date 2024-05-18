"use strict";
// Steps:
// 1) Pick/pop from the queue
// 2) Run the Operation
// 3) Made chnages to DB
// 4) send them to Pub-sub
// 5) Do this infinitely
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const RedisClient = (0, redis_1.createClient)();
function Connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield RedisClient.connect();
            console.log("Connected to the Redis");
            while (true) {
                try {
                    const Submissions = yield RedisClient.brPop("Submissions", 0);
                    //@ts-ignore
                    const { code, lang, problemId } = yield JSON.parse(Submissions.element);
                    // Do some operations
                    yield new Promise((r) => setTimeout(r, 1000)); // Simulating some operation)
                    console.log("Code passed all testcases");
                    RedisClient.publish("problem_done", JSON.stringify({ code, lang, problemId }));
                }
                catch (e) {
                    console.log("Error getting the data", e);
                    // Push the submission back to the queue.
                }
            }
        }
        catch (e) {
            console.log("Error", e);
        }
    });
}
Connect();
