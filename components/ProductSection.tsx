"use client";

import Link from 'next/link';
import { useState } from 'react';
import ProductModal from './ProductModal';
import { ProductVariant } from '../lib/api'; // Importar tipo

interface Product {
  id: number;
  name: string;
  weight: string;
  price: string;
  image: string;
  variants?: ProductVariant[]; // Añadir variantes opcionales
}

interface ProductSectionProps {
  title: string;
  description: string;
  icon: string;
  products: Product[];
  viewAllLink: string;
  viewAllText: string;
  bgColor?: string;
}

export default function ProductSection({ 
  title, 
  description, 
  icon, 
  products, 
  viewAllLink, 
  viewAllText,
  bgColor = "bg-white"
}: ProductSectionProps) {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 4; 
  const isSliderActive = products.length > itemsPerPage;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const getVisibleProducts = () => {
    if (!isSliderActive) return products;
    const visible = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % products.length;
      visible.push(products[index]);
    }
    return visible;
  };

  const visibleProducts = getVisibleProducts();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Imagen por defecto si viene vacía
  const fallbackImage = "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop";

  return (
    <section className={`py-8 md:py-12 ${bgColor}`}>
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Encabezado */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-12">
            <div className="mb-4 flex justify-center">
                <img 
                    src={icon || fallbackImage} 
                    alt="Icono Sección" 
                    className="w-12 h-12 md:w-16 md:h-16 opacity-80"
                />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-amber-900 font-medium mb-3 md:mb-4">
                {title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {description}
            </p>
        </div>

        {/* Contenedor del Slider */}
        <div className="relative w-full max-w-7xl px-0 sm:px-4 md:px-16">
            
            {/* Flecha Izquierda (Solo Desktop) */}
            {isSliderActive && (
                <button 
                    onClick={prevSlide}
                    className="absolute left-0 top-[40%] -translate-y-1/2 z-10 bg-white border border-amber-900 text-amber-900 p-2 md:p-3 rounded-full shadow-md hover:bg-amber-900 hover:text-white transition-colors focus:outline-none hidden md:block"
                    aria-label="Anterior"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
            )}

            {/* VISTA MÓVIL: Carrusel Horizontal con Scroll Nativo */}
            <div className="md:hidden flex overflow-x-auto gap-4 pb-6 px-4 snap-x snap-mandatory scrollbar-hide w-full">
                {products.map((product, index) => (
                    <div 
                        key={`mobile-${product.name}-${index}`} 
                        className="flex-shrink-0 w-[240px] snap-center flex flex-col items-center group cursor-pointer bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                        onClick={() => handleProductClick(product)}
                    >
                        <div className="relative overflow-hidden rounded-lg mb-3 w-full aspect-square">
                            <img 
                                src={product.image || fallbackImage}
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="w-full text-left">
                            <h3 className="text-lg font-bold text-gray-800 mb-0 leading-tight truncate">{product.name}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500 text-sm">{product.weight}</p>
                                <span className="text-amber-900 font-bold text-lg">{product.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* VISTA DESKTOP: Grid con Paginación */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
                {visibleProducts.map((product, index) => (
                    <div 
                        key={`${product.name}-${index}`} 
                        className="flex flex-col items-center group animate-fade-in cursor-pointer"
                        onClick={() => handleProductClick(product)}
                    >
                        <div className="relative overflow-hidden rounded-lg mb-4 w-full aspect-square">
                            <img 
                                src={product.image || fallbackImage}
                                alt={product.name} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white text-4xl font-light">+</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">{product.weight}</p>
                        <span className="text-amber-900 font-bold text-xl">{product.price}</span>
                    </div>
                ))}
            </div>

            {/* Flecha Derecha (Solo Desktop) */}
            {isSliderActive && (
                <button 
                    onClick={nextSlide}
                    className="absolute right-0 top-[40%] -translate-y-1/2 z-10 bg-white border border-amber-900 text-amber-900 p-2 md:p-3 rounded-full shadow-md hover:bg-amber-900 hover:text-white transition-colors focus:outline-none hidden md:block"
                    aria-label="Siguiente"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            )}
        </div>
        
        {/* Botón Ver Todos - ELIMINADO */}

      </div>

      {/* Modal de Producto */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />

    </section>
  );
}
