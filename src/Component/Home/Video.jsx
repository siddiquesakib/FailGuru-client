import React from "react";
import Button from "../Shared/Button";
import Heading from "../Shared/Heading";
import Paragraph from "../Shared/Paragraph";
import { ReactNextPlayer } from "reactnextplayer";

const Video = () => {
  return (
    <div className="px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex mx-auto">
          <Button className="mb-4 sm:mb-6">video</Button>
        </div>
        <Heading>Think Big</Heading>
        <Paragraph>
          how thinking big is the first step towards success.
        </Paragraph>
      </div>
      <div className="flex justify-center">
        <div className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/MX8kzwVDmw8"
            title="Plant Care Guide"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Video;
