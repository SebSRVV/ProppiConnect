'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { jwtDecode } from 'jwt-decode';
import { FaStar } from 'react-icons/fa6';

interface User {
  _id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  followers: number;
  isFollowing: boolean;
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

export default function PublicProfilePage() {
  const { id } = useParams();
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        setViewerId(decoded.id);
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then((res) => res.json())
      .then(setUser);

    fetch(`/api/posts/user/${id}`)
      .then((res) => res.json())
      .then(setPosts);
  }, [id]);

  const handleFollowToggle = async () => {
    if (!id) return;
    setLoadingFollow(true);

    try {
      const res = await fetch(`/api/users/${id}/follow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al seguir usuario');
      }

      const data = await res.json();

      setUser((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: data.isFollowing,
              followers: data.isFollowing ? prev.followers + 1 : prev.followers - 1,
            }
          : null
      );
    } catch (err) {
      console.error('Error al seguir/dejar de seguir:', err);
      alert('Hubo un error al seguir o dejar de seguir.');
    } finally {
      setLoadingFollow(false);
    }
  };

  if (!user) return <p className="text-white text-center mt-10">Cargando perfil...</p>;

  const isOwnProfile = viewerId === user._id;

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#0e1117] text-[#f0f6fc]">
      <LeftSidebar />

      <section className="flex-1 max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Header usuario */}
        <div className="bg-[#161b22] p-6 rounded-lg border border-[#2d333b] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover border border-[#2d333b]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#3c3f44] text-white text-2xl font-bold flex items-center justify-center">
                  {user.username[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-xl">{user.username}</p>
                <p className="text-sm text-[#8b949e]">@{user.username}</p>
                <p className="text-sm text-[#8b949e] mt-1">{user.followers} seguidores</p>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                onClick={handleFollowToggle}
                disabled={loadingFollow}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                  user.isFollowing
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-[#1d9bf0] text-white hover:bg-[#1a8cd8]'
                }`}
              >
                {loadingFollow
                  ? '...'
                  : user.isFollowing
                  ? 'Dejar de seguir'
                  : 'Seguir'}
              </button>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-[#c9d1d9] mb-1">Biografía</p>
            <p className="text-[#c9d1d9]">{user.bio || 'Este usuario aún no ha escrito una biografía.'}</p>
          </div>
        </div>

        {/* Publicaciones */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Publicaciones recientes</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-[#161b22] border border-[#2d333b] p-4 rounded-lg hover:bg-[#1b1f27] transition"
              >
                <div className="flex items-center gap-2 mb-2">
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
            <p className="text-[#8b949e] text-sm">Este usuario aún no ha publicado contenido.</p>
          )}
        </div>
      </section>

      <RightSidebar />
    </main>
  );
}
