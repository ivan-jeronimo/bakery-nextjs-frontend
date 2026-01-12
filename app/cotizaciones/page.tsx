"use client";

import { useCart } from '../../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle, faSpinner, faArrowRight, faCalendarAlt, faUser, faHistory, faBoxOpen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import Link from 'next/link';
import { sendVerificationCode, verifyCode, createOrder, getOrderHistory, OrderHistoryItem } from '../../lib/api';

type Step = 'PHONE_INPUT' | 'OTP_VERIFICATION' | 'ORDER_DETAILS' | 'SUCCESS' | 'HISTORY_VIEW';

export default function CotizacionesPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState<Step>('PHONE_INPUT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  
  const [history, setHistory] = useState<OrderHistoryItem[]>([]);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const handleRequestCode = async () => {
    if (!phone || phone.length < 10) {
      setError('Por favor ingresa un número válido (10 dígitos)');
      return;
    }
    setError('');
    setIsLoading(true);
    const success = await sendVerificationCode(phone);
    setIsLoading(false);
    if (success) setCurrentStep('OTP_VERIFICATION');
    else setError('Error al enviar el código.');
  };

  const handleVerifyCode = async () => {
    if (!otp || otp.length < 4) {
      setError('Ingresa el código de 4 dígitos');
      return;
    }
    setError('');
    setIsLoading(true);
    const isValid = await verifyCode(phone, otp);
    setIsLoading(false);
    if (isValid) {
      if (cart.length > 0) {
        setCurrentStep('ORDER_DETAILS');
      } else {
        const orders = await getOrderHistory(phone);
        setHistory(orders);
        setCurrentStep('HISTORY_VIEW');
      }
    } else {
      setError('Código incorrecto. Intenta "1234" (simulación).');
    }
  };

  const handleSubmitOrder = async () => {
    if (!name || !date) {
      setError('Por favor completa todos los campos');
      return;
    }
    setError('');
    setIsLoading(true);

    // Formatear fecha a ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
    // Asumimos hora de entrega por defecto 10:00 AM si no se pide hora
    const deliveryDateTime = new Date(`${date}T10:00:00Z`).toISOString();

    const success = await createOrder({
      customerName: name,
      customerPhone: phone,
      // customerEmail: "...", // Opcional, podríamos pedirlo
      deliveryDate: deliveryDateTime,
      // notes: "...", // Opcional
      items: cart.map(item => ({
        productId: item.productId,
        sizeId: item.sizeId,
        designId: item.designId || null, // Asegurar null si es undefined
        quantity: item.quantity
        // price NO se envía, el backend lo calcula
      }))
    });

    setIsLoading(false);

    if (success) {
      setCurrentStep('SUCCESS');
      clearCart();
    } else {
      setError('Hubo un problema al enviar tu pedido. Intenta más tarde.');
    }
  };

  // ... (Resto del renderizado igual que antes) ...
  // Para ahorrar espacio en la respuesta, mantengo el resto del componente igual
  // ya que solo cambió la lógica de handleSubmitOrder.
  
  // --- Renderizado para Carrito Vacío + Historial ---
  if (cart.length === 0 && currentStep !== 'SUCCESS' && currentStep !== 'HISTORY_VIEW' && currentStep !== 'OTP_VERIFICATION') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faBoxOpen} className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif text-amber-900 mb-4">Tu cotización está vacía</h1>
          <p className="text-gray-600 mb-8">Parece que aún no has agregado ningún pan delicioso a tu lista.</p>
          <Link 
            href="/" 
            className="inline-block px-8 py-3 bg-amber-900 text-white font-bold rounded-full hover:bg-amber-800 transition-colors shadow-md"
          >
            Volver al catálogo
          </Link>
        </div>

        {/* Sección de Acceso a Historial */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto border-t-4 border-gray-400">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">¿Ya has hecho pedidos antes?</h2>
            <p className="text-gray-600 mb-6 text-sm">Ingresa tu número de WhatsApp para ver tu historial de pedidos y su estado.</p>
            
            <div className="flex flex-col gap-4">
              <input 
                type="tel" 
                placeholder="Tu número (10 dígitos)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-center text-lg tracking-widest"
                maxLength={10}
              />
              <button 
                onClick={handleRequestCode}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : (
                  <>
                    <span>Ver mis pedidos</span>
                    <FontAwesomeIcon icon={faHistory} />
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // --- Renderizado de Historial ---
  if (currentStep === 'HISTORY_VIEW') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-amber-900">Mis Pedidos</h1>
          <Link href="/" className="text-amber-900 hover:underline">Volver al inicio</Link>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No encontramos pedidos asociados a este número.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                  <p className="font-bold text-gray-800 text-lg">{order.date}</p>
                  <p className="text-sm text-gray-600">{order.itemsCount} productos</p>
                </div>
                <div className="text-center md:text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'Pending' ? 'Pendiente' :
                     order.status === 'Confirmed' ? 'Confirmado' :
                     order.status === 'Delivered' ? 'Entregado' : order.status}
                  </span>
                  <p className="text-xl font-bold text-amber-900">${order.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Renderizado Normal (Carrito con productos) ---
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-serif text-amber-900 mb-8 text-center">
        {currentStep === 'SUCCESS' ? '¡Pedido Recibido!' : 'Resumen de tu Cotización'}
      </h1>

      {currentStep !== 'SUCCESS' && currentStep !== 'OTP_VERIFICATION' && currentStep !== 'ORDER_DETAILS' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-amber-50 text-amber-900 font-bold text-sm uppercase tracking-wide border-b border-amber-100">
            <div className="col-span-6">Producto</div>
            <div className="col-span-2 text-center">Precio</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          <div className="divide-y divide-gray-100">
            {cart.map((item, index) => (
              <div key={`${item.productId}-${item.sizeId}-${item.designId}-${index}`} className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                <div className="col-span-6 flex items-center gap-4 w-full">
                  <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{item.productName}</h3>
                    <p className="text-sm text-gray-500">
                      Tamaño: {item.sizeName} {item.weight && <span className="text-gray-400">({item.weight})</span>}
                    </p>
                    {item.designName && <p className="text-sm text-gray-500">Diseño: {item.designName}</p>}
                  </div>
                </div>
                <div className="col-span-2 text-gray-600 font-medium md:text-center w-full flex justify-between md:block">
                  <span className="md:hidden text-sm text-gray-400">Precio:</span>
                  ${item.price.toFixed(2)}
                </div>
                <div className="col-span-2 text-gray-800 font-bold md:text-center w-full flex justify-between md:block">
                  <span className="md:hidden text-sm text-gray-400">Cantidad:</span>
                  {item.quantity}
                </div>
                <div className="col-span-2 flex items-center justify-between md:justify-center gap-4 w-full">
                  <span className="md:hidden text-sm text-gray-400">Subtotal:</span>
                  <span className="font-bold text-amber-900">${(item.price * item.quantity).toFixed(2)}</span>
                  <button 
                    onClick={() => removeFromCart(item.productId, item.sizeId, item.designId)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2"
                    title="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <button onClick={clearCart} className="text-gray-500 hover:text-red-500 text-sm underline">Vaciar carrito</button>
            <div className="text-xl md:text-2xl font-bold text-amber-900">
              Total Estimado: ${totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Sección de Flujo de Pedido (Visible si hay carrito o si estamos en pasos intermedios) */}
      {(cart.length > 0 || currentStep === 'OTP_VERIFICATION' || currentStep === 'ORDER_DETAILS' || currentStep === 'SUCCESS') && (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto border-t-4 border-amber-500 transition-all duration-500">
          
          {currentStep === 'PHONE_INPUT' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faWhatsapp} className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificar Teléfono</h2>
              <p className="text-gray-600 mb-6">Ingresa tu número de WhatsApp para enviarte un código de verificación.</p>
              
              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <input 
                  type="tel" 
                  placeholder="Tu número (10 dígitos)" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-lg tracking-widest"
                  maxLength={10}
                />
                <button 
                  onClick={handleRequestCode}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-amber-900 text-white font-bold rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Solicitar Código'}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          )}

          {currentStep === 'OTP_VERIFICATION' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ingresa el Código</h2>
              <p className="text-gray-600 mb-6">Hemos enviado un código de 4 dígitos a <strong>{phone}</strong></p>
              
              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <input 
                  type="text" 
                  placeholder="0000" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-center text-2xl tracking-[0.5em] font-bold"
                  maxLength={4}
                />
                <button 
                  onClick={handleVerifyCode}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-amber-900 text-white font-bold rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Verificar'}
                </button>
                <button onClick={() => setCurrentStep('PHONE_INPUT')} className="text-sm text-gray-500 underline">Cambiar número</button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          )}

          {currentStep === 'ORDER_DETAILS' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Detalles de Entrega</h2>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><FontAwesomeIcon icon={faUser} /></span>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega Deseada</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                    <input 
                      type="date" 
                      value={date}
                      min={getMinDate()}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <p className="text-xs text-amber-600 mt-1">* Mínimo 2 días de anticipación para garantizar frescura.</p>
                </div>

                <button 
                  onClick={handleSubmitOrder}
                  disabled={isLoading}
                  className="w-full mt-6 px-6 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : (
                    <>
                      <span>Solicitar Pedido</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </>
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
          )}

          {currentStep === 'SUCCESS' && (
            <div className="text-center animate-fade-in py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Solicitud Enviada!</h2>
              <p className="text-gray-600 mb-8 text-lg px-8">
                Hemos recibido tu solicitud de cotización. <br/>
                Revisaremos la disponibilidad para la fecha seleccionada y te contactaremos por WhatsApp para confirmar.
              </p>
              <Link 
                href="/" 
                className="inline-block px-8 py-3 bg-amber-900 text-white font-bold rounded-full hover:bg-amber-800 transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
