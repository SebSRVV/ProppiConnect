'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { HiOutlineUser, HiOutlineHashtag, HiOutlineLightningBolt, HiOutlineBell, HiOutlineMail, HiPlus } from 'react-icons/hi';
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
      {/* Sidebar izquierdo */}
      <aside className="w-full md:w-64 bg-[#0e1117] border-r border-[#2d333b] p-6 sticky top-0 h-screen flex flex-col justify-between">
        <nav className="space-y-8">
          <div onClick={() => router.push('/')} className="text-xl font-bold flex items-center gap-2 hover:text-[#1d9bf0] cursor-pointer">
            <HiOutlineLightningBolt size={22} /> <span>ProppiConnect</span>
          </div>
          <ul className="space-y-5 text-md">
            <li onClick={() => router.push('/explore')} className="flex items-center gap-3 cursor-pointer hover:text-[#1d9bf0]">
              <HiOutlineHashtag /> Explorar
            </li>
            <li onClick={() => router.push('/notifications')} className="flex items-center gap-3 cursor-pointer hover:text-[#1d9bf0]">
              <HiOutlineBell /> Notificaciones
            </li>
            <li onClick={() => router.push('/messages')} className="flex items-center gap-3 cursor-pointer hover:text-[#1d9bf0]">
              <HiOutlineMail /> Mensajes
            </li>
          </ul>
        </nav>
        <button
          className="bg-white text-black py-2 mt-4 rounded-full hover:bg-gray-200 font-semibold"
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Feed central */}
      <section className="flex-1 max-w-3xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-white mb-4">Últimas publicaciones</h1>

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
              <RatingStars postId={post._id} initial={post.rating} token={localStorage.getItem('token') || ''} />
              <span>👁️ {post.views} vistas</span>
            </div>
          </div>
        ))}
      </section>

      {/* Sidebar derecho */}
      <aside className="w-full md:w-80 bg-[#0e1117] text-[#f0f6fc] px-5 py-6 sticky top-0 h-screen overflow-y-auto">
        <div className="bg-[#161b22] rounded-lg p-4 border border-[#2d333b] mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-500 flex items-center justify-center text-xl font-bold text-white mb-2">
            {userData?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <p className="font-bold text-lg">{userData?.username || 'Invitado'}</p>
          <p className="text-sm text-[#8b949e]">
            {userData ? `@${userData.username}` : 'No has iniciado sesión'}
          </p>
          <button
            className="bg-[#1d9bf0] mt-4 py-2 w-full rounded-full font-semibold hover:bg-[#1a8cd8] flex items-center justify-center space-x-2"
            onClick={() => router.push(userData ? '/profile' : '/login')}
          >
            <HiOutlineUser /> <span>{userData ? 'Perfil' : 'Iniciar sesión'}</span>
          </button>
        </div>

        <div className="bg-[#161b22] rounded-lg p-4 border border-[#2d333b] text-sm">
          <h3 className="font-bold text-base mb-3">Tendencias</h3>
          <ul className="space-y-3 text-[#c9d1d9]">
            {[
              { category: 'Tecnología', topic: 'GPT-5' },
              { category: 'Gaming', topic: 'LoL Worlds' },
              { category: 'Cultura', topic: '#ProppiConnect' },
            ].map((trend, i) => (
              <li key={i} className="hover:bg-[#1a1f29] p-2 rounded-lg transition cursor-pointer">
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
