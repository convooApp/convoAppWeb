import { HashRouter, BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import DeleteAccount from './pages/DeleteAccount';
import CSAEPolicy from './pages/CSAEPolicy';
import Support from './pages/Support';
import Contact from './pages/Contact';
import Business from './pages/Business';
import './fonts.css';
import Events from './pages/Events';
import DownloadNow from './pages/downloadNow';
import Links from './pages/Links';
import ApplyToHost from './pages/ApplyToHost';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#121212]">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/child-safety" element={<CSAEPolicy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/business" element={<Business />} />
            <Route path="/download-now" element={<DownloadNow />} />
            <Route path="/events" element={<Events />} />
            <Route path="/links" element={<Links />} />
            <Route path="/apply-to-host" element={<ApplyToHost />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function App() {
  const isApplyToHost = window.location.pathname === '/apply-to-host';

  if (isApplyToHost) {
    return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    );
  }

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default App;
