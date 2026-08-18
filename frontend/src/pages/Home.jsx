import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  ShieldCheck,
  Globe,
  Truck,
  ChevronRight,
  BriefcaseMedical,
  Building2,
  Users,
  Stethoscope,
  Boxes,
  ClipboardList,
  FileText,
  Package,
  Send,
  Award,
  Snowflake,
  TrendingUp,
  Info,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';
import CtaBand from '../components/CtaBand';
import FaqAccordion from '../components/FaqAccordion';
import ScrollReveal from '../components/ScrollReveal';
import { categories, productCountByCategory, totalProductCount } from '../data/products';
import { faqs } from '../data/faqs';

// How an order actually moves through the business, start to finish.
const orderSteps = [
  {
    icon: Send,
    title: 'Send your requirement',
    text: 'Share the molecule or product, strength, pack size and quantity through the enquiry form, WhatsApp or a call.',
  },
  {
    icon: ClipboardList,
    title: 'We confirm and quote',
    text: 'We check availability with the manufacturer or stockist and come back with pricing, pack options and lead time.',
  },
  {
    icon: FileText,
    title: 'Documentation review',
    text: 'Batch, manufacturing and expiry details are shared before you confirm. Drug licence and GST details are collected for prescription lines.',
  },
  {
    icon: Package,
    title: 'Dispatch with paperwork',
    text: 'Goods are checked, packed to the storage conditions the product requires, and dispatched with a full invoice and batch listing.',
  },
];

// Who the business is set up to supply.
const buyerTypes = [
  { icon: Building2, label: 'Retail pharmacies & medical stores' },
  { icon: BriefcaseMedical, label: 'Hospitals & nursing homes' },
  { icon: Stethoscope, label: 'Clinics & polyclinics' },
  { icon: Boxes, label: 'Institutional & bulk buyers' },
  { icon: Globe, label: 'Export buyers & trading houses' },
  { icon: Users, label: 'Sub-distributors & stockists' },
];

// Stats display.
const stats = [
  { value: '4+', label: 'Supply Divisions', desc: 'Generics, surgicals, OTC, & critical care.' },
  { value: '100%', label: 'Audited Sourcing', desc: 'Batch details & certifications verified.' },
  { value: '0', label: 'Rigid Minimums', desc: 'Custom B2B pricing for trial orders.' },
  { value: '24h', label: 'Quote Turnaround', desc: 'Direct pricing sent on enquiry.' },
];

// Showcase products representing our supply quality.
const featuredProducts = [
  {
    id: 'eth-01',
    name: 'Paracetamol Tablets IP',
    composition: 'Paracetamol 500 mg / 650 mg',
    category: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    badge: 'Essential Generic',
    packaging: '10 x 10 Blister (Box of 100)',
    storage: 'Store below 25°C, protect from light',
    use: 'Analgesic and antipyretic — fever and mild to moderate pain.',
  },
  {
    id: 'eth-03',
    name: 'Amoxicillin + Clavulanic Acid Tablets',
    composition: 'Amoxicillin 500 mg + Clavulanic Acid 125 mg',
    category: 'ethical',
    form: 'Tablet',
    rxType: 'Rx',
    badge: 'High Efficacy Antibiotic',
    packaging: '10 x 6 Blister (Box of 60)',
    storage: 'Store below 25°C, protect from moisture',
    use: 'Beta-lactamase resistant antibiotic combination.',
  },
  {
    id: 'surg-02',
    name: 'Absorbent Cotton Wool IP',
    composition: '100% Pure Absorbent Cotton, Sterile & Non-sterile',
    category: 'surgical',
    form: 'Consumable',
    rxType: 'Consumable',
    badge: 'High Absorbency',
    packaging: '100g / 500g Roll — Individually Wrapped',
    storage: 'Store in dry conditions, protect from dust',
    use: 'Wound dressing, skin cleansing, and clinical preparation.',
  },
  {
    id: 'otc-01',
    name: 'Multivitamin & Mineral Capsules',
    composition: 'Essential Vitamins A, C, D3, E, B-Complex + Zinc',
    category: 'otc',
    form: 'Capsule',
    rxType: 'OTC',
    badge: 'Daily Health Support',
    packaging: '3 x 10 Alualu (Box of 30)',
    storage: 'Store below 25°C, protect from moisture',
    use: 'Nutritional supplement to support daily immune function and health.',
  },
  {
    id: 'cri-13',
    name: 'Human Insulin Injection',
    composition: 'Human Insulin 40 IU/ml (100 IU/ml available)',
    category: 'critical',
    form: 'Injection',
    rxType: 'Rx',
    badge: 'Cold Chain Verified',
    coldChain: true,
    packaging: '10 ml Vial / Cartridge',
    storage: 'Cold chain — store at 2°C to 8°C, do not freeze',
    use: 'Insulin therapy for diabetes mellitus. Supplied under cold chain.',
  }
];

