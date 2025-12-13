import React from "react";
import Container from "../../Component/Shared/Container";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router";
import Heading from "../../Component/Shared/Heading";
import Paragraph from "../../Component/Shared/Paragraph";
import Button from "../../Component/Shared/Button";

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

  const { user, isPremiumUser, refetchUserData } = useAuth();
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

  //cancle premium
  const handleCancel = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/premium/cancel/${user.email}`
      );
      console.log("Premium update :", response.data);
      // Refetch user data to update UI
      refetchUserData();
      navigate("/payment-cancle");
    } catch (error) {
      console.error("Failed to update premium status:", error);
    }
  };

  return (
    <div className="py-1 mb-10 px-4 min-h-[calc(100vh-250px)] bg-[url(/bgimg.png)]">
      <Container className="my-20">
        <div className="flex mx-auto">
          <Button className="mb-6">Plan</Button>
        </div>
        {isPremiumUser ? (
          <div className="text-center mb-1 max-w-3xl mx-auto">
            <Heading className="text-3xl md:text-5xl font-black mb-4 font2">
              You're officially a lifetime Premium member.
            </Heading>
            <Paragraph className="text-xl text-gray-600 mb-8">
              You can cancel anytime
            </Paragraph>
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-xl border-2 border-black font-semibold cursor-pointer text-black  transition-all relative"
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
              <Heading>Choose Your Plan</Heading>
              <Paragraph>Select the perfect plan for your needs</Paragraph>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`${plan.bgColor} md:w-[450px] flex flex-col p-8 border-2 border-black transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#000]`}
                  style={{ boxShadow: "8px 8px 0px 0px #000" }}
                >
                  <div className="flex-grow">
                    <h2 className="text-4xl font-black mb-3">{plan.name}</h2>
                    <Paragraph className="text-base mb-8 !text-black leading-relaxed">
                      {plan.description}
                    </Paragraph>

                    <div className="mb-8 flex items-center">
                      <h1 className="text-[40px] font-black">{plan.price} </h1>
                      {plan.name === "PREMIUM" && (
                        <span className="text-xl font-semibold">
                          ৳ Lifetime
                        </span>
                      )}
                    </div>

                    <div className="mb-8">
                      <p className="font-bold text-sm mb-4">INCLUDES:</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-base flex items-start"
                          >
                            <span className="text-xl mr-3">✱</span>
                            <Paragraph className="text-black!">
                              {feature}
                            </Paragraph>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {plan.name === "PREMIUM" ? (
                      <button
                        onClick={handlePayment}
                        className="block w-full cursor-pointer bg-[#ffdb58] text-black font-semibold py-4 text-base text-center border-2 border-black transition-all duration-200"
                        style={{
                          boxShadow: "4px 4px 0px 0px #000",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "2px 2px 0px 0px #000";
                          e.currentTarget.style.transform =
                            "translate(2px, 2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow =
                            "4px 4px 0px 0px #000";
                          e.currentTarget.style.transform = "translate(0, 0)";
                        }}
                      >
                        Get Premium
                      </button>
                    ) : (
                      <button
                        className="block w-full cursor-pointer bg-[#ffdb58] text-black font-semibold py-4 text-base text-center border-2 border-black transition-all duration-200"
                        style={{
                          boxShadow: "4px 4px 0px 0px #000",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            "2px 2px 0px 0px #000";
                          e.currentTarget.style.transform =
                            "translate(2px, 2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow =
                            "4px 4px 0px 0px #000";
                          e.currentTarget.style.transform = "translate(0, 0)";
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
      </Container>
    </div>
  );
};

export default Pricing;
