import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  followersCount: { type: Number, default: 0 },
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
