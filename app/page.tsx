// app/page.tsx
import React from "react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen text-white bg-black font-sans">
      {/* Sidebar Izquierdo */}
      <aside className="w-64 bg-black border-r border-gray-800 flex flex-col justify-between py-6 px-4">
        <nav className="space-y-6">
          <div className="text-2xl font-bold mb-4">🏠</div>
          <ul className="space-y-4 text-lg">
            <li>Explorar</li>
            <li className="relative">
              Notificaciones
              <span className="absolute top-0 right-0 text-xs bg-[#1d9bf0] text-white rounded-full px-1">2</span>
            </li>
            <li>Mensajes</li>
          </ul>
        </nav>

        {/* Canales seguidos */}
        <div>
          <p className="text-sm text-gray-400 mb-2">FOLLOWED CHANNELS</p>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center">
              <span>aceu +2</span><span className="text-red-500">8.2K</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Jay3</span><span className="text-red-500">1.4K</span>
            </li>
            <li className="flex justify-between items-center">
              <span>shroud</span><span className="text-red-500">8.8K</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Emiru</span><span className="text-red-500">19.4K</span>
            </li>
          </ul>

          <div className="mt-6 flex space-x-2">
            <button className="bg-[#1d9bf0] w-full py-2 rounded-full font-semibold">Crear cuenta</button>
            <button className="bg-white text-black w-full py-2 rounded-full font-semibold">Iniciar sesión</button>
          </div>
        </div>
      </aside>

      {/* Feed Central */}
      <section className="flex-1 border-r border-gray-800 px-6 py-4">
        <div className="border-b border-gray-800 flex justify-around text-sm text-gray-400 mb-4">
          <span className="text-white border-b-2 border-[#1d9bf0] pb-2">Para ti</span>
          <span>Siguiendo</span>
        </div>

        {/* Post simulado */}
        {[1, 2].map((_, i) => (
          <div key={i} className="mb-6 border border-gray-800 p-4 rounded-lg bg-[#111]">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 mr-2"></div>
              <span className="font-semibold text-sm">Usuario {i + 1}</span>
              <span className="ml-2 text-xs text-gray-400">· 20h</span>
            </div>
            <div className="bg-gray-700 h-40 w-full rounded mb-2" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>12</span>
              <span>69</span>
              <span>1 mil</span>
              <span>27 mil</span>
            </div>
          </div>
        ))}
      </section>

      {/* Panel Derecho */}
      <aside className="w-80 bg-[#f0f2f5] text-black px-4 py-6 space-y-6">
        <div className="bg-white rounded-lg p-4">
          <div className="w-12 h-12 rounded-full bg-gray-400 mb-2"></div>
          <p className="font-bold">SebRVV</p>
          <p className="text-sm text-gray-600">@TVSebRVV</p>
          <button className="bg-black text-white mt-3 py-2 w-full rounded">Perfil</button>
        </div>

        {/* Qué está pasando */}
        <div className="bg-white rounded-lg p-4 text-sm">
          <h3 className="font-bold text-base mb-2">Qué está pasando</h3>
          <ul className="space-y-2 text-gray-700">
            <li><span className="text-gray-500">Tendencia - Tecnología</span><br />La IA</li>
            <li><span className="text-gray-500">Tendencia - Deportes</span><br />Jugador de Futbol</li>
            <li><span className="text-gray-500">Tendencia - Entretenimiento</span><br />#SebRVV</li>
            <li className="text-[#1d9bf0] cursor-pointer">Mostrar más</li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
