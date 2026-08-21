import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, Clock } from 'lucide-react';
import Logo from './Logo';
import { categories } from '../data/products';
import { company } from '../data/company';
import { useWebsiteContent } from '../hooks/useWebsiteContent';

function Footer() {
  const { getField } = useWebsiteContent('site-wide');
  const disclaimer = getField('footer-content', 'disclaimerText', 'Firmitas 1 is a B2B pharmaceutical and healthcare distributor. All prescription medicines and surgical supplies are provided exclusively against valid drug licenses and institutional credentials.');
  const copyright = getField('footer-content', 'copyrightText', `© ${new Date().getFullYear()} Firmitas 1 Pharma Solutions. All Rights Reserved.`);
  const address = getField('company-contact-details', 'officeAddress', company.addressLines.join(' '));

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">

        {/* Col 1: Branding */}
        <div className="lg:col-span-4 space-y-4">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <Logo className="w-11 h-11 bg-white rounded-xl p-1" />
            <span className="font-heading font-semibold text-2xl tracking-tighter text-white block leading-none">
              firmitas 1
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {disclaimer}
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Story</Link></li>
            <li><Link to="/why-choose-us" className="hover:text-white transition-colors">Why Choose Us</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Sourcing Catalog</Link></li>
            <li><Link to="/enquiry" className="hover:text-white transition-colors">B2B Trade Form</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Details</Link></li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">Product Categories</h4>
          <ul className="space-y-2 text-xs">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link to={`/products?category=${cat.id}`} className="hover:text-white transition-colors">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contacts */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">Distribution HQ</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-brand-orange shrink-0 mt-0.5" />
              <span>{company.addressLines[company.addressLines.length - 1]}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-brand-orange shrink-0" />
              <a href={company.phoneHref} className="hover:text-white transition-colors">{company.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-brand-orange shrink-0" />
              <a href={`mailto:${company.email}`} className="hover:text-white transition-colors">{company.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-brand-orange shrink-0" />
              <span>{company.hours}</span>
            </li>
            <li className="flex items-center gap-2">
              <Globe size={14} className="text-brand-orange shrink-0" />
              <span>{company.website}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-slate-800 text-center md:flex md:justify-between md:items-center space-y-4 md:space-y-0 text-[11px] text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
        </div>
        <div>
          Disclaimer: All pharmaceutical sourcing is subject to local country drug control permissions, import clearance permits and validated medical licenses.
        </div>
      </div>

    </footer>
  );
}

export default Footer;
