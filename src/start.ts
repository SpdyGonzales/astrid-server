import express, { NextFunction, Request, Response } from "express";
import logger from "loglevel";
import authenticateUser from "./services/passport";
import { getRoutes } from "./routes";
const cors = require("cors");
const bodyparser = require("body-parser");
// const passport = require("passport");
const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURI);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

function startServer({ port = process.env.PORT } = {}) {
  const app = express();
  app.use(cors());
  app.use(
    bodyparser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyparser.json());
  // authenticateUser(passport);
  app.use(errorMiddleware);

  app.listen(port, () => {
    console.log(`Application running at http://localhost:${port}/`);
    app.use("/", getRoutes());
    connectDatabase();
  });
}

function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    next(error);
  } else {
    logger.error(error);
    res.status(500);
    res.json({
      message: error.message,
      ...(process.env.NODE_ENV === "production"
        ? null
        : { stack: error.stack }),
    });
  }
}

export { startServer };
