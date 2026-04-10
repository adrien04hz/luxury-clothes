// # Gestion de productos guardados (Ver, aumentar, agregar a carrito, comprar, eliminar)
/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 10 de Abril de 2026
*/

"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import { ListaDeDeseos } from "@/types/listadedeseos/ListaDeDeseos";
import { apiFetch } from "@/lib/api";

export default function ListadeseosPage() {
  const [products, setProducts] = useState<ListaDeDeseos[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadWishlist() {
      try {
        const { data } = await fetch("/api/listadeseos?clientId=1").then((res) => res.json()); // 👈 CORRECTO

        setProducts(data);
      } catch (error) {
        console.error("Error cargando wishlist:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <p>Cargando favoritos... </p>
      </div>
    );
  }

  return (
    <div className="pl-16 pt-12 pr-16 pb-12">
      <h1 className=" mb-6 font-normal text-xl">
        Favoritos 
      </h1>

      {products.length === 0 ? (
        <p>No tienes productos en tu lista de deseos</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showToCart={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}