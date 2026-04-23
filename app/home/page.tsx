//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor : Diaz Antonio Luis Pedro*/
//* Fecha: 22/04/2026 */
//**********/
"use client";
import { useRouter } from "next/navigation";
import Carrusel from "../components/Carousel";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Link from "next/link"

export default function Home() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/producto/random?limit=5")
      .then(res => res.json())
      .then(data => setProductos(data.data));
  }, []);

  useEffect(() => {
    fetch("/api/producto/categoriaone")
      .then(res => res.json())
      .then(data => setCategorias(data.data));
  }, []);


  if (categorias.length === 0) return null;

  return (
    <main className="min-h-screen bg-white text-gray-800">

      <section className="relative w-full h-[80vh] flex items-center justify-center">

        {/* implementacion de carruselde 5 imagenes de productos */}
        <Carrusel productos={productos} />

        {/* slogan de la tienda o nombre */}
        <div className="relative text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">
            carrusel de imagenes
          </h1>

          {/* Redireccion al page de productos */}
          <button onClick={() => router.push("/productos")} className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
            Ver productos
          </button>
        </div>
      </section>

      {/* Seccion de categorias */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10">
          Categorías
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <div key={cat.id_categoria}
              // onClick={() => router.push(`/productos?id_categoria=${cat.id_categoria}`)} 
              className="relative group cursor-pointer">
              {/* Cargar la imagen */}
              <img src={cat.imagen_url} className="w-full h-80 object-cover rounded-xl" />

              {/* nombre de la categoria y volver oscurita la imagen */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition rounded-xl flex items-center justify-center">

                <span className="text-white text-xl font-semibold">
                  {cat.categoria_nombre}
                </span>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* seccion de producto nuevo 4 maximo */}
      <section className="py-16 px-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">
          Productos Destacados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {productos.slice(0, 4).map((producto) => (
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
      </section>
    </main>
  );
}
