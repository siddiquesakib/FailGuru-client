import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import Paragraph from "../../Component/Shared/Paragraph";
import Heading from "../../Component/Shared/Heading";

const ManageLessons = () => {
  //fetch all lessons
  const { data: lessons = [], refetch } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/lessons`);
      return result.data;
    },
  });

  console.log(lessons);

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
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/my-lessons/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete");
            }
            return res.json();
          })
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your lesson has been deleted.",
              icon: "success",
            });
            refetch();
          })
          .catch((err) => {
            console.error("Delete error:", err);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete lesson. Please try again.",
              icon: "error",
            });
          });
      }
    });
  };

  //togle feature
  const toggleFeatured = async (lessonId) => {
    await axios.patch(
      `${
        import.meta.env.VITE_API_URL
      }/admin/lesson/isFeatured/toggle/${lessonId}`
    );
    refetch();
  };

  return (
    <div className="bg-[url(/bgimg.png)] sm:px-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Heading className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 font2">
          Manage Lessons
        </Heading>
        <Paragraph className="text-sm sm:text-base text-gray-600">
          View and manage all lessons
        </Paragraph>
      </div>
      {/* Table */}
      <div
        className="bg-white border-2 border-black overflow-hidden "
        style={{ boxShadow: "8px 8px 0px 0px #000" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                  Title
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                  Featured
                </th>
                <th className="hidden sm:table-cell px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                  Privacy
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
                      {lesson.title}
                    </p>
                    {/* Show privacy on mobile */}
                    <p className="sm:hidden text-xs text-gray-500 mt-1">
                      {lesson.privacy === "Public" ? "🌐" : "🔒"}{" "}
                      {lesson.privacy}
                    </p>
                  </td>

                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                    <button
                      onClick={() => toggleFeatured(lesson._id)}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded border-2 transition-colors whitespace-nowrap ${
                        lesson.isFeatured
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {lesson.isFeatured ? "⭐ Featured" : "☆ Feature"}
                    </button>
                  </td>
                  <td className="hidden sm:table-cell px-3 md:px-4 py-3 md:py-4 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {lesson.privacy === "Public" ? "🌐" : "🔒"}
                      <span className="hidden md:inline">{lesson.privacy}</span>
                    </span>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                    <div className="flex gap-1 sm:gap-2 justify-center">
                      <button
                        onClick={() => handleDelete(lesson._id)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white text-xs font-bold rounded cursor-pointer hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        🗑️ <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {lessons.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">
              No lessons found
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              Lessons will appear here once users create them
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLessons;
