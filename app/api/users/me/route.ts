import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function PATCH(req: NextRequest) {
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
    const { bio, avatarUrl } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio, avatarUrl },
      { new: true }
    ).select('_id username bio avatarUrl followers');

    if (!updatedUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
