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

            router.push("/auth/login");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

                <h1 className="text-2xl font-semibold text-center mb-6">
                    Registro
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        name="nombre"
                        placeholder="Nombre"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    <input
                        name="apellidos"
                        placeholder="Apellidos"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    <input
                        name="correo"
                        placeholder="Correo"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    <input
                        name="contrasena"
                        type="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    <input
                        name="telefono"
                        placeholder="Teléfono"
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    <button
                        type="submit"
                        className="bg-black text-white p-3 rounded-lg mt-2 hover:bg-gray-800 transition"
                    >
                        Registrarse
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <p className="text-center text-sm text-gray-600 mt-2">
                        ¿Ya tienes cuenta?{" "}
                        <span
                            className="text-blue-600 cursor-pointer hover:underline"
                            onClick={() => router.push("/auth/login")}
                        >
                            Inicia sesión
                        </span>
                    </p>

                </form>
            </div>
        </div>
    );
}