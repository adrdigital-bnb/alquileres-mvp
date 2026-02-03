import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // <--- 1. IMPORTAMOS EL NAVBAR

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alquileres MVP", // Aprovechamos para ponerle un título real
  description: "Encuentra tu próximo destino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. COLOCAMOS EL NAVBAR AQUÍ, ANTES DEL CONTENIDO */}
        <Navbar />

        {/* El children es el resto de tu app (Home, Detalle, etc.) */}
        <main>
           {children}
        </main>
      </body>
    </html>
  );
}