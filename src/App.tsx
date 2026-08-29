import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useEffect } from "react";
import StoryHome from "./pages/StoryHome";
import Home from "./pages/Home";
import Meter from "./pages/Meter";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import MeterPrivacy from "./pages/MeterPrivacy";
import DeleteAccount from "./pages/DeleteAccount";
import CSAEPolicy from "./pages/CSAEPolicy";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import Business from "./pages/Business";
import "./fonts.css";
import Events from "./pages/Events";
import DownloadNow from "./pages/downloadNow";
import Links from "./pages/Links";
import ApplyToHost from "./pages/ApplyToHost";
import In from "./pages/In";
import Apply from "./pages/Apply";

/* Carries the position slug across, so a shared /join/husband link still
   lands on that listing rather than dumping the reader on the board. */
function JoinRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/apply/${slug}`} replace />;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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
            <Route path="/" element={<StoryHome />} />
            {/* Previous scrolling landing page, kept reachable while the
                storytelling homepage settles in. */}
            <Route path="/classic" element={<Home />} />
            <Route path="/meter" element={<Meter />} />
            {/* Old regional path — keep the link alive, serve the homepage. */}
            <Route path="/us" element={<Navigate to="/" replace />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/meter/privacy" element={<MeterPrivacy />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/child-safety" element={<CSAEPolicy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/business" element={<Business />} />
            <Route path="/download-now" element={<DownloadNow />} />
            <Route path="/events" element={<Events />} />
            <Route path="/download" element={<Events />} />
            <Route path="/links" element={<Links />} />
            <Route path="/apply-to-host" element={<ApplyToHost />} />
            <Route path="/in" element={<In />} />
            <Route path="/apply" element={<Apply />} />
            {/* A listing is shareable on its own; the board renders behind it. */}
            <Route path="/apply/:slug" element={<Apply />} />
            {/* Links to the old path are already out in the world. */}
            <Route path="/join" element={<Navigate to="/apply" replace />} />
            <Route path="/join/:slug" element={<JoinRedirect />} />
            {/* Any unknown path falls back to Home so visitors never see a
                blank screen from a stale link. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
