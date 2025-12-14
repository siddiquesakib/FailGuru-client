import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Paragraph from "../../Component/Shared/Paragraph";
import Heading from "../../Component/Shared/Heading";

const ManageUsers = () => {
  //fetch all users
  const { data: users = [], refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const params = new URLSearchParams();

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?${params.toString()}`
      );
      return result.data;
    },
  });

  const handleUsertoAdmin = async (temail) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/update/admin/${temail}`
      );
      refetch();
      toast.success(`${`${temail} are admin now`}`);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[url(/bgimg.png)] py-2 sm:py-4 sm:px-4">
      <title>FailGuru | Manage Users </title>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Heading className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 font2">
          Manage Users
        </Heading>
        <Paragraph className="text-sm sm:text-base text-gray-600">
          View and manage all users
        </Paragraph>
      </div>

      {/* Table */}
      <div
        className="bg-white border-2 border-black overflow-hidden "
        style={{ boxShadow: "4px 4px 0px 0px #000" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                  User
                </th>
                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                  Role
                </th>
                <th className="hidden sm:table-cell px-3 md:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-black">
                  Lessons
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs sm:text-sm font-black">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((lesson) => (
                <tr
                  key={lesson._id}
                  className="border-b-2 border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                    <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900 line-clamp-1">
                      {lesson.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                      {lesson.email}
                    </p>
                    {/* Show lesson count on mobile */}
                    <p className="sm:hidden text-xs text-gray-600 mt-1">
                      📚 {lesson.totalLessonsCreated} lessons
                    </p>
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                    <button
                      onClick={() => handleUsertoAdmin(lesson.email)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded border-2 border-purple-300 hover:bg-purple-200 transition-colors whitespace-nowrap"
                    >
                      {lesson.role === "admin" ? "👑 Admin" : "👤 User"}
                    </button>
                  </td>
                  <td className="hidden sm:table-cell px-3 md:px-4 py-3 md:py-4">
                    <p className="text-base sm:text-lg md:text-xl text-center font-bold text-gray-900">
                      {lesson.totalLessonsCreated}
                    </p>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 text-xs sm:text-sm text-gray-600">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">
              No users found
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              Users will appear here once they register
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
