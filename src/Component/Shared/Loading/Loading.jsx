import React from "react";

const Loading = () => {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-[#f9f5f6]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-black mx-auto mb-4"></div>
        <p className="text-xl font-bold text-gray-800 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
