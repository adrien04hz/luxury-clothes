"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBarLogistica() {
  const router = useRouter();

  return (
    <div className="w-full h-28 bg-black text-white flex justify-between px-12">
      <Link href="/admin" className="flex items-center justify-center">
        <Image
          src="/assets/logo/main-logo.svg"
          alt="Logo"
          width={174}
          height={80}
        />
      </Link>

      <div className="flex space-x-7 items-center">
        <div className="flex space-x-5">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("rol");
              localStorage.removeItem("userID");
              router.push("/");
            }}
            className="px-5 py-2 text-sm border border-white rounded-lg hover:bg-gray-900 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}