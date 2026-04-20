/**
 * Equipo #1
 * Diaz Antonio Luis Pedro
 * 6 de febrero de 2026
 * 10 de abril de 2026
 */
"use client";

import { useRef, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CategoriaPorGenero } from "@/types/producto/Categoria";

interface Props {
    categorias: CategoriaPorGenero;
    generos: any[];
    colores: any[];
    marcas: any[];
    title?: string;
    count?: number;
    titulos?: {
        categoria: string;
        subcategoria?: string;
        genero?: string;
    };
}

export default function Filtros({ categorias, generos, colores, marcas, title, count, titulos }: Props) {
    const [open, setOpen] = useState(false);
    const [activo, setActivo] = useState<string | null>(null);

    function getColor(nombre: string) {
        switch (nombre.toLowerCase()) {
            case "negro":
                return "#111111";
            case "blanco":
                return "#F2F1ED";
            case "rojo":
                return "#7A1E1E";
            case "azul":
                return "#0F1A2B";
            case "verde":
                return "#0F3D2E";
            case "amarillo":
                return "#C6A75E";
            case "gris":
                return "#4A4F55";
            case "naranja":
                return "#A65A3A";
            case "rosa":
                return "#B76E79";
            case "morado":
                return "#4B2E3F";
            case "café":
                return "#3B241C";
            case "cafe":
                return "#3B241C";
            case "beige":
                return "#C8B69C";
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

            <div className="flex w-full justify-between items-end">
                <div className="text-3xl font-medium">
                    {
                        titulos && (<p>{titulos?.categoria ? ((titulos.subcategoria ? titulos.subcategoria : titulos.categoria) + " " + (titulos.genero ? "para " + titulos.genero + " (" + count + ")" : "(" + count + ")")) : "Todos los productos (" + count + ")"}</p>)
                    }

                    {
                        title && (
                            <p>{"Resultados para: \"" + title + "\" (" + count + ")"}</p>
                        )
                    }
                </div>
        
                <button onClick={() => setOpen(true)} className="text-sm font-regular hover:underline">
                    <div className="flex items-center space-x-2">
                        <div className="text-xl hover:cursor-pointer">
                            <p>Mostrar Filtros</p>
                        </div>
            
                        <div>
                            <Image
                                src="/assets/images/filter.svg"
                                alt="Filtros"
                                width={27}
                                height={27}
                            />
                        </div>
                    </div>
                </button>
            </div>

    
            <div
            className={`
                fixed inset-0 flex justify-end
                transition-all duration-300
                ${open ? "visible opacity-100" : "invisible opacity-0"}
            `}
            >
                <div className={`
                    absolute inset-0 bg-black/30
                    transition-opacity duration-300
                    ${open ? "opacity-100" : "opacity-0"}
                `}
                onClick={() => setOpen(false)}
                />
                <div
                className={`
                    relative w-87.5 bg-white h-full p-6 overflow-y-auto
                    transform transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
                >

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
                        <div className="text-sm cursor-pointer" onClick={() => aplicarFiltro("orden", "precio_asc")}>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="peer hidden" />

                                <div className="
                                    w-4 h-4 border border-gray-400
                                    peer-checked:bg-black
                                    peer-checked:border-black
                                    transition rounded-sm
                                "></div>

                                <span>Precio menor a mayor</span>
                            </label>
                        </div>
                        <div className="text-sm cursor-pointer" onClick={() => aplicarFiltro("orden", "precio_desc")}>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" className="peer hidden" />

                                <div className="
                                    w-4 h-4 border border-gray-400
                                    peer-checked:bg-black
                                    peer-checked:border-black
                                    transition rounded-sm
                                "></div>

                                <span>Precio mayor a menor</span>
                            </label>
                        </div>
                    </FiltroItem>

                    {/* seccion de categoria */}
                    <FiltroItem title="Categoría" open={activo === "categoria"} onToggle={() => setActivo(activo === "categoria" ? null : "categoria")}>
                        {
                            categorias.data.map((c) => (
                                <div key={c.id_categoria}>
                                    <p className="text-sm font-medium mb-1">
                                        {c.categoria}
                                    </p>
                                    {
                                        c.subcategorias.map((s) => (
                                            <div key={s.id} className="text-sm ml-3 text-gray-500 cursor-pointer" onClick={() => aplicarFiltro("categoria", s.id.toString())}>

                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" className="peer hidden" />

                                                    <div className="
                                                        w-4 h-4 border border-gray-400
                                                        peer-checked:bg-black
                                                        peer-checked:border-black
                                                        transition rounded-sm
                                                    "></div>

                                                    <span>{s.nombre}</span>
                                                </label>
                                                
                                            </div>
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
                                <div className="text-sm font-normal cursor-pointer" onClick={() => aplicarFiltro("genero", c.id.toString())}>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" className="peer hidden" />

                                        <div className="
                                            w-4 h-4 border border-gray-400
                                            peer-checked:bg-black
                                            peer-checked:border-black
                                            transition rounded-sm
                                        "></div>

                                        <span>{c.nombre}</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </FiltroItem>

                    {/* seccion de Color */}
                    <FiltroItem title="Color" open={activo === "color"} onToggle={() => setActivo(activo === "color" ? null : "color")}>
                        <div className=" px-8 mt-4 grid grid-cols-3 gap-x-1 gap-y-6 justify-items-center">
                            {colores?.map((color) => (
                                <div key={color.id} className="flex flex-col items-center  w-fit">
                                    <div
                                        className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition"
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
                                <div className="text-sm font-normal cursor-pointer" onClick={() => aplicarFiltro("marca", c.id.toString())}>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" className="peer hidden" />

                                        <div className="
                                            w-4 h-4 border border-gray-400
                                            peer-checked:bg-black
                                            peer-checked:border-black
                                            transition rounded-sm
                                        "></div>

                                        <span>{c.nombre}</span>
                                    </label>
                                </div>
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
        </>
    );
}

/* componente del debplegable de los campos de filtro */
function FiltroItem({ title, open, onToggle, children }: any) {
    const contentRef = useRef<HTMLDivElement>(null);
    
    return (
        <div className="border-b py-4">

            {/* HEADER */}
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={onToggle}
            >
                <span>{title}</span>
                <div className="transition-transform duration-300">
                    {open ? <Minus size={16} /> : <Plus size={16} />}
                </div>
            </div>

            {/* Contenido animado */}

            <div
                style={{
                    height: open
                        ? contentRef.current?.scrollHeight
                        : 0,
                    marginTop: open ? "0.75rem" : 0,
                }}
                className="overflow-hidden transition-all duration-300 ease-in-out"
            >
                <div ref={contentRef} className=" space-y-2">
                    {children}
                </div>
            </div>
        </div>
    );
}