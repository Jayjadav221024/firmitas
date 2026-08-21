import { useState } from 'react';
import { Phone, Mail, Globe, MapPin, Clock, CheckCircle, ClipboardList } from 'lucide-react';
import PageHero from '../components/PageHero';
import FaqAccordion from '../components/FaqAccordion';
import ScrollReveal from '../components/ScrollReveal';
import { company } from '../data/company';
import { faqs } from '../data/faqs';

import { useWebsiteContent } from '../hooks/useWebsiteContent';

// Getting these into the first message usually removes a full round trip.
const enquiryChecklist = [
  'Product or molecule name, with the strength you need',
  'Pack size and total quantity required',
  'Delivery city, or destination country for exports',
  'Any specific manufacturer or brand preference',
  'Drug licence and GST details, for prescription lines',
  'Documentation you need with the consignment (COA, batch papers)',
];

function Contact() {
  const [sent, setSent] = useState(false);
  const { getField } = useWebsiteContent('contact');
  const { getField: getSiteField } = useWebsiteContent('site-wide');

  const phone = getSiteField('top-nav-bar', 'primaryPhone', company.phone);
  const email = getSiteField('top-nav-bar', 'primaryEmail', company.email);
  const hours = getSiteField('company-contact-details', 'workingHours', company.hours);
  const address = getSiteField('company-contact-details', 'officeAddress', company.address?.full || 'Ahmedabad, Gujarat, India');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <>
      <PageHero
        eyebrow={getField('contact-header', 'eyebrow', 'CONTACT US')}
        title={getField('contact-header', 'title', 'Get in Touch')}
        breadcrumb="Contact"
        description={getField('contact-header', 'subtitle', 'Reach us directly by phone, email, or the form below. The same person who takes your enquiry handles the quote and dispatch.')}
      />

      <section className="py-12 md:py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

            {/* Left Contact Details Card */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <ScrollReveal animation="fade-in-left" className="flex flex-col gap-6 h-full grow">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">Call Support</h3>
                      <a href={company.phoneHref} className="text-slate-700 hover:text-brand-blue font-semibold text-sm block mt-1">
                        {company.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">Email Enquiries</h3>
                      <a href={`mailto:${company.email}`} className="text-slate-700 hover:text-brand-blue font-semibold text-sm block mt-1">
                        {company.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">Business Hours</h3>
                      <p className="text-slate-700 text-sm mt-1 leading-relaxed">
                        {company.hours}
                        <span className="block text-xs text-slate-500 mt-1">
                          Closed on Sundays and public holidays. For urgent requirements, call or WhatsApp rather than emailing.
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                      <Globe size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">Official Website</h3>
                      <a href={company.websiteHref} className="text-slate-700 hover:text-brand-blue font-semibold text-sm block mt-1" target="_blank" rel="noreferrer">
                        {company.website}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">Corporate HQ Location</h3>
                      <p className="text-slate-700 text-sm mt-1 leading-relaxed">
                        {company.addressLines.map((line) => (
                          <span key={line} className="block">{line}</span>
                        ))}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Embedded Google Map */}
                <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-60 relative grow">
                  <iframe
                    title="Firmitas 1 Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.6979261882417!2d72.585022!3d23.034861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAyJzA1LjUiTiA3MsKwMzUnMDYuMSJF!5e0!3m2!1sen!2sin!4v1692270000000!5m2!1sen!2sin"
                    className="w-full h-full border-0 absolute top-0 left-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Feedback Form */}
            <div className="lg:col-span-7 flex">
              <ScrollReveal animation="fade-in-right" delay={150} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm flex flex-col w-full h-full">
                <h2 className="font-heading font-bold text-xl text-slate-900 mb-6">Leave us a Message</h2>

                {sent && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">
                    <CheckCircle size={18} className="shrink-0" />
                    Thank you for your message. We will get in touch with you shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-500 mb-1.5">Your Name *</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue focus:bg-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none transition-colors text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address *</label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue focus:bg-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none transition-colors text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-500 mb-1.5">Subject</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue focus:bg-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none transition-colors text-sm"
                      placeholder="e.g. Logistics clearance / Generic sourcing enquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-500 mb-1.5">Message / Inquiry Details *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="6"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-blue focus:bg-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none transition-colors text-sm"
                      placeholder="Enter your message details..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-blue-900 text-white font-semibold py-3.5 rounded-xl shadow-md transition-colors cursor-pointer text-sm font-heading"
                  >
                    Send Message
                  </button>

                </form>
              </ScrollReveal>
            </div>

          </div>

          {/* What to include in an enquiry */}
          <ScrollReveal animation="fade-in-up" delay={200}>
            <div className="mt-8 bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                  <ClipboardList size={22} />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-slate-900">What to include in your enquiry</h2>
                  <p className="text-slate-500 text-xs mt-1">The more of this you send up front, the faster the quote comes back.</p>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {enquiryChecklist.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20 bg-white relative border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 md:px-8">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">COMMON QUESTIONS</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 text-sm">
                The questions first-time buyers actually ask us, answered without the sales gloss.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={150}>
            <FaqAccordion items={faqs} />
          </ScrollReveal>

        </div>
      </section>
    </>
  );
}

export default Contact;
