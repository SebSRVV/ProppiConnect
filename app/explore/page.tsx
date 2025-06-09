'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';

interface User {
  _id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  followers?: number;
}

export default function ExplorePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/search${query ? `?q=${encodeURIComponent(query)}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      });
  }, [query]);

  if (!hasMounted) return null;

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-[#0e1117] text-[#f0f6fc]">
      <LeftSidebar />

      <section className="flex-1 max-w-3xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold">Buscar perfiles</h1>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 bg-[#0e1117] border border-[#2d333b] rounded text-white"
            placeholder="Buscar por @usuario..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setQuery(query)}
          />
          <button
            onClick={() => setQuery(query)}
            className="bg-[#1d9bf0] px-4 py-2 rounded hover:bg-[#1a8cd8]"
          >
            Buscar
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-[#8b949e]">Buscando...</p>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((user) => (
              <div
                key={user._id}
                className="bg-[#161b22] border border-[#2d333b] p-5 rounded-lg hover:bg-[#1b1f27] transition cursor-pointer"
                onClick={() => router.push(`/profile/${user._id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#3c3f44] text-white text-xl font-bold flex items-center justify-center">
                    {user.username[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{user.username}</p>
                    <p className="text-sm text-[#8b949e]">@{user.username}</p>
                    <p className="text-sm text-[#c9d1d9]">
                      {user.bio || 'Sin biografía'}
                    </p>
                  </div>
                  {user.followers !== undefined && (
                    <p className="text-sm text-[#8b949e] whitespace-nowrap">
                      👥 {user.followers} seguidores
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#8b949e] italic">No se encontraron usuarios.</p>
        )}
      </section>

      <RightSidebar />
    </main>
  );
}
