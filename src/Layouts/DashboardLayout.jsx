import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../Component/Dashboard/Sidebar";
import Navbar from "../Component/Shared/Navbar/Navbar";
import Footer from "../Component/Shared/Footer/Footer";
import Loading from "../Component/Shared/Loading/Loading";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f5f6]">
      {/* Navbar - Top */}
      <Navbar />

      {/* Main Area - Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <div className="flex-1 p-8 transition-all duration-300">
          <Outlet />
        </div>
      </div>

      {/* Footer - Bottom */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
