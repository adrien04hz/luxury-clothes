// # Gestion de productos guardados (Ver, aumentar, agregar a carrito, comprar, eliminar)
/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 10 de Abril de 2026
 */

import ProductCard from "@/app/components/ProductCard";

export default function ListadeseosPage() {
  return (
    <div className="pl-16 pt-12 pr-16 pb-12">
      <h1 className="text-2xl mb-6">Favoritos</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ProductCard showToCart={true}/>
        <ProductCard showToCart={true}/>
        <ProductCard showToCart={false}/>
      </div>
    </div>
  );
}
