import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';
import ScrollToTop from './ScrollToTop';

// Chrome shared by every route: top bar, navbar, page body, footer, WhatsApp widget.
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <ScrollToTop />
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}

export default Layout;
