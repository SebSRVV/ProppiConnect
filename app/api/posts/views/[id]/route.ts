import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const postId = params.id;
  if (!postId) {
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
