'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function EmptyRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/productos?categoria=1");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-medium">
        No hay productos disponibles
      </p>

      <p className="text-gray-500">
        Algo no está bien, volviendo a inicio...
      </p>

      <div>
        <Loader className="animate-spin" size={24} />
      </div>
    </div>
  );
}