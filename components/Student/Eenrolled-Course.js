import Link from "next/link";
import Courses from "../../data/dashboard/instructor/instructor.json";
import CourseWidgets from "../Instructor/Dashboard-Section/widgets/CourseWidget";
import BatchWidget from "@/components/Instructor/Dashboard-Section/widgets/BatchWidget";
import Axios from "axios";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import {API_URL, API_KEY} from '../../constants/constant'
import React, {useEffect, useState} from "react";

import {Form, Formik} from "formik";
import {
  ErrorDefaultAlert,
  InfoDefaultAlert,
  SuccessAlert,
  SuccessRedirectAlert
} from "@/components/Services/SweetAlert";
import DatePicker from "react-datepicker";
import {FormGroup, Label} from "reactstrap";
import Skeleton from "react-loading-skeleton";

const EnrolledCourses = () => {
  const [crscnt, setcrscnt] = useState('')
  const [getCompetedCnt, setCompetedCnt] = useState('')
  const [getActiveCnt, setActiveCnt] = useState('')
  const REACT_APP = API_URL
  const [getCourse, setcourse] = useState([]);
  const [getActiveCourse, setactivecourse] = useState([]);
  const [getCompleteCourse, setcompletecourse] = useState([]);
  const [getBatch, setBatch] = useState([]);
  const [getApiCall, setApiCall] = useState(0)
  useEffect(() => {
    getPurchasedCourse()
    // getPurchasedBatch()
  }, [])
  const getPurchasedCourse = () => {
    if (localStorage.getItem('userData')) {
      const udata = DecryptData(localStorage.getItem('userData')).regid
      // console.log('api called')
      Axios.get(`${API_URL}/api/purchasedCourse/GetPurchasedCourse/${udata}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            console.log('api called 2')
            if (res.data) {
              console.log('My Learning', res.data)
              setcourse(res.data)

              setcrscnt(res.data.length)
              const count = res.data.filter(item => item.bCompleted === true).length;
              setActiveCnt(res.data.length - count)
              setCompetedCnt(count)

              const activeCourse = res.data.filter(item => item.bCompleted === false);
              setactivecourse(activeCourse)

              const complatedCourse = res.data.filter(item => item.bCompleted === true);
              setcompletecourse(complatedCourse)
              setApiCall(1)

            } else {
              setApiCall(1)
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
  }

  // const getPurchasedBatch = () => {
  //   if (localStorage.getItem('userData')) {
  //     const udata = DecryptData(localStorage.getItem('userData')).regid
  //     // console.log('api called')
  //     Axios.get(`${API_URL}/api/purchasedCourse/GetPurchasedBatch/${udata}`, {
  //       headers: {
  //         ApiKey: `${API_KEY}`
  //       }
  //     })
  //         .then(res => {
  //           // console.log('api called 2')
  //           if (res.data) {
  //             // console.log('My Learning', res.data)
  //             setBatch(res.data)
  //           } else {
  //
  //           }
  //         })
  //         .catch(err => {
  //           { ErrorDefaultAlert(err) }
  //         })
  //   }
  // }
  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Enrolled Courses</h4>
          </div>


          <div className="advance-tab-button mb--30">
            <ul
                className="nav nav-tabs tab-button-style-2 justify-content-start"
                id="settinsTab-4"
                role="tablist"
            >
              <li role="presentation">
                <Link
                    href="#"
                    className="tab-button active"
                    id="course-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#course"
                    role="tab"
                    aria-controls="course"
                    aria-selected="true"
                >
                  <span className="title">Enrolled <div className="badge bg-primary-opacity">{crscnt}</div></span>
                </Link>
              </li>
              <li role="presentation">
                <Link
                    href="#"
                    className="tab-button"
                    id="course-active-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#course-active"
                    role="tab"
                    aria-controls="course-active"
                    aria-selected="false"
                >
                  <span className="title">Active <div className="badge bg-primary-opacity">{getActiveCnt}</div></span>
                </Link>
              </li>
              <li role="presentation">
                <Link
                    href="#"
                    className="tab-button"
                    id="course-completed-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#course-completed"
                    role="tab"
                    aria-controls="course-completed"
                    aria-selected="false"
                >
                  <span className="title">Completed <div className="badge bg-primary-opacity">{getCompetedCnt}</div></span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            {/* Courses Tab */}
            <div
                className="tab-pane fade active show"
                id="course"
                role="tabpanel"
                aria-labelledby="course-tab"
            >
              <div className="row g-5">
                {
                  getApiCall === 1 ?
                      getCourse.length !== 0 ? (
                          <>
                            {getCourse.map((slide, index) => (
                                <div
                                    className="col-lg-4 col-md-6 col-12"
                                    key={`course-enrolled-${index}`}
                                >
                                  <CourseWidgets
                                      data={slide}
                                      courseStyle="two"
                                      isProgress={true}
                                      isCompleted={false}
                                      isEdit={false}
                                      showDescription={false}
                                      showAuthor={false}
                                  />
                                </div>
                            ))}
                          </>
                      ) : (
                          <p className={'text-center'}>No Enrolled Courses!</p>
                      ) :
                      Array.from({length:3}).map((_,index) => (
                          <div
                              className="col-lg-4 col-md-6 col-12"
                          >

                            <div className="rbt-card variation-01 rbt-hover">
                              <div className="rbt-card-img">
                                <Skeleton height={200}/>
                              </div>

                              <div className="rbt-card-body">
                                <div className="rbt-card-top d-flex justify-content-between align-items-center">
                                  <div className="rbt-review">
                                    <Skeleton width={80} height={20}/>
                                  </div>
                                </div>

                                <h4 className="rbt-card-title mt-2">
                                  <Skeleton width={`80%`} height={24}/>
                                </h4>

                                <ul className="rbt-meta d-flex gap-3 mt-2">
                                  <li><Skeleton width={80} height={16}/></li>
                                  <li><Skeleton width={80} height={16}/></li>
                                </ul>

                                <div className="rbt-progress-style-1 mb--20 mt--10">
                                  <div className="single-progress">
                                    <h6 className="rbt-title-style-2 mb--10">
                                      <Skeleton width={100} height={16}/>
                                    </h6>
                                    <div className="progress">
                                      <Skeleton height={10} width={`100%`}/>
                                    </div>
                                  </div>
                                </div>

                                <div className="">
                                  <Skeleton height='45px' width={`100%`}/>
                                </div>
                              </div>
                            </div>
                          </div>
                      ))

                }

              </div>
            </div>

            {/* Active Tab */}
            <div
                className="tab-pane fade"
                id="course-active"
                role="tabpanel"
                aria-labelledby="course-active-tab"
            >
              <div className="row g-5">
                {getActiveCourse.length !== 0 ? (
                    <>
                      {getActiveCourse.map((slide, index) => (
                          <div
                              className="col-lg-4 col-md-6 col-12"
                              key={`course-enrolled-${index}`}
                          >
                            <CourseWidgets
                                data={slide}
                                courseStyle="two"
                                isProgress={true}
                                isCompleted={false}
                                isEdit={false}
                                showDescription={false}
                                showAuthor={false}
                            />
                          </div>
                      ))}
                    </>
                ) : (
                    <p className={'text-center'}>No Active Courses!</p>
                )}
              </div>
            </div>

            {/* Completed Tab */}
            <div
                className="tab-pane fade"
                id="course-completed"
                role="tabpanel"
                aria-labelledby="course-completed-tab"
            >
              <div className="row g-5">
                <div className="row g-5">
                  {getCompleteCourse.length !== 0 ? (
                      <>
                        {getCompleteCourse.map((slide, index) => (
                            <div
                                className="col-lg-4 col-md-6 col-12"
                                key={`course-enrolled-${index}`}
                            >
                              <CourseWidgets
                                  data={slide}
                                  courseStyle="two"
                                  isProgress={true}
                                  isCompleted={false}
                                  isEdit={false}
                                  showDescription={false}
                                  showAuthor={false}
                              />
                            </div>
                        ))}
                      </>
                  ) : (
                      <p className={'text-center'}>No Completed Courses!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EnrolledCourses;
