"use client";

import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import LogoMottoSection from "../components/LogoMottoSection";
import HistorySection from "../components/HistorySection";
import CtaSection from "../components/CtaSection";
import ProductSection from "../components/ProductSection";
import DividerSection from "../components/DividerSection";
import HowItWorksSection from "../components/HowItWorksSection";
import ErrorState from "../components/ErrorState";
import { getBakeryData, getProductsCatalog, BakeryData, ProductDisplay } from "../lib/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [bakeryData, setBakeryData] = useState<BakeryData | null>(null);
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("⚡ Iniciando petición de datos en el cliente...");
        const [data, catalog] = await Promise.all([
          getBakeryData(),
          getProductsCatalog()
        ]);

        if (data) {
          setBakeryData(data);
          setProducts(catalog);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <FontAwesomeIcon icon={faSpinner} spin className="text-amber-900 text-4xl mb-4" />
        <p className="text-amber-900 font-serif animate-pulse">Horneando el sitio web...</p>
      </div>
    );
  }

  if (error || !bakeryData) {
    return <ErrorState />;
  }

  return (
    <div className="flex flex-col w-full font-sans animate-fade-in">
      
      <HeroSection 
        title={bakeryData.name}
        backgroundImage={bakeryData.hero?.backgroundImage} 
      />
      
      <LogoMottoSection 
        logo={bakeryData.logo} 
        motto={bakeryData.slogan} 
      />
      
      <HistorySection 
        title={bakeryData.name}
        description={bakeryData.history?.description}
        image={bakeryData.history?.image}
      />
      
      <CtaSection whatsapp={bakeryData.whatsAppNumber} />
      
      <ProductSection 
        title="Pan de Valles Centrales"
        description="Tradicionales y más..."
        icon="https://cdn-icons-png.flaticon.com/512/3081/3081967.png"
        products={products}
        viewAllLink="/productos"
        viewAllText="Todos los panes"
      />
      
      <DividerSection />
      
      <HowItWorksSection />

    </div>
  );
}
