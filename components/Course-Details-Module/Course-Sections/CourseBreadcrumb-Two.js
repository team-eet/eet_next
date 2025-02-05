import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import React, {useEffect, useState} from "react";

const CourseBreadcrumbTwo = ({ getMatchCourse }) => {
  console.log("getMatchCourse Module",getMatchCourse)
  const [crsid, setcrsid] = useState('')

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const courseId = parts[parts.length - 1];
    setcrsid(courseId);
  }, []);
  // setcrsid(courseId)

  const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
  }
  return (
    <>
      <div className="col-lg-8 offset-lg-2">
        <div className="content text-center">
          <div className="d-flex align-items-center flex-wrap justify-content-center mb--15 rbt-course-details-feature">
            <div className="feature-sin best-seller-badge">
              <span className="rbt-badge-2">
                <span className="image">
                  {" "}
                  {getMatchCourse.awardImg && (
                      <Image
                          className={'position-relative'}
                          src={getMatchCourse.awardImg}
                          width={30}
                          height={30}
                          alt="Best Seller Icon"
                      />
                  )}
                </span>{" "}
                Best Seller
              </span>
            </div>
            <div className="feature-sin rating">
              <Link href="#">{getMatchCourse.star}</Link>
              <Link href="#">
                <i className="fa fa-star"></i>
              </Link>
              <Link href="#">
                <i className="fa fa-star"></i>
              </Link>
              <Link href="#">
                <i className="fa fa-star"></i>
              </Link>
              <Link href="#">
                <i className="fa fa-star"></i>
              </Link>
              <Link href="#">
                <i className="fa fa-star"></i>
              </Link>
            </div>
            <div className="feature-sin total-rating">
              <Link className="rbt-badge-4" href="#">
                {getMatchCourse.user_rate_cnt} rating
              </Link>
            </div>
            <div className="feature-sin total-student">
              <span>{getMatchCourse.studentNumber} students</span>
            </div>
          </div>
          <div className="d-block d-md-flex justify-content-center align-items-center">
            <div className="rbt-category mb--10 mb_md--0 order-1 order-md-2">
              <Link href="#">{getMatchCourse.sCategory}</Link>
            </div>
            <h4 className="title theme-gradient order-2 order-md-1 mr--10">{getMatchCourse.sCourseTitle}</h4>
          </div>

          {/*<p className="description">*/}
          {/*  {parse(getMatchCourse.sFullDesc)}*/}
          {/*</p>*/}
          {/*<h2 className="title theme-gradient">{getMatchCourse.sCourseTitle}</h2>*/}

          <div className="rbt-author-meta mb--20 justify-content-center">
            <div className="rbt-avater">
              <Link href={``}>
                {getMatchCourse.sProfilePhotoPath && (
                    <Image className={"position-relative"} src={getMatchCourse.sProfilePhotoPath}
                           width={40}
                           height={40}></Image>
                    // <Image
                    //   width={40}
                    //   height={40}
                    //   src={getMatchCourse.userImg}
                    //   alt={getMatchCourse.userName}
                    // />
                )}
              </Link>
            </div>
            <div className="rbt-author-info">
              By{" "}
              <Link href={`/profile/${getMatchCourse.nCId}`}>
                {getMatchCourse.sFName} {getMatchCourse.sLName}
              </Link>{" "}
            </div>
          </div>

          <ul className="rbt-meta">
            <li>

              {getMatchCourse.dUpdatedDate === null ? <>
                <i className="feather-calendar"></i>Last updated{" "}
                {formatDate(getMatchCourse.dCreatedDate)}
              </> : <>
                <i className="feather-calendar"></i>Last updated{" "}
                {formatDate(getMatchCourse.dUpdatedDate)}
              </>}

            </li>
            <li>
              <i className="fa fa-bookmark"></i>
              {getMatchCourse.sLevel}
            </li>
            <li className={'text-success'}>
              <i className="fa fa-check-circle"></i>Verified
            </li>
          </ul>

          <div className="content-item-conten w-25 m-auto mt--30">
            <div className="add-to-card-button mt--15">
              <Link
                  className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
                  href={`/Package/${crsid}`}
              >
                <span className="btn-text">View Packages</span>
                <span className="btn-icon">
                  <i className="feather-arrow-right"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseBreadcrumbTwo;
