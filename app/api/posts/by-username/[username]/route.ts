import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

// Extraer username desde la URL
function extractUsernameFromUrl(pathname: string): string | null {
  const match = pathname.match(/\/api\/posts\/by-username\/([^/]+)$/);
  return match?.[1] ?? null;
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const username = extractUsernameFromUrl(req.nextUrl.pathname);

    if (!username) {
      return NextResponse.json({ error: 'Username requerido' }, { status: 400 });
    }

    const posts = await Post.find({ username }).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error al obtener posts por username:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
