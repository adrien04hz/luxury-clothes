"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    const obtenerPerfil = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      try {
        const res = await fetch("/api/cliente/perfil", {
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

        if (!res.ok) throw new Error();

        const data = await res.json();
        setPerfil(data);
      } catch (err) {
        console.error(err);
        alert("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando perfil...
      </div>
    );
  }

  const handleDesactivarCuenta = async () => {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta?")) return;

    setDeactivating(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/cliente", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      alert("Cuenta eliminada correctamente");

      localStorage.removeItem("token");
      localStorage.removeItem("userID");

      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cuenta");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-semibold text-center">Mi cuenta</h1>
          <p className="text-center text-gray-600 mt-1 text-lg">
            Bienvenido <span className="font-medium text-gray-900">{perfil?.nombre || "nombre_cliente"}</span>
          </p>
        </div>

      <div className="flex flex-1 w-full max-w-7xl px-50">
        {/* Sidebar Izquierda */}
        <div className="w-60 flex-shrink-0">
          <nav className="flex flex-col">
            <a
              href="/"
              className="px-2 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b hover:border-gray-300 transition"
            >
              Inicio
            </a>
            <a
              href="/cuenta/"
              className="px-2 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b hover:border-gray-300 transition"
            >
              Mi información
            </a>
            <a
              href="/cuenta/pedidos"
              className="px-2 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b hover:border-gray-300 transition"
            >
              Mis compras
            </a>
            <a
              href="/cuenta/listadedeseos"
              className="px-2 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b hover:border-gray-300 transition"
            >
              Mi lista de deseo
            </a>
            <a
              href="/cuenta/direcciones"
              className="px-2 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b hover:border-gray-300 transition"
            >
              Mis direcciones
            </a>
            <a
              href="/cuenta/metodosdepago"
              className="px-2 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b hover:border-gray-300 transition"
            >
              Mis métodos de pago
            </a>
            <a
              href="/cuenta/configuracion"
              className="px-2 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b hover:border-gray-300 transition"
            >
              Configuracion
            </a>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userID");
                router.push("/");
              }}
              className="px-2 py-3 text-left text-red-600 border-b hover:bg-red-50 font-medium transition"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>

        <div className="flex-1 px-40 bg-gray-50">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-10">
            {/* Foto de perfil (si existe) */}
            {perfil?.foto_perfil && (
              <div className="flex justify-center mb-8">
                <img
                  src={perfil.foto_perfil}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
            )}

            <div className="space-y-10 space-x-100 text-lg">
              <div>
                <p className="text-gray-500 text-sm mb-1">Nombre(s)</p>
                <p className="font-semibold text-xl">{perfil?.nombre}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Apellidos</p>
                <p className="font-semibold text-xl">{perfil?.apellidos}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Correo electrónico</p>
                <p className="font-semibold text-xl">{perfil?.correo}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Teléfono</p>
                <p className="font-semibold text-xl">
                  {perfil?.telefono || "No registrado"}
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDesactivarCuenta}
                disabled={deactivating}
                className="flex-1 py-3.5 rounded-xl border border-black text-black hover:bg-gray-50 transition font-medium disabled:opacity-70"
              >
                {deactivating ? "Eliminando cuenta..." : "Eliminar cuenta"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}