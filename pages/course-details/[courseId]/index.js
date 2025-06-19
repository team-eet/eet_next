import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
// import sal from "sal.js";
import CourseData from "../../../data/course-details/courseData.json";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import Context from "@/context/Context";

import MobileMenu from "@/components/Header/MobileMenu";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import Cart from "@/components/Header/Offcanvas/Cart";
import BackToTop from "@/pages/backToTop";
// import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import CourseHead from "@/components/Course-Details/Course-Sections/course-head";
import CourseDetailsOne from "@/components/Course-Details/CourseDetails-One";
import PageHead from "@/pages/Head";
import SimilarCourses from "@/components/Course-Details/Course-Sections/SimilarCourses";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../../constants/constant";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import 'react-loading-skeleton/dist/skeleton.css'
import FooterThree from "@/components/Footer/Footer-Three";

const SingleCourse = () => {
    const router = useRouter();
  // const postId = parseInt(router.query.courseId);
    const [getcourseData, setcourseData] = useState([])
    const[getsectionItems, setsectionItems] = useState([])
    const [Tag, setTag] = useState(false)
    const [courseTag, setCourseTag] = useState([])
    const REACT_APP = API_URL
    const [isLoading, setisLoading] = useState(true)
    const [getvideoOpenModal,setvideoOpenModal] = useState('')
    const courseIds = router.asPath.split("/").pop();


    // let getCourse;

  const getCourse = (courseId) => {
    // const url = window.location.href
    // const parts = url.split("/");
    // const courseId = parts[parts.length - 1];
    // console.log("Course Id",DecryptData(courseId))
      setcourseData([])
    Axios.get(`${API_URL}/api/coursemain/GetCoursesView/${courseId}/0`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
            console.log("Course Details",res.data , "ID" , courseId)
          if (res.data) {
            // console.log(res.data)
            if (res.data.length !== 0) {
                console.log("Course Detils New", res.data)
                console.log("Course Detils New Path", res.data[0].sVideoURL,res.data[0].sVideoPath)
                if (res.data[0].sVideoURL !== ""){
                    setvideoOpenModal(res.data[0].sVideoURL)
                }else if(res.data[0].sVideoPath !== ""){
                    setvideoOpenModal(res.data[0].sVideoPath)
                }else{
                    setvideoOpenModal('')
                }
                  setcourseData(res.data)
                    setisLoading(false)
                // console.log(EncryptData(res.data[0]['nCTId']))
                if(res.data[0]['nCTId'] !== null){
                    Axios.get(`${API_URL}/api/CourseTag/GetCourseTag/${EncryptData(res.data[0]['nCTId'])}`, {
                        headers: {
                            ApiKey: `${API_KEY}`
                        }
                    })
                        .then(res => {
                            if (res.data) {
                                // console.log(res.data)
                                setCourseTag(res.data)
                                setTag(true)
                                setisLoading(false)
                            }
                        })
                        .catch(err => {
                            console.log("Error Data",err)
                            { ErrorDefaultAlert(err) }
                        })
                }


              }
            }
        })
        .catch(err => {
            console.log("Error Data",err)
          { ErrorDefaultAlert(err) }
        })
  }

  // getCourse = JSON.parse(JSON.stringify(CourseData.courseDetails));

  const checkMatch = getcourseData.length !== 0 ? getcourseData[0] : ''
  // console.log(checkMatch)
  // console.log(EncryptData(postId), EncryptData(0))


  const courseContentMatch = getsectionItems.length !== 0 ? getsectionItems : ''

    useEffect(() => {
        const modal = document.getElementById("videoOpenModal");

        const handleClose = () => {
            const iframe = modal.querySelector("iframe");
            if (iframe) {
                const src = iframe.src;
                iframe.src = "";
                iframe.src = src;
            }

            const video = modal.querySelector("video");
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        };

        const handleOpen = () => {
            const video = modal.querySelector("video");
            if (video) {
                video.currentTime = 0;
                video.play(); // ✅ play on open
            }
        };

        if (modal) {
            modal.addEventListener("hidden.bs.modal", handleClose);
            modal.addEventListener("shown.bs.modal", handleOpen);
        }

        return () => {
            if (modal) {
                modal.removeEventListener("hidden.bs.modal", handleClose);
                modal.removeEventListener("shown.bs.modal", handleOpen);
            }
        };
    }, []);

  useEffect(() => {
      if (courseIds && courseIds !== "[courseId]") {
          getCourse(courseIds);
      }

      // console.log(getcourseData)
    //
  }, [router.asPath]);

  return (
    <>
      <PageHead title="Course Details - EET English" />
      <Provider store={Store}>
          <Context>
              <MobileMenu/>
              <HeaderStyleTen headerSticky="" headerType={true}/>
              <Cart/>

              <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
                  <CourseHead CourseTag={Tag} Tag={courseTag} checkMatch={checkMatch !== undefined ? checkMatch : ""}/>
              </div>

              <div className="rbt-course-details-area ptb--60">
                  <div className="container">
                      <div className="row g-5">
                          <CourseDetailsOne checkMatchCourses={checkMatch !== undefined ? checkMatch : ""}/>
                      </div>
                  </div>
              </div>

              {/*<CourseActionBottom*/}
              {/*  checkMatchCourses={checkMatch !== undefined ? checkMatch : ""}*/}
              {/*/>*/}

              {/*<div className="rbt-related-course-area bg-color-white pt--60 rbt-section-gapBottom">*/}
                  <SimilarCourses
                      checkMatchCourses={
                          checkMatch !== undefined ? checkMatch.nCCId : ""
                      }
                  />
              {/*</div>*/}
              {/* Video Using Modal Open */}
              <div className="modal fade" id="videoOpenModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                   aria-hidden="true">
                  <div className="modal-dialog modal-fullscreen">
                      <div className="modal-content">
                          <div className="modal-header d-flex justify-content-between">
                              <h1 className="modal-title fs-3" id="exampleModalToggleLabel">{checkMatch.sCourseTitle}</h1>
                              {/*<button type="button" className="btn-close" data-bs-dismiss="modal"*/}
                              {/*        aria-label="Close"></button>*/}
                              <i className="feather-x" data-bs-dismiss="modal"
                                 aria-label="Close"></i>
                          </div>
                          <div className="modal-body text-center">
                          {typeof getvideoOpenModal === "string" && getvideoOpenModal.trim() !== "" ? (
                                  getvideoOpenModal.includes("youtube.com") || getvideoOpenModal.includes("youtu.be") ? (
                                      <iframe
                                          width="100%"
                                          height="100%"
                                          style={{minHeight: "90vh"}}
                                          src={getvideoOpenModal}
                                          title="YouTube video player"
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen>
                                      </iframe>
                                  ) : (
                                      <video width="100%" height="100%" style={{minHeight: "90vh"}} controls controlsList="nodownload noplaybackrate"  disablePictureInPicture>
                                          <source src={getvideoOpenModal} type="video/mp4"/>
                                          Your browser does not support the video tag.
                                      </video>
                                  )
                              ) : null}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Close Video Using Modal Open */}

              <BackToTop/>

              {/*<FooterOne/>*/}
              <FooterThree/>
          </Context>
      </Provider>
    </>
  );
};

export default SingleCourse;
