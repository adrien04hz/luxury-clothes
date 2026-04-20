import Link from "next/link"
import ProductCard from "@/app/components/ProductCard"
import { Producto } from "@/types/producto/Producto";

type CatalogoCuerpoProps = {
    items: Producto[];
};

export default function CatalogoCuerpo({ items }: CatalogoCuerpoProps) {
    return (
        // {/* Contenedor principal para productos cards */}
        <div className="w-full h-fit grid grid-cols-3 gap-3.5 z-0">
        {items.map((producto: Producto) => (
            <Link
            key={producto.id}
            href={`/productos/${producto.id}`}
            className="hover:shadow-xl transition-shadow"
            >
            <ProductCard
                key={producto.id}
                showIcon={false}
                showToCart={false}
                item={producto}
            />
            </Link>
        ))}
        </div>
    );
}