import React from "react";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { BookOpen, Heart, PlusCircle, Star } from "lucide-react";

const UserDashboard = () => {
  const { user, isPremiumUser } = useAuth();

  // Fetch user's lessons
  const { data: myLessons = [] } = useQuery({
    queryKey: ["my-lessons", user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-lessons?email=${user.email}`
      );
      return result.data;
    },
    enabled: !!user?.email,
  });

  // Fetch user's favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/favorites?email=${user.email}`
      );
      return result.data;
    },
    enabled: !!user?.email,
  });

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-4">
            Welcome Back, {user?.displayName?.split(" ")[0]}! 👋
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Track your growth, manage lessons, and inspire others with your wisdom.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {/* My Lessons */}
          <div
            className="bg-white rounded-lg border-2 border-black p-3 sm:p-4 md:p-6"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl">📚</div>
              <BookOpen className="text-purple-500 hidden sm:block" size={20} />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1">{myLessons.length}</h3>
            <p className="text-xs sm:text-sm text-gray-600">My Lessons</p>
          </div>

          {/* Favorites */}
          <div
            className="bg-white rounded-lg border-2 border-black p-3 sm:p-4 md:p-6"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl">❤️</div>
              <Heart className="text-red-500 hidden sm:block" size={20} />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1">{favorites.length}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Favorites</p>
          </div>

          {/* Total Likes */}
          <div
            className="bg-white rounded-lg border-2 border-black p-3 sm:p-4 md:p-6"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl">👍</div>
              <Star className="text-yellow-500 hidden sm:block" size={20} />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1">
              {myLessons.reduce((sum, l) => sum + (l.likesCount || 0), 0)}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">Total Likes</p>
          </div>

          {/* Premium Status */}
          <div
            className={`rounded-lg border-2 border-black p-3 sm:p-4 md:p-6 ${
              isPremiumUser ? "bg-gradient-to-br from-yellow-400 to-orange-400" : "bg-gray-100"
            }`}
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl">{isPremiumUser ? "⭐" : "🔓"}</div>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1">
              {isPremiumUser ? "Premium" : "Free"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700">Account Status</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="bg-white rounded-lg border-2 border-black p-4 sm:p-6 mb-6 sm:mb-8"
          style={{ boxShadow: "6px 6px 0px 0px #000" }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-4 sm:mb-6">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link
              to="/dashboard/add-lesson"
              className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-all"
            >
              <PlusCircle className="text-purple-600" size={24} />
              <div>
                <p className="font-bold text-sm sm:text-base text-purple-900">Add New Lesson</p>
                <p className="text-xs text-purple-600">Share your wisdom</p>
              </div>
            </Link>

            <Link
              to="/dashboard/my-lesson"
              className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
            >
              <BookOpen className="text-blue-600" size={24} />
              <div>
                <p className="font-bold text-sm sm:text-base text-blue-900">My Lessons</p>
                <p className="text-xs text-blue-600">Manage your content</p>
              </div>
            </Link>

            <Link
              to="/dashboard/my-favorite"
              className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-all"
            >
              <Heart className="text-red-600" size={24} />
              <div>
                <p className="font-bold text-sm sm:text-base text-red-900">My Favorites</p>
                <p className="text-xs text-red-600">Saved lessons</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Lessons */}
        {myLessons.length > 0 && (
          <div
            className="bg-white rounded-lg border-2 border-black p-4 sm:p-6"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black">📝 Recent Lessons</h2>
              <Link
                to="/dashboard/my-lesson"
                className="text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-700"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {myLessons.slice(0, 3).map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 gap-2 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base truncate">{lesson.title}</h3>
                    <p className="text-xs text-gray-500">
                      {lesson.category} • {new Date(lesson.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                    <span>❤️ {lesson.likesCount || 0}</span>
                    <span>🔖 {lesson.favoritesCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
