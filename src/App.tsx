import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import './fonts.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#121212]">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </div>
        
        <footer className="w-full bg-[#121212] py-6 text-center border-t border-[#222222] relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-[#aaaaaa] text-sm">
              <a href="/terms" className="text-[#B83280] hover:underline mx-2">Terms of Service</a>
              <span className="mx-1">|</span>
              <a href="/privacy" className="text-[#B83280] hover:underline mx-2">Privacy Policy</a>
            </div>
            <div className="text-[#666666] text-xs mt-2">
              &copy; {new Date().getFullYear()} Convoo. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;