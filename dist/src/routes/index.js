"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const challenge_1 = require("./challenge");
function getRoutes() {
    const router = express_1.default.Router();
    router.use("/auth", (0, auth_1.getAuthRoutes)());
    router.use("/challenge", (0, challenge_1.getChallengeRoutes)());
    return router;
}
exports.getRoutes = getRoutes;
