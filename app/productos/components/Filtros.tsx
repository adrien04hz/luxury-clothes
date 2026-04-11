/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 * 10 de abril de 2026
 */
"use client";

import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    categorias: any[];
    generos: any[];
    colores: any[];
    marcas: any[];
}

export default function Filtros({ categorias, generos, colores, marcas }: Props) {
    const [open, setOpen] = useState(false);
    const [activo, setActivo] = useState<string | null>(null);

    function getColor(nombre: string) {
        switch (nombre.toLowerCase()) {
            case "negro":
                return "black";
            case "blanco":
                return "white";
            case "rojo":
                return "red";
            case "azul":
                return "blue";
            case "verde":
                return "green";
            case "amarillo":
                return "yellow";
            case "gris":
                return "gray";
            case "naranja":
                return "orange";
            case "rosa":
                return "pink";
            case "morado":
                return "purple";
            case "café":
            case "cafe":
                return "#92400e";
            case "beige":
                return "#f5f5dc";
            default:
                return "lightgray";
        }
    }
    const router = useRouter();
    const searchParams = useSearchParams();

    function aplicarFiltro(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());

        params.set(key, value);

        if (!params.get("q")) {
            const q = searchParams.get("q");
            if (q) params.set("q", q);
        }

        router.push(`/productos/buscar?${params.toString()}`);
    }

    function limpiarFiltros() {
        const params = new URLSearchParams();

        const q = searchParams.get("q");

        if (q) {
            params.set("q", q);
        }

        router.push(`/productos/buscar?${params.toString()}`);
    }

    return (

        <>
            <button onClick={() => setOpen(true)} className="text-blue-600 text-sm font-medium hover:underline">
                Filtrar y ordenar
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
                    <div className="w-[350px] bg-white h-full p-6 overflow-y-auto">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">
                                Filtrar y ordenar
                            </h2>
                            <button onClick={() => setOpen(false)}>
                                <X />
                            </button>
                        </div>

                        {/* SECCIONES */}
                        {/* seccion de orden */}
                        <FiltroItem title="Ordenar por" open={activo === "orden"} onToggle={() => setActivo(activo === "orden" ? null : "orden")}>
                            <p className="text-sm cursor-pointer" onClick={() => aplicarFiltro("orden", "precio_asc")}>Precio menor a mayor</p>
                            <p className="text-sm cursor-pointer" onClick={() => aplicarFiltro("orden", "precio_desc")}>Precio mayor a menor</p>
                        </FiltroItem>

                        {/* seccion de categoria */}
                        <FiltroItem title="Categoría" open={activo === "categoria"} onToggle={() => setActivo(activo === "categoria" ? null : "categoria")}>
                            {
                                categorias.map((c) => (
                                    <div key={c.id}>
                                        <p className="text-sm font-medium">
                                            {c.name}
                                        </p>
                                        {
                                            c.subcategories.map((s: any) => (
                                                <p key={s.id} className="text-xs ml-3 text-gray-500 cursor-pointer" onClick={() => aplicarFiltro("categoria", s.id)}>
                                                    {s.nombre}
                                                </p>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </FiltroItem>

                        {/* seccion de genero */}
                        <FiltroItem title="Género" open={activo === "género"} onToggle={() => setActivo(activo === "género" ? null : "género")}>
                            {generos?.map((c) => (
                                <div key={c.id}>
                                    <p className="text-sm font-medium cursor-pointer" onClick={() => aplicarFiltro("genero", c.id.toString())}>
                                        {c.nombre}
                                    </p>
                                </div>
                            ))}
                        </FiltroItem>

                        {/* seccion de Color */}
                        <FiltroItem title="Color" open={activo === "color"} onToggle={() => setActivo(activo === "color" ? null : "color")}>
                            <div className="flex gap-6 flex-wrap">
                                {colores?.map((color) => (
                                    <div key={color.id} className="flex flex-col items-center">
                                        <div
                                            className="w-10 h-10 rounded-full border cursor-pointer hover:scale-110 transition"
                                            style={{ backgroundColor: getColor(color.nombre) }}
                                            onClick={() => aplicarFiltro("color", color.id.toString())}
                                        ></div>
                                        <span className="text-xs mt-2 text-gray-700">
                                            {color.nombre}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </FiltroItem>

                        <FiltroItem title="Marcas" open={activo === "marca"} onToggle={() => setActivo(activo === "marca" ? null : "marca")}>
                            {marcas?.map((c) => (
                                <div key={c.id}>
                                    <p className="text-sm font-medium cursor-pointer" onClick={() => aplicarFiltro("marca", c.id.toString())}>
                                        {c.nombre}
                                    </p>
                                </div>
                            ))}
                        </FiltroItem>

                        <div className="mt-6 space-y-4">
                            <button onClick={limpiarFiltros} className="text-sm underline">
                                Borrar todo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* componente del debplegable de los campos de filtro */
function FiltroItem({ title, open, onToggle, children }: any) {
    return (
        <div className="border-b py-4">

            {/* HEADER */}
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={onToggle}
            >
                <span>{title}</span>
                {open ? <Minus size={16} /> : <Plus size={16} />}
            </div>

            {open && (
                <div className="mt-3 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
}