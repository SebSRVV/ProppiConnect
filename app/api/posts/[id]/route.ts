import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(req: NextRequest) {
  await dbConnect();

  // ✅ Obtener el ID desde la URL
  const url = new URL(req.url);
  const postId = url.pathname.split('/').pop(); // último segmento

  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const post = await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true });

  if (!post) {
    return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
  }

  return NextResponse.json(post);
}
