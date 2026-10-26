import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingSocial from './components/FloatingSocial';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Opportunities from './pages/Opportunities';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Gallery from './pages/Gallery';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* Bouton flottant réseaux sociaux — sur toutes les pages */}
      <FloatingSocial />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="a-propos" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="opportunites" element={<Opportunities />} />
          <Route path="opportunites/:slug" element={<PropertyDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="mentions-legales" element={<MentionsLegales />} />
          <Route path="politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="galerie" element={<Gallery />} />
        </Route>
        <Route path="*" element={<div className="text-center py-12">Page non trouvée</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;