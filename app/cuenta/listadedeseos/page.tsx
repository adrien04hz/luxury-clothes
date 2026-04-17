// # Gestion de productos guardados (Ver, aumentar, agregar a carrito, comprar, eliminar)
/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 10 de Abril de 2026
*/
"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import { ListaDeDeseos } from "@/types/listadedeseos/ListaDeDeseos";

export default function ListadeseosPage() {
  const [products, setProducts] = useState<ListaDeDeseos[]>([]);
  const [loading, setLoading] = useState(true);

  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/cuenta";
      return;
    }

    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await fetch("/api/listadeseos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { data } = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (productId: number) => {
    setPendingDeleteId(productId);

    timerRef.current = setTimeout(() => {
      removeFavorite(productId);
    }, 3000);
  };

  const removeFavorite = async (productId: number) => {
    try {
      const res = await fetch("/api/listadeseos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleUndo = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setPendingDeleteId(null);
  };

  if (loading) return <p className="p-10">Cargando favoritos...</p>;

  if (products.length === 0) {
    return (
       <div className="pl-16 pt-12 pr-16 pb-12">

      <h1 className="mb-6 text-xl">Favoritos</h1>

      <div className="p-10 text-center">
        <p className="text-lg font-medium">Los productos que agregues a tus Favoritos se guardarán aquí.</p>
      </div>
    </div>
    );
  }

  return (
    <div className="pl-16 pt-12 pr-16 pb-12">

      <h1 className="mb-6 text-xl">Favoritos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showIcon={true}
            pendingDelete={pendingDeleteId === product.id}
            onRemoveFavorite={handleRemoveFavorite}
            onUndo={handleUndo}
          />
        ))}
      </div>
    </div>
  );
}