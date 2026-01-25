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
import OrderDetailModal from '../../components/OrderDetailModal';

export default function CotizacionesPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  
  // Estados de Sesión
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(''); // Nombre del Usuario (Perfil)
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Datos Formulario Login
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Datos Formulario Pedido
  const [orderName, setOrderName] = useState(''); // Nombre para la Orden (Destinatario)
  const [orderDate, setOrderDate] = useState('');
  const [orderTime, setOrderTime] = useState('');

  // Datos Historial
  const [history, setHistory] = useState<OrderHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Modal de Detalle de Orden
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Generar opciones de hora
  const timeOptions = [];
  for (let hour = 8; hour <= 20; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    timeOptions.push(`${hourStr}:00`);
    if (hour < 20) {
      timeOptions.push(`${hourStr}:30`);
    }
  }

  // --- Funciones ---

  const loadHistory = async () => {
    setLoadingHistory(true);
    const orders = await getOrderHistory();
    setHistory(orders);
    setLoadingHistory(false);
  };

  // --- Efectos ---

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedName = localStorage.getItem('user_name'); // Este es el FullName del usuario
    
    if (token) {
      setIsAuthenticated(true);
      if (savedName) {
        setUserName(savedName);
        setOrderName(savedName); // Pre-llenamos el destinatario con el nombre del usuario
      }
      loadHistory();
    }
  }, []);

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
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
    setUserName('');
    setOrderName('');
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
      
      // Si el backend devuelve el nombre del usuario, lo guardamos y usamos
      if (response.fullName) {
        setUserName(response.fullName);
        setOrderName(response.fullName); // Pre-llenar destinatario
      } else {
        // Si no, intentamos recuperar del localStorage
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
    if (!orderName || !orderDate || !orderTime) {
      setError('Completa nombre, fecha y hora.');
      return;
    }
    setError('');
    setIsLoading(true);

    const deliveryDateTime = new Date(`${orderDate}T${orderTime}:00Z`).toISOString();

    // NOTA: No actualizamos 'user_name' (perfil) aquí, porque este es el nombre del destinatario de la orden.
    // Si quisiéramos actualizar el perfil, usaríamos otro endpoint.

    const success = await createOrder({
      customerName: orderName, // Enviamos el nombre específico para esta orden
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
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 border-b border-gray-100 pb-4 gap-4">
        <h1 className="text-2xl md:text-3xl font-serif text-amber-900 text-center md:text-left">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-4xl mx-auto">
          
          {/* Opción 1: Ir al Catálogo */}
          <div className="text-center p-6 md:p-8 bg-amber-50 rounded-xl border border-amber-100 h-full flex flex-col justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-amber-900 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                <FontAwesomeIcon icon={faShoppingBasket} className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-amber-900 mb-3 md:mb-4">Empieza tu pedido</h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Explora nuestro catálogo de panes tradicionales y añade tus favoritos.</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-2 md:px-8 md:py-3 bg-amber-900 text-white font-bold rounded-full hover:bg-amber-800 transition-colors shadow-md text-sm md:text-base"
            >
              Ir al Catálogo
            </Link>
          </div>

          {/* Opción 2: Iniciar Sesión (Historial) */}
          <div className="text-center p-6 md:p-8 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FontAwesomeIcon icon={faHistory} className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-gray-800 mb-3 md:mb-4">¿Ya tienes pedidos?</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">Ingresa tu número para ver el estado de tus pedidos anteriores.</p>
            
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
                <button onClick={handleRequestCode} disabled={isLoading} className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm md:text-base">
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
                <button onClick={handleVerifyCode} disabled={isLoading} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm md:text-base">
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
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            
            {/* 1. Resumen del Carrito */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 md:p-6 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-bold text-amber-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShoppingBasket} /> Tu Pedido Actual
                </h2>
                {cart.length > 0 && (
                  <button onClick={clearCart} className="text-xs text-red-500 hover:underline">Vaciar</button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <p className="text-gray-500 mb-6">No tienes productos en tu cotización.</p>
                  <Link href="/" className="inline-block px-6 py-2 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition-colors text-sm font-bold">
                    Ir al Catálogo
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cart.map((item, index) => (
                    <div key={index} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Imagen */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border border-gray-200 flex-shrink-0 self-start sm:self-center">
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Info Principal */}
                      <div className="flex-grow w-full sm:w-auto">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-800 text-base sm:text-lg line-clamp-2">{item.productName}</h3>
                          <button onClick={() => removeFromCart(item.productId, item.sizeId, item.designId)} className="text-red-400 hover:text-red-600 p-1 sm:hidden">
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-2">{item.sizeName} {item.weight && `(${item.weight})`}</p>
                        {item.designName && <p className="text-xs text-gray-400 mb-2">{item.designName}</p>}
                        
                        {/* Precios y Controles (Fila inferior en móvil) */}
                        <div className="flex justify-between items-center mt-2 sm:mt-0">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{item.quantity}</span> x ${item.price.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-amber-900 text-base sm:text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.productId, item.sizeId, item.designId)} className="text-red-400 hover:text-red-600 p-2 hidden sm:block">
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <span className="font-bold text-gray-600 text-sm md:text-base">Total Estimado</span>
                    <span className="text-xl md:text-2xl font-bold text-amber-900">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Formulario de Envío (Solo si hay carrito) */}
            {cart.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border-t-4 border-green-500 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Finalizar Cotización</h2>
                
                {!isAuthenticated ? (
                  // Login para No Autenticados (Integrado)
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4 text-sm md:text-base">Para enviar tu pedido, necesitamos verificar tu número.</p>
                    {!showOtpInput ? (
                      <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                        <input 
                          type="tel" 
                          placeholder="Tu número (10 dígitos)" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="flex-grow px-4 py-2 border rounded-lg w-full"
                          maxLength={10}
                        />
                        <button onClick={handleRequestCode} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto text-sm md:text-base">
                          {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Enviar Código'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                        <input 
                          type="text" 
                          placeholder="Código (6 dígitos)" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="flex-grow px-4 py-2 border rounded-lg text-center tracking-widest w-full"
                          maxLength={6}
                        />
                        <button onClick={handleVerifyCode} disabled={isLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto text-sm md:text-base">
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
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de quien recibe</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400"><FontAwesomeIcon icon={faUser} /></span>
                          <input 
                            type="text" 
                            value={orderName}
                            onChange={(e) => setOrderName(e.target.value)} // Solo actualiza el nombre de la orden
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Entrega</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400"><FontAwesomeIcon icon={faClock} /></span>
                          <select 
                            value={orderTime}
                            onChange={(e) => setOrderTime(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                          >
                            <option value="">Selecciona hora</option>
                            {timeOptions.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleSubmitOrder}
                      disabled={isLoading}
                      className="w-full mt-4 px-6 py-2 md:py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center gap-2 text-sm md:text-base"
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
          <div className="lg:col-span-1 order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
              <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faHistory} className="text-gray-400" /> Historial
                </h2>
              </div>
              
              <div className="p-3 md:p-4">
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
                  <div className="space-y-3 max-h-[300px] lg:max-h-[500px] overflow-y-auto pr-1">
                    {history.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
                      
                      return (
                        <div 
                          key={order.id} 
                          className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleOrderClick(order.id)}
                        >
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

      {/* Modal de Detalle de Orden */}
      <OrderDetailModal 
        orderId={selectedOrderId} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
      />

    </div>
  );
}
