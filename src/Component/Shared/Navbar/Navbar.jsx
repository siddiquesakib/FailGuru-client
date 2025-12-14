import { Link, NavLink, useLocation } from "react-router";
import MyNavLink from "./MyNavlink";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { CircleUserRound, HeartPlus, LogOut } from "lucide-react";
import Logo from "../Logo/Logo";

const Navbar = () => {
  const { user, logOut, isPremiumUser } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navlink = (
    <>
      <li>
        <MyNavLink
          to="/"
          onClick={closeMobileMenu}
          isScrolled={!isHomePage || isScrolled}
        >
          Home
        </MyNavLink>
      </li>
      <li>
        <MyNavLink
          to="/dashboard/add-lesson"
          onClick={closeMobileMenu}
          isScrolled={!isHomePage || isScrolled}
        >
          Add Lesson
        </MyNavLink>
      </li>

      <li>
        <MyNavLink
          to="/dashboard/my-lesson"
          onClick={closeMobileMenu}
          isScrolled={!isHomePage || isScrolled}
        >
          My Lessons
        </MyNavLink>
      </li>
      <li>
        <MyNavLink
          to="/publiclessons"
          onClick={closeMobileMenu}
          isScrolled={!isHomePage || isScrolled}
        >
          Public Lessons
        </MyNavLink>
      </li>
      <li>
        <MyNavLink
          to="/pricing"
          onClick={closeMobileMenu}
          isScrolled={!isHomePage || isScrolled}
        >
          Pricing
        </MyNavLink>
      </li>
    </>
  );

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast("You Logged Out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <nav
      className={`border-b top-0 z-50 fixed w-full transition-all duration-300 ${
        isHomePage && !isScrolled
          ? "bg-transparent border-transparent"
          : "bg-[#f9f5f6] bg-[url(/bgimg.png)] border-gray-200 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with conditional styling */}
          <div className={isHomePage && !isScrolled ? "" : ""}>
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center">
            <ul className="flex items-center gap-4 list-none">{navlink}</ul>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                {/* Avatar */}
                <div className="flex justify-center items-center gap-1.5">
                  {isPremiumUser && (
                    <h1
                      className="font-semibold text-[#f0b127]"
                      style={{
                        color: "#FBBF24",
                        textShadow: "2px 2px 0px #222",
                      }}
                    >
                      Premium ⭐
                    </h1>
                  )}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-full border-2 border-[#ffbb24] overflow-hidden transition-all hover:border-[#f0b127]"
                  >
                    <img
                      src={user?.photoURL}
                      alt={user?.displayName}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    {/* Overlay to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown */}
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg border-2 border-black z-40"
                      style={{ boxShadow: "4px 4px 0px 0px #000" }}
                    >
                      <div className="">
                        <h1 className="font-medium text-[11px] px-4 py-2 bg-purple-50 truncate">
                          {user.displayName}
                        </h1>
                        <Link
                          to="/dashboard"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            closeMobileMenu();
                          }}
                          className="flex gap-2 block px-4 py-2 font-medium text-[11px]  text-gray-800 hover:bg-gray-300 transition-colors"
                        >
                          <MdOutlineDashboardCustomize size={15} /> Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            closeMobileMenu();
                          }}
                          className="flex gap-2 block px-4 py-2 font-medium text-[11px]  text-gray-800 hover:bg-gray-300 transition-colors"
                        >
                          <CircleUserRound size={15} /> Profile
                        </Link>
                        <Link
                          to="/dashboard/my-favorite"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            closeMobileMenu();
                          }}
                          className="flex gap-2 block px-4 py-2 font-medium text-[11px]  text-gray-800 hover:bg-gray-300 transition-colors"
                        >
                          <HeartPlus size={15} /> My Favorite
                        </Link>
                        <button
                          onClick={() => {
                            handleLogOut();
                            setIsDropdownOpen(false);
                            closeMobileMenu();
                          }}
                          className="w-full flex gap-2 text-left px-4 py-2 font-medium text-[11px]  text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className={`hidden md:inline-block px-4 py-2 text-sm font-semibold transition-colors ${
                    isHomePage && !isScrolled
                      ? "text-white hover:text-yellow-300 "
                      : "text-black hover:text-gray-600"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className=" px-4 py-2.5 text-sm font-bold text-black bg-[#ffdb58] border-2 border-black transition-all duration-400 hover:translate-x-1 hover:translate-y-1"
                  style={{
                    backgroundColor: "#ffdb58",
                    boxShadow: "2px 2px 0px 0px #000",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                    e.currentTarget.style.transform = "translate(-2px, -2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                    e.currentTarget.style.transform = "translate(2px, 2px)";
                  }}
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-all ${
                isHomePage && !isScrolled ? "text-white " : "text-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pb-4 animate-fadeIn">
            <ul className="flex flex-col gap-1 list-none pt-2">{navlink}</ul>

            {!user && (
              <div className="flex flex-col gap-2 mt-4 px-4">
                <Link
                  to="/auth/login"
                  onClick={closeMobileMenu}
                  className="px-4 py-2 text-sm font-semibold text-center text-black bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={closeMobileMenu}
                  className="px-4 py-2 text-sm font-semibold text-center text-black rounded transition-all"
                  style={{
                    backgroundColor: "#ffdb58",
                    boxShadow: "3px 3px 0px 0px #000",
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
