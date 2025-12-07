import React from "react";
import Navbar from "../Component/Shared/Navbar/Navbar";
import Footer from "../Component/Shared/Footer/Footer";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet/>
      <Footer/>
    </div>
  );
};

export default DashboardLayout;
