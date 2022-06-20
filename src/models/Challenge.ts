import { Schema, model } from "mongoose";
/**
 * Reading best practices for mongodb I came to the conclusion that embedded
 * documents were the prefered way even on larger documents.
 * With TTL not being possible for subdocuments the only way I saw was to
 * schedule a cron job or a post save timer.. Could be a possibility.
 */
interface Challenge {
  token: string;
  challenger: string;
  difficulty: string;
  expiresAt: Date;
}

const challengeSchema = new Schema({
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

const Challenge = model<Challenge>("Challenge", challengeSchema);
export default Challenge;
