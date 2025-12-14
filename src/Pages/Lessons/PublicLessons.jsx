import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import axios from "axios";
import Container from "../../Component/Shared/Container";
import useAuth from "../../hooks/useAuth";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";

const PublicLessons = () => {
  const { isPremiumUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  //fetch all lessons
  const { data: allLessons = [] } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/lessons`);
      return result.data;
    },
  });

  // Client-side filtering and sorting
  const lessons = useMemo(() => {
    let filtered = [...allLessons];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lesson.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (lesson) => lesson.category === selectedCategory
      );
    }

    // Emotional tone filter
    if (selectedTone) {
      filtered = filtered.filter(
        (lesson) => lesson.emotionalTone === selectedTone
      );
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
    } else if (sortBy === "mostSaved") {
      filtered.sort(
        (a, b) => (b.favoritesCount || 0) - (a.favoritesCount || 0)
      );
    }

    return filtered;
  }, [allLessons, searchTerm, selectedCategory, selectedTone, sortBy]);

  const categories = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];
  const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

  return (
    <Container className="min-h-screen py-4 sm:py-6 md:py-8 px-2 sm:px-4 pt-10">
      <div className="my-8 sm:my-12 md:my-15">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Heading>Public Life Lessons</Heading>
          <Paragraph>
            Explore wisdom and insights shared by our community
          </Paragraph>
        </div>

        {/* Search and Filters */}
        <div
          className="bg-white border-2 border-black p-4 sm:p-6 mb-6 sm:mb-8"
          style={{ boxShadow: "4px 4px 0px 0px #000" }}
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
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Sort by:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  sortBy === "newest"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy("mostSaved")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
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
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Showing <span className="font-semibold">{lessons.length}</span>{" "}
          lessons
        </p>

        {/* Lessons Grid - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className={`bg-white border-2 border-black p-6 transition-all duration-300 flex flex-col h-full ${
                lesson.accessLevel?.toLowerCase() === "premium" &&
                !isPremiumUser
                  ? "opacity-75"
                  : ""
              }`}
              style={{ boxShadow: "4px 4px 0px 0px #000" }}
            >
              {/* Access Level Badge at Top */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    lesson.accessLevel?.toLowerCase() === "premium"
                      ? "bg-yellow-400 text-black"
                      : "bg-green-400 text-black"
                  }`}
                >
                  {lesson.accessLevel?.toLowerCase() === "premium"
                    ? "Premium"
                    : "Free"}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>❤️ {lesson.likesCount || 0}</span>
                  <span>🔖 {lesson.favoritesCount || 0}</span>
                </div>
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-bold mb-3 ${
                  lesson.accessLevel?.toLowerCase() === "premium" &&
                  !isPremiumUser
                    ? "blur-sm"
                    : ""
                }`}
              >
                {lesson.title}
              </h3>

              {/* Description */}
              <p
                className={`text-gray-600 text-sm mb-4 line-clamp-3 flex-grow ${
                  lesson.accessLevel?.toLowerCase() === "premium" &&
                  !isPremiumUser
                    ? "blur-sm"
                    : ""
                }`}
              >
                {lesson.description}
              </p>

              {/* Category */}
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-500">
                  Category:{" "}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {lesson.category}
                </span>
              </div>

              {/* Emotional Tone */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-500">
                  Emotional Tone:{" "}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {lesson.emotionalTone}
                </span>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <img
                  src={lesson.creatorPhoto || "https://i.pravatar.cc/150?img=1"}
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

              {/* Button pushed to absolute bottom */}
              <div className="mt-auto">
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
                    className="block w-full bg-[#ffdb58] text-black font-bold py-3 text-center border-2 border-black transition-all relative"
                    style={{
                      backgroundColor: "#ffdb58",
                      boxShadow: "4px 4px 0px 0px #000",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                      e.currentTarget.style.transform = "translate(2px, 2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                      e.currentTarget.style.transform = "translate(0, 0)";
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
