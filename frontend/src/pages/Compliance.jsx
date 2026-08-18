import { Award, FileText, ShieldCheck, Globe, Snowflake, ClipboardList, Info, Package } from 'lucide-react';
import PageHero from '../components/PageHero';
import CtaBand from '../components/CtaBand';
import ScrollReveal from '../components/ScrollReveal';

const commitments = [
  {
    icon: Award,
    title: 'Licensed Manufacturers',
    text: 'We source only from licensed, GMP-certified manufacturing units',
  },
  {
    icon: FileText,
    title: 'Batch Documentation',
    text: 'Batch number, manufacturing and expiry details on every supply',
  },
  {
    icon: ShieldCheck,
    title: 'Expiry & Storage Checks',
    text: 'Shelf-life verified and temperature-sensitive items handled accordingly',
  },
  {
    icon: Globe,
    title: 'Transparent Paperwork',
    text: 'Full order documentation shared upfront, before you commit',
  },
];

const shipsWithOrder = [
  'Tax invoice with the complete product and batch listing',
  'Batch number, manufacturing date and expiry date per line item',
  'Certificate of Analysis on request for applicable products',
  'Manufacturer and supplier details for the consignment',
  'Export documentation and customs paperwork for overseas consignments',
];

const buyerDocuments = [
  {
    title: 'Valid drug licence',
    text: 'Required for all prescription (Schedule H / H1) products. A copy is collected once during onboarding and refreshed on renewal.',
  },
  {
    title: 'GST registration certificate',
    text: 'Required for invoicing. Over-the-counter lines and surgical consumables need this but not a drug licence.',
  },
  {
    title: 'Import permit (export orders only)',
    text: 'For overseas consignments, the destination country\'s import permit and drug control approvals must be in place before dispatch.',
  },
];

const storagePractices = [
  {
    icon: Package,
    title: 'Ambient stock',
    text: 'Held below the temperature stated on the pack, away from direct sunlight, in a dry and sanitised space with pest control in place.',
  },
  {
    icon: Snowflake,
    title: 'Cold-chain stock',
    text: 'Insulin and other 2°C to 8°C lines are held and shipped in temperature-controlled packaging. Cold-chain handling is confirmed at quotation, before the order is placed.',
  },
  {
    icon: ClipboardList,
    title: 'Shelf-life discipline',
    text: 'Stock is issued on a first-expiry-first-out basis. If a batch has a shorter remaining shelf life than usual, we tell you before you confirm rather than after delivery.',
  },
];

function Compliance() {
  return (
    <>
      <PageHero
        eyebrow="HOW WE WORK"
        title="Our Sourcing & Quality Commitments"
        breadcrumb="Compliance"
        description="These are the standards we hold ourselves to on every consignment. We are happy to share supplier and batch documentation with any buyer before an order is confirmed."
      />

      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {commitments.map(({ icon: Icon, title, text }, idx) => (
              <ScrollReveal key={title} animation="fade-in-up" delay={idx * 100} className="flex">
                <div
                  className="flex flex-col items-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-colors text-center w-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-slate-900 text-sm">{title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Documentation detail */}
          <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal animation="fade-in-left" delay={150} className="flex">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 w-full">
                <h2 className="font-heading font-bold text-xl text-slate-900 mb-4">What ships with every order</h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  {shipsWithOrder.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-right" delay={250} className="flex">
              <div className="bg-brand-blue text-white rounded-3xl p-8 relative overflow-hidden w-full flex flex-col justify-center">
                <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/5 rounded-full"></div>
                <ShieldCheck size={32} className="text-brand-orange mb-4 relative z-10" />
                <h2 className="font-heading font-bold text-xl mb-4 relative z-10">Buyer verification</h2>
                <p className="text-blue-100 text-sm leading-relaxed mb-4 relative z-10">
                  Prescription and schedule-controlled products are supplied only against a valid drug licence and the documentation your jurisdiction requires.
                </p>
                <p className="text-blue-100 text-sm leading-relaxed relative z-10">
                  All sourcing remains subject to local drug control permissions, import clearance permits, and validated medical licences.
                </p>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* WHAT WE NEED FROM THE BUYER */}
      <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden border-y border-slate-100">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">ONBOARDING</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                Documents We Need From You
              </h2>
              <p className="text-slate-600">
                Collected once, at the start of the relationship — not repeatedly with every order.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {buyerDocuments.map(({ title, text }, index) => (
              <ScrollReveal key={title} animation="fade-in-up" delay={index * 100} className="flex">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm w-full">
                  <span className="font-heading font-extrabold text-3xl text-slate-100 block mb-3 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* STORAGE & HANDLING */}
      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">STORAGE &amp; HANDLING</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                How Stock Is Held Before It Reaches You
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storagePractices.map(({ icon: Icon, title, text }, idx) => (
              <ScrollReveal key={title} animation="fade-in-up" delay={idx * 150} className="flex">
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Boundaries */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal animation="fade-in-left" delay={100} className="flex">
              <div className="bg-red-50/60 border border-red-100 rounded-3xl p-8 w-full">
                <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-3">What we do not supply</h3>
                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <li className="flex gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></span>
                    Narcotic and psychotropic substances
                  </li>
                  <li className="flex gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></span>
                    Schedule X controlled drugs
                  </li>
                  <li className="flex gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></span>
                    Any prescription product to a buyer without a valid drug licence
                  </li>
                  <li className="flex gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5"></span>
                    Direct supply to members of the public — we are a B2B distributor only
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-right" delay={200} className="flex">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 w-full">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
                  <Info size={22} />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-3">If something is wrong with a consignment</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Check the goods against the invoice and batch listing on receipt. Raise any short supply, damage or
                  batch discrepancy with us directly, with photographs and the invoice reference, and we will take it up
                  with the manufacturer or stockist on your behalf.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Returns of pharmaceutical goods are governed by the manufacturer&rsquo;s policy and applicable drug
                  rules — we will tell you plainly what is and is not possible for the specific product rather than
                  leaving it open.
                </p>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      <CtaBand
        title="Need our documentation before ordering?"
        description="Ask for supplier and batch paperwork upfront — we will share it before you confirm anything."
      />
    </>
  );
}

export default Compliance;
