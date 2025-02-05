import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from "react-loading-skeleton";


const CourseBreadcrumb = ({ getMatchCourse, CourseTag, Tag }) => {

  const [isLoading, setisLoading] = useState(true)
  // const formattedDate = `${getMatchCourse.dUpdatedDate.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
  const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
  }

  useEffect(() => {
    if (getMatchCourse.length !== 0) {
      setisLoading(false);
    }
  }, [getMatchCourse]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setisLoading(false)
  //   }, 5000)
  // }, [])


  return (
    <>
      <div className="col-lg-8">
        <div className="content text-start">
          {
            isLoading ? <>
              <>
                <Skeleton width={150}/>
                <h2 className="title">
                  <Skeleton width={600}/>
                </h2>
                <p className="description">
                  <Skeleton height={20} width={"100%"}/>
                  <Skeleton height={20} width={"100%"}/>
                  <Skeleton height={20} width={"100%"}/>
                  <Skeleton height={20} width={"100%"}/>
                  <Skeleton height={20} width={"60%"}/>
                </p>
                <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
                  {/* Skeleton for the Best Seller badge */}
                  <div className="feature-sin best-seller-badge">
                    <Skeleton width={100} height={25}/>
                  </div>

                  {/* Skeleton for the star ratings */}
                  <div className="feature-sin rating d-flex">
                    {Array.from({length: 5}).map((_, index) => (
                        <div key={index} className="me-2">
                          <Skeleton circle={true} width={20} height={20}/>
                        </div>
                    ))}
                  </div>

                  {/* Skeleton for the total rating */}
                  <div className="feature-sin total-rating">
                    <Skeleton width={70} height={25}/>
                  </div>
                </div>
                <div className="rbt-author-meta mb--20 d-flex align-items-center">
                  <div className="rbt-avater me-3">
                    <Skeleton circle={true} width={40} height={40}/>
                  </div>
                  <div className="rbt-author-info d-flex ">
                    <Skeleton width={120} height={20}/>
                    <Skeleton width={180} height={20} className={'ml--10'}/>
                  </div>
                </div>
                <ul className="rbt-meta d-flex flex-column">
                  {/* Skeleton for Batch Duration */}
                  <li className={'d-flex'}>
                    <Skeleton width={150} height={15} className={'mr--10'}/>
                    <Skeleton width={150} height={15}/>
                  </li>
                  <li className={'d-flex'}>
                    <Skeleton width={200} height={15} className={'mr--10'}/>
                    <Skeleton width={150} height={15}/>
                  </li>
                  <li className={'d-flex'}>
                    <Skeleton width={150} height={15} className={'mr--10'}/>
                    <Skeleton width={150} height={15}/>
                  </li>


                  {/* Skeleton for Circle Badges */}
                  <li>
                    <div className="d-flex mt-1 mb-5 mt-2">
                      {[...Array(7)].map((_, index) => (
                          <div key={index} className="me-2">
                            <Skeleton circle={true} width={30} height={30}/>
                          </div>
                      ))}
                    </div>
                  </li>
                </ul>

              </>
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
                  Courses
                </li>
              </ul>
              {/*<h2 className="title">*/}
              {/*  {getMatchCourse.sCourseTitle}*/}
              {/*</h2>*/}
              <div className="d-block d-md-flex">
                <div className="rbt-category mb--10 mb_md--0 order-1 order-md-2">
                  <Link href="#">{getMatchCourse.sCategory}</Link>
                </div>
                <h4 className="rbt-card-title order-2 order-md-1 mr--10">{getMatchCourse.sCourseTitle}</h4>
              </div>
              <p className="description">
                {getMatchCourse.sShortDesc}
              </p>


              <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
                {CourseTag ? <>
                  <div className="feature-sin best-seller-badge">
                    <span className="rbt-badge-2">
                      <span className="image"></span>
                      {Tag[0]['sTagName']}
                    </span>
                  </div>
                </> : <></>}

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
                  <Link className="rbt-badge-4" href="#">
                    <span> {getMatchCourse.enroll_cnt} students</span>
                  </Link>
                </div>
              </div>

              <div className="rbt-author-meta mb--20">
                <div className="rbt-avater">
                  <Link href={``}>
                    {getMatchCourse.sProfilePhotoPath && (
                        // <Image className={'position-relative'} src={getMatchCourse.tutor_image}  width={40} height={40}></Image>
                        <img className={'position-relative'} src={getMatchCourse.sProfilePhotoPath} width={40}
                             height={40}></img>
                    )}
                  </Link>
                </div>
                <div className="rbt-author-info">
                  Course By{" "}
                  <Link href={`/profile/${getMatchCourse.id}`}>
                    {getMatchCourse.sFName} {getMatchCourse.sLName}
                  </Link>{" "}
                </div>
              </div>

              <ul className="rbt-meta">
                <li>
                  <i className="feather-calendar"></i>Last updated{" "}
                  {formatDate(getMatchCourse.dUpdatedDate)}
                </li>
                <li className={'text-success'}>
                  <i className="fa fa-check-circle"></i>Verified
                </li>
              </ul>
            </>
          }
        </div>
      </div>
    </>
  );
};

export default CourseBreadcrumb;
