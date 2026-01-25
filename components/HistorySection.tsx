interface HistorySectionProps {
  title: string;
  description: string;
  image: string;
}

export default function HistorySection({ title, description, image }: HistorySectionProps) {
  return (
    <section id="sobre-nosotros" className="pt-8 pb-16 md:pb-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

              {/* Columna Texto */}
              <div className="w-full md:w-1/2 space-y-6 md:space-y-8">

                  {/* Encabezado con estilo */}
                  <div className="border-l-4 border-amber-500 pl-4 md:pl-6">
                      <h3 className="text-3xl sm:text-4xl font-serif font-bold text-amber-900 leading-tight">
                          {title}
                      </h3>
                  </div>

                  {/* Cuerpo del texto */}
                  <div
                    className="text-gray-600 text-base sm:text-lg leading-relaxed sm:leading-loose font-light text-justify prose prose-amber max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
              </div>

              {/* Columna Imagen */}
              <div className="w-full md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform md:rotate-1 hover:rotate-0 transition-transform duration-700">
                      <div className="absolute inset-0 border-4 border-white/20 z-10 rounded-2xl pointer-events-none"></div>
                      <img
                          src={image}
                          alt="Historia de la panadería"
                          className="w-full h-auto object-cover"
                      />
                  </div>
                  {/* Elemento decorativo detrás */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 md:w-24 md:h-24 bg-amber-100 rounded-full -z-10"></div>
                  <div className="absolute -top-4 -left-4 w-12 h-12 md:w-16 md:h-16 bg-amber-50 rounded-full -z-10"></div>
              </div>

          </div>
      </div>
    </section>
  );
}
