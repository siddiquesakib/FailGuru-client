import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Component/Shared/Navbar/Navbar";
import Footer from "../Component/Shared/Footer/Footer";

const HomeLayouts = () => {
  return (
    <div className="min-h-screen bg-[url(/bgimg.png)]">
      <Navbar />
      <main className="pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayouts;
