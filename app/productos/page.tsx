import { getCatalogo } from "@/client/producto.client";
import ProductCard from "../components/ProductCard";
import Link from "next/dist/client/link";
import Image from "next/image";
import { Producto } from "@/types/producto/Producto";
export default async function Productos() {

  const response = await getCatalogo({id_categoria: 1});
  const productos = response.productos; // por como regresas los datos en tu api

  return (
    // div principal
    <div className="flex flex-col justify-center items-start px-24">
      {/* breadcrumb */}
      <div className="flex items-center justify-start space-x-2 w-fit mt-3 mb-10 text-md font-light">
        <div className="hover:underline w-fit">
          <Link
            href={"#"}
          >Ropa</Link>
        </div>
        <span>/</span>
        <div className="hover:underline w-fit">
          <Link href={"#"}>Hombre</Link>
        </div>
        <span>/</span>
        <div className="hover:underline w-fit">
          <Link href={"#"}>Chamarra</Link>
        </div>
      </div>

      {/* titulo y apartado de filtro */}
      <div className="flex w-full justify-between">
        <div className="text-3xl font-medium">
          <p>Chamarras para Hombre (10) </p>
        </div>

        <div className="flex items-center space-x-1">
          <div className="text-xl">
            <p>Mostrar Filtros</p>
          </div>

          <div>
            <Image
              src="/assets/images/filter.svg"
              alt="Filtros"
              width={27}
              height={27}
            />
          </div>
        </div>
      </div>

      {/* Contenedor principal para productos cards */}
      <div className="grid grid-cols-3 gap-3.5 h-fit">
        {productos.map((producto: Producto) => (
          <ProductCard
            key={producto.id}
            isFavorite={false}
            showIcon={false}
            showToCart={false}
            item={producto}
          />
        ))}
      </div>
    </div>
  );
}
