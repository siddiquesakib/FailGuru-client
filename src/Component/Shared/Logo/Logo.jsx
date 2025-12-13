// DidaskoLogo.jsx

import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-1 cursor-pointer select-none">
      <span
        className={`text-2xl font2 font-extrabold tracking-tight`}
        style={{
          color: "#FBBF24",
          textShadow: "2px 2px 0px #222",
        }}
      >
        FailGuru
      </span>
    </div>
  );
};

export default Logo;
