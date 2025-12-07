import React, { useState } from "react";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center">
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
                    className="w-32 h-32 rounded-full border-4 border-purple-400 object-cover"
                  />
                  <input
                    type="text"
                    value={editedPhoto}
                    onChange={(e) => setEditedPhoto(e.target.value)}
                    placeholder="Photo URL"
                    className="mt-2 w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                  />
                </div>
              ) : (
                <img
                  src={user?.photoURL}
                  alt={user?.displayName}
                  className="w-32 h-32 rounded-full border-4 border-purple-400 object-cover"
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditMode ? (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ) : (
                <h1 className="text-4xl font-black mb-2">
                  {user?.displayName}
                </h1>
              )}

              <p className="text-gray-600 mb-4">{user?.email}</p>

              {/* Edit Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg border-2 border-black hover:bg-green-600 transition-colors"
                      style={{ boxShadow: "3px 3px 0px 0px #000" }}
                    >
                      ✓ Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-3 bg-gray-300 text-gray-700 font-bold rounded-lg border-2 border-black hover:bg-gray-400 transition-colors"
                      style={{ boxShadow: "3px 3px 0px 0px #000" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg border-2 border-black hover:bg-purple-700 transition-colors"
                    style={{ boxShadow: "3px 3px 0px 0px #000" }}
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Note about email */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Note:</span> Email cannot be
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
