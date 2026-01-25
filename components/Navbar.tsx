"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  logo?: string;
}

export default function Navbar({ logo }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const router = useRouter();

  const logoSrc = logo || "https://placehold.co/200x80/transparent/5d4037?text=Logo+Panciencia";

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    // Si estamos en la home, hacemos scroll
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Actualizamos la URL sin recargar
        window.history.pushState(null, '', `/#${sectionId}`);
      }
    } else {
      // Si no estamos en la home, navegamos a la home con el hash
      router.push(`/#${sectionId}`);
    }
    
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md font-sans">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img 
                src={logoSrc} 
                alt="Logo Panadería" 
                className="h-20 w-auto object-contain" 
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">Inicio</Link>
            <a 
              href="/#sobre-nosotros" 
              onClick={(e) => handleScrollToSection(e, 'sobre-nosotros')}
              className="text-gray-700 hover:text-amber-600 font-medium transition-colors cursor-pointer"
            >
              Sobre nosotros
            </a>
            
            {/* Link Cotizar con Badge */}
            <Link href="/cotizaciones" className="text-gray-700 hover:text-amber-600 font-medium transition-colors flex items-center relative group">
              <span>Cotizar</span>
              <div className="relative ml-2">
                <FontAwesomeIcon icon={faShoppingBasket} className="w-5 h-5 text-amber-900 group-hover:text-amber-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-bounce-short">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <a 
              href="/#contacto" 
              onClick={(e) => handleScrollToSection(e, 'contacto')}
              className="text-gray-700 hover:text-amber-600 font-medium transition-colors cursor-pointer"
            >
              Contacto
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Carrito Móvil (Icono en la barra superior) */}
            <Link href="/cotizaciones" className="relative mr-2">
                <FontAwesomeIcon icon={faShoppingBasket} className="w-6 h-6 text-amber-900" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
            </Link>

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
            <a 
              href="/#sobre-nosotros" 
              onClick={(e) => handleScrollToSection(e, 'sobre-nosotros')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
            >
              Sobre nosotros
            </a>
            
            {/* Link Cotizar eliminado del menú desplegable porque ya está en la barra superior */}

            <a 
              href="/#contacto" 
              onClick={(e) => handleScrollToSection(e, 'contacto')}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
            >
              Contacto
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
