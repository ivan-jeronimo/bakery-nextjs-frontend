import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cotizaciones - Panadería La Espiga",
  description: "Solicita una cotización para tu evento o pedido especial.",
};

export default function Cotizaciones() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-amber-900 mb-6 text-center">Solicitar Cotización</h1>
      <p className="text-gray-600 mb-8 text-center">
        Cuéntanos qué necesitas y nos pondremos en contacto contigo lo antes posible.
      </p>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" 
            placeholder="Tu nombre"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" 
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input 
            type="tel" 
            id="telefono" 
            name="telefono" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" 
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo de Pedido</label>
          <select 
            id="tipo" 
            name="tipo" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border"
          >
            <option>Pan para Evento</option>
            <option>Pastel Personalizado</option>
            <option>Mesa de Postres</option>
            <option>Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">Detalles del Pedido</label>
          <textarea 
            id="mensaje" 
            name="mensaje" 
            rows={4} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border" 
            placeholder="Describe lo que necesitas (cantidad, fecha, sabores, etc.)"
            required
          ></textarea>
        </div>

        <div>
          <button 
            type="submit" 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
