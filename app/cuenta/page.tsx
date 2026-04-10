"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    const obtenerPerfil = async () => {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token); // 🔍 DEBUG

      // Si no hay token → redirigir
      if (!token) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      try {
        const res = await fetch("/api/cliente/perfil", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userID");
          router.push("/auth/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Error al cargar el perfil");
        }

        const data = await res.json();
        setPerfil(data);
      } catch (err) {
        console.error("ERROR PERFIL:", err);
        alert("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, [router]);

  // 🔥 Redirección correcta (NO en render directo)
  useEffect(() => {
    if (!loading && !perfil) {
      router.push("/auth/login");
    }
  }, [loading, perfil, router]);

  // Pantalla de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando perfil...
      </div>
    );
  }

  const handleDesactivarCuenta = async () => {
    setDeactivating(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/cliente", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (!res.ok) {
        throw new Error("No se pudo desactivar la cuenta");
      }

      alert("Tu cuenta ha sido desactivada correctamente.");

      localStorage.removeItem("token");
      localStorage.removeItem("userID");

      router.push("/auth/login");
    } catch (err) {
      console.error("ERROR DELETE:", err);
      alert("Ocurrió un error al desactivar la cuenta");
    } finally {
      setDeactivating(false);
      setShowDeleteModal(false);
    }
  };

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
            <p className="font-semibold">
              {perfil?.nombre} {perfil?.apellidos}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Correo electrónico</p>
            <p className="font-semibold">{perfil?.correo}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Teléfono</p>
            <p className="font-semibold">
              {perfil?.telefono || "No registrado"}
            </p>
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
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userID");
              router.push("/");
            }}
            className="mt-6 text-red-600 hover:text-red-700 font-medium py-3 border border-red-300 hover:border-red-400 rounded-lg transition"
          >
            cerrar sesión
          </button>
        </div>
      </div>

      {/* Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              ¿Deseas eliminar tu cuenta?
            </h2>

            <p className="text-gray-600 mb-6">
              Esta acción <strong>eliminará</strong> tu cuenta de forma permanente.
              No podrás iniciar sesión ni recuperar tus datos.
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