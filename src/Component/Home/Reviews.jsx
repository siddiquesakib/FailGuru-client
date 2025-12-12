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
      name: "Sarah Johnson",
      stars: 5,
      text: "Life-changing lessons! Completely transformed my mindset.",
      photo: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Mike Chen",
      stars: 4,
      text: "Practical advice that actually works in real life.",
      photo: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Emma Davis",
      stars: 5,
      text: "The best place to learn from others' experiences!",
      photo: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Raj Patel",
      stars: 5,
      text: "Premium content is worth every penny. Highly recommend!",
      photo: "https://i.pravatar.cc/150?img=4",
    },
    {
      name: "Sarah Johnson",
      stars: 5,
      text: "Life-changing lessons! Completely transformed my mindset.",
      photo: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Mike Chen",
      stars: 4,
      text: "Practical advice that actually works in real life.",
      photo: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Emma Davis",
      stars: 5,
      text: "The best place to learn from others' experiences!",
      photo: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Raj Patel",
      stars: 5,
      text: "Premium content is worth every penny. Highly recommend!",
      photo: "https://i.pravatar.cc/150?img=4",
    },
  ];

  return (
    <div className="py-20 bg-[url(/bgimg.png)]">
      <div className=" mx-auto ">
        <div className="flex mx-auto">
          <Button className="mb-6">Review</Button>
        </div>
        <div className="text-center mb-10">
          <Heading>What People Are Saying</Heading>
          <Paragraph>Join 10K+ happy learners</Paragraph>
        </div>

        {/* Reviews Grid - 2 cards per row */}
        <Swiper
          slidesPerView={4}
          grid={{ rows: 2, fill: "row" }}
          centeredSlides={true}
          spaceBetween={30}
          speed={3000}
          grabCursor={true}
          freeMode={{
            enabled: true,
            momentum: false,
          }}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
        >
          {reviews.map((review, index) => (
            <SwiperSlide
              key={index}
              className="bg-[#fdfd96] border-2 border-black p-8 "
              style={{ boxShadow: "6px 6px 0px 0px #000" }}
            >
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={review.photo}
                  alt={review.name}
                  className="w-14 h-14 rounded-full border-2 border-gray-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xl text-gray-900 mb-2 truncate">
                    {review.name}
                  </h4>
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < review.stars ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Text - 2 lines */}
              <Paragraph className="text-black leading-relaxed text-lg line-clamp-2">
                "{review.text}"
              </Paragraph>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Reviews;
