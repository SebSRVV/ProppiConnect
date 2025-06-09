'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import {
  HiOutlineCheckCircle,
  HiOutlineBellAlert,
} from 'react-icons/hi2';
import {
  FaRegCommentDots,
  FaStar,
  FaUserPlus,
} from 'react-icons/fa6';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';

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
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
        fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setNotifications(data);
            else console.error('Error al cargar notificaciones', data);
          })
          .finally(() => setLoading(false));
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setMarking(true);
    const res = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    }
    setMarking(false);
  };

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <main className="flex min-h-screen bg-[#0e1117] text-[#f0f6fc]">
      <LeftSidebar />

      <section className="flex-1 max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HiOutlineBellAlert className="text-[#1d9bf0]" />
            Notificaciones
          </h1>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={marking}
              className="text-sm text-[#1d9bf0] hover:underline flex items-center gap-1"
            >
              <HiOutlineCheckCircle />
              Marcar todas como leídas
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-[#8b949e]">Cargando notificaciones...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-[#8b949e] mt-20">No tienes notificaciones aún.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-4 p-4 rounded-lg border border-[#2d333b] transition ${
                  n.read ? 'bg-[#161b22]' : 'bg-[#1d2a3a] shadow-md'
                }`}
              >
                <div className="mt-1">{renderIcon(n.type)}</div>
                <div className="flex-1">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-[#8b949e]">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <RightSidebar />
    </main>
  );
}
