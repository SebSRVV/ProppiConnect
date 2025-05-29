'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import EmojiPicker from 'emoji-picker-react';
import {
  FiBell, FiMail, FiHash, FiLogOut, FiTrash2,
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

      {/* Contenido Central */}
      <section className="flex-1 max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Sección 1: Perfil */}
        {user && (
          <div className="bg-[#161b22] p-6 rounded-lg border border-[#2d333b] space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#3c3f44] text-white text-2xl font-bold flex items-center justify-center">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-xl">{user.username}</p>
                <p className="text-[#8b949e]">@{user.username}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#c9d1d9] mb-1">Biografía</p>
              {editingBio ? (
                <>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 rounded bg-[#0e1117] border border-[#2d333b]" />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setEditingBio(false)} className="px-3 py-1 text-sm rounded bg-[#30363d]">Cancelar</button>
                    <button onClick={() => setEditingBio(false)} className="px-3 py-1 text-sm rounded bg-[#1d9bf0]">Guardar</button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <p>{bio || 'Agrega una biografía...'}</p>
                  <button onClick={() => setEditingBio(true)} className="text-sm text-[#1d9bf0] hover:underline">Editar</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección 2: Crear publicación */}
        <div className="bg-[#161b22] p-6 rounded-lg border border-[#2d333b] space-y-4">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="¿Qué estás pensando?"
            className="w-full p-4 rounded bg-[#0e1117] border border-[#2d333b]"
          />
          <div className="flex items-center gap-3">
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-xl">Emojis :D</button>
          
          </div>
          {showEmojiPicker && (
            <EmojiPicker onEmojiClick={(emoji) => {
              setNewPostContent(prev => prev + emoji.emoji);
              setShowEmojiPicker(false);
            }} />
          )}
          {selectedImage && (
            <img src={URL.createObjectURL(selectedImage)} className="rounded-lg max-h-64 object-cover w-full border border-[#2d333b]" />
          )}
          <button onClick={handlePost} className="bg-[#1d9bf0] w-full py-2 rounded font-semibold hover:bg-[#1a8cd8]">Publicar</button>
        </div>

        {/* Sección 3: Publicaciones */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Tus publicaciones</h2>
          {posts.map(post => (
            <div key={post._id} className="bg-[#161b22] border border-[#2d333b] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-[#3c3f44] rounded-full text-white text-sm font-bold flex items-center justify-center">
                    {user?.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.username}</p>
                    <p className="text-xs text-[#8b949e]">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(post._id)} className="text-red-500 hover:text-red-600">
                  <FiTrash2 />
                </button>
              </div>
              <p className="text-sm text-[#c9d1d9]">{post.content}</p>
              {post.image && (
                <img src={post.image} className="mt-2 rounded-lg max-h-64 object-cover w-full border border-[#2d333b]" />
              )}
              <div className="flex justify-between text-xs text-[#8b949e] mt-3">
                <span>💬 {post.comments} comentarios</span>
                <RatingStars postId={post._id} initial={post.rating} token={localStorage.getItem('token')!} onRate={() => showToast('¡Gracias por tu calificación!')} />
                <span>👁️ {post.views} vistas</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sidebar Derecho */}
      <aside className="w-full md:w-80 bg-[#0e1117] text-[#f0f6fc] px-5 py-6 sticky top-0 h-screen overflow-y-auto">
        <div className="bg-[#161b22] p-4 rounded-lg border border-[#2d333b] mb-6">
          <div className="w-14 h-14 rounded-full bg-[#3c3f44] text-white text-xl font-bold flex items-center justify-center mb-2">
            {user?.username[0]?.toUpperCase() || 'U'}
          </div>
          <p className="font-bold text-lg">{user?.username || 'Invitado'}</p>
          <p className="text-sm text-[#8b949e]">@{user?.username}</p>
          <button className="bg-[#1d9bf0] mt-4 py-2 w-full rounded-full font-semibold hover:bg-[#1a8cd8]" onClick={() => router.push('/')}>
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

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#1d9bf0] text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
          {toastMsg}
        </div>
      )}
    </main>
  );
}
