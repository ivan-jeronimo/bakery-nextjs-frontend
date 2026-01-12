interface HistorySectionProps {
  title: string;
  description: string;
  image: string;
}

export default function HistorySection({ title, description, image }: HistorySectionProps) {
  return (
    <section className="pt-8 pb-20 bg-white">
      <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
              
              {/* Columna Texto */}
              <div className="w-full md:w-1/2 space-y-8">
                  
                  {/* Encabezado con estilo */}
                  <div className="border-l-4 border-amber-500 pl-6">
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 leading-tight">
                          {title}
                      </h3>
                  </div>

                  {/* Cuerpo del texto */}
                  <div 
                    className="text-gray-600 text-lg leading-loose font-light text-justify prose prose-amber max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }} 
                  />
              </div>

              {/* Columna Imagen */}
              <div className="w-full md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-700">
                      <div className="absolute inset-0 border-4 border-white/20 z-10 rounded-2xl pointer-events-none"></div>
                      <img 
                          src={image} 
                          alt="Historia de la panadería" 
                          className="w-full h-auto object-cover"
                      />
                  </div>
                  {/* Elemento decorativo detrás */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-100 rounded-full -z-10"></div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-amber-50 rounded-full -z-10"></div>
              </div>

          </div>
      </div>
    </section>
  );
}
