import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models/Post';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      username: string;
    };

    const body = await req.json();
    const content = body.content?.toString().trim();

    if (!content) {
      return NextResponse.json({ error: 'El contenido está vacío' }, { status: 400 });
    }

    const newPost = await Post.create({
      authorId: decoded.id, // ✅ importante: usa authorId según tu modelo
      username: decoded.username,
      content,
      image: '', // puedes implementar imagen más adelante
      comments: 0,
      views: 0,
      rating: 0,
    });

    return NextResponse.json(newPost);
  } catch (err: any) {
    console.error('Error al crear post:', err);
    return NextResponse.json(
      { error: 'Error al crear el post', details: err.message },
      { status: 500 }
    );
  }
}
