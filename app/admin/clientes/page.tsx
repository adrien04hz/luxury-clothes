// # Gestion de clientes
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
//**********/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/SidebarAdmin";

interface Cliente {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono?: string;
    activo: boolean;
}

export default function AdminClientesPage() {
    const router = useRouter();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const cargarClientes = async () => {
        try {
            const res = await fetch("/api/administrador/lista-cliente");
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
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Clientes Registrados
                    </h2>

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
    );
}