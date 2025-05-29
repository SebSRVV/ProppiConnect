import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  targetType: { type: String, enum: ["post", "comment", "user"] },
  targetId: Schema.Types.ObjectId,
  value: Number,
  createdAt: { type: Date, default: Date.now }
});

export const Rating = mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
