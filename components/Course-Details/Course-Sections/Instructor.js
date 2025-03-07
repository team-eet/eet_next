import Image from "next/image";
import Link from "next/link";
import React, {useState} from "react";
import img from '../../../public/images/client/blank-profile-picture-973460_1280.png'

const Instructor = ({ checkMatchCourses }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const description = checkMatchCourses.sDesc || "";

  return (
    <>
      <div className="about-author border-0 pb--0 pt--0">
        <div className="section-title mb--30">
          <h4 className="rbt-title-style-3 text-start">Tutor</h4>
        </div>
        {/*{checkMatchCourses.body.map((teacher, innerIndex) => (*/}
          <div className="media align-items-center">
            <div className="thumbnail">
              {/*<Link href={`/profile/${teacher.id}`}>*/}
              <Link href={`javascript:void(0)`}>
                {checkMatchCourses.sProfilePhotoPath !== "" ?
                    <img src={checkMatchCourses.sProfilePhotoPath} className={'rounded-circle shadow cusBatchesImage'} width={150} height={150}></img> :
                    // <Image
                    //     src={img}
                    //     width={250}
                    //     height={250}
                    //     className={'position-relative'}
                    //     alt="Author Images"
                    // />}
                    <img
                        src={img}
                        width={150}
                        height={150}
                        className={'rounded-circle position-relative'}
                        alt="Author Images"
                    />}

              </Link>
            </div>
            <div className="media-body">
              <div className="author-info">
                <h5 className="title text-start">
                  <Link
                      className="hover-flip-item-wrapper "
                      // href={`/profile/${teacher.id}`}
                      href={`javascript:void(0)`}
                  >
                    {checkMatchCourses.sFName} {checkMatchCourses.sLName}
                  </Link>
                </h5>
                <span
                    className="b3 subtitle text-start">{checkMatchCourses.sDegree} ({checkMatchCourses.sSpecialization})</span>
                <ul className="rbt-meta mb--20 mt--10">
                  <li>
                    <i className="fa fa-star color-warning"></i>
                    0 Reviews
                    <span className="rbt-badge-5 ml--5">
                      {checkMatchCourses.user_rate_cnt} Rating
                    </span>
                  </li>
                  <li>
                    <i className="feather-users"></i> 0
                    Students
                  </li>
                  <li>
                    <Link href="javascript:void(0)">
                      <i className="feather-video"></i>5 Courses
                    </Link>
                  </li>
                  <li>
                    <Link href="javascript:void(0)">
                      <i className="feather-video"></i>5 Batches
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="content">
                <p className="b3 subtitle text-start">
                  {isExpanded || description.length <= 250
                      ? description
                      : `${description.substring(0, 250)}...`}
                  {description.length > 250 && (
                      <button className="btn btn-lg ms-1 btn-link p-0" onClick={toggleReadMore}>
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                  )}
                </p>
              </div>
            </div>
          </div>
        {/*))}*/}
      </div>
    </>
  );
};

export default Instructor;
