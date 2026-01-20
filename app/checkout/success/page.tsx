"use client";

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHome, faHistory } from '@fortawesome/free-solid-svg-icons';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border-t-4 border-green-500">
        
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
          <FontAwesomeIcon icon={faCheckCircle} className="w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-serif text-gray-800 mb-4">¡Pago Exitoso!</h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Gracias por tu compra. Hemos recibido tu pago correctamente.
          <br/>
          Tu pedido ahora está en proceso de preparación.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/cotizaciones" 
            className="block w-full py-3 px-6 bg-amber-900 text-white font-bold rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faHistory} />
            Ver mis pedidos
          </Link>
          
          <Link 
            href="/" 
            className="block w-full py-3 px-6 bg-white text-gray-600 font-bold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faHome} />
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}
