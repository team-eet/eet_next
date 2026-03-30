import React, {useEffect, useState} from "react";
import parse from 'html-react-parser'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Overview = ({ checkMatchCourses }) => {
  // console.log(checkMatchCourses)
  const [toggle, setToggle] = useState(false);
    const [isLoading, setisLoading] = useState(true)

    // const { sFullDesc } = checkMatchCourses;

    useEffect(() => {
        setTimeout(() => {
            setisLoading(false)
        }, 5000)
    }, []);

  return (
    <>
      <div
        className={`rbt-course-feature-box overview-wrapper rbt-shadow-box mt--30 has-show-more text-start ${
          toggle ? "active" : ""
        }`}
        id="overview"
      >
        <div className="rbt-course-feature-inner has-show-more-inner-content">
            <div className="section-title">
                <p>{parse(checkMatchCourses)}</p>
            </div>
        </div>
        <div
          className={`rbt-show-more-btn ${toggle ? "active" : ""}`}
          onClick={() => setToggle(!toggle)}
        >
            {!toggle ? 'Show More' : 'Show Less'}
          {/*Show More*/}
        </div>
      </div>
    </>
  );
};

export default Overview;
