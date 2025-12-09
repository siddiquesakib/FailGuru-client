import { NavLink } from "react-router";

export default function MyNavLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive
          ? "px-4 py-2 text-[13px] font-semibold text-[#ad651c] transition-all block"
          : "px-4 py-2 text-[13px] font-semibold text-black transition-all hover:text-gray-600 block"
      }
    >
      {children}
    </NavLink>
  );
}
