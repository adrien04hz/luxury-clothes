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
import { CheckCircle2Icon, Loader, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Producto } from "@/types/producto/Producto";
import SelectorTalla from "@/app/productos/components/SelectorTalla";
import Link from "next/link";

export default function ListadeseosPage() {
  const [products, setProducts] = useState<ListaDeDeseos[]>([]);
  const [loading, setLoading] = useState(false);
  const [idTalla, setIdTalla] = useState<number | null>(null);
  const [tallaName, setTallaName] = useState<string>("");
  const [notSelected, setNotSelected] = useState(false);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [view, setView] = useState<"none" | "selector" | "modal">("none");
  const [modalLoading, setModalLoading] = useState(false);

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

  useEffect(() => {
    if (view === "selector") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

		setTimeout(() => {
			if (view === "modal") setView("none");
		}, 8000);
	}, [view]);

  const loadWishlist = async () => {
    try {
      const res = await fetch("/api/listadeseos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!res.ok) {
        throw new Error('Error al cargar la lista de deseos');
      }

      const { data } : { data: ListaDeDeseos[] } = await res.json();
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

  const handleAddToCart = async () => {
    if (!idTalla) {
      setNotSelected(true);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
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
          id_producto: producto?.id,
          id_talla: idTalla,
          cantidad: 1,    
        }),
      });

      setView("modal");
    } catch (error) {
      console.error(error);
    }
  };

  const getProducto = async (id_producto : number) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/producto/${id_producto}`);

      if (!res.ok) {
        setLoading(false);
        throw new Error('Error al obtener el producto');
      }

      const { data } : { data: Producto } = await res.json();
      setProducto(data);
      setModalLoading(false);
    } catch (error) {
      setModalLoading(false);
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
              onViewTallas={getProducto}
              onSetView={setView}
            />
        ))}
      </div>
    </div>


    <div className={`fixed inset-0 z-50
    transition-all duration-300
    ${view !== "none"
      ? "visible opacity-100" 
      : "invisible opacity-0"}
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
           w-100 h-fit bg-black shadow-xl
          absolute right-12 top-26
          transform transition-all duration-300 ease-in-out
          rounded-xl
          ${view === "modal"
          ? "translate-y-0 opacity-100" 
          : "-translate-y-10 opacity-0 pointer-events-none absolute"}`}
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
            <Image src={producto?.imagenes?.[0] || "/assets/images/bag.svg"} alt={producto?.nombre || "Producto"} className="object-cover rounded" fill/>
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
          w-230 h-130 bg-white shadow-xl
          transform transition-all duration-300 ease-in-out
           rounded-4xl absolute top-0 left-0 right-0 bottom-0 m-auto
          ${view === "selector"
            ? "translate-y-0 opacity-100" 
          : "-translate-y-10 opacity-0 pointer-events-none absolute"}`}
      >
        <div className="flex items-center justify-between w-full h-full">
          <div className="relative h-full w-1/2 flex items-center justify-center rounded-l-4xl border border-gray-200 overflow-hidden">
            <Image
              src={producto?.imagenes?.[0] || "/assets/images/bag.svg"}
              alt={producto?.nombre || "Producto"}
              className="object-cover"
              fill
            />
          </div>
          <div className=" flex flex-col jutify-center items-center w-1/2 h-full">
            {modalLoading ? (
              <div className="w-full h-full flex items-center justify-center flex-col gap-3">
                <Loader className="h-10 w-10 animate-spin" />
                <p className="font-medium text-lg">Cargando detalles...</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center flex-col px-10 gap-8">
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col gap-0.5">
                    <div className="w-full flex items-center justify-start text-lg font-semibold">
                      <p className="max-w-75 overflow-hidden text-ellipsis whitespace-nowrap">{producto?.nombre}</p>
                    </div>
                    <div className="w-full flex items-center justify-start text-md font-medium opacity-80">
                      <p>Color: {producto?.color}</p>
                    </div>
                    <div className="w-full flex items-center justify-start text-md font-semibold opacity-90 mt-2">
                      <p>$ {Number(producto?.precio).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:opacity-60 transition-colors duration-200">
                    <button
                      onClick={() => {
                        setView("none");
                        setProducto(null);
                        setTallaName("");
                        setIdTalla(null);
                        setNotSelected(false);
                      }}
                    >
                      <X color="black"/>
                    </button>
                  </div>
                </div>
                <div className={`flex items-center justify-center h-fit w-fit ${notSelected ? "border border-red-500 rounded-md" : ""}`}>
                  <SelectorTalla
                    tallas={producto?.stock_por_talla || []}
                    onSelect= {setIdTalla}
                    onSelectedTalla={setTallaName}
                    onClick={setNotSelected}
                  />
                </div>
              </div>
            )
          }

          {
            !modalLoading && (
              <div className="flex items-center border border-b-0 border-l-0 border-r-0 border-t-gray-200 w-full justify-around h-18">
                <div>
                  <Link
                    href={`/productos/${producto?.id}`}>
                    <p className="hover:underline">Ver todo el producto</p>
                  </Link>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={handleAddToCart}
                    className="bg-black text-white py-2 px-4 rounded-full w-full h-10 hover:opacity-60 transition-all duration-100"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ) 
          }
          </div>
        </div>

      </div>
    </div>
    </>
  );
}