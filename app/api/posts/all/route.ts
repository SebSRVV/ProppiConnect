// app/api/posts/all/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET() {
  try {
    await dbConnect();

    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    return NextResponse.json({ error: 'Error al obtener publicaciones' }, { status: 500 });
  }
}
