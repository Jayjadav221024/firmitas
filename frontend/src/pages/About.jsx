import { Link } from 'react-router-dom';
import {
  Award,
  BriefcaseMedical,
  FileText,
  Truck,
  Users,
  Check,
  Info,
  ChevronRight,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import CtaBand from '../components/CtaBand';
import ScrollReveal from '../components/ScrollReveal';
import { company, registrationDetails } from '../data/company';
import { totalProductCount } from '../data/products';

// Being new is a real trade-off. Saying so plainly beats pretending otherwise.
const newCompanyReality = {
  advantages: [
    'You speak to a decision maker, not a call queue',
    'No rigid minimum order thresholds to clear',
    'A first order can be structured around what you actually need',
    'Pricing is not padded to cover layers of resale margin',
  ],
  honest: [
    'We are building our supplier network, so some lines take longer to confirm',
    'We do not have years of trading history to point at — only the paperwork on each order',
    'We would rather decline a line than promise stock we cannot verify',
  ],
};

const values = [
  {
    icon: FileText,
    title: 'Documentation over promises',
    text: 'Every claim we make about a consignment should be checkable on paper. Batch, manufacturing and expiry details are shared before you confirm, not after.',
  },
  {
    icon: Check,
    title: 'Say no when the answer is no',
    text: 'If we cannot source a line, or cannot verify a batch to our own satisfaction, we say so instead of substituting quietly or stretching a lead time.',
  },
  {
    icon: Users,
    title: 'One person owns your order',
    text: 'The same person handles the enquiry, the quote and the dispatch updates — so nothing gets lost in a handover between departments.',
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="WHO WE ARE"
        title="About Firmitas 1"
        breadcrumb="About Us"
        description="A newly founded pharmaceutical distribution company built to supply licensed pharmacies, hospitals, clinics, and healthcare buyers."
      />

      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Graphics Columns */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
              <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-brand-orange/10 blur-3xl rounded-full"></div>

              <div className="space-y-4">
                <ScrollReveal animation="fade-in-up" delay={0}>
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
                    alt="Clinical Research"
                    className="rounded-2xl shadow-md object-cover h-60 w-full hover:scale-[1.02] transition-transform duration-300"
                  />
                </ScrollReveal>
                <ScrollReveal animation="fade-in-up" delay={150}>
                  <img
                    src="https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=600&q=80"
                    alt="Quality Laboratory"
                    className="rounded-2xl shadow-md object-cover h-40 w-full hover:scale-[1.02] transition-transform duration-300"
                  />
                </ScrollReveal>
              </div>

              <div className="space-y-4 pt-8">
                <ScrollReveal animation="fade-in-up" delay={100}>
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"
                    alt="Medical Warehouse"
                    className="rounded-2xl shadow-md object-cover h-40 w-full hover:scale-[1.02] transition-transform duration-300"
                  />
                </ScrollReveal>
                <ScrollReveal animation="scale-up" delay={250}>
                  <div className="bg-brand-blue text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-center h-60">
                    <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-white/5 rounded-full"></div>
                    <Award size={36} className="text-brand-orange mb-4" />
                    <h4 className="font-heading font-bold text-lg mb-1">Built Compliance-First</h4>
                    <p className="text-blue-100 text-xs leading-relaxed">Set up from day one to operate within drug licensing and documentation norms.</p>
                  </div>
                </ScrollReveal>
              </div>

            </div>

            {/* Right Information Columns */}
            <div className="lg:col-span-6">
              <ScrollReveal animation="fade-in-up" delay={0}>
                <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">OUR STORY</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight leading-snug mb-6">
                  A New Supply Partner for Pharmacy &amp; Hospital Essentials
                </h2>
              </ScrollReveal>

              <ScrollReveal animation="fade-in-up" delay={100}>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Firmitas 1 is a newly founded pharmaceutical distribution company built to supply licensed pharmacies, hospitals, clinics, and healthcare buyers with ethical drugs, surgical essentials, critical care medicines, and OTC products.
                </p>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  The business started from a simple observation about pharmaceutical distribution: buyers rarely struggle to find a supplier, they struggle to get a straight answer. Whether a line is actually available, what the batch and expiry look like, what the real lead time is — these are routine questions that too often take three phone calls to answer.
                </p>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  So we built the business around answering them. You deal directly with the people who own the outcome. No layered account management, no minimum-order politics — just direct answers on availability, pricing, and documentation, and the flexibility to structure a first order around what you actually need.
                </p>
              </ScrollReveal>

              {/* Capability Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                <ScrollReveal animation="fade-in-up" delay={150}>
                  <BriefcaseMedical size={26} className="text-brand-blue mb-2 stroke-[1.75]" />
                  <div className="font-heading font-bold text-sm text-slate-900 leading-snug">Four Product Divisions</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{totalProductCount} lines listed across ethical, surgical, critical care &amp; OTC</div>
                </ScrollReveal>

                <ScrollReveal animation="fade-in-up" delay={225}>
                  <FileText size={26} className="text-brand-blue mb-2 stroke-[1.75]" />
                  <div className="font-heading font-bold text-sm text-slate-900 leading-snug">Documentation Backed</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">Batch and invoice papers with every consignment</div>
                </ScrollReveal>

                <ScrollReveal animation="fade-in-up" delay={300}>
                  <Truck size={26} className="text-brand-blue mb-2 stroke-[1.75]" />
                  <div className="font-heading font-bold text-sm text-slate-900 leading-snug">Bulk B2B Supply</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">Quantities quoted per enquiry, no rigid minimums</div>
                </ScrollReveal>

                <ScrollReveal animation="fade-in-up" delay={375}>
                  <Users size={26} className="text-brand-blue mb-2 stroke-[1.75]" />
                  <div className="font-heading font-bold text-sm text-slate-900 leading-snug">Direct Founder Access</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">Speak to a decision maker on every order</div>
                </ScrollReveal>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* HOW WE WORK / VALUES */}
      <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">WHAT WE STAND ON</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                Three Rules We Do Not Bend
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, text }, idx) => (
              <ScrollReveal key={title} animation="fade-in-up" delay={idx * 100} className="flex">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* THE HONEST PART */}
      <section className="py-12 md:py-20 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">STRAIGHT TALK</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                What Being a New Company Actually Means
              </h2>
              <p className="text-slate-600 text-sm">
                Most distributor websites open with numbers they cannot substantiate. We would rather set out both sides and let you judge.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal animation="fade-in-up" delay={100} className="flex">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 w-full">
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-5">What works in your favour</h3>
                <ul className="space-y-3.5">
                  {newCompanyReality.advantages.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={13} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-up" delay={200} className="flex">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 w-full">
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-5">What we are still building</h3>
                <ul className="space-y-3.5">
                  {newCompanyReality.honest.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 mt-0.5">
                        <Info size={13} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* Company particulars — only renders what has been filled in */}
          <ScrollReveal animation="scale-up" delay={150}>
            <div className="mt-10 bg-brand-blue text-white rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-heading font-bold text-xl mb-3">Company particulars</h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-4">
                    {company.legalName} operates from {company.addressLines[company.addressLines.length - 1].replace(/\.$/, '')}.
                    Registration and licence documents are shared directly with buyers on request during onboarding.
                  </p>
                  <Link
                    to="/contact"
                    className="text-white font-bold text-sm inline-flex items-center gap-1 hover:text-brand-orange transition-colors"
                  >
                    Request our documents <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="space-y-3">
                  {registrationDetails.length > 0 ? (
                    registrationDetails.map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4 bg-white/10 rounded-xl px-4 py-3 text-sm">
                        <span className="text-blue-100">{label}</span>
                        <span className="font-semibold text-right">{value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/10 rounded-xl px-5 py-4 text-sm text-blue-100 leading-relaxed">
                      Drug licence and GST registration details are provided directly to buyers during onboarding, along
                      with the supplier documentation for your first consignment.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      <CtaBand
        title="Want to know how we work?"
        description="Read our sourcing and quality commitments, or send us a requirement directly."
        secondaryLabel="View Compliance"
        secondaryTo="/compliance"
      />
    </>
  );
}

export default About;
