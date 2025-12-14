import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Component/Shared/Navbar/Navbar";
import Footer from "../Component/Shared/Footer/Footer";
import ScrollProgress from "../Component/Shared/ScrollProgress";

const HomeLayouts = () => {
  return (
    <div className="min-h-screen bg-[url(/bgimg.png)]">
      <Navbar />
      <main className="mt-16">
        <ScrollProgress />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayouts;
