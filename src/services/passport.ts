import local_strategy from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { PassportStatic } from "passport";

const LocalStrategy = local_strategy.Strategy;

const customFields = {
  usernameField: "username",
  passwordField: "password",
};
/**
 * The strategy would include encrypted password
 * but for MVP plain password comparison works
 * Would create strategies for my requests if I had more time
 */
const verifyCallback = (username: string, password: string, done: any) => {
  User.findOne({ email: username }).then((user) => {
    if (!user) {
      return done(null, false);
    } else {
      // const isValid = bcrypt.compareSync(password, user.password);
      const isValid = password === user.password;
      if (!isValid) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }
  });
};

const authenticateUser = (passport: PassportStatic) => {
  passport.use(new LocalStrategy(customFields, verifyCallback));

  passport.serializeUser((user: { _id?: number }, done) =>
    done(null, user._id)
  );

  passport.deserializeUser((id, done) =>
    User.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err))
  );
};

export default authenticateUser;
