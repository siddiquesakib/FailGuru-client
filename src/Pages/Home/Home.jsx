import React from "react";
import Pricing from "../Payment/Pricing";
import Slider from "../../Component/Home/Slider";
import Footer from "../../Component/Shared/Footer/Footer";
import Feature from "../../Component/Home/Feature";
import WhyLearningMatters from "../../Component/Home/WhyLearningMatters";
import Reviews from "../../Component/Home/Reviews";
import Newsletter from "../../Component/Home/Newsletter";
import FAQ from "../../Component/Home/FAQ";

const Home = () => {
  return (
    <div>
      <Slider />
      <Feature />
      <WhyLearningMatters />
      <Newsletter />
      <FAQ />
      <Reviews />
      <Pricing />
    </div>
  );
};

export default Home;
