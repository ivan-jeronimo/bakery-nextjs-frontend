"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faRedo, faHistory } from '@fortawesome/free-solid-svg-icons';

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border-t-4 border-red-500">
        
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faTimesCircle} className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-serif text-gray-800 mb-4">Pago no completado</h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Hubo un problema al procesar tu pago o la operación fue cancelada.
          <br/>
          No te preocupes, no se ha realizado ningún cargo.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/cotizaciones" 
            className="block w-full py-3 px-6 bg-amber-900 text-white font-bold rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faRedo} />
            Intentar de nuevo
          </Link>
          
          <Link 
            href="/" 
            className="block w-full py-3 px-6 bg-white text-gray-600 font-bold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faHistory} />
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}
