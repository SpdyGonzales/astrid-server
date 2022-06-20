"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = __importDefault(require("passport-local"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const LocalStrategy = passport_local_1.default.Strategy;
const customFields = {
    usernameField: "email",
    passwordField: "password",
};
const verifyCallback = (email, password, done) => {
    User_1.default.findOne({ email }).then((user) => {
        if (!user) {
            return done(null, false);
        }
        else {
            const isValid = bcryptjs_1.default.compareSync(password, user.password);
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
