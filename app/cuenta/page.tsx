// # detalles de usuario
//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Ramos Bello Jose Luis */
//* Fecha: 09/04/2026 */
//**********/
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await fetch("/api/cliente/perfil", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al cargar el perfil");
        }

        setPerfil(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando perfil...</div>;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.push("/auth/login")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Volver al Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Mi Perfil</h1>

        {perfil?.foto_perfil && (
          <div className="flex justify-center mb-6">
            <img
              src={perfil.foto_perfil}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
            />
          </div>
        )}

        <div className="space-y-5 text-lg">
          <div>
            <p className="text-gray-500 text-sm">Nombre</p>
            <p className="font-semibold">{perfil?.nombre} {perfil?.apellidos}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Correo electrónico</p>
            <p className="font-semibold">{perfil?.correo}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Teléfono</p>
            <p className="font-semibold">{perfil?.telefono || "No registrado"}</p>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button
            onClick={() => router.push("/cuenta/configuracion")}
            className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Editar Perfil
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 border border-gray-400 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}