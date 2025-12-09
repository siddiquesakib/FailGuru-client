import React from "react";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { imageUpload } from "../../Utils";

const AddLesson = () => {
  const { user } = useAuth();
  console.log(user);

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
      toast.success("lessons added ");
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
    const imgFile = image[0];

    try {
      const imgUrl = await imageUpload(imgFile);
      const LessonData = {
        title,
        description,
        category,
        emotionalTone,
        image: imgUrl,
        privacy,
        accessLevel,
        creatorName: user.displayName,
        creatorEmail: user.email,
        creatorPhoto: user.photoURL,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        visibility,
        likesCount: 0,
        favoritesCount: 0,
        likes: [],
      };
      await mutateAsync(LessonData);
      reset();
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
    console.log(data);
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
    enabled: !!user?.email, // Only run when user email exists
  });

  const isPremium =
    userData?.email === user?.email && userData?.isPremium === true;

  return (
    <div className="min-h-screen bg-[#f9f5f6] py-8 my-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 font2">Add New Lesson</h1>
          <p className="text-gray-600">
            Share your wisdom and life experiences with the community
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white  border-4 border-black p-8"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          {/* Lesson Title */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Lesson Title
            </label>
            <input
              type="text"
              placeholder="Enter your lesson title"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("title", {
                required: "name lagbe",
                maxLength: {
                  message: "must be 20 word",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-600 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Full Description */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Full Description / Story / Insight *
            </label>
            <textarea
              type="text"
              placeholder="Share your story, insight, or life lesson in detail..."
              rows="10"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("description", {
                required: "description need",
                maxLength: {
                  message: "description need",
                },
              })}
            />
            {errors.description && (
              <p className="text-red-600 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category and Emotional Tone - Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("category", {
                  required: "category need",
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
                <p className="text-red-600 text-xs">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Emotional Tone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Emotional Tone *
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("emotionalTone", {
                  required: "emotionalTone need",
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
                <p className="text-red-600 text-xs">
                  {errors.emotionalTone.message}
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("image", {
                required: "image lagbe",
              })}
            />
            {errors.image && (
              <p className="text-red-600 text-xs">{errors.image.message}</p>
            )}
          </div>

          {/* Privacy and Access Level - Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Privacy */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Privacy *
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                {...register("privacy", {
                  required: "privacy need",
                })}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              {errors.privacy && (
                <p className="text-red-600 text-xs">{errors.privacy.message}</p>
              )}
            </div>

            {/* Access Level */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Access Level *
              </label>
              <div className="relative">
                <select
                  name="accessLevel"
                  disabled={!isPremium}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    !isPremium ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  required
                >
                  <option value="Free">Free</option>
                  <option value="Premium" disabled={!isPremium}>
                    Premium
                  </option>
                </select>
                {!isPremium && (
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ Upgrade to{" "}
                    <Link to={"/pricing"} className="text-blue-600 underline">
                      Premium
                    </Link>{" "}
                    to create paid lessons
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="block w-full cursor-pointer bg-[#ffdb58] text-black font-semibold py-4 text-base text-center border-3 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
            style={{
              border: "3px solid #000",
              boxShadow: "4px 4px 0px 0px #000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
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
