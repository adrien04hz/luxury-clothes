import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const geistMontserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-geist-montserrat",
});

export const metadata: Metadata = {
  title: "Luxury Clothes",
  description: "Ecommerce de ropa de lujo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistMontserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
