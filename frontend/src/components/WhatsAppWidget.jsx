import { MessageSquare } from 'lucide-react';
import { company } from '../data/company';

const whatsappHref = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
  `Hello ${company.name}, I am interested in a B2B wholesale quote.`
)}`;

function WhatsAppWidget() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25d366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform group animate-bounce [animation-duration:3s]"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare size={26} className="fill-white stroke-none" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-xs font-semibold whitespace-nowrap group-hover:ml-2">
        Chat on WhatsApp
      </span>

      {/* Animated outer ring for accent pulse */}
      <span className="absolute -inset-1 rounded-full border-2 border-[#25d366] animate-ping opacity-35 pointer-events-none"></span>
    </a>
  );
}

export default WhatsAppWidget;
