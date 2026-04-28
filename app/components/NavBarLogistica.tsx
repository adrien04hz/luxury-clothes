"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavBarLogistica() {
  const [rol, setRol] = useState<number>(0);

  useEffect(() => {
    const rol = localStorage.getItem("rol");
    setRol(rol ? parseInt(rol, 10) : 0);

  }, []);

  return (
    <>
    <div className="w-full h-28 bg-black text-white flex items-center justify-between px-12">
      <Link href="" className="flex items-center justify-center">
        <Image 
          src="/assets/logo/main-logo.svg" 
          alt="Logo" 
          loading="eager"
          width={174} 
          height={80} 
        />
      </Link>

       <nav className="*:h-full flex items-center">
        <ul className="h-full flex justify-center items-center text-md space-x-9">
          <li>
            <p className="text-3xl">{rol === 3 ? "Repartidor" : "Empacador"}</p>
          </li>
          </ul>        
      </nav>      
      <div className="flex space-x-7 items-center">
        <div className="flex space-x-5">
         
          <Link href="/cuenta">
            <Image src="/assets/images/profile.svg" alt="User" width={30} height={30} />
          </Link>
         
        </div>
      </div>
    </div>
    </>
  );
}