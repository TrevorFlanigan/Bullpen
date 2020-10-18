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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const music_1 = __importDefault(require("./routes/music"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.use("/api/users", users_1.default);
app.use("/api/music", music_1.default);
const connectDB = (url = "mongodb://localhost:27017/bullpen") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected...");
    }
    catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
});
if (process.env.NODE_ENV === "test")
    connectDB("mongodb://localhost:27017/bullpen-test");
else {
    connectDB();
}
exports.default = app;
