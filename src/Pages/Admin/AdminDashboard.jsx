import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";
import { CheckCheck, Flag, FolderKanban, User } from "lucide-react";
import { CiTrophy } from "react-icons/ci";
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

const AdminDashboard = () => {
  //fetch all lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const params = new URLSearchParams();

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons?${params.toString()}`
      );
      return result.data;
    },
  });

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

  //fetch all reposts
  const { data: reports = [] } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const params = new URLSearchParams();

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/reports?${params.toString()}`
      );
      return result.data;
    },
  });

  // Today lessons filter
  const todaysLessons = lessons?.filter((l) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const created = new Date(l.createdDate);
    return created >= today;
  });

  //top lessons creator
  const topCreator = users.reduce(
    (max, user) =>
      (user.totalLessonsCreated || 0) > (max.totalLessonsCreated || 0)
        ? user
        : max,
    {}
  );
  console.log(topCreator);

  //data chart
  const totalLessons = lessons.length;
  const totalReports = reports.length;
  const Totalusers = users.length;

  const chartData = [
    {
      name: "My Dashboard",
      lessons: totalLessons,
      Users: Totalusers,
      Reports: totalReports,
    },
  ];

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-8 md:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Heading className="text-4xl font-black mb-2 font2">
            {" "}
            Admin Dashboard
          </Heading>
          <Paragraph className="text-gray-600">
            Welcome back! Here's what's happening today.
          </Paragraph>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div
            className="bg-white  border-2 border-black p-6"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">
                {" "}
                <User size={25} />
              </div>
              <span className="text-sm font-bold text-gray-500">USERS</span>
            </div>
            <h3 className="text-3xl font-black mb-1">{users.length || 0}</h3>
            <p className="text-sm text-gray-600">Total registered users</p>
            <Link
              to="/dashboard/manage-users"
              className="mt-4 inline-block text-sm font-bold text-gray-500 hover:text-gray-700"
            >
              Manage Users →
            </Link>
          </div>

          {/* Total Public Lessons */}
          <div
            className="bg-white  border-2 border-black p-6"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">
                <FolderKanban size={25} />{" "}
              </div>
              <span className="text-sm font-bold text-gray-500">LESSONS</span>
            </div>
            <h3 className="text-3xl font-black mb-1">{lessons.length || 0}</h3>
            <p className="text-sm text-gray-600">Public lessons available</p>
            <Link
              to="/dashboard/manage-lessons"
              className="mt-4 inline-block text-sm font-bold text-gray-500 hover:text-gray-700"
            >
              Manage Lessons →
            </Link>
          </div>

          {/* Total Reported Lessons */}
          <div
            className="bg-white  border-2 border-black p-6"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">
                {" "}
                <Flag color="red" size={30} />{" "}
              </div>
              <span className="text-sm font-bold text-gray-500">REPORTS</span>
            </div>
            <h3 className="text-3xl font-black mb-1 text-red-600">
              {reports.length || 0}
            </h3>
            <p className="text-sm text-gray-600">Flagged for review</p>
            <Link
              to="/dashboard/reported-lessons"
              className="mt-4 inline-block text-sm font-bold text-red-600 hover:text-red-700"
            >
              View Reports →
            </Link>
          </div>

          {/* Today's New Lessons */}
          <div
            className="bg-linear-to-br from-purple-500 to-pink-500  border-2 border-black p-6 text-white"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">
                {" "}
                <CheckCheck size={25} />
              </div>
              <span className="text-sm font-bold text-purple-100">TODAY</span>
            </div>
            <h3 className="text-3xl font-black mb-1">
              {todaysLessons.length || 0}
            </h3>
            <p className="text-sm text-purple-100">New lessons today</p>
            <div className="mt-4 text-sm font-bold text-purple-100">
              Keep it up! 🎉
            </div>
          </div>
        </div>

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
                dataKey="Users"
                fill="#10b981"
                name="Totals Users"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Reports"
                fill="#ec4899"
                name="Total Reports"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Active Contributors */}
        <div
          className="bg-white  border-2 border-black p-6 mb-8"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black">
              <CiTrophy size={30} /> Most Active Contributors
            </h1>
          </div>
          <div className="flex items-center justify-between py-4 bg-gray-50  border-2 border-gray-200 hover:border-purple-400 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-black text-gray-400"></div>
              <img
                src={topCreator.photoURL || "https://i.pravatar.cc/150"}
                alt={topCreator.name}
                className="w-10 md:w-12 hidden md:block rounded-full border-2 border-purple-500"
              />
              <div>
                <p className="font-medium text-sm md:text-[20px] text-gray-900">
                  {topCreator.name}
                </p>
                <p className="text-xs text-gray-500">{topCreator.email}</p>
              </div>
            </div>
            <div className="text-right pr-2">
              <p className="text-2xl font-black text-black">
                {topCreator.totalLessonsCreated}
              </p>
              <p className="text-xs text-gray-500">lessons created</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="bg-white  border-2 border-black p-6"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          <h2 className="text-2xl font-black mb-6">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard/manage-users"
              className="flex items-center gap-3 p-4 bg-purple-50 border-2 border-purple-200  hover:bg-purple-100 transition-all"
            >
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-bold z">Manage Users</p>
                <p className="text-xs text-purple-600">
                  View and edit user roles
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/manage-lessons"
              className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-200  hover:bg-blue-100 transition-all"
            >
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-bold text-blue-900">Manage Lessons</p>
                <p className="text-xs text-blue-600">
                  Review and moderate content
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/reported-lessons"
              className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200  hover:bg-red-100 transition-all"
            >
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-bold text-red-900">View Reports</p>
                <p className="text-xs text-red-600">Handle flagged content</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
