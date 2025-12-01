import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdmin from "../pages/SuperAdmin";
import GodLevelPanel from "../pages/GodLevelPanel";
import Footer from '../pages/Footer';
import Admin from "../pages/Admin";
import VisitPanels from "../pages/VisitPanels";

// Read paths (paths MUST start with /)
const GOD_PANEL_PATH = import.meta.env.VITE_GOD_PANEL_URL || "/god";
const SUPER_ADMIN_PATH = import.meta.env.VITE_SUPER_ADMIN_PANEL_URL || "/superadmin";
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PANEL_URL || "/admin";
const VISITOR_PATH = import.meta.env.VITE_VISITOR_PANEL_URL || "/visitor";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SUPER_ADMIN_PATH} element={<SuperAdmin />} />
        <Route path={GOD_PANEL_PATH} element={<GodLevelPanel />} />
        <Route path={ADMIN_PATH} element={<Admin />} />
        <Route path={VISITOR_PATH} element={<VisitPanels />} />
        <Route path="*" element={<VisitPanels />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
