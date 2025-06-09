import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Category } from '@/models/Category';

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find({
      name: { $exists: true, $ne: '' },
    }).select('_id name description followersCount');

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
