import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Component/Shared/Navbar/Navbar";
import Footer from "../Component/Shared/Footer/Footer";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="hidden lg:flex flex-col gap-4">
            <h1 className="text-4xl font-black leading-tight text-[#ad651c]">
              Learn smart. Teach smarter.
            </h1>
            <p className="text-gray-600 text-lg">
              Access tailored lessons, track your progress, and empower others
              with the Fail Guru community.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
