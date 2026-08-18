import { Routes, Route } from 'react-router-dom';
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

// One route per navbar entry (see src/data/navLinks.js), all sharing the Layout chrome.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/why-choose-us" element={<WhyChooseUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
