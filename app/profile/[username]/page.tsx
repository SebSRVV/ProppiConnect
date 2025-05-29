'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { FiBell, FiMail, FiHash, FiLogOut } from 'react-icons/fi';
import { LuBolt } from 'react-icons/lu';
import { FaStar } from 'react-icons/fa6';

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  exp: number;
}

interface Post {
  _id: string;
  content: string;
  image?: string;
  comments: number;
  views: number;
  rating: number;
  createdAt: string;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-yellow-400 text-sm">
      {Array.from({ length: 12 }).map((_, i) => (
        <FaStar key={i} className={i < rating ? '' : 'text-gray-600'} />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [bio, setBio] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded);

        fetch(`/api/users/${decoded.username}`)
          .then(res => res.json())
          .then(data => setBio(data.bio || ''));

        fetch('/api/posts/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => Array.isArray(data) ? setPosts(data) : console.error('Error al cargar posts', data));
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#0e1117] text-[#f0f6fc]">
      {/* Sidebar Izquierdo */}
      <aside className="w-full md:w-64 bg-[#0e1117] border-r border-[#2d333b] p-6 sticky top-0 h-screen flex flex-col justify-between">
        <nav className="space-y-6">
          <div className="flex items-center gap-3 text-xl font-bold mb-6 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/')}>
            <LuBolt size={22} /> <span>ProppiConnect</span>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-3 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/explore')}>
              <FiHash /> <span>Explorar</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/notifications')}>
              <FiBell /> <span>Notificaciones</span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/messages')}>
              <FiMail /> <span>Mensajes</span>
            </div>
          </div>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className="mt-6 bg-white text-black py-2 rounded-full hover:bg-gray-200 font-semibold"
        >
          <FiLogOut className="inline mr-2" /> Cerrar sesión
        </button>
      </aside>

      {/* Perfil y publicaciones */}
      <section className="flex-1 max-w-4xl mx-auto px-6 py-10 space-y-10">
        {user && (
          <div className="bg-[#161b22] p-6 rounded-lg border border-[#2d333b] space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#3c3f44] text-white text-2xl font-bold flex items-center justify-center">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-xl">{user.username}</p>
                <p className="text-sm text-[#8b949e]">@{user.username}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#c9d1d9] mb-1">Biografía</p>
              <p className="text-[#c9d1d9]">{bio || 'Este usuario aún no ha escrito una biografía.'}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Publicaciones recientes</h2>
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post._id} className="bg-[#161b22] border border-[#2d333b] p-4 rounded-lg hover:bg-[#1a1f29] transition cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 bg-[#3c3f44] rounded-full text-white text-sm font-bold flex items-center justify-center">
                    {user?.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.username}</p>
                    <p className="text-xs text-[#8b949e]">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-[#c9d1d9] mb-2">{post.content}</p>
                {post.image && (
                  <img src={post.image} className="rounded-lg max-h-64 object-cover w-full border border-[#2d333b] mb-2" />
                )}
                <div className="flex justify-between text-xs text-[#8b949e] mt-2">
                  <span>💬 {post.comments} comentarios</span>
                  <RatingStars rating={Math.round(post.rating)} />
                  <span>👁️ {post.views} vistas</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#8b949e] text-sm">Este usuario aún no ha publicado contenido.</p>
          )}
        </div>
      </section>

      {/* Sidebar derecho: Tendencias */}
      <aside className="w-full md:w-80 bg-[#0e1117] text-[#f0f6fc] px-5 py-6 sticky top-0 h-screen overflow-y-auto">
        <div className="bg-[#161b22] rounded-lg p-4 border border-[#2d333b] text-sm">
          <h3 className="font-bold text-base mb-3">Tendencias</h3>
          <ul className="space-y-3 text-[#c9d1d9]">
            {[
              { category: 'Tecnología', topic: 'GPT-5' },
              { category: 'Gaming', topic: 'LoL Worlds' },
              { category: 'Cultura', topic: '#ProppiConnect' },
            ].map((trend, i) => (
              <li key={i} className="hover:bg-[#1a1f29] p-2 rounded-lg cursor-pointer transition">
                <span className="text-[#8b949e] text-xs">Tendencia - {trend.category}</span>
                <p className="font-semibold">{trend.topic}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}
