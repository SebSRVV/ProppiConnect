import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const postId = url.pathname.split('/').pop(); // Extrae el ID desde la URL

  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: 'ID de post inválido' }, { status: 400 });
  }

  try {
    await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al aumentar vistas:', error);
    return NextResponse.json({ error: 'Error al contar vista' }, { status: 500 });
  }
}
