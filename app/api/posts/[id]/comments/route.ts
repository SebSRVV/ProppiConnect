import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Helper para extraer el ID desde la URL
function extractPostIdFromUrl(url: string): string | null {
  const match = url.match(/\/api\/posts\/([^/]+)\/comments/);
  return match?.[1] ?? null;
}

export async function POST(req: NextRequest) {
  await dbConnect();

  const postId = extractPostIdFromUrl(req.nextUrl.pathname);
  if (!postId) {
    return NextResponse.json({ error: 'ID de post inválido' }, { status: 400 });
  }

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let decoded: { id: string; username: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      username: string;
    };
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text) {
    return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
  }

  const newComment = await Comment.create({
    postId: new mongoose.Types.ObjectId(postId),
    userId: decoded.id,
    author: decoded.username,
    text,
  });

  await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

  const post = await Post.findById(postId);
  if (post && post.userId.toString() !== decoded.id) {
    await Notification.create({
      userId: post.userId,
      type: 'comment',
      message: `${decoded.username} comentó en tu publicación.`,
      read: false,
    });
  }

  return NextResponse.json(newComment);
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const postId = extractPostIdFromUrl(req.nextUrl.pathname);
  if (!postId) {
    return NextResponse.json({ error: 'ID de post inválido' }, { status: 400 });
  }

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: 1 });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error al cargar comentarios:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
