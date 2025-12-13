import React from "react";
import Heading from "../Shared/Heading";
import Paragraph from "../Shared/Paragraph";
import Button from "../Shared/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Container from "../Shared/Container";
import { Autoplay } from "swiper/modules";

const Reviews = () => {
  const reviews = [
    {
      name: "Fatema Rahman",
      stars: 5,
      text: "This platform completely changed how I approach challenges in my daily life. The lessons are truly inspiring!",
      photo: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Rafsan Ahmed",
      stars: 5,
      text: "Incredible insights from real people. I've learned more here than from any book or course.",
      photo: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Nusrat Jahan",
      stars: 4,
      text: "The premium content is absolutely worth it. Helped me grow both personally and professionally.",
      photo: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Tanvir Hossain",
      stars: 5,
      text: "Amazing community and powerful life lessons. I visit this platform every single day!",
      photo: "https://i.pravatar.cc/150?img=4",
    },
    {
      name: "Sabrina Khan",
      stars: 5,
      text: "The most practical life advice I've ever received. These lessons actually work in real situations.",
      photo: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Anik Islam",
      stars: 5,
      text: "Game changer for my career and mindset. Highly recommend to anyone looking to improve themselves.",
      photo: "https://i.pravatar.cc/150?img=6",
    },
    {
      name: "Maliha Tasnim",
      stars: 4,
      text: "Beautiful collection of wisdom from people around the world. Love the emotional tone filters!",
      photo: "https://i.pravatar.cc/150?img=7",
    },
    {
      name: "Shafiq Rahman",
      stars: 5,
      text: "Best investment I've made in myself this year. The premium lessons are absolutely brilliant!",
      photo: "https://i.pravatar.cc/150?img=8",
    },
  ];

  return (
    <div className="py-12 sm:py-16  md:py-20 bg-[url(/bgimg.png)]">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-center">
          <Button className="mb-4 sm:mb-6">Review</Button>
        </div>
        <div className="text-center mb-8 sm:mb-10">
          <Heading>What People Are Saying</Heading>
          <Paragraph>Join 10K+ happy learners</Paragraph>
        </div>

        {/* Reviews Slider */}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          speed={3000}
          grabCursor={true}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay]}
          className="px-4"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div
                className="bg-[#fdfd96] border-2 border-black p-6 sm:p-8 h-full"
                style={{ boxShadow: "6px 6px 0px 0px #000" }}
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <img
                    src={review.photo}
                    alt={review.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs sm:text-[15px] text-gray-900 mb-1 sm:mb-2 truncate">
                      {review.name}
                    </h4>
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-[14px] sm:text-[18px] ${
                            i < review.stars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-800 leading-relaxed text-[12px] sm:text-[14px] font-medium line-clamp-3">
                  "{review.text}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Reviews;
