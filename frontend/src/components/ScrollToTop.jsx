import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Routers keep the scroll position across navigations; reset it on every page change.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
