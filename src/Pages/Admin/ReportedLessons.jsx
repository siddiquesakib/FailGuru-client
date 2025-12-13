import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Link } from "react-router";

const ReportedLessons = () => {
  // Fetch all reports
  const { data: reports = [], refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/reports`);
      return result.data;
    },
  });

  const handleDeleteLesson = async (lessonId) => {
    Swal.fire({
      title: "Delete this lesson?",
      text: "This will permanently delete the lesson AND all related reports!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${
              import.meta.env.VITE_API_URL
            }/admin/lessons/${lessonId}/with-reports`
          );
          refetch();
          toast.success("Lesson & all reports deleted!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete lesson");
        }
      }
    });
  };

  const handleIgnoreAllReports = async (reportId) => {
    Swal.fire({
      title: "Dismiss this report?",
      text: "This report will be removed but the lesson will remain.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, dismiss it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/reports/${reportId}`
          );
          refetch();
          toast.success("Report dismissed!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to dismiss report");
        }
      }
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 uppercase">
            Reported Lessons
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            className="bg-red-50 border-2 border-black rounded-lg p-4"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <p className="text-3xl font-black text-red-600">{reports.length}</p>
            <p className="text-sm font-bold text-gray-600">Total Reports</p>
          </div>
        </div>

        {/* Reports Table */}
        {reports.length === 0 ? (
          <div
            className="bg-white rounded-lg border-2 border-black p-12 text-center"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <p className="text-2xl font-bold text-gray-400 mb-2">No Reports!</p>
            <p className="text-gray-600">All lessons are clean. Great job!</p>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg border-2 border-black overflow-hidden"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b-2 border-black">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-black">
                      Lesson
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-black">
                      Total Reports
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-black">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-black">
                      View
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-b-2 border-gray-200 hover:bg-red-50/50 transition-colors"
                    >
                      {/* Lesson Info */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">
                              {report.lessonTitle}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Reporter */}
                      <td className="px-4 py-4">
                        <p className="font-semibold text-sm">
                          {report.reporters.length || 0}
                        </p>
                      </td>

                      {/* Reason */}
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {report.reasons.map((reasonObj, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700"
                            >
                              {reasonObj.reason}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* View */}
                      <td className="">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <Link
                            to={`/publiclessons/${report.lessonId}`}
                            className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button
                            onClick={() => handleIgnoreAllReports(report._id)}
                            className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded hover:bg-gray-600 cursor-pointer transition-colors"
                          >
                            Ignore
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(report.lessonId)}
                            className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 cursor-pointer transition-colors"
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
        )}
      </div>
    </div>
  );
};

export default ReportedLessons;
