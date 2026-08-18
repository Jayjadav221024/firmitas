import { Link } from 'react-router-dom';
import { ChevronRight, Search, Snowflake, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero';
import CtaBand from '../components/CtaBand';
import ScrollReveal from '../components/ScrollReveal';
import { categories, productCountByCategory, totalProductCount } from '../data/products';

function Categories() {
  return (
    <>
      <PageHero
        eyebrow="PRODUCT SEGMENTS"
        title="Comprehensive B2B Supply Capabilities"
        breadcrumb="Categories"
        description={`Four supply divisions covering ${totalProductCount} listed product lines, plus custom sourcing for anything not on the list.`}
      />

      <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {categories.map(({ id, title, icon: Icon, accent, blurb, segments }, idx) => {
              const isBlue = accent === 'blue';

              return (
                <ScrollReveal key={id} animation="fade-in-up" delay={idx * 150} className="flex">
                  <div
                    className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden flex flex-col w-full ${
                      isBlue ? 'hover:border-brand-blue/30' : 'hover:border-brand-orange/30'
                    }`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] transition-all group-hover:scale-110 ${
                        isBlue ? 'bg-brand-blue/5' : 'bg-brand-orange/5'
                      }`}
                    ></div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0 transition-colors duration-300 ${
                          isBlue
                            ? 'bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                            : 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                        }`}
                      >
                        <Icon size={28} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                        {productCountByCategory[id]} lines listed
                      </span>
                    </div>

                    <h2
                      className={`font-heading font-bold text-xl text-slate-900 mb-3 transition-colors ${
                        isBlue ? 'group-hover:text-brand-blue' : 'group-hover:text-brand-orange'
                      }`}
                    >
                      {title}
                    </h2>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{blurb}</p>

                    <div className="border-t border-slate-100 pt-5 mb-6">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Segments covered
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
                        {segments.map((segment) => (
                          <li key={segment} className="flex items-start gap-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                                isBlue ? 'bg-brand-blue' : 'bg-brand-orange'
                              }`}
                            ></span>
                            {segment}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to={`/products?category=${id}`}
                      className="text-brand-blue font-semibold text-xs inline-flex items-center gap-1 hover:text-brand-orange transition-colors mt-auto pointer-events-auto"
                    >
                      Browse this category <ChevronRight size={14} />
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}

          </div>

          {/* Supporting notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <ScrollReveal animation="fade-in-up" delay={0} className="flex">
              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm w-full">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
                  <Search size={22} />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base mb-2">Custom sourcing</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Molecules, strengths, pack presentations or specific manufacturers outside this list are sourced on
                  request. Send the specification and we confirm whether we can supply it.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-up" delay={100} className="flex">
              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm w-full">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Snowflake size={22} />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base mb-2">Cold-chain items</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Temperature-sensitive products such as insulin are supplied under 2°C to 8°C handling, with packaging
                  and transport arranged to hold that range in transit.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-up" delay={200} className="flex">
              <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm w-full">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-base mb-2">What we do not supply</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  We do not deal in narcotic, psychotropic or Schedule X controlled substances. Prescription lines are
                  supplied only against a valid drug licence.
                </p>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      <CtaBand
        title="Looking for something not listed?"
        description="We source custom molecules, alternate packing parameters and specific manufacturer preferences on request."
        secondaryLabel="Browse Products"
        secondaryTo="/products"
      />
    </>
  );
}

export default Categories;
