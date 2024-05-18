"use strict";
//sending the incoming request from frontend to queue which will be eventually picked up by the worker
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
// Steps
// 1) Creating a Server
// 2) Creating a RedisClient to connect to the Redis Server
//    a) create the client and connect to the db
// 3) Creating a POST Request
// 4) push the data to the queue , by using LPush - Pushed to the left of queue - "Submissions"
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
// parsing incoming data to json
app.use(express_1.default.json());
const RedisClient = (0, redis_1.createClient)();
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, lang, problemId } = req.body;
    // sending the data to the queue
    try {
        // maybe the queue is down so use try-catch
        // sending the data to the queue
        yield RedisClient.lPush("Submissions", JSON.stringify({ code, lang, problemId }));
        // store data in DB with status - PENDING
        res.status(200).json({ message: "Code submitted successfully" });
    }
    catch (e) {
        res
            .status(500)
            .json({ message: "Code Submission Failed Try after some time" });
    }
}));
function Connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield RedisClient.connect();
            console.log("Connected to the redis");
            app.listen(3000, () => {
                console.log("Server is running on port 3000");
            });
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
Connect();
