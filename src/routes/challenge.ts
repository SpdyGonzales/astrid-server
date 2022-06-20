import axios from "axios";
import express, { Request, Response } from "express";
import Challenge from "../models/Challenge";
import User from "../models/User";
import { sendMail } from "../services/nodemailer";
const multer = require("multer");
const upload = multer();
var crypto = require("crypto");

function getChallengeRoutes() {
  const router = express.Router();
  router.post("/invite", challengeInvite);
  router.post("/score", upload.any(), challengeScore);
  router.post("/post", challengePost);
  router.get("/get", challengeGet);
  return router;
}

async function challengeInvite(req: Request, res: Response) {
  const token = crypto.randomBytes(20).toString("hex");
  Challenge.create({
    challenger: req.body.challenger,
    difficulty: req.body.difficulty,
    token: token,
  })
    .catch(function (error) {
      console.log("Error Occurred:", error.message);
      return res.status(404).json("Could not create challenge");
    })
    .then(() =>
      sendMail(
        req.body.email,
        "Astrid Education english challenge",
        '<p>Accept <a href="http://localhost:3000?id=' +
          token +
          '">Challenge</a> to by clicking link</p>',
        res
      )
    );
  res.status(200).json("Challenge sent");
}
async function challengeScore(req: Request, res: Response) {
  try {
    const options = {
      method: "POST",
      url: "https://global.voice-api.astrideducation.com/api/v1/score",
      data: req.body,
      headers: { "Content-Type": "multipart/form-data" },
    };
    const score = await axios(options);
    const { data } = score;
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
}

async function challengePost(req: Request, res: Response) {
  User.findOneAndUpdate(
    { email: req.body.challenger },
    { challenge: req.body.results }
  )
    .then(async (user) => {
      if (user) {
        await Challenge.deleteOne({ token: req.body.token });
        sendMail(
          req.body.challenger,
          "Challenge has been finished",
          "<p>Login to see results</p>",
          res
        );
      } else {
        return res.status(404).json("Could not send results");
      }
    })
    .catch((error: Error) => res.status(404).json(error));
}
/**
 * Assessment says fetch each new phrase from backend. You could also get them all
 * at once and save the progress frontend, maybe even save to local storage.
 * Another approach could be to save results to database preventing results to get
 * lost if players disconnect etc. and continues on another device.
 * Those things could be implemented at a later stage. Local storage fits the
 * time frame and size of challenge.
 */
async function challengeGet(req: Request, res: Response) {
  const phrases = [
    "Second start to the right",
    "Never is an awfully long time",
    "This is a fierce bad rabbit",
    "I am the strongest girl in the world",
    "You are a dreamer",
  ];
  Challenge.findOne({ token: req.query.token })
    .then((challenge) => {
      if (!challenge) return res.status(404).json("Challenge does not exist");
      return res.status(200).json({ challenge: challenge, phrases: phrases });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export { getChallengeRoutes };
