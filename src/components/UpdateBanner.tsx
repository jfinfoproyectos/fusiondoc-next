"use client";

import { useEffect, useState } from 'react';

interface UpdateBannerProps {
  sha: string;
  slug: string;
}

export default function UpdateBanner({ sha, slug }: UpdateBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storageKey = `fusiondoc-seen-sha:${slug}`;
    const lastSeenSha = localStorage.getItem(storageKey);

    if (lastSeenSha && lastSeenSha !== sha) {
      // El SHA cambió desde la última vez que el usuario lo vio → mostrar banner
      setVisible(true);
      // Actualizar el SHA almacenado para que no se muestre de nuevo
      localStorage.setItem(storageKey, sha);
    } else if (!lastSeenSha) {
      // Primera visita a este documento → guardar SHA sin mostrar banner
      localStorage.setItem(storageKey, sha);
    }
    // Si lastSeenSha === sha → ya lo vio, no mostrar nada
  }, [sha, slug]);

  if (!visible) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-blue-600 text-white text-sm py-2 px-4 flex items-center justify-between rounded-md mb-4 animate-[fadeIn_0.3s_ease-in-out]">
      <span>
        📝 Contenido actualizado — {dateStr}
      </span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-white/80 hover:text-white font-bold text-lg leading-none cursor-pointer"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  );
}
