import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";

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
    <div>
      {/* Table */}
      <div
        className="bg-white  border-4 border-black overflow-hidden"
        style={{ boxShadow: "8px 8px 0px 0px #000" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-black">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-black">
                  Featured
                </th>

                <th className="px-4 py-3 text-left text-sm font-black">
                  Privacy
                </th>

                <th className="px-4 py-3 text-center text-sm font-black">
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
                  <td className="px-4 py-4">
                    <p className="font-bold text-gray-900">{lesson.title}</p>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleFeatured(lesson._id)}
                      className="px-2 py-3 bg-purple-100 text-purple-700 text-xs font-medium border-2   btn btn-xs"
                    >
                      {lesson.isFeatured ? "Featured" : "Not Featured"}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {lesson.privacy}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleDelete(lesson._id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded cursor-pointer hover:bg-red-600"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageLessons;
