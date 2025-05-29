'use client';

import { useState } from 'react';

export function RatingStars({ postId, initial, token }: {
  postId: string;
  initial: number;
  token: string;
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
  };

  return (
    <div className="text-yellow-400 text-sm tracking-wide">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className={`cursor-pointer transition ${
            i < (hovered ?? rating) ? '' : 'text-gray-600'
          }`}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleRate(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
