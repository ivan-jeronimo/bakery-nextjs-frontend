"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function ErrorState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center bg-amber-50">
      
      {/* Imagen de Error */}
      <div className="mb-6 relative">
        <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-amber-200 overflow-hidden">
            <img 
                src="https://cdn-icons-png.flaticon.com/512/1669/1669430.png" 
                alt="Pan quemado"
                className="w-24 h-24 opacity-80"
            />
        </div>
      </div>

      {/* Mensaje */}
      <h2 className="text-2xl md:text-3xl font-serif text-amber-900 mb-3 font-bold">
        ¡Ups! Se nos quemó el pan en el horno
      </h2>
      
      <p className="text-gray-600 text-base md:text-lg max-w-md mb-8 leading-relaxed">
        No pudimos conectar con nuestra cocina (servidor). 
        <br/>
        Por favor, intenta recargar la página en unos momentos.
      </p>

      {/* Botón de Recarga */}
      <button 
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-900 text-white font-bold rounded-full hover:bg-amber-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        <FontAwesomeIcon icon={faRotateRight} />
        Intentar de nuevo
      </button>

    </div>
  );
}
