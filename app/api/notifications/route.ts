import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  await dbConnect();

  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = auth.split(' ')[1];
  let userId: string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = decoded.id;
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100) // Puedes quitar esto si quieres todas sin límite
      .lean();

    return NextResponse.json(notifications);
  } catch (err) {
    return NextResponse.json({ error: 'Error al obtener notificaciones' }, { status: 500 });
  }
}
