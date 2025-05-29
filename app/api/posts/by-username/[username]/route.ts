// app/api/posts/by-username/[username]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  await dbConnect();

  try {
    const username = params.username;

    if (!username) {
      return NextResponse.json({ error: 'Username requerido' }, { status: 400 });
    }

    const posts = await Post.find({ username }).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error al obtener posts por username:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
