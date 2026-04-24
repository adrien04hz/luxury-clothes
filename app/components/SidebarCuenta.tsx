"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function SidebarCuenta() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("userID");
    router.push("/");
  };

  const linkClass = (path: string) =>
    `px-2 py-3 font-medium border-b transition ${
      pathname === path
        ? "bg-gray-200 text-black border-gray-400"
        : "text-gray-700 hover:bg-gray-50 hover:border-gray-300"
    }`;

  return (
    <div className="w-60 shrink-0">
      <nav className="flex flex-col">
        <Link href="/" className={linkClass("/")}>
          Inicio
        </Link>
        <Link href="/cuenta" className={linkClass("/cuenta")}>
          Mi información
        </Link>
        <Link href="/cuenta/pedidos" className={linkClass("/cuenta/pedidos")}>
          Mis pedidos
        </Link>
        <Link href="/cuenta/direcciones" className={linkClass("/cuenta/direcciones")}>
          Mis direcciones
        </Link>
        <Link href="/cuenta/metodosdepago" className={linkClass("/cuenta/metodosdepago")}>
          Mis métodos de pago
        </Link>
        <Link href="/cuenta/configuracion" className={linkClass("/cuenta/configuracion")}>
          Configuración
        </Link>
        <button
          onClick={handleLogout}
          className="px-2 py-3 text-left text-red-600 border-b hover:bg-red-50 font-medium transition"
        >
          Cerrar sesión
        </button>
      </nav>
    </div>
  );
}