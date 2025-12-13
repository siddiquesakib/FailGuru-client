import React from "react";
import { Link, useNavigate } from "react-router";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9f5f6] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Text */}
        <h1
          className="text-9xl font-black mb-4 text-[#ffdb58]"
          style={{
            textShadow: "4px 4px 0px #000",
            WebkitTextStroke: "3px black",
          }}
        >
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-black mb-4 font2">Page Not Found</h2>
        <p className="text-gray-600 text-lg mb-8">
          Oops! The page you are looking for might have been removed, had its
          name changed, or is temporarily unavailable.
        </p>

        {/* Button */}
        <div className="">
          <Link
            onClick={() => navigate(-1)}
            className="inline-block px-8 py-3 mr-6 text-lg font-bold text-black bg-[#ffdb58]  border-2 border-black transition-all relative"
            style={{
              border: "3px solid #000",
              boxShadow: "4px 4px 0px 0px #000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
            }}
          >
            Go Back
          </Link>
          <Link
            to="/"
            className="inline-block px-8 py-3 text-lg font-bold text-black bg-[#ffdb58]  border-2 border-black transition-all relative"
            style={{
              border: "3px solid #000",
              boxShadow: "4px 4px 0px 0px #000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
            }}
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
