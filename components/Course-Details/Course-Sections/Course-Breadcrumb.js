import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from "react-loading-skeleton";


const CourseBreadcrumb = ({ getMatchCourse, CourseTag, Tag }) => {

  const [isLoading, setisLoading] = useState(true)
  // console.log(CourseTag)
  // const formattedDate = `${getMatchCourse.dUpdatedDate.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
  const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
  }

  useEffect(() => {
    setTimeout(() => {
      setisLoading(false)
    }, 5000)
  }, [])


  return (
    <>
      <div className="col-lg-8">
        <div className="content text-start">
          {isLoading ? <>
            <Skeleton width={150} />
          </> : <>
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
          </>}
          <h2 className="title">
            {isLoading ? <>
              <Skeleton width={600} />
            </> : <>
              {getMatchCourse.sCourseTitle}
            </>}

          </h2>
          <p className="description">
            {isLoading ? <>
              <Skeleton height={180}  />
            </> : <>
              {getMatchCourse.sShortDesc}
            </>}

          </p>

          <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
            {CourseTag ? <>
              <div className="feature-sin best-seller-badge">
                <span className="rbt-badge-2">
                  <span className="image">
                  </span>

                  {isLoading ? <>
                    <Skeleton height={100}  />
                  </> : <>
                    {Tag[0]['sTagName']}
                  </>}
                </span>
              </div>
            </> : <></>}

            <div className="feature-sin rating">
              {isLoading ? <>
                <Skeleton width={200}  />
              </> : <>
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
              </>}


            </div>

            <div className="feature-sin total-rating">
              {isLoading ? <>
                <Skeleton width={100}  />
              </> : <>
                <Link className="rbt-badge-4" href="#">
                  {getMatchCourse.user_rate_cnt} rating
                </Link>
              </>}

            </div>

            <div className="feature-sin total-student">
              {isLoading ? <>
                <Skeleton width={100}  />
              </> : <>
                <Link className="rbt-badge-4" href="#">
                  <span> {getMatchCourse.enroll_cnt} students</span>
                </Link>
              </>}

            </div>
          </div>

          <div className="rbt-author-meta mb--20">
            <div className="rbt-avater">
              {/*<Link href={`/profile/${getMatchCourse.id}`}>*/}
              {isLoading ? <>
                <Skeleton width={200}  />
              </> : <>
                <Link href={``}>
                  {getMatchCourse.tutor_image && (
                      // <Image className={'position-relative'} src={getMatchCourse.tutor_image}  width={40} height={40}></Image>
                      <img className={'position-relative'} src={getMatchCourse.tutor_image}  width={40} height={40}></img>
                  )}
                </Link>
              </>}

            </div>
            <div className="rbt-author-info">

              {isLoading ? <>
                <Skeleton width={500}  />
              </> : <>
                By{" "}
                <Link href={`/profile/${getMatchCourse.id}`}>
                  {getMatchCourse.sFName} {getMatchCourse.sLName}
                </Link>{" "}
                In <Link href="#">{getMatchCourse.sCategory}</Link>
              </>}

            </div>
          </div>


          {isLoading ? <>
            <Skeleton width={500} />
          </> : <>
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
          </>}

        </div>
      </div>
    </>
  );
};

export default CourseBreadcrumb;
