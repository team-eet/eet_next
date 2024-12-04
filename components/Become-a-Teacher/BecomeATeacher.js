import Link from "next/link";
import {useRouter} from "next/router";
import Teacher from "../../data/pages/become-A-Teacher.json";
import InstructorRegistration from "./InstructorRegis";
import dynamic from "next/dynamic";
import { useState } from 'react'
import Axios from "axios";
const Odometer = dynamic(() => import("react-odometerjs"), {
    ssr: false,
    loading: () => <span>00</span>,
});
import React, {useEffect} from "react";
import Image from "next/image";
import useFetch from "@/context/useFetch";
import CounterData from "@/data/elements/counter.json";
import {API_URL, API_KEY} from "../../constants/constant";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


const MySwal = withReactContent(Swal)

const BecomeATeacher = () => {
    const router = useRouter()
    const [regId, setregId] = useState('')
    const { values } = useFetch(CounterData, "counterTwo");
    const REACT_APP = API_URL
    const [tutorData, settutorData] = useState([])
    const [courseData, setcourseData] = useState([])
    const userendpoint = 'users#all#-#-'
    // console.log(window.btoa(enpoint))
    const getTutorData = () => {
        Axios.get(`${API_URL}/api/Dashboard/DashboardData/${window.btoa(userendpoint)}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                settutorData(res.data)
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const getCourseData = () => {
        const coursesendpoint = 'courses#all#-#-'
        // console.log(window.btoa(enpoint))
        Axios.get(`${API_URL}/api/Dashboard/DashboardData/${window.btoa(coursesendpoint)}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                setcourseData(res.data)
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }
    const [showContinue, setshowContinue] = useState(false)
    const [Review, setReview] = useState('')

    useEffect(() => {
        getTutorData()
        getCourseData()
        if(localStorage.getItem('userData')) {
            Axios.get(`${API_URL}/api/TutorBasics/GetTutorProfile/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    // console.log(res.data)
                    // if(res.data.)
                    if(res.data.lenth !== 0){
                        if(res.data[0].cnt !== 0) {
                            setshowContinue(true)
                            setReview(res.data[0].review)
                        } else {
                            setshowContinue(false)
                        }
                    }

                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
        }

    }, []);

    const OnContinue = () => {
        if (Review === true){
            router.push('/become-a-tutor/Review')
        }
        else{
            router.push('/become-a-tutor/basics')
        }
    }

    const OnApplyNow = () => {
        if (localStorage.getItem('userData')){
            router.push('/become-a-tutor/basics')
        }
        else{
            return MySwal.fire({
                title: "Info",
                text: "Login to become a tutor",
                icon: 'info',
                customClass: {
                    confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false
            }).then(function (result) {
                router.push('/login')
                // (retData.rlink === '1') ? window.location.reload() : (window.location.href = retData.rlink)
            })

        }
    }

    return (
      <>
          {CounterData &&
              CounterData.counterTwo.map((data, index) => (
                  <div className="container" key={index}>
                      <div className="row g-5 align-items-center">
                          <div className="col-lg-6 order-2 order-lg-1">
                              <div className="row row--30">
                                  {/*{data.body.map((item, innerIndex) => (*/}
                                  <div
                                      className={`col-lg-6 col-md-6 col-sm-6 col-12`}
                                  >
                                      <div className="rbt-counterup rbt-hover-03">
                                          <div className="inner">
                                              <div className="icon">
                                                  <img
                                                      src={"/images/icons/counter-01.png"}
                                                      width={100}
                                                      height={100}
                                                      alt="Icons Images"
                                                  />
                                              </div>
                                              <div className="content">
                                                  {tutorData.map((item, index) => {
                                                      return (
                                                          <div key={index}>
                                                              <h4 className={'m-0'}>{item.tutor_count}</h4>
                                                          </div>
                                                      )
                                                  })}
                                                  <span className="subtitle">Tutor Count</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className={`col-lg-6 col-md-6 col-sm-6 col-12 mt--60`}>
                                      <div className="rbt-counterup rbt-hover-03">
                                          <div className="inner">
                                              <div className="icon">
                                                  <img
                                                      src={"/images/icons/counter-01.png"}
                                                      width={100}
                                                      height={100}
                                                      alt="Icons Images"
                                                  />
                                              </div>
                                              <div className="content">
                                                  {tutorData.map((item, index) => {
                                                      return (
                                                          <div key={index}>
                                                              <h4 className={'m-0'}>{(item.tutor_batch_students) + 0}</h4>
                                                          </div>
                                                      )
                                                  })}
                                                  <span className="subtitle">Tutor Student Count</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className={`col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--40`}
                                  >
                                      <div className="rbt-counterup rbt-hover-03">
                                          <div className="inner">
                                              <div className="icon">
                                                  <img
                                                      src={"/images/icons/counter-01.png"}
                                                      width={100}
                                                      height={100}
                                                      alt="Icons Images"
                                                  />
                                              </div>
                                              <div className="content">
                                                  {courseData.map((item, index) => {
                                                      return (
                                                          <div key={index}>
                                                             <h4 className={'m-0'}>{item.tutor_courses}</h4>
                                                          </div>
                                                      )
                                                  })}
                                                  <span className="subtitle">Tutor Course Count</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div className={`col-lg-6 col-md-6 col-sm-6 col-12 mt--60`}
                                  >
                                      <div className="rbt-counterup rbt-hover-03">
                                          <div className="inner">
                                              <div className="icon">
                                                  <img
                                                      src={"/images/icons/counter-01.png"}
                                                      width={100}
                                                      height={100}
                                                      alt="Icons Images"
                                                  />
                                              </div>
                                              <div className="content">
                                                  {tutorData.map((item) => {
                                                      return (
                                                          <div key={index}>
                                                              <h4 className={'m-0'}>{item.tutor_batch_students}</h4>
                                                          </div>
                                                      )
                                                  })}
                                                  <span className="subtitle">Tutor Batch Count</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  {/*))}*/}
                              </div>
                          </div>
                          <div className="col-lg-6 order-1 order-lg-2">
                              <div className="inner pl--50 pl_sm--0 pl_md--0">
                                  <div className="section-title text-start">
                                      {/*<span className="subtitle bg-pink-opacity">{data.tag}</span>*/}
                                      <h2 className="title">
                                          {data.title} <br/> {data.subTitle}
                                      </h2>
                                      <p className="description has-medium-font-size mt--20 mb--0">
                                          {data.desc}
                                      </p>
                                  </div>

                                  <div className="rbt-feature-wrapper mt--30">
                                      {data.children.map((item, innerIndex) => (
                                          <div
                                              className="rbt-feature feature-style-1 align-items-center"
                                              key={innerIndex}
                                          >
                                              <div
                                                  className={`icon ${
                                                      item.primary
                                                          ? "bg-primary-opacity"
                                                          : "" || item.secondary
                                                              ? "bg-secondary-opacity"
                                                              : "" || item.pink
                                                                  ? "bg-pink-opacity"
                                                                  : ""
                                                  }`}
                                              >
                                                  <i className={item.icon}></i>
                                              </div>
                                              <div className="feature-content">
                                                  <h6 className="feature-title">{item.title}</h6>
                                                  <p className="feature-description">{item.info}</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                  {showContinue ? <>
                                      <div className="read-more-btn mt--40">
                                          <button className="rbt-moderbt-btn bg-transparent border-0" onClick={OnContinue}>
                                              <span className="moderbt-btn-text">Continue</span>
                                              <i className="feather-arrow-right"></i>
                                          </button>
                                      </div>
                                  </> : <>
                                      <div className="read-more-btn mt--40">
                                          <button className="rbt-moderbt-btn bg-transparent border-0"
                                                  onClick={OnApplyNow}>
                                              <span className="moderbt-btn-text">Apply Now</span>
                                              <i className="feather-arrow-right"></i>
                                          </button>
                                          {/*<Link className="rbt-moderbt-btn" href="/become-a-tutor/basics">*/}
                                          {/*<span className="moderbt-btn-text">Apply Now</span>*/}
                                          {/*    <i className="feather-arrow-right"></i>*/}
                                          {/*</Link>*/}
                                      </div>
                                  </>}
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
      </>
    );
};

export default BecomeATeacher;
