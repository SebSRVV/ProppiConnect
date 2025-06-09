'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { FaStar } from 'react-icons/fa6';

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
  const [user, setUser] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const decoded = jwtDecode<{ id: string }>(token);

      fetch(`/api/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setBio(data.bio || '');
          setAvatarUrl(data.avatarUrl || '');
          setLoading(false);
        });

      fetch('/api/posts/user/' + decoded.id)
        .then((res) => res.json())
        .then(setPosts);
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio, avatarUrl }),
    });

    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setEditing(false);
    }
  };

  if (loading || !user)
    return <p className="text-white text-center mt-10">Cargando perfil...</p>;

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#0e1117] text-[#f0f6fc]">
      <LeftSidebar />

      <section className="flex-1 px-6 py-10 max-w-4xl mx-auto space-y-10">
        {/* Perfil */}
        <div className="bg-[#161b22] p-6 rounded-lg border border-[#2d333b]">
          <div className="flex items-center gap-5 mb-6">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border border-[#2d333b]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#3c3f44] text-white text-2xl font-bold flex items-center justify-center">
                {user.username[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xl font-bold">{user.username}</p>
              <p className="text-sm text-[#8b949e]">@{user.username}</p>
              <p className="text-sm text-[#8b949e] mt-1">
                👥 {user.followers} seguidores
              </p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Biografía</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full mt-1 p-2 rounded bg-[#0e1117] border border-[#2d333b] text-white"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">URL del avatar</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-[#0e1117] border border-[#2d333b] text-white"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded font-semibold"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded border border-[#2d333b] text-white hover:bg-[#2d333b]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Biografía</p>
              <p className="text-[#c9d1d9]">{bio || 'Sin biografía.'}</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-3 text-sm font-semibold text-[#1d9bf0] hover:underline"
              >
                Editar perfil
              </button>
            </div>
          )}
        </div>

        {/* Publicaciones */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Tus publicaciones</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-[#161b22] border border-[#2d333b] p-4 rounded-lg hover:bg-[#1b1f27] transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-[#3c3f44] rounded-full text-white text-sm font-bold flex items-center justify-center">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-xs text-[#8b949e]">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-[#c9d1d9] mb-2">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    className="rounded-lg max-h-64 object-cover w-full border border-[#2d333b] mb-2"
                    alt="Imagen del post"
                  />
                )}
                <div className="flex justify-between text-xs text-[#8b949e] mt-2">
                  <span>💬 {post.comments} comentarios</span>
                  <RatingStars rating={Math.round(post.rating)} />
                  <span>👁️ {post.views} vistas</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#8b949e] text-sm">Aún no has publicado contenido.</p>
          )}
        </div>
      </section>

      <RightSidebar />
    </main>
  );
}
