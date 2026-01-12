"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md font-sans">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              {/* Usamos img estándar para evitar configuración de dominios externos en next.config.ts por ahora */}
              <img 
                src="https://panciencia.com/wp-content/uploads/2025/07/logo_menu.webp" 
                alt="Logo Panadería" 
                className="h-20 w-auto object-contain" 
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Inicio</Link>
            <Link href="/sobre-nosotros" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Sobre nosotros</Link>
            <Link href="/cotizaciones" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Cotizaciones</Link>
            <Link href="/contacto" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Contacto</Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 focus:outline-none p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
            <Link href="/sobre-nosotros" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50" onClick={() => setIsMobileMenuOpen(false)}>Sobre nosotros</Link>
            <Link href="/cotizaciones" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50" onClick={() => setIsMobileMenuOpen(false)}>Cotizaciones</Link>
            <Link href="/contacto" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50" onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
          </div>
        </div>
      )}
    </header>
  );
}
