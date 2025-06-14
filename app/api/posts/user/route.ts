import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  await dbConnect();

  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let userId: string;

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET) as { id: string };
    userId = decoded.id;
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  try {
    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .select('_id content image comments views rating createdAt');

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener publicaciones' },
      { status: 500 }
    );
  }
}
