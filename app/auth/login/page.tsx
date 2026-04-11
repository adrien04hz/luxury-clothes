//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 10/04/2026 */
//**********/

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginRequest, LoginResponse } from "@/types/auth/login/login";

export default function LoginPage() {

  const router = useRouter();

  const [form, setForm] = useState<LoginRequest>({
    correo: "",
    contrasena: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

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
  
      if (!payload.id) {
        throw new Error("Token sin ID");
      }
  
      localStorage.setItem("userID", payload.id.toString());
  
      router.push("/");
  
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
          Login
        </h1>

        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          type="email"
          placeholder="Correo"
          value={form.correo}
          onChange={(e) =>
            setForm({ ...form, correo: e.target.value })
          }
        />

        <div className="relative mb-4">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            type="password"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={(e) =>
              setForm({ ...form, contrasena: e.target.value })
            }
          />
        </div>

        <button
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        <button
          className="w-full bg-gray-300 text-black py-3 rounded-lg font-medium mt-3 hover:bg-gray-400 transition"
          onClick={() => router.push("/auth/registro")}
        >
          Registrarse
        </button>

        {mensaje && (
          <p className="mt-4 text-red-500 text-sm text-center">
            {mensaje}
          </p>
        )}

      </div>
    </div>
  );
}