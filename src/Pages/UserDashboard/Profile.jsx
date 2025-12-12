import React, { useState } from "react";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user, isPremiumUser } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedPhoto, setEditedPhoto] = useState("");

  const handleEditProfile = () => {
    if (isEditMode) {
      // Save changes logic here
      console.log("Saving:", { name: editedName, photo: editedPhoto });
      setIsEditMode(false);
    } else {
      setEditedName(user?.displayName);
      setEditedPhoto(user?.photoURL);
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedName("");
    setEditedPhoto("");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f5f6]">
        <p className="text-2xl font-bold">Please login to view profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f5f6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div
          className="bg-white rounded-lg border-4 border-black p-8"
          style={{ boxShadow: "8px 8px 0px 0px #000" }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Photo */}
            <div className="relative">
              {isEditMode ? (
                <div>
                  <img
                    src={editedPhoto || user?.photoURL}
                    alt={user?.displayName}
                    className="w-40 h-40 rounded-full border-4 border-[#ffdb58] object-cover"
                  />
                  <input
                    type="text"
                    value={editedPhoto}
                    onChange={(e) => setEditedPhoto(e.target.value)}
                    placeholder="Photo URL"
                    className="mt-3 w-full px-3 py-2 border-2 border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ffdb58]"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={user?.photoURL}
                    alt={user?.displayName}
                    className="w-40 h-40 rounded-full border-4 border-[#ffdb58] object-cover"
                  />
                  {isPremiumUser && (
                    <span className="absolute -top-2 -right-2 bg-[#ffdb58] text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-black">
                      ⭐ Premium
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditMode ? (
                <div className="mb-4">
                  <label className="block text-sm font-bold text-black mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full max-w-md px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffdb58]"
                  />
                </div>
              ) : (
                <h1 className="text-4xl font-black mb-2 font2">
                  {user?.displayName}
                </h1>
              )}

              <p className="text-gray-600 text-lg mb-1">{user?.email}</p>

              {isPremiumUser ? (
                <span className="inline-block px-3 py-1 bg-[#ffdb58] text-black text-sm font-bold rounded-full border-2 border-black mb-4">
                  Premium Member ⭐
                </span>
              ) : (
                <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm font-bold rounded-full border-2 border-black mb-4">
                  Free Member
                </span>
              )}

              {/* Edit Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg border-2 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                      style={{ boxShadow: "4px 4px 0px 0px #000" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "2px 2px 0px 0px #000";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "4px 4px 0px 0px #000";
                      }}
                    >
                      ✓ Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg border-2 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                      style={{ boxShadow: "4px 4px 0px 0px #000" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "2px 2px 0px 0px #000";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "4px 4px 0px 0px #000";
                      }}
                    >
                      ✕ Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="px-6 py-3 bg-[#ffdb58] text-black font-bold rounded-lg border-2 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                    style={{ boxShadow: "4px 4px 0px 0px #000" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                    }}
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t-3 border-black">
            <h3 className="text-xl font-black mb-4 font2">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard/add-lesson"
                className="px-6 py-3 bg-[#ffdb58] text-black font-bold rounded-lg border-2 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                }}
              >
                ➕ Add New Lesson
              </Link>
              <Link
                to="/dashboard/my-lesson"
                className="px-6 py-3 bg-white text-black font-bold rounded-lg border-2 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                }}
              >
                📖 My Lessons
              </Link>
              <Link
                to="/dashboard/my-favorite"
                className="px-6 py-3 bg-white text-black font-bold rounded-lg border-2 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                }}
              >
                🔖 My Favorites
              </Link>
              {!isPremiumUser && (
                <Link
                  to="/pricing"
                  className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg border-2 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                  style={{ boxShadow: "4px 4px 0px 0px #000" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                  }}
                >
                  ⭐ Upgrade to Premium
                </Link>
              )}
            </div>
          </div>

          {/* Note about email */}
          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-bold">📌 Note:</span> Email cannot be
              changed for security reasons. Only display name and photo can be
              updated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
