import React, { useState } from "react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const LessonDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Fetch lesson details
  const { data: lesson, isLoading, refetch: refetchLesson } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/${id}`
      );
      return result.data;
    },
    enabled: !!id,
  });

  // Check if favorited
  const { data: favoriteStatus, refetch: refetchFavorite } = useQuery({
    queryKey: ["favorite-status", id, user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/favorites/check/${id}?email=${user.email}`
      );
      return result.data;
    },
    enabled: !!user && !!id,
  });

  const isFavorited = favoriteStatus?.isFavorited || false;

  // Add to favorites mutation
  const { mutateAsync: addToFavorites } = useMutation({
    mutationFn: async (data) =>
      await axios.post(`${import.meta.env.VITE_API_URL}/favorites`, data),
    onSuccess: () => {
      toast.success("Added to favorites!");
      refetchFavorite();
      refetchLesson(); // Refetch to update count
    },
  });

  // Remove from favorites mutation
  const { mutateAsync: removeFromFavorites } = useMutation({
    mutationFn: async (lessonId) =>
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/favorites/${lessonId}?userEmail=${user.email}`
      ),
    onSuccess: () => {
      toast.success("Removed from favorites!");
      refetchFavorite();
      refetchLesson(); // Refetch to update count
    },
  });

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

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
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update favorites");
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

  // Dummy similar lessons and comments
  const similarLessons = [
    {
      id: 2,
      title: "The Power of Saying No",
      category: "Mindset",
      emotionalTone: "Realization",
      image:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300",
      creatorName: "Michael Chen",
    },
    {
      id: 3,
      title: "Career Pivot at 35",
      category: "Career",
      emotionalTone: "Motivational",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300",
      creatorName: "Emily Rodriguez",
    },
    {
      id: 4,
      title: "Healing Through Gratitude",
      category: "Personal Growth",
      emotionalTone: "Gratitude",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300",
      creatorName: "James Williams",
    },
  ];

  const comments = [
    {
      id: 1,
      userName: "John Doe",
      userPhoto: "https://i.pravatar.cc/150?img=7",
      comment: "This is so inspiring! Thank you for sharing your story.",
      date: "2025-01-16",
    },
    {
      id: 2,
      userName: "Jane Smith",
      userPhoto: "https://i.pravatar.cc/150?img=8",
      comment: "I needed to read this today. Very motivational!",
      date: "2025-01-17",
    },
  ];

  const reportReasons = [
    "Inappropriate Content",
    "Hate Speech or Harassment",
    "Misleading or False Information",
    "Spam or Promotional Content",
    "Sensitive or Disturbing Content",
    "Other",
  ];

  const handleLike = () => {
    if (!user) {
      toast.error("Please log in to like");
      return;
    }
    setIsLiked(!isLiked);
  };

  const handleReport = () => {
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }
    console.log("Report submitted:", reportReason);
    setShowReportModal(false);
    setReportReason("");
    toast.success("Report submitted successfully");
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }
    console.log("Comment:", comment);
    setComment("");
  };

  const readingTime = Math.ceil(lesson.description.split(" ").length / 200);

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
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border-2 border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={lesson.creatorPhoto}
                  alt={lesson.creatorName}
                  className="w-16 h-16 rounded-full border-3 border-purple-400"
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
                  className={`px-5 py-3 font-bold rounded-lg border-2 border-black transition-all ${
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
                  className={`px-5 py-3 font-bold rounded-lg border-2 border-black transition-all ${
                    isLiked
                      ? "bg-pink-400 text-white"
                      : "bg-white text-black hover:bg-gray-50"
                  }`}
                  style={{ boxShadow: "3px 3px 0px 0px #000" }}
                >
                  {isLiked ? "❤️ Liked" : "❤️ Like"}
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-5 py-3 bg-white text-black font-bold rounded-lg border-2 border-black hover:bg-gray-50 transition-all"
                  style={{ boxShadow: "3px 3px 0px 0px #000" }}
                >
                  🚩 Report
                </button>

                <button
                  className="px-5 py-3 bg-blue-500 text-white font-bold rounded-lg border-2 border-black hover:bg-blue-600 transition-all"
                  style={{ boxShadow: "3px 3px 0px 0px #000" }}
                >
                  📤 Share
                </button>
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
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={c.userPhoto}
                        alt={c.userName}
                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900">
                            {c.userName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(c.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{c.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Lessons */}
        <div className="mb-8">
          <h2 className="text-3xl font-black mb-6">Similar Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarLessons.map((similar) => (
              <Link
                key={similar.id}
                to={`/publiclessons/${similar.id}`}
                className="bg-white rounded-lg border-3 border-black overflow-hidden transition-all hover:-translate-y-1"
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
              >
                <img
                  src={similar.image}
                  alt={similar.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{similar.title}</h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                      {similar.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
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