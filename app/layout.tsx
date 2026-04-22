import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { getCategorias, getCategoriasDefault, getTodasLasCategorias } from "@/client/categoria.client";
import { getGeneros } from "@/client/genero.client";
import { getProveedoresBancarios } from "@/client/proveedor.client";
import { getMarcas } from "@/client/marca.client";
import { getColores } from "@/client/color.client";

import NavBarRol from "./components/NavBarRol";


const geistMontserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-geist-montserrat",
});

export const metadata: Metadata = {
  title: "Luxury Clothes",
  description: "Ecommerce de ropa de lujo",
  icons: {
    icon: "/assets/logo/logo.png",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Funciones para NavBar
  const generos = await getGeneros();

  const categoriasPorGenero = await Promise.all(
    generos.data.slice(0, 3).map(async (genero) => {
      const categorias = await getCategorias(genero.id);
      return {
        generoId: genero.id,
        categorias: categorias.data,
      };
    })
  );

  const todasLasCategorias = await getTodasLasCategorias();


  // Funciones para Footer
  const categorias = await getCategoriasDefault();
  const marcas = await getMarcas();
  const proveedoresBancarios = await getProveedoresBancarios();

  return (
    <html lang="es">
      <body
        className={`${geistMontserrat.variable} antialiased min-h-screen flex flex-col`}
      >
        
        <NavBarRol 
          generos={generos}
          categoriasPorGenero={categoriasPorGenero}
          todasLasCategorias={todasLasCategorias}
        />


        <main className="flex-1">
          {children}
        </main>

        <Footer 
          categorias={categorias}
          marcas={marcas}
          proveedoresBancarios={proveedoresBancarios}
        
        />
      </body>
    </html>
  );
}
