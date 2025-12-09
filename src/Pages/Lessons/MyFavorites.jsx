import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";

const MyFavorites = () => {
  const { user } = useAuth();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["my-favorites", user?.email],
    queryFn: async () => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/favorites?email=${user.email}`
      );
      return result.data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div>Loading favorites...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-8">My Favorites ❤️</h1>

        {favorites?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-gray-400">No favorites yet</p>
            <Link
              to="/publiclessons"
              className="mt-4 inline-block px-6 py-3 bg-purple-500 text-white rounded-lg"
            >
              Explore Lessons
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites?.map((fav) => (
              <Link
                key={fav._id}
                to={`/publiclessons/${fav.lessonId}`}
                className="bg-white rounded-lg border-2 border-black p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={fav.lessonImage}
                  alt={fav.lessonTitle}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{fav.lessonTitle}</h3>
                <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  {fav.lessonCategory}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
