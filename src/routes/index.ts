import express from "express";
import { getAuthRoutes } from "./auth";
import { getChallengeRoutes } from "./challenge";

function getRoutes() {
  const router = express.Router();
  router.use("/auth", getAuthRoutes());
  router.use("/challenge", getChallengeRoutes());
  return router;
}

export { getRoutes };
