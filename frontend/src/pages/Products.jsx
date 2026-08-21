import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRight,
  Search,
  Pill,
  Syringe,
  Droplets,
  FlaskConical,
  Package,
  Bandage,
  ShieldCheck,
  Snowflake,
  Info,
} from 'lucide-react';
import PageHero from '../components/PageHero';
import { productsData, categories } from '../data/products';
import { adminApi } from '../api/client';
import { useWebsiteContent } from '../hooks/useWebsiteContent';

// Dosage form drives the card icon — no stock photography
const formIcons = {
  Tablet: Pill,
  Capsule: Pill,
  Injection: Syringe,
  'IV Fluid': Droplets,
  Suspension: FlaskConical,
  Topical: Droplets,
  Powder: Package,
  Disposable: Syringe,
  Dressing: Bandage,
  'Wound closure': Bandage,
  PPE: ShieldCheck,
  Antiseptic: Droplets,
};

const accentByCategory = categories.reduce((acc, c) => {
  acc[c.id] = c.accent;
  return acc;
}, {});

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { getField } = useWebsiteContent('products');

  const { data: rawProducts = productsData } = useQuery({
    queryKey: ['public-catalog-products'],
    queryFn: async () => {
      const prods = await adminApi.getProducts();
      return prods && prods.length > 0 ? prods : productsData;
    },
    initialData: productsData
  });

  // Normalise product structure whether from API or static file
  const allProducts = rawProducts.map((p, idx) => ({
    id: p.id || p._id || `prod-${idx}`,
    name: p.name,
    composition: p.composition || p.therapeuticUse || '',
    category: p.category || p.categoryKey || 'ethical',
    form: p.form || 'Tablet',
    rxType: p.rxType || 'Rx',
    packaging: p.packaging || 'Standard Pack',
    storage: p.storage || 'Store in cool and dry place',
    use: p.use || p.therapeuticUse || p.description || '',
    coldChain: p.coldChain || (p.storage && p.storage.toLowerCase().includes('cold'))
  }));

  const productCountByCategory = allProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const filterTabs = [
    { id: 'all', label: 'All Categories', count: allProducts.length },
    ...categories.map((c) => ({ id: c.id, label: c.label, count: productCountByCategory[c.id] || 0 })),
  ];
  const validFilters = filterTabs.map((tab) => tab.id);

  // The active filter lives in the URL, so /products?category=otc is shareable
  const requested = searchParams.get('category');
  const activeFilter = validFilters.includes(requested) ? requested : 'all';

  const normalisedQuery = query.trim().toLowerCase();
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = activeFilter === 'all' || product.category === activeFilter;
    if (!matchesCategory) return false;
    if (!normalisedQuery) return true;
    return [product.name, product.composition, product.use, product.form]
      .join(' ')
      .toLowerCase()
      .includes(normalisedQuery);
  });

  const handleFilterChange = (id) => {
    setSearchParams(id === 'all' ? {} : { category: id }, { replace: true });
  };

  // Carry the product name over to the enquiry form
  const handleProductInterest = (productName) => {
    navigate('/enquiry', { state: { interest: `Bulk Quote: ${productName}` } });
  };

  return (
    <>
      <PageHero
        eyebrow="PRODUCT SHOWCASE"
        title={getField('products-header', 'title', 'Explore Our Core Catalog')}
        breadcrumb="Products"
        description={getField('products-header', 'subtitle', `${allProducts.length} product lines across four supply divisions. Filter by category, search by molecule, and request a trade quotation on any line.`)}
      />

      <section className="py-16 md:py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product, molecule or dosage form…"
                aria-label="Search products"
                className="w-full bg-white border border-slate-200 focus:border-brand-blue rounded-full pl-11 pr-5 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
                <span className={`ml-2 text-[11px] ${activeFilter === tab.id ? 'text-blue-200' : 'text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-500 mb-10">
            Showing {filteredProducts.length} of {totalProductCount} product lines
          </p>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const Icon = formIcons[product.form] || Package;
                const accent = accentByCategory[product.category];
                const isBlue = accent === 'blue';

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col ${
                      isBlue ? 'hover:border-brand-blue/30' : 'hover:border-brand-orange/30'
                    }`}
                  >
                    {/* Header band */}
                    <div
                      className={`flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 ${
                        isBlue ? 'bg-brand-blue/5' : 'bg-brand-orange/5'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isBlue
                            ? 'bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                            : 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'
                        }`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className="flex items-center gap-2">
                        {product.coldChain && (
                          <span className="flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                            <Snowflake size={11} /> Cold chain
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            product.rxType === 'Rx'
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : product.rxType === 'OTC'
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {product.rxType}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 grow flex flex-col">
                      <h3
                        className={`font-heading font-bold text-slate-900 text-base leading-snug mb-1.5 transition-colors ${
                          isBlue ? 'group-hover:text-brand-blue' : 'group-hover:text-brand-orange'
                        }`}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs font-semibold text-brand-blue/80 mb-3 leading-relaxed">
                        {product.composition}
                      </p>
                      <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                        {product.use}
                      </p>

                      <dl className="space-y-2 border-t border-slate-100 pt-4 text-xs mt-auto">
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-400 font-medium shrink-0">Form</dt>
                          <dd className="font-semibold text-slate-600 text-right">{product.form}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-400 font-medium shrink-0">Packing</dt>
                          <dd className="font-semibold text-slate-600 text-right">{product.packaging}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-slate-400 font-medium shrink-0">Storage</dt>
                          <dd className="font-semibold text-slate-600 text-right">{product.storage}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={() => handleProductInterest(product.name)}
                        className="w-full bg-slate-50 hover:bg-brand-orange text-slate-700 hover:text-white border border-slate-100 hover:border-brand-orange font-semibold py-2.5 rounded-xl transition-all duration-200 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Request B2B Quote
                        <ChevronRight size={14} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <p className="text-slate-700 font-semibold text-sm mb-2">No matching product lines</p>
              <p className="text-slate-500 text-sm mb-6">
                We source beyond what is listed here — send the specification and we will confirm whether we can supply it.
              </p>
              <Link
                to="/enquiry"
                className="text-brand-orange hover:text-brand-blue font-bold text-sm inline-flex items-center gap-1 transition-colors"
              >
                Ask our sourcing desk <ChevronRight size={16} />
              </Link>
            </div>
          )}

          {/* Honest note about what this list is */}
          <div className="mt-12 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
              <Info size={22} />
            </div>
            <div className="text-sm text-slate-600 leading-relaxed space-y-2">
              <p>
                <strong className="text-slate-900 font-heading">This catalog is a supply list, not a live stock list.</strong>{' '}
                It sets out the product lines we supply against enquiry. Availability, the specific manufacturer
                and the batch are confirmed at the time of quotation — before you commit to anything.
              </p>
              <p>
                Prices are quoted per enquiry rather than published, because pharmaceutical pricing moves with pack
                size, quantity and batch. Products marked <strong className="text-slate-900">Rx</strong> are supplied
                only against a valid drug licence.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-500 text-sm mb-4">
              Need custom molecules, different packing parameters or a specific manufacturer?
            </p>
            <Link
              to="/enquiry"
              className="text-brand-orange hover:text-brand-blue font-bold text-sm inline-flex items-center gap-1 transition-colors"
            >
              Consult Our Sourcing Desk <ChevronRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}

export default Products;
