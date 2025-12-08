import axios from "axios";
import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import useAuth from "../../hooks/useAuth";

const PaymentSuccess = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  console.log("Session ID:", sessionId);

  useEffect(() => {
    const updatePremium = async () => {
      if (!user?.email) {
        console.log("User email not available yet");
        return;
      }

      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/users/premium/${user.email}`
        );
        console.log("Premium update response:", response.data);
      } catch (error) {
        console.error("Failed to update premium status:", error);
      }
    };

    updatePremium();
  }, [user?.email]);
  return (
    <div className="flex items-center justify-center p-6 my-10 bg-[#f9f5f6]">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 max-w-lg text-center shadow-2xl">
        {/* Premium Badge */}
        <div className="flex justify-center mb-4">
          <div className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-full text-sm shadow">
            PREMIUM ACTIVATED
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>

        {/* Subtitle */}
        <p className="text-gray-700 text-lg leading-relaxed mb-8">
          You’re now a{" "}
          <span className="text-yellow-700 font-semibold">Premium Member</span>{" "}
          ⭐
          <br /> Enjoy lifetime access to all premium features!
        </p>

        {/* Button */}
        <Link
          to="/dashboard"
          className="px-6 py-2.5 text-sm font-semibold text-black rounded transition-all relative"
          style={{
            backgroundColor: "#fdc700",
            boxShadow: "4px 4px 0px 0px #000",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
            e.currentTarget.style.transform = "translate(2px, 2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
            e.currentTarget.style.transform = "translate(0, 0)";
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
