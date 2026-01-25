"use client";
import Link from 'next/link';
import { SocialNetwork } from '../lib/api';
import { useRouter } from 'next/navigation';

interface FooterProps {
  logo?: string;
  description?: string;
  backgroundImage?: string;
  socialNetworks?: SocialNetwork[];
  address?: string;
  phoneNumber?: string;
  whatsAppNumber?: string;
  email?: string;
  openingHours?: string;
}

export default function Footer({ 
  logo, 
  description, 
  backgroundImage, 
  socialNetworks,
  address,
  phoneNumber,
  whatsAppNumber,
  email,
  openingHours
}: FooterProps) {
  const router = useRouter();
  
  // Valores por defecto
  const bgImage = backgroundImage || "https://static.vecteezy.com/system/resources/previews/013/769/343/large_2x/assortment-of-baked-bread-on-wooden-table-background-banner-for-advertising-and-design-promo-top-view-with-copy-space-photo.jpg";
  const logoSrc = logo || "https://images.vexels.com/media/users/3/142860/isolated/preview/3b874e1bacfab0d586c5534cc0c9b637-logo-cuadrado-azul-estrella.png";
  const descText = description || "De las recetas del valle, directo a tu mesa";
  
  const phoneText = phoneNumber || "555-0199";
  const whatsAppText = whatsAppNumber || "529511234567";
  const emailText = email || "contacto@lacentral.com";
  const hoursText = openingHours || "Lunes a Viernes: 7:00 AM - 9:00 PM";

  const defaultSocialNetworks: SocialNetwork[] = [
    {
        name: "Facebook",
        url: "https://facebook.com/panaderialacentral",
        iconCode: "fb"
    },
    {
        name: "Instagram",
        url: "https://instagram.com/panaderialacentral",
        iconCode: "insta"
    }
  ];

  const networks = socialNetworks || defaultSocialNetworks;

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
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola, me gustaría obtener más información sobre sus productos.");
    window.open(`https://api.whatsapp.com/send/?phone=${whatsAppText}&text=${message}`, '_blank');
  };

  return (
    <footer id="contacto" className="relative w-full font-sans text-gray-300 pt-[150px] pb-[50px] scroll-mt-24">
      
      {/* IMAGEN DE FONDO DEL FOOTER */}
      <div className="absolute inset-0 z-0">
          <img 
              src={bgImage} 
              alt="Fondo Footer" 
              className="w-full h-full object-cover"
          />
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-zinc-900/90 mix-blend-multiply"></div>
      </div>

      {/* DIVISOR ONDULADO SUPERIOR */}
      <div 
          className="absolute top-0 left-0 w-full pointer-events-none z-10 transform rotate-180"
          style={{
              height: '70px',
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI3MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyODAgODZjLTE5LjktMTcuMjEtNDAuMDgtMzkuNjktNzkuODktMzkuNjktNTcuNDkgMC01Ni45MyA0Ni41OS0xMTUgNDYuNTktNTMuNjEgMC01OS43Ni0zOS42Mi0xMTUuNi0zOS42MkM5MjMuNyA1My4yNyA5MjQuMjYgODcgODUzLjg5IDg3Yy04OS4zNSAwLTc4Ljc0LTg3LTE4OC4yLTg3QzU1NCAwIDU0My45NSAxMjEuOCA0MjMuMzIgMTIxLjhjLTEwMC41MiAwLTExNy44NC01NC44OC0xOTEuNTYtNTQuODgtNzcuMDYgMC0xMDAgNDguNTctMTUxLjc1IDQ4LjU3LTQwIDAtNjAtMTIuMjEtODAtMjkuNTF2NTRIMTI4MHoiLz48L2c+PC9zdmc+")`,
              backgroundSize: '100% 70px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom'
          }}
      ></div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Columna 1: Logo y Descripción */}
          <div className="md:col-span-5 space-y-6">
            {/* LOGO CUADRADO */}
            <div className="w-32 h-32 bg-white/10 p-2 rounded-lg backdrop-blur-sm inline-flex items-center justify-center">
                <img 
                    src={logoSrc} 
                    alt="Logo Migajón Panadería"
                    className="w-full h-full object-contain opacity-90"
                />
            </div>
            <p className="text-gray-400 leading-relaxed">
              {descText}
            </p>
            <div className="flex space-x-4">
              {/* Redes Sociales Dinámicas */}
              {networks.map((network, index) => (
                <a 
                  key={index}
                  href={network.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all"
                  title={network.name}
                >
                  {network.iconCode === 'fb' && <span className="font-bold">f</span>}
                  {network.iconCode === 'insta' && <span className="font-bold">in</span>}
                  {network.iconCode !== 'fb' && network.iconCode !== 'insta' && <span className="text-xs">{network.name.substring(0,2)}</span>}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces (Opciones del Navbar) */}
          <div className="md:col-span-3">
            <h3 className="text-white text-lg font-bold mb-6 font-serif">Explorar</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Inicio</Link></li>
              <li>
                <a 
                  href="/#sobre-nosotros" 
                  onClick={(e) => handleScrollToSection(e, 'sobre-nosotros')}
                  className="hover:text-amber-500 transition-colors cursor-pointer"
                >
                  Sobre nosotros
                </a>
              </li>
              <li><Link href="/cotizaciones" className="hover:text-amber-500 transition-colors">Cotizar</Link></li>
            </ul>
          </div>

          {/* Columna 3: Información de Contacto */}
          <div className="md:col-span-4">
            <h3 
              className="text-white text-lg font-bold mb-6 font-serif cursor-pointer hover:text-amber-500 transition-colors"
              onClick={handleWhatsAppClick}
            >
              Contacto
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center">
                <span className="mr-3 text-amber-500">📞</span>
                <span>{phoneText}</span>
              </li>
              <li className="flex items-center cursor-pointer hover:text-amber-500 transition-colors" onClick={handleWhatsAppClick}>
                <span className="mr-3 text-amber-500">📱</span>
                <span>{whatsAppText}</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-amber-500">✉️</span>
                <span>{emailText}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-amber-500">🕒</span>
                <span>{hoursText}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barra Inferior Copyright */}
      <div className="mt-16 pt-8 border-t border-gray-800 relative z-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Migajón Panadería – De las recetas del valle, directo a tu mesa
          </p>
        </div>
      </div>
    </footer>
  );
}
