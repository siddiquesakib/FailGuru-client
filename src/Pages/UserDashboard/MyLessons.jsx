import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAxiosSecure from "../../hooks/UseAxios";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";
import Loading from "../../Component/Shared/Loading/Loading";

const MyLessons = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Helper: decode HTML entities, strip tags and truncate
  const decodeAndTrim = (html = "", max = 80) => {
    try {
      // Strip HTML tags
      const stripped = html.replace(/<[^>]*>/g, "");

      // Decode HTML entities using DOMParser
      const parser = new DOMParser();
      const decoded = parser.parseFromString(stripped, "text/html")
        .documentElement.textContent;

      if (!decoded) return "";
      if (decoded.length <= max) return decoded;
      return decoded.slice(0, max).trim() + "...";
    } catch (err) {
      // Fallback: basic truncation
      if (!html) return "";
      const fallback = html.replace(/<[^>]*>/g, "");
      return fallback.length > max
        ? fallback.slice(0, max).trim() + "..."
        : fallback;
    }
  };

  //fetch lessons
  const { data: lessons = [], refetch } = useQuery({
    queryKey: ["my-lessons", user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-lessons?email=${user.email}`
      );
      return result.data;
    },
    enabled: !!user?.email,
  });

  //delete lesson
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/my-lessons/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Your lesson has been deleted.",
            icon: "success",
          });
          refetch();
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire({
            title: "Error!",
            text:
              err.response?.data?.message ||
              "Failed to delete lesson. Please try again.",
            icon: "error",
          });
        }
      }
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-4 sm:py-6 md:py-8 sm:px-4">
     <title>FailGuru | My Lessons </title>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Heading className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 font2">
            My Lessons
          </Heading>
          <Paragraph className="text-sm sm:text-base text-gray-600">
            Manage all your created lessons
          </Paragraph>
        </div>

        {/* Table */}
        <div
          className="bg-white border-2 border-black overflow-hidden rounded-lg"
          style={{ boxShadow: "4px 4px 0px 0px #000" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                    Title
                  </th>
                  <th className="hidden sm:table-cell px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                    Category
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs sm:text-sm font-black">
                    Stats
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs sm:text-sm font-black">
                    Created
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-black">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="border-b-2 border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                      <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900 line-clamp-2">
                        {decodeAndTrim(lesson.title, 80)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {lesson.emotionalTone}
                      </p>
                      {/* Short preview to keep the table compact */}
                      {lesson.description && (
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                          {decodeAndTrim(lesson.description, 100)}
                        </p>
                      )}
                      {/* Show category on mobile */}
                      <span className="sm:hidden inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-3 md:px-4 py-3 md:py-4">
                      <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-4">
                      <p className="text-xs text-gray-600">
                        ❤️ {lesson.likesCount}
                      </p>
                      <p className="text-xs text-gray-600">
                        🔖 {lesson.favoritesCount}
                      </p>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-4 text-xs sm:text-sm text-gray-600">
                      {new Date(lesson.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                      <div className="flex gap-1 sm:gap-2 justify-center">
                        <Link
                          to={`/publiclessons/${lesson._id}`}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600"
                          title="View Details"
                        >
                          👁️
                        </Link>
                        <Link
                          to={`/dashboard/edit-lesson/${lesson._id}`}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-500 text-white text-xs font-bold rounded hover:bg-purple-600"
                          title="Update"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-8 sm:py-12 px-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-400 mb-2 sm:mb-4">
                No lessons yet
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Create your first lesson to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLessons;
