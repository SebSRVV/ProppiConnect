import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // Extrae el ID del path

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  // Extrae el ID del usuario autenticado (viewer)
  let viewerId: string | null = null;
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      viewerId = decoded.id;
    } catch {
      viewerId = null;
    }
  }

  try {
    const user = await User.findById(id).select('_id username email bio avatarUrl followers');

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isFollowing =
      !!viewerId &&
      (user.followers as Types.ObjectId[]).some(
        (followerId: Types.ObjectId) => followerId.toString() === viewerId
      );

    return NextResponse.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
      followers: Array.isArray(user.followers) ? user.followers.length : 0,
      isFollowing,
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
  }
}
