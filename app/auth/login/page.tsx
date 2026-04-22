//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 21/04/2026 */
//**********/

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import type { LoginRequest, LoginResponse } from "@/types/auth/login/login";

export default function LoginPage() {

  const router = useRouter();

  const [form, setForm] = useState<LoginRequest>({
    correo: "",
    contrasena: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleLogin = async () => {
    setMensaje("");
    setLoading(true);
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      const data: LoginResponse = await res.json();
  
      if (!res.ok) {
        throw new Error((data as any).error || "Error al iniciar sesión");
      }
  
      localStorage.setItem("token", data.token);
  
      if (!data.token) {
        throw new Error("No se recibió token");
      }
  
      const base64Payload = data.token.split(".")[1];
  
      if (!base64Payload) {
        throw new Error("Token inválido");
      }
  
      const payload = JSON.parse(atob(base64Payload));

      console.log("Payload del token:", payload);
  
      if (!payload.id) {
        throw new Error("Token sin ID");
      }
  
      localStorage.setItem("userID", payload.id.toString());
  
      const rol = payload.rol;
      localStorage.setItem("rol", rol.toString());

      if (rol === 1) {
        // Cliente
        router.push("/");
      } else if (rol === 2) {
        // Administrador
        router.push("/admin");
      } else if (rol === 3) {
        // Repartidor
        router.push("/logistica");
      } else if (rol === 4) {
        // Empacador
        router.push("/logistica");
      } else {
        router.push("/");
      }
  
    } catch (error: any) {
      setMensaje(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        
        <h1 className="text-2xl font-semibold text-center mb-6">
          Iniciar sesión
        </h1>

        <div className="relative mb-4">
          <input
            type="email"
            id="correo"
            placeholder=" "
            value={form.correo}
            onChange={(e) =>
              setForm({ ...form, correo: e.target.value })
            }
            className="peer w-full p-3 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />

          <label
            htmlFor="correo"
            className="absolute left-3 top-3 text-gray-500 text-sm transition-all
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400
            peer-focus:top-[-10px]
            peer-focus:text-sm
            peer-focus:text-black

            peer-not-placeholder-shown:top-[-10px]
            peer-not-placeholder-shown:text-sm
            peer-not-placeholder-shown:text-black
            bg-white px-1"
          >
            Correo
          </label>
        </div>

        <div className="relative mb-4">
          <input
            type={mostrarPassword ? "text" : "password"}
            id="contrasena"
            placeholder=" "
            value={form.contrasena}
            onChange={(e) =>
              setForm({ ...form, contrasena: e.target.value })
            }
            className="peer w-full p-3 pr-12 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />

          <label
            htmlFor="contrasena"
            className="absolute left-3 top-3 text-gray-500 text-sm transition-all
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400
            peer-focus:top-[-10px]
            peer-focus:text-sm
            peer-focus:text-black

            peer-not-placeholder-shown:top-[-10px]
            peer-not-placeholder-shown:text-sm
            peer-not-placeholder-shown:text-black
            bg-white px-1"
          >
            Contraseña
          </label>

          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
          >
            {mostrarPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

        </div>

        <button
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline font-medium"
            onClick={() => router.push("/auth/registro")}
          >
            Registrarse
          </span>
        </p>

        {mensaje && (
          <p className="mt-4 text-red-500 text-sm text-center">
            {mensaje}
          </p>
        )}

      </div>
    </div>
  );
}
