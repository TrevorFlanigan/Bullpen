"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const logger = pino_1.default({
    level: process.env.LOG_LEVEL || "debug",
    base: null,
    prettyPrint: true,
    timestamp: () => {
        return `, "time":"${new Date(Date.now()).toLocaleString()}"`;
    },
});
exports.default = logger;
