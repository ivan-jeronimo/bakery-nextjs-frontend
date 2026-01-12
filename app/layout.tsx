import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panadería La Espiga - Pan Fresco y Delicioso",
  description: "La mejor panadería de la ciudad. Ofrecemos pan artesanal, pasteles y cotizaciones para eventos.",
  openGraph: {
    title: "Panadería La Espiga - Pan Fresco y Delicioso",
    description: "La mejor panadería de la ciudad. Ofrecemos pan artesanal, pasteles y cotizaciones para eventos.",
    url: "https://www.panaderialaespiga.com",
    siteName: "Panadería La Espiga",
    images: [
      {
        url: "https://www.panaderialaespiga.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Panadería La Espiga",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-50 text-gray-800 flex flex-col min-h-screen`}
      >
        <Navbar />
        {/* 
            Volvemos a poner el contenedor para que todo el contenido (incluido Hero y Footer)
            tenga márgenes laterales y el mismo ancho máximo.
        */}
        <div className="flex-grow container mx-auto px-4 py-8 flex flex-col">
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
