import React from "react";
import { Link } from "react-router";
import Container from "../../Component/Shared/Container";

const Pricing = () => {
  const pricingPlans = [
    {
      id: 1,
      name: "FREE",
      description:
        "For creators who need simple tools to launch and manage online classes with full control from day one.",
      price: "Free",
      bgColor: "bg-yellow-100",
      features: [
        "Create unlimited lessons",
        "View all public Free lessons",
        "Save and favorite lessons",
        "Basic dashboard access",
        "Search and filter lessons",
        "React/like to lessons",
        "Share lessons on social media",
      ],
    },
    {
      id: 2,
      name: "PREMIUM",
      description:
        "For professionals who want control, smart features and more freedom to grow their digital academy.",
      price: " ৳1500",
      bgColor: "bg-orange-100",
      features: [
        "All Free plan features",
        "Create unlimited Premium lessons",
        "View all Premium lessons",
        "Premium badge on profile",
        "Ad-free experience",
        "Advanced analytics dashboard",
        "Featured lessons on homepage",
        "Change access level anytime",
        "Priority customer support",
        "Early access to new features",
      ],
    },
  ];

  const handlePayment = async ()=>{
    
  }

  return (
    <Container className=" py-16 px-4 min-h-screen">
      <div className="my-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 font2">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="flex flex-col md:flex-row  justify-center gap-8 ">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`${plan.bgColor} md:w-[450px] flex flex-col justify-between p-8 rounded-lg border-4 border-black transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1`}
              style={{ boxShadow: "8px 8px 0px 0px #000" }}
            >
              <div>
                <h2 className="text-4xl font-black mb-3 font2">{plan.name}</h2>
                <p className="text-base mb-8 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span className="text-5xl font-black">{plan.price}</span>
                  {plan.name === "PREMIUM" ? (
                    <span className="text-xl font-semibold"> Lifetime</span>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="mb-8">
                  <p className="font-black text-sm mb-4">INCLUDES:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-base flex items-start">
                        <span className="text-xl mr-3">✱</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <dir>
                {plan.name === "PREMIUM" ? (
                  <Link
                    to="/register"
                    className="block w-full bg-yellow-300 text-black font-bold py-4 rounded-lg text-base text-center border-3 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                    style={{
                      border: "3px solid #000",
                      boxShadow: "4px 4px 0px 0px #000",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                    }}
                  >
                    Get Premium
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className="block w-full bg-yellow-300 text-black font-bold py-4 rounded-lg text-base text-center border-3 border-black transition-all duration-200 hover:translate-x-1 hover:translate-y-1"
                    style={{
                      border: "3px solid #000",
                      boxShadow: "4px 4px 0px 0px #000",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "2px 2px 0px 0px #000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "4px 4px 0px 0px #000";
                    }}
                  >
                    Get Free
                  </Link>
                )}
              </dir>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Pricing;
