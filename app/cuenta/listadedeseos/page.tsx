// # Gestion de productos guardados (Ver, aumentar, agregar a carrito, comprar, eliminar)
/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 10 de Abril de 2026
*/
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ProductCard from "@/app/components/ProductCard";
import { ListaDeDeseos } from "@/types/listadedeseos/ListaDeDeseos";
import { CheckCircle2Icon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Producto } from "@/types/producto/Producto";
import SelectorTalla from "@/app/productos/components/SelectorTalla";

export default function ListadeseosPage() {
  const [products, setProducts] = useState<ListaDeDeseos[]>([]);
  const [loading, setLoading] = useState(true);
  const [idTalla, setIdTalla] = useState<number | null>(null);
  const [tallaName, setTallaName] = useState<string>("");
  const [notSelected, setNotSelected] = useState(false);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [view, setView] = useState<"none" | "selector" | "modal">("none");

  const router = useRouter();

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

  const handleAddToCart = async (productId: number) => {
    setLoading(true);
    if (!idTalla) {
      setLoading(false);
      setNotSelected(true);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      router.push("/auth/login");
      return;
    }

    try {
      await fetch("/api/carrito", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: productId,
          id_talla: idTalla,
          cantidad: 1,    
        }),
      });

      setView("modal");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const getProducto = async (id_producto : number) => {
    try {
      const res = await fetch(`/api/producto/${id_producto}`);
      const { data } : { data: Producto } = await res.json();
      setProducto(data);
    } catch (error) {
      setProducto(null);
      console.error(error);
    }
  };



  if ( loading ) {
    return (
      <div className="h-180 w-full flex flex-col items-center justify-center gap-4">
        <Loader className="h-20 w-20 animate-spin" />
        <p className="font-medium text-lg">Cargando favoritos...</p>
      </div>
    );
  }

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
    <>
    <div className="pl-16 pt-12 pr-16 pb-12">

      <p className="mb-6 text-3xl font-normal">Productos deseados</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showIcon={true}
            pendingDelete={pendingDeleteId === product.id}
            onRemoveFavorite={handleRemoveFavorite}
            onUndo={handleUndo}
            onAddToCart={handleAddToCart}
            onViewTallas={getProducto}
            onSelectTalla={setIdTalla}
            onSelectTallaName={setTallaName}
            onSetNotSelected={setNotSelected}
            onSetView={setView}
          />
        ))}
      </div>
    </div>


    <div className={`fixed inset-0 z-50 flex ${view === "selector" ? "justify-center items-center" : "justify-end"}
    transition-all duration-300
    ${view !== "none"
      ? "visible opacity-100 pointer-events-auto" 
      : "invisible opacity-0 pointer-events-none"}
    `}>
      
      {/* OVERLAY */}
      <div 
        className={`
          absolute inset-0 bg-black/30
          transition-opacity duration-300
          ${view !== "none" ? "opacity-100" : "opacity-0"}
        `}
        onClick={() => setView("none")}
      />

      {/* PANEL DERECHO */}
      <div className={`
        relative w-100 h-fit bg-black shadow-xl
        mt-26 mr-12
        transform transition-all duration-300 ease-in-out
        rounded-xl ${view === "selector" ? "hidden": ""}
        ${view === "modal"
          ? "translate-y-0 opacity-100" 
          : "-translate-y-10 opacity-0"}`}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center p-4">
          
          <div className="flex gap-2 items-center">
            <CheckCircle2Icon className="text-green-500" />
            <p className="font-semibold text-lg text-white">
            Agregado al carrito
            </p>
          </div>

          <div className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors duration-200 flex items-center justify-center">
            <button onClick={() => setView("none")}>
              ✕
            </button>
          </div>
        </div>

        {/* PRODUCTO */}
        <div className="p-4 flex gap-4 w-full h-full">
          <div className="relative h-20 w-20 overflow-hidden">
            <Image src={producto?.imagenes?.[0] || "/placeholder.png"} alt={producto?.nombre || "Producto"} className="object-cover rounded" fill/>
          </div>

          <div className="flex flex-col gap-1 w-3/4">
            <p className="font-medium text-white">{producto?.nombre}</p>
            <p className="text-sm text-white opacity-70">
              Talla: {tallaName}
            </p>
            <p className="font-semibold text-white">
              ${Number(producto?.precio).toLocaleString()}
            </p>
          </div>
        </div>

        {/* BOTONES */}
        <div className="p-4 flex flex-col gap-3">
          <button
            onClick={() => {
              router.push("/carrito")
            }}
            className="border border-white text-white rounded-full py-3 hover:opacity-60 transition-colors duration-100"
          >
            Ver carrito
          </button>

          <button
          onClick={() => setView("none")}
            className="bg-white text-black rounded-full py-3 hover:opacity-60 transition-opacity duration-100"
          >
            Seguir comprando
          </button>
        </div>
      </div>

      {/* Selector de tallas */}
      <div className={`
        relative w-200 h-100 bg-white shadow-xl
        transform transition-all duration-300 ease-in-out
        rounded-xl
        ${view === "selector"
          ? "translate-y-0 opacity-100" 
          : "-translate-y-10 opacity-0"}`}
      >
        <div>
          <Image 
            src={producto?.imagenes?.[0] || "/placeholder.png"}
            alt={producto?.nombre || "Producto"}
            className="object-cover rounded-tl-xl rounded-tr-xl"
            fill
          />

        </div>

      </div>
    </div>
    </>
  );
}