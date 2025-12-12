import React from "react";
import { Link } from "react-router";
import Container from "../Shared/Container";
import Heading from "../Shared/Heading";
import Paragraph from "../Shared/Paragraph";
import Button from "../Shared/Button";

const WhyLearningMatters = () => {
  const benefits = [
    {
      title: "Boosts Brain Health",
      desc: "Learning from experience builds new neural paths, boosting resilience and problem-solving skills. It ensures long-term cognitive health and mental sharpness.",
    },
    {
      title: "Enhances Opportunities",
      desc: "Reflecting on life’s lessons refines self-awareness and decision-making. This self-improvement increases confidence, leading to better career success and fulfillment.",
    },
    {
      title: "Improves Well-being",
      desc: "Life teaches empathy and better relationship skills, which are vital for mental health. This knowledge reduces stress and fosters deeper emotional peace.",
    },
  ];

  return (
    <div className="min-h-screen bg-[url(/bgimg.png)] py-16 px-4">
      <Container className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="flex mx-auto">
          <Button className="mb-6">Learning</Button>
        </div>
        {/* Header */}
        <div className="text-center mb-10">
          <Heading>Why Learning From Life Matters</Heading>
          <Paragraph>
            Life's real classroom teaches lessons books can't. Here's why it
            changes everything.{" "}
          </Paragraph>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-[#f8d6b3] border-2  border-black px-4 py-6"
              style={{ boxShadow: "8px 8px 0px 0px #000" }}
            >
              {/* Title */}
              <h3 className="text-[28px]  font-black text-black uppercase mb-4 ">
                {benefit.title}
              </h3>

              {/* Description */}
              <Paragraph className="!text-black">{benefit.desc}</Paragraph>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default WhyLearningMatters;
