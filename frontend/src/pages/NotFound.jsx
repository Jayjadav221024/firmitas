import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

function NotFound() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
        <span className="font-heading font-extrabold text-7xl bg-gradient-to-r from-brand-blue to-blue-600 bg-clip-text text-transparent block mb-4">
          404
        </span>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-slate-900 tracking-tight mb-4">
          This page could not be found
        </h1>
        <p className="text-slate-600 mb-8">
          The link may be outdated, or the page may have moved. Head back to the homepage or browse the product catalog.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-brand-blue text-white hover:bg-blue-900 font-semibold px-8 py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            Back to Home
          </Link>
          <Link
            to="/products"
            className="bg-white border border-slate-200 hover:border-brand-blue text-slate-700 hover:text-brand-blue font-semibold px-8 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            Browse Products <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
