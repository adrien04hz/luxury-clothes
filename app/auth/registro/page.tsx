// # Registro de nuevo usuario (cliente)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        nombre: "",
        apellidos: "",
        correo: "",
        contrasena: "",
        telefono: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: any) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error);
        }

        // Si hay registro exitoso -> ir a login
        router.push("/auth/login");
        } catch (err: any) {
        setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Registro</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
            <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            required
            />
            <input
            name="apellidos"
            placeholder="Apellidos"
            onChange={handleChange}
            required
            />
            <input
            name="correo"
            placeholder="Correo"
            onChange={handleChange}
            required
            />
            <input
            name="contrasena"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            />
            <input name="telefono" placeholder="Teléfono" onChange={handleChange} />

            <button type="submit" className="bg-black text-white p-2">
            Registrarse
            </button>

            {error && <p className="text-red-500">{error}</p>}
        </form>
        </div>
    );
}
