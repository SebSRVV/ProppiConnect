import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const posts = await Post.find({ userId: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (err) {
    console.error('Error en /api/posts/user:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
