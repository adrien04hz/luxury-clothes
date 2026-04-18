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

export default function FormularioDireccion(
  { 
    isOpen, 
    onClose, 
    onSubmit, 
    selectedDireccion
  }: Props) {

  const [telefono, setTelefono] = useState("");
  const isEditing = !!selectedDireccion;

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    calle: "",
    colonia: "",
    numero_exterior:"",
    numero_interior: "",
    ciudad: "",
    codigo_postal: "",
    estado: "",
  })
  //fetch para agregar una direccion de envio
 const createDireccion = async (direccion: any) => {
  try {
    const res = await fetch("/api/direcciondeenvio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(direccion),
    });

    if (!res.ok) {
  const text = await res.text();
  console.error("RAW ERROR:", text);
  return;
}

    const newDireccion = await res.json();

    onSubmit(newDireccion);
    onClose();

  } catch (error) {
    console.error("Error fetch:", error);
  }
};

  useEffect(() => {
    if (selectedDireccion) {
      setForm(selectedDireccion);

      if (selectedDireccion.telefono) {
        const clean = selectedDireccion.telefono
          .replace("+52", "")
          .replace(/\s/g, "");

        setTelefono(clean);
      }
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
          onSubmit={(e) => {
              e.preventDefault();

              const data = {
                ...form
              };
              console.log("DATA ENVIADA:", data);

              createDireccion(data);
            }}
        >

          {/* Nombre / Apellido */}
          <div className="grid grid-cols-2 gap-4">
            
            <div className="relative">
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={(e) =>
                  setForm({ ...form, nombre: e.target.value })
                }
                placeholder=" " required
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
              <input id="apellido" type="text" 
                value={form.apellido}
                onChange={(e) =>
                  setForm({ ...form, apellido: e.target.value })
                }
                placeholder=" " required
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
          
           {/* Calle */}
          <div className="relative">
            <input id="calle" type="text" 
              value={form.calle}
              onChange={(e) =>
                setForm({ ...form, calle: e.target.value })
              }
              placeholder=" " required
              className="peer border border-gray-600 p-3 rounded-md w-full" />
            <label htmlFor="calle"
              className="absolute left-3 top-3 text-gray-400 transition-all
              peer-placeholder-shown:top-3
              peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
              peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
              bg-white px-1">
              Calle*
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <input id="colonia" type="text"
              value={form.colonia}
              onChange={(e) =>
                setForm({ ...form, colonia: e.target.value })
              }
              placeholder=" " required
                className="peer border border-gray-600 p-3 rounded-md w-full" />
              <label htmlFor="colonia"
                className="absolute left-3 top-3 text-gray-400 transition-all
                peer-placeholder-shown:top-3
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
                peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
                bg-white px-1">
                Colonia*
              </label>
            </div>
            <div className="relative">
              <input id="numero_exterior" type="text"
              value={form.numero_exterior}
              onChange={(e) =>
                setForm({ ...form, numero_exterior: e.target.value })
              }
              placeholder=" " required
                className="peer border border-gray-600 p-3 rounded-md w-full" />
              <label htmlFor="numero_exterior"
                className="absolute left-3 top-3 text-gray-400 transition-all
                peer-placeholder-shown:top-3
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
                peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
                bg-white px-1">
                No. exterior*
              </label>
            </div>
            <div className="relative">
              <input id="numero_interior" type="text"
              value={form.numero_interior}
              onChange={(e) =>
                setForm({ ...form, numero_interior: e.target.value })
              }
              placeholder=" "
                className="peer border border-gray-600 p-3 rounded-md w-full" />
              <label htmlFor="numero_interior"
                className="absolute left-3 top-3 text-gray-400 transition-all
                peer-placeholder-shown:top-3
                peer-focus:-top-2 peer-focus:text-sm peer-focus:text-black
                peer-valid:-top-2 peer-valid:text-sm peer-valid:text-black
                bg-white px-1">
                No. interior*
              </label>
            </div>

          </div>

          {/* Ciudad / codigo_postal */}
          <div className="grid grid-cols-2 gap-6">

            <div className="relative">
              <input id="ciudad" type="text" 
              value={form.ciudad}
              onChange={(e) =>
                setForm({ ...form, ciudad: e.target.value })
              }
              placeholder=" " required
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
              <input id="codigo_postal" type="text" 
              value={form.codigo_postal}
              onChange={(e) =>
                setForm({ ...form, codigo_postal: e.target.value })
              }
              placeholder=" " required
                className="peer border border-gray-600 p-3 rounded-md w-full" />
              <label htmlFor="codigo_postal"
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

           <select
              value={form.estado}
              onChange={(e) =>
                setForm({ ...form, estado: e.target.value })
              }
              required
              className="border border-gray-600 p-3 rounded-md w-full bg-white"
            >
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
                setForm({
                  ...form,
                  telefono: value,
                });
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