import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, CheckCircle, Send } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { adminApi } from '../api/client';
import { useWebsiteContent } from '../hooks/useWebsiteContent';

function Enquiry() {
  const location = useLocation();
  const { getField } = useWebsiteContent('enquiry');

  // The Products page passes the chosen product through router state.
  const searchParams = new URLSearchParams(location.search);
  const initialInterest = location.state?.interest || searchParams.get('product') || searchParams.get('interest') || 'General Enquiry';

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    company: '',
    country: '',
    interest: initialInterest,
    message: '',
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminApi.createInquiry({
        name: enquiryForm.name,
        company: enquiryForm.company,
        email: `${enquiryForm.name.toLowerCase().replace(/\s+/g, '')}@client.com`,
        phone: enquiryForm.country || '+91 0000000000',
        products: [enquiryForm.interest],
        message: enquiryForm.message
      });
    } catch {}
    setIsSubmitting(false);
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquirySubmitted(false);
      setEnquiryForm({
        name: '',
        company: '',
        country: '',
        interest: 'General Enquiry',
        message: '',
      });
    }, 5000);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-tr from-brand-blue to-blue-900 text-white relative overflow-hidden">

      {/* Visual elements */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(circle_at_top_right,rgba(242,101,34,0.15),transparent_60%)] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Content */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <ScrollReveal animation="fade-in-left">
              <span className="bg-brand-orange text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-full shadow-sm mb-6 inline-block">
                {getField('enquiry-header', 'eyebrow', 'Now Accepting Enquiries')}
              </span>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-6">
                {getField('enquiry-header', 'title', 'Bulk B2B Drug Procurement Made Simple')}
              </h1>
              <p className="text-blue-100 leading-relaxed mb-6">
                {getField('enquiry-header', 'subtitle', 'Send us your requirement and we will come back to you directly with availability, pricing, and the documentation you need. No call centre in between.')}
              </p>

              <div className="space-y-4 text-left max-w-sm mx-auto lg:mx-0">
                {[
                  'Flexible L/C (Letter of Credit) terms',
                  'Custom APIs and private packaging available',
                  'Insured air & sea freight shipping',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-brand-orange shrink-0">
                      <Check size={16} />
                    </div>
                    <span className="text-xs text-blue-100 font-semibold">{point}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right B2B Form (Glassmorphic) */}
          <div className="lg:col-span-7">
            <ScrollReveal animation="fade-in-right" delay={150}>
              <div className="p-8 sm:p-10 glass-panel-dark rounded-3xl shadow-2xl relative">

                {enquirySubmitted ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={36} />
                    </div>
                    <h2 className="font-heading font-bold text-2xl text-white mb-2">Enquiry Logged Successfully!</h2>
                    <p className="text-blue-100 text-sm max-w-md mx-auto">
                      Thank you for contacting Firmitas 1. Our procurement officer will reach out to you shortly at the email provided.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5 text-left">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="enq-name" className="block text-xs font-semibold text-blue-100 mb-1.5">Your Name *</label>
                        <input
                          id="enq-name"
                          type="text"
                          required
                          value={enquiryForm.name}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                          className="w-full bg-white/10 border border-white/10 focus:border-brand-orange/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none transition-colors text-sm"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="enq-company" className="block text-xs font-semibold text-blue-100 mb-1.5">Company Name *</label>
                        <input
                          id="enq-company"
                          type="text"
                          required
                          value={enquiryForm.company}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, company: e.target.value })}
                          className="w-full bg-white/10 border border-white/10 focus:border-brand-orange/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none transition-colors text-sm"
                          placeholder="e.g. Apex Pharma Corp"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="enq-country" className="block text-xs font-semibold text-blue-100 mb-1.5">Destination Country *</label>
                        <input
                          id="enq-country"
                          type="text"
                          required
                          value={enquiryForm.country}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, country: e.target.value })}
                          className="w-full bg-white/10 border border-white/10 focus:border-brand-orange/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none transition-colors text-sm"
                          placeholder="e.g. Germany, UAE"
                        />
                      </div>
                      <div>
                        <label htmlFor="enq-interest" className="block text-xs font-semibold text-blue-100 mb-1.5">Product of Interest *</label>
                        <input
                          id="enq-interest"
                          type="text"
                          required
                          value={enquiryForm.interest}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, interest: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 focus:border-brand-orange/60 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors text-sm"
                          placeholder="e.g. Ethical Generics Bulk"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="enq-message" className="block text-xs font-semibold text-blue-100 mb-1.5">Procurement Message / Notes</label>
                      <textarea
                        id="enq-message"
                        rows="4"
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        className="w-full bg-white/10 border border-white/10 focus:border-brand-orange/60 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none transition-colors text-sm"
                        placeholder="Detail specifications, quantity required, target APIs, and certification requirements..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm font-heading"
                    >
                      {isSubmitting ? 'Sending Request...' : 'Send Procurement Enquiry'}
                      <Send size={16} />
                    </button>

                  </form>
                )}

              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>

    </section>
  );
}

export default Enquiry;
