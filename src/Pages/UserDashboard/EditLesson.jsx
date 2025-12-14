import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { imageUpload } from "../../Utils";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";

const EditLesson = () => {
  const { user } = useAuth();
  const [role] = useRole();
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // Fetch lesson details
  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/${id}`
      );
      return result.data;
    },
    enabled: !!id,
  });

  // Fetch user data
  const { data: userData = null } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`
      );
      return result.data;
    },
    enabled: !!user?.email,
  });

  const isPremium =
    userData?.email === user?.email && userData?.isPremium === true;

  // Check if user can edit (creator or admin)
  useEffect(() => {
    if (lesson && user) {
      if (lesson.creatorEmail !== user.email && role !== "admin") {
        toast.error("You don't have permission to edit this lesson");
        navigate("/dashboard/my-lesson");
      }
    }
  }, [lesson, user, role, navigate]);

  // Populate form with lesson data
  useEffect(() => {
    if (lesson) {
      setValue("title", lesson.title);
      setValue("description", lesson.description);
      setValue("category", lesson.category);
      setValue("emotionalTone", lesson.emotionalTone);
      setValue("privacy", lesson.privacy);
      setValue("accessLevel", lesson.accessLevel);
      setImagePreview(lesson.image);
    }
  }, [lesson, setValue]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload) =>
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/lessons/${id}`,
        payload
      ),
    onSuccess: () => {
      toast.success("Lesson updated successfully! ✨");
      navigate(`/lessons/${id}`);
    },
    onError: () => {
      toast.error("Failed to update lesson");
    },
  });

  const onSubmit = async (data) => {
    const {
      title,
      description,
      emotionalTone,
      privacy,
      accessLevel,
      category,
      image,
    } = data;
    const imgFile = image?.[0];

    try {
      let imgUrl = lesson.image; // Keep existing image by default

      // Upload new image if provided
      if (imgFile) {
        imgUrl = await imageUpload(imgFile);
      }

      const updatedLessonData = {
        title,
        description,
        category,
        emotionalTone,
        image: imgUrl,
        privacy,
        accessLevel,
        updatedDate: new Date().toISOString(),
      };

      await mutateAsync(updatedLessonData);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update lesson");
    }
  };

  const categories = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];
  const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[url(/bgimg.png)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-4 sm:py-6 md:py-8 ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Heading>Edit Lesson</Heading>
          <Paragraph>Update your lesson content and settings</Paragraph>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border-2 border-black p-4 sm:p-6 md:p-8 "
          style={{ boxShadow: "4px 4px 0px 0px #000" }}
        >
          {/* Lesson Title */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
              Lesson Title
            </label>
            <input
              type="text"
              placeholder="Enter your lesson title"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("title", {
                required: "Title is required",
              })}
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
              Full Description / Story / Insight
            </label>
            <textarea
              placeholder="Share your story, insight, or life lesson in detail..."
              rows="6"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category and Emotional Tone - Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
            {/* Category */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
                Category
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("category", {
                  required: "Category is required",
                })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Emotional Tone */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
                Emotional Tone
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("emotionalTone", {
                  required: "Emotional tone is required",
                })}
              >
                <option value="">Select Tone</option>
                {emotionalTones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
              {errors.emotionalTone && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.emotionalTone.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
              Image (Optional - Leave empty to keep current image)
            </label>
            {imagePreview && (
              <div className="mb-3">
                <img
                  src={imagePreview}
                  alt="Current"
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-300"
                />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              {...register("image")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          {/* Privacy and Access Level - Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {/* Privacy */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
                Privacy
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("privacy", {
                  required: "Privacy is required",
                })}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              {errors.privacy && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.privacy.message}
                </p>
              )}
            </div>

            {/* Access Level */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
                Access Level
              </label>
              <div className="relative">
                <select
                  {...register("accessLevel", {
                    required: "Access level is required",
                  })}
                  disabled={!isPremium && lesson?.accessLevel === "free"}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    !isPremium && lesson?.accessLevel === "free"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="free">Free</option>
                  <option value="premium" disabled={!isPremium}>
                    Premium
                  </option>
                </select>
                {!isPremium && (
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ Upgrade to Premium to change access level
                  </p>
                )}
                {errors.accessLevel && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.accessLevel.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 cursor-pointer bg-[#ffdb58] text-black font-bold py-3 sm:py-3.5 text-sm sm:text-base text-center border-2 border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: "4px 4px 0px 0px #000",
              }}
              onMouseEnter={(e) => {
                if (!isPending) {
                  e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                  e.currentTarget.style.transform = "translate(2px, 2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                e.currentTarget.style.transform = "translate(0, 0)";
              }}
            >
              {isPending ? "Updating..." : "Update Lesson"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none cursor-pointer bg-gray-300 text-black font-bold py-3 sm:py-3.5 px-6 text-sm sm:text-base text-center border-2 border-black transition-all"
              style={{
                boxShadow: "4px 4px 0px 0px #000",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                e.currentTarget.style.transform = "translate(2px, 2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                e.currentTarget.style.transform = "translate(0, 0)";
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLesson;
