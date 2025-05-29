// app/api/posts/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const posts = await Post.find({ userId: decoded.id }).sort({ createdAt: -1 });

  return NextResponse.json(posts);
}
