import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRating extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  value: number; // 0-12
}

const RatingSchema = new Schema<IRating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  value: { type: Number, required: true, min: 0, max: 12 },
});

RatingSchema.index({ userId: 1, postId: 1 }, { unique: true }); // un rating por usuario por post

export default mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);
