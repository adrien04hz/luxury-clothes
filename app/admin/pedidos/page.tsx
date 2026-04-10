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
    const [filtroEstado, setFiltroEstado] = useState("todos");

    const cargarPedidos = async () => {
        try {
            // Cambia esta ruta si tu endpoint es diferente
            const res = await fetch("/api/administrador/histirual_venta");
            if (!res.ok) throw new Error("Error al cargar pedidos");
            const data = await res.json();
            setPedidos(data);
        } catch (error) {
            console.error(error);
            alert("No se pudieron cargar los pedidos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    const pedidosFiltrados = pedidos.filter(pedido =>
        filtroEstado === "todos" || pedido.estado.toLowerCase() === filtroEstado
    );

    const getEstadoColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case "pendiente": return "bg-yellow-100 text-yellow-700";
            case "en_preparacion": return "bg-blue-100 text-blue-700";
            case "enviado": return "bg-purple-100 text-purple-700";
            case "completado": return "bg-green-100 text-green-700";
            case "cancelado": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/admin/")}
                            className="text-gray-600 hover:text-black flex items-center gap-2"
                        >
                            Dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
                    </div>

                    <nav className="flex gap-6 text-sm">
                        <button onClick={() => router.push("/admin/")} className="hover:text-black">Dashboard</button>
                        <button onClick={() => router.push("/admin/categorias")} className="hover:text-black">Categorías</button>
                        <button onClick={() => router.push("/admin/clientes")} className="hover:text-black">Clientes</button>
                        <button onClick={() => router.push("/admin/marcas")} className="hover:text-black">Marcas</button>
                        <button onClick={() => router.push("/admin/pedidos")} className="font-semibold text-black">Pedidos</button>
                        <button onClick={() => router.push("/admin/productos")} className="hover:text-black">Productos</button>
                    </nav>

                    <button
                        onClick={() => router.push("/")}
                        className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">Lista de Pedidos</h2>

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en_preparacion">En Preparación</option>
                        <option value="enviado">Enviado</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

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
                                            ${pedido.total.toLocaleString("es-MX")}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-xs rounded-full font-medium ${getEstadoColor(pedido.estado)}`}>
                                                {pedido.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium">
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
        </div>
    );
}