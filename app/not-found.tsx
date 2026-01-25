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
      <div className="mb-8 relative">
        <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-amber-200 overflow-hidden">
            <img 
                src="https://cdn-icons-png.flaticon.com/512/5545/5545566.png" 
                alt="Panadero"
                className="w-40 h-40 opacity-90 hover:scale-110 transition-transform duration-500"
            />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-red-500 text-white font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
            404
        </div>
      </div>

      {/* Mensaje Ingenioso */}
      <h1 className="text-4xl md:text-5xl font-serif text-amber-900 mb-4 font-bold">
        ¡Te agarramos con las manos en la masa!
      </h1>
      
      <p className="text-gray-600 text-lg md:text-xl max-w-md mb-8 leading-relaxed">
        Lo sentimos, la página que buscas no existe o ya se vendió. 
        <br/>
        Parece que esta migaja se perdió en el camino.
      </p>

      {/* Botón de Regreso */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-8 py-4 bg-amber-900 text-white font-bold rounded-full hover:bg-amber-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <FontAwesomeIcon icon={faHome} />
        Volver al Horno (Inicio)
      </Link>

    </div>
  );
}
