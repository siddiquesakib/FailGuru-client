// DidaskoLogo.jsx

import React from "react";
import { Link } from "react-router";

const Logo = () => {
  return (
    <div className="flex items-center space-x-1 cursor-pointer select-none">
      <Link
        to={"/"}
        className={`text-2xl font2 font-extrabold tracking-tight`}
        style={{
          color: "#FBBF24",
          textShadow: "2px 2px 0px #222",
        }}
      >
        FailGuru
      </Link>
    </div>
  );
};

export default Logo;
