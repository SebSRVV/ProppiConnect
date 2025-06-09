import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  try {
    const users = query
      ? await User.find({
          username: { $regex: query, $options: 'i' },
        }).select('_id username bio avatarUrl followers')
      : await User.find()
          .select('_id username bio avatarUrl followers')
          .sort({ createdAt: -1 })
          .limit(50);

    // Añade count de seguidores a la respuesta
    const formatted = users.map((u) => ({
      _id: u._id,
      username: u.username,
      bio: u.bio || '',
      avatarUrl: u.avatarUrl || null,
      followers: u.followers?.length || 0,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
