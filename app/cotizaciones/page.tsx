"use client";

import { useCart } from '../../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, faCheckCircle, faSpinner, faArrowRight, faCalendarAlt, faUser, faHistory, faBoxOpen, faSignOutAlt, faShoppingBasket, faTimes,
  faClock, faUtensils, faShoppingBag, faFlagCheckered, faBan, faTimesCircle, faCreditCard, faMoneyBillWave, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sendVerificationCode, verifyCode, createOrder, getOrderHistory, OrderHistoryItem } from '../../lib/api';

export default function CotizacionesPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  
  // Estados de Sesión
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Datos Formulario Login
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Datos Formulario Pedido
  const [orderName, setOrderName] = useState('');
  const [orderDate, setOrderDate] = useState('');

  // Datos Historial
  const [history, setHistory] = useState<OrderHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- Efectos ---

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedName = localStorage.getItem('user_name');
    
    if (token) {
      setIsAuthenticated(true);
      if (savedName) {
        setUserName(savedName);
        setOrderName(savedName);
      }
      loadHistory();
    }
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const orders = await getOrderHistory();
    setHistory(orders);
    setLoadingHistory(false);
  };

  // --- Helpers de Formato e Iconos ---

  const formatDate = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PendingReview': return { icon: faClock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pendiente de Revisión' };
      case 'Accepted': return { icon: faCheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Aceptada' };
      case 'Rejected': return { icon: faTimesCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Rechazada' };
      case 'Preparation': return { icon: faUtensils, color: 'text-orange-600', bg: 'bg-orange-100', label: 'En Preparación' };
      case 'ReadyForPickup': return { icon: faShoppingBag, color: 'text-green-600', bg: 'bg-green-100', label: 'Lista para Entregar' };
      case 'Completed': return { icon: faFlagCheckered, color: 'text-green-800', bg: 'bg-green-200', label: 'Completada' };
      case 'Cancelled': return { icon: faBan, color: 'text-gray-600', bg: 'bg-gray-200', label: 'Cancelada' };
      default: return { icon: faClock, color: 'text-gray-600', bg: 'bg-gray-100', label: status };
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'Pending': return { icon: faCreditCard, color: 'text-gray-400', label: 'Pago Pendiente' };
      case 'InProcess': return { icon: faSpinner, color: 'text-yellow-500', label: 'Pago en Revisión' };
      case 'Approved': return { icon: faMoneyBillWave, color: 'text-green-600', label: 'Pagado' };
      case 'Rejected': return { icon: faExclamationCircle, color: 'text-red-500', label: 'Pago Rechazado' };
      case 'Refunded': return { icon: faArrowRight, color: 'text-purple-500', label: 'Reembolsado' };
      case 'Cancelled': return { icon: faBan, color: 'text-gray-400', label: 'Pago Cancelado' };
      default: return null;
    }
  };

  // --- Manejadores de Sesión ---

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    setIsAuthenticated(false);
    setHistory([]);
    setPhone('');
    setOtp('');
    setShowOtpInput(false);
    setSuccessMessage('');
  };

  const handleRequestCode = async () => {
    if (!phone || phone.length < 10) {
      setError('Número inválido (10 dígitos)');
      return;
    }
    setError('');
    setIsLoading(true);
    const success = await sendVerificationCode(phone);
    setIsLoading(false);
    if (success) setShowOtpInput(true);
    else setError('Error al enviar código.');
  };

  const handleVerifyCode = async () => {
    if (!otp || otp.length < 6) {
      setError('Código inválido (6 dígitos)');
      return;
    }
    setError('');
    setIsLoading(true);
    const response = await verifyCode(phone, otp);
    setIsLoading(false);
    
    if (response.isValid) {
      setIsAuthenticated(true);
      loadHistory();
      if (response.fullName) {
        setUserName(response.fullName);
        setOrderName(response.fullName);
      } else {
        const savedName = localStorage.getItem('user_name');
        if (savedName) {
          setUserName(savedName);
          setOrderName(savedName);
        }
      }
    } else {
      setError('Código incorrecto.');
    }
  };

  // --- Manejadores de Pedido ---

  const handleSubmitOrder = async () => {
    if (!orderName || !orderDate) {
      setError('Completa nombre y fecha.');
      return;
    }
    setError('');
    setIsLoading(true);

    const deliveryDateTime = new Date(`${orderDate}T10:00:00Z`).toISOString();

    localStorage.setItem('user_name', orderName);
    setUserName(orderName);

    const success = await createOrder({
      customerName: orderName,
      customerPhone: phone, 
      deliveryDate: deliveryDateTime,
      items: cart.map(item => ({
        productId: item.productId,
        sizeId: item.sizeId,
        designId: item.designId || null,
        quantity: item.quantity
      }))
    });

    setIsLoading(false);

    if (success) {
      setSuccessMessage('¡Pedido enviado con éxito! Te contactaremos pronto.');
      clearCart();
      loadHistory();
    } else {
      setError('Error al enviar pedido.');
    }
  };

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  // --- RENDERIZADO ---

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-3xl font-serif text-amber-900">
          {isAuthenticated ? (userName ? `Hola, ${userName}` : 'Bienvenido') : 'Cotización'}
        </h1>
        {isAuthenticated && (
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-2 font-medium">
            <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
          </button>
        )}
      </div>

      {/* Mensaje de Éxito Global */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 text-center animate-fade-in">
          <strong className="font-bold">¡Listo! </strong>
          <span className="block sm:inline">{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* --- CASO ESPECIAL: CARRITO VACÍO Y NO AUTENTICADO --- */}
      {cart.length === 0 && !isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
          
          {/* Opción 1: Ir al Catálogo */}
          <div className="text-center p-8 bg-amber-50 rounded-xl border border-amber-100 h-full flex flex-col justify-center">
            <div className="w-20 h-20 bg-white text-amber-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <FontAwesomeIcon icon={faShoppingBasket} className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif text-amber-900 mb-4">Empieza tu pedido</h2>
            <p className="text-gray-600 mb-8">Explora nuestro catálogo de panes tradicionales y añade tus favoritos.</p>
            <Link 
              href="/" 
              className="inline-block px-8 py-3 bg-amber-900 text-white font-bold rounded-full hover:bg-amber-800 transition-colors shadow-md"
            >
              Ir al Catálogo
            </Link>
          </div>

          {/* Opción 2: Iniciar Sesión (Historial) */}
          <div className="text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col justify-center">
            <div className="w-20 h-20 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faHistory} className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">¿Ya tienes pedidos?</h2>
            <p className="text-gray-600 mb-6">Ingresa tu número para ver el estado de tus pedidos anteriores.</p>
            
            {!showOtpInput ? (
              <div className="flex flex-col gap-3 max-w-xs mx-auto w-full">
                <input 
                  type="tel" 
                  placeholder="Tu número (10 dígitos)" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center"
                  maxLength={10}
                />
                <button onClick={handleRequestCode} disabled={isLoading} className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50">
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Ver mis pedidos'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-w-xs mx-auto w-full animate-fade-in">
                <p className="text-xs text-green-600">Código enviado a {phone}</p>
                <input 
                  type="text" 
                  placeholder="000000" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center tracking-widest font-bold"
                  maxLength={6}
                />
                <button onClick={handleVerifyCode} disabled={isLoading} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Verificar'}
                </button>
                <button onClick={() => setShowOtpInput(false)} className="text-xs text-gray-500 underline">Cambiar número</button>
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

        </div>
      ) : (
        // --- VISTA NORMAL (Con Carrito o Autenticado) ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: Carrito y Formulario */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Resumen del Carrito */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShoppingBasket} /> Tu Pedido Actual
                </h2>
                {cart.length > 0 && (
                  <button onClick={clearCart} className="text-xs text-red-500 hover:underline">Vaciar</button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500 mb-6">No tienes productos en tu cotización.</p>
                  <Link href="/" className="inline-block px-6 py-2 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors text-sm font-bold">
                    Ir al Catálogo
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cart.map((item, index) => (
                    <div key={index} className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-800">{item.productName}</h3>
                        <p className="text-xs text-gray-500">{item.sizeName} {item.weight && `(${item.weight})`}</p>
                        {item.designName && <p className="text-xs text-gray-400">{item.designName}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.productId, item.sizeId, item.designId)} className="text-red-400 hover:text-red-600 p-2">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <span className="font-bold text-gray-600">Total Estimado</span>
                    <span className="text-2xl font-bold text-amber-900">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Formulario de Envío (Solo si hay carrito) */}
            {cart.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border-t-4 border-green-500 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Finalizar Cotización</h2>
                
                {!isAuthenticated ? (
                  // Login para No Autenticados (Integrado)
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Para enviar tu pedido, necesitamos verificar tu número.</p>
                    {!showOtpInput ? (
                      <div className="flex gap-2 max-w-sm mx-auto">
                        <input 
                          type="tel" 
                          placeholder="Tu número (10 dígitos)" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="flex-grow px-4 py-2 border rounded-lg"
                          maxLength={10}
                        />
                        <button onClick={handleRequestCode} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
                          {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Enviar Código'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 max-w-sm mx-auto">
                        <input 
                          type="text" 
                          placeholder="Código (6 dígitos)" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="flex-grow px-4 py-2 border rounded-lg text-center tracking-widest"
                          maxLength={6}
                        />
                        <button onClick={handleVerifyCode} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
                          {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Verificar'}
                        </button>
                      </div>
                    )}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  </div>
                ) : (
                  // Formulario para Autenticados
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400"><FontAwesomeIcon icon={faUser} /></span>
                          <input 
                            type="text" 
                            value={orderName}
                            onChange={(e) => {
                              setOrderName(e.target.value);
                              setUserName(e.target.value);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="Tu nombre"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400"><FontAwesomeIcon icon={faCalendarAlt} /></span>
                          <input 
                            type="date" 
                            value={orderDate}
                            min={getMinDate()}
                            onChange={(e) => setOrderDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleSubmitOrder}
                      disabled={isLoading}
                      className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : (
                        <>
                          <span>Solicitar Pedido</span>
                          <FontAwesomeIcon icon={faArrowRight} />
                        </>
                      )}
                    </button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Historial (Ocupa 1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faHistory} className="text-gray-400" /> Historial
                </h2>
              </div>
              
              <div className="p-4">
                {!isAuthenticated ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <p className="mb-4">Inicia sesión para ver tus pedidos anteriores.</p>
                    {/* Si hay carrito, el login está en la izquierda, así que aquí solo mostramos mensaje */}
                    {cart.length > 0 && (
                      <p className="text-xs text-amber-600">Completa tu verificación en el formulario de la izquierda.</p>
                    )}
                  </div>
                ) : loadingHistory ? (
                  <div className="text-center py-8 text-gray-400">
                    <FontAwesomeIcon icon={faSpinner} spin /> Cargando...
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No tienes pedidos registrados.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {history.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
                      
                      return (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                          {/* Encabezado: Número de Orden y Estado (Misma línea) */}
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-800 text-sm break-all mr-2">
                              #{order.orderNumber || order.id}
                            </span>
                            <div className="flex gap-1 flex-shrink-0">
                              {/* Icono Estado Pedido */}
                              <span 
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full border ${statusConfig.bg} ${statusConfig.color} cursor-help`}
                                title={statusConfig.label}
                              >
                                <FontAwesomeIcon icon={statusConfig.icon} className="w-3 h-3" />
                              </span>
                              
                              {/* Icono Estado Pago */}
                              {paymentConfig && order.status !== 'PendingReview' && order.status !== 'Cancelled' && (
                                <span 
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-full border bg-gray-50 text-gray-600 border-gray-200 cursor-help"
                                  title={paymentConfig.label}
                                >
                                  <FontAwesomeIcon icon={paymentConfig.icon} className={`w-3 h-3 ${paymentConfig.color}`} />
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Pie: Fecha y Total */}
                          <div className="flex justify-between items-end text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2">
                            <div>
                              <p>{formatDate(order.date)}</p>
                              <p>{order.itemsCount} sabrosos panes</p>
                            </div>
                            <p className="text-sm font-bold text-amber-900">${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
