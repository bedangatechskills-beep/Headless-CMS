import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    photo: { type: String, default: "" },         // Cloudinary URL
    bio: { type: String, default: "" },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);