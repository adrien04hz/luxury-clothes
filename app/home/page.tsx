//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor : Diaz Antonio Luis Pedro*/
//* Fecha: 22/04/2026 */
//**********/
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Carrusel from "../components/Carousel";
import ProductCard from "../components/ProductCard";
import Link from "next/link"

export default function Home() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [marcas, setMarcas] = useState<any[]>([]);

  // consulta de 10 productos al azar
  useEffect(() => {
    fetch("/api/producto/random?limit=10")
      .then(res => res.json())
      .then(data => setProductos(data.data));
  }, []);
  // consulta de un producto por categoria 
  useEffect(() => {
    fetch("/api/producto/categoriaone")
      .then(res => res.json())
      .then(data => setCategorias(data.data));
  }, []);
  //consulta de todas las marcas
  useEffect(() => {
    fetch("/api/marcas")
      .then(res => res.json())
      .then(data => setMarcas(data.data));
  }, []);


  if (categorias.length === 0) return null;

  return (
    <main className="min-h-screen bg-white text-gray-800">

      {/* seccion del carrucel, slogan, direccionamiento a productos */}
      <section className="relative w-full h-[80vh] flex items-center justify-center">
        {/* implementacion de carruselde 5 imagenes de productos */}
        <Carrusel productos={productos} />

        {/* slogan de la tienda o nombre */}
        <div className="relative text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">
            Viste Tu Mejor Versión
          </h1>

          {/* Redireccion al page de productos */}
          <button onClick={() => router.push("/productos")} className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
            Ver productos
          </button>
        </div>
      </section>

      {/* Seccion de categorias Ropa, Calzado, Accesorios y direccionamiento a productos de esa categoria */}
      <section className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-10">
          Categorías
        </h2>
        {/* Mapeo de una imagen de cada categoria */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <div key={cat.id_categoria}
              onClick={() => router.push(`/productos?categoria=${cat.id_categoria}`)}
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

      {/* seccion de producto destacados, traidos al azar, los mismos que en el carrusel 4 maximo */}
      <section className="py-20 px-10 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">
          Productos Destacados
        </h2>
        {/* Mapeo de los 4 productos y direccionamiento a detalle de producto para poder agregar a carrito */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {productos.slice(0, 8).map((producto) => (
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
      
      {/* seccion de muestreo de nuestras marcas */}
      <section className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-10">
          Nuestras Marcas
        </h2>
        {/* Mapeo de todas las marcas disponibles */}
        <div className="flex flex-wrap justify-center items-center gap-10">
          {marcas.map((marca) => (
            <div key={marca.id}
              onClick={() => router.push(`/productos?marca=${marca.id}`)}
              className="w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition cursor-pointer">
              <img
                src={marca.imagen_url}
                alt={marca.nombre}
                className="max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
