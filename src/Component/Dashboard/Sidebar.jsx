import { NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import {
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Crown,
  FileHeart,
  Flag,
  FolderKanban,
  FolderPlus,
  HeartPlus,
  House,
  LogOut,
  User,
  User2,
  UserPen,
  Users,
  UserStar,
} from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logOut } = useAuth();
  const [role] = useRole();

  const isAdmin = role === "admin";
  console.log("Current Role:", role, "Is Admin:", isAdmin);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
      isActive ? "bg-black text-white" : "text-gray-800 hover:bg-gray-300"
    } ${isCollapsed ? "justify-center" : ""}`;

  return (
    <div
      className={`${
        isCollapsed ? "w-15 md:w-20" : "w-35 md:w-50"
      } min-h-screen bg-[#f6f7f9] border-r-2 border-black p-4 transition-all duration-300 relative`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-colors z-10"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft />}
      </button>

      {/* User Info */}
      {isCollapsed ? (
        <div className="flex justify-center mb-8">
          <img
            src={user?.photoURL || "https://i.pravatar.cc/150"}
            alt="User"
            className="w-7 md:w-9  md:h-9 rounded-full border-2 border-black"
            title={user?.displayName || "User"}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-lg">
          <img
            src={user?.photoURL || "https://i.pravatar.cc/150"}
            alt="User"
            className="w-9 h-9 rounded-full border-2 border-black"
          />
          <div className="overflow-hidden">
            <p className="font-medium text-[10px] truncate">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {isAdmin ? (
                <Crown color="#000" size={15} />
              ) : (
                <User color="#000" size={15} />
              )}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-2">
        {/* user */}
        <NavLink to="/dashboard" end className={linkClass} title="Dashboard">
          <span className="text-lg">
            <MdOutlineDashboardCustomize size={15} />
          </span>
          {!isCollapsed && <span className="text-[10px] md:text-[13px]">Dashboard</span>}
        </NavLink>
        <NavLink to="/dashboard/profile" className={linkClass} title="Profile">
          <span className="text-lg">
           <CircleUserRound size={15} />
          </span>
          {!isCollapsed && <span className="text-[10px] md:text-[13px]">Profile</span>}
        </NavLink>
        <NavLink
          to="/dashboard/add-lesson"
          className={linkClass}
          title="Add Lesson"
        >
          <span className="text-lg">
            <FolderPlus size={15} />
          </span>
          {!isCollapsed && <span className="text-[10px] md:text-[13px]">Add Lesson</span>}
        </NavLink>
        <NavLink
          to="/dashboard/my-lesson"
          className={linkClass}
          title="My Lessons"
        >
          <span className="text-lg">
            <BookOpenCheck size={15} />
          </span>
          {!isCollapsed && <span className="text-[10px] md:text-[13px]">My Lessons</span>}
        </NavLink>
        <NavLink
          to="/dashboard/my-favorite"
          className={linkClass}
          title="My Favorites"
        >
          <span className="text-lg">
           <FileHeart size={15} />
          </span>
          {!isCollapsed && <span className="text-[10px] md:text-[13px]">My Favorites</span>}
        </NavLink>

        {/* admin  */}
        {isAdmin && (
          <>
            <div className="border-t border-gray-300 my-4 pt-4">
              {!isCollapsed && (
                <p className="text-xs text-gray-500 uppercase font-bold mb-2 px-4">
                  Admin Panel
                </p>
              )}
            </div>
            <NavLink
              to="/dashboard/admin"
              className={linkClass}
              title="Admin Home"
            >
              <span className="text-lg">
                <House size={15} />
              </span>
              {!isCollapsed && <span className="text-[10px] md:text-[13px]">Admin Home</span>}
            </NavLink>
            <NavLink
              to="/dashboard/manage-users"
              className={linkClass}
              title="Manage Users"
            >
              <span className="text-lg">
                <Users size={15} />
              </span>
              {!isCollapsed && (
                <span className="text-[10px] md:text-[13px]">Manage Users</span>
              )}
            </NavLink>
            <NavLink
              to="/dashboard/manage-lessons"
              className={linkClass}
              title="Manage Lessons"
            >
              <span className="text-lg">
                <FolderKanban size={15} />
              </span>
              {!isCollapsed && (
                <span className="text-[10px] md:text-[13px]">Manage Lessons</span>
              )}
            </NavLink>
            <NavLink
              to="/dashboard/reported-lessons"
              className={linkClass}
              title="Reported Lessons"
            >
              <span className="text-lg">
                <Flag size={15} />
              </span>
              {!isCollapsed && (
                <span className="text-[10px] md:text-[13px]">Reported Lessons</span>
              )}
            </NavLink>
          </>
        )}

        {/* Logout */}
        <div className="border-t border-gray-300 my-4 pt-4">
          <button
            onClick={logOut}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 w-full transition-all ${
              isCollapsed ? "justify-center" : ""
            }`}
            title="Logout"
          >
            <span className="text-lg">
              <LogOut size={15}/>
            </span>
            {!isCollapsed && <span className="text-[10px] md:text-[13px]">Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
