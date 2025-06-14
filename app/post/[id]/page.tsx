'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { RatingStars } from '@/components/RatingStars';

interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
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

export default function PostPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ username: string }>(token);
        setUser({ username: decoded.username });
      } catch {
        setUser(null);
      }
    }

    const fetchData = async () => {
      try {
        await fetch(`/api/posts/views/${id}`, { method: 'POST' });

        const [postRes, commentsRes] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch(`/api/posts/${id}/comments`),
        ]);

        if (!postRes.ok || !commentsRes.ok) throw new Error('Error al cargar datos');

        const postData = await postRes.json();
        const commentData = await commentsRes.json();

        setPost(postData);
        setComments(commentData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar publicación');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleComment = async () => {
    const token = localStorage.getItem('token');
    if (!token || !commentText.trim()) return;

    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Error al comentar');

      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
      setFeedback('✅ Comentario enviado');
    } catch (err: any) {
      setFeedback(`❌ ${err.message}`);
    } finally {
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#0e1117] text-[#f0f6fc]">
      <LeftSidebar />

      <section className="flex-1 max-w-3xl mx-auto px-6 py-10 space-y-8">
        <button
          onClick={() => router.push('/')}
          className="text-sm bg-[#1d9bf0] text-white px-4 py-2 rounded hover:bg-[#1a8cd8] transition"
        >
          ← Volver al inicio
        </button>

        {loading ? (
          <p className="text-white text-center mt-20 animate-pulse">Cargando publicación...</p>
        ) : error || !post ? (
          <p className="text-red-400 text-center mt-20">⚠️ {error || 'Publicación no encontrada.'}</p>
        ) : (
          <>
            {/* Publicación */}
            <div className="bg-[#161b22] border border-[#2d333b] p-5 rounded-lg shadow-sm">
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
                    className="w-full max-h-64 object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-[#8b949e] mt-2">
                <span>💬 {comments.length} comentarios</span>
                <RatingStars postId={post._id} initial={post.rating} token={localStorage.getItem('token') || ''} />
                <span>👁️ {post.views} vistas</span>
              </div>
            </div>

            {/* Comentarios */}
            <div className="bg-[#161b22] border border-[#2d333b] p-5 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Comentarios</h2>
              {comments.length === 0 ? (
                <p className="text-sm text-[#8b949e] italic">Aún no hay comentarios.</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c._id} className="bg-[#0e1117] p-4 rounded border border-[#2d333b]">
                      <p className="text-sm font-bold">{c.author}</p>
                      <p className="text-sm text-[#c9d1d9]">{c.text}</p>
                      <p className="text-xs text-[#8b949e]">{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Agregar comentario */}
            <div className="bg-[#161b22] border border-[#2d333b] p-5 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Agregar comentario</h2>

              {user ? (
                <>
                  <textarea
                    className="w-full bg-[#0e1117] border border-[#2d333b] p-3 rounded mb-3 text-white"
                    rows={3}
                    placeholder="Escribe tu comentario..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleComment}
                      className="bg-[#1d9bf0] px-4 py-2 rounded hover:bg-[#1a8cd8] transition"
                    >
                      Comentar
                    </button>
                    {feedback && (
                      <span
                        className={`text-sm ${
                          feedback.startsWith('❌') ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {feedback}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-[#8b949e] italic">Debes iniciar sesión para comentar.</p>
              )}
            </div>
          </>
        )}
      </section>

      <RightSidebar />
    </main>
  );
}
