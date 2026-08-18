import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.q}
            className={`bg-white rounded-2xl border transition-colors ${
              isOpen ? 'border-brand-blue/30 shadow-md' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 text-left px-6 py-4 cursor-pointer"
            >
              <span className="font-heading font-bold text-sm text-slate-900 leading-snug">
                {item.q}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-brand-blue' : 'text-slate-400'
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
