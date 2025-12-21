import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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
            <Route path="/events" element={<Events />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
