// components/AddToCartButton.tsx
"use client";

import { useState } from "react";

export default function AddToCartButton({ productoId, talla }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!talla) {
      alert("Selecciona una talla");
      return;
    }

    setLoading(true);

    await fetch("/api/carrito", {
      method: "POST",
      body: JSON.stringify({ productoId, talla }),
    });

    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-black text-white py-2 px-4 rounded-[28px] w-full h-16 hover:opacity-60"
    >
      {loading ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
}