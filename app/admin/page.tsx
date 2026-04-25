//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
//**********/
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminInicio() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch("/api/administrador/dashboard");
        const data = await res.json();
        setDashboard(data);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Cargando dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6 md:p-10">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Resumen del sistema
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Vista general de actividad
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm mb-1">Ventas totales</p>
            <h2 className="text-3xl font-bold text-gray-800">
              ${Number(dashboard?.ventas || 0).toLocaleString("es-MX") || 0}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-gray-500 text-sm mb-1">Usuarios activos</p>
            <h2 className="text-3xl font-bold text-gray-800">
              {dashboard?.usuariosActivos || 0}
            </h2>
          </div>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Top productos
            </h3>

            <ul className="space-y-3">
              {dashboard?.topProductos?.length > 0 ? (
                dashboard.topProductos.map((producto: any, i: number) => (
                  <li
                    key={producto.id}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold mr-2">#{i + 1}</span>
                      {producto.nombre}
                    </span>

                    <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">
                      {producto.total_vendidos} ventas
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Sin datos</p>
              )}
            </ul>
          </div>

          {/* USUARIOS RECIENTES */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border lg:col-span-2">

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Usuarios recientes
              </h3>
              <span className="text-sm text-gray-400">
                Últimos registros
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-3 font-medium">Usuario</th>
                    <th className="py-3 font-medium">Correo</th>
                    <th className="py-3 font-medium text-right">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard?.usuariosRecientes?.length > 0 ? (
                    dashboard.usuariosRecientes.map((user: any) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        {/* Usuario */}
                        <td className="py-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-black to-gray-800 text-white flex items-center justify-center font-semibold">
                            {user.nombre?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {user.nombre}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {user.id}
                            </p>
                          </div>
                        </td>

                        {/* Correo */}
                        <td className="py-3 text-gray-600">
                          {user.correo}
                        </td>

                        {/* Estado */}
                        <td className="py-3 text-right">
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                            Activo
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-6 text-gray-400"
                      >
                        No hay usuarios recientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}