//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel, Ramos Bello Jose Luis*/
//* Fecha: 10/04/2026 */
//**********/
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDirecciones } from "@/client/direccionesenvio";
import { ListaDireccionEnvio } from "@/types/direccionesenvio/DireccionesEnvio";
import FormularioDireccion from "../cuenta/direcciones/components/FormularioDireccion";
import ListaDirecciones from "./components/ListaDirecciones";

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

  // Simulación de carrito
  useEffect(() => {
    const carritoEjemplo: ItemCarrito[] = [
      {
        id_producto: 1,
        nombre: "100 mm Mules - Silk taffetas",
        talla: "24",
        precio: 21533.30,
        cantidad: 2,
        imagen_url: "/images/zapatos/mules-black.png",
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

  //Haciendo lista de direcciones 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [direccion, setDirecciones] = useState<ListaDireccionEnvio[]>([]);
  const [selectedDireccion, setSelectedDireccion] = useState<ListaDireccionEnvio | null>(null);
  const [direccionEnEdicion, setDireccionEnEdicion] = useState<ListaDireccionEnvio | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) {
      window.location.href = "/cuenta"; //redireccionamiento a page cuenta
      return;
    }
    loadDireccion();
  }, []);
  
  const loadDireccion = async () => {
    try {
      const data = await getDirecciones();
      const dirs = data.direcciones;

      setDirecciones(dirs);

      // 👉 última dirección agregada
      if (dirs.length > 0) {
        setSelectedDireccion(dirs[dirs.length - 1]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  if (isLoadingData) {
    return <div className="p-10 text-center">Cargando resumen del pedido...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold p-10">Resumen de pedido</h1>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-12">

            {/* Aqui va la logica de datos de envío */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Datos de envío</h2>
              <hr className="border-gray-800 mb-6" />

                <div className="p-4">
                  <p className="text-md font-semibold">Enviar a domicilio</p>
                  {selectedDireccion ? (
                    <div>
                    <div className="flex justify-between items-start">
                      <div className="text-[#757575] text-[16px] space-y-1">
                        <p>
                          {selectedDireccion.nombre} {selectedDireccion.apellido} {selectedDireccion.telefono}
                        </p>
                        <p>
                          {selectedDireccion.calle} {selectedDireccion.numero_exterior}
                          {selectedDireccion.numero_interior && ` Int. ${selectedDireccion.numero_interior}`} {selectedDireccion.colonia}
                        </p>
                        <p>
                          {selectedDireccion.codigo_postal} {selectedDireccion.ciudad}, {selectedDireccion.estado}
                        </p>
                      </div>
                      <button
                        onClick={() => { setDireccionEnEdicion(selectedDireccion);setIsModalOpen(true)}}
                          className="text-black text-sm font-bold underline">
                        Editar
                      </button>
                    </div>

                    <div className="flex justify-between   pt-4">
                       <button
                        onClick={() => {
                          setIsSelectModalOpen(true);
                        }}
                        className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:opacity-80 transition">
                        Elegir dirección
                      </button>
                      <button
                        onClick={() => {
                          setDireccionEnEdicion(null);
                          setIsModalOpen(true);
                        }}
                      className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:opacity-80 transition">
                      Agregar dirección
                      </button>

                    </div>
                    
                  </div>
                  ) : (
                    <p className="text-gray-500">No hay dirección seleccionada</p>
                  )}
                </div>
              </div>

            {/* Aqui va la logica de metodo de pago */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Método de pago</h2>
              <hr className="border-gray-800 mb-6" />
            </div>
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-xl font-semibold mb-4">Artículos</h2>
            <hr className="border-gray-800 mb-6" />
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id_producto} className="flex gap-6">
                  <div className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                    {item.imagen_url ? (
                      <Image
                        src={item.imagen_url}
                        alt={item.nombre}
                        width={112}
                        height={112}
                        className="object-contain w-full h-full p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-medium text-base">
                      100 mm Mules - Silk taffetas
                    </p>
                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Talla:</span> {item.talla}</p>
                      <p><span className="font-medium">Cantidad:</span> {item.cantidad}</p>
                      <p className="font-medium text-black">
                        ${item.precio.toLocaleString("es-MX")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-gray-800 my-8" />
            <div className="flex justify-end">
              <div className="text-right">
                <div className="flex justify-between items-baseline gap-8 text-lg">
                  <span className="font-medium">Total a pagar</span>
                  <span className="font-bold text-2xl">
                    ${subtotal.toLocaleString("es-MX")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={realizarCompra}
                disabled={loading || items.length === 0}
                className="bg-black text-white px-16 py-4 rounded-md font-semibold text-lg hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed w-full lg:w-auto"
              >
                {loading ? "Procesando compra..." : "Comprar"}
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
            )}
          </div>
        </div>
      </div>
      //Formulario para editar o añadir direccion
      <FormularioDireccion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          loadDireccion();

          if (data?.direccion) {
            setSelectedDireccion(data.direccion);
          }
        }}
        selectedDireccion={direccionEnEdicion}
        allowDelete={false}
      />

      //Mostrar lista de direcciones
      <ListaDirecciones
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        direcciones={direccion}
        onSelect={(dir) => {
          setSelectedDireccion(dir);
        }}
      />
    </div>
  );
}