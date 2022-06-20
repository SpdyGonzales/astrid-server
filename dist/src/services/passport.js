"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = __importDefault(require("passport-local"));
const User_1 = __importDefault(require("../models/User"));
const LocalStrategy = passport_local_1.default.Strategy;
const customFields = {
    usernameField: "username",
    passwordField: "password",
};
/**
 * The strategy would include encrypted password
 * but for MVP plain password comparison works
 * Would create strategies for my requests if I had more time
 */
const verifyCallback = (username, password, done) => {
    User_1.default.findOne({ email: username }).then((user) => {
        if (!user) {
            return done(null, false);
        }
        else {
            // const isValid = bcrypt.compareSync(password, user.password);
            const isValid = password === user.password;
            if (!isValid) {
                return done(null, false);
            }
            else {
                return done(null, user);
            }
        }
    });
};
const authenticateUser = (passport) => {
    passport.use(new LocalStrategy(customFields, verifyCallback));
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => User_1.default.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err)));
};
exports.default = authenticateUser;
