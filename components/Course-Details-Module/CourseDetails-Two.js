import Image from "next/image";
import Link from "next/link";
import {useEffect, useState, useRef} from "react";

import "venobox/dist/venobox.min.css";
import Viedo from "./Course-Sections/Viedo";
import CourseMenu from "./Course-Sections/Course-Menu";
import Overview from "./Course-Sections/Overview";
import Requirements from "./Course-Sections/Requirements";
import Instructor from "./Course-Sections/Instructor";
import Review from "./Course-Sections/Review";
import Featured from "./Course-Sections/Featured";
import RelatedCourse from "./Course-Sections/RelatedCourse";
import Content from "./Course-Sections/Content";

import VideoImg from "../../public/images/others/video-07.jpg";
import ModuleCarousel from "@/components/Events/ModuleCarousel";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import Axios from "axios";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../constants/constant";

const CourseDetailsTwo = ({ checkMatchCourses }) => {
  console.log(checkMatchCourses)
  const REACT_APP = API_URL
  const contentRef = useRef(null);
  const [getModule, setModule] = useState([])
  const [getDefaultModule, setDefaultModule] = useState([])
  const [getSectionItems, setSectionItems] = useState([])
  const [getTitle, setTitle] = useState('')

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const getCourseModule = () => {
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1];
    console.log(courseId)
    Axios.get(`${API_URL}/api/courseModule/GetModule/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            console.log('res.data', res.data)
            setModule(res.data)
            setTitle(res.data[0]['sModuleTitle'])
            setDefaultModule(res.data)
            // console.log(res.data[0]['nMId'])
            Axios.get(`${API_URL}/api/section/GetCourseSummaryAll/${courseId}/${EncryptData(res.data[0]['nMId'])}`, {
              headers: {
                ApiKey: `${API_KEY}`
              }
            })
                .then(res => {
                  console.log('section items1', res.data)
                  if (res.data.length !== 0) {
                    setSectionItems(res.data)
                  } else {

                  }
                })
                .catch(err => {
                  { ErrorDefaultAlert(err) }
                })
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  const getMID = (mid, title) => {
    // console.log(mid)
    setTitle(title)
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // window.addEventListener("scroll", handleScroll);
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1];
    // console.log(EncryptData(courseId), courseId)
    console.log(EncryptData(mid), mid)
    Axios.get(`${API_URL}/api/section/GetCourseSummaryAll/${courseId}/${EncryptData(mid)}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          console.log('section items 2', res.data)
          if (res.data.length !== 0) {
            setSectionItems(res.data)
          } else {

          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }
  const [currentSection, setCurrentSection] = useState("overview");

  useEffect(() => {
    import("venobox/dist/venobox.min.js").then((venobox) => {
      new venobox.default({
        selector: ".popup-video",
      });
    });
    getCourseModule()
  }, []);

  return (
  <>
    <div className="col-lg-12">

      {/*{checkMatchCourses.courseImg && (*/}
      {/*<ModuleCarousel Cid={checkMatchCourses.nCId} />*/}
      <Swiper
          className="swiper event-activation-1 rbt-arrow-between rbt-dot-bottom-center pb--60 icon-bg-primary"
          slidesPerView={1}
          spaceBetween={30}
          modules={[Navigation, Pagination]}
          pagination={{
            el: ".rbt-swiper-pagination",
            clickable: true,
          }}
          navigation={{
            nextEl: ".rbt-arrow-left",
            prevEl: ".rbt-arrow-right",
          }}
          breakpoints={{
            481: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            },
          }}
      >
        {getModule.map((data, index) => (
            <SwiperSlide className="swiper-wrapper" key={index}>
              <div className="swiper-slide">
                <div className="single-slide" style= {{ cursor : 'pointer' }} onClick={() => getMID(data.nMId, data.sModuleTitle)}>
                  <div className="rbt-card event-grid-card variation-01 rbt-hover">
                    <div className="rbt-card-img">
                      {/*<Link href={`/event-details/${data.id}`}>*/}
                      <img src={data.sImagePath} width={710}
                           height={480}></img>

                    </div>
                    <div className="rbt-card-body">
                      <ul className="rbt-meta">
                        <li>
                          <i className="fa fa-book"></i> {data.section_cnt} Sections
                        </li>
                        <li>
                          <i className="fa fa-list"></i> {data.lesson_cnt} Lessons
                        </li>
                      </ul>
                      <h4 className="rbt-card-title">
                        {/*<Link href={`/event-details/${data.id}`}>*/}
                        {data.sModuleTitle}
                        {/*</Link>*/}
                      </h4>

                      <div className="read-more-btn">
                        <div
                            className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round"
                            onClick={scrollToContent}
                            style={{ cursor: 'pointer' }}
                            // href={`/event-details/${data.id}`}
                        >
                        <span className="icon-reverse-wrapper">
                          <span className="btn-text">View More</span>
                          <span className="btn-icon">
                            <i className="feather-arrow-right"></i>
                          </span>
                          <span className="btn-icon">
                            <i className="feather-arrow-right"></i>
                          </span>
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
        ))}

        <div className="rbt-swiper-arrow rbt-arrow-left">
          <div className="custom-overfolow">
            <i className="rbt-icon feather-arrow-left"></i>
            <i className="rbt-icon-top feather-arrow-left"></i>
          </div>
        </div>

        <div className="rbt-swiper-arrow rbt-arrow-right">
          <div className="custom-overfolow">
            <i className="rbt-icon feather-arrow-right"></i>
            <i className="rbt-icon-top feather-arrow-right"></i>
          </div>
        </div>

        <div className="rbt-swiper-pagination" style={{bottom: "0"}}></div>
      </Swiper>
      {/*)}*/}
    </div>

    <div className="row row--30 gy-5 pt--60">
      <div className="col-lg-4">
        <div className="course-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
          <div className="inner">
            <div className="content-item-content">
              <Viedo checkMatchCourses={checkMatchCourses && checkMatchCourses}/>
            </div>
          </div>
        </div>
      </div>
    
    
      <div className="col-lg-8">
    
        <div className="m-3 mb-0 mt-5" id={'Title'} ref={contentRef}>
          <h4 className={'m-0'}>
            {getTitle ? getTitle : getDefaultModule['sModuleTitle']}
    
          </h4>
        </div>
        <div className="course-details-content">
          <div className="rbt-inner-onepage-navigation sticky-top mt--30">
            <CourseMenu/>
          </div>


          <div
              className="course-content rbt-shadow-box coursecontent-wrapper mt--30"
              id="coursecontent"
          >
            {/*{checkMatchCourses &&*/}
            {/*  checkMatchCourses.courseContent.map((data, index) => (*/}
            <Content checkMatchCourses={getSectionItems}  />
            {/*  ))}*/}
          </div>


          <div id={"overview"}>
            {checkMatchCourses &&
            checkMatchCourses.sFullDesc ?
                <Overview checkMatchCourses={checkMatchCourses.sFullDesc}/> : ''
            }
          </div>

          <div
              className="rbt-course-feature-box rbt-shadow-box details-wrapper mt--30"
              id="details"
          >

            <div className="row g-5">
              {checkMatchCourses.sPrerequisite &&
                  <Requirements
                      checkMatchCourses={checkMatchCourses.sPrerequisite}
                  />
              }
            </div>
          </div>
          <div
              className="rbt-instructor rbt-shadow-box intructor-wrapper mt--30"
              id="intructor"
          >
            {checkMatchCourses &&

                <Instructor checkMatchCourses={checkMatchCourses}/>
            }
          </div>
          <div className="rbt-review-wrapper rbt-shadow-box review-wrapper mt--30" id="review">
            <Review/>
          </div>

          {/*{checkMatchCourses &&*/}
          {/*  checkMatchCourses.featuredReview.map((data, index) => (*/}
          {/*    <Featured {...data} key={index} coursesFeatured={data} />*/}
          {/*  ))}*/}
        </div>
        <div className="related-course mt--60">
          {/*{checkMatchCourses &&*/}
          {/*  checkMatchCourses.relatedCourse.map((data, index) => (*/}
          {/*    <RelatedCourse {...data} key={index} checkMatchCourses={data} />*/}
          {/*  ))}*/}
        </div>
      </div>
    </div>
  </>
  );
};

export default CourseDetailsTwo;
