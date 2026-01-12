import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface CtaSectionProps {
  whatsapp?: string;
}

export default function CtaSection({ whatsapp }: CtaSectionProps) {
  
  // Definimos las clases comunes para ambos botones para asegurar consistencia exacta
  const buttonClasses = "inline-flex items-center justify-center px-10 py-4 bg-amber-900 border-2 border-amber-900 text-white font-bold text-lg rounded-full hover:bg-white hover:text-amber-900 transition-colors duration-300 uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center min-w-[250px]";

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
              href="/cotizaciones" 
              className={buttonClasses}
          >
              Cotizar pedido
          </Link>
          {whatsapp && (
            <a 
                href={`https://wa.me/${whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className={buttonClasses}
            >
                <span className="mr-3">Contactar</span>
                <FontAwesomeIcon icon={faWhatsapp} className="w-7 h-7" />
            </a>
          )}
      </div>
    </section>
  );
}
