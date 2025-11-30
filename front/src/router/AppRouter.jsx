import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdmin from "../pages/SuperAdmin";
import GodLevelPanel from "../pages/GodLevelPanel";
import Footer from '../pages/Footer';
import Admin from "../pages/Admin";
import VisitPanels from "../pages/VisitPanels";

// Environment variables for paths
const GOD_PANEL_PATH = import.meta.env.VITE_GOD_PANEL_URL?.replace(window.location.origin, '') || "/god";
const SUPER_ADMIN_PATH = import.meta.env.VITE_SUPER_ADMIN_PANEL_URL?.replace(window.location.origin, '') || "/superadmin";
const ADMIN_PATH = import.meta.env.VITE_VISITOR_PANEL_URL?.replace(window.location.origin, '') || "/admin";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SUPER_ADMIN_PATH} element={<SuperAdmin />} />
        <Route path={GOD_PANEL_PATH} element={<GodLevelPanel />} />
        <Route path={ADMIN_PATH} element={<Admin />} />
        <Route path="*" element={<VisitPanels />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
