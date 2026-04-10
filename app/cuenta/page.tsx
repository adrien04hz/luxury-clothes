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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

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

  const handleDesactivarCuenta = async () => {
    setDeactivating(true);
    try {
      const res = await fetch("/api/cliente", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo desactivar la cuenta");
      }

      alert("Tu cuenta ha sido desactivada correctamente.");
      router.push("/auth/login"); // Redirigir al login después de desactivar
    } catch (err: any) {
      alert(err.message || "Ocurrió un error al desactivar la cuenta");
    } finally {
      setDeactivating(false);
      setShowDeleteModal(false);
    }
  };

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

        <div className="mt-10 flex flex-col gap-3">
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

          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-6 text-red-600 hover:text-red-700 font-medium py-3 border border-red-300 hover:border-red-400 rounded-lg transition"
          >
            Eliminar Mi Cuenta
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">¿Deseas eliminar tu cuenta?</h2>

            <p className="text-gray-600 mb-6">
              Esta acción <strong>eliminará</strong> tu cuenta de forma permanente. No podrás iniciar sesión ni recuperar tus datos.
              <br /><br />
              ¿Estás seguro de continuar?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                disabled={deactivating}
              >
                Cancelar
              </button>
              <button
                onClick={handleDesactivarCuenta}
                disabled={deactivating}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-70"
              >
                {deactivating ? "Desactivando..." : "Sí, Desactivar Cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}