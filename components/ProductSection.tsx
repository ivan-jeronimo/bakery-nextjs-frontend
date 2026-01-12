"use client";

import Link from 'next/link';
import { useState } from 'react';
import ProductModal from './ProductModal';

interface Product {
  id: number;
  name: string;
  weight: string;
  price: string;
  image: string;
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

  return (
    <section className={`py-12 ${bgColor}`}>
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Encabezado */}
        <div className="max-w-3xl mx-auto mb-12">
            <div className="mb-4 flex justify-center">
                <img 
                    src={icon} 
                    alt="Icono Sección" 
                    className="w-16 h-16 opacity-80"
                />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-amber-900 font-medium mb-4">
                {title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
                {description}
            </p>
        </div>

        {/* Contenedor del Slider */}
        <div className="relative w-full max-w-7xl px-4 md:px-16">
            
            {/* Flecha Izquierda */}
            {isSliderActive && (
                <button 
                    onClick={prevSlide}
                    className="absolute left-0 top-[40%] -translate-y-1/2 z-10 bg-white border border-amber-900 text-amber-900 p-3 rounded-full shadow-md hover:bg-amber-900 hover:text-white transition-colors focus:outline-none"
                    aria-label="Anterior"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
            )}

            {/* Cuadrícula de Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                {visibleProducts.map((product, index) => (
                    <div 
                        key={`${product.name}-${index}`} 
                        className="flex flex-col items-center group animate-fade-in cursor-pointer"
                        onClick={() => handleProductClick(product)}
                    >
                        <div className="relative overflow-hidden rounded-lg mb-4 w-full aspect-square">
                            <img 
                                src={product.image} 
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

            {/* Flecha Derecha */}
            {isSliderActive && (
                <button 
                    onClick={nextSlide}
                    className="absolute right-0 top-[40%] -translate-y-1/2 z-10 bg-white border border-amber-900 text-amber-900 p-3 rounded-full shadow-md hover:bg-amber-900 hover:text-white transition-colors focus:outline-none"
                    aria-label="Siguiente"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            )}
        </div>
        
        {/* Botón Ver Todos */}
        <div className="mt-12">
            <Link 
                href={viewAllLink} 
                className="inline-block px-10 py-4 bg-amber-900 border-2 border-amber-900 text-white font-bold text-lg rounded-full hover:bg-white hover:text-amber-900 transition-colors duration-300 uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
                {viewAllText}
            </Link>
        </div>

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
