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

export default function Home() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<any[]>([]);

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

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* seccion del carrucel, slogan, direccionamiento a productos */}
      <div className="relative w-full h-190 flex items-center justify-center">
        {/* implementacion de carruselde 5 imagenes de productos */}
        <Carrusel productos={productos} />
      </div>

      
    </div>
  );
}
