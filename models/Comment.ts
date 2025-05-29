import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  authorId: { type: Schema.Types.ObjectId, ref: "User" },
  content: String,
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 }
});

export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
