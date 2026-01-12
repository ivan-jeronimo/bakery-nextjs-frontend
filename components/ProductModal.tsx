"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTruck, faPhone, faCreditCard, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from 'react';
import { getProductDetail, ProductDetail, SizeDetail, DesignVariant } from '../lib/api';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  weight: string;
  price: string;
  image: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(6);
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState<SizeDetail | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<DesignVariant | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      setLoading(true);
      setDetail(null);
      setQuantity(6);
      setIsAdded(false);
      
      getProductDetail(product.id)
        .then(data => {
          setDetail(data);
          if (data && data.sizes.length > 0) {
            const firstSize = data.sizes[0];
            setSelectedSize(firstSize);
            if (firstSize.availableDesigns.length > 0) {
              setSelectedDesign(firstSize.availableDesigns[0]);
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (selectedSize && selectedDesign) {
      const designExists = selectedSize.availableDesigns.find(d => d.designId === selectedDesign.designId);
      if (!designExists && selectedSize.availableDesigns.length > 0) {
        setSelectedDesign(selectedSize.availableDesigns[0]);
      }
    }
  }, [selectedSize]);

  if (!isOpen || !product) return null;

  const currentPrice = selectedSize ? selectedSize.price : 0;
  const totalPrice = currentPrice * quantity;

  const increaseQuantity = () => setQuantity(prev => prev + 6);
  const decreaseQuantity = () => setQuantity(prev => Math.max(6, prev - 6));

  const handleAddToCart = () => {
    if (!detail || !selectedSize) return;

    console.log("Añadiendo al carrito:", {
      size: selectedSize.sizeName,
      weight: selectedSize.weightInGrams
    });

    addToCart({
      productId: detail.id,
      productName: detail.name,
      sizeId: selectedSize.sizeId,
      sizeName: selectedSize.sizeName,
      // Aseguramos que si weightInGrams existe, se use, si no, cadena vacía
      weight: selectedSize.weightInGrams ? `${selectedSize.weightInGrams}g` : '',
      designId: selectedDesign?.designId,
      designName: selectedDesign?.designName,
      price: currentPrice,
      quantity: quantity,
      image: product.image 
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>

        {/* Columna Izquierda: Imagen */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-sm">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Columna Derecha: Detalles */}
        <div className="w-full md:w-1/2 p-8 flex flex-col space-y-6">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <FontAwesomeIcon icon={faSpinner} spin className="w-10 h-10 text-amber-900" />
              <p className="text-gray-500">Cargando detalles...</p>
            </div>
          ) : detail ? (
            <>
              {/* Título */}
              <div>
                <h2 className="text-3xl font-serif font-bold text-amber-900 mb-2">{detail.name}</h2>
                <div className="flex items-center text-amber-500 text-sm">
                  <span>★★★★★</span>
                  <span className="text-gray-400 ml-2">(Producto Artesanal)</span>
                </div>
              </div>

              {/* Descripción */}
              <div className="text-gray-600 text-sm leading-relaxed">
                <p>{detail.description}</p>
              </div>

              {/* Selector de Tamaño */}
              {detail.sizes.length > 0 && (
                <div>
                  <p className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">Tamaño:</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.sizes.map((size) => (
                      <button
                        key={size.sizeId}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md border text-sm transition-all ${
                          selectedSize?.sizeId === size.sizeId
                            ? 'bg-amber-900 text-white border-amber-900 shadow-md'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-amber-500'
                        }`}
                      >
                        {size.sizeName} ({size.weightInGrams}g)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selector de Diseño */}
              {selectedSize && selectedSize.availableDesigns.length > 0 && (
                <div>
                  <p className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">Diseño:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSize.availableDesigns.map((design) => (
                      <button
                        key={design.variantId}
                        onClick={() => setSelectedDesign(design)}
                        className={`px-4 py-2 rounded-md border text-sm transition-all ${
                          selectedDesign?.variantId === design.variantId
                            ? 'bg-amber-100 text-amber-900 border-amber-900 font-medium'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-amber-500'
                        }`}
                        title={design.designDescription}
                      >
                        {design.designName}
                      </button>
                    ))}
                  </div>
                  {selectedDesign && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      {selectedDesign.designDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Precio Total */}
              <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="text-sm text-gray-500">Precio unitario: ${currentPrice.toFixed(2)}</p>
                  <p className="text-3xl font-bold text-amber-900">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Selector de Cantidad y Botón */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={decreaseQuantity}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    readOnly 
                    className="w-12 text-center text-gray-800 focus:outline-none bg-transparent"
                  />
                  <button 
                    onClick={increaseQuantity}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-grow font-bold py-3 px-6 rounded-full transition-all uppercase tracking-wide text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                    isAdded 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-amber-900 text-white hover:bg-amber-800'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                      ¡Añadido!
                    </>
                  ) : (
                    'Añadir a cotización'
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 italic text-center w-full">
                * Pedido mínimo de 6 piezas
              </p>
            </>
          ) : (
            <div className="text-center text-red-500 py-10">
              <p>No se pudieron cargar los detalles del producto.</p>
            </div>
          )}

          {/* Información Adicional */}
          <div className="space-y-3 text-xs text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-amber-700" />
              <span>Dudas: 630 95 18 55</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
