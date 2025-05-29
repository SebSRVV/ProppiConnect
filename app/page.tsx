'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FaHome,
  FaBell,
  FaEnvelope,
  FaUser,
  FaHashtag,
  FaRocket,
} from 'react-icons/fa';

export default function HomePage() {
  const router = useRouter();

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
    <main className="flex h-screen text-[#f0f6fc] bg-[#0e1117] font-sans overflow-hidden">
      {/* Sidebar Izquierdo */}
      <aside className="w-64 bg-[#0e1117] border-r border-[#2d333b] flex flex-col justify-between py-6 px-5 sticky top-0 h-screen">
        <nav className="space-y-8">
          <div
            className="text-xl font-bold mb-4 cursor-pointer flex items-center space-x-2 hover:text-[#1d9bf0] transition-colors"
            onClick={() => router.push('/')}
          >
            <FaRocket size={22} /> <span>ProppiConnect</span>
          </div>

          <ul className="space-y-5 text-md font-medium">
            <li
              className="flex items-center space-x-3 cursor-pointer hover:text-[#1d9bf0] transition-colors"
              onClick={() => router.push('/explore')}
            >
              <FaHashtag /> <span>Explorar</span>
            </li>
            <li
              className="flex items-center justify-between relative hover:text-[#1d9bf0] cursor-pointer transition-colors"
              onClick={() => router.push('/notifications')}
            >
              <div className="flex items-center space-x-3">
                <FaBell /> <span>Notificaciones</span>
              </div>
              <span className="absolute -top-1 right-0 text-xs bg-[#f85149] text-white rounded-full px-1">2</span>
            </li>
            <li
              className="flex items-center space-x-3 cursor-pointer hover:text-[#1d9bf0] transition-colors"
              onClick={() => router.push('/messages')}
            >
              <FaEnvelope /> <span>Mensajes</span>
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
            <button
              className="bg-[#1d9bf0] w-full py-2 rounded-full font-semibold hover:bg-[#1a8cd8] transition-colors"
              onClick={() => router.push('/register')}
            >
              Crear cuenta
            </button>
            <button
              className="bg-white text-black w-full py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
              onClick={() => router.push('/login')}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Feed Central */}
      <section className="flex-1 border-r border-[#2d333b] px-6 py-5 overflow-y-auto h-screen">
        <div className="border-b border-[#2d333b] flex justify-around text-sm text-[#8b949e] mb-6">
          <span
            className="text-[#f0f6fc] border-b-2 border-[#1d9bf0] pb-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            Para ti
          </span>
          <span
            className="cursor-pointer hover:text-[#1d9bf0] transition-colors"
            onClick={() => router.push('/following')}
          >
            Siguiendo
          </span>
        </div>

        {posts.map((post, i) => (
          <div
            key={i}
            className="mb-6 border border-[#2d333b] p-5 rounded-xl bg-[#161b22] hover:bg-[#1a1f29] transition cursor-pointer shadow-sm"
          >
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-[#3c3f44] flex items-center justify-center font-bold text-white mr-3">
                {post.initial}
              </div>
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
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-52 object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-[#8b949e] mt-3 px-1">
              <span className="flex items-center space-x-1">
                <span>💬</span>
                <span>{post.comments}</span>
              </span>

              <span className="text-yellow-400 text-md tracking-wide">
                {Array.from({ length: 12 }).map((_, idx) =>
                  idx < post.rating ? '★' : '☆'
                )}
              </span>

              <span className="flex items-center space-x-1">
                <span>👁️</span>
                <span>{post.views} vistas</span>
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Panel Derecho */}
      <aside className="w-80 bg-[#0e1117] text-[#f0f6fc] px-5 py-6 space-y-6 sticky top-0 h-screen overflow-y-auto">
        <div className="bg-[#161b22] rounded-lg p-4 border border-[#2d333b]">
          <div className="w-14 h-14 rounded-full bg-gray-500 mb-2"></div>
          <p className="font-bold text-lg">SebRVV</p>
          <p className="text-sm text-[#8b949e]">@TVSebRVV</p>
          <button
            className="bg-[#1d9bf0] mt-3 py-2 w-full rounded-full font-semibold hover:bg-[#1a8cd8] transition-colors flex items-center justify-center space-x-2"
            onClick={() => router.push('/profile')}
          >
            <FaUser /> <span>Perfil</span>
          </button>
        </div>

        <div className="bg-[#161b22] rounded-lg p-4 border border-[#2d333b] text-sm">
          <h3 className="font-bold text-base mb-3">Qué está pasando</h3>
          <ul className="space-y-3 text-[#c9d1d9]">
            <li>
              <span className="text-[#8b949e]">Tendencia - Tecnología</span>
              <br />La IA
            </li>
            <li>
              <span className="text-[#8b949e]">Tendencia - Deportes</span>
              <br />Jugador de Fútbol
            </li>
            <li>
              <span className="text-[#8b949e]">Tendencia - Entretenimiento</span>
              <br />#SebRVV
            </li>
            <li
              className="text-[#1d9bf0] cursor-pointer hover:underline"
              onClick={() => router.push('/trending')}
            >
              Mostrar más
            </li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
