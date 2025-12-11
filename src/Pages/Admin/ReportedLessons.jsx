import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Link } from "react-router";

const ReportedLessons = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch all reports
  const { data: reports = [], refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/reports`);
      return result.data;
    },
  });

  // Handle delete lesson
  const handleDeleteLesson = async (lessonId, reportId) => {
    Swal.fire({
      title: "Delete this lesson?",
      text: "This will permanently delete the reported lesson!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/lessons/${lessonId}`
          );
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/reports/${reportId}`
          );
          refetch();
          toast.success("Lesson deleted successfully!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete lesson");
        }
      }
    });
  };

  // Handle dismiss report
  const handleDismissReport = async (reportId) => {
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
          <h1 className="text-4xl font-black mb-2 font2">Reported Lessons</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            className="bg-red-50 border-4 border-black rounded-lg p-4"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <p className="text-3xl font-black text-red-600">{reports.length}</p>
            <p className="text-sm font-bold text-gray-600">Total Reports</p>
          </div>
        </div>

        {/* Reports Table */}
        {reports.length === 0 ? (
          <div
            className="bg-white rounded-lg border-4 border-black p-12 text-center"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <p className="text-6xl mb-4">✅</p>
            <p className="text-2xl font-bold text-gray-400 mb-2">No Reports!</p>
            <p className="text-gray-600">All lessons are clean. Great job!</p>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg border-4 border-black overflow-hidden"
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
                      Reported By
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-black">
                      Reason
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
                          {report.reporterName || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.reporterEmail}
                        </p>
                      </td>

                      {/* Reason */}
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            report.reason === "Inappropriate Content"
                              ? "bg-red-100 text-red-700"
                              : report.reason === "Spam"
                              ? "bg-yellow-100 text-yellow-700"
                              : report.reason === "Harassment"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {report.reason}
                        </span>
                        {report.details && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {report.details}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <Link
                            to={`/publiclessons/${report.lessonId}`}
                            onClick={() => setSelectedReport(report)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors"
                          >
                            View
                          </Link>

                          <button
                            onClick={() =>
                              handleDeleteLesson(report.lessonId, report._id)
                            }
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

        {/* View Details Modal */}
      </div>
    </div>
  );
};

export default ReportedLessons;
