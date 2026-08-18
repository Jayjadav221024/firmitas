import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Closing call-to-action reused at the bottom of the content pages.
function CtaBand({
  title = 'Ready to place a bulk enquiry?',
  description = 'Send us your requirement and we will come back directly with availability, pricing, and documentation.',
  primaryLabel = 'Request Bulk Quote',
  primaryTo = '/enquiry',
  secondaryLabel = 'Get in Touch',
  secondaryTo = '/contact',
}) {
  return (
    <section className="py-10 md:py-16 bg-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-tr from-brand-blue to-blue-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(circle_at_top_right,rgba(242,101,34,0.2),transparent_60%)] pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white tracking-tight mb-3">
              {title}
            </h2>
            <p className="text-blue-100 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={primaryTo}
                className="w-full sm:w-auto bg-brand-orange text-white hover:bg-orange-600 font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {primaryLabel}
                <ChevronRight size={18} />
              </Link>
              <Link
                to={secondaryTo}
                className="w-full sm:w-auto bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBand;
