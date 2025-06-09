import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Category } from '@/models/Category';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  await dbConnect();

  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET) as { id: string };

    const user = await User.findById(decoded.id).select('categoriesFollowed');

    if (!user || !user.categoriesFollowed || user.categoriesFollowed.length === 0) {
      return NextResponse.json([]);
    }

    const categories = await Category.find({
      _id: { $in: user.categoriesFollowed },
    }).select('name description');

    const result = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
      description: cat.description,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error en /api/following-channels:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
