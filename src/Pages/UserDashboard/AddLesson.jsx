import React from "react";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { imageUpload } from "../../Utils";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";

const AddLesson = () => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { mutateAsync } = useMutation({
    mutationFn: async (payload) =>
      await axios.post(`${import.meta.env.VITE_API_URL}/lessons`, payload),
    onSuccess: () => {
      toast.success("lessons Created");
    },
  });

  const onSubmit = async (data) => {
    const {
      title,
      description,
      emotionalTone,
      privacy,
      accessLevel,
      visibility,
      category,
      image,
    } = data;
    const imgFile = image?.[0];

    try {
      let imgUrl = null;
      if (imgFile) {
        imgUrl = await imageUpload(imgFile);
      }

      const LessonData = {
        title,
        description,
        category,
        emotionalTone,
        image:
          imgUrl ||
          "https://i.pinimg.com/736x/4b/12/b4/4b12b4454feccf75c0cee96d5425ec2a.jpg",
        privacy,
        accessLevel,
        creatorName: user.displayName,
        creatorEmail: user.email,
        creatorPhoto: user.photoURL,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        visibility,
        isFeatured: false,
        likesCount: 0,
        favoritesCount: 0,
        likes: [],
      };
      await mutateAsync(LessonData);
      reset();
    } catch (err) {
      console.log(err);
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

  // Fetch user data from MongoDB
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

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-4 sm:py-6 md:py-8 ">
      <title>FailGuru | Add Lessons</title>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Heading>Add New Lesson</Heading>
          <Paragraph>
            Share your wisdom and life experiences with the community
          </Paragraph>
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
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
              Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
              {...register("image")}
            />
            {errors.image && (
              <p className="text-red-600 text-xs mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Privacy and Access Level - Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {/* Privacy */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">
                Privacy
              </label>
              <select
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                  disabled={!isPremium}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    !isPremium ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="free">Free</option>
                  <option value="premium" disabled={!isPremium}>
                    Premium
                  </option>
                </select>
                {!isPremium && (
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ Upgrade to{" "}
                    <Link
                      to="/pricing"
                      className="text-blue-600 underline font-semibold"
                    >
                      Premium
                    </Link>{" "}
                    to create paid lessons
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-[#ffdb58] text-black font-bold py-3 sm:py-3.5 text-sm sm:text-base text-center border-2 border-black transition-all"
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
            Create Lesson
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;
