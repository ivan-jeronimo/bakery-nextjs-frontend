import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 flex justify-center">
          <Link 
              href="/cotizaciones" 
              className="inline-block px-10 py-4 bg-amber-900 border-2 border-amber-900 text-white font-bold text-lg rounded-full hover:bg-white hover:text-amber-900 transition-colors duration-300 uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
              Cotizar pedido
          </Link>
      </div>
    </section>
  );
}
