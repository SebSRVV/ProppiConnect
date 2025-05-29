import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string };
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  const { text } = await req.json();

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ error: 'Texto de comentario inválido' }, { status: 400 });
  }

  const newComment = await Comment.create({
    postId: params.id,
    author: decoded.username,
    text,
    createdAt: new Date(),
  });

  // Incrementar contador de comentarios en el post
  await Post.findByIdAndUpdate(params.id, { $inc: { comments: 1 } });

  return NextResponse.json(newComment);
}
