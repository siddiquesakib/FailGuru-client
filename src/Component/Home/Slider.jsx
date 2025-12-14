import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";

const Slider = () => {
  const slides = [
    {
      img: "/1.png",
      title: "Learn from Failures",
      subtitle: "Transform mistakes into stepping stones for success",
    },
    {
      img: "/2.png",
      title: "Share Your Journey",
      subtitle: "Inspire others with your life lessons and experiences",
    },
    {
      img: "/3.png",
      title: "Grow Together",
      subtitle: "Join a community of learners and achievers",
    },
    {
      img: "/4.png",
      title: "Unlock Wisdom",
      subtitle: "Discover insights from people who've been there",
    },
  ];

  return (
    <div className="relative">
      <Swiper
        modules={[
          Navigation,
          Pagination,
          Scrollbar,
          A11y,
          Autoplay,
          EffectFade,
        ]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active-custom",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        className="overflow-hidden "
      >
        {slides.map((slide, id) => (
          <SwiperSlide key={id}>
            <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[520px]">
              {/* Image */}
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 md:pb-20 text-white text-center px-4 sm:px-6">
                <div className="max-w-4xl">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 animate-fade-up">
                    {slide.title}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold opacity-90 animate-fade-up-delay">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom CSS for pagination */}
      <style jsx>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: white;
          opacity: 0.5;
          border: 2px solid black;
          margin: 0 6px !important;
        }
        .swiper-pagination-bullet-active-custom {
          background: #ffdb58 !important;
          opacity: 1 !important;
          border: 2px solid black !important;
          transform: scale(1.3);
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out;
        }
        .animate-fade-up-delay {
          animation: fade-up 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
};

export default Slider;
