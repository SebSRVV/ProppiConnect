import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  await dbConnect();

  const user = await User.findOne({ username: params.username })
    .select('username bio avatarUrl');

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return NextResponse.json(user);
}
