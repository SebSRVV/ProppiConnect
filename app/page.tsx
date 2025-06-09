'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { RatingStars } from '@/components/RatingStars';

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  exp: number;
}

interface Post {
  _id: string;
  username: string;
  content: string;
  image?: string;
  comments: number;
  views: number;
  rating: number;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<DecodedToken | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUserData(decoded);
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }

    fetch('/api/posts/all')
      .then(res => res.json())
      .then(setPosts)
      .catch(err => console.error('Error al obtener posts:', err));
  }, []);

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#0e1117] text-[#f0f6fc] font-sans">
      <LeftSidebar />

      <section className="flex-1 max-w-3xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold mb-4 text-white">Últimas publicaciones</h1>

        {posts.length === 0 && (
          <p className="text-center text-[#8b949e]">No hay publicaciones disponibles.</p>
        )}

        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => router.push(`/post/${post._id}`)}
            className="cursor-pointer bg-[#161b22] p-5 rounded-lg border border-[#2d333b] hover:bg-[#1b1f27] transition shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#3c3f44] text-white font-bold flex items-center justify-center text-sm">
                {post.username[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold">{post.username}</p>
                <p className="text-xs text-[#8b949e]">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <p className="text-[#c9d1d9] text-sm mb-3">{post.content}</p>

            {post.image && (
              <div className="overflow-hidden rounded mb-3 border border-[#2d333b]">
                <img
                  src={post.image}
                  alt="Imagen del post"
                  className="w-full max-h-60 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-[#8b949e] mt-2">
              <span>💬 {post.comments} comentarios</span>
              <RatingStars
                postId={post._id}
                initial={post.rating}
                token={localStorage.getItem('token') || ''}
              />
              <span>👁️ {post.views} vistas</span>
            </div>
          </div>
        ))}
      </section>

      <RightSidebar />
    </main>
  );
}
