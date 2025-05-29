import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  content: String,
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  rating: { type: Number, default: 0 },
  stars: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }
});

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
