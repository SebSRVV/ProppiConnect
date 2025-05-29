import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Rating from '@/models/Rating';

export async function POST(req: NextRequest) {
  await dbConnect();

  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = auth.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  const { postId, value } = await req.json();

  if (!postId || typeof value !== 'number' || value < 1 || value > 12) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  // Guardar o actualizar rating
  await Rating.findOneAndUpdate(
    { userId: decoded.id, postId },
    { value },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Recalcular promedio
  const ratings = await Rating.find({ postId });
  const average = ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length;

  // Guardar nuevo promedio
  await Post.findByIdAndUpdate(postId, { rating: average });

  return NextResponse.json({ message: 'Rating actualizado', rating: average });
}
