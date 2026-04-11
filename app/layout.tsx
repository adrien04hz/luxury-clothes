import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistMontserrat.variable} antialiased min-h-screen flex flex-col`}
      >
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
