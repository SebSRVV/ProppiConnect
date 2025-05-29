'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import {
  HiOutlineBell,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineHashtag,
  HiOutlineLightningBolt,
  HiPlus
} from 'react-icons/hi';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  exp: number;
}

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('foryou');
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState<DecodedToken | null>(null);

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
      } catch (err) {
        console.error('Token inválido', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const posts = [
    {
      name: 'María López',
      username: 'mlopez',
      initial: 'M',
      time: '2h',
      content: 'TEST TEST  EMOJI🤖💡',
      image: 'https://placehold.co/600x300/png',
      comments: 24,
      views: '1.2K',
      rating: 10,
    },
    {
      name: 'Carlos Vega',
      username: 'cvega',
      initial: 'C',
      time: '4h',
      content: 'ahgfasdfghasdhfga',
      image: 'https://placehold.co/600x300/222/fff?text=Stream+Preview',
      comments: 11,
      views: '600',
      rating: 7,
    },
    {
      name: 'Ana Dev',
      username: 'anadev',
      initial: 'A',
      time: '6h',
      content: 'Pssssssxddddddddddddddddd',
      image: '',
      comments: 6,
      views: '300',
      rating: 5,
    },
    {
      name: 'Juan Gamer',
      username: 'juangamer',
      initial: 'J',
      time: '1d',
      content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      image: 'https://placehold.co/600x300/111/eee?text=Gameplay',
      comments: 20,
      views: '1.1K',
      rating: 12,
    },
  ];

  return (
    <main className="flex flex-col md:flex-row min-h-screen text-[#f0f6fc] bg-[#0e1117] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0e1117] border-r border-[#2d333b] flex flex-col justify-between py-6 px-5 sticky top-0 h-screen">
        <nav className="space-y-8">
          <div
            className="text-xl font-bold mb-4 cursor-pointer flex items-center space-x-2 hover:text-[#1d9bf0]"
            onClick={() => router.push('/')}
          >
            <HiOutlineLightningBolt size={22} /> <span>ProppiConnect</span>
          </div>

          <ul className="space-y-5 text-md font-medium">
            <li className="flex items-center space-x-3 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/explore')}>
              <HiOutlineHashtag /> <span>Explorar</span>
            </li>
            <li className="flex items-center justify-between relative hover:text-[#1d9bf0] cursor-pointer" onClick={() => router.push('/notifications')}>
              <div className="flex items-center space-x-3">
                <HiOutlineBell /> <span>Notificaciones</span>
              </div>
              <span className="absolute -top-1 right-0 text-xs bg-[#f85149] text-white rounded-full px-1">2</span>
            </li>
            <li className="flex items-center space-x-3 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/messages')}>
              <HiOutlineMail /> <span>Mensajes</span>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-sm text-[#8b949e] mb-2">CANALES SEGUIDOS</p>
          <ul className="space-y-3 text-sm">
            {[
              { name: 'aceu +2', viewers: '8.2K' },
              { name: 'Jay3', viewers: '1.4K' },
              { name: 'shroud', viewers: '8.8K' },
              { name: 'Emiru', viewers: '19.4K' },
            ].map((channel, i) => (
              <li
                key={i}
                className="flex justify-between items-center hover:text-[#1d9bf0] cursor-pointer"
                onClick={() => router.push(`/channel/${channel.name.toLowerCase()}`)}
              >
                <span>{channel.name}</span>
                <span className="text-[#f85149] font-semibold">{channel.viewers}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex space-x-2">
            <button className="bg-[#1d9bf0] w-full py-2 rounded-full font-semibold hover:bg-[#1a8cd8]" onClick={() => router.push('/register')}>
              Crear cuenta
            </button>
            <button className="bg-white text-black w-full py-2 rounded-full font-semibold hover:bg-gray-200" onClick={() => router.push('/login')}>
              Iniciar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Feed */}
      <section className="flex-1 border-r border-[#2d333b] px-6 py-5 overflow-y-auto h-screen">
        <div className="border-b border-[#2d333b] flex justify-around text-sm text-[#8b949e] mb-6">
          <span
            className={`cursor-pointer pb-2 ${activeTab === 'foryou' ? 'text-[#f0f6fc] border-b-2 border-[#1d9bf0]' : 'hover:text-[#1d9bf0]'}`}
            onClick={() => setActiveTab('foryou')}
          >
            Para ti
          </span>
          <span
            className={`cursor-pointer pb-2 ${activeTab === 'following' ? 'text-[#f0f6fc] border-b-2 border-[#1d9bf0]' : 'hover:text-[#1d9bf0]'}`}
            onClick={() => setActiveTab('following')}
          >
            Siguiendo
          </span>
        </div>

        {posts.map((post, i) => (
          <div key={i} className="mb-6 border border-[#2d333b] p-5 rounded-xl bg-[#161b22] hover:bg-[#1a1f29] transition shadow-sm cursor-pointer">
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-[#3c3f44] flex items-center justify-center font-bold text-white mr-3">{post.initial}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">{post.name}</span>
                  <span className="text-xs text-[#8b949e]">@{post.username} · {post.time}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#c9d1d9]">{post.content}</p>
              </div>
            </div>
            {post.image && (
              <div className="overflow-hidden rounded-lg mb-4 border border-[#2d333b]">
                <img src={post.image} alt="Post" className="w-full h-52 object-cover transition-transform hover:scale-105 duration-300" />
              </div>
            )}
            <div className="flex justify-between items-center text-sm text-[#8b949e] mt-3 px-1">
              <span className="flex items-center space-x-1">💬<span>{post.comments}</span></span>
              <span className="text-yellow-400 text-md tracking-wide">
                {Array.from({ length: 12 }).map((_, idx) =>
                  idx < post.rating ? <FaStar key={idx} className="inline" /> : <FaRegStar key={idx} className="inline text-gray-600" />
                )}
              </span>
              <span className="flex items-center space-x-1">👁️<span>{post.views} vistas</span></span>
            </div>
          </div>
        ))}

        {/* Botón flotante */}
        <button
          onClick={() => {
            if (userData) {
              setShowModal(true);
            } else {
              router.push('/login');
            }
          }}
          className="fixed bottom-6 right-6 bg-[#1d9bf0] p-4 rounded-full shadow-lg hover:bg-[#1a8cd8] z-50"
          title="Nuevo post"
        >
          <HiPlus size={24} />
        </button>

        {/* Modal para nuevo post */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#161b22] p-6 rounded-lg w-full max-w-lg">
              <textarea
                className="w-full bg-transparent border border-[#2d333b] p-2 rounded text-white"
                rows={4}
                placeholder="¿Qué estás pensando?"
              />
              <div className="flex justify-end mt-3">
                <button className="bg-[#1d9bf0] px-4 py-2 rounded hover:bg-[#1a8cd8]" onClick={() => setShowModal(false)}>
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Panel derecho */}
      <aside className="w-full md:w-80 bg-[#0e1117] text-[#f0f6fc] px-5 py-6 space-y-6 sticky top-0 h-screen overflow-y-auto">
        <div className="bg-[#161b22] rounded-lg p-4 border border-[#2d333b]">
          <div className="w-14 h-14 rounded-full bg-gray-500 mb-2 flex items-center justify-center text-xl font-bold text-white">
            {userData?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <p className="font-bold text-lg">
            {userData?.username || 'Invitado'}
          </p>
          <p className="text-sm text-[#8b949e]">
            {userData ? `@${userData.username}` : 'No has iniciado sesión'}
          </p>
          <button
            className="bg-[#1d9bf0] mt-3 py-2 w-full rounded-full font-semibold hover:bg-[#1a8cd8] flex items-center justify-center space-x-2"
            onClick={() => router.push(userData ? '/profile' : '/login')}
          >
            <HiOutlineUser /> <span>{userData ? 'Perfil' : 'Iniciar sesión'}</span>
          </button>
        </div>

        <div className="bg-[#161b22] rounded-lg p-4 border border-[#2d333b] text-sm">
          <h3 className="font-bold text-base mb-3">Qué está pasando</h3>
          <ul className="space-y-3 text-[#c9d1d9]">
            {[
              { category: 'Tecnología', topic: 'La IA' },
              { category: 'Deportes', topic: 'Jugador de Fútbol' },
              { category: 'Entretenimiento', topic: '#SebRVV' },
            ].map((trend, i) => (
              <li key={i} className="hover:bg-[#1a1f29] p-2 rounded-lg transition cursor-pointer">
                <span className="text-[#8b949e] text-xs">Tendencia - {trend.category}</span>
                <p className="font-semibold">{trend.topic}</p>
              </li>
            ))}
            <li className="text-[#1d9bf0] cursor-pointer hover:underline" onClick={() => router.push('/trending')}>
              Mostrar más
            </li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
