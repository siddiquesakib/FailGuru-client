import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Link } from "react-router";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";

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
    <div className="min-h-screen bg-[url(/bgimg.png)] py-4 sm:py-6 md:py-8 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Heading className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 uppercase">
            Reported Lessons
          </Heading>
          <Paragraph className="text-sm sm:text-base text-gray-600">
            Manage reported content
          </Paragraph>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div
            className="bg-red-50 border-2 border-black p-4 sm:p-6"
            style={{ boxShadow: "4px 4px 0px 0px #000" }}
          >
            <p className="text-2xl sm:text-3xl font-black text-red-600">
              {reports.length}
            </p>
            <p className="text-xs sm:text-sm font-bold text-gray-600">
              Total Reports
            </p>
          </div>
        </div>

        {/* Reports Table */}
        {reports.length === 0 ? (
          <div
            className="bg-white border-2 border-black p-8 sm:p-12 text-center"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <p className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">
              No Reports!
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              All lessons are clean. Great job!
            </p>
          </div>
        ) : (
          <div
            className="bg-white border-2 border-black overflow-hidden"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b-2 border-black">
                  <tr>
                    <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                      Lesson
                    </th>
                    <th className="hidden sm:table-cell px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                      Reports
                    </th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs sm:text-sm font-black">
                      Reason
                    </th>
                    <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-black">
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
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                        <div>
                          <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900 line-clamp-2">
                            {report.lessonTitle}
                          </p>
                          {/* Show report count on mobile */}
                          <p className="sm:hidden text-xs text-red-600 font-semibold mt-1">
                            🚩 {report.reporters.length} report(s)
                          </p>
                          {/* Show reasons on mobile/tablet */}
                          <div className="md:hidden flex flex-wrap gap-1 mt-1">
                            {report.reasons
                              .slice(0, 2)
                              .map((reasonObj, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700"
                                >
                                  {reasonObj.reason}
                                </span>
                              ))}
                            {report.reasons.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{report.reasons.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Reporter Count */}
                      <td className="hidden sm:table-cell px-3 md:px-4 py-3 md:py-4">
                        <p className="font-bold text-sm sm:text-base text-red-600">
                          {report.reporters.length}
                        </p>
                      </td>

                      {/* Reason */}
                      <td className="hidden md:table-cell px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {report.reasons.map((reasonObj, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 whitespace-nowrap"
                            >
                              {reasonObj.reason}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center items-center">
                          <Link
                            to={`/publiclessons/${report.lessonId}`}
                            className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors text-center whitespace-nowrap"
                          >
                            👁️ <span className="hidden sm:inline">View</span>
                          </Link>
                          <button
                            onClick={() => handleIgnoreAllReports(report._id)}
                            className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-500 text-white text-xs font-bold rounded hover:bg-gray-600 cursor-pointer transition-colors whitespace-nowrap"
                          >
                            ✓ <span className="hidden sm:inline">Ignore</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(report.lessonId)}
                            className="w-full sm:w-auto px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 cursor-pointer transition-colors whitespace-nowrap"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportedLessons;
