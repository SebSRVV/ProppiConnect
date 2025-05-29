import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Rating from '@/models/Rating';
import Post from '@/models/Post';
import Notification from '@/models/Notification';

export async function POST(req: NextRequest) {
  await dbConnect();

  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = auth.split(' ')[1];
  let decoded: { id: string; username: string };
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string };
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

  // Actualizar post
  const post = await Post.findByIdAndUpdate(postId, { rating: average }, { new: true });

  // Notificación si votó otro usuario
  if (post && post.userId.toString() !== decoded.id) {
    await Notification.create({
      userId: post.userId,
      type: 'rating',
      message: `${decoded.username} calificó tu publicación con ${value} estrellas.`,
      read: false,
    });
  }

  return NextResponse.json({ message: 'Rating actualizado', rating: average });
}
