import React from "react";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { BookOpen, Heart, PlusCircle, Star } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  //data chart
  const totalLessons = myLessons.length;
  const totalLikes = myLessons.reduce((sum, l) => sum + (l.likesCount || 0), 0);
  const totalFavorites = favorites.length;

  const chartData = [
    {
      name: "My Dashboard",
      lessons: totalLessons,
      likes: totalLikes,
      favorites: totalFavorites,
    },
  ];

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-4 sm:py-6 md:py-8">
      <title>FailGuru | Dashboard </title>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-4">
            Welcome Back, {user?.displayName?.split(" ")[0]}! 👋
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Track your growth, manage lessons, and inspire others with your
            wisdom.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {/* My Lessons */}
          <div
            className="bg-white  border-2 border-black p-3 sm:p-4 md:p-6"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl">📚</div>
              <BookOpen className="text-purple-500 hidden sm:block" size={20} />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1">
              {myLessons.length}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">My Lessons</p>
          </div>

          {/* Favorites */}
          <div
            className="bg-white  border-2 border-black p-3 sm:p-4 md:p-6"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl">❤️</div>
              <Heart className="text-red-500 hidden sm:block" size={20} />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1">
              {favorites.length}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">Favorites</p>
          </div>

          {/* Total Likes */}
          <div
            className="bg-white  border-2 border-black p-3 sm:p-4 md:p-6"
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
            className={` border-2 border-black p-3 sm:p-4 md:p-6 ${
              isPremiumUser
                ? "bg-gradient-to-br from-yellow-400 to-orange-400"
                : "bg-gray-100"
            }`}
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl">
                {isPremiumUser ? "⭐" : "🔓"}
              </div>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-1">
              {isPremiumUser ? "Premium" : "Free"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700">Account Status</p>
          </div>
        </div>

        {/* chart */}
        <div
          className="pt-6 sm:pt-10 max-w-4xl mx-auto bg-white  border-2 border-black p-4 sm:p-6 mb-8"
          style={{ boxShadow: "6px 6px 0px 0px #000" }}
        >
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 sm:mb-6">
            📊 Statistics Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis tick={{ fontSize: 12 }} width={40} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "2px solid #000",
                  borderRadius: "8px",
                  boxShadow: "4px 4px 0px 0px #000",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} iconType="circle" />
              <Bar
                dataKey="lessons"
                fill="#3b82f6"
                name="My Lessons"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="favorites"
                fill="#10b981"
                name="Favorite"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="likes"
                fill="#ec4899"
                name="Total Likes"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div
          className="bg-white  border-2 border-black p-4 sm:p-6 mb-6 sm:mb-8"
          style={{ boxShadow: "6px 6px 0px 0px #000" }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-4 sm:mb-6">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link
              to="/dashboard/add-lesson"
              className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 border-2 border-purple-200  hover:bg-purple-100 transition-all"
            >
              <PlusCircle className="text-purple-600" size={24} />
              <div>
                <p className="font-bold text-sm sm:text-base text-purple-900">
                  Add New Lesson
                </p>
                <p className="text-xs text-purple-600">Share your wisdom</p>
              </div>
            </Link>

            <Link
              to="/dashboard/my-lesson"
              className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200  hover:bg-blue-100 transition-all"
            >
              <BookOpen className="text-blue-600" size={24} />
              <div>
                <p className="font-bold text-sm sm:text-base text-blue-900">
                  My Lessons
                </p>
                <p className="text-xs text-blue-600">Manage your content</p>
              </div>
            </Link>

            <Link
              to="/dashboard/my-favorite"
              className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 border-2 border-red-200  hover:bg-red-100 transition-all"
            >
              <Heart className="text-red-600" size={24} />
              <div>
                <p className="font-bold text-sm sm:text-base text-red-900">
                  My Favorites
                </p>
                <p className="text-xs text-red-600">Saved lessons</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Lessons */}
        {myLessons.length > 0 && (
          <div
            className="bg-white  border-2 border-black p-4 sm:p-6"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black">
                📝 Recent Lessons
              </h2>
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50  border border-gray-200 gap-2 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {lesson.category} •{" "}
                      {new Date(lesson.createdDate).toLocaleDateString()}
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
