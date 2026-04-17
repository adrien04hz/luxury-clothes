"use client";
import { useEffect, useState } from "react";
import { Estados } from "@/types/direccionesenvio/DireccionesEnvio";
import { X } from "lucide-react"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedDireccion?: any | null;
}

export default function FormularioDireccion({ isOpen, onClose, onSubmit, selectedDireccion}: Props) {
  const [telefono, setTelefono] = useState("");
  const isEditing = !!selectedDireccion;

  useEffect(() => {
    if (selectedDireccion?.telefono) {
      setTelefono(
        selectedDireccion.telefono.replace("+52", "").replace(/\s/g, "")
      );
    } else {
      setTelefono("");
    }
  }, [selectedDireccion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      
      <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative max-h-[80vh] overflow-y-auto shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-12 right-8 text-gray-900 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-medium mt-4 mb-8">
          {isEditing ? "Editar dirección" : "Agregar dirección" }
        </h2>

        <form 
          className="space-y-6" 
          onSubmit={(e) => {e.preventDefault();

            onSubmit({
              nombre: (document.getElementById("nombre") as HTMLInputElement)?.value,
              apellido: (document.getElementById("apellido") as HTMLInputElement)?.value,
              direccion: (document.getElementById("direccion") as HTMLInputElement)?.value,
              ciudad: (document.getElementById("ciudad") as HTMLInputElement)?.value,
              cp: (document.getElementById("cp") as HTMLInputElement)?.value,
              estado: (document.querySelector("select") as HTMLSelectElement)?.value,
              telefono: "+52 " + telefono.replace(/\s/g, ""),
              isEditing,
            });

          }}
          
        >

          {/* Nombre / Apellido */}
          <div className="grid grid-cols-2 gap-4">
            
            <div className="relative">
              <input id="nombre" type="text" defaultValue={selectedDireccion?.nombre} placeholder=" " required
                className="peer border border-gray-600 p-3 rounded-md w-full" />
              <label htmlFor="nombre"
                className="absolute left-3 top-3 text-gray-400 transition-all
                peer-placeholder-shown:top-3
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
                peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
                bg-white px-1">
                Nombre*
              </label>
            </div>

            <div className="relative">
              <input id="apellido" type="text" defaultValue={selectedDireccion?.apellido} placeholder=" " required
                className="peer border border-gray-600 p-3 rounded-md w-full" />
              <label htmlFor="apellido"
                className="absolute left-3 top-3 text-gray-400 transition-all
                peer-placeholder-shown:top-3
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
                peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
                bg-white px-1">
                Apellido*
              </label>
            </div>

          </div>

          {/* Dirección */}
          <div className="relative">
            <input id="direccion" type="text" defaultValue={selectedDireccion?.direccion} placeholder=" " required
              className="peer border border-gray-600 p-3 rounded-md w-full" />
            <label htmlFor="direccion"
              className="absolute left-3 top-3 text-gray-400 transition-all
              peer-placeholder-shown:top-3
              peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
              peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
              bg-white px-1">
              Dirección*
            </label>
          </div>

          {/* Apartamento */}
         <div className="relative">
            <input
              id="apartamento"
              type="text"
              placeholder=" "
              className="peer border border-gray-600 p-3 rounded-md w-full"
            />

            <label
              htmlFor="apartamento"
              className="absolute left-3 top-3 text-gray-400 transition-all
              peer-placeholder-shown:top-3
              peer-placeholder-shown:text-gray-400
              peer-focus:-top-2
              peer-focus:text-sm
              peer-focus:text-black
              peer-not-placeholder-shown:-top-2
              peer-not-placeholder-shown:text-sm
              peer-not-placeholder-shown:text-black
              bg-white px-1"
            >
              Apartamento, suite, edificio
            </label>
          </div>

          {/* Ciudad / CP */}
          <div className="grid grid-cols-2 gap-6">

            <div className="relative">
              <input id="ciudad" type="text" defaultValue={selectedDireccion?.ciudad} placeholder=" " required
                className="peer border border-gray-600 p-3 rounded-md w-full" />
              <label htmlFor="ciudad"
                className="absolute left-3 top-3 text-gray-400 transition-all
                peer-placeholder-shown:top-3
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
                peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
                bg-white px-1">
                Ciudad*
              </label>
            </div>

            <div className="relative">
              <input id="cp" type="text" defaultValue={selectedDireccion?.cp} placeholder=" " required
                className="peer border border-gray-600 p-3 rounded-md w-full" />
              <label htmlFor="cp"
                className="absolute left-3 top-3 text-gray-400 transition-all
                peer-placeholder-shown:top-3
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
                peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
                bg-white px-1">
                Código postal*
              </label>
            </div>

          </div>

          {/* Estado / País */}
          <div className="grid grid-cols-2 gap-4">

            <select defaultValue="" required
              className="border border-gray-600 p-3 rounded-md w-full bg-white">
              <option value="" disabled>Estado*</option>
              {Estados.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>

            <div className="border border-gray-600 p-3 rounded-md bg-gray-50 text-gray-500">
              México
            </div>

          </div>

          {/* Teléfono */}
         <div className="relative">
  
          {/* input con prefijo */}
          <div className="flex items-center border border-gray-600 rounded-md overflow-hidden">
            
            <span className="px-3 text-gray-600 bg-gray-100 border-r border-gray-300">
              +52
            </span>

            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ""); // solo números
                value = value.slice(0, 10); // máximo 10 dígitos

                // formato 3-3-4 => 953 174 2001
                let formatted = value;

                if (value.length > 3 && value.length <= 6) {
                  formatted = value.slice(0, 3) + " " + value.slice(3);
                } else if (value.length > 6) {
                  formatted =
                    value.slice(0, 3) +
                    " " +
                    value.slice(3, 6) +
                    " " +
                    value.slice(6);
                }

                setTelefono(formatted);
              }}
              placeholder="953 174 2001"
              className="peer p-3 w-full outline-none"
            />
          </div>

          {/* LABEL FLOATING */}
          <label
            htmlFor="telefono"
            className="absolute left-3 -top-2 text-sm text-black bg-white px-1"
          >
            Número de teléfono*
          </label>
        </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <input type="checkbox" id="default" className="mt-1 h-4 w-4 accent-black" />
            <label htmlFor="default" className="text-sm text-gray-600 cursor-pointer">
              Establecer como dirección de envío predeterminada
            </label>
          </div>

         {/* BOTONES */}
          <div className="flex justify-end  items-center pt-6">

            {/* ELIMINAR */}
            {isEditing && (
              <button
                type="button"
                onClick={() => console.log("Eliminar dirección")}
                className="bg-white text-red-500 border border-red-500 px-6 py-3 rounded-full font-medium hover:bg-red-50 transition"
              >
                Eliminar
              </button>
            )}
            <p className="p-2"></p>

            
            {/* GUARDAR */}
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-full font-medium hover:opacity-80 transition"
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}