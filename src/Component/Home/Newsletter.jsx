import React, { useState } from "react";
import { toast } from "react-toastify";
import Container from "../Shared/Container";
import Heading from "../Shared/Heading";
import Button from "../Shared/Button";
import Paragraph from "../Shared/Paragraph";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed! Check your email 📧");
      setEmail("");
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto pb-12 pt-2  my-20 border-2 border-black bg-[#fdfd96]"
      style={{
        boxShadow: "8px 8px 0px 0px #000",
      }}
    >
      <div className=" max-w-3xl  px-20 mx-auto">
        <div className=" text-center font-black">
          <div className="flex mx-auto">
            <Button className="mb-6">newsletter</Button>
          </div>
          {/* Header */}
          <div className="text-center mb-10">
            <Heading>Join our exclusive learning newsletter.</Heading>
            <Paragraph>
              Receive insider tips, updates and resources to enhance your
              teaching, course creation, and platform mastery.
            </Paragraph>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubscribe} className="space-y-6">
            <div className="relative max-w-[400px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full pl-6 pr-16 py-4 bg-white rounded-full border-3 border-black text-black font-semibold focus:outline-none"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
