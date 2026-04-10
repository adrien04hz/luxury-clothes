// # Gestion de clientes
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
//**********/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Cliente {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono?: string;
    activo: boolean;
    fecha_registro?: string;
}

export default function AdminClientesPage() {
    const router = useRouter();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const cargarClientes = async () => {
        try {
            const res = await fetch("/api/administrador/lista_cliente");
            if (!res.ok) throw new Error("Error al cargar clientes");
            const data = await res.json();
            setClientes(data.clientes || []);
        } catch (error) {
            console.error(error);
            alert("No se pudieron cargar los clientes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const clientesFiltrados = clientes.filter(cliente =>
        `${cliente.nombre} ${cliente.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(busqueda.toLowerCase())
    );

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
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
                    </div>

                    <nav className="flex gap-6 text-sm">
                        <button onClick={() => router.push("/admin/")} className="hover:text-black">Dashboard</button>
                        <button onClick={() => router.push("/admin/categorias")} className="hover:text-black">Categorías</button>
                        <button onClick={() => router.push("/admin/clientes")} className="font-semibold text-black">Clientes</button>
                        <button onClick={() => router.push("/admin/marcas")} className="hover:text-black">Marcas</button>
                        <button onClick={() => router.push("/admin/pedidos")} className="hover:text-black">Pedidos</button>
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
                    <h2 className="text-3xl font-semibold text-gray-800">Clientes Registrados</h2>

                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 w-80 focus:outline-none focus:border-black"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando clientes...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left">ID</th>
                                    <th className="px-6 py-4 text-left">Nombre Completo</th>
                                    <th className="px-6 py-4 text-left">Correo</th>
                                    <th className="px-6 py-4 text-left">Teléfono</th>
                                    <th className="px-6 py-4 text-left">Estado</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {clientesFiltrados.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-5">{cliente.id}</td>
                                        <td className="px-6 py-5 font-medium">
                                            {cliente.nombre} {cliente.apellidos}
                                        </td>
                                        <td className="px-6 py-5">{cliente.correo}</td>
                                        <td className="px-6 py-5">{cliente.telefono || "—"}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-xs rounded-full font-medium ${cliente.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                {cliente.activo ? "Activo" : "Inactivo"}
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

                        {clientesFiltrados.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No se encontraron clientes con ese criterio de búsqueda.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}