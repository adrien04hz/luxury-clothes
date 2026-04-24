"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Tag,
  Users,
  Layers,
  ShoppingCart,
  Package
} from "lucide-react";

const menuItems = [
  { name: "Inicio", path: "/admin", icon: Home },
  { name: "Categorías", path: "/admin/categorias", icon: Tag },
  { name: "Clientes", path: "/admin/clientes", icon: Users },
  { name: "Marcas", path: "/admin/marcas", icon: Layers },
  { name: "Pedidos", path: "/admin/pedidos", icon: ShoppingCart },
  { name: "Productos", path: "/admin/productos", icon: Package },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 bg-black border-r">
      
      <div>
        <nav className="mt-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-white
                ${
                  isActive
                    ? "bg-gray-800 shadow"
                    : "text-black hover:bg-gray-900"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}