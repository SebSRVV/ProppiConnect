import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRating {
  userId: Types.ObjectId;
  value: number; // de 1 a 12
}

export interface IPost extends Document {
  authorId: Types.ObjectId;
  username?: string; // opcionalmente cacheado
  content: string;
  image?: string;
  views: number;
  rating: number;
  ratings: IRating[];
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, min: 1, max: 12, required: true },
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
      trim: true,
    },
    image: { type: String },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratings: { type: [RatingSchema], default: [] },
    comments: { type: Number, default: 0 },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

// Indexes para mejorar rendimiento de búsquedas
PostSchema.index({ createdAt: -1 });
PostSchema.index({ authorId: 1 });

export const Post =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
