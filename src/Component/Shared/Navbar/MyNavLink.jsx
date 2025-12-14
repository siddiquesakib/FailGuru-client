import { NavLink } from "react-router";

export default function MyNavLink({ to, children, onClick, isScrolled }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive
          ? `px-1 py-2 text-[13px] font-semibold transition-all ${
              isScrolled
                ? "text-[#ad651c]"
                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            }`
          : `px-1 py-2 text-[13px] font-semibold transition-all ${
              isScrolled
                ? "text-black hover:text-gray-600"
                : "text-white hover:text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            }`
      }
    >
      {children}
    </NavLink>
  );
}
