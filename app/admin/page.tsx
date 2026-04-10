//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor: Ramos Bello Jose Luis */
//* Fecha: 10/04/2026 */
//**********/
"use client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const menuItems = [
    { 
      nombre: "Categorías", 
      ruta: "/admin/categorias", 
      icon: "",
      descripcion: "Gestionar categorías de productos"
    },
    { 
      nombre: "Clientes", 
      ruta: "/admin/clientes", 
      icon: "",
      descripcion: "Ver y gestionar clientes"
    },
    { 
      nombre: "Marcas", 
      ruta: "/admin/marcas", 
      icon: "",
      descripcion: "Administrar marcas"
    },
    { 
      nombre: "Pedidos", 
      ruta: "/admin/pedidos", 
      icon: "",
      descripcion: "Ver y gestionar pedidos"
    },
    { 
      nombre: "Productos", 
      ruta: "/admin/productos", 
      icon: "",
      descripcion: "Gestionar catálogo de productos"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.nombre}
              onClick={() => router.push(item.ruta)}
              className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {item.nombre}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.descripcion}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}