import { Schema, model } from "mongoose";

interface User {
  username: string;
  email: string;
  password: string;
  challenge: any;
}

const userSchema = new Schema<User>({
  username: { type: "String", required: true },
  email: { type: "String", required: true, unique: true },
  password: { type: "String", required: true },
  challenge: {
    type: "Map",
    of: "Number",
  },
});

const User = model<User>("User", userSchema);
export default User;
