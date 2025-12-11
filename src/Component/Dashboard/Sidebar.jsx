import { NavLink } from "react-router"; 
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logOut } = useAuth();
  const [role, isRoleLoading] = useRole();

  const isAdmin = role === "admin";
  // console.log("Current Role:", role, "Is Admin:", isAdmin);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
      isActive
        ? "bg-purple-600 text-white"
        : "text-gray-700 hover:bg-purple-100"
    } ${isCollapsed ? "justify-center" : ""}`;

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen bg-white border-r-2 border-black p-4 transition-all duration-300 relative`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors z-10"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? "→" : "←"}
      </button>

      {/* User Info */}
      {isCollapsed ? (
        <div className="flex justify-center mb-8">
          <img
            src={user?.photoURL || "https://i.pravatar.cc/150"}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-purple-500"
            title={user?.displayName || "User"}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-lg">
          <img
            src={user?.photoURL || "https://i.pravatar.cc/150"}
            alt="User"
            className="w-12 h-12 rounded-full border-2 border-purple-500"
          />
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {isAdmin ? "👑 Admin" : "👤 Member"}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-2">
        {/* user */}
        <NavLink to="/dashboard" end className={linkClass} title="Dashboard">
          <span className="text-lg">📊</span>
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/dashboard/profile" className={linkClass} title="Profile">
          <span className="text-lg">👤</span>
          {!isCollapsed && <span>Profile</span>}
        </NavLink>
        <NavLink
          to="/dashboard/add-lesson"
          className={linkClass}
          title="Add Lesson"
        >
          <span className="text-lg">➕</span>
          {!isCollapsed && <span>Add Lesson</span>}
        </NavLink>
        <NavLink
          to="/dashboard/my-lesson"
          className={linkClass}
          title="My Lessons"
        >
          <span className="text-lg">📚</span>
          {!isCollapsed && <span>My Lessons</span>}
        </NavLink>
        <NavLink
          to="/dashboard/my-favorite"
          className={linkClass}
          title="My Favorites"
        >
          <span className="text-lg">❤️</span>
          {!isCollapsed && <span>My Favorites</span>}
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
              <span className="text-lg">🏠</span>
              {!isCollapsed && <span>Admin Home</span>}
            </NavLink>
            <NavLink
              to="/dashboard/manage-users"
              className={linkClass}
              title="Manage Users"
            >
              <span className="text-lg">👥</span>
              {!isCollapsed && <span>Manage Users</span>}
            </NavLink>
            <NavLink
              to="/dashboard/manage-lessons"
              className={linkClass}
              title="Manage Lessons"
            >
              <span className="text-lg">📖</span>
              {!isCollapsed && <span>Manage Lessons</span>}
            </NavLink>
            <NavLink
              to="/dashboard/reported-lessons"
              className={linkClass}
              title="Reported Lessons"
            >
              <span className="text-lg">🚨</span>
              {!isCollapsed && <span>Reported Lessons</span>}
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
            <span className="text-lg">🚪</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
