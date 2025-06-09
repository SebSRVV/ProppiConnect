'use client';

import { useRouter } from 'next/navigation';
import { HiOutlineHashtag, HiOutlineBell, HiOutlineMail, HiOutlineLightningBolt } from 'react-icons/hi';

export function LeftSidebar() {
  const router = useRouter();

  return (
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
  );
}
