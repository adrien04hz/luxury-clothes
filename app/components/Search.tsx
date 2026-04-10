"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SearchOverlay() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [recientes, setRecientes] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // carga de busquedas recientes
  useEffect(() => {
    const stored = localStorage.getItem("busquedas");
    if (stored) {
      setRecientes(JSON.parse(stored));
    }
  }, []);

  // sugerencias
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query) {
        setSugerencias([]);
        return;
      }
      try {
        const res = await fetch(`/api/motordebusqueda/busqueda?q=${query}`);
        const data = await res.json();

        const palabras: string[] = (data.data || [])
          .flatMap((p: any) =>
            String(p.nombre)
              .toLowerCase()
              .split(/[\s-]+/)
          )
          .filter((word: string) =>
            word.includes(query.toLowerCase())
          )
          .filter((word: string) => word.length > 2);

        const unicas: string[] = Array.from(new Set(palabras));
        setSugerencias(unicas.slice(0, 5));
      } catch {
        setSugerencias([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // guardar los datos de busquedas recientes
  const guardarBusqueda = (q: string) => {
    const nuevas = [q, ...recientes.filter(r => r !== q)].slice(0, 5);
    setRecientes(nuevas);
    localStorage.setItem("busquedas", JSON.stringify(nuevas));
  };

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    guardarBusqueda(searchQuery);
    router.push(`/productos/buscar?q=${encodeURIComponent(searchQuery)}`);
    setOpen(false);
  };

  const handleOpen = () => {
    setQuery("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <Search
        onClick={() => handleOpen()}
        className="cursor-pointer text-white"
      />

      {/* flotante */}
      {open && (
        <div className="absolute top-28 left-0 w-full text-black bg-white z-[999] shadow-xl px-10 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="w-full relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-8 border-b border-gray-400 py-2 outline-none bg-transparent"
                  autoFocus
                />
              </div>
              <button
                className="ml-6 text-sm text-gray-600 hover:underline"
                onClick={() => handleClose()}>
                Cancelar
              </button>
            </div>
            {/* sugerencias */}
            {sugerencias.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Sugerencias</p>
                {sugerencias.map((s, i) => (
                  <p
                    key={i}
                    onClick={() => { setQuery(s); handleSearch(s) }}
                    className="text-sm cursor-pointer hover:underline"
                  >
                    {s}
                  </p>
                ))}
              </div>
            )}
            {/* historial */}
            {recientes.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Búsquedas recientes</p>
                {recientes.map((r, i) => (
                  <p
                    key={i}
                    onClick={() => { setQuery(r); handleSearch(r) }}
                    className="text-sm cursor-pointer hover:underline"
                  >
                    {r}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}