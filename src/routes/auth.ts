import express, { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User";

function getAuthRoutes() {
  const router = express.Router();
  router.post("/login", login);
  return router;
}

async function login(req: Request, res: Response) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(404).json("Invalid email");

      //validate password. Should be encrypted in prod
      if (user.password !== req.body.password)
        return res.status(404).json({ message: "Invalid password" });

      const token = jwt.sign(
        {
          username: user.username,
        },
        process.env.SECRET as string
      );
      // Login successful, write token, and send back user
      res
        .status(200)
        .json({ token: token, user: user.email, challenge: user.challenge });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export { getAuthRoutes };
