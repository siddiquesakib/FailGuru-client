import React from "react";

const Heading = ({ children }) => {
  return (
    <div className="font-black text-[20px] md:text-[40px] text-black uppercase">
      {children}
    </div>
  );
};

export default Heading;
