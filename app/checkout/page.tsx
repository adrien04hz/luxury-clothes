//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel, Ramos Bello Jose Luis, Diaz Antonio Luis Pedro, Valeriano Lopez Magali Natividad*/
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
import MetodoPagoModal from "../cuenta/metodosdepago/components/MetodoPago";

interface ItemCarrito {
  id_producto: number;
  nombre: string;
  talla: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const cargarCarrito = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/carrito", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al cargar carrito");
      }
      const itemsFormateados = data.data.map((item: any) => ({
        id_producto: item.id_producto,
        nombre: item.nombre,
        talla: item.talla,
        precio: Number(item.precio),
        cantidad: item.cantidad,
        imagen: item.imagen,
      }));
      setItems(itemsFormateados);

    } catch (error) {
      console.error(error);
      setError("No se pudo cargar el carrito");
    } finally {
      setIsLoadingData(false);
    }
  };
  useEffect(() => {
    cargarCarrito();
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  console.log(items);
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

      const body = {
        id_metodo_pago: selectedMetodo,
        id_direccion: selectedDireccion?.id,
        notas: "Compra realizada desde el checkout",
      };
      if (!selectedMetodo) {
        setError("Selecciona un método de pago");
        return;
      }

      if (!selectedDireccion) {
        setError("Selecciona una dirección");
        return;
      }
      const res = await fetch("/api/pedido/procesar_compra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la compra");
      }
      const idPedido = data.data?.id;
      if (!idPedido) {
        throw new Error("No se pudo obtener el pedido");
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
    if (!token) {
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

      // última dirección agregada
      if (dirs.length > 0) {
        setSelectedDireccion(dirs[dirs.length - 1]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // todo lo necesario para metodos de pagos

  const [pagos, setPagos] = useState<any[]>([]);
  const [selectedMetodo, setSelectedMetodo] = useState<number | null>(null);
  const [misTarjetas, setMisTarjetas] = useState<any[]>([]);
  const [mostrarFormularioTarjeta, setMostrarFormularioTarjeta] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<any>(null);

  const [modalPago, setModalPago] = useState({
    open: false,
    modo: "crear" as "crear" | "editar"
  });

  const [formPago, setFormPago] = useState({
    nombre_titular: "",
    numero_cuenta: "",
    fecha_vencimiento: "",
    banco: "",
    correo: "",
    id_tipo_metodo: 1,
    id_proveedor: 1
  });

  const abrirModalTarjeta = () => {
    setFormPago({
      nombre_titular: "",
      numero_cuenta: "",
      fecha_vencimiento: "",
      banco: "",
      correo: "",
      id_tipo_metodo: 1,
      id_proveedor: 1
    });

    setModalPago({ open: true, modo: "crear" });
  };

  const guardarTarjetaCheckout = async () => {
    const userID = localStorage.getItem("userID");

    await fetch("/api/metodosdepago/agregar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formPago, id_usuario: userID })
    });

    setModalPago({ open: false, modo: "crear" });

    await cargarMetodos();
  };

  useEffect(() => {
    cargarPagos();
    cargarMetodos();
  }, []);

  const cargarPagos = async () => {
    const res = await fetch(`/api/metodosdepago/tipos`);
    const data = await res.json();
    console.log(data);

    if (data.ok) setPagos(data.data);
    setLoading(false);
  };

  const cargarMetodos = async () => {
    const userID = localStorage.getItem("userID");

    const res = await fetch(`/api/metodosdepago/vermetodos?clienteId=${userID}`);
    const data = await res.json();

    if (data.ok) setMisTarjetas(data.data);
    setLoading(false);
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
              <hr className=" mb-6" />

              <div className="p-5 border border-gray-200 rounded-xl space-y-4">

                <p className="text-sm text-gray-500 font-medium">
                  Enviar a domicilio
                </p>

                {selectedDireccion ? (
                  <>
                    {/* DIRECCIÓN */}
                    <div className="flex justify-between items-start gap-4">

                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-semibold text-black">
                          {selectedDireccion.nombre} {selectedDireccion.apellido}
                        </p>

                        <p>
                          Calle {selectedDireccion.calle} No. {selectedDireccion.numero_exterior}
                          {selectedDireccion.numero_interior && ` Int. ${selectedDireccion.numero_interior}`}, {selectedDireccion.colonia}
                        </p>

                        <p>
                          CP {selectedDireccion.codigo_postal} {selectedDireccion.ciudad}, {selectedDireccion.estado}
                        </p>

                        <p className="text-gray-500">
                          Tel: {selectedDireccion.telefono}
                        </p>
                      </div>

                      {/* EDITAR */}
                      <button
                        onClick={() => {
                          setDireccionEnEdicion(selectedDireccion);
                          setIsModalOpen(true);
                        }}
                        className="text-sm underline font-semibold hover:opacity-70"
                      >
                        Editar
                      </button>
                    </div>

                    {/* BOTONES */}
                    <div className="flex flex-wrap gap-3 pt-2">

                      <button
                        onClick={() => setIsSelectModalOpen(true)}
                        className="border border-black px-5 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
                      >
                        Elegir otra dirección
                      </button>

                      <button
                        onClick={() => {
                          setDireccionEnEdicion(null);
                          setIsModalOpen(true);
                        }}
                        className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-80 transition"
                      >
                        Agregar nueva
                      </button>

                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-gray-500 text-sm">
                      No tienes una dirección seleccionada
                    </p>

                    <button
                      onClick={() => {
                        setDireccionEnEdicion(null);
                        setIsModalOpen(true);
                      }}
                      className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-80 transition w-fit"
                    >
                      Agregar dirección
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Aqui va la logica de metodo de pago */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Método de pago</h2>
              <hr className="border-gray-800 mb-6" />

              <div className="flex flex-col gap-4">
                {pagos.map((m) => (
                  <div key={m.id} onClick={() => {
                    setSelectedMetodo(m.id);

                    const esTarjeta = m.id === 1 || m.id === 2;

                    if (esTarjeta) {
                      if (misTarjetas.length > 0) {
                        setMostrarFormularioTarjeta(false);
                      } else {
                        setMostrarFormularioTarjeta(true);
                      }
                    } else {
                      setMostrarFormularioTarjeta(false);
                      setTarjetaSeleccionada(null);
                    }
                  }}

                    className={`border-1 rounded-xl p-5 w-full max-w-md cursor-pointer transition-all ${selectedMetodo === m.id
                      ? "border-black scale-[1.02] bg-gray-50"
                      : "border-gray-900 bg-white hover:border-gray-500"
                      }`}>
                    <h2 className="text-lg font-semibold mb-1">
                      {m.nombre || "Tarjeta"}
                    </h2>

                    {selectedMetodo === m.id && (
                      <p className="text-sm text-gray-600 mt-3">
                        {m.descripcion || "Al seleccionar este método, podrás continuar con el pago de forma segura."}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {selectedMetodo && (selectedMetodo === 1 || selectedMetodo === 2) && (
                <div className="mt-6 space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Selecciona tu tarjeta:</h2>

                  {misTarjetas.length > 0 && (
                    <div className="border rounded-xl p-4 bg-white">

                      <p className="text-sm text-gray-500 mb-2">Tarjetas guardadas</p>

                      <select
                        className="w-full border rounded-lg p-3"
                        onChange={(e) => {
                          const tarjeta = misTarjetas.find(t => t.id == e.target.value);
                          setTarjetaSeleccionada(tarjeta);
                        }}
                      >
                        <option value="">Selecciona una tarjeta</option>
                        {misTarjetas.map((t) => (
                          <option key={t.id} value={t.id}>
                            **** **** **** {t.numero_cuenta?.slice(-4)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {tarjetaSeleccionada && (
                    <div className="space-y-4">
                      <button onClick={abrirModalTarjeta} className="text-sm">
                        Agregar nueva tarjeta
                      </button>

                    </div>
                  )}

                  {misTarjetas.length === 0 && (
                    <button onClick={abrirModalTarjeta} className="bg-black text-white px-4 py-2 rounded">
                      Agregar tarjeta
                    </button>
                  )}

                </div>
              )}
            </div>

          </div>

          <div className="lg:col-span-4">
            <h2 className="text-xl font-semibold mb-4">Artículos</h2>
            <hr className="border-gray-800 mb-6" />
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id_producto} className="flex gap-6">
                  <div className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                    {item.imagen ? (
                      <Image
                        src={item.imagen || "/images/no-image.png"}
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
                      {item.nombre}
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
            <div className="flex flex-col lg:flex-row gap-4 justify-end mt-8">
              <button
                onClick={realizarCompra}
                disabled={loading || items.length === 0}
                className="bg-black text-white px-16 py-4 rounded-md font-semibold text-lg hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed w-full lg:w-auto"
              >
                {loading ? "Procesando..." : "Confirmar compra"}
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 justify-end mt-8">
              <button
                onClick={() => window.history.back()}
                className="border border-gray-800 px-16 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition w-full lg:w-auto"
              >
                {loading ? "Cancelando compra..." : "Cancelar compra"}
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
            )}
          </div>
        </div>
      </div>
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

      <ListaDirecciones
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        direcciones={direccion}
        onSelect={(dir) => {
          setSelectedDireccion(dir);
        }}
      />
      {/* llamar al modal de agregar tarjeta  */}
      <MetodoPagoModal
        open={modalPago.open}
        modo={modalPago.modo}
        form={formPago}
        setForm={setFormPago}
        onClose={() => setModalPago({ open: false, modo: "crear" })}
        onSave={guardarTarjetaCheckout}
      />
    </div>
  );
}