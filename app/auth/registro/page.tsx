//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor de la clase: Cervantes Rosales Abdiel */
//* Fecha: 16/04/2026 */
//**********/

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
            <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">

                <h1 className="text-2xl font-semibold text-center mb-6">
                    Registro
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* NOMBRE */}
                    <div className="relative">
                        <input
                            name="nombre"
                            placeholder=" "
                            value={form.nombre}
                            onChange={(e) => {
                                const valor = e.target.value
                                .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "") // solo letras y espacios
                                .toUpperCase(); // convertir a mayúsculas

                                setForm({
                                ...form,
                                nombre: valor,
                                });
                            }}
                            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:top-3
                            peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-400

                            peer-focus:-top-2.5
                            peer-focus:text-sm
                            peer-focus:text-black

                            peer-not-placeholder-shown:-top-2.5
                            peer-not-placeholder-shown:text-sm
                            peer-not-placeholder-shown:text-black

                            bg-white px-1">
                            Nombre
                        </label>
                    </div>

                    {/* APELLIDOS */}
                    <div className="relative">
                        <input
                            name="apellidos"
                            placeholder=" "
                            value={form.apellidos}
                            onChange={(e) => {
                                const valor = e.target.value
                                .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "")
                                .toUpperCase();

                                setForm({
                                ...form,
                                apellidos: valor,
                                });
                            }}
                            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:top-3
                            peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-400

                            peer-focus:-top-2.5
                            peer-focus:text-sm
                            peer-focus:text-black

                            peer-not-placeholder-shown:-top-2.5
                            peer-not-placeholder-shown:text-sm
                            peer-not-placeholder-shown:text-black

                            bg-white px-1">
                            Apellidos
                        </label>
                    </div>

                    {/* CORREO */}
                    <div className="relative">
                        <input
                            name="correo"
                            type="email"
                            placeholder=" "
                            onChange={handleChange}
                            required
                            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:top-3
                            peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-400

                            peer-focus:-top-2.5
                            peer-focus:text-sm
                            peer-focus:text-black

                            peer-not-placeholder-shown:-top-2.5
                            peer-not-placeholder-shown:text-sm
                            peer-not-placeholder-shown:text-black

                            bg-white px-1">
                            Correo
                        </label>
                    </div>

                    {/* CONTRASEÑA */}
                    <div className="relative">
                        <input
                            name="contrasena"
                            type="password"
                            placeholder=" "
                            onChange={handleChange}
                            required
                            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:top-3
                            peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-400

                            peer-focus:-top-2.5
                            peer-focus:text-sm
                            peer-focus:text-black

                            peer-not-placeholder-shown:-top-2.5
                            peer-not-placeholder-shown:text-sm
                            peer-not-placeholder-shown:text-black

                            bg-white px-1">
                            Contraseña
                        </label>
                    </div>

                    {/* TELÉFONO */}
                    <div className="relative">
                    <input
                        name="telefono"
                        type="tel"
                        inputMode="numeric"
                        placeholder=" "
                        value={form.telefono}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setForm({
                            ...form,
                            telefono: valor,
                            });
                        }}
                        className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                        <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all
                            peer-placeholder-shown:top-3
                            peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-400

                            peer-focus:-top-2.5
                            peer-focus:text-sm
                            peer-focus:text-black

                            peer-not-placeholder-shown:-top-2.5
                            peer-not-placeholder-shown:text-sm
                            peer-not-placeholder-shown:text-black

                            bg-white px-1">
                            Teléfono
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
                    >
                        Registrarse
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <p className="text-center text-sm text-gray-600">
                        ¿Ya tienes cuenta?{" "}
                        <span
                            className="text-blue-600 cursor-pointer hover:underline font-medium"
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