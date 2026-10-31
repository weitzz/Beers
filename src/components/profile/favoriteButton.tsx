"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface FavoriteButtonProps {
  beerId: number;
  initialFavorite: boolean;
}

export default function FavoriteButton({
  beerId,
  initialFavorite,
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleFavorite = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/favorites/${beerId}`, {
        method: isFavorite ? "DELETE" : "PUT",
      });
      if (!response.ok) throw new Error("Nao foi possivel atualizar favorito");

      setIsFavorite(!isFavorite);
      router.refresh();
    } catch {
      setError("Nao foi possivel atualizar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={isSaving}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={isFavorite}
        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className={`flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 disabled:opacity-60 ${isFavorite ? "border-red-200 text-red-500" : "border-yellow-200 text-yellow-600"}`}
      >
        {isFavorite ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
      </button>
      {error && (
        <span className="absolute top-11 z-20 w-44 rounded-lg bg-red-700 px-2 py-1 text-center text-xs text-white shadow" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
