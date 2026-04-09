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

      router.push("/");

    } catch (error: any) {
      setMensaje(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-80 p-6 shadow-lg rounded-2xl">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          className="w-full mb-3 p-2 border rounded"
          type="email"
          placeholder="Correo"
          value={form.correo}
          onChange={(e) =>
            setForm({ ...form, correo: e.target.value })
          }
        />

        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Contraseña"
          value={form.contrasena}
          onChange={(e) =>
            setForm({ ...form, contrasena: e.target.value })
          }
        />

        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>

        {mensaje && (
          <p className="mt-3 text-red-500 text-sm text-center">
            {mensaje}
          </p>
        )}

      </div>
    </div>
  );
}