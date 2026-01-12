import HeroSection from "../components/HeroSection";
import LogoMottoSection from "../components/LogoMottoSection";
import HistorySection from "../components/HistorySection";
import CtaSection from "../components/CtaSection";
import ProductSection from "../components/ProductSection";
import DividerSection from "../components/DividerSection";
import HowItWorksSection from "../components/HowItWorksSection";

export default function Home() {
  
  // Datos para la sección de Panes (Ahora con más de 4 para activar el slider)
  const panesProducts = [
    {
      name: "Molletes artesanos",
      weight: "(200g – 2 unidades)",
      price: "2,00 €",
      image: "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Pan de semillas",
      weight: "(550g)",
      price: "4,50 €",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Pan blanco artesanal",
      weight: "(550g)",
      price: "3,50 €",
      image: "https://images.unsplash.com/photo-1585476644321-b976214b2f06?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Pan de Payés",
      weight: "(550g)",
      price: "4,25 €",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Pan de Centeno",
      weight: "(500g)",
      price: "3,80 €",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop"
    },
    {
      name: "Baguette Rústica",
      weight: "(250g)",
      price: "1,20 €",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="flex flex-col w-full font-sans">
      
      <HeroSection />
      
      <LogoMottoSection />
      
      <HistorySection />
      
      <CtaSection />
      
      <ProductSection 
        title="Pan de Valles Centrales"
        description="Elaborados con masa madre con fermentación de larga duración para que cada bocado honre la tradición del buen pan. Este es el secreto de un pan de excelente calidad."
        icon="https://cdn-icons-png.flaticon.com/512/3081/3081967.png"
        products={panesProducts}
        viewAllLink="/productos"
        viewAllText="Todos los panes"
      />
      
      <DividerSection />
      
      <HowItWorksSection />

    </div>
  );
}
