//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 10/04/2026 */
//**********/
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ItemCarrito {
  id_producto: number;
  nombre: string;
  talla: string;
  precio: number;
  cantidad: number;
  imagen_url?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Simulación de carrito (en el futuro vendrá del contexto o localStorage)
  useEffect(() => {
    // Aquí deberías cargar el carrito real desde un contexto o API
    const carritoEjemplo: ItemCarrito[] = [
      {
        id_producto: 1,
        nombre: "100 mm Mules - Silk taffetas",
        talla: "24",
        precio: 21533.30,
        cantidad: 2,
        imagen_url: "/images/zapatos/mules-black.png", // cambia por tu ruta real
      },
      {
        id_producto: 2,
        nombre: "100 mm Mules - Silk taffetas",
        talla: "30",
        precio: 21533.30,
        cantidad: 2,
        imagen_url: "/images/zapatos/mules-black.png",
      },
      {
        id_producto: 3,
        nombre: "100 mm Mules - Silk taffetas",
        talla: "25",
        precio: 21533.30,
        cantidad: 2,
        imagen_url: "/images/zapatos/mules-black.png",
      },
      {
        id_producto: 4,
        nombre: "100 mm Mules - Silk taffetas",
        talla: "27",
        precio: 21533.30,
        cantidad: 2,
        imagen_url: "/images/zapatos/mules-black.png",
      },
    ];

    setItems(carritoEjemplo);
    setIsLoadingData(false);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const realizarCompra = async () => {
    if (items.length === 0) {
      setError("No hay productos en el carrito");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/pedido/procesar_compra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_metodo_pago: 1,     // Cambia según selección del usuario
          id_direccion: 1,       // Cambia según selección del usuario
          notas: "Compra realizada desde el checkout",
          // Aquí puedes enviar también los items del carrito si tu API lo requiere
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la compra");
      }

      const idPedido = data.id_pedido || data.pedido?.id;
      if (!idPedido) {
        throw new Error("No se recibió el ID del pedido");
      }

      // Redirigir a confirmación
      router.push(`/checkout/confirmacion?id=${idPedido}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error al procesar tu compra");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return <div className="p-10 text-center">Cargando resumen del pedido...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold p-10">Resumen de pedido</h1>
      <div className="max-w-5xl mx-auto p-6">
        <h6 className="text-3xl mb-8 text-gray-800">Articulos</h6>
        <hr className="border-black" />
        <hr className="my-1 border-black" />
        <div className="">
          {/* Cabecera de la tabla */}
          <div className="grid grid-cols-12 font-medium text-sm py-3 px-1">
            <div className="col-span-4">Artículo</div>
            <div className="col-span-4">Nombre</div>
            <div className="col-span-1 text-left">Talla</div>
            <div className="col-span-2 text-center">Costo</div>
            <div className="col-span-1 text-center">Cantidad</div>
          </div>
          <hr className="border-black" />

          {/* Filas de productos */}
          {items.map((item) => (
            <div
              key={item.id_producto}
              className="grid grid-cols-12 last:border-b-0 py-6 px-6 items-center hover:bg-gray-50"
            >
              {/* Imagen del artículo */}
              <div className="col-span-4 flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {item.imagen_url ? (
                    <Image
                      src={item.imagen_url}
                      alt={item.nombre}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>
              </div>

              {/* Nombre */}
              <div className="col-span-4">
                <p className="font-medium">{item.nombre}</p>
              </div>

              {/* Talla */}
              <div className="col-span-1 text-left font-medium">
                {item.talla}
              </div>

              {/* Costo */}
              <div className="col-span-2 text-center font-medium">
                ${item.precio.toLocaleString("es-MX")}
              </div>

              {/* Cantidad */}
              <div className="col-span-1 text-center">
                  {item.cantidad}
                  <button>
                    -{/* Aquí puedes agregar botones para aumentar/disminuir cantidad si lo deseas */}
                  </button>
                  <button>
                    +{/* Aquí puedes agregar un botón para eliminar el artículo del carrito si lo deseas */}
                  </button>
              </div>
            </div>
          ))}
        </div>
        <hr className="border-black" />
        {/* Aqui va el diseño para direccion de envio */}
        <h6 className="text-3xl py-8 text-gray-800">Direccion de envio</h6>
        <hr className="border-black" />
        {/* Aqui va el diseño para metodo de pago */}
        <h6 className="text-3xl py-8 text-gray-800">Metodo de pago</h6>
        <hr className="border-black" />
        {/* Total */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-md">
            <div className="flex justify-between text-lg py-3 border-b">
              <span className="font-medium">Total a pagar:</span>
              <span className="font-bold">
                ${subtotal.toLocaleString("es-MX")}
              </span>
            </div>

            <button
              onClick={realizarCompra}
              disabled={loading || items.length === 0}
              className="mt-8 w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Procesando compra..." : "Comprar"}
            </button>

            {error && (
              <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}