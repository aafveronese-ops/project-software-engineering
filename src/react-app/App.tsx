import { BrowserRouter as Router, Routes, Route } from "react-router";
import DemoHomePage from "@/react-app/pages/DemoHome";
import ProfileSetupPage from "@/react-app/pages/ProfileSetup";
import DriverDashboardPage from "@/react-app/pages/DriverDashboard";
import ShipperDashboardPage from "@/react-app/pages/ShipperDashboard";
import FreightDetailsPage from "@/react-app/pages/FreightDetails";
import PostFreightPage from "@/react-app/pages/PostFreight";
import HelpPage from "@/react-app/pages/Help";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DemoHomePage />} />
        <Route path="/setup" element={<ProfileSetupPage />} />
        <Route path="/driver" element={<DriverDashboardPage />} />
        <Route path="/shipper" element={<ShipperDashboardPage />} />
        <Route path="/shipper/post" element={<PostFreightPage />} />
        <Route path="/freight/:id" element={<FreightDetailsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
}
