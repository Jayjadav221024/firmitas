import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import { ArrowRight, Phone, ShieldCheck, Zap, Award, CheckCircle, ChevronRight } from 'lucide-react';

export const PublicHomePage: React.FC = () => {
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  // Fetch Section Content
  const { data: pageRes, refetch } = useQuery({
    queryKey: ['public-home'],
    queryFn: async () => (await api.get('/website-editor/public/home?preview=true')).data
  });

  const { data: siteWideRes, refetch: refetchSiteWide } = useQuery({
    queryKey: ['public-site-wide'],
    queryFn: async () => (await api.get('/website-editor/public/site-wide?preview=true')).data
  });

  const homeSections = pageRes?.sections || {};
  const siteWide = siteWideRes?.sections || {};

  const topNav = siteWide['top-nav-bar'] || {
    brandTitle: 'SHREE RAJ TRADERS',
    partnerSubtitle: 'SIEMENS · CGL · HINDUSTAN ELECTRIC',
    ctaButtonText: 'GET QUOTE',
    ctaPhoneNumber: '+91-97267 88690'
  };

  const hero = homeSections['hero-banner'] || {
    partnerBadge: 'AUTHORIZED CHANNEL PARTNER · OVER SIX DECADES',
    mainHeadingLine1: 'SWITCHGEARS, MOTORS &',
    highlightHeadingLine2: 'FRP PRODUCTS',
    mainHeadingLine3: 'FOR INDIAN INDUSTRY',
    subheading: 'Welcome to Shree Raj Traders – a trusted Siemens switchgear supplier in Ahmedabad and authorized channel partner for motors, gearboxes, switchgear, and FRP cable trays and gratings.',
    primaryCtaText: 'REQUEST A QUOTE',
    secondaryCtaPhone: '+91-97267 88690'
  };

  const stats = homeSections['key-stats'] || {
    stat1Value: '60+',
    stat1Label: 'Years in Distribution',
    stat2Value: '10,000+',
    stat2Label: 'Industrial Clients Served',
    stat3Value: '100%',
    stat3Label: 'Genuine OEM Backed Products',
    stat4Value: '24-48 hrs',
    stat4Label: 'Dispatch for Ready Stock'
  };

  // postMessage bridge listener
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'HIGHLIGHT_SECTION') {
        const key = e.data.sectionKey;
        setHighlightedKey(key);
        const el = document.querySelector(`[data-section-id="${key}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTimeout(() => setHighlightedKey(null), 3000);
      } else if (e.data?.type === 'REFRESH_PREVIEW') {
        refetch();
        refetchSiteWide();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [refetch, refetchSiteWide]);

  const getSectionHighlightClass = (key: string) => {
    return highlightedKey === key
      ? 'ring-4 ring-teal-500 ring-offset-2 transition-all duration-300 rounded-2xl'
      : 'transition-all duration-300';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Nav Bar */}
      <header
        data-section-id="top-nav-bar"
        className={`bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-xs ${getSectionHighlightClass('top-nav-bar')}`}
      >
        <div>
          <h1 className="text-xl font-extrabold tracking-wider text-[#d9531e]">
            {topNav.brandTitle}
          </h1>
          <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            {topNav.partnerSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${topNav.ctaPhoneNumber}`}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Phone size={14} className="text-teal-600" />
            <span>{topNav.ctaPhoneNumber}</span>
          </a>
          <button className="px-4 py-2 bg-[#d9531e] hover:bg-[#c24615] text-white rounded-lg text-xs font-bold tracking-wide shadow-sm">
            {topNav.ctaButtonText}
          </button>
        </div>
      </header>

      {/* Hero Banner matching user's screenshot layout */}
      <section
        data-section-id="hero-banner"
        className={`max-w-6xl mx-auto px-6 py-12 lg:py-16 ${getSectionHighlightClass('hero-banner')}`}
      >
        {/* Partner Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-600/20 text-amber-700 text-xs font-bold tracking-wider mb-6">
          <Award size={14} />
          <span>{hero.partnerBadge}</span>
        </div>

        {/* Big Headline */}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
          {hero.mainHeadingLine1} <br />
          <span className="text-[#d9531e]">{hero.highlightHeadingLine2}</span> <br />
          {hero.mainHeadingLine3}
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          {hero.subheading}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#d9531e] hover:bg-[#c24615] text-white font-bold text-xs tracking-wider rounded-xl shadow-md transition-transform active:scale-95">
            <span>{hero.primaryCtaText}</span>
            <ArrowRight size={15} />
          </button>
          <a
            href={`tel:${hero.secondaryCtaPhone}`}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Phone size={14} className="text-[#d9531e]" />
            <span>{hero.secondaryCtaPhone}</span>
          </a>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        data-section-id="key-stats"
        className={`bg-slate-900 text-white py-8 border-y border-slate-800 ${getSectionHighlightClass('key-stats')}`}
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{stats.stat1Value}</div>
            <p className="text-xs text-slate-400 mt-1">{stats.stat1Label}</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{stats.stat2Value}</div>
            <p className="text-xs text-slate-400 mt-1">{stats.stat2Label}</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{stats.stat3Value}</div>
            <p className="text-xs text-slate-400 mt-1">{stats.stat3Label}</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{stats.stat4Value}</div>
            <p className="text-xs text-slate-400 mt-1">{stats.stat4Label}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
