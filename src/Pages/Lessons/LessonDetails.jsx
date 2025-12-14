import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { BsTwitterX } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { IoMdArrowBack } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import { BsSave2Fill } from "react-icons/bs";
import { BsSave2 } from "react-icons/bs";
import { VscReport } from "react-icons/vsc";
import { FiEdit } from "react-icons/fi";
import Loading from "../../Component/Shared/Loading/Loading";

const LessonDetails = () => {
  const { user } = useAuth();
  const [role] = useRole();
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch lesson details
  const {
    data: lesson,
    isLoading,
    refetch: refetchLesson,
  } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const result = await axios.get(`${API_URL}/lessons/${id}`);
      return result.data;
    },
    enabled: !!id,
  });

  // Fetch comments for this lesson
  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const result = await axios.get(`${API_URL}/comments/${id}`);
      return result.data;
    },
    enabled: !!id,
  });

  // Calculate isLiked from lesson data
  const isLiked =
    lesson && user?.email
      ? Array.isArray(lesson.likes) && lesson.likes.includes(user.email)
      : false;

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async ({ lessonId, userEmail }) => {
      const res = await axios.patch(`${API_URL}/lessons/${lessonId}/like`, {
        userEmail,
      });
      return res.data;
    },
    onMutate: async ({ userEmail }) => {
      await queryClient.cancelQueries(["lesson", id]);
      const previousLesson = queryClient.getQueryData(["lesson", id]);

      queryClient.setQueryData(["lesson", id], (old) => {
        if (!old) return old;

        const currentlyLiked =
          Array.isArray(old.likes) && old.likes.includes(userEmail);

        return {
          ...old,
          likes: currentlyLiked
            ? old.likes.filter((email) => email !== userEmail)
            : [...(old.likes || []), userEmail],
          likesCount: currentlyLiked
            ? Math.max(0, (old.likesCount || 0) - 1)
            : (old.likesCount || 0) + 1,
        };
      });

      return { previousLesson };
    },
    onError: (err, variables, context) => {
      if (context?.previousLesson) {
        queryClient.setQueryData(["lesson", id], context.previousLesson);
      }
      toast.error("Failed to update like");
    },
    onSuccess: (updatedLesson) => {
      queryClient.setQueryData(["lesson", id], updatedLesson);
    },
  });

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like");
      return;
    }

    toggleLikeMutation.mutate({
      lessonId: id,
      userEmail: user.email,
    });
  };

  // Check if favorited
  const { data: favoriteStatus, refetch: refetchFavorite } = useQuery({
    queryKey: ["favorite-status", id, user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${API_URL}/favorites/check/${id}?email=${user.email}`
      );
      return result.data;
    },
    enabled: !!user && !!id,
  });

  const isFavorited = favoriteStatus?.isFavorited || false;

  // Add to favorites mutation
  const { mutateAsync: addToFavorites } = useMutation({
    mutationFn: async (data) => await axios.post(`${API_URL}/favorites`, data),
    onSuccess: () => {
      toast.success("Added to favorites!");
      refetchFavorite();
      refetchLesson();
    },
  });

  // Remove from favorites mutation
  const { mutateAsync: removeFromFavorites } = useMutation({
    mutationFn: async (lessonId) =>
      await axios.delete(
        `${API_URL}/favorites/${lessonId}?userEmail=${user.email}`
      ),
    onSuccess: () => {
      toast.success("Removed from favorites!");
      refetchFavorite();
      refetchLesson();
    },
  });

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    try {
      if (isFavorited) {
        await removeFromFavorites(id);
      } else {
        await addToFavorites({
          userEmail: user.email,
          lessonId: id,
          lessonTitle: lesson.title,
          lessonImage: lesson.image,
          lessonCategory: lesson.category,
          lessonTone: lesson.emotionalTone,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update favorites");
    }
  };

  // Post comment mutation
  const { mutateAsync: postComment } = useMutation({
    mutationFn: async (commentData) =>
      await axios.post(`${API_URL}/comments`, commentData),
    onSuccess: () => {
      toast.success("Comment posted successfully!");
      setComment("");
      refetchComments();
    },
    onError: () => {
      toast.error("Failed to post comment");
    },
  });

  // Delete comment mutation
  const { mutateAsync: deleteComment } = useMutation({
    mutationFn: async (commentId) =>
      await axios.delete(
        `${API_URL}/comments/${commentId}?userEmail=${user.email}`
      ),
    onSuccess: () => {
      toast.success("Comment deleted");
      refetchComments();
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await postComment({
        lessonId: id,
        userEmail: user.email,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || "https://via.placeholder.com/40",
        comment: comment.trim(),
      });
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: "Delete Responses?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const reportReasons = [
    "Inappropriate Content",
    "Hate Speech or Harassment",
    "Misleading or False Information",
    "Spam or Promotional Content",
    "Sensitive or Disturbing Content",
    "Other",
  ];

  // Report mutation
  const { mutateAsync: submitReport } = useMutation({
    mutationFn: async (reportData) =>
      await axios.post(`${API_URL}/reports`, reportData),
    onSuccess: () => {
      toast.success("Report submitted successfully!");
      setShowReportModal(false);
      setReportReason("");
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        toast.error("You have already reported this lesson");
      } else {
        toast.error("Failed to submit report");
      }
    },
  });

  const handleReport = async () => {
    if (!user) {
      toast.error("Please log in to report");
      return;
    }

    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }

    const result = await Swal.fire({
      title: "Report this lesson?",
      text: `Reason: ${reportReason}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, report it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await submitReport({
          lessonId: id,
          lessonTitle: lesson.title,
          reporterEmail: user.email,
          reporterName: user.displayName || "Anonymous",
          reason: reportReason,
        });

        Swal.fire({
          title: "Reported!",
          text: "Your report has been submitted. We'll review it soon.",
          icon: "success",
        });
      } catch (error) {
        console.error("Report error:", error);
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Lesson not found</p>
      </div>
    );
  }

  const readingTime = Math.ceil(lesson.description.split(" ").length / 200);
  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-6 sm:py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 hover:text-gray-700 text-gray-900 font-semibold transition-colors"
        >
          <IoMdArrowBack />
          Back to Lessons
        </Link>

        {/* Main Card */}
        <div className=" rounded-xl overflow-hidden mb-6">
          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 sm:px-4 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
                {lesson.category}
              </span>
              <span className="px-3 sm:px-4 py-1 bg-pink-100 text-pink-800 text-xs font-bold rounded-full">
                {lesson.emotionalTone}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
              {lesson.title}
            </h1>

            {/* Author */}
            <div className="my-4 sm:my-6 md:my-8">
              <div className="flex flex-wrap items-center gap-2">
                <img
                  src={lesson.creatorPhoto}
                  alt={lesson.creatorName}
                  className="w-8 rounded-full"
                />
                <div>
                  <h3 className="text-sm sm:text-[15px] font-medium text-gray-900">
                    {lesson.creatorName}
                  </h3>
                </div>
                <p className="text-xs sm:text-[14px] ml-2 text-gray-600">
                  {readingTime} min read
                </p>
                <p className="text-xs sm:text-[14px] ml-2 text-gray-600">
                  {new Date(lesson.createdDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Image */}
            {lesson.image && (
              <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-[10px] mb-6 sm:mb-8">
                <img
                  src={lesson.image}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="mb-6 sm:mb-8 prose max-w-none">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold float-left mr-2 leading-none text-gray-600 ">
                  {lesson.description.charAt(0)}
                </span>
                <span className="whitespace-pre-line">
                  {lesson.description.slice(1)}
                </span>
              </p>
            </div>

            {/* Stats & Actions */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white border border-gray-100 rounded-lg">
              {/* Actions */}
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={handleFavoriteToggle}
                  className={`pr-4 flex font-bold text-gray-700 items-end gap-2 cursor-pointer`}
                >
                  {isFavorited ? (
                    <BsSave2Fill
                      className="text-gray-700 hover:text-gray-900"
                      size={22}
                    />
                  ) : (
                    <BsSave2
                      className="text-gray-700 hover:text-gray-900"
                      size={22}
                    />
                  )}
                  {lesson.favoritesCount || 0}
                </button>
                <button
                  onClick={handleLike}
                  disabled={toggleLikeMutation.isPending}
                  className="pr-4 flex font-bold text-gray-700 items-end gap-2 cursor-pointer"
                >
                  {isLiked ? (
                    <AiFillLike
                      className="text-red-500 hover:text-red-600"
                      size={27}
                    />
                  ) : (
                    <AiOutlineLike
                      className="text-gray-700 hover:text-gray-900"
                      size={27}
                    />
                  )}{" "}
                  {lesson.likesCount || 0}
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="pr-4 flex font-bold text-gray-700 items-end gap-2 cursor-pointer"
                >
                  <VscReport
                    className="text-gray-700 hover:text-gray-900"
                    size={22}
                  />
                  <span className="hidden text-red-500 sm:inline">Report</span>
                </button>

                {/* Edit Button */}
                {user &&
                  (user.email === lesson.creatorEmail || role === "admin") && (
                    <Link
                      to={`/dashboard/edit-lesson/${id}`}
                      className="pr-4 flex font-bold text-blue-600 hover:text-blue-700 items-center gap-2 cursor-pointer"
                    >
                      <FiEdit size={22} />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                  )}

                <div className="flex gap-2 items-center ml-auto">
                  <span className="text-sm font-semibold text-gray-600">
                    Share:
                  </span>
                  <FacebookShareButton url={shareUrl}>
                    <FacebookIcon size={30} round />
                  </FacebookShareButton>
                  <LinkedinShareButton url={shareUrl}>
                    <LinkedinIcon size={30} round />
                  </LinkedinShareButton>
                  <TwitterShareButton url={shareUrl}>
                    <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center">
                      <BsTwitterX className="w-3 h-3" />
                    </div>
                  </TwitterShareButton>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Responses ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full p-4 text-[13px]  border border-gray-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows="3"
                />
                <button
                  onClick={handleComment}
                  className="block px-3 bg-[#ffdb58] text-black text-[12px] font-semibold py-2 cursor-pointer text-center border-2 border-black transition-all relative"
                  style={{
                    backgroundColor: "#ffdb58",
                    boxShadow: "2px 2px 0px 0px #000",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                    e.currentTarget.style.transform = "translate(-2px, -2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                    e.currentTarget.style.transform = "translate(2px, 2px)";
                  }}
                >
                  Post Responses
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c._id}
                      className="bg-white border border-gray-100 rounded-lg p-3"
                    >
                      <div className=" ">
                        <div className="flex items-end gap-4 mb-3">
                          <img
                            src={c.userPhoto}
                            alt={c.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-[13px] text-gray-900">
                                  {c.userName}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {user && user.email === c.userEmail && (
                                <button
                                  onClick={() => handleDeleteComment(c._id)}
                                  className="text-red-500 hover:text-red-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  Delete <MdDeleteForever size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          {" "}
                          <p className="text-gray-700 text-[13px] ">
                            {c.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Report Lesson
            </h3>
            <p className="text-gray-600 mb-4">
              Please select a reason for reporting:
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select a reason</option>
              {reportReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleReport}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit Report
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetails;
