// # Gestión de la cuenta
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
//**********/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarCuenta from "@/app/components/SidebarCuenta";

export default function EditarPerfilPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    foto_perfil: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar datos actuales con token
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const res = await fetch("/api/cliente/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth/login");
            return;
          }
          throw new Error(data.error || "Error al cargar datos");
        }

        setForm({
          nombre: data.nombre || "",
          apellidos: data.apellidos || "",
          correo: data.correo || "",
          telefono: data.telefono || "",
          foto_perfil: data.foto_perfil || "",
        });
      } catch (err: any) {
        setError("Error al cargar datos");
      }
    };

    cargarPerfil();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/cliente", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar");
      }

      setSuccess("Perfil actualizado correctamente");

      setTimeout(() => {
        router.push("/cuenta");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
        <div className="max-w-7xl mx-auto px-8 py-6">
        <h1 className="text-3xl font-semibold text-center">Editar Perfil</h1>
        <p className="text-gray-600 mt-2 text-center">Actualiza tu información personal</p>
      </div>

      <div className="flex flex-1 w-full max-w-7xl mx-50">
        
        <SidebarCuenta />

        <div className="flex-1 px-40 bg-gray-50">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-10">
            <div className="space-y-10 text-lg">

              {form.foto_perfil && (
                <div className="flex justify-center mb-10">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-gray-200">
                    <img
                      src={form.foto_perfil}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">Nombre</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4 text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">Apellidos</label>
                    <input
                      name="apellidos"
                      value={form.apellidos}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-2xl px-6 py-4 text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">Correo electrónico</label>
                  <input
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-2xl px-6 py-4 text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3">Teléfono</label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 951 123 4567"
                    className="w-full border border-gray-300 rounded-2xl px-6 py-4 text-base focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-900 active:bg-gray-950 text-white font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando cambios...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-red-600 bg-red-50 border border-red-100 text-center py-3.5 rounded-2xl font-medium">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-green-600 bg-green-50 border border-green-100 text-center py-3.5 rounded-2xl font-medium">
                    {success}
                  </p>
                )}
              </div>

              {/* Botón Cancelar */}
              <button
                onClick={() => router.push("/cuenta")}
                className="mt-4 w-full border border-gray-300 hover:bg-gray-50 active:bg-gray-100 py-4 rounded-2xl font-medium transition-all duration-200 text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}