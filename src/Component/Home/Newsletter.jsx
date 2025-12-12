import React, { useState } from "react";
import { toast } from "react-toastify";

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
    <div className="py-20 bg-black">
      <div className="max-w-md mx-auto">
        <div
          className="border-4 border-white p-12 text-center font-black"
          style={{
            boxShadow: "12px 12px 0px 0px #000",
            background: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)",
          }}
        >
          {/* Title */}
          <h2 className="text-4xl md:text-5xl text-white mb-12 uppercase tracking-wider flex items-center justify-center gap-3">
            ✉️ Stay Updated
          </h2>

          {/* Email Form */}
          <form onSubmit={handleSubscribe} className="space-y-6">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white placeholder-white/70   text-lg font-semibold focus:outline-none focus:border-white"
                required
              />
              <button
                type="submit"
                className="bg-[#ffdb58] text-black px-8 py-4 text-xl font-black uppercase border-4 border-black   hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
                style={{ boxShadow: "6px 6px 0px 0px #000" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "3px 3px 0px 0px #000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "6px 6px 0px 0px #000";
                }}
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
