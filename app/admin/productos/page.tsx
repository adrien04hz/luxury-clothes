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
    imagenes?: string[];
}

export default function AdminProductosPage() {
    const router = useRouter();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<Producto | null>(null);
    const [tallas, setTallas] = useState<any[]>([]);

    const [form, setForm] = useState({
        nombre: "",
        precio: "",
        descripcion: "",
        stock: "",
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
        setForm({ nombre: "", precio: "", descripcion: "", stock: "" });
        setShowModal(true);
    };

    const abrirEditar = async (producto: Producto) => {
        try {
            setEditando(producto);

            setForm({
                nombre: producto.nombre,
                precio: producto.precio.toString(),
                descripcion: producto.descripcion || "",
                stock: producto.stock.toString(),
            });

            const res = await fetch(`/api/administrador/stock-producto/${producto.id}`);
            if (!res.ok) {
                const text = await res.text();
                console.error("ERROR BACKEND:", text);
                throw new Error("Error al obtener tallas");
            }

            const data = await res.json();

            setTallas(Array.isArray(data.stock) ? data.stock : []);

            setShowModal(true);

        } catch (error: any) {
            console.error(error);
            alert("Error al cargar información del producto");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!form.precio || isNaN(parseFloat(form.precio))) {
                throw new Error("Precio inválido");
            }

            const payload = {
                nombre: form.nombre.trim(),
                precio: parseFloat(form.precio),
                descripcion: form.descripcion.trim() || "Sin descripción",
                stock: parseInt(form.stock),
            };

            let res;

            if (editando) {
                res = await fetch(
                    `/api/administrador/modificar_producto?id=${editando.id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || "Error al actualizar producto");
                }

                const resStock = await fetch("/api/administrador/actualizar-stock", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_producto: editando.id,
                        tallas,
                    }),
                });

                if (!resStock.ok) {
                    const errorData = await resStock.json().catch(() => ({}));
                    throw new Error(errorData.error || "Error al actualizar stock");
                }

                alert("Producto actualizado correctamente");

            } else {
                res = await fetch("/api/administrador/agregar-producto", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const body = await res.json();
                console.log("Datos recibidos para nuevo producto:", body);

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || "Error al crear producto");
                }

                alert("Producto creado correctamente");
            }

            await cargarProductos();

            setShowModal(false);

            setEditando(null);
            setTallas([]);

        } catch (error: any) {
            console.error(error);
            alert("Error: " + error.message);
        }
    };

    const handleEliminar = async (id: number) => {
        if (!confirm("¿Estás seguro de desactivar este producto?")) return;

        try {
            const res = await fetch(`/api/administrador/eliminar-producto?id=${id}`, {
                method: "DELETE",
            });

            const text = await res.text();

            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                data = {};
            }

            if (!res.ok) {
                throw new Error(data.error || "Error al desactivar producto");
            }

            alert("Producto desactivado correctamente");

            setProductos((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, activo: false } : p
                )
            );

        } catch (error: any) {
            console.error(error);
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
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">

                        {/* Título */}
                        <h2 className="text-2xl font-bold mb-6">
                            {editando ? "Editar Producto" : "Crear Nuevo Producto"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* 🔒 Nombre (bloqueado en edición) */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nombre del Producto
                                </label>
                                <input
                                    type="text"
                                    value={form.nombre}
                                    disabled={!!editando}
                                    onChange={(e) =>
                                        setForm({ ...form, nombre: e.target.value })
                                    }
                                    className={`w-full border rounded-xl p-3 ${editando ? "bg-gray-100 cursor-not-allowed" : ""
                                        }`}
                                />
                            </div>

                            {/* 💲 Precio */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Precio ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.precio}
                                    onChange={(e) =>
                                        setForm({ ...form, precio: e.target.value })
                                    }
                                    required
                                    className="w-full border border-gray-300 rounded-xl p-3"
                                />
                            </div>

                            {/* 📝 Descripción */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={(e) =>
                                        setForm({ ...form, descripcion: e.target.value })
                                    }
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-xl p-3"
                                />
                            </div>

                            {/* � Stock */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.stock}
                                    onChange={(e) =>
                                        setForm({ ...form, stock: e.target.value })
                                    }
                                    required
                                    className="w-full border border-gray-300 rounded-xl p-3"
                                />
                            </div>
                            {/* 📦 STOCK POR TALLA (solo en edición) */}
                            {editando && (
                                <div>
                                    <h3 className="font-semibold mb-3 text-gray-800">
                                        Stock por talla
                                    </h3>

                                    {tallas.length === 0 ? (
                                        <p className="text-gray-500 text-sm">
                                            No hay tallas registradas
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {tallas.map((t, index) => (
                                                <div
                                                    key={t.id_talla}
                                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                                >
                                                    <span className="font-medium w-20">
                                                        {t.talla}
                                                    </span>

                                                    <input
                                                        type="number"
                                                        value={t.stock}
                                                        min={0}
                                                        onChange={(e) => {
                                                            const newTallas = [...tallas];
                                                            newTallas[index].stock = parseInt(e.target.value) || 0;
                                                            setTallas(newTallas);
                                                        }}
                                                        className="border p-2 w-24 rounded-lg text-center"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ⚡ Botones */}
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