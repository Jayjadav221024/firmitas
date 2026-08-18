import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Compact banner that opens every inner page, so each route has its own identity.
function PageHero({ eyebrow, title, description, breadcrumb }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-brand-blue to-blue-900 text-white py-14 md:py-20">
      <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(circle_at_top_right,rgba(242,101,34,0.18),transparent_60%)] pointer-events-none"></div>
      <div className="absolute bottom-[-40%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <nav className="flex items-center gap-1.5 text-xs text-blue-200 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={13} />
          <span className="text-white font-semibold">{breadcrumb || title}</span>
        </nav>

        {eyebrow && (
          <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">
            {eyebrow}
          </span>
        )}

        <h1 className="font-heading font-extrabold text-3xl md:text-5xl tracking-tight leading-tight mb-4">
          {title}
        </h1>

        {description && (
          <p className="text-blue-100 leading-relaxed max-w-2xl text-sm md:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

export default PageHero;
