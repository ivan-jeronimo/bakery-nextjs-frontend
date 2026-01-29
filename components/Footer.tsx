"use client";
import Link from 'next/link';
import { SocialNetwork, getBakeryData } from '../lib/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
  logo: initialLogo, 
  description: initialDesc, 
  backgroundImage: initialBg, 
  socialNetworks: initialNetworks,
  phoneNumber: initialPhone,
  whatsAppNumber: initialWhatsApp,
  email: initialEmail,
  openingHours: initialHours
}: FooterProps) {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);
  
  const [logoSrc, setLogoSrc] = useState(initialLogo);
  const [descText, setDescText] = useState(initialDesc);
  const [bgImage, setBgImage] = useState(initialBg || "https://static.vecteezy.com/system/resources/previews/013/769/343/large_2x/assortment-of-baked-bread-on-wooden-table-background-banner-for-advertising-and-design-promo-top-view-with-copy-space-photo.jpg");
  const [networks, setNetworks] = useState<SocialNetwork[]>(initialNetworks || []);
  const [phoneText, setPhoneText] = useState(initialPhone);
  const [whatsAppText, setWhatsAppText] = useState(initialWhatsApp);
  const [emailText, setEmailText] = useState(initialEmail);
  const [hoursText, setHoursText] = useState(initialHours);

  useEffect(() => {
    if (!initialLogo) {
      getBakeryData().then(data => {
        if (data) {
          setLogoSrc(data.logo);
          setDescText(data.footer?.description);
          if (data.footer?.backgroundImage) setBgImage(data.footer.backgroundImage);
          setNetworks(data.socialNetworks || []);
          setPhoneText(data.phoneNumber);
          setWhatsAppText(data.whatsAppNumber);
          setEmailText(data.email);
          setHoursText(data.openingHours);
        }
      });
    }
  }, [initialLogo]);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${sectionId}`);
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  const handleWhatsAppClick = () => {
    if (whatsAppText) {
      const message = encodeURIComponent("Hola, me gustaría obtener más información sobre sus productos.");
      window.open(`https://api.whatsapp.com/send/?phone=${whatsAppText}&text=${message}`, '_blank');
    }
  };

  const toggleSection = (section: string) => {
    if (window.innerWidth < 768) {
      setOpenSection(openSection === section ? null : section);
    }
  };

  const hasContactInfo = phoneText || whatsAppText || emailText || hoursText;

  return (
    <footer id="contacto" className="relative w-full font-sans text-gray-300 pt-[100px] md:pt-[150px] pb-[50px] scroll-mt-24">
      
      <div className="absolute inset-0 z-0">
          <img 
              src={bgImage} 
              alt="Fondo Footer" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-900/90 mix-blend-multiply"></div>
      </div>

      <div 
          className="absolute top-0 left-0 w-full pointer-events-none z-10 transform rotate-180"
          style={{
              height: '50px',
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI3MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyODAgODZjLTE5LjktMTcuMjEtNDAuMDgtMzkuNjktNzkuODktMzkuNjktNTcuNDkgMC01Ni45MyA0Ni41OS0xMTUgNDYuNTktNTMuNjEgMC01OS43Ni0zOS42Mi0xMTUuNi0zOS42MkM5MjMuNyA1My4yNyA5MjQuMjYgODcgODUzLjg5IDg3Yy04OS4zNSAwLTc4Ljc0LTg3LTE4OC4yLTg3QzU1NCAwIDU0My45NSAxMjEuOCA0MjMuMzIgMTIxLjhjLTEwMC41MiAwLTExNy44NC01NC44OC0xOTEuNTYtNTQuODgtNzcuMDYgMC0xMDAgNDguNTctMTUxLjc1IDQ4LjU3LTQwIDAtNjAtMTIuMjEtODAtMjkuNTF2NTRIMTI4MHoiLz48L2c+PC9zdmc+")`,
              backgroundSize: '100% 50px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom'
          }}
      ></div>
      <style jsx global>{`
        @media (min-width: 768px) {
          footer#contacto .absolute.top-0 {
            height: 70px !important;
            background-size: 100% 70px !important;
          }
          .desktop-hidden-icon {
            display: none !important;
          }
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-6">
            {logoSrc && (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 p-2 rounded-lg backdrop-blur-sm inline-flex items-center justify-center">
                  <img
                      src={logoSrc}
                      alt="Logo Panadería"
                      className="w-full h-full object-contain opacity-90"
                  />
              </div>
            )}
            
            {descText && (
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {descText}
              </p>
            )}

            {networks.length > 0 && (
              <div className="flex space-x-4">
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
            )}
          </div>

          <div className="md:col-span-3">
            <div 
              className="flex justify-between items-center cursor-pointer md:cursor-default"
              onClick={() => toggleSection('explorar')}
            >
              <h3 className="text-white text-lg font-bold mb-2 md:mb-6 font-serif">Explorar</h3>
              <span className="md:hidden desktop-hidden-icon">
                <FontAwesomeIcon 
                  icon={openSection === 'explorar' ? faChevronUp : faChevronDown} 
                  className="text-amber-500 w-4 h-4"
                />
              </span>
            </div>
            <ul className={`space-y-3 text-sm md:text-base overflow-hidden transition-all duration-300 ${openSection === 'explorar' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 md:max-h-full md:opacity-100'}`}>
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

          {hasContactInfo && (
            <div className="md:col-span-4">
              <div
                className="flex justify-between items-center cursor-pointer md:cursor-default"
                onClick={() => toggleSection('contacto')}
              >
                <h3
                  className="text-white text-lg font-bold mb-2 md:mb-6 font-serif hover:text-amber-500 transition-colors"
                  onClick={(e) => {
                    if (window.innerWidth >= 768 && whatsAppText) {
                      e.stopPropagation();
                      handleWhatsAppClick();
                    }
                  }}
                >
                  Contacto
                </h3>
                <span className="md:hidden desktop-hidden-icon">
                  <FontAwesomeIcon
                    icon={openSection === 'contacto' ? faChevronUp : faChevronDown}
                    className="text-amber-500 w-4 h-4"
                  />
                </span>
              </div>
              <ul className={`space-y-4 text-gray-400 text-sm md:text-base overflow-hidden transition-all duration-300 ${openSection === 'contacto' ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 md:max-h-full md:opacity-100'}`}>
                {phoneText && (
                  <li className="flex items-center">
                    <span className="mr-3 text-amber-500">📞</span>
                    <span>{phoneText}</span>
                  </li>
                )}
                {whatsAppText && (
                  <li className="flex items-center cursor-pointer hover:text-amber-500 transition-colors" onClick={handleWhatsAppClick}>
                    <span className="mr-3 text-amber-500">📱</span>
                    <span>{whatsAppText}</span>
                  </li>
                )}
                {emailText && (
                  <li className="flex items-center">
                    <span className="mr-3 text-amber-500">✉️</span>
                    <span>{emailText}</span>
                  </li>
                )}
                {hoursText && (
                  <li className="flex items-start">
                    <span className="mr-3 mt-1 text-amber-500">🕒</span>
                    <span>{hoursText}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

        </div>
      </div>

      <div className="mt-12 md:mt-16 pt-8 border-t border-gray-800 relative z-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Migajón Panadería – De las recetas del valle, directo a tu mesa
          </p>
        </div>
      </div>
    </footer>
  );
}
