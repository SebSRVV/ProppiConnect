import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

// Helper para extraer el username desde la URL
function extractUsernameFromUrl(pathname: string): string | null {
  const match = pathname.match(/\/api\/users\/([^/]+)$/);
  return match?.[1] ?? null;
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const username = extractUsernameFromUrl(req.nextUrl.pathname);
  if (!username) {
    return NextResponse.json({ error: 'Nombre de usuario inválido' }, { status: 400 });
  }

  const user = await User.findOne({ username })
    .select('username bio avatarUrl');

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return NextResponse.json(user);
}
