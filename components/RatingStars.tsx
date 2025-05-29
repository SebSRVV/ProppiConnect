'use client';

import { useState } from 'react';

interface Props {
  postId: string;
  initial: number;
  token: string;
  onRate?: () => void;
}

export function RatingStars({ postId, initial, token, onRate }: Props) {
  const [rating, setRating] = useState(initial);
  const [hovered, setHovered] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleRate = async (value: number) => {
    if (loading) return;
    setRating(value);
    setLoading(true);

    try {
      const res = await fetch('/api/posts/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, value }),
      });

      if (res.ok) {
        setFlash(true);
        onRate?.();
        setTimeout(() => setFlash(false), 300);
      }
    } catch (err) {
      console.error('Error al calificar', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-[4px] text-yellow-400 text-3xl tracking-wide">
      {Array.from({ length: 12 }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hovered ?? rating);

        return (
          <button
            key={i}
            type="button"
            disabled={loading}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleRate(starValue)}
            aria-label={`Calificar con ${starValue} estrellas`}
            className={`transition-all duration-200 ease-in-out transform ${
              isFilled ? 'text-yellow-400' : 'text-gray-600'
            } ${!loading ? 'hover:scale-125 hover:drop-shadow-md' : 'opacity-50'} ${
              flash && starValue === rating ? 'animate-ping text-white' : ''
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
