import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRating {
  userId: Types.ObjectId;
  value: number; // de 1 a 12
}

export interface IPost extends Document {
  userId: Types.ObjectId;
  username?: string; // opcional cacheado
  content: string;
  image?: string;
  views: number;
  rating: number; // promedio actual
  ratings: IRating[]; // historial de votaciones
  comments: number;
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, min: 1, max: 12, required: true },
}, { _id: false });

const PostSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String }, // opcionalmente cacheamos
  content: { type: String, required: true },
  image: { type: String },
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, // promedio
  ratings: { type: [RatingSchema], default: [] }, // usuarios que han votado
  comments: { type: Number, default: 0 }, // total de comentarios
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
