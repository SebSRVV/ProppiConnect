'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
}

export default function ExplorePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
    }
  }, [query]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 text-[#f0f6fc] space-y-6">
      <h1 className="text-2xl font-bold mb-4">Buscar perfiles</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="flex-1 p-3 bg-[#0e1117] border border-[#2d333b] rounded text-white"
          placeholder="Buscar por @usuario..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
        />
        <button
          onClick={searchUsers}
          className="bg-[#1d9bf0] px-4 py-2 rounded hover:bg-[#1a8cd8]"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="text-sm text-[#8b949e]">Buscando...</p>}

      <div className="space-y-4">
        {results.map((user) => (
          <div
            key={user._id}
            className="bg-[#161b22] border border-[#2d333b] p-4 rounded hover:bg-[#1b1f27] transition cursor-pointer"
            onClick={() => router.push(`/profile/${user.username}`)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3c3f44] text-white text-lg font-bold flex items-center justify-center">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-[#8b949e]">{user.bio || 'Sin biografía'}</p>
              </div>
            </div>
          </div>
        ))}
        {!loading && query && results.length === 0 && (
          <p className="text-sm text-[#8b949e] italic">No se encontraron usuarios.</p>
        )}
      </div>
    </main>
  );
}
