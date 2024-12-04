import Link from "next/link";
import Courses from "../../data/dashboard/instructor/instructor.json";
import CourseWidgets from "../Instructor/Dashboard-Section/widgets/CourseWidget";
import BatchWidget from "@/components/Instructor/Dashboard-Section/widgets/BatchWidget";
import Axios from "axios";
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

const EnrolledCourses = () => {
  const REACT_APP = API_URL
  const [getCourse, setcourse] = useState([]);
  const [getBatch, setBatch] = useState([]);
  useEffect(() => {
    getPurchasedCourse()
    getPurchasedBatch()
  }, [])
  const getPurchasedCourse = () => {
    if (localStorage.getItem('userData')) {
      const udata = JSON.parse(localStorage.getItem('userData')).regid
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
            } else {

            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
  }

  const getPurchasedBatch = () => {
    if (localStorage.getItem('userData')) {
      const udata = JSON.parse(localStorage.getItem('userData')).regid
      // console.log('api called')
      Axios.get(`${API_URL}/api/purchasedCourse/GetPurchasedBatch/${udata}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            // console.log('api called 2')
            if (res.data) {
              // console.log('My Learning', res.data)
              setBatch(res.data)
            } else {

            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
  }
  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Enrolled</h4>
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
                  <span className="title">Courses</span>
                </Link>
              </li>
              <li role="presentation">
                <Link
                    href="#"
                    className="tab-button"
                    id="batch-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#batch"
                    role="tab"
                    aria-controls="batch"
                    aria-selected="false"
                >
                  <span className="title">Batches</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            <div
                className="tab-pane fade active show"
                id="course"
                role="tabpanel"
                aria-labelledby="course-tab"
            >
              <div className="row g-5">
                {getCourse.length !== 0 ? <>
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
                </> : <>
                  <p className={'text-center'}> No Enrolled Courses!</p>
                </>}

              </div>

            </div>

            <div
                className="tab-pane fade"
                id="batch"
                role="tabpanel"
                aria-labelledby="batch-tab"
            >
              <div className="row g-5">
                {getBatch.length !== 0 ? <>
                  {getBatch.map((slide, index) => (
                      <div
                          className="col-lg-4 col-md-6 col-12"
                          key={`course-enrolled-${index}`}
                      >
                        <BatchWidget
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
                </> : <>
                  <p className={'text-center'}> No Enrolled Batches!</p>
                </>}

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default EnrolledCourses;