const therapeuticSegments = [
  {
    id: 'antibiotics',
    name: 'Antibiotics & Infectives',
    blurb: 'Wide-spectrum anti-bacterial and anti-infective formulations.',
    molecules: ['Amoxicillin + Clavulanic Acid', 'Azithromycin IP', 'Cefixime IP', 'Ciprofloxacin HCl', 'Ofloxacin + Domperidone']
  },
  {
    id: 'diabetic',
    name: 'Anti-Diabetics',
    blurb: 'First-line and combination blood glucose control therapies.',
    molecules: ['Metformin HCl (SR)', 'Glimepiride + Metformin', 'Vildagliptin + Metformin', 'Gliclazide + Metformin', 'Glipizide']
  },
  {
    id: 'cardio',
    name: 'Cardiovascular Care',
    blurb: 'Hypertension management and blood pressure regulation agents.',
    molecules: ['Amlodipine Besylate', 'Telmisartan IP', 'Atorvastatin Calcium', 'Losartan Potassium', 'Ramipril IP']
  },
  {
    id: 'gastro',
    name: 'Gastro & Antacids',
    blurb: 'Proton pump inhibitors and anti-ulcerant lines.',
    molecules: ['Pantoprazole Sodium (EC)', 'Rabeprazole + Domperidone', 'Omeprazole Capsules', 'Ranitidine IP', 'Sucralfate Suspension']
  }
];

