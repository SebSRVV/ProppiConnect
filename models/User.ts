import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  stars: number;
  participationRating: number;
  categoriesFollowed: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now },
  stars: { type: Number, default: 0 },
  participationRating: { type: Number, default: 0 },
  categoriesFollowed: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
