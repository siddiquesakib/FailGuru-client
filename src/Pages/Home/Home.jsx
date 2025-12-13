import React from "react";
import Pricing from "../Payment/Pricing";
import Slider from "../../Component/Home/Slider";
import Feature from "../../Component/Home/Feature";
import WhyLearningMatters from "../../Component/Home/WhyLearningMatters";
import Reviews from "../../Component/Home/Reviews";
import Newsletter from "../../Component/Home/Newsletter";
import FAQ from "../../Component/Home/FAQ";
import Video from "../../Component/Home/Video";

const Home = () => {
  return (
    <div>
      <Slider />
      <Feature />
      <WhyLearningMatters />
      <Video />
      <Reviews />
      <Pricing />
      <FAQ />
      <Newsletter />
    </div>
  );
};

export default Home;
