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
    <div className="min-h-screen bg-gray-100 flex">

      <div className="flex-1 p-6">

        <h1 className="text-3xl font-bold text-center mb-8">
          Mi Cuenta
        </h1>

        {perfil?.foto_perfil && (
          <div className="flex justify-center mb-6">
            <img
              src={perfil.foto_perfil}
              alt="Foto"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
          </div>
        )}

        <div className="space-y-5 text-lg">
          <div>
            <p className="text-gray-500 text-sm">Nombre(s)</p>
            <p className="font-semibold">
              {perfil?.nombre}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Apellidos</p>
            <p className="font-semibold">
              {perfil?.apellidos}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Correo</p>
            <p className="font-semibold">{perfil?.correo}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Teléfono</p>
            <p className="font-semibold">
              {perfil?.telefono || "No registrado"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
          >
            Volver al inicio
          </button>

          {/* Acciones peligrosas */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDesactivarCuenta}
              disabled={deactivating}
              className="w-full py-3 rounded-xl border border-red-400 text-red-600 hover:bg-red-50 transition font-medium disabled:opacity-60"
            >
              {deactivating ? "Eliminando cuenta..." : "Eliminar cuenta"}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userID");
                router.push("/");
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
            >
              Cerrar sesión
            </button>

          </div>
        </div>
      </div>

      <div className="w-72 bg-white shadow-lg p-6 border-l flex flex-col gap-4">

        <button
          onClick={() => router.push("/cuenta/pedidos")}
          className="text-left p-3 rounded-lg hover:bg-gray-100 transition"
        >
          Pedidos
        </button>

        <button
          onClick={() => router.push("/cuenta/metodosdepago")}
          className="text-left p-3 rounded-lg hover:bg-gray-100 transition"
        >
          Métodos de Pago
        </button>

        <button
          onClick={() => router.push("/cuenta/direcciones")}
          className="text-left p-3 rounded-lg hover:bg-gray-100 transition"
        >
          Direcciones de envío
        </button>
        <button
          onClick={() => router.push("/cuenta/listadedeseos")}
          className="text-left p-3 rounded-lg hover:bg-gray-100 transition"
        >
          Lista de deseos
        </button>
        <button
          onClick={() => router.push("/cuenta/configuracion")}
          className="text-left p-3 rounded-lg hover:bg-gray-100 transition"
        >
          Configuracion
        </button>
      </div>
    </div>
  );
}