// # CRUD de productos 
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor: Ramos Bello Jose Luis */
//* Fecha: 20/04/2026 */
//**********/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/app/components/SidebarAdmin";

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    descripcion?: string;
    activo: boolean;
    color?: string;
    genero?: string;
    subcategoria?: string;
    marca?: string;
    imagenes?: string[];        // array de URLs desde ImagenProducto
}

export default function AdminProductosPage() {
    const router = useRouter();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<Producto | null>(null);

    const [form, setForm] = useState({
        nombre: "",
        precio: "",
        descripcion: "",
    });

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/administrador/lista-producto");

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Error al cargar productos");
            }

            const data = await res.json();
            setProductos(Array.isArray(data.productos) ? data.productos : []);
        } catch (error: any) {
            console.error("Error cargando productos:", error);
            alert(error.message || "No se pudieron cargar los productos");
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const abrirCrear = () => {
        setEditando(null);
        setForm({ nombre: "", precio: "", descripcion: "" });
        setShowModal(true);
    };

    const abrirEditar = (producto: Producto) => {
        setEditando(producto);
        setForm({
            nombre: producto.nombre,
            precio: producto.precio.toString(),
            descripcion: producto.descripcion || "",
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            nombre: form.nombre.trim(),
            precio: parseFloat(form.precio),
            descripcion: form.descripcion.trim() || "Sin descripción",
        };

        try {
            let res;
            if (editando) {
                res = await fetch(`/api/administrador/modificar_producto?id=${editando.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch("/api/administrador/agregar-producto", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Error en la operación");
            }

            alert(editando ? "Producto actualizado correctamente" : "Producto creado correctamente");
            setShowModal(false);
            cargarProductos();
        } catch (error: any) {
            alert("Error: " + error.message);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm("¿Estás seguro de desactivar este producto?")) return;

        try {
            const res = await fetch(`/api/administrador/eliminar-producto?id=${id}`, { method: "DELETE" });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "No se pudo desactivar el producto");
            }

            alert("Producto desactivado correctamente");
            cargarProductos();
        } catch (error: any) {
            alert("Error: " + error.message);
        }
    };

    return (
            <div>
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-semibold text-gray-800">Catálogo de Productos</h2>
                        <button onClick={abrirCrear} className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition">
                            + Nuevo Producto
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Cargando productos...</div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-medium">Imagen</th>
                                        <th className="px-6 py-4 text-left font-medium">ID</th>
                                        <th className="px-6 py-4 text-left font-medium">Nombre</th>
                                        <th className="px-6 py-4 text-left font-medium">Marca</th>
                                        <th className="px-6 py-4 text-left font-medium">Precio</th>
                                        <th className="px-6 py-4 text-left font-medium">Stock</th>
                                        <th className="px-6 py-4 text-left font-medium">Estado</th>
                                        <th className="px-6 py-4 text-center font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {productos.map((p) => {
                                        const imagenUrl = p.imagenes && p.imagenes.length > 0
                                            ? p.imagenes[0]
                                            : "https://via.placeholder.com/300x300/cccccc/666666?text=Sin+Imagen";

                                        return (
                                            <tr key={p.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-5">
                                                    <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                        <Image
                                                            src={imagenUrl}
                                                            alt={p.nombre}
                                                            fill
                                                            className="object-cover"
                                                            sizes="64px"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 font-mono text-sm text-gray-500">{p.id}</td>
                                                <td className="px-6 py-5 font-medium line-clamp-2">{p.nombre}</td>
                                                <td className="px-6 py-5">{p.marca || "—"}</td>
                                                <td className="px-6 py-5 font-medium">${p.precio.toLocaleString("es-MX")}</td>
                                                <td className="px-6 py-5">
                                                    <span className={p.stock < 10 ? "text-red-600 font-semibold" : ""}>
                                                        {p.stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-4 py-1 text-xs rounded-full font-medium ${p.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                        {p.activo ? "Activo" : "Inactivo"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center space-x-4">
                                                    <button onClick={() => abrirEditar(p)} className="text-blue-600 hover:text-blue-800 font-medium">
                                                        Editar
                                                    </button>
                                                    <button onClick={() => handleEliminar(p.id)} className="text-red-600 hover:text-red-800 font-medium">
                                                        Desactivar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal Crear / Editar (sin cambios) */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-6">
                                {editando ? "Editar Producto" : "Crear Nuevo Producto"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nombre del Producto *</label>
                                    <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="w-full border border-gray-300 rounded-xl p-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Precio ($)*</label>
                                    <input type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required className="w-full border border-gray-300 rounded-xl p-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Descripción</label>
                                    <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={4} className="w-full border border-gray-300 rounded-xl p-3" />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-100">Cancelar</button>
                                    <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800">
                                        {editando ? "Guardar Cambios" : "Crear Producto"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
    );
}