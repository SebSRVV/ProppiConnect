import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import { User } from '../../models/user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    const users = await User.find({});
    return res.status(200).json(users);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
