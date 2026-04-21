// # Gestion de direcciones (Agregar, Modificar, Eliminar)
//datos estaticos para probar información de direcciones, se eliminaran cuando se integre con la base de datos
"use client";
import { getDirecciones } from "@/client/direccionesenvio";
import { useEffect, useState } from "react";
import FormularioDireccion from "@/app/cuenta/direcciones/components/FormularioDireccion";
import DireccionEnvio from "./components/DireccionEnvio";
import { ListaDireccionEnvio } from "@/types/direccionesenvio/DireccionesEnvio";

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState<ListaDireccionEnvio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDireccion, setSelectedDireccion] =
  useState<ListaDireccionEnvio | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) {
      window.location.href = "/cuenta"; //redireccionamiento a page cuenta
      return;
    }
    loadDireccion();
  }, []);


  const loadDireccion = async () => {
    try {
      const data = await getDirecciones();
      setDirecciones(data.direcciones);
    } catch (error) {
      console.error(error);
    }
  };

  // const loadDireccion = async () => {
  //   try {
  //     const res = await fetch("/api/direcciondeenvio", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
      
  //     const data   = await res.json();
  //     setDirecciones(data.direcciones);
  //   } catch (error) {
  //     console.error(error);
  //   } 
  // }

//   const loadDireccion = async () => {
//   try {
//     const token = localStorage.getItem("token")!;
//     const dirs = await getDirecciones(token);
//     setDirecciones(dirs);
//   } catch (error) {
//     console.error(error);
//   }
// };

  const hasDirecciones = direcciones.length > 0;

  const handleSubmit = (data: any) => {
    if (data.deleted) {
      setDirecciones((prev) =>
        prev.filter((dir) => dir.id !== data.id)

      );
    } else if (data.id) {
      setDirecciones((prev) =>
        prev.map((dir) =>
          dir.id === data.id ? data : dir
        )
      );
    } else {
      setDirecciones((prev) => [...prev, data.direccion]);
    }
  };

  return (
    <div className="pl-16 pt-12 pr-16 pb-12 min-h-screen">
      <h1 className="mb-6 text-2xl font-medium">
        Direcciones de entrega guardadas
      </h1>

      {/* BOTÓN ARRIBA SOLO SI HAY DIRECCIONES */}
      {hasDirecciones && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {setSelectedDireccion(null);setIsModalOpen(true)}}
            className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:opacity-80 transition"
          >
            Agregar nueva
          </button>
        </div>
      )}
      
      {!hasDirecciones ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center pb-40 mt-6">
          <p className="text-gray-700 mt-2 mb-6">
            Actualmente no tienes ninguna dirección de envío guardada. <br /> Agrega
            una dirección aquí para que se complete automáticamente y puedas
            finalizar la compra más rápido.
          </p>

           <button
              onClick={() => {setIsModalOpen(true); setSelectedDireccion(null);}}
              className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:opacity-80 transition"
            >
              Agregar dirección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {direcciones.map((dir, index) => (
            <DireccionEnvio
              key={index}
              direccion={dir}
              onRefresh={loadDireccion}
            />
          ))}
        </div>
      )}

      <FormularioDireccion
        
        key={selectedDireccion ? selectedDireccion.id : isModalOpen ? "open" : "closed"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDireccion(null); // Limpiamos la selección al cerrar
        }}
        onSubmit={handleSubmit}
        selectedDireccion={selectedDireccion}
        allowDelete={true}
      />

    </div>
  );
}
