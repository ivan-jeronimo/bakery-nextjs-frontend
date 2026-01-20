"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faCreditCard, faUser, faCalendarAlt, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { getOrderById, OrderDetail, initiatePayment } from '../lib/api';

interface OrderDetailModalProps {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({ orderId, isOpen, onClose }: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false); // Estado para el botón de pago

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      getOrderById(orderId)
        .then(data => setOrder(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  const formatDate = (isoDate: string) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('es-MX', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const handlePayment = async () => {
    if (!order) return;
    setPaying(true);
    
    const initPoint = await initiatePayment(order.id);
    
    if (initPoint) {
      // Redirigir a Mercado Pago
      window.location.href = initPoint;
    } else {
      alert("No se pudo iniciar el pago. Intenta de nuevo más tarde.");
      setPaying(false);
    }
  };

  const showPayButton = order?.status === 'Accepted' && order?.paymentStatus === 'Pending';

  // Cálculo seguro del total general
  const calculateOrderTotal = () => {
    if (!order) return 0;
    if (order.totalAmount !== undefined && order.totalAmount !== null) return parseFloat(order.totalAmount.toString());
    
    return order.items.reduce((sum, item) => {
      const price = parseFloat(item.unitPrice.toString());
      const quantity = item.quantity;
      const itemTotal = item.subtotal !== undefined ? parseFloat(item.subtotal.toString()) : (price * quantity);
      return sum + itemTotal;
    }, 0);
  };

  const orderTotal = calculateOrderTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-8">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="w-10 h-10 text-amber-900 mb-4" />
            <p className="text-gray-500">Cargando detalles del pedido...</p>
          </div>
        ) : order ? (
          <>
            <div className="border-b border-gray-100 pb-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Pedido #{order.orderNumber}</h2>
                  <p className="text-sm text-gray-500">Realizado el {formatDate(order.orderDate)}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200">
                    Pedido: {order.status}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200">
                    Pago: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Información del Cliente y Entrega */}
              <div className="bg-amber-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1 flex items-center gap-2"><FontAwesomeIcon icon={faUser} className="w-3 h-3" /> Cliente</p>
                  <p className="font-bold text-gray-800">{order.customerName}</p>
                  <p className="text-gray-600">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 flex items-center gap-2"><FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" /> Fecha de Entrega</p>
                  <p className="font-bold text-gray-800 capitalize">{formatDate(order.deliveryDate)}</p>
                </div>
              </div>

              {/* Notas (si existen) */}
              {order.notes && (
                <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                  <p className="text-gray-500 mb-1 flex items-center gap-2"><FontAwesomeIcon icon={faStickyNote} className="w-3 h-3" /> Notas</p>
                  <p className="text-gray-700 italic">"{order.notes}"</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-700 mb-3 uppercase text-xs tracking-wide">Productos</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {order.items.map((item, index) => {
                    const price = parseFloat(item.unitPrice.toString());
                    const itemTotal = item.subtotal !== undefined ? parseFloat(item.subtotal.toString()) : (price * item.quantity);
                    
                    return (
                      <div key={index} className="flex justify-between items-start text-sm">
                        <div>
                          <p className="font-bold text-gray-800">
                            {item.quantity}x {item.productName} 
                            {item.weightInGrams && <span className="text-gray-500 font-normal ml-1">({item.weightInGrams}g)</span>}
                          </p>
                          <p className="text-gray-500">
                            {item.sizeName} {item.designName && item.designName !== 'N/A' && `- ${item.designName}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-700">${itemTotal.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">${price.toFixed(2)} c/u</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-amber-900">${orderTotal.toFixed(2)}</span>
              </div>

              {showPayButton && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button 
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {paying ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCreditCard} />
                        Pagar con Mercado Pago
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Serás redirigido a la pasarela de pago segura de Mercado Pago.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-red-500">
            <p>No se pudo cargar la información del pedido.</p>
          </div>
        )}
      </div>
    </div>
  );
}
