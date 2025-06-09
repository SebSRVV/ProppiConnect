import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';

export async function GET(req: NextRequest) {
  await dbConnect();

  const postId = req.nextUrl.pathname.split('/').pop(); // o usa regex si prefieres

  if (!postId) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error al obtener post:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
