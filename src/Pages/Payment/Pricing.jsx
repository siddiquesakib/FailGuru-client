import React from "react";
import Container from "../../Component/Shared/Container";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const Pricing = () => {
  const pricingPlans = [
    {
      id: 1,
      name: "FREE",
      description:
        "For creators who need simple tools to launch and manage online classes with full control from day one.",
      price: "Free",
      bgColor: "bg-[#fdfd96]",
      features: [
        "Create unlimited lessons",
        "View all public Free lessons",
        "Save and favorite lessons",
        "Basic dashboard access",
        "Search and filter lessons",
      ],
    },
    {
      id: 2,
      name: "PREMIUM",
      description:
        "For professionals who want control, smart features and more freedom to grow their digital academy.",
      price: "1500",
      bgColor: "bg-[#f8d6b3]",
      features: [
        "All Free plan features",
        "Create unlimited Premium lessons",
        "View all Premium lessons",
        "Premium badge on profile",
        "Advanced analytics dashboard",
        "Change access level anytime",
      ],
    },
  ];

  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async () => {
    const paymentInfo = {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    };
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/create-checkout-session`,
      paymentInfo
    );
    console.log(data);
    window.location.href = data.url;
  };

  // Fetch user data from MongoDB
  const { data: userData = null, refetch } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`
      );
      return result.data;
    },
    enabled: !!user?.email,
  });

  const isPremium =
    userData?.email === user?.email && userData?.isPremium === true;

  //cancle premium
  const handleCancel = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/premium/cancel/${user.email}`
      );
      console.log("Premium update :", response.data);
      // Refetch user data to update UI
      refetch();
      navigate("/payment-cancle");
    } catch (error) {
      console.error("Failed to update premium status:", error);
    }
  };

  return (
    <div className=" py-1 px-4 min-h-[calc(100vh-250px)] bg-[#f9f5f6]">
      <div className="my-20">
        {isPremium ? (
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl md:w-5xl mx-auto font-black mb-4 font2">
              You're officially a lifetime Premium member.
            </h1>
            <p className="text-xl text-gray-600">You can cancel anytime</p>
            <button
              onClick={handleCancel}
              className="mt-10 px-6 py-2.5 text-xl font-semibold cursor-pointer text-black rounded transition-all relative"
              style={{
                backgroundColor: "#ffdb58",
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
              Cancel Premium
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black mb-4 font2">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-600">
                Select the perfect plan for your needs
              </p>
            </div>
            <div className="flex flex-col md:flex-row  justify-center gap-8 ">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`${plan.bgColor} md:w-[450px] flex flex-col justify-between p-8  border-4 border-black transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#000]`}
                  style={{ boxShadow: "8px 8px 0px 0px #000" }}
                >
                  <div>
                    <h2 className="text-4xl font-black mb-3 ">
                      {plan.name}
                    </h2>
                    <p className="text-base mb-8 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="mb-8">
                      <span className="text-4xl font-black font2">{plan.price}</span>
                      {plan.name === "PREMIUM" ? (
                        <span className="text-xl font-semibold">
                          ৳ Lifetime
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="mb-8">
                      <p className="font-black text-sm mb-4">INCLUDES:</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-base flex items-start"
                          >
                            <span className="text-xl mr-3">✱</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    {plan.name === "PREMIUM" ? (
                      <button
                        onClick={handlePayment}
                        className="block w-full bg-[#ffdb58] text-black font-semibold py-4 text-base text-center border-3 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                        style={{
                          border: "3px solid #000",
                          boxShadow: "4px 4px 0px 0px #000",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "2px 2px 0px 0px #000";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow =
                            "4px 4px 0px 0px #000";
                        }}
                      >
                        Get Premium
                      </button>
                    ) : (
                      <button
                        to="/"
                        className="block w-full bg-[#ffdb58] text-black font-semibold py-4 text-base text-center border-3 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                        style={{
                          border: "3px solid #000",
                          boxShadow: "4px 4px 0px 0px #000",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "2px 2px 0px 0px #000";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow =
                            "4px 4px 0px 0px #000";
                        }}
                      >
                        Get Free
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pricing;
