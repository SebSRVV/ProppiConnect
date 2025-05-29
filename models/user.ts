import mongoose, { Schema, Document, Types } from 'mongoose';

// Interfaz para tipar el documento de usuario
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
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio:      { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  stars: { type: Number, default: 0 },
  participationRating: { type: Number, default: 0 },
  categoriesFollowed: [{ type: Schema.Types.ObjectId, ref: "Category" }]
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
