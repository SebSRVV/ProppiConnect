import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  const post = await Post.findById(params.id);

  if (!post) return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
  if (post.userId.toString() !== decoded.id) {
    return NextResponse.json({ error: 'No puedes eliminar este post' }, { status: 403 });
  }

  await post.deleteOne();
  return NextResponse.json({ message: 'Post eliminado' });
}
