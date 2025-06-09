'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineUser } from 'react-icons/hi';
import { jwtDecode } from 'jwt-decode';

interface Channel {
  id: string;
  name: string;
  description: string;
}

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  exp: number;
}

interface UserProfile {
  username: string;
  avatarUrl?: string;
  followers: number;
}

export function RightSidebar() {
  const router = useRouter();
  const [userData, setUserData] = useState<DecodedToken | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUserData(decoded);

        fetch(`/api/users/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(setUserProfile)
          .catch(() => {});

        fetch('/api/following-channels', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(setChannels)
          .catch(() => {});
      } else {
        localStorage.removeItem('token');
      }
    } catch {
      localStorage.removeItem('token');
    }
  }, []);

  const handleCreatePost = async () => {
    const token = localStorage.getItem('token');
    if (!token || !newPost.trim()) return;

    setIsPosting(true);

    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewPost('');
        alert('✅ Publicación creada');
        router.refresh?.(); // si usas App Router
      } else {
        alert(data.error || 'Error al publicar');
      }
    } catch (error) {
      alert('Error al publicar');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <aside className="w-full md:w-80 bg-[#0e1117] text-[#f0f6fc] px-5 py-6 sticky top-0 h-screen overflow-y-auto space-y-6">
      {/* Perfil */}
      <div className="bg-[#161b22] rounded-xl p-5 border border-[#2d333b] shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <p className="font-bold text-lg">
              {userProfile?.username || userData?.username || 'Invitado'}
            </p>
            <p className="text-sm text-[#8b949e]">
              @{userProfile?.username || userData?.username || 'usuario'}
            </p>
          </div>
          {userProfile?.avatarUrl ? (
            <img
              src={userProfile.avatarUrl}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border border-[#2d333b]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#3c3f44] flex items-center justify-center text-xl font-bold text-white">
              {userProfile?.username?.[0]?.toUpperCase() || userData?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <p className="text-sm text-[#8b949e] mb-3">
          👥 {userProfile?.followers ?? 0} seguidores
        </p>

        <button
          onClick={() => router.push(userData ? '/profile' : '/login')}
          className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white w-full py-2 rounded-full flex items-center justify-center font-semibold gap-2"
        >
          <HiOutlineUser size={18} />
          {userData ? 'Ver perfil' : 'Iniciar sesión'}
        </button>
      </div>

      {/* Canales seguidos */}
      <div className="bg-[#161b22] rounded-xl p-5 border border-[#2d333b] shadow-sm">
        <h3 className="font-bold text-base mb-4">📡 Canales que sigues</h3>
        {channels.length === 0 ? (
          <p className="text-[#8b949e] text-sm">No sigues ningún canal todavía.</p>
        ) : (
          <ul className="space-y-3">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className="cursor-pointer hover:bg-[#1a1f29] p-3 rounded-lg transition"
                onClick={() => router.push(`/channel/${channel.id}`)}
              >
                <p className="font-semibold">{channel.name}</p>
                <p className="text-xs text-[#8b949e] truncate">
                  {channel.description || 'Sin descripción'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Crear publicación */}
      {userData && (
        <div className="bg-[#161b22] rounded-xl p-5 border border-[#2d333b] shadow-sm">
          <h3 className="font-bold text-base mb-3">✍️ Crear publicación</h3>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            placeholder="¿Qué estás pensando?"
            className="w-full bg-[#0e1117] border border-[#2d333b] rounded p-2 text-sm text-white resize-none"
          />
          <button
            onClick={handleCreatePost}
            disabled={isPosting || !newPost.trim()}
            className="mt-2 w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] py-2 rounded font-semibold text-sm disabled:opacity-50"
          >
            {isPosting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      )}
    </aside>
  );
}
