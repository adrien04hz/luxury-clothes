/**
 * Página principal de la tienda de ropa de lujo
 * @author Diaz Antonio Luis Pedro
 * @author Hernandez Sanchez Adrien
 * @date 22/04/2026
 * Ultima modificacion: 27/04/2026
 */

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Carrusel from "../components/Carousel";
import ProductCard from "../components/ProductCard";
import Link from "next/link"
import { Producto } from "@/types/producto/Producto";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";


export default function Home() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [items, setItems] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<any[]>([]);

  // Para el carrusel de productos destacados
  const [currentSlide, setCurrentSlide] = useState(0);
  const productosPorSlide = 3;
  const totalSlides = Math.ceil(productos.length / productosPorSlide);

  // Para el carrusel de productos por categoria
  const [curSlide, setCurSlide] = useState(0);
  const slidesTotal = Math.ceil(items.length / productosPorSlide);
  const [currentCategory, setCurrentCategory] = useState<number>(11);

  // consulta de 10 productos al azar
  useEffect(() => {
    fetch("/api/producto/random?limit=10")
      .then(res => res.json())
      .then(data => setProductos(data.data));
  }, []);


  //consulta de todas las marcas
  useEffect(() => {
    fetch("/api/marcas")
      .then(res => res.json())
      .then(data => setMarcas(data.data));
  }, []);

  // conssulta por categorias
  useEffect(() => {
    fetch(`/api/catalogo?id_subcategoria=${currentCategory}&limit=10`)
      .then(res => res.json())
      .then(data => {
        setItems(data.productos);
        setCurSlide(0);
      });
  }, [currentCategory]);

  // Para los productos destacados
  const siguiente = () => {
    setCurrentSlide((prev) =>
      prev === totalSlides - 1 ? 0 : prev + 1
    );
  };

  const anterior = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  };

  // Para productos por categoria
  const sig = () => {
    setCurSlide((prev) =>
      prev === slidesTotal - 1 ? 0 : prev + 1
    );
  };

  const ant = () => {
    setCurSlide((prev) =>
      prev === 0 ? slidesTotal - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* seccion del carrucel, slogan, direccionamiento a productos */}
      <div className="relative w-full h-190 flex items-center justify-center">
        {/* implementacion de carruselde 5 imagenes de productos */}
        <Carrusel productos={productos} />
      </div>

      {/* Contenedor principal para cuerpo de home */}
      <div className="p-24 h-full w-full flex flex-col gap-32 justify-center items-center">

        {/* Productos destacados */}
        <div className="flex flex-col gap-4">
          {/* handler y titulo */}
          <div className="flex items-center justify-between">
            <p className="text-2xl">Productos destacados</p>

            <div className="flex items-center gap-2">
              <Link href="/productos?categoria=1">
                <p className="underline text-lg">Ver todo</p>
              </Link>
              <button className="rounded-full border hover:cursor-pointer" onClick={anterior}>
                <ChevronLeft size={25} />
              </button>
              <button className="rounded-full border hover:cursor-pointer" onClick={siguiente}>
                <ChevronRight size={25} />
              </button>
            </div>
          </div>
          {/* Productos */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${totalSlides * 100}%`,
                transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="grid grid-cols-3 gap-6 shrink-0"
                  style={{
                    width: `${100 / totalSlides}%`,
                  }}
                >
                  {productos.reverse()
                    .slice(
                      slideIndex * productosPorSlide,
                      (slideIndex + 1) * productosPorSlide
                    )
                    .map((producto) => (
                      <Link
                        href={`/productos/${producto.id}`}
                        key={producto.id}
                      >
                        <ProductCard
                          item={producto}
                          showIcon={false}
                          showToCart={false}
                        />
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        

        {/* Marcas de la tienda */}

        <div className="h-full w-full flex flex-col items-center justify-center gap-4">
          <p className="text-3xl">Nuestras marcas</p>
          <div className="flex items-center flex-wrap justify-center gap-12">
            {marcas.map((marca) => (
              <div className="h-30 w-30 relative" key={marca.id}>
                <Link href={`/productos?marca=${marca.id}`}>
                  <Image src={marca.imagen_url} alt={marca.nombre} fill className="object-contain scale-95" />
                </Link>
              </div>
            ))}
          </div>
        </div>



        {/* Productos por categoria */}
        <div className="flex flex-col gap-4">
          {/* handler y titulo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className={`border  px-2 py-0.5 hover:cursor-pointer ${currentCategory === 11 ? "bg-black text-white" : "text-black bg-white"}`}
              onClick={() => setCurrentCategory(11)}
              >
                Botas
              </button>
              
              <button className={`border px-2 py-0.5 hover:cursor-pointer ${currentCategory === 8 ? "bg-black text-white" : "text-black bg-white"}`}
              onClick={() => setCurrentCategory(8)}
              >
                Camisas
              </button>

              <button className={`border px-2 py-0.5 hover:cursor-pointer ${currentCategory === 2 ? "bg-black text-white" : "text-black bg-white"}`}
              onClick={() => setCurrentCategory(2)}
              >
                Pantalones
              </button>

              <button className={`border px-2 py-0.5 hover:cursor-pointer ${currentCategory === 17 ? "bg-black text-white" : "text-black bg-white"}`}
              onClick={() => setCurrentCategory(17)}
              >
                Relojes
              </button>

              <button className={`border px-2 py-0.5 hover:cursor-pointer ${currentCategory === 20 ? "bg-black text-white" : "text-black bg-white"}`}
              onClick={() => setCurrentCategory(20)}
              >
                Joyería
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/productos?categoria=1">
                <p className="underline text-lg">Ver todo</p>
              </Link>
              <button className="rounded-full border hover:cursor-pointer" onClick={ant}>
                <ChevronLeft size={25} />
              </button>
              <button className="rounded-full border hover:cursor-pointer" onClick={sig}>
                <ChevronRight size={25} />
              </button>
            </div>
          </div>
          {/* Productos */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${slidesTotal * 100}%`,
                transform: `translateX(-${curSlide * (100 / slidesTotal)}%)`,
              }}
            >
              {Array.from({ length: slidesTotal }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="grid grid-cols-3 gap-6 shrink-0"
                  style={{
                    width: `${100 / slidesTotal}%`,
                  }}
                >
                  {items
                    .slice(
                      slideIndex * productosPorSlide,
                      (slideIndex + 1) * productosPorSlide
                    )
                    .map((producto) => (
                      <Link
                        href={`/productos/${producto.id}`}
                        key={producto.id}
                      >
                        <ProductCard
                          item={producto}
                          showIcon={false}
                          showToCart={false}
                        />
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
