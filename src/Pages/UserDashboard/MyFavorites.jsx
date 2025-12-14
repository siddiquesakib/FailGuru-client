import React, { useState } from "react";
import { Link } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";
import Loading from "../../Component/Shared/Loading/Loading";

const MyFavorites = () => {
  const { user } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [toneFilter, setToneFilter] = useState("All");

  const categories = [
    "All",
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];
  const emotionalTones = [
    "All",
    "Motivational",
    "Sad",
    "Realization",
    "Gratitude",
  ];

  // Fetch favorites
  const {
    data: favorites,
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-favorites", user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/favorites?email=${user.email}`
      );
      return result.data;
    },
    enabled: !!user?.email, // user.email check kora better
  });

  // Remove from favorites mutation
  const { mutateAsync: removeFromFavorites } = useMutation({
    mutationFn: async (lessonId) =>
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/favorites/${lessonId}?userEmail=${
          user.email
        }`
      ),
    onSuccess: () => {
      toast.success("Removed from favorites!");
      refetch();
    },
  });

  if (isLoading) return <Loading />;

  // Handle remove favorite with confirmation
  const handleRemoveFavorite = (lessonId, lessonTitle) => {
    Swal.fire({
      title: "Remove from favorites?",
      text: `"${lessonTitle}" will be removed from your favorites.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeFromFavorites(lessonId);
          Swal.fire({
            title: "Removed!",
            text: "Lesson removed from favorites.",
            icon: "success",
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "Failed to remove from favorites.",
            icon: "error",
          });
        }
      }
    });
  };

  // Filter favorites
  const filteredFavorites = favorites?.filter((fav) => {
    const matchesCategory =
      categoryFilter === "All" || fav.lessonCategory === categoryFilter;
    const matchesTone = toneFilter === "All" || fav.lessonTone === toneFilter;
    return matchesCategory && matchesTone;
  });

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-4 sm:py-6 md:py-8  sm:px-4">
      <title>FailGuru | My Favorite </title>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Heading className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 font2">
            My Favorites
          </Heading>
          <Paragraph className="text-sm sm:text-base text-gray-600">
            {favorites?.length || 0} lessons saved
          </Paragraph>
        </div>

        {/* Filters */}
        <div
          className="bg-white  border-2 border-black p-4 sm:p-6 mb-4 sm:mb-6"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                Filter by Emotional Tone
              </label>
              <select
                value={toneFilter}
                onChange={(e) => setToneFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table or Empty State */}
        {filteredFavorites?.length === 0 ? (
          <div
            className="bg-white  border-2 border-black p-8 sm:p-12 text-center"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <p className="text-xl sm:text-2xl font-bold text-gray-400 mb-2 sm:mb-4">
              No favorites found
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              {categoryFilter !== "All" || toneFilter !== "All"
                ? "Try changing your filters"
                : "Start exploring and save your favorite lessons!"}
            </p>
            <Link
              to="/publiclessons"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-purple-500 text-white text-sm sm:text-base font-bold rounded-lg hover:bg-purple-600 transition-colors"
            >
              Explore Lessons
            </Link>
          </div>
        ) : (
          <div
            className="bg-white  border-2 border-black overflow-hidden"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-black">
                  <tr>
                    <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                      Lesson
                    </th>
                    <th className="hidden sm:table-cell px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                      Category
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs sm:text-sm font-black">
                      Tone
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs sm:text-sm font-black">
                      Saved On
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFavorites?.map((favorite) => (
                    <tr
                      key={favorite._id}
                      className="border-b-2 border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="min-w-0">
                            <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900 line-clamp-2">
                              {favorite.lessonTitle}
                            </p>
                            {/* Show category and tone on mobile */}
                            <div className="sm:hidden flex flex-wrap gap-1 mt-1">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                {favorite.lessonCategory}
                              </span>
                              <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-bold rounded-full">
                                {favorite.lessonTone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 md:px-4 py-3 md:py-4">
                        <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full whitespace-nowrap">
                          {favorite.lessonCategory}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4">
                        <span className="px-2 sm:px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full whitespace-nowrap">
                          {favorite.lessonTone}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4 text-xs sm:text-sm text-gray-600">
                        {new Date(favorite.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
                          <Link
                            to={`/publiclessons/${favorite.lessonId}`}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors text-center whitespace-nowrap"
                            title="View Details"
                          >
                            👁️ <span className="hidden sm:inline">View</span>
                          </Link>
                          <button
                            onClick={() =>
                              handleRemoveFavorite(
                                favorite.lessonId,
                                favorite.lessonTitle
                              )
                            }
                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                            title="Remove from favorites"
                          >
                            ❌ <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
