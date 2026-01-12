import { ProcessStep } from '../lib/api';

interface HowItWorksSectionProps {
  steps?: ProcessStep[];
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  
  // Iconos por defecto si no vienen de la API
  const getIcon = (code: string) => {
    switch(code) {
      case 'quote': return '📝';
      case 'phone': return '📞';
      case 'truck': return '🚚';
      default: return '✨';
    }
  };

  // Pasos por defecto si no hay datos
  const defaultSteps = [
    { id: 1, order: 1, title: "Solicita tu cotización", description: "Solicita una cotización de los panes que necesitas...", iconCode: "quote" },
    { id: 2, order: 2, title: "Revisión y Confirmación", description: "Revisaremos tu pedido y nos pondremos en contacto...", iconCode: "phone" },
    { id: 3, order: 3, title: "Pago y Seguimiento", description: "Te avisaremos para que realices el pago...", iconCode: "truck" }
  ];

  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
          
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
                  En Panciencia, no solo te ofrecemos productos excepcionales, sino también una conexión auténtica con nuestras raíces.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {displaySteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                    <div className="mb-6">
                        <span className="text-6xl text-amber-900">{getIcon(step.iconCode)}</span>
                    </div>
                    <h5 className="text-xl font-bold text-amber-900 mb-4 uppercase tracking-wide">
                        {step.title}
                    </h5>
                    <p className="text-gray-600 leading-relaxed px-4">
                        {step.description}
                    </p>
                </div>
              ))}
          </div>
      </div>
    </section>
  );
}
