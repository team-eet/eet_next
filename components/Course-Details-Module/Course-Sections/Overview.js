import React, { useState } from "react";
import parse from "html-react-parser";

const Overview = ({ checkMatchCourses }) => {
    // console.log(checkMatchCourses)
  const [toggle, setToggle] = useState(false);
  const { title, desc, descTwo, overviewList } = checkMatchCourses;

  return (
    <>
      <div
        className={`rbt-course-feature-box overview-wrapper rbt-shadow-box text-start mt--20 has-show-more ${
          toggle ? "active" : ""
        }`}
        id="overview"
      >
        <div className="rbt-course-feature-inner has-show-more-inner-content">

          <p>{parse(checkMatchCourses)}</p>
        </div>
        <div
            className={`rbt-show-more-btn ${toggle ? "active" : ""}`}
          onClick={() => setToggle(!toggle)}
        >
          {!toggle ? 'Show More' : 'Show Less'}
        </div>
      </div>
    </>
  );
};

export default Overview;
