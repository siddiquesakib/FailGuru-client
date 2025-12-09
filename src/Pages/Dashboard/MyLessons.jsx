import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { imageUpload } from "../../Utils";
import { toast } from "react-toastify";

const MyLessons = () => {
  const { user } = useAuth();
  console.log("User:", user);
  const [myLessons, setMyLessons] = useState([]);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // Check if user is premium
  const isPremium = false;

  // Dummy lessons data - replace with API call filtered by user email
  const [lessons, setLessons] = useState([
    {
      _id: "1",
      title: "Embracing Failure as Growth",
      category: "Personal Growth",
      emotionalTone: "Motivational",
      privacy: "Public",
      accessLevel: "Free",
      createdDate: "2025-01-15T10:30:00Z",
      likesCount: 1234,
      favoritesCount: 342,
      description: "Learning to see failures not as setbacks...",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400",
    },
    {
      _id: "2",
      title: "The Power of Saying No",
      category: "Mindset",
      emotionalTone: "Realization",
      privacy: "Private",
      accessLevel: "Premium",
      createdDate: "2025-01-10T14:20:00Z",
      likesCount: 2456,
      favoritesCount: 678,
      description: "Understanding that saying no to others...",
      image:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
    },
  ]);

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
    data: mylessons,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-lessons", user?.id],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-lessons?email=${user.email}`
      );

      setLessons(result.data);
      return result.data;
    },
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
          .then((data) => {
            // Remove deleted lesson from state
            setMyLessons(myLessons.filter((lesson) => lesson._id !== id));

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

  const toggleAccessLevel = (lessonId, currentLevel) => {
    if (!isPremium) {
      alert("Upgrade to Premium to change access level");
      return;
    }
    const newLevel = currentLevel === "Free" ? "Premium" : "Free";
    setLessons(
      lessons.map((l) =>
        l._id === lessonId ? { ...l, accessLevel: newLevel } : l
      )
    );
    console.log("Access level toggled:", lessonId, newLevel);
    // Add axios patch request here
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

  return (
    <div className="min-h-screen bg-[#f9f5f6] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 font2">My Lessons</h1>
          <p className="text-gray-600">Manage all your created lessons</p>
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-lg border-4 border-black overflow-hidden"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-black">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black">
                    Category
                  </th>
                 
                  <th className="px-4 py-3 text-left text-sm font-black">
                    Access
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black">
                    Stats
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-black">
                    Created
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-black">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mylessons.map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="border-b-2 border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <p className="font-bold text-gray-900">{lesson.title}</p>
                      <p className="text-xs text-gray-500">
                        {lesson.emotionalTone}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                        {lesson.category}
                      </span>
                    </td>
                 
                    <td className="px-4 py-4">
                      <button
                        onClick={() =>
                          toggleAccessLevel(lesson._id, lesson.accessLevel)
                        }
                        disabled={!isPremium}
                        className={`px-3 py-1 text-xs font-bold rounded-full border-2 ${
                          lesson.accessLevel === "Premium"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                            : "bg-blue-100 text-blue-700 border-blue-300"
                        } ${!isPremium ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {lesson.accessLevel}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs text-gray-600">
                        ❤️ {lesson.likesCount}
                      </p>
                      <p className="text-xs text-gray-600">
                        🔖 {lesson.favoritesCount}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(lesson.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2 justify-center">
                        <Link
                          to={`/publiclessons/${lesson._id}`}
                          className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600"
                          title="View Details"
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => openUpdateModal(lesson)}
                          className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded hover:bg-purple-600"
                          title="Update"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600"
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
            <div className="text-center py-12">
              <p className="text-2xl font-bold text-gray-400 mb-4">
                No lessons yet
              </p>
              <p className="text-gray-600">
                Create your first lesson to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-lg border-4 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: "8px 8px 0px 0px #000" }}
          >
            <h2 className="text-3xl font-black mb-6">Update Lesson</h2>

            <form onSubmit={handleSubmit(onUpdate)}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
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
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
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
                  rows="6"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Category & Emotional Tone */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Category *
                  </label>
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
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
                  <label className="block text-sm font-bold mb-2">
                    Emotional Tone *
                  </label>
                  <select
                    {...register("emotionalTone", {
                      required: "Emotional tone is required",
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
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
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Upload New Image (Optional)
                </label>
                <input
                  type="file"
                  {...register("image")}
                  accept="image/*"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                />
                <input type="hidden" {...register("currentImage")} />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
              </div>

              {/* Privacy & Access Level */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Privacy *
                  </label>
                  <select
                    {...register("privacy", {
                      required: "Privacy is required",
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
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
                  <label className="block text-sm font-bold mb-2">
                    Access Level *
                  </label>
                  <select
                    {...register("accessLevel", {
                      required: "Access level is required",
                    })}
                    disabled={!isPremium}
                    className={`w-full px-4 py-2 border-2 border-gray-300 rounded-lg ${
                      !isPremium ? "bg-gray-100" : ""
                    }`}
                  >
                    <option value="Free">Free</option>
                    <option value="Premium" disabled={!isPremium}>
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
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                >
                  Update Lesson
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    reset();
                  }}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400"
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
