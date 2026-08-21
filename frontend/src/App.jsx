import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Categories from './pages/Categories';
import WhyChooseUs from './pages/WhyChooseUs';
import Products from './pages/Products';
import Compliance from './pages/Compliance';
import Contact from './pages/Contact';
import Enquiry from './pages/Enquiry';
import NotFound from './pages/NotFound';

import { AdminLayout } from './components/layout/AdminLayout';
import { ProductsPage } from './pages/Products/ProductsPage';
import { WebsiteEditorPage } from './pages/WebsiteEditor/WebsiteEditorPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { RolesPage } from './pages/Users/RolesPage';
import { AdminUsersPage } from './pages/Users/AdminUsersPage';
import { EmailSetupPage, EmailForPage, EmailTemplatePage } from './pages/Email/EmailPages';
import {
  DashboardPage,
  InquiriesPage,
  JobOpeningsPage,
  JobApplicationsPage,
  TestimonialsPage,
  FAQsPage,
  BlogsPage
} from './pages/General/GeneralPages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Firmitas Public Website (Untouched & Perfect) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enquiry" element={<Enquiry />} />
        </Route>

        {/* Firmitas Admin Console & Visual CMS */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="website-editor" element={<WebsiteEditorPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="email/setup" element={<EmailSetupPage />} />
          <Route path="email/for" element={<EmailForPage />} />
          <Route path="email/templates" element={<EmailTemplatePage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="job-openings" element={<JobOpeningsPage />} />
          <Route path="job-applications" element={<JobApplicationsPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="faqs" element={<FAQsPage />} />
          <Route path="blogs" element={<BlogsPage />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
