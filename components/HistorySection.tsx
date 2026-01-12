export default function HistorySection() {
  return (
    <section className="pt-4 pb-16 bg-white">
      <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-12">
              <div className="w-full md:w-1/2 text-lg text-gray-700 leading-relaxed space-y-6">
                  <p>
                      <span className="text-amber-900 font-bold">Panciencia</span> nació en 2021 en <span className="font-bold">Segura de la Sierra</span>, un pueblo con historia y tradición en la provincia de Jaén. Fundada por <span className="font-bold">Amara y Alejandro</span>, nuestra panadería combina técnicas artesanales con ingredientes de calidad: trabajamos con <span className="font-bold">masa madre</span> y <span className="font-bold">harinas 100% ecológicas</span>, respetando el proceso natural de fermentación para lograr panes con más sabor y mejor digestión.
                  </p>
                  <p>
                      Nuestra misión es ofrecer pan auténtico, hecho con tiempo y dedicación, manteniendo el respeto por las recetas tradicionales. Explora nuestro catálogo y descubre el sabor que une generaciones.
                  </p>
                  <p className="font-bold text-amber-900">
                      Con 💓 desde nuestra panadería de pueblo.
                  </p>
              </div>
              <div className="w-full md:w-1/2">
                  <div className="relative rounded-lg overflow-hidden shadow-xl">
                      <img 
                          src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1000&auto=format&fit=crop" 
                          alt="Elaboración de pan artesanal" 
                          className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
}
