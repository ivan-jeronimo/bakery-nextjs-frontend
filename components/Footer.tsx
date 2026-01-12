import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative w-full font-sans text-gray-300 pt-[150px] pb-[50px]">
      
      {/* IMAGEN DE FONDO DEL FOOTER */}
      <div className="absolute inset-0 z-0">
          <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop" 
              alt="Fondo Footer" 
              className="w-full h-full object-cover"
          />
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-zinc-900/90 mix-blend-multiply"></div>
      </div>

      {/* DIVISOR ONDULADO SUPERIOR */}
      <div 
          className="absolute top-0 left-0 w-full pointer-events-none z-10 transform rotate-180"
          style={{
              height: '70px',
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI3MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyODAgODZjLTE5LjktMTcuMjEtNDAuMDgtMzkuNjktNzkuODktMzkuNjktNTcuNDkgMC01Ni45MyA0Ni41OS0xMTUgNDYuNTktNTMuNjEgMC01OS43Ni0zOS42Mi0xMTUuNi0zOS42MkM5MjMuNyA1My4yNyA5MjQuMjYgODcgODUzLjg5IDg3Yy04OS4zNSAwLTc4Ljc0LTg3LTE4OC4yLTg3QzU1NCAwIDU0My45NSAxMjEuOCA0MjMuMzIgMTIxLjhjLTEwMC41MiAwLTExNy44NC01NC44OC0xOTEuNTYtNTQuODgtNzcuMDYgMC0xMDAgNDguNTctMTUxLjc1IDQ4LjU3LTQwIDAtNjAtMTIuMjEtODAtMjkuNTF2NTRIMTI4MHoiLz48L2c+PC9zdmc+")`,
              backgroundSize: '100% 70px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom'
          }}
      ></div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Columna 1: Logo y Descripción */}
          <div className="md:col-span-6 space-y-6 pr-0 md:pr-12">
            {/* LOGO CUADRADO */}
            <div className="w-32 h-32 bg-white/10 p-2 rounded-lg backdrop-blur-sm inline-flex items-center justify-center">
                <img 
                    src="https://placehold.co/400x400/transparent/ffffff?text=Logo+Panciencia" 
                    alt="Logo Panciencia" 
                    className="w-full h-full object-contain opacity-90"
                />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Abrimos nuestra panadería online para que puedas disfrutar del sabor tradicional del pan, la bollería artesanal y los productos típicos del pueblo, estés dónde estés.
            </p>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all">
                <span className="font-bold">f</span>
              </a>
              {/* Instagram */}
              <a href="#" className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all">
                <span className="font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Columna 2: Panciencia */}
          <div className="md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-6 font-serif">Panciencia</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-amber-500 transition-colors">Inicio</Link></li>
              <li><Link href="/sobre-nosotros" className="hover:text-amber-500 transition-colors">Sobre nosotros</Link></li>
              <li><Link href="/cotizaciones" className="hover:text-amber-500 transition-colors">Cotizaciones</Link></li>
            </ul>
          </div>

          {/* Columna 3: Ayuda */}
          <div className="md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-6 font-serif">Ayuda</h3>
            <ul className="space-y-3">
              <li><Link href="/contacto" className="hover:text-amber-500 transition-colors">Contacto</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-amber-500 transition-colors">Aviso legal</Link></li>
            </ul>
          </div>

          {/* Columna 4: Vacía */}
          <div className="md:col-span-2"></div>

        </div>
      </div>

      {/* Barra Inferior Copyright */}
      <div className="mt-16 pt-8 border-t border-gray-800 relative z-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Panciencia Panadería – Hecho con ❤️ desde Segura de la Sierra (Jaén)
          </p>
        </div>
      </div>
    </footer>
  );
}
