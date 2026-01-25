import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

// Configuración Font Awesome (necesaria si no carga el layout global en 404)
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4 text-center">
      
      {/* Imagen Divertida */}
      <div className="mb-6 md:mb-8 relative">
        <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-amber-200 overflow-hidden transition-all duration-300">
            <img 
                src="https://cdn-icons-png.flaticon.com/512/5545/5545566.png" 
                alt="Panadero"
                className="w-28 h-28 md:w-40 md:h-40 opacity-90 hover:scale-110 transition-transform duration-500"
            />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-red-500 text-white font-bold px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full shadow-lg transform rotate-12">
            404
        </div>
      </div>

      {/* Mensaje Ingenioso */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-amber-900 mb-3 md:mb-4 font-bold px-2">
        ¡Te agarramos con las manos en la masa!
      </h1>
      
      <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-xs sm:max-w-md mb-6 md:mb-8 leading-relaxed px-2">
        Lo sentimos, la página que buscas no existe o ya se vendió. 
        <br className="hidden sm:block"/>
        Parece que esta migaja se perdió en el camino.
      </p>

      {/* Botón de Regreso */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-amber-900 text-white font-bold text-sm md:text-base rounded-full hover:bg-amber-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <FontAwesomeIcon icon={faHome} />
        Volver al Horno (Inicio)
      </Link>

    </div>
  );
}
