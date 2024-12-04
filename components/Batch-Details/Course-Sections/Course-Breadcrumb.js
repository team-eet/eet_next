import Image from "next/image";
import Link from "next/link";

const CourseBreadcrumb = ({ getMatchCourse }) => {
  // console.log(getMatchCourse)
  // const formattedDate = `${getMatchCourse.dUpdatedDate.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
  const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
  }
  // console.log('getMatchCourse', getMatchCourse)
  return (
    <>
      <div className="col-lg-8">
        <div className="content text-start">
          <ul className="page-list">
            <li className="rbt-breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li>
              <div className="icon-right">
                <i className="feather-chevron-right"></i>
              </div>
            </li>
            <li className="rbt-breadcrumb-item active">
              {getMatchCourse.sCategory}
            </li>
          </ul>
          <h2 className="title">{getMatchCourse.sCourseTitle}</h2>
          <p className="description">{getMatchCourse.sShortDesc}</p>

          <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
            <div className="feature-sin best-seller-badge">
              <span className="rbt-badge-2">
                <span className="image">
                  {/*{getMatchCourse.awardImg && (*/}
                  {/*  <Image*/}
                  {/*    src={getMatchCourse.awardImg}*/}
                  {/*    width={30}*/}
                  {/*    height={30}*/}
                  {/*    alt="Best Seller Icon"*/}
                  {/*  />*/}
                  {/*)}*/}
                </span>
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
              <span> {getMatchCourse.enroll_cnt} students</span>
            </div>
          </div>

          <div className="rbt-author-meta mb--20">
            <div className="rbt-avater">
              {/*<Link href={`/profile/${getMatchCourse.id}`}>*/}
              <Link href={``}>
                {getMatchCourse.tutor_image && (
                    <Image className={"position-relative"} src={getMatchCourse.tutor_image}  width={40} height={40}></Image>
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
              <Link href={`/profile/${getMatchCourse.id}`}>
                {getMatchCourse.sFName} {getMatchCourse.sLName}
              </Link>{" "}
              In <Link href="#">{getMatchCourse.sCategory}</Link>
            </div>
          </div>

          <ul className="rbt-meta">
            <li>
              <i className="feather-calendar"></i>Last updated{" "}
              {formatDate(getMatchCourse.dUpdatedDate)}
            </li>
            <li>
              <i className="feather-globe"></i>
              Top rated
            </li>
            <li>
              <i className="feather-award"></i>Verified
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CourseBreadcrumb;
