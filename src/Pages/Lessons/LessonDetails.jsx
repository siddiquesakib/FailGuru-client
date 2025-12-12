import React, { useState } from "react";
import { Link, useParams } from "react-router";
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

const LessonDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

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
      title: "Delete comment?",
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading lesson...
          </p>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-[#f9f5f6] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/publiclessons"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Public Lessons
        </Link>

        {/* Main Content Card */}
        <div
          className="bg-white rounded-lg border-4 border-black overflow-hidden mb-6"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          {/* Featured Image */}
          {lesson.image && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={lesson.image}
                alt={lesson.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-black mb-4">{lesson.title}</h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-bold rounded-full border-2 border-purple-300">
                {lesson.category}
              </span>
              <span className="px-4 py-2 bg-pink-100 text-pink-700 text-sm font-bold rounded-full border-2 border-pink-300">
                {lesson.emotionalTone}
              </span>
              <span
                className={`px-4 py-2 text-sm font-bold rounded-full border-2 ${
                  lesson.accessLevel === "Premium"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                    : "bg-green-100 text-green-700 border-green-300"
                }`}
              >
                {lesson.accessLevel}
              </span>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border-2 border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-semibold">Created</p>
                  <p className="font-bold">
                    {new Date(lesson.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold">Updated</p>
                  <p className="font-bold">
                    {new Date(lesson.updatedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold">Visibility</p>
                  <p className="font-bold">{lesson.visibility}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold">Reading Time</p>
                  <p className="font-bold">{readingTime} min read</p>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="prose max-w-none mb-8">
              <p className="text-lg leading-relaxed whitespace-pre-line text-gray-800">
                {lesson.description}
              </p>
            </div>

            {/* Author Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border-2 border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={lesson.creatorPhoto}
                  alt={lesson.creatorName}
                  className="w-16 h-16 rounded-full border-2 border-purple-400"
                />
                <div>
                  <h3 className="text-xl font-bold">{lesson.creatorName}</h3>
                  <p className="text-gray-600">Lesson creator</p>
                </div>
              </div>
              <Link
                to={`/profile/${lesson.creatorEmail}`}
                className="inline-block px-5 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
              >
                View all lessons by this author
              </Link>
            </div>

            {/* Stats & Engagement */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex gap-6 text-lg">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">❤️</span>
                    <span className="font-bold">{lesson.likesCount || 0}</span>
                    <span className="text-gray-600">Likes</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🔖</span>
                    <span className="font-bold">
                      {lesson.favoritesCount || 0}
                    </span>
                    <span className="text-gray-600">Favorites</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleFavoriteToggle}
                  className={`px-5 py-3 font-bold rounded-lg border-2 border-black transition-all cursor-pointer ${
                    isFavorited
                      ? "bg-purple-400 text-white"
                      : "bg-white text-black hover:bg-gray-50"
                  }`}
                  style={{ boxShadow: "3px 3px 0px 0px #000" }}
                >
                  {isFavorited ? "🔖 Saved" : "🔖 Save to Favorites"}
                </button>

                <button
                  onClick={handleLike}
                  disabled={toggleLikeMutation.isPending}
                  className={`px-5 py-3 font-bold rounded-lg border-2 border-black transition-all cursor-pointer ${
                    isLiked
                      ? "bg-pink-400 text-white"
                      : "bg-white text-black hover:bg-gray-50"
                  } ${
                    toggleLikeMutation.isPending
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                  style={{ boxShadow: "3px 3px 0px 0px #000" }}
                >
                  {toggleLikeMutation.isPending
                    ? "⏳ Updating..."
                    : isLiked
                    ? "❤️ Liked"
                    : "❤️ Like"}
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-5 py-3 bg-white text-black font-bold rounded-lg border-2 border-black hover:bg-gray-50 transition-all"
                  style={{ boxShadow: "3px 3px 0px 0px #000" }}
                >
                  🚩 Report
                </button>

                <div className="flex gap-2 items-center">
                  <span className="text-sm font-bold text-gray-600">
                    Share:
                  </span>
                  <FacebookShareButton url={shareUrl}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <LinkedinShareButton url={shareUrl}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <TwitterShareButton url={shareUrl}>
                    <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center">
                      <BsTwitterX className="w-4 h-4" />
                    </div>
                  </TwitterShareButton>
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <div className="border-t-4 border-black pt-6">
              <h3 className="text-2xl font-black mb-4">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                  rows="3"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c._id}
                      className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={c.userPhoto}
                          alt={c.userName}
                          className="w-10 h-10 rounded-full border-2 border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900">
                                {c.userName}
                              </p>
                              <span className="text-xs text-gray-500">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {user && user.email === c.userEmail && (
                              <button
                                onClick={() => handleDeleteComment(c._id)}
                                className="text-red-500 hover:text-red-700 text-sm bg-gray-300 py-1 px-1.5 rounded-3xl font-semibold cursor-pointer flex items-center gap-1"
                              >
                                Delete <MdDeleteForever />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-700">{c.comment}</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg border-4 border-black p-6 max-w-md w-full"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <h3 className="text-2xl font-black mb-4">Report Lesson</h3>
            <p className="text-gray-600 mb-4">
              Please select a reason for reporting this lesson:
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              >
                Submit Report
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400 transition-colors"
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
