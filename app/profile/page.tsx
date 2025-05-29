'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import EmojiPicker from 'emoji-picker-react';
import {
  FiHome, FiBell, FiMail, FiUser, FiPlusCircle, FiLogOut, FiHash, FiTrash2
} from 'react-icons/fi';
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

function RatingStars({ postId, initial, token, onRate }: {
  postId: string;
  initial: number;
  token: string;
  onRate: () => void;
}) {
  const [rating, setRating] = useState(initial);
  const [hovered, setHovered] = useState<number | null>(null);

  const handleRate = async (value: number) => {
    setRating(value);
    await fetch('/api/posts/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, value }),
    });
    onRate();
  };

  return (
    <div className="flex gap-1 text-yellow-400 text-sm">
      {Array.from({ length: 12 }).map((_, i) => (
        <FaStar
          key={i}
          className={`cursor-pointer transition ${
            i < (hovered ?? rating) ? '' : 'text-gray-600'
          }`}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleRate(i + 1)}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
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

  const handlePost = async () => {
    const token = localStorage.getItem('token');
    if (!token || !newPostContent.trim()) return;

    const formData = new FormData();
    formData.append('content', newPostContent);
    if (selectedImage) formData.append('image', selectedImage);

    const res = await fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const newPost = await res.json();
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedImage(null);
    setShowEmojiPicker(false);
    showToast('¡Publicación creada!');
  };

  const handleDelete = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`/api/posts/delete/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setPosts(posts.filter(p => p._id !== postId));
      showToast('Publicación eliminada');
    }
  };

    return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#0e1117] text-[#f0f6fc] font-sans">
      {/* Sidebar izquierdo */}
      <aside className="w-full md:w-64 bg-[#0e1117] border-r border-[#2d333b] p-6 sticky top-0 h-screen flex flex-col justify-between">
        <nav className="space-y-6 text-md font-medium">
          <div className="flex items-center space-x-3 text-xl font-bold mb-6 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/')}>
            <LuBolt size={22} /> <span>ProppiConnect</span>
          </div>
          <div className="space-y-5">
            <div className="flex items-center space-x-3 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/explore')}>
              <FiHash /> <span>Explorar</span>
            </div>
            <div className="flex items-center space-x-3 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/notifications')}>
              <FiBell /> <span>Notificaciones</span>
            </div>
            <div className="flex items-center space-x-3 cursor-pointer hover:text-[#1d9bf0]" onClick={() => router.push('/messages')}>
              <FiMail /> <span>Mensajes</span>
            </div>
          </div>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className="mt-6 bg-white text-black py-2 rounded-full hover:bg-gray-200 transition font-semibold"
        >
          <FiLogOut className="inline mr-2" /> Cerrar sesión
        </button>
      </aside>

      {/* Sección principal */}
      <section className="flex-1 max-w-3xl mx-auto px-6 py-8 space-y-6">
        {user && (
          <div className="bg-[#161b22] p-6 rounded-lg border border-[#2d333b] shadow">
            {/* Cabecera de perfil */}
            <div className="flex items-center space-x-4 mb-5">
              <div className="w-14 h-14 bg-[#3c3f44] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-lg">{user.username}</p>
                <p className="text-sm text-[#8b949e]">@{user.username}</p>
              </div>
            </div>

            {/* Bio editable */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#c9d1d9] mb-1">Biografía</p>
              {editingBio ? (
                <>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 rounded bg-[#0e1117] border border-[#2d333b] text-white"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setEditingBio(false)} className="px-3 py-1 text-sm rounded bg-[#30363d] hover:bg-[#444c56]">Cancelar</button>
                    <button onClick={() => setEditingBio(false)} className="px-3 py-1 text-sm rounded bg-[#1d9bf0] hover:bg-[#1a8cd8]">Guardar</button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-[#c9d1d9]">{bio || 'Agrega una biografía...'}</p>
                  <button onClick={() => setEditingBio(true)} className="text-sm text-[#1d9bf0] hover:underline">Editar</button>
                </div>
              )}
            </div>

            {/* Crear publicación */}
            <div className="mb-6">
              <textarea
                placeholder="¿Qué estás pensando?"
                className="w-full p-3 rounded bg-[#0e1117] border border-[#2d333b] text-white mb-2"
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
              />
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} title="Insertar emoji" className="text-xl">😄</button>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={e => setSelectedImage(e.target.files?.[0] || null)}
                />
              </div>
              {showEmojiPicker && (
                <div className="mb-2">
                  <EmojiPicker onEmojiClick={(emoji) => {
                    setNewPostContent(prev => prev + emoji.emoji);
                    setShowEmojiPicker(false);
                  }} />
                </div>
              )}
              {selectedImage && (
                <img src={URL.createObjectURL(selectedImage)} className="rounded-lg mb-2 border border-[#2d333b] max-h-64 object-cover w-full" />
              )}
              <button onClick={handlePost} className="bg-[#1d9bf0] px-4 py-2 rounded hover:bg-[#1a8cd8]">Publicar</button>
            </div>
            {/* Feed de publicaciones */}
            <h3 className="text-lg font-bold mb-4 border-b border-[#2d333b] pb-2">Tus publicaciones</h3>
            <div className="space-y-5">
              {posts.map(post => (
                <div key={post._id} className="bg-[#161b22] border border-[#2d333b] p-4 rounded-lg hover:bg-[#1b1f27] transition">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 bg-[#3c3f44] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user?.username}</p>
                        <p className="text-xs text-[#8b949e]">{new Date(post.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(post._id)} title="Eliminar post" className="text-red-500 hover:text-red-600">
                      <FiTrash2 />
                    </button>
                  </div>
                  <p className="text-sm text-[#c9d1d9]">{post.content}</p>
                  {post.image && (
                    <div className="mt-2">
                      <img src={post.image} className="rounded-lg border border-[#2d333b] max-h-52 w-full object-cover" />
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-[#8b949e] mt-3">
                    <span>💬 {post.comments} comentarios</span>
                    <RatingStars postId={post._id} initial={post.rating} token={localStorage.getItem('token')!} onRate={() => showToast('¡Gracias por tu calificación!')} />
                    <span>👁️ {post.views} vistas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Sidebar derecho */}
      <aside className="w-full md:w-80 bg-[#0e1117] text-[#f0f6fc] px-5 py-6 space-y-6 sticky top-0 h-screen overflow-y-auto">
        <div className="bg-[#161b22] rounded-lg p-4 border border-[#2d333b]">
          <div className="w-14 h-14 rounded-full bg-[#3c3f44] text-white text-xl font-bold flex items-center justify-center mb-2">
            {user?.username[0]?.toUpperCase() || 'U'}
          </div>
          <p className="font-bold text-lg">{user?.username || 'Invitado'}</p>
          <p className="text-sm text-[#8b949e]">@{user?.username}</p>
          <button
            className="bg-[#1d9bf0] mt-4 py-2 w-full rounded-full font-semibold hover:bg-[#1a8cd8]"
            onClick={() => router.push('/')}
          >
            Ir al inicio
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
              <li key={i} className="hover:bg-[#1a1f29] p-2 rounded-lg cursor-pointer transition">
                <span className="text-[#8b949e] text-xs">Tendencia - {trend.category}</span>
                <p className="font-semibold">{trend.topic}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Toast de notificación */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#1d9bf0] text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
          {toastMsg}
        </div>
      )}
    </main>
  );
}
