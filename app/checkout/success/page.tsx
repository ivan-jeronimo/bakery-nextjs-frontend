"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHome, faHistory, faSpinner, faExclamationCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, Suspense } from 'react';
import { syncPaymentStatusByNumber } from '../../../lib/api';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('orderNumber') || searchParams.get('external_reference');
  
  const [status, setStatus] = useState<'loading' | 'approved' | 'pending' | 'rejected' | 'error'>('loading');

  useEffect(() => {
    if (orderNumberParam) {
      syncPaymentStatusByNumber(orderNumberParam)
        .then(response => {
          if (response) {
            if (response.paymentStatus === 'Approved') setStatus('approved');
            else if (response.paymentStatus === 'InProcess' || response.paymentStatus === 'Pending') setStatus('pending');
            else if (response.paymentStatus === 'Rejected') setStatus('rejected');
            else setStatus('error');
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    } else {
      // Si no hay params, no hacemos nada o mostramos error, pero no rompemos
      setStatus('error'); 
    }
  }, [orderNumberParam]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <FontAwesomeIcon icon={faSpinner} spin className="w-12 h-12 text-amber-900 mb-4" />
        <h1 className="text-2xl font-serif text-gray-800">Verificando pago...</h1>
        <p className="text-gray-500 mt-2">Por favor espera un momento.</p>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="text-center border-t-4 border-green-500 pt-8">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
          <FontAwesomeIcon icon={faCheckCircle} className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-serif text-gray-800 mb-4">¡Pago Confirmado!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Gracias por tu compra. Hemos recibido tu pago correctamente.
          <br/>
          Tu pedido <strong>#{orderNumberParam}</strong> ha sido registrado y programado para la fecha solicitada.
        </p>
        <Actions />
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="text-center border-t-4 border-yellow-500 pt-8">
        <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faClock} className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-serif text-gray-800 mb-4">Pago en Proceso</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Tu pago está siendo revisado. Te notificaremos en cuanto se confirme.
          <br/>
          No es necesario que hagas nada más por ahora.
        </p>
        <Actions />
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="text-center border-t-4 border-red-500 pt-8">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faExclamationCircle} className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-serif text-gray-800 mb-4">Pago Rechazado</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Lo sentimos, tu pago no pudo ser procesado.
          <br/>
          Por favor intenta con otro método de pago.
        </p>
        <div className="space-y-3">
          <Link 
            href="/cotizaciones" 
            className="block w-full py-3 px-6 bg-amber-900 text-white font-bold rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faHistory} />
            Intentar de nuevo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center border-t-4 border-gray-500 pt-8">
      <h1 className="text-2xl font-serif text-gray-800 mb-4">No pudimos verificar tu pago</h1>
      <p className="text-gray-600 mb-8">
        No encontramos la referencia del pedido o hubo un error de conexión.
        <br/>
        Por favor revisa el estado en tu historial de pedidos.
      </p>
      <Actions />
    </div>
  );
}

function Actions() {
  return (
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
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <Suspense fallback={<div>Cargando...</div>}>
          <CheckoutSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
