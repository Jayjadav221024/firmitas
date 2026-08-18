// Single source of truth for the navbar, the mobile drawer and the footer links.
// Every entry here must have a matching <Route> in App.jsx.
export const navLinks = [
  { to: '/', label: 'Home', mobileLabel: 'Home' },
  { to: '/about', label: 'About Us', mobileLabel: 'About Us' },
  { to: '/categories', label: 'Categories', mobileLabel: 'Categories' },
  { to: '/why-choose-us', label: 'Why Choose Us', mobileLabel: 'Why Choose Us' },
  { to: '/products', label: 'Products', mobileLabel: 'Products Showcase' },
  { to: '/compliance', label: 'Compliance', mobileLabel: 'Compliance Certs' },
  { to: '/contact', label: 'Contact', mobileLabel: 'Contact Us' },
];
