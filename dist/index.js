"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel_1 = __importDefault(require("loglevel"));
const start_1 = require("./src/start");
const convertLogLevel = (logLevel) => {
    switch (logLevel) {
        case "1":
        case "error":
            return loglevel_1.default.levels.ERROR;
        case "2":
        case "warn":
            return loglevel_1.default.levels.WARN;
        default:
            return loglevel_1.default.levels.INFO;
    }
};
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const isTest = process.env.NODE_ENV === "test";
const logLevel = convertLogLevel(process.env.LOG_LEVEL) ||
    (isTest ? loglevel_1.default.levels.WARN : loglevel_1.default.levels.INFO);
loglevel_1.default.setLevel(logLevel);
(0, start_1.startServer)();
