// # CRUD de productos 
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
//**********/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    descripcion?: string;
    activo: boolean;
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
        stock: "",
        descripcion: "",
    });

    // Cargar lista de productos
    const cargarProductos = async () => {
        try {
            const res = await fetch("/api/administrador/lista_producto"); // Cambia si tu ruta es diferente
            if (!res.ok) throw new Error("Error al cargar productos");
            const data = await res.json();
            setProductos(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
            alert("No se pudieron cargar los productos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const abrirCrear = () => {
        setEditando(null);
        setForm({ nombre: "", precio: "", stock: "", descripcion: "" });
        setShowModal(true);
    };

    const abrirEditar = (producto: Producto) => {
        setEditando(producto);
        setForm({
            nombre: producto.nombre,
            precio: producto.precio.toString(),
            stock: producto.stock.toString(),
            descripcion: producto.descripcion || "",
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            nombre: form.nombre,
            precio: parseFloat(form.precio),
            stock: parseInt(form.stock),
            descripcion: form.descripcion || null,
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
                res = await fetch("/api/administrador/agregar_producto", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error en la operación");
            }

            alert(editando ? "Producto actualizado correctamente" : "Producto creado correctamente");
            setShowModal(false);
            cargarProductos();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm("¿Estás seguro de desactivar este producto?")) return;

        try {
            const res = await fetch(`/api/administrador/eliminar_producto?id=${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("No se pudo desactivar el producto");

            alert("Producto desactivado correctamente");
            cargarProductos();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
                    </div>

                    <nav className="flex gap-6 text-sm">
                        <button onClick={() => router.push("/admin/")} className="hover:text-black">Dashboard</button>
                        <button onClick={() => router.push("/admin/categorias")} className="hover:text-black">Categorías</button>
                        <button onClick={() => router.push("/admin/clientes")} className="hover:text-black">Clientes</button>
                        <button onClick={() => router.push("/admin/marcas")} className="hover:text-black">Marcas</button>
                        <button onClick={() => router.push("/admin/pedidos")} className="hover:text-black">Pedidos</button>
                        <button onClick={() => router.push("/admin/productos")} className="font-semibold text-black">Productos</button>
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
                {/* Botón Nuevo Producto */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-800">Catálogo de Productos</h2>
                    <button
                        onClick={abrirCrear}
                        className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                    >
                        + Nuevo Producto
                    </button>
                </div>

                {/* Tabla de Productos */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Cargando productos...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-medium">ID</th>
                                    <th className="px-6 py-4 text-left font-medium">Nombre</th>
                                    <th className="px-6 py-4 text-left font-medium">Precio</th>
                                    <th className="px-6 py-4 text-left font-medium">Stock</th>
                                    <th className="px-6 py-4 text-left font-medium">Estado</th>
                                    <th className="px-6 py-4 text-center font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {productos.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-5">{p.id}</td>
                                        <td className="px-6 py-5 font-medium">{p.nombre}</td>
                                        <td className="px-6 py-5">${p.precio.toLocaleString("es-MX")}</td>
                                        <td className="px-6 py-5">
                                            <span className={p.stock < 10 ? "text-red-600 font-semibold" : ""}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1 text-xs rounded-full font-medium ${p.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                {p.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center space-x-4">
                                            <button
                                                onClick={() => abrirEditar(p)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(p.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Desactivar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Crear / Editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">
                            {editando ? "Editar Producto" : "Crear Nuevo Producto"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre del Producto *</label>
                                <input
                                    type="text"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-black"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Precio ($)*</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.precio}
                                        onChange={(e) => setForm({ ...form, precio: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-xl p-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stock *</label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-xl p-3"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-xl p-3"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800"
                                >
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