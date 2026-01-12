export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
          
          {/* Encabezado */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="mb-6 flex justify-center">
                  <img 
                      src="https://cdn-icons-png.flaticon.com/512/2829/2829753.png" 
                      alt="Icono Panadería" 
                      className="w-20 h-20 opacity-80"
                  />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-amber-900 font-medium mb-6">
                  Haz un pedido para una fecha especial
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                  En Panciencia, no solo te ofrecemos productos excepcionales, sino también una conexión auténtica con nuestras raíces. Cada elección que haces es una forma de apoyar la tradición local.
              </p>
          </div>

          {/* Pasos (3 Columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              
              {/* Paso 1 */}
              <div className="flex flex-col items-center">
                  <div className="mb-6">
                      {/* Icono Cotización */}
                      <span className="text-6xl text-amber-900">📝</span>
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4 uppercase tracking-wide">
                      Solicita tu cotización
                  </h5>
                  <p className="text-gray-600 leading-relaxed px-4">
                      Solicita una cotización de los panes que necesitas y recibe un estimado de tu pedido.
                  </p>
              </div>

              {/* Paso 2 */}
              <div className="flex flex-col items-center">
                  <div className="mb-6">
                      {/* Icono Confirmación */}
                      <span className="text-6xl text-amber-900">📞</span>
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4 uppercase tracking-wide">
                      Revisión y Confirmación
                  </h5>
                  <p className="text-gray-600 leading-relaxed px-4">
                      Revisaremos tu pedido y nos pondremos en contacto contigo para aclarar dudas e indicarte si podemos entregarte en la fecha seleccionada.
                  </p>
              </div>

              {/* Paso 3 */}
              <div className="flex flex-col items-center">
                  <div className="mb-6">
                      {/* Icono Entrega */}
                      <span className="text-6xl text-amber-900">🚚</span>
                  </div>
                  <h5 className="text-xl font-bold text-amber-900 mb-4 uppercase tracking-wide">
                      Pago y Seguimiento
                  </h5>
                  <p className="text-gray-600 leading-relaxed px-4">
                      Te avisaremos para que realices el pago. Podrás dar seguimiento a tu pedido con tu número telefónico y recibirlo en la dirección indicada o recogerlo.
                  </p>
              </div>

          </div>
      </div>
    </section>
  );
}
