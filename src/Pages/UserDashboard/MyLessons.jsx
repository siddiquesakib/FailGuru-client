import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { imageUpload } from "../../Utils";
import { toast } from "react-toastify";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";

const MyLessons = () => {
  const { user, isPremiumUser } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const categories = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned",
  ];
  const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

  //fetch lessons
  const {
    data: lessons = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-lessons", user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-lessons?email=${user.email}`
      );
      return result.data;
    },
    enabled: !!user?.email,
  });

  //delete lesson
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/my-lessons/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete");
            }
            return res.json();
          })
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your lesson has been deleted.",
              icon: "success",
            });
            refetch();
          })
          .catch((err) => {
            console.error("Delete error:", err);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete lesson. Please try again.",
              icon: "error",
            });
          });
      }
    });
  };

  // Update mutation
  const { mutateAsync: updateLesson } = useMutation({
    mutationFn: async ({ id, payload }) =>
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/my-lessons/${id}`,
        payload
      ),
    onSuccess: () => {
      toast.success("Lesson updated successfully!");
      setShowUpdateModal(false);
      // Refetch lessons after update
      refetch();
    },
  });

  const openUpdateModal = (lesson) => {
    setSelectedLesson(lesson);
    // Set form values
    setValue("title", lesson.title);
    setValue("description", lesson.description);
    setValue("category", lesson.category);
    setValue("emotionalTone", lesson.emotionalTone);
    setValue("privacy", lesson.privacy);
    setValue("accessLevel", lesson.accessLevel);
    setValue("currentImage", lesson.image);
    setShowUpdateModal(true);
  };

  const onUpdate = async (data) => {
    const {
      title,
      description,
      emotionalTone,
      privacy,
      accessLevel,
      category,
      image,
      currentImage,
    } = data;

    try {
      let imgUrl = currentImage;

      // If new image is uploaded
      if (image && image[0]) {
        const imgFile = image[0];
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

      await updateLesson({
        id: selectedLesson._id,
        payload: updatedLessonData,
      });
      reset();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update lesson");
    }
  };



  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-4 sm:py-6 md:py-8 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Heading className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 font2">
            My Lessons
          </Heading>
          <Paragraph className="text-sm sm:text-base text-gray-600">
            Manage all your created lessons
          </Paragraph>
        </div>

        {/* Table */}
        <div
          className="bg-white border-2 border-black overflow-hidden rounded-lg"
          style={{ boxShadow: "4px 4px 0px 0px #000" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                    Title
                  </th>
                  <th className="hidden sm:table-cell px-3 md:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-black">
                    Category
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs sm:text-sm font-black">
                    Stats
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs sm:text-sm font-black">
                    Created
                  </th>
                  <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-black">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="border-b-2 border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                      <p className="font-bold text-xs sm:text-sm md:text-base text-gray-900 line-clamp-2">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {lesson.emotionalTone}
                      </p>
                      {/* Show category on mobile */}
                      <span className="sm:hidden inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-3 md:px-4 py-3 md:py-4">
                      <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-4">
                      <p className="text-xs text-gray-600">
                        ❤️ {lesson.likesCount}
                      </p>
                      <p className="text-xs text-gray-600">
                        🔖 {lesson.favoritesCount}
                      </p>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-4 text-xs sm:text-sm text-gray-600">
                      {new Date(lesson.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4">
                      <div className="flex gap-1 sm:gap-2 justify-center">
                        <Link
                          to={`/publiclessons/${lesson._id}`}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600"
                          title="View Details"
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => openUpdateModal(lesson)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-500 text-white text-xs font-bold rounded hover:bg-purple-600"
                          title="Update"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-8 sm:py-12 px-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-400 mb-2 sm:mb-4">
                No lessons yet
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Create your first lesson to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div
            className="bg-white rounded-lg border-2 border-black p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <h2 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6">
              Update Lesson
            </h2>

            <form onSubmit={handleSubmit(onUpdate)}>
              {/* Title */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Title must be less than 100 characters",
                    },
                  })}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Description must be less than 1000 characters",
                    },
                  })}
                  rows="5"
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Category & Emotional Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                    Category *
                  </label>
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                    Emotional Tone *
                  </label>
                  <select
                    {...register("emotionalTone", {
                      required: "Emotional tone is required",
                    })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {emotionalTones.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                  {errors.emotionalTone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.emotionalTone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                  Upload New Image (Optional)
                </label>
                <input
                  type="file"
                  {...register("image")}
                  accept="image/*"
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-purple-50 file:text-purple-700"
                />
                <input type="hidden" {...register("currentImage")} />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
              </div>

              {/* Privacy & Access Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                    Privacy *
                  </label>
                  <select
                    {...register("privacy", {
                      required: "Privacy is required",
                    })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                  {errors.privacy && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.privacy.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">
                    Access Level *
                  </label>
                  <select
                    {...register("accessLevel", {
                      required: "Access level is required",
                    })}
                    disabled={!isPremiumUser}
                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      !isPremiumUser ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="Free">Free</option>
                    <option value="Premium" disabled={!isPremiumUser}>
                      Premium
                    </option>
                  </select>
                  {errors.accessLevel && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.accessLevel.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 bg-green-500 text-white text-sm sm:text-base font-bold rounded-lg hover:bg-green-600 transition-colors"
                >
                  Update Lesson
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    reset();
                  }}
                  className="w-full py-2.5 sm:py-3 bg-gray-300 text-gray-700 text-sm sm:text-base font-bold rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLessons;
