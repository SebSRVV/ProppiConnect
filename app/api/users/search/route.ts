import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  const users = await User.find({
    username: { $regex: query, $options: 'i' },
  }).select('username bio avatarUrl');

  return NextResponse.json(users);
}
