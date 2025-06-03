import Content from "./Course-Sections/Content";
import CourseBanner from "./Course-Sections/Course-Banner";
import CourseMenu from "./Course-Sections/Course-Menu";
import Instructor from "./Course-Sections/Instructor";
import Overview from "./Course-Sections/Overview";
import Requirements from "./Course-Sections/Requirements";
import Review from "./Course-Sections/Review";
import Viedo from "./Course-Sections/Viedo";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import CornerRibbon from "react-corner-ribbon";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const CourseDetailsOne = ({ checkMatchCourses }) => {
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    if (checkMatchCourses.length !== 0) {
      setisLoading(false);
    }else{
      setisLoading(true)
    }
  }, [checkMatchCourses]);
  // console.log(checkMatchCourses)
  return (
    <>
      <div className="col-lg-8 mt-0">
        <div className="course-details-content">

          <div className="rbt-inner-onepage-navigation sticky-top">
            {isLoading ? <>
              <nav className="mainmenu-nav onepagenav">
                <ul className="mainmenu">
                  {/* Skeleton for Overview */}
                  <li className="current">
                    <Skeleton width={200} height={40} style={{borderRadius: '20px'}}/>
                  </li>

                  {/* Skeleton for Course Content */}
                  <li>
                    <Skeleton width={210} height={40} style={{borderRadius: '20px'}}/>
                  </li>

                  {/* Skeleton for Prerequisites */}
                  <li>
                    <Skeleton width={180} height={40} style={{borderRadius: '20px'}}/>
                  </li>

                  {/* Skeleton for Instructor */}
                  <li>
                    <Skeleton width={100} height={40} style={{borderRadius: '20px'}}/>
                  </li>

                  {/* Skeleton for Review */}
                  <li>
                    <Skeleton width={100} height={40} style={{borderRadius: '20px'}}/>
                  </li>
                </ul>
              </nav>
            </> : <>
              <CourseMenu/>
            </>}
          </div>


          {isLoading ? <>
            <Skeleton height={10}/>
            <Skeleton height={10}/>
            <Skeleton height={10}/>
            <Skeleton height={10}/>
            <Skeleton height={10}/>
            <Skeleton height={10}/>
            <Skeleton height={10} width={"20%"}/>
          </> : <>
            {checkMatchCourses && checkMatchCourses.sFullDesc ?
                <Overview checkMatchCourses={checkMatchCourses.sFullDesc}/> : ''
            }
          </>
          }


          <div
              className="course-content rbt-shadow-box coursecontent-wrapper mt--30"
              id="coursecontent"
          >
            <Content/>

          </div>

          <div
              className="rbt-course-feature-box rbt-shadow-box details-wrapper mt--30"
              id="details"
          >
            <div className="row g-5">
              {
                isLoading ? <>
                  <div className="col-lg-12">
                    <Skeleton width={150} height={20} style={{marginBottom: '15px'}}/>

                    {/* Skeleton for the list */}
                    <ul className="rbt-list-style-1">
                      {[...Array(10)].map((_, index) => (
                          <li key={index}>
                            {/* Skeleton for each list item */}
                            <div className="d-flex align-items-center">
                              <Skeleton width={20} height={20} style={{marginRight: '10px'}}/>
                              <Skeleton
                                  width={index === 2 ? 300 : index === 3 ? 250 : index === 5 ? 100 : 700}
                                  height={20}
                              />
                            </div>
                          </li>
                      ))}
                    </ul>
                  </div>
                </> : <>
                  {checkMatchCourses.sPrerequisite &&
                      <Requirements
                          checkMatchCourses={checkMatchCourses.sPrerequisite}
                      />
                  }
                </>
              }
            </div>
          </div>
          <div
              className="rbt-instructor rbt-shadow-box intructor-wrapper mt--30"
              id="intructor"
          >
            {
              isLoading ? <>
                <div className="about-author border-0 pb--0 pt--0">
                  <div className="section-title mb--30">
                    <h4 className="rbt-title-style-3 text-start">
                      <Skeleton width={120} height={20}/>
                    </h4>
                  </div>
                  <div className="media align-items-center">
                    <div className="thumbnail">
                      <Skeleton circle width={150} height={150}/>
                    </div>
                    <div className="media-body ml--20">
                      <div className="author-info">
                        <h5 className="title text-start">
                          <Skeleton width={200} height={20}/>
                        </h5>
                        <span className="b3 subtitle text-start">
                          <Skeleton width={250} height={15}/>
                          </span>
                        <ul className="rbt-meta mb--20 mt--10">
                          <li><i className="fa fa-star color-warning"></i><Skeleton width={40} height={15}/><span
                              className="rbt-badge-5 ml--5"> Rating</span></li>
                          <li><i className="feather-users"></i><Skeleton width={60} height={15}/></li>
                          <li><a href="#"><i className="feather-video"></i><Skeleton width={80} height={15}/></a></li>
                        </ul>
                      </div>
                      <div className="content">
                        <p className="description text-start">
                          <Skeleton count={3} width="100%" height={15}/>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </> : <>
                {checkMatchCourses &&

                    <Instructor checkMatchCourses={checkMatchCourses}/>
                }
              </>
            }
          </div>
          <div
              className="rbt-review-wrapper rbt-shadow-box review-wrapper mt--30"
              id="review"
          >
            <Review/>
          </div>

        </div>
      </div>

      <div className="col-lg-4">

        <div className="course-sidebar sticky-top rbt-shadow-box course-sidebar-top rbt-gradient-border">
          {
            isLoading ? <>
              <div className="inner">
                <a className="video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15 "
                   data-vbtype="video" href="javascript:void(0)">
                  <div className="video-content">
                    <Skeleton width={355} height={200}/>
                    <div className="position-to-top">
                      <span className="rbt-btn rounded-player-2 with-animation">
                        {/*<Skeleton circle width="30" height="30"/>*/}
                        <span className="play-icon"></span>
                      </span>
                    </div>
                  </div>
                </a>
                <div className="content-item-content">
                  <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
                    <div className="rbt-price">
                      <Skeleton width="100px" height="20px"/>
                    </div>
                    <div className="discount-time">
                      <Skeleton width="120px" height="15px"/>
                    </div>
                  </div>

                  <div className="add-to-card-button mt--15">
                    <a className="rbt-btn btn-gradient icon-hover w-100 d-block text-center" href="#">
                    <span className="btn-text">
                      <Skeleton width="120px" height="20px"/>
                    </span>
                      <span className="btn-icon">
                      <Skeleton circle width="20px" height="20px"/>
                    </span>
                    </a>
                  </div>

                  <div className="buy-now-btn mt--15">
                    <a className="rbt-btn btn-border icon-hover w-100 d-block text-center" href="#">
                    <span className="btn-text">
                      <Skeleton width="120px" height="20px"/>
                    </span>
                      <span className="btn-icon">
                      <Skeleton circle width="20px" height="20px"/>
                    </span>
                    </a>
                  </div>

                  <div className="rbt-widget-details has-show-more">
                    <ul className="has-show-more-inner-content rbt-course-details-list-wrapper mt--10">
                      <li className="d-flex align-items-center">
                        <span><Skeleton width="80px" height="20px"/></span>
                        <Skeleton width="40px" height="20px"/>
                      </li>
                      <li className="d-flex align-items-center">
                        <span><Skeleton width="120px" height="20px"/></span>
                        <Skeleton width="40px" height="20px"/>
                      </li>
                      <li className="d-flex align-items-center">
                        <span><Skeleton width="80px" height="20px"/></span>
                        <Skeleton width="40px" height="20px"/>
                      </li>
                      <li className="d-flex align-items-center">
                        <span><Skeleton width="140px" height="20px"/></span>
                        <Skeleton width="40px" height="20px"/>
                      </li>
                    </ul>
                    <div className="rbt-show-more-btn">
                      <Skeleton width="100px" height="30px"/>
                    </div>
                  </div>
                  <div className="social-share-wrapper mt--30 text-center">
                    <div className="rbt-post-share d-flex align-items-center justify-content-center">
                      <ul className="social-icon social-default transparent-with-border justify-content-around w-100">
                        <li>
                          <a href="javascript:void(0);">
                            <Skeleton width="20px" height="20px"/>
                          </a>
                          <span className="rbt-feature-value rbt-badge-5">
                          <Skeleton width="60px" height="15px"/>
                        </span>
                        </li>
                        <li>
                          <a href="javascript:void(0);">
                            <Skeleton width="20px" height="20px"/>
                          </a>
                          <span className="rbt-feature-value rbt-badge-5">
                          <Skeleton width="60px" height="15px"/>
                        </span>
                        </li>
                        <li>
                          <a href="javascript:void(0);">
                            <Skeleton width="20px" height="20px"/>
                          </a>
                          <span className="rbt-feature-value rbt-badge-5">
                          <Skeleton width="60px" height="15px"/>
                        </span>
                        </li>
                      </ul>
                    </div>
                    <hr className="mt--20"/>
                    <div className="contact-with-us text-center">
                      <p>
                        <Skeleton width="200px" height="15px"/>
                      </p>
                      <p className="rbt-badge-2 mt--10 justify-content-center w-100"></p>
                    </div>
                  </div>


                </div>

              </div>
            </> : <>
              <CornerRibbon
                  position="top-center"
                  fontColor="#f0f0f0"
                  backgroundColor="#637FEA"
                  containerStyle={{}}
                  style={{'border-bottom-right-radius': '6px'}}
                  className=""
              >
                {checkMatchCourses.sLevel}
              </CornerRibbon>
              <div className="inner">
                <Viedo checkMatchCourses={checkMatchCourses && checkMatchCourses}/>
              </div>
            </>
          }

        </div>
      </div>
    </>
  );
};

export default CourseDetailsOne;
