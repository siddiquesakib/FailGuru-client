import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import Container from "../../Component/Shared/Container";
import useAuth from "../../hooks/useAuth";

const PublicLessons = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  // const  [userData, setUserData] = useState(null);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["lessons", searchTerm, selectedCategory, selectedTone, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons?${params.toString()}`
      );
      return result.data;
    },
  });

  // Fetch user data from MongoDB
  const { data: userData = null } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`
      );
      return result.data;
    },
    enabled: !!user?.email,
  });

  // Check if user is premium
  const isPremiumUser =
    userData?.email === user?.email && userData?.isPremium === true;

  const categories = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];
  const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

  console.log("Auth User Email:", user?.email);
  console.log("DB User Data:", userData);
  console.log("Is Premium:", isPremiumUser);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading lessons...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="my-15">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 font2">
            Public Life Lessons
          </h1>
          <p className="text-gray-600 text-lg">
            Explore wisdom and insights shared by our community
          </p>
        </div>

        {/* Search and Filters */}
        <div
          className="bg-white  border-3 border-black p-6 mb-8"
          style={{ boxShadow: "6px 6px 0px 0px #000" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search by title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Emotional Tone Filter */}
            <div>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Tones</option>
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">
              Sort by:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "newest"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy("mostSaved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "mostSaved"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Most Saved
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          Showing <span className="font-semibold">{lessons.length}</span>{" "}
          lessons
        </p>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className={`bg-white border-3 rounded-2xl border-black overflow-hidden transition-all duration-300  ${
                lesson.accessLevel?.toLowerCase() === "premium" &&
                !isPremiumUser
                  ? "opacity-75 relative"
                  : ""
              }`}
              style={{ boxShadow: "4px 4px 0px 0px #000" }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={lesson.image}
                  alt={lesson.title}
                  className={`w-full h-full object-cover ${
                    lesson.accessLevel?.toLowerCase() === "premium" &&
                    !isPremiumUser
                      ? "blur-sm"
                      : ""
                  }`}
                />
                {lesson.accessLevel?.toLowerCase() === "premium" &&
                  !isPremiumUser && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="font-bold text-sm">Premium Lesson</p>
                      </div>
                    </div>
                  )}
                {/* Access Level Badge */}
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                    lesson.accessLevel?.toLowerCase() === "premium"
                      ? "bg-yellow-400 text-black border-2 border-black"
                      : "bg-green-400 text-black border-2 border-black"
                  }`}
                >
                  {lesson.accessLevel?.toLowerCase() === "premium"
                    ? "Premium"
                    : "Free"}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    lesson.accessLevel?.toLowerCase() === "premium" &&
                    !isPremiumUser
                      ? "blur-sm"
                      : ""
                  }`}
                >
                  {lesson.title}
                </h3>

                <p
                  className={`text-gray-600 text-sm mb-4 line-clamp-2 ${
                    lesson.accessLevel?.toLowerCase() === "premium" &&
                    !isPremiumUser
                      ? "blur-sm"
                      : ""
                  }`}
                >
                  {lesson.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    {lesson.category}
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full">
                    {lesson.emotionalTone}
                  </span>
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <img
                    src={
                      lesson.creatorPhoto || "https://i.pravatar.cc/150?img=1"
                    }
                    alt={lesson.creatorName}
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {lesson.creatorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(lesson.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      ❤️ {lesson.likesCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      🔖 {lesson.favoritesCount || 0}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {lesson.accessLevel?.toLowerCase() === "premium" &&
                !isPremiumUser ? (
                  <Link
                    to="/pricing"
                    className="block w-full text-center py-3 bg-yellow-400 text-black font-bold rounded-lg border-2 border-black transition-all"
                    style={{ boxShadow: "3px 3px 0px 0px #000" }}
                  >
                    Upgrade to View
                  </Link>
                ) : (
                  <Link
                    to={`/publiclessons/${lesson._id}`}
                    className="block w-full bg-[#ffdb58] text-black font-semibold py-4 text-base text-center border-3 rounded-xl border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                    style={{
                      border: "3px solid #000",
                      boxShadow: "4px 4px 0px 0px #000",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                    }}
                  >
                    See Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {lessons.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl font-bold text-gray-400 mb-2">
              No lessons found
            </p>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default PublicLessons;
