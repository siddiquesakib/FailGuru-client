import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const PublicLessons = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["lessons", searchTerm, selectedCategory, selectedTone, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedTone) params.append("tone", selectedTone);
      if (sortBy) params.append("sort", sortBy);

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons?${params.toString()}`
      );
      return result.data;
    },
  });

  // Dummy data - replace with your API call
  // const lessons = [
  //   {
  //     id: 1,
  //     title: "Embracing Failure as Growth",
  //     description:
  //       "Learning to see failures not as setbacks but as stepping stones to success. This mindset shift changed everything for me.",
  //     category: "Personal Growth",
  //     emotionalTone: "Motivational",
  //     creatorName: "Sarah Johnson",
  //     creatorPhoto: "https://i.pravatar.cc/150?img=1",
  //     accessLevel: "Free",
  //     createdDate: "2025-01-15",
  //     likesCount: 234,
  //     favoritesCount: 89,
  //     image:
  //       "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400",
  //   },
  //   {
  //     id: 2,
  //     title: "The Power of Saying No",
  //     description:
  //       "Understanding that saying no to others sometimes means saying yes to yourself. A lesson in boundaries and self-respect.",
  //     category: "Mindset",
  //     emotionalTone: "Realization",
  //     creatorName: "Michael Chen",
  //     creatorPhoto: "https://i.pravatar.cc/150?img=2",
  //     accessLevel: "Premium",
  //     createdDate: "2025-01-10",
  //     likesCount: 456,
  //     favoritesCount: 178,
  //     image:
  //       "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
  //   },
  //   {
  //     id: 3,
  //     title: "Career Pivot at 35",
  //     description:
  //       "How I left a secure corporate job to pursue my passion. The fears, the challenges, and the ultimate reward.",
  //     category: "Career",
  //     emotionalTone: "Motivational",
  //     creatorName: "Emily Rodriguez",
  //     creatorPhoto: "https://i.pravatar.cc/150?img=3",
  //     accessLevel: "Free",
  //     createdDate: "2025-01-08",
  //     likesCount: 567,
  //     favoritesCount: 234,
  //     image:
  //       "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
  //   },
  //   {
  //     id: 4,
  //     title: "Healing Through Gratitude",
  //     description:
  //       "During my darkest days, gratitude became my anchor. Here is how practicing daily gratitude transformed my mental health.",
  //     category: "Personal Growth",
  //     emotionalTone: "Gratitude",
  //     creatorName: "James Williams",
  //     creatorPhoto: "https://i.pravatar.cc/150?img=4",
  //     accessLevel: "Free",
  //     createdDate: "2025-01-05",
  //     likesCount: 789,
  //     favoritesCount: 345,
  //     image:
  //       "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
  //   },
  //   {
  //     id: 5,
  //     title: "Building Authentic Relationships",
  //     description:
  //       "The moment I stopped trying to impress and started being authentic. Quality over quantity in friendships.",
  //     category: "Relationships",
  //     emotionalTone: "Realization",
  //     creatorName: "Lisa Anderson",
  //     creatorPhoto: "https://i.pravatar.cc/150?img=5",
  //     accessLevel: "Premium",
  //     createdDate: "2025-01-03",
  //     likesCount: 432,
  //     favoritesCount: 167,
  //     image:
  //       "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400",
  //   },
  //   {
  //     id: 6,
  //     title: "Learning from My Biggest Mistake",
  //     description:
  //       "A costly business decision that taught me more than any success ever could. Sometimes pain is the best teacher.",
  //     category: "Mistakes Learned",
  //     emotionalTone: "Sad",
  //     creatorName: "David Kim",
  //     creatorPhoto: "https://i.pravatar.cc/150?img=6",
  //     accessLevel: "Free",
  //     createdDate: "2025-01-01",
  //     likesCount: 678,
  //     favoritesCount: 289,
  //     image:
  //       "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
  //   },
  // ];

  const categories = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];
  const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

  // Check if user is premium (replace with your auth logic)
  const isPremiumUser = false;

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Public Life Lessons</h1>
          <p className="text-gray-600 text-lg">
            Explore wisdom and insights shared by our community
          </p>
        </div>

        {/* Search and Filters */}
        <div
          className="bg-white rounded-lg border-3 border-black p-6 mb-8"
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
              key={lesson.id}
              className={`bg-white rounded-lg border-3 border-black overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                lesson.accessLevel === "Premium" && !isPremiumUser
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
                    lesson.accessLevel === "Premium" && !isPremiumUser
                      ? "blur-sm"
                      : ""
                  }`}
                />
                {lesson.accessLevel === "Premium" && !isPremiumUser && (
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
                    lesson.accessLevel === "Premium"
                      ? "bg-yellow-400 text-black border-2 border-black"
                      : "bg-green-400 text-black border-2 border-black"
                  }`}
                >
                  {lesson.accessLevel}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    lesson.accessLevel === "Premium" && !isPremiumUser
                      ? "blur-sm"
                      : ""
                  }`}
                >
                  {lesson.title}
                </h3>

                <p
                  className={`text-gray-600 text-sm mb-4 line-clamp-2 ${
                    lesson.accessLevel === "Premium" && !isPremiumUser
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
                    src={lesson.creatorPhoto}
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
                      ❤️ {lesson.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      🔖 {lesson.favoritesCount}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                {lesson.accessLevel === "Premium" && !isPremiumUser ? (
                  <Link
                    to="/pricing"
                    className="block w-full text-center py-3 bg-yellow-400 text-black font-bold rounded-lg border-2 border-black transition-all"
                    style={{ boxShadow: "3px 3px 0px 0px #000" }}
                  >
                    Upgrade to View
                  </Link>
                ) : (
                  <Link
                    to={`/publiclessonsdetails/${lesson.id}`}
                    className="block w-full text-center py-3 bg-purple-600 text-white font-bold rounded-lg border-2 border-black transition-all hover:bg-purple-700"
                    style={{ boxShadow: "3px 3px 0px 0px #000" }}
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
    </div>
  );
};

export default PublicLessons;
