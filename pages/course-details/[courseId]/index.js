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

const SingleCourse = () => {
    const router = useRouter();
  // const postId = parseInt(router.query.courseId);
    const [getcourseData, setcourseData] = useState([])
    const[getsectionItems, setsectionItems] = useState([])
    const [Tag, setTag] = useState(false)
    const [courseTag, setCourseTag] = useState([])
    const REACT_APP = API_URL
    const [isLoading, setisLoading] = useState(true)



    // let getCourse;

  const getCourse = () => {
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1];
    console.log("Course Id",DecryptData(courseId))
    Axios.get(`${API_URL}/api/coursemain/GetCoursesView/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
            console.log("Course Details",res.data)
          if (res.data) {
            // console.log(res.data)
            if (res.data.length !== 0) {
                console.log("Course Detils New", res.data)
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
                            { ErrorDefaultAlert(err) }
                        })
                }


              }
            }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  // getCourse = JSON.parse(JSON.stringify(CourseData.courseDetails));

  const checkMatch = getcourseData.length !== 0 ? getcourseData[0] : ''
  // console.log(checkMatch)
  // console.log(EncryptData(postId), EncryptData(0))


  const courseContentMatch = getsectionItems.length !== 0 ? getsectionItems : ''


  useEffect(() => {
      getCourse();
      // console.log(getcourseData)
    //
  }, []);

  return (
    <>
      <PageHead title="Course Details - Online Courses & Education NEXTJS14 Template" />
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <HeaderStyleTen headerSticky="" headerType={true} />
          <Cart />

          <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
              <CourseHead CourseTag={Tag} Tag={courseTag} checkMatch={checkMatch !== undefined ? checkMatch : ""} />
          </div>

          <div className="rbt-course-details-area ptb--60">
            <div className="container">
              <div className="row g-5">
                <CourseDetailsOne checkMatchCourses={checkMatch !== undefined ? checkMatch : ""} />
              </div>
            </div>
          </div>

          {/*<CourseActionBottom*/}
          {/*  checkMatchCourses={checkMatch !== undefined ? checkMatch : ""}*/}
          {/*/>*/}

          <div className="rbt-related-course-area bg-color-white pt--60 rbt-section-gapBottom">
            <SimilarCourses
              checkMatchCourses={
                checkMatch !== undefined ? checkMatch.nCCId : ""
              }
            />
          </div>

          <BackToTop />

          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default SingleCourse;
