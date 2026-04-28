"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; 
import NavBar from "./NavBar";
import NavBarLogistica from "./NavBarLogistica";
import NavBarAdmin from "./NavBarAdmin";

export default function NavBarRol(props: any) {
  const [rol, setRol] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const pathname = usePathname(); 

  useEffect(() => {
    const checkAuth = () => {
      const rolStorage = localStorage.getItem("rol");
      setRol(rolStorage ? Number(rolStorage) : 1);
      setReady(true);
    };

    checkAuth();
  }, [pathname]);

  if (!ready) return null;

  if (rol === 2) {
    return <NavBarAdmin />;
  } 
  
  if (rol === 3) {
    return <NavBarLogistica />;
  }

  if (rol === 4) {
    return <NavBarLogistica />;
  }

  return <NavBar {...props} />;


}