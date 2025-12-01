import { BrowserRouter, Routes, Route } from "react-router-dom";
import SuperAdmin from "../pages/SuperAdmin";
import GodLevelPanel from "../pages/GodLevelPanel";
import Footer from '../pages/Footer';
import Admin from "../pages/Admin";
import VisitPanels from "../pages/VisitPanels";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/superadmin' element={<SuperAdmin />} />
        <Route path='/god' element={<GodLevelPanel />} />
        <Route path='admin' element={<Admin />} />
        <Route path='visitor' element={<VisitPanels />} />
        <Route path="*" element={<VisitPanels />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
