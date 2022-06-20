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
exports.getChallengeRoutes = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const Challenge_1 = __importDefault(require("../models/Challenge"));
const User_1 = __importDefault(require("../models/User"));
const nodemailer_1 = require("../services/nodemailer");
const multer = require("multer");
const upload = multer();
var crypto = require("crypto");
function getChallengeRoutes() {
    const router = express_1.default.Router();
    router.post("/invite", challengeInvite);
    router.post("/score", upload.any(), challengeScore);
    router.post("/post", challengePost);
    router.get("/get", challengeGet);
    return router;
}
exports.getChallengeRoutes = getChallengeRoutes;
function challengeInvite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = crypto.randomBytes(20).toString("hex");
        Challenge_1.default.create({
            challenger: req.body.challenger,
            difficulty: req.body.difficulty,
            token: token,
        })
            .catch(function (error) {
            console.log("Error Occurred:", error.message);
            return res.status(404).json("Could not create challenge");
        })
            .then(() => (0, nodemailer_1.sendMail)(req.body.email, "Astrid Education english challenge", '<p>Accept <a href="http://localhost:3000?id=' +
            token +
            '">Challenge</a> to by clicking link</p>', res));
        res.status(200).json("Challenge sent");
    });
}
function challengeScore(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const options = {
                method: "POST",
                url: "https://global.voice-api.astrideducation.com/api/v1/score",
                data: req.body,
                headers: { "Content-Type": "multipart/form-data" },
            };
            const score = yield (0, axios_1.default)(options);
            const { data } = score;
            return res.json({ data });
        }
        catch (err) {
            return res.status(500).json({
                error: err,
            });
        }
    });
}
function challengePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        User_1.default.findOneAndUpdate({ email: req.body.challenger }, { challenge: req.body.results })
            .then((user) => __awaiter(this, void 0, void 0, function* () {
            if (user) {
                yield Challenge_1.default.deleteOne({ token: req.body.token });
                (0, nodemailer_1.sendMail)(req.body.challenger, "Challenge has been finished", "<p>Login to see results</p>", res);
            }
            else {
                return res.status(404).json("Could not send results");
            }
        }))
            .catch((error) => res.status(404).json(error));
    });
}
/**
 * Assessment says fetch each new phrase from backend. You could also get them all
 * at once and save the progress frontend, maybe even save to local storage.
 * Another approach could be to save results to database preventing results to get
 * lost if players disconnect etc. and continues on another device.
 * Those things could be implemented at a later stage. Local storage fits the
 * time frame and size of challenge.
 */
function challengeGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const phrases = [
            "Second start to the right",
            "Never is an awfully long time",
            "This is a fierce bad rabbit",
            "I am the strongest girl in the world",
            "You are a dreamer",
        ];
        Challenge_1.default.findOne({ token: req.query.token })
            .then((challenge) => {
            if (!challenge)
                return res.status(404).json("Challenge does not exist");
            return res.status(200).json({ challenge: challenge, phrases: phrases });
        })
            .catch((err) => res.status(500).json({ message: err.message }));
    });
}
