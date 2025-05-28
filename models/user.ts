import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: String,
  email: String,
  passwordHash: String,
  bio: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now },
  stars: { type: Number, default: 0 },
  participationRating: { type: Number, default: 0 },
  categoriesFollowed: [{ type: Schema.Types.ObjectId, ref: "Category" }]
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
