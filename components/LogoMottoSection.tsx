export default function LogoMottoSection() {
  return (
    <section className="pt-0 pb-4 bg-white text-center relative z-20">
      <div className="container mx-auto px-4 flex flex-col items-center -mt-12">
          <div className="mb-4 w-48 h-48 md:w-64 md:h-64 relative flex items-center justify-center z-30">
              <img 
                  src="https://placehold.co/400x400/transparent/5d4037?text=Logo+Panciencia" 
                  alt="Logo Panciencia" 
                  className="w-full h-full object-contain drop-shadow-sm"
              />
          </div>
          <h2 className="text-2xl md:text-4xl font-serif text-amber-900 font-medium mt-0">
              El buen pan se hace con amor y panciencia
          </h2>
          <div className="w-24 h-1 bg-amber-400 mt-4 rounded-full"></div>
      </div>
    </section>
  );
}
