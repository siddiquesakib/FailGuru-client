import React from "react";
import useAuth from "../../hooks/useAuth";
import Loading from "../../Component/Shared/Loading/Loading";

const UserDashboard = () => {
  const { user } = useAuth();


  return (
    <div className=" py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome Back, {user?.displayName}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your growth, manage lessons, and inspire others with your
            wisdom.
          </p>
        </div>

        {/* Stats Cards */}
      </div>
    </div>
  );
};

export default UserDashboard;
