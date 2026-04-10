// # Gestión de la cuenta
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
//**********/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        router.push("/perfil");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Editar Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black"
          />
          <input
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            placeholder="Apellidos"
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black"
          />
          <input
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black"
          />
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black"
          />
          <input
            name="foto_perfil"
            value={form.foto_perfil}
            onChange={handleChange}
            placeholder="URL de foto de perfil (opcional)"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-70"
          >
            {loading ? "Guardando cambios..." : "Guardar Cambios"}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}
        </form>

        <button
          onClick={() => router.push("/cuenta")}
          className="mt-6 w-full border border-gray-400 py-3 rounded-lg hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}