import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }   // NEVER store the plain password
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);