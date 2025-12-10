import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Link } from "react-router";

const ManageUsers = () => {
  //fetch all users
  const { data: users = [] } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const params = new URLSearchParams();

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?${params.toString()}`
      );
      return result.data;
    },
  });

  console.log(users);

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
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-black">
                  Role
                </th>

                <th className="px-4 py-3 text-left text-sm font-black">
                  Total Lessons Created
                </th>
                <th className="px-4 py-3 text-left text-sm font-black">
                  Create Account
                </th>
                
              </tr>
            </thead>
            <tbody>
              {users.map((lesson) => (
                <tr
                  key={lesson._id}
                  className="border-b-2 border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <p className="font-bold text-gray-900">{lesson.name}</p>
                    <p className="text-xs text-gray-500">
                      {lesson.email}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                      {lesson.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-600">
                      {lesson.totalLessonsCreated}
                    </p>
                   
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* {lessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-gray-400 mb-4">
              No lessons yet
            </p>
            <p className="text-gray-600">
              Create your first lesson to get started!
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ManageUsers;
