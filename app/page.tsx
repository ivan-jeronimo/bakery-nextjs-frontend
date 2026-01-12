import HeroSection from "../components/HeroSection";
import LogoMottoSection from "../components/LogoMottoSection";
import HistorySection from "../components/HistorySection";
import CtaSection from "../components/CtaSection";
import ProductSection from "../components/ProductSection";
import DividerSection from "../components/DividerSection";
import HowItWorksSection from "../components/HowItWorksSection";
import { getBakeryData, getProductsCatalog } from "../lib/api";

// Datos de respaldo
const fallbackData = {
  name: "Panadería Panciencia",
  slogan: "El buen pan se hace con amor y panciencia",
  logo: "https://placehold.co/400x400/transparent/5d4037?text=Logo+Panciencia",
  whatsAppNumber: "34630951855",
  hero: {
    title: "Panadería Panciencia",
    backgroundImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop"
  },
  history: {
    description: "Panciencia nació en 2021 en Segura de la Sierra...",
    image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1000&auto=format&fit=crop"
  }
};

export default async function Home() {
  
  console.log("⚡ Iniciando petición de datos...");
  
  // Ejecutamos ambas peticiones en paralelo para mayor velocidad
  const [bakeryData, productsCatalog] = await Promise.all([
    getBakeryData(),
    getProductsCatalog()
  ]);
  
  const data = bakeryData || fallbackData;
  
  // Si la API de productos falla o está vacía, usamos un array vacío (o podrías poner fallback)
  const products = productsCatalog.length > 0 ? productsCatalog : [];

  return (
    <div className="flex flex-col w-full font-sans">
      
      <HeroSection 
        title={data.name}
        backgroundImage={data.hero?.backgroundImage || fallbackData.hero.backgroundImage} 
      />
      
      <LogoMottoSection 
        logo={data.logo} 
        motto={data.slogan} 
      />
      
      <HistorySection 
        title={data.name}
        description={data.history?.description || fallbackData.history.description}
        image={data.history?.image || fallbackData.history.image}
      />
      
      <CtaSection whatsapp={data.whatsAppNumber} />
      
      <ProductSection 
        title="Pan de Valles Centrales"
        description="Tradicionales y más..."
        icon="https://cdn-icons-png.flaticon.com/512/3081/3081967.png"
        products={products}
        viewAllLink="/productos"
        viewAllText="Todos los panes"
      />
      
      <DividerSection />
      
      <HowItWorksSection steps={data.processSteps} />

    </div>
  );
}
