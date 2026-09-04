import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import DisasterNews from "@/pages/DisasterNews";
import ReportDisaster from "@/pages/ReportDisaster";
import Shelters from "@/pages/Shelters";
import Rescue from "@/pages/Rescue";
import DisasterMap from "@/pages/DisasterMap";
import Awareness from "@/pages/Awareness";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/disasters" element={<DisasterNews />} />
          <Route path="/report" element={<ReportDisaster />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/rescue" element={<Rescue />} />
          <Route path="/map" element={<DisasterMap />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
