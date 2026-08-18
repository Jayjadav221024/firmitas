import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Globe,
  CheckCircle,
  TrendingUp,
  Users,
  Building2,
  Snowflake,
  FileText,
  ClipboardList,
  ChevronRight,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import CtaBand from '../components/CtaBand';
import ScrollReveal from '../components/ScrollReveal';
import { company } from '../data/company';

// Commitments we can actually keep as a small, new distributor — no invented SLAs.
const commitments = [
  {
    icon: FileText,
    title: 'Documentation before you commit',
    text: 'Batch number, manufacturing date and expiry are shared at quotation stage, not discovered on delivery.',
  },
  {
    icon: ClipboardList,
    title: 'No silent substitution',
    text: 'If the quoted manufacturer or pack is unavailable, we come back and ask before changing anything on your order.',
  },
  {
    icon: Users,
    title: 'One person, start to finish',
    text: `The same contact handles the enquiry, quote and dispatch — reachable on ${company.phone} or WhatsApp during business hours.`,
  },
  {
    icon: ShieldCheck,
    title: 'We decline what we cannot verify',
    text: 'If a batch or supplier does not check out to our own satisfaction, we say no rather than pass the risk on to you.',
  },
];

// What the buyer needs to bring — stated plainly so nothing stalls at the last step.
const buyerRequirements = [
  'A copy of your valid drug licence (for prescription / Schedule H and H1 lines)',
  'Your GST registration certificate',
  'The molecule or product name, strength and pack size you need',
  'Quantity required and the delivery destination',
  'Any specific manufacturer, brand or documentation preference',
];

function WhyChooseUs() {
  return (
    <>
      <PageHero
        eyebrow="OUR STRENGTHS"
        title="Why Healthcare Buyers Choose Firmitas 1"
        breadcrumb="Why Choose Us"
        description="Regulatory discipline, direct sourcing and a single point of contact — the things that actually decide whether a supply relationship works."
      />

      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Info Column */}
            <div className="lg:col-span-5">
              <ScrollReveal animation="fade-in-left">
                <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">WHAT SETS US APART</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight leading-snug mb-6">
                  Built Around Safety, Speed and Straight Answers
                </h2>
                <p className="text-slate-600 mb-8">
                  Every consignment is handled with the regulatory paperwork, storage discipline, and logistics planning that pharmaceutical supply demands.
                </p>
              </ScrollReveal>

              <div className="space-y-6">
                <ScrollReveal animation="fade-in-up" delay={100}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 text-sm">Licensed sourcing only</h3>
                      <p className="text-slate-500 text-xs mt-1">We buy from licensed, GMP-certified manufacturing units and licensed stockists, and operate within Indian drug licensing and documentation norms.</p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-in-up" delay={200}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 shadow-sm">
                      <Snowflake size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 text-sm">Cold-chain handling</h3>
                      <p className="text-slate-500 text-xs mt-1">Temperature-sensitive lines such as insulin are packed and transported to hold 2°C to 8°C, with the handling arrangement confirmed at quotation.</p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-in-up" delay={300}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 shadow-sm">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 text-sm">Storage-appropriate dispatch</h3>
                      <p className="text-slate-500 text-xs mt-1">Goods are held and packed under the humidity, sanitation and temperature conditions each product type requires.</p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-in-up" delay={400}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 shadow-sm">
                      <Globe size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 text-sm">Export enquiries accepted</h3>
                      <p className="text-slate-500 text-xs mt-1">Export consignments are quoted subject to the destination country&rsquo;s import permit and drug control approvals, which we confirm before committing.</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

            </div>

            {/* Right Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal animation="fade-in-up" delay={0} className="flex">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-blue/20 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full">
                  <CheckCircle className="text-brand-orange mb-4" size={28} />
                  <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">Authentic Batches Only</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">We source directly from licensed pharmaceutical companies. Batch documentation accompanies every order, and a Certificate of Analysis is provided on request for applicable products.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-in-up" delay={150} className="flex">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-blue/20 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full">
                  <TrendingUp className="text-brand-orange mb-4" size={28} />
                  <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">Direct Sourcing</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">We buy direct from manufacturers rather than through resale layers, so bulk pricing stays competitive for clinics and regional pharmacies.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-in-up" delay={300} className="flex">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-blue/20 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full">
                  <Users className="text-brand-orange mb-4" size={28} />
                  <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">One Point of Contact</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">The same person handles your enquiry, quote, and dispatch updates — reachable on WhatsApp or phone, without going through a queue.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-in-up" delay={450} className="flex">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-blue/20 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full">
                  <Building2 className="text-brand-orange mb-4" size={28} />
                  <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">Correct Storage Conditions</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Stock held under the humidity, sanitation, and storage conditions that drug licensing norms require for each product type.</p>
                </div>
              </ScrollReveal>
            </div>

          </div>

        </div>
      </section>

      {/* COMMITMENTS */}
      <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">OUR COMMITMENTS</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                Four Things We Hold Ourselves To
              </h2>
              <p className="text-slate-600">
                These are operating rules, not marketing lines. Hold us to them on your first order.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map(({ icon: Icon, title, text }, idx) => (
              <ScrollReveal key={title} animation="fade-in-up" delay={idx * 100} className="flex">
                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* WHAT WE ASK FROM BUYERS */}
      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal animation="fade-in-left">
                <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">WHAT WE ASK FROM YOU</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight leading-snug mb-6">
                  Five Things That Keep an Order Moving
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Supply relationships stall on missing paperwork far more often than on price. Having these ready with
                  your first enquiry usually removes a full round trip from the process.
                </p>
                <Link
                  to="/enquiry"
                  className="text-brand-orange hover:text-brand-blue font-bold text-sm inline-flex items-center gap-1 transition-colors"
                >
                  Start an enquiry <ChevronRight size={16} />
                </Link>
              </ScrollReveal>
            </div>

            <ScrollReveal animation="fade-in-right" delay={150}>
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <ul className="space-y-4">
                  {buyerRequirements.map((requirement, index) => (
                    <li key={requirement} className="flex gap-4 text-sm text-slate-600 leading-relaxed">
                      <span className="w-6 h-6 rounded-lg bg-brand-blue text-white font-heading font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      <CtaBand
        title="Put us to the test with a trial order"
        description="Send a requirement and compare our pricing, documentation and turnaround against your current supplier."
      />
    </>
  );
}

export default WhyChooseUs;
