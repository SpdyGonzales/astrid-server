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
exports.getAuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
function getAuthRoutes() {
    const router = express_1.default.Router();
    router.post("/login", login);
    return router;
}
exports.getAuthRoutes = getAuthRoutes;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        User_1.default.findOne({ email: req.body.email })
            .then((user) => {
            if (!user)
                return res.status(404).json("Invalid email");
            //validate password. Should be encrypted in prod
            if (user.password !== req.body.password)
                return res.status(404).json({ message: "Invalid password" });
            const token = jsonwebtoken_1.default.sign({
                username: user.username,
            }, process.env.SECRET);
            // Login successful, write token, and send back user
            res
                .status(200)
                .json({ token: token, user: user.email, challenge: user.challenge });
        })
            .catch((err) => res.status(500).json({ message: err.message }));
    });
}
