import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { navLinks } from '../data/navLinks';
import { company } from '../data/company';
import { useWebsiteContent } from '../hooks/useWebsiteContent';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getField } = useWebsiteContent('site-wide');

  const phone = getField('top-nav-bar', 'primaryPhone', company.phone);
  const email = getField('top-nav-bar', 'primaryEmail', company.email);
  const ctaText = getField('top-nav-bar', 'ctaButtonText', 'Request a Quote');

  // Sticky header shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const desktopLinkClass = ({ isActive }) =>
    `font-medium transition-colors relative py-1 ${
      isActive
        ? 'text-brand-blue after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:rounded-full after:bg-brand-orange'
        : 'text-slate-600 hover:text-brand-blue'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `font-medium p-2 rounded-lg transition-colors ${
      isActive
        ? 'text-brand-blue bg-blue-50'
        : 'text-slate-700 hover:text-brand-blue hover:bg-slate-50'
    }`;

  return (
    <>
      {/* Top Banner Contacts */}
      <div className="bg-brand-blue text-white text-xs py-2 px-4 md:px-8 flex flex-wrap justify-between items-center relative z-30 border-b border-white/10">
        <div className="flex gap-6 items-center flex-wrap">
          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
            <Phone size={12} className="text-brand-orange" />
            <span>{phone}</span>
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
            <Mail size={12} className="text-brand-orange" />
            <span>{email}</span>
          </a>
          <span className="hidden md:flex items-center gap-1.5 text-slate-300">
            <MapPin size={12} className="text-brand-orange" />
            <span>Ethical Drugs · Surgical · Critical Care · OTC</span>
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-300">
            <Clock size={12} />
            <span>{company.hoursShort}</span>
          </span>
        </div>
      </div>

      {/* Primary Sticky Header */}
      <header
        className={`sticky top-0 w-full transition-all duration-300 z-40 ${
          isScrolled
            ? 'bg-white shadow-lg py-3 border-b border-slate-100'
            : 'bg-white/90 md:bg-white/80 py-5 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center gap-4">

          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo className="w-11 h-11 transition-transform group-hover:scale-105" />
            <div>
              <span className="font-heading font-semibold text-2xl tracking-tighter text-slate-900 block leading-none">
                firmitas 1
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-400 block mt-1">
                Global Reach. Trusted Care.
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={desktopLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action CTA (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/enquiry"
              className="bg-brand-blue text-white font-medium px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-900 transition-all hover:scale-[1.02] text-sm whitespace-nowrap"
            >
              Request Bulk Quote
            </Link>
          </div>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-800 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white p-6 shadow-2xl transition-transform duration-300 flex flex-col justify-between overflow-y-auto ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Logo className="w-9 h-9" />
                <span className="font-heading font-semibold text-xl tracking-tighter text-slate-900 block leading-none">
                  firmitas 1
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  {link.mobileLabel}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
            <Link
              to="/enquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-brand-blue text-white text-center font-medium py-3 rounded-xl shadow-md hover:bg-blue-900 transition-colors"
            >
              Request Bulk Quote
            </Link>
            <div className="text-center text-xs text-slate-500">
              {company.email}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