function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSegment, setActiveSegment] = useState('antibiotics');

  // Filter featured products based on active tab
  const filteredProducts = activeCategory === 'all'
    ? featuredProducts
    : featuredProducts.filter(p => p.category === activeCategory);

  const selectedSegment = therapeuticSegments.find(s => s.id === activeSegment) || therapeuticSegments[0];

  return (
    <div className="relative">

      {/* Floating particle backgrounds for a premium look */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-brand-blue/5 blur-[120px] animate-float-slow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[50%] rounded-full bg-brand-orange/5 blur-[120px] animate-float-medium"></div>
        <div className="absolute top-[10%] left-[40%] w-[100px] h-[100px] rounded-full bg-brand-blue/10 blur-xl animate-float-fast"></div>
        <div className="absolute top-[50%] left-[15%] w-[80px] h-[80px] rounded-full bg-brand-orange/10 blur-lg animate-float-slow"></div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <ScrollReveal animation="fade-in-up" delay={0}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-brand-blue font-semibold text-xs uppercase tracking-wider mb-6">
                <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse"></span>
                Newly Founded · Now Accepting Bulk Enquiries
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-up" delay={100}>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight mb-6">
                Complete Pharmacy <br className="hidden md:inline" />
                <span className="bg-gradient-to-r from-brand-blue to-blue-600 bg-clip-text text-transparent">Solutions</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-up" delay={200}>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                Firmitas 1 is a newly founded pharmaceutical distributor supplying ethical drugs, surgical essentials, critical care medicines, and OTC products to pharmacies, hospitals, and clinics. Tell us what you need and we will quote it.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  to="/enquiry"
                  className="w-full sm:w-auto bg-brand-orange text-white hover:bg-orange-600 font-semibold px-8 py-4 rounded-xl shadow-lg shadow-brand-orange/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Request Bulk Quote
                  <ChevronRight size={18} />
                </Link>
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-white border border-slate-200 hover:border-brand-blue text-slate-700 hover:text-brand-blue font-semibold px-8 py-4 rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  View Catalog
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column Creative Medical Graphic */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
            <ScrollReveal animation="scale-up" delay={200} className="relative flex justify-center w-full">
              {/* Background glowing rings */}
              <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full border-2 border-brand-orange/10 animate-spin [animation-duration:40s]"></div>
              <div className="absolute w-60 sm:w-80 h-60 sm:h-80 rounded-full border border-brand-blue/10 animate-spin [animation-duration:30s]"></div>

              {/* Composite Visual Image */}
              <div className="relative z-10 w-72 sm:w-[420px] h-[340px] sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Pharmacy & Logistics"
                  className="w-full h-full object-cover"
                />

                {/* Glassmorphic overlay badge inside graphic */}
                <div className="absolute bottom-6 left-6 right-6 p-5 glass-panel rounded-2xl shadow-lg border border-white/30 text-left flex items-start gap-4">
                  <div className="p-3 bg-brand-orange text-white rounded-xl shadow-md">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 text-sm">Documentation With Every Order</h4>
                    <p className="text-slate-600 text-xs mt-0.5">Batch, manufacturing, and expiry details shared before you confirm.</p>
                  </div>
                </div>
              </div>

              {/* Floating stat boxes */}
              <div className="absolute -top-4 -right-2 sm:-right-8 p-4 glass-panel rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 animate-float-slow z-20">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <span className="block font-heading font-extrabold text-slate-900 text-base leading-none">Export</span>
                  <span className="text-[10px] text-slate-500 font-medium">Enquiries Welcome</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-2 sm:-left-8 p-4 glass-panel rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 animate-float-medium z-20">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-brand-blue flex items-center justify-center">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <span className="block font-heading font-extrabold text-slate-900 text-base leading-none">Batch</span>
                  <span className="text-[10px] text-slate-500 font-medium">Documented Supply</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* Trust badge strip below hero */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24 relative z-10">
          <ScrollReveal animation="fade-in-up" delay={400}>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100/80 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">

              <div className="flex items-center gap-4 px-2 py-4 md:py-0 justify-center md:justify-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                  <ShieldCheck size={26} className="stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-base leading-tight">Compliance First</h4>
                  <p className="text-slate-500 text-xs mt-1">Sourced from licensed manufacturers, supplied with full paperwork.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-2 md:px-6 py-4 md:py-0 justify-center md:justify-start">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                  <BriefcaseMedical size={26} className="stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-base leading-tight">Checked Before Dispatch</h4>
                  <p className="text-slate-500 text-xs mt-1">Batch details and shelf life verified, cold-chain items handled accordingly.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-2 md:px-6 py-4 md:py-0 justify-center md:justify-start">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Truck size={26} className="stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-base leading-tight">Bulk Orders Accepted</h4>
                  <p className="text-slate-500 text-xs mt-1">Flexible B2B quantities, quoted per enquiry with no rigid minimums.</p>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* STATS STRIP SECTION */}
      <section className="py-12 bg-slate-50 border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, desc }, idx) => (
              <ScrollReveal key={label} animation="fade-in-up" delay={idx * 75} className="w-full">
                <div className="text-center lg:text-left border-l-2 border-brand-orange/30 pl-4 hover:border-brand-blue transition-colors">
                  <span className="block font-heading font-extrabold text-3xl sm:text-4xl text-brand-blue tracking-tight">
                    {value}
                  </span>
                  <span className="block font-heading font-bold text-sm text-slate-900 mt-1">
                    {label}
                  </span>
                  <span className="block text-slate-500 text-xs mt-1 leading-relaxed">
                    {desc}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY TEASERS */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">WHAT WE DEAL IN</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                Four Supply Divisions, One Partner
              </h2>
              <p className="text-slate-600">
                {totalProductCount} product lines listed across generics, surgical supplies, OTC and critical care — plus custom sourcing for anything outside the list.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(({ id, title, icon: Icon, accent, blurb }, idx) => {
              const isBlue = accent === 'blue';

              return (
                <ScrollReveal key={id} animation="fade-in-up" delay={idx * 100} className="flex flex-col h-full">
                  <Link
                    to={`/products?category=${id}`}
                    className={`bg-slate-50 rounded-3xl p-7 border border-slate-100 hover:bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col h-full ${
                      isBlue ? 'hover:border-brand-blue/30' : 'hover:border-brand-orange/30'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                        isBlue
                          ? 'bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                          : 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                      }`}
                    >
                      <Icon size={28} />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{blurb}</p>
                    <span className="text-brand-blue font-semibold text-xs inline-flex items-center gap-1 group-hover:text-brand-orange transition-colors mt-auto">
                      {productCountByCategory[id]} lines listed <ChevronRight size={14} />
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal animation="fade-in-up" delay={200}>
            <div className="text-center mt-12">
              <Link
                to="/categories"
                className="text-brand-orange hover:text-brand-blue font-bold text-sm inline-flex items-center gap-1 transition-colors"
              >
                See all category details <ChevronRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">PRODUCT PREVIEW</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                Featured Formulations & Essentials
              </h2>
              <p className="text-slate-600">
                A brief showcase of some high-demand products we source. Review specification sheets and batch details before placing a trial order.
              </p>
            </div>
          </ScrollReveal>

          {/* Filtering Tabs */}
          <ScrollReveal animation="fade-in-up" delay={100}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-5 py-2.5 rounded-full text-xs font-heading font-bold transition-all shadow-sm border ${
                  activeCategory === 'all'
                    ? 'bg-brand-blue text-white border-brand-blue'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Show All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-heading font-bold transition-all shadow-sm border ${
                    activeCategory === cat.id
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} animation="fade-in-up" delay={(idx % 3) * 100} className="flex">
                <div
                  className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group w-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      product.rxType === 'Rx'
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : product.rxType === 'OTC'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {product.rxType}
                    </span>
                    {product.badge && (
                      <span className="text-[10px] font-semibold text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100/60">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-slate-900 text-lg leading-snug mb-1 group-hover:text-brand-blue transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium mb-3">
                    {product.composition}
                  </p>

                  <div className="space-y-2.5 border-t border-slate-100 pt-4 mb-6 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-400">Packaging</span>
                      <span className="text-slate-800 text-right">{product.packaging}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-semibold text-slate-400">Storage</span>
                      <span className="text-slate-800 text-right">{product.storage}</span>
                    </div>
                    {product.coldChain && (
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        <Snowflake size={14} className="animate-pulse" />
                        Strict Cold-Chain (2°C – 8°C) Required
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <p className="text-slate-500 text-xs leading-relaxed mb-4 italic">
                      &ldquo;{product.use}&rdquo;
                    </p>

                    <Link
                      to={`/enquiry?product=${encodeURIComponent(product.name)}`}
                      state={{ interest: product.name }}
                      className="w-full bg-slate-50 group-hover:bg-brand-orange group-hover:text-white text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm border border-slate-100 group-hover:border-brand-orange"
                    >
                      Request Availability & Quote
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade-in-up" delay={200}>
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-brand-blue text-slate-700 hover:text-brand-blue font-bold px-7 py-3.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-xs"
              >
                Browse Full Catalog Sourcing List
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* LOGISTICS & QUALITY CONTROL SPOTLIGHT */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">QUALITY ASSURED</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                Specialized Storage & Logistics
              </h2>
              <p className="text-slate-600">
                Medicines demands correct temperatures and absolute authentication. We supply standard pharmaceutical shipments matching WHO-GDP guidelines.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cold Chain */}
            <ScrollReveal animation="fade-in-up" delay={0} className="flex">
              <div className="bg-gradient-to-b from-blue-50/50 to-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 flex flex-col w-full">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-brand-blue flex items-center justify-center mb-6">
                  <Snowflake size={26} className="animate-spin [animation-duration:15s]" />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">Cold-Chain (2°C to 8°C) Integrity</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Insulin, biologicals, and injection lines are kept under cold storage. Transport uses validated thermal containers with pre-frozen gel packs. Temperature graphs are checked at each step.
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 text-brand-blue font-bold text-[10px] uppercase tracking-wider">
                    <Award size={12} /> Tested Packing Protocol
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Sourcing */}
            <ScrollReveal animation="fade-in-up" delay={150} className="flex">
              <div className="bg-gradient-to-b from-orange-50/40 to-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-brand-orange/30 transition-all duration-300 flex flex-col w-full">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center mb-6">
                  <TrendingUp size={26} />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">Direct Authorized Sourcing</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  We buy directly from WHO-GMP certified pharmaceutical manufacturers or their primary licensed distributors. No multi-tier trading or unverified suppliers.
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/60 text-brand-orange font-bold text-[10px] uppercase tracking-wider">
                    <ShieldCheck size={12} /> WHO-GMP Certified Units
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Ambient Storage */}
            <ScrollReveal animation="fade-in-up" delay={300} className="flex">
              <div className="bg-gradient-to-b from-slate-50 to-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col w-full">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-6">
                  <Package size={26} />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">Ambient Sourcing Standards</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Ambient stocks are held below 25°C under dust-free, pest-controlled, and sanitised conditions. Expiry limits are strictly monitored on a first-expiry-first-out basis.
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider">
                    <Clock size={12} /> Shelf Life Discipline
                  </span>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* THERAPEUTIC SEGMENTS EXPLORER */}
      <section className="py-16 md:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">SOURCING CAPABILITIES</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                Molecules Sourced By Therapy Segment
              </h2>
              <p className="text-slate-600">
                We source formulations across major therapeutic disciplines. Select a therapy area below to see key molecules we regularly supply.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Sidebar Selectors */}
            <div className="lg:col-span-4 space-y-2">
              {therapeuticSegments.map((segment, idx) => {
                const isActive = activeSegment === segment.id;
                return (
                  <ScrollReveal key={segment.id} animation="fade-in-left" delay={idx * 75}>
                    <button
                      onClick={() => setActiveSegment(segment.id)}
                      className={`w-full text-left p-4.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? 'bg-brand-blue text-white border-brand-blue shadow-lg'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="block font-heading font-bold text-sm">{segment.name}</span>
                      </div>
                      <ChevronRight size={16} className={`transition-transform duration-300 ${
                        isActive ? 'translate-x-1 text-brand-orange' : 'text-slate-400 group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Right Display Board */}
            <div className="lg:col-span-8">
              <ScrollReveal animation="fade-in-right" delay={150}>
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl flex flex-col min-h-[300px]">
                  <div>
                    <span className="text-brand-orange font-bold text-[10px] uppercase tracking-widest block mb-1">
                      Active Molecule Directory
                    </span>
                    <h3 className="font-heading font-extrabold text-2xl text-slate-900 mb-3">
                      {selectedSegment.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      {selectedSegment.blurb}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                      {selectedSegment.molecules.map((molecule) => (
                        <div key={molecule} className="flex items-center gap-3 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100">
                          <div className="w-5 h-5 rounded bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                            <Check size={12} className="stroke-[2.5]" />
                          </div>
                          <span className="font-heading font-semibold text-xs text-slate-900">{molecule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sourcing Note */}
                  <div className="mt-auto bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="p-2 bg-brand-blue text-white rounded-lg shrink-0">
                        <Info size={18} />
                      </div>
                      <div>
                        <h5 className="font-heading font-bold text-slate-900 text-xs">Need another molecule or strength?</h5>
                        <p className="text-slate-500 text-[11px] mt-0.5">We source alternate strengths, pack presentation, or brands on enquiry.</p>
                      </div>
                    </div>
                    <Link
                      to={`/enquiry?interest=${encodeURIComponent(`${selectedSegment.name} Molecules`)}`}
                      className="bg-brand-orange text-white hover:bg-orange-600 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-sm whitespace-nowrap self-stretch sm:self-auto justify-center"
                    >
                      Ask For Molecule
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>

        </div>
      </section>

      {/* HOW ORDERING WORKS */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">HOW ORDERING WORKS</span>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight mb-4">
                From Enquiry to Dispatch in Four Steps
              </h2>
              <p className="text-slate-600">
                No account manager layers and no obligation at any point before you confirm the quote.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orderSteps.map(({ icon: Icon, title, text }, index) => (
              <ScrollReveal key={title} animation="fade-in-up" delay={index * 100} className="flex">
                <div
                  className="bg-slate-50 rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 relative w-full"
                >
                  <span className="absolute top-6 right-7 font-heading font-extrabold text-4xl text-slate-200 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-5 relative z-10">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-2 relative z-10">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed relative z-10">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* WHO WE SUPPLY */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5">
              <ScrollReveal animation="fade-in-left">
                <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">WHO WE SUPPLY</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-slate-900 tracking-tight leading-snug mb-6">
                  Built for Licensed Healthcare Buyers
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  We supply business buyers rather than the public. Prescription lines are released only against a valid
                  drug licence, and GST details are collected before the first invoice.
                </p>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  If you are ordering for the first time, keep your drug licence copy and GST certificate handy — that is
                  usually the only thing standing between an enquiry and a dispatch.
                </p>
                <Link
                  to="/compliance"
                  className="text-brand-orange hover:text-brand-blue font-bold text-sm inline-flex items-center gap-1 transition-colors"
                >
                  Read our compliance approach <ChevronRight size={16} />
                </Link>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {buyerTypes.map(({ icon: Icon, label }, idx) => (
                <ScrollReveal key={label} animation="fade-in-up" delay={idx * 75}>
                  <div
                    className="flex items-center gap-4 bg-white hover:bg-slate-50 border border-slate-100 hover:border-brand-blue/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                      <Icon size={21} />
                    </div>
                    <span className="font-heading font-bold text-sm text-slate-900 leading-snug">{label}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* FAQs ON HOME PAGE */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 md:px-8">

          <ScrollReveal animation="fade-in-up">
            <div className="text-center mb-12">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-3">COMMON QUESTIONS</span>
              <h2 className="font-heading font-bold text-3xl text-slate-900 tracking-tight mb-4">
                Straight Answers For B2B Buyers
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm">
                We believe in simple, transparent communication. Here are answers to questions healthcare buyers ask when dealing with us for the first time.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={150}>
            <FaqAccordion items={faqs.slice(0, 5)} />
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={300}>
            <div className="text-center mt-10">
              <p className="text-slate-500 text-xs">
                Have another question? Read our{' '}
                <Link to="/why-choose-us" className="text-brand-blue hover:text-brand-orange font-semibold underline">
                  Why Choose Us Page
                </Link>{' '}
                or contact our representative directly.
              </p>
            </div>
          </ScrollReveal>

        </div>
      </section>

      <CtaBand />

    </div>
  );
}

export default Home;
