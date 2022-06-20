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
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const loglevel_1 = __importDefault(require("loglevel"));
const routes_1 = require("./routes");
const cors = require("cors");
const bodyparser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer();
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(process.env.MONGODBURI);
        console.log("connected to database");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
function startServer({ port = process.env.PORT } = {}) {
    const app = (0, express_1.default)();
    app.use(cors());
    app.use(bodyparser.urlencoded({
        extended: true,
    }));
    app.use(upload.array());
    app.use(bodyparser.json());
    // authenticateUser(passport);
    app.use(errorMiddleware);
    app.listen(port, () => {
        console.log(`Application running at http://localhost:${port}/`);
        app.use("/", (0, routes_1.getRoutes)());
        connectDatabase();
    });
}
exports.startServer = startServer;
function errorMiddleware(error, req, res, next) {
    if (res.headersSent) {
        next(error);
    }
    else {
        loglevel_1.default.error(error);
        res.status(500);
        res.json(Object.assign({ message: error.message }, (process.env.NODE_ENV === "production"
            ? null
            : { stack: error.stack })));
    }
}
