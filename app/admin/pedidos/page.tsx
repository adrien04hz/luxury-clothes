// # Gestion de pedidos
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
//**********/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Pedido {
    id: number;
    fecha: string;
    cliente: string;
    total: number;
    estado: string;
    metodo_pago?: string;
}

export default function AdminPedidosPage() {
    const router = useRouter();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtroEstado, setFiltroEstado] = useState("todos");

    const cargarPedidos = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/administrador/historial-venta", {
                credentials: "include", // Por si usas autenticación con cookies
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status}: No se pudo cargar los pedidos`);
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Error al procesar la respuesta");
            }

            // Aceptamos tanto "pedidos" como "historial_ventas" por compatibilidad
            const listaPedidos = Array.isArray(data.pedidos)
                ? data.pedidos
                : Array.isArray(data.historial_ventas)
                    ? data.historial_ventas
                    : [];

            setPedidos(listaPedidos);
        } catch (err: any) {
            console.error("Error cargando pedidos:", err);
            setError(err.message || "No se pudieron cargar los pedidos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    const pedidosFiltrados = pedidos.filter(pedido =>
        filtroEstado === "todos" ||
        pedido.estado.toLowerCase() === filtroEstado.toLowerCase()
    );

    // Función segura para colores de estado
    const getEstadoColor = (estado: string | undefined | null) => {
        if (!estado) return "bg-gray-100 text-gray-700"; // color por defecto si no hay estado

        const estadoLower = estado.toLowerCase().trim();

        switch (estadoLower) {
            case "pendiente":
                return "bg-yellow-100 text-yellow-700";
            case "pagado":
                return "bg-blue-100 text-blue-700";
            case "en preparación":
            case "en_preparacion":
                return "bg-blue-100 text-blue-700";
            case "listo para envío":
            case "listo_para_envio":
                return "bg-purple-100 text-purple-700";
            case "enviado":
                return "bg-purple-100 text-purple-700";
            case "completado":
                return "bg-green-100 text-green-700";
            case "cancelado":
                return "bg-red-100 text-red-700";
            case "rechazado":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">Lista de Pedidos</h2>

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en_preparacion">En Preparación</option>
                        <option value="enviado">Enviado</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={cargarPedidos}
                            className="underline hover:no-underline"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando pedidos...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left">Pedido ID</th>
                                    <th className="px-6 py-4 text-left">Fecha</th>
                                    <th className="px-6 py-4 text-left">Cliente</th>
                                    <th className="px-6 py-4 text-left">Total</th>
                                    <th className="px-6 py-4 text-left">Estado</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pedidosFiltrados.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-5 font-medium">#{pedido.id}</td>
                                        <td className="px-6 py-5">
                                            {new Date(pedido.fecha).toLocaleDateString("es-MX")}
                                        </td>
                                        <td className="px-6 py-5">{pedido.cliente}</td>
                                        <td className="px-6 py-5 font-semibold">
                                            ${pedido.total ? pedido.total.toLocaleString("es-MX") : "0"}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-xs rounded-full font-medium ${getEstadoColor(pedido.estado)}`}>
                                                {pedido.estado || "Sin estado"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => router.push(`/admin/pedidos/${pedido.id}`)}
                                            className="text-blue-600 hover:text-blue-800 font-medium">
                                                Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {pedidosFiltrados.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No hay pedidos con el estado seleccionado.
                            </div>
                        )}
                    </div>
                )}
            </div>
    );
}