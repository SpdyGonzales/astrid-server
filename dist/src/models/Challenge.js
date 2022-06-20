"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const challengeSchema = new mongoose_1.Schema({
    token: {
        type: String,
    },
    difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "proficient"],
        default: "beginner",
    },
    challenger: {
        type: String,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: "7d" },
    },
});
const Challenge = (0, mongoose_1.model)("Challenge", challengeSchema);
exports.default = Challenge;
