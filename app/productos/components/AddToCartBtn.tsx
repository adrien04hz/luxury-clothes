// components/AddToCartButton.tsx
"use client";

export default function AddToCartButton({
    onClick,
    loading = false,
} : {
    loading: boolean;
    onClick: () => void;
}) {

  return (
    <button
      onClick={onClick}
      className={`bg-black text-white py-2 px-4 rounded-[28px] w-full h-16 hover:opacity-60 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
}