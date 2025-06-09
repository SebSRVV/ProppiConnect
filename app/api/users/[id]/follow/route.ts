import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import Notification from '@/models/Notification';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let viewerId: string;
  let viewerUsername: string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      username: string;
    };
    viewerId = decoded.id;
    viewerUsername = decoded.username;
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
  }

  const url = new URL(req.url);
  const targetId = url.pathname.split('/')[3]; // obtiene el `[id]` de /api/users/[id]/follow

  if (!targetId || targetId === viewerId) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const target = await User.findById(targetId);
  const viewer = await User.findById(viewerId);

  if (!target || !viewer) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  const isFollowing = target.followers.includes(viewer._id);

  if (isFollowing) {
    target.followers.pull(viewer._id);
    viewer.following.pull(target._id);
  } else {
    target.followers.push(viewer._id);
    viewer.following.push(target._id);

    // ✅ Crear notificación si es nuevo seguidor
    await Notification.create({
      userId: target._id,
      type: 'follow',
      message: `${viewerUsername} comenzó a seguirte.`,
      read: false,
    });
  }

  await target.save();
  await viewer.save();

  return NextResponse.json({ success: true, isFollowing: !isFollowing });
}
