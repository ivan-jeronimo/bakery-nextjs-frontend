import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getBakeryData } from "../lib/api";
import { CartProvider } from "../context/CartContext"; // Importar Provider

// --- Configuración Font Awesome ---
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false; 
// ----------------------------------

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Migajón Panadería - De las recetas del valle, directo a tu mesa",
  description: "Panadería tradicional con recetas del valle. Ofrecemos pan artesanal, pasteles y cotizaciones para eventos.",
  openGraph: {
    title: "Migajón Panadería - De las recetas del valle, directo a tu mesa",
    description: "Panadería tradicional con recetas del valle. Ofrecemos pan artesanal, pasteles y cotizaciones para eventos.",
    url: "https://www.migajonpanaderia.com",
    siteName: "Migajón Panadería",
    images: [
      {
        url: "https://www.migajonpanaderia.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Migajón Panadería",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const bakeryData = await getBakeryData();

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-amber-50 text-gray-800 flex flex-col min-h-screen`}
      >
        <CartProvider>
          <Navbar logo={bakeryData?.logo} />
          
          <div className="flex-grow container mx-auto px-4 py-8 flex flex-col">
            <main className="flex-grow w-full">
              {children}
            </main>
            
            <Footer 
              logo={bakeryData?.logo}
              description={bakeryData?.footer?.description}
              backgroundImage={bakeryData?.footer?.backgroundImage}
              socialNetworks={bakeryData?.socialNetworks}
              address={bakeryData?.address}
              phoneNumber={bakeryData?.phoneNumber}
              whatsAppNumber={bakeryData?.whatsAppNumber}
              email={bakeryData?.email}
              openingHours={bakeryData?.openingHours}
            />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
