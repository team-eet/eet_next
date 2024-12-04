import { useEffect, useState } from "react";
import "plyr/dist/plyr.css";
import Plyr from "plyr";

import PageHead from "../Head";

import BackToTop from "../backToTop";
import LessonSidebar from "@/components/Lesson/LessonSidebar";
import LessonPagination from "@/components/Lesson/LessonPagination";
import LessonTop from "@/components/Lesson/LessonTop";

const LessonLayout = () => {
  useEffect(() => {
    new Plyr(".rbtplayer", {
      muted: false,
      volume: 1,
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "fullscreen",
      ],
    });
  }, []);
  return (
    <>
      <PageHead title="Lesson - Online Courses & Education NEXTJS14 Template" />

      <div className="rbt-lesson-area bg-color-white">
        <div className="rbt-lesson-content-wrapper">
          <div className="rbt-lesson-leftsidebar">
            <LessonSidebar />
          </div>

          <div className="rbt-lesson-rightsidebar overflow-hidden lesson-video">
            <LessonTop />
            <div className="inner">
              <div className="plyr__video-embed rbtplayer">
                <iframe
                  src="https://www.youtube.com/embed/qKzhrXqT6oE"
                  allowFullScreen
                  allow="autoplay"
                ></iframe>
              </div>
              <div className="content">
                <div className="section-title">
                  <h4>About Lesson</h4>
                  <p>
                    Let us analyze the greatest hits of the past and learn what
                    makes these tracks so special.{" "}
                  </p>
                </div>
              </div>
            </div>
            <LessonPagination urlPrev="#" urlNext="/lesson-intro" />
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
};

export default LessonLayout;
