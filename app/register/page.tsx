'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Error al registrar');
      setLoading(false);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#2d333b] rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Crear Cuenta</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#0e1117] text-white border border-[#2d333b] focus:outline-none focus:ring-2 focus:ring-[#1d9bf0]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#0e1117] text-white border border-[#2d333b] focus:outline-none focus:ring-2 focus:ring-[#1d9bf0]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[#0e1117] text-white border border-[#2d333b] focus:outline-none focus:ring-2 focus:ring-[#1d9bf0]"
            required
          />

          {error && (
            <p className="text-sm text-red-500 font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold py-2 rounded transition"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-[#8b949e] text-sm">¿Ya tienes una cuenta?</p>
          <button
            onClick={() => router.push('/login')}
            className="text-[#1d9bf0] hover:underline text-sm"
          >
            Iniciar sesión
          </button>
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-6 w-full bg-[#30363d] hover:bg-[#3a3f46] text-white py-2 rounded transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
