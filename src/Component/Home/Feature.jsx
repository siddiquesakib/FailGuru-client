import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router";
import Container from "../Shared/Container";
import Paragraph from "../Shared/Paragraph";
import Heading from "../Shared/Heading";
import Button from "../Shared/Button";

const Feature = () => {
  const { isPremiumUser } = useAuth();

  //fetch all lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const params = new URLSearchParams();

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons?${params.toString()}`
      );
      return result.data;
    },
  });

  const featuredLessons = lessons.filter(
    (lesson) => lesson.isFeatured === true
  );
  console.log(featuredLessons);

  return (
    <div className="py-12 px-4 bg-[#f9f5f6] bg-[url(/bgimg.png)]">
      <Container className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex mx-auto">
            <Button className="mb-6">Featured</Button>
          </div>
          <Heading>Featured Lessons</Heading>
          <Paragraph>
            Top ({featuredLessons.length}) Lessons Curated from Our Community
          </Paragraph>
        </div>

        {featuredLessons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No featured lessons yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLessons.map((lesson) => (
              <div
                key={lesson._id}
                className={`bg-white border-2 border-black   p-6 transition-all duration-300 flex flex-col h-full ${
                  lesson.accessLevel?.toLowerCase() === "premium" &&
                  !isPremiumUser
                    ? "opacity-75"
                    : ""
                }`}
                style={{ boxShadow: "4px 4px 0px 0px #000" }}
              >
                {/* Access Level Badge at Top */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      lesson.accessLevel?.toLowerCase() === "premium"
                        ? "bg-yellow-400 text-black"
                        : "bg-green-400 text-black"
                    }`}
                  >
                    {lesson.accessLevel?.toLowerCase() === "premium"
                      ? "Premium"
                      : "Free"}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>❤️ {lesson.likesCount || 0}</span>
                    <span>🔖 {lesson.favoritesCount || 0}</span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-bold mb-3 grow ${
                    lesson.accessLevel?.toLowerCase() === "premium" &&
                    !isPremiumUser
                      ? "blur-sm"
                      : ""
                  }`}
                >
                  {lesson.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-gray-600 text-sm mb-4 line-clamp-3 grow ${
                    lesson.accessLevel?.toLowerCase() === "premium" &&
                    !isPremiumUser
                      ? "blur-sm"
                      : ""
                  }`}
                >
                  {lesson.description}
                </p>

                {/* Category */}
                <div className="mb-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Category:{" "}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {lesson.category}
                  </span>
                </div>

                {/* Emotional Tone */}
                <div className="mb-6">
                  <span className="text-xs font-semibold text-gray-500">
                    Emotional Tone:{" "}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {lesson.emotionalTone}
                  </span>
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <img
                    src={
                      lesson.creatorPhoto || "https://i.pravatar.cc/150?img=1"
                    }
                    alt={lesson.creatorName}
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {lesson.creatorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(lesson.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  {lesson.accessLevel?.toLowerCase() === "premium" &&
                  !isPremiumUser ? (
                    <Link
                      to="/pricing"
                      className="block w-full text-center py-3 bg-yellow-400 text-black font-bold rounded-lg border-2 border-black transition-all"
                      style={{ boxShadow: "3px 3px 0px 0px #000" }}
                    >
                      Upgrade to View
                    </Link>
                  ) : (
                    <Link
                      to={`/publiclessons/${lesson._id}`}
                      className="block w-full bg-[#ffdb58] text-black font-semibold py-3 text-center border-2   border-black transition-all relative"
                      style={{
                        backgroundColor: "#ffdb58",
                        boxShadow: "4px 4px 0px 0px #000",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "2px 2px 0px 0px #000";
                        e.currentTarget.style.transform = "translate(2px, 2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "4px 4px 0px 0px #000";
                        e.currentTarget.style.transform = "translate(0, 0)";
                      }}
                    >
                      See Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Feature;
