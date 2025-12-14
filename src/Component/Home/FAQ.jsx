import React, { useState } from "react";
import Heading from "../Shared/Heading";
import Paragraph from "../Shared/Paragraph";
import Button from "../Shared/Button";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    id: "1",
    question: "What is Life Lesson Hub?",
    answer:
      "It is a platform where people share real life experiences and lessons so others can learn and avoid the same mistakes.",
  },
  {
    id: "2",
    question: "Is it free to use?",
    answer:
      "You can read and share many lessons for free. Some premium content may require an upgrade, depending on your plan.",
  },
  {
    id: "3",
    question: "How do I share my own lesson?",
    answer:
      "After creating an account, go to the “Add Lesson” page, fill in your story details, and submit it for others to read.",
  },
  {
    id: "4",
    question: "Can I edit or delete my lessons?",
    answer:
      "Yes, from your dashboard you can update or remove any lesson that you have created.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="py-12 bg-[url(/bgimg.png)] px-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex mx-auto">
          <Button className="mb-6">FAQ</Button>
        </div>
        {/* Header */}
        <div className="text-center mb-10">
          <Heading>
            Common questions <br /> answered clearly
          </Heading>
          <Paragraph>
            Quick answers to common questions about the platform
          </Paragraph>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border-2 border-black bg-white overflow-hidden"
              style={{ boxShadow: "4px 4px 0px 0px #000" }}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left px-4 py-4 md:px-6 md:py-5 cursor-pointer"
              >
                <span className="font-extrabold text-[20px] md:text-[20px] uppercase ">
                  {item.question}
                </span>
                <span className="text-xl md:text-3xl font-black   ">
                  {openIndex === index ? (
                    <FaRegArrowAltCircleDown className="bg-[#ffdb58] rounded-full" />
                  ) : (
                    <FaRegArrowAltCircleRight className="bg-[#ffdb58] rounded-full" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    key={item.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 md:px-6 md:pb-5 pt-2">
                      <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="text-[16px] font-medium md:text-base text-[#777] leading-relaxed"
                      >
                        {item.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
