import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';

// Extraer el ID del post desde la URL
function extractPostIdFromUrl(pathname: string): string | null {
  const match = pathname.match(/\/api\/posts\/delete\/([^/]+)$/);
  return match?.[1] ?? null;
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  const postId = extractPostIdFromUrl(req.nextUrl.pathname);
  if (!postId) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
  }

  if (post.userId.toString() !== decoded.id) {
    return NextResponse.json({ error: 'No puedes eliminar este post' }, { status: 403 });
  }

  await post.deleteOne();
  return NextResponse.json({ message: 'Post eliminado' });
}
