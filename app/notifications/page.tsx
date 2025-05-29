'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { HiArrowLeft } from 'react-icons/hi';
import { FaRegCommentDots, FaStar, FaUserPlus } from 'react-icons/fa6';

interface DecodedToken {
  id: string;
  email: string;
  username: string;
  exp: number;
}

interface Notification {
  _id: string;
  type: 'comment' | 'rating' | 'follow';
  message: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded);

        // 🔗 Llamada real al backend
        fetch('/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setNotifications(data);
            } else {
              console.error('Error al cargar notificaciones', data);
            }
          });
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  const renderIcon = (type: Notification['type']) => {
    switch (type) {
      case 'comment':
        return <FaRegCommentDots className="text-[#1d9bf0]" />;
      case 'rating':
        return <FaStar className="text-yellow-400" />;
      case 'follow':
        return <FaUserPlus className="text-green-400" />;
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 text-[#f0f6fc]">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="text-[#8b949e] hover:text-[#1d9bf0] mr-4">
          <HiArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold">Notificaciones</h1>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`flex items-start gap-4 p-4 rounded-lg border border-[#2d333b] bg-[#161b22] ${
              !n.read ? 'bg-opacity-80' : ''
            }`}
          >
            <div className="mt-1">{renderIcon(n.type)}</div>
            <div className="flex-1">
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-[#8b949e]">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <p className="text-center text-[#8b949e] mt-20">No tienes notificaciones aún.</p>
        )}
      </div>
    </main>
  );
}
