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
import CourseHead from "@/components/Course-Details-Module/Course-Sections/course-head";
import PageHead from "@/pages/Head";
import CourseActionBottom from "@/components/Course-Details-Module/Course-Sections/Course-Action-Bottom";
import SimilarCourses from "@/components/Course-Details-Module/Course-Sections/SimilarCourses";
import CourseDetailsTwo from "@/components/Course-Details-Module/CourseDetails-Two";
import {API_URL, API_KEY} from "../../../constants/constant";
import Axios from "axios";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";

const SingleCourseTwo = () => {
  const router = useRouter();
  const postId = parseInt(router.query.courseId);
  const [getcourseData, setcourseData] = useState([])
  const[getsectionItems, setsectionItems] = useState([])
  const REACT_APP = API_URL
  const getCourse = () => {
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1];
    console.log(courseId)
    Axios.get(`${API_URL}/api/coursemain/GetCoursesView/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            console.log('response', res.data)
            if (res.data.length !== 0) {
              setcourseData(res.data)
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }
  // getCourse = JSON.parse(JSON.stringify(CourseData.courseDetails));

  const checkMatch = getcourseData.length !== 0 ? getcourseData[0] : ''

  useEffect(() => {
    getCourse()
    // if (postId && checkMatch === undefined) {
    //   router.push("/course-card-2");
    // }

  }, []);

  return (
    <>
      <PageHead title="Course Details Module" />
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <HeaderStyleTen headerSticky="" headerType={true} />
          <Cart />

          <div className="rbt-page-banner-wrapper">
            <div className="rbt-banner-image"></div>
            <div className="rbt-banner-content">
              <div className="rbt-banner-content-top rbt-breadcrumb-style-3">
                <CourseHead
                  checkMatch={checkMatch !== undefined ? checkMatch : ""}
                />
              </div>
            </div>
          </div>

          <div className="rbt-section-overlayping-top rbt-section-gapBottom">
            <div className="inner">
              <div className="container">
                <CourseDetailsTwo
                  checkMatchCourses={checkMatch !== undefined ? checkMatch : ""}
                />
              </div>
            </div>
          </div>

          <CourseActionBottom
            checkMatchCourses={checkMatch !== undefined ? checkMatch : ""}
          />

          <div className="rbt-related-course-area bg-color-white pt--60 rbt-section-gapBottom">
            <SimilarCourses
              checkMatchCourses={
                checkMatch !== undefined ? checkMatch : ""
              }
            />
          </div>

          <BackToTop />
          {/*<Separator />*/}
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default SingleCourseTwo;
