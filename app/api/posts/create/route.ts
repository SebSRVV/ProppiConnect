import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string };

  const formData = await req.formData();
  const content = formData.get('content')?.toString() || '';
  const file = formData.get('image') as File | null;

  let imageUrl = '';

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${uuidv4()}-${file.name}`;
    const filepath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(filepath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const newPost = await Post.create({
    userId: decoded.id,
    username: decoded.username,
    content,
    image: imageUrl,
    comments: 0,
    views: 0,
    rating: 0,
  });

  return NextResponse.json(newPost);
}
