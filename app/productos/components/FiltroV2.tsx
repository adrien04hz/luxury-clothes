/**
 * @author Adrien Hernández Sánchez
 * Componente v2 del filtro de productos
 * 23/04/26
 */
"use client";

import { useRef, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Colore, Data, TotalSubcategoria } from "@/types/filtro_v2/filtro_v2";

interface Props {
    data: Data | undefined;
    title?: string;
    count?: number;
    titulos?: {
        categoria: string;
        subcategoria?: string;
        genero?: string;
    };
    params?: {
        id_categoria?: number;
        id_subcategoria?: number;
        id_genero?: number;
        id_marca?: number;
        id_color?: number;
    }
}

export default function FiltroV2({ data, title, count, titulos, params }: Props) {
    const [open, setOpen] = useState(false);
    const [activo, setActivo] = useState<string | null>(null);

    const { categoria, id_categoria } = data || {};
    const { cantidades } = data || {};
    const { subcategorias, generos, colores, marcas } = cantidades || {};

    const selectedSubcategoria = params?.id_subcategoria ? Number(params.id_subcategoria) : null;
    const selectedGenero = params?.id_genero ? Number(params.id_genero) : null;
    const selectedMarca = params?.id_marca ? Number(params.id_marca) : null;

    const router = useRouter();
    const searchParams = useSearchParams();

    function aplicarFiltro(
        key: string,
        value: string | null,
        resetKeys: string[] = []
    ) {
        const params = new URLSearchParams(searchParams.toString());

        if (value === null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        resetKeys.forEach((k) => params.delete(k));

        router.push(`/productos?${params.toString()}`);
    }

    function limpiarFiltros() {
        const params = new URLSearchParams();

        const categoria = searchParams.get("categoria");

        if (categoria) {
            params.set("categoria", categoria);
        }

        router.push(`/productos?${params.toString()}`);
    }

    function getCantidadPorSubcategoria(
        item: Colore,
        subcategoriaSeleccionada: number | null
    ) {
        if (!subcategoriaSeleccionada) {
            return Number(item.total_categoria);
        }

        const match = item.total_subcategorias.find(
            (s: TotalSubcategoria) => s.id_sub === subcategoriaSeleccionada
        );

        return match?.cantidad || 0;
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
                        {/* <div className="text-sm cursor-pointer" onClick={() => aplicarFiltro("orden", "precio_asc")}> */}
                        <div className="text-sm cursor-pointer">

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
                        {/* <div className="text-sm cursor-pointer" onClick={() => aplicarFiltro("orden", "precio_desc")}> */}
                        <div className="text-sm cursor-pointer">

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

                        <div key={id_categoria}>
                            <p className="text-sm font-medium mb-1">
                                {categoria}
                            </p>
                            {subcategorias
                            ?.filter((s) => s.cantidad > 0)
                            .map((s) => (
                                <div key={s.id} className="text-sm ml-3 text-gray-500 cursor-pointer">

                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                    type="checkbox"
                                    className="peer hidden"
                                    checked={selectedSubcategoria === s.id}
                                    onChange={() => { 
                                        if (selectedSubcategoria === s.id) {
                                            aplicarFiltro("subcategoria", null, ["color"]);
                                        } else {
                                            aplicarFiltro("subcategoria", s.id.toString(), ["color"]);
                                        }
                                    }}
                                    />

                                    <div className="
                                    w-4 h-4 border border-gray-400
                                    peer-checked:bg-black
                                    peer-checked:border-black
                                    transition rounded-sm
                                    "></div>

                                    <span>{s.nombre} ({s.cantidad})</span>
                                </label>
                                </div>
                            ))}
                        </div>
                    </FiltroItem>

                    {/* seccion de genero */}
                    <FiltroItem title="Género" open={activo === "género"} onToggle={() => setActivo(activo === "género" ? null : "género")}>
                        {generos?.map((c) => {
                            const cantidad = getCantidadPorSubcategoria(c, selectedSubcategoria);

                            if (cantidad === 0) return null;

                            return (
                                <div key={c.id}>
                                <div className="text-sm font-normal cursor-pointer">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        className="peer hidden"
                                        checked={selectedGenero === c.id}
                                        onChange={() => { 
                                            if (selectedGenero === c.id) {
                                                aplicarFiltro("genero", null, ["color"]);
                                            } else {
                                                aplicarFiltro("genero", c.id.toString(), ["color"]);
                                            }
                                        }}
                                    />

                                    <div className="
                                        w-4 h-4 border border-gray-400
                                        peer-checked:bg-black
                                        peer-checked:border-black
                                        transition rounded-sm
                                    "></div>

                                    <span>
                                        {c.genero} ({cantidad})
                                    </span>
                                    </label>
                                </div>
                                </div>
                            );
                        })}
                    </FiltroItem>

                    {/* seccion de Color */}
                    <FiltroItem title="Color" open={activo === "color"} onToggle={() => setActivo(activo === "color" ? null : "color")}>
                        <div className=" px-8 grid grid-cols-3 gap-x-1 gap-y-6 justify-items-center">
                        {colores?.map((color) => {
                        const cantidad = getCantidadPorSubcategoria(color, selectedSubcategoria);

                        if (cantidad === 0) return null;

                        return (
                            <div key={color.id} className="flex flex-col items-center w-fit">
                            <div
                                className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition"
                                style={{ backgroundColor: getColor(color.color || "") }}
                                onClick={() => aplicarFiltro("color", color.id.toString())}
                            ></div>

                            <span className="text-xs mt-2 text-gray-700">
                                {color.color} ({cantidad})
                            </span>
                            </div>
                        );
                        })}
                        </div>
                    </FiltroItem>

                    <FiltroItem title="Marcas" open={activo === "marca"} onToggle={() => setActivo(activo === "marca" ? null : "marca")}>
                        {marcas?.map((c) => {
                            const cantidad = getCantidadPorSubcategoria(c, selectedSubcategoria);

                            if (cantidad === 0) return null;

                            return (
                                <div key={c.id}>
                                <div className="text-sm font-normal cursor-pointer">

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        className="peer hidden"
                                        checked={selectedMarca === c.id}
                                        onChange={() => { 
                                            if (selectedMarca === c.id) {
                                                aplicarFiltro("marca", null, ["color"]);
                                            } else {
                                                aplicarFiltro("marca", c.id.toString(), ["color"]);
                                            }
                                        }}
                                    />

                                    <div className="
                                        w-4 h-4 border border-gray-400
                                        peer-checked:bg-black
                                        peer-checked:border-black
                                        transition rounded-sm
                                    "></div>

                                    <span>
                                        {c.marca} ({cantidad})
                                    </span>
                                    </label>
                                </div>
                                </div>
                            );
                            })}
                    </FiltroItem>

                    <div className="mt-6 space-y-4">
                        <button className="text-sm hover:underline hover:cursor-pointer" onClick={limpiarFiltros}>
                            Limpiar filtros
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