import Image from "next/image";
import Link from "next/link";

const CourseBreadcrumbTwo = ({ getMatchCourse }) => {
  // console.log(getMatchCourse)
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
          <h2 className="title theme-gradient">{getMatchCourse.sCourseTitle}</h2>

          <div className="rbt-author-meta mb--20 justify-content-center">
            <div className="rbt-avater">
              <Link href={`/profile/${getMatchCourse.id}`}>
                {getMatchCourse.tutor_image && (
                  <Image
                    width={40}
                    height={40}
                    className={'position-relative'}
                    src={getMatchCourse.tutor_image}
                    alt={getMatchCourse.userName}
                  />
                )}
              </Link>
            </div>
            <div className="rbt-author-info">
              By{" "}
              <Link href={`/profile/${getMatchCourse.nCId}`}>
                {getMatchCourse.sFName} {getMatchCourse.sLName}
              </Link>{" "}
              In <Link href="#">{getMatchCourse.sCategory}</Link>
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
              <i className="feather-globe"></i>
              English
            </li>
            <li>
              <i className="feather-award"></i>
              Verified
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CourseBreadcrumbTwo;
