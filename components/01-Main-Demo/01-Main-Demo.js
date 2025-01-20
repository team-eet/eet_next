import { useEffect, useState } from "react";
import Link from "next/link";
import sal from "sal.js";
import CategoryOne from "../Category/CategoryOne";
import MainDemoBanner from "./MainDemoBanner";
import Card from "../Cards/Card";
import AboutTwo from "../Abouts/About-Two";

import TestimonialSeven from "../Testimonials/Testimonial-Seven";
import EventCarouse from "../Events/EventCarouse";

// import { API_URL, API_KEY } from "../../constants/constant";
import { API_URL, API_KEY } from "../../constants/constant";
import Axios from "axios";
import { SuccessAlert, SuccessAlert2, ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import userImg from '../../public/images/banner/intro.PNG'
import Image from "next/image";

import NewsletterTwo from "../Newsletters/Newsletter-Two";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {addToCartAction} from "@/redux/action/CartAction";
import {useDispatch} from "react-redux";
import {useAppContext} from "@/context/Context";

const MainDemo = () => {

  const dispatch = useDispatch();
  const { cartToggle, setCart } = useAppContext();
  const REACT_APP = API_URL
  const [getcourseData, setcourseData] = useState([])
  const [getcoursecount, setcoursecount] = useState(0)
  const [getbatchData, setbatchData] = useState([])
  const [getbatchcount, setbatchcount] = useState(0)
  const [BlogData, setBlogData] = useState([])
  const [isLoading, setisLoading] = useState(true)


  useEffect(() => {
    sal({
      threshold: 0.01,
      once: true,
    });
    getCourse();
    getBatch();
    getBlog();
    // console.log(API_URL)
    // getVerifiedTutor();
  }, []);

  // const getVerifiedTutor = () => {
  //   Axios.get(`${REACT_APP.API_URL}/api/TutorBasics/GetAllTutors/3`, {
  //     headers: {
  //       ApiKey: `${REACT_APP.API_KEY}`
  //     }
  //   })
  //       .then(res => {
  //         console.log(res.data)
  //         // setBlogData(res.data)
  //       })
  //       .catch(err => {
  //         { ErrorDefaultAlert(err) }
  //
  //       })
  // }
  const getBlog = () => {
    Axios.get(`${API_URL}/api/blog/GetAllBlog/1`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log(res.data)
          setBlogData(res.data)
          setisLoading(false)
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }
  const getCourse = () => {
    Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/1`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            // console.log(res.data)
            if (res.data.length !== 0) {
              setcourseData(res.data)
              setcoursecount(res.data[0]['remain_course_count'])
              setisLoading(false)
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  const [cid, setcid] = useState('')
  const [isCartItem, setisCartItem] = useState(false)

  let cart_arr = []
  let genCart_arr = []

  const addToCartFun = (id, amount, checkMatchCourses) => {
    // alert('hellooooooooo')
    dispatch(addToCartAction(id, amount, checkMatchCourses));
    setCart(!cartToggle);

    let cartitemcnt = 0
    if (localStorage.getItem('cart')) {
      const str_arr = JSON.parse(localStorage.getItem('cart'))
      if (str_arr.length !== 0) {
        cartitemcnt = str_arr.length
      }
    }

    let maximumItemCart = 0
    Axios.get(`${API_URL}/api/companySettings/FillCompanySettings`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data.length !== 0) {
            //console.log(res.data)

            maximumItemCart = res.data[0]['nMaximumItemCart']

            if (maximumItemCart >= (cartitemcnt + 1)) {

              const url = window.location.href
              const parts = url.split("/");
              const courseId = parts[parts.length - 1];
              setcid(id)
              setisCartItem((true))

              const getamt = (checkMatchCourses.bIsAccosiateCourse === 'yes') ? parseInt(checkMatchCourses.dAmount) : parseInt(checkMatchCourses.pkg_price)

              //check user is login or not
              if(localStorage.getItem('userData')) {
                const udata = JSON.parse(localStorage.getItem('userData'))

                Axios.get(`${API_URL}/api/promocode/Get_promocode_detail/${EncryptData(id)}/${udata['regid']}/${EncryptData(getamt)}`, {
                  headers: {
                    ApiKey: `${API_KEY}`
                  }
                })
                    .then(res => {
                      if (res.data) {
                        if (res.data.length !== 0) {

                          const resData = JSON.parse(res.data)

                          const insert_arr = {
                            nRegId: udata['regid'],
                            cid: EncryptData(id),
                            cname: checkMatchCourses.sCourseTitle,
                            fname: checkMatchCourses.sFName,
                            lname: checkMatchCourses.sLName,
                            camt: (checkMatchCourses.nCourseAmount) ? checkMatchCourses.nCourseAmount : 0,
                            cnewamt: (checkMatchCourses.dAmount) ? checkMatchCourses.dAmount : 0,
                            pkgprice: checkMatchCourses.pkg_price,
                            isaccosiatecourse: checkMatchCourses.bIsAccosiateCourse,
                            cimg: checkMatchCourses.sImagePath,
                            pkgId: EncryptData(0),
                            pkgname: '',
                            PCId: resData.pcid,
                            promocode: resData.promocode,
                            Discount: resData.discAmt
                          }

                          if (insert_arr) {
                            Axios.post(`${REACT_APP.API_URL}/api/cart/InsertCart`, insert_arr, {
                              headers: {
                                ApiKey: `${REACT_APP.API_KEY}`
                              }
                            }).then(res => {
                              const retData = JSON.parse(res.data)
                              if (retData.success === "1") {
                                console.log('done')

                                if (!localStorage.getItem('cart')) {
                                  const str_arr = JSON.stringify([insert_arr])
                                  localStorage.setItem('cart', str_arr)

                                } else {
                                  const gitem = JSON.parse(localStorage.getItem('cart'))
                                  genCart_arr = []
                                  if (gitem.length !== 0) {
                                    for (let i = 0; i < gitem.length; i++) {
                                      genCart_arr.push(gitem[i])
                                    }
                                  }

                                  genCart_arr.push(insert_arr)

                                  const str_arr = JSON.stringify(genCart_arr)
                                  localStorage.setItem('cart', str_arr)
                                }

                              } else if (retData.success === "0") {
                                { ErrorAlert(retData) }
                              }
                            })
                                .catch(err => {
                                  { ErrorDefaultAlert(JSON.stringify(err.response)) }
                                })
                          }

                        }
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
  };


  const getBatch = () => {
    Axios.get(`${API_URL}/api/coursemain/GetBatchCoursesMem/1`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            // console.log(res.data)
            if (res.data.length !== 0) {
              setbatchData(res.data)
              setbatchcount(res.data[0]['remain_batch_count'])
              setisLoading(false)
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }
  return (
      <>
        <main className="rbt-main-wrapper">
          <div className="rbt-banner-area rbt-banner-1">
            <MainDemoBanner/>
          </div>

          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="row row--30 gy-5 align-items-center">
                <div className="col-lg-6 col-xl-5">
                  <div className="thumbnail rbt-shadow-box">
                    <Image
                        src={userImg}
                        width={372}
                        height={396}
                        alt="Course Image"
                        className={'w-100'}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-xl-7">
                  <div className="section-title ms-3">
                    <h2 className="title">What you will learn</h2>
                    <p className="b1 mt--15">Sharpen your English Proficiency by Learning through our Exclusive Batches and Courses.</p>
                  </div>


                  <div className="row g-5 mt--5">

                    <div className="col-lg-6">
                      <div className="section-title subtitle ms-3 mt-3 mb-3">
                        <h5 className="title">What Course Includes?</h5>
                      </div>
                      <ul className="rbt-list-style-1 ms-3">
                        <li><i className="feather-check"></i>Self Learning.</li>
                        <li><i className="feather-check"></i>Recorded video sessions.</li>
                        <li><i className="feather-check"></i>Activity + Practice.</li>
                        <li><i className="feather-check"></i>Test for self-evaluation .</li>
                      </ul>
                      <div className="read-more-btn mt--40 ms-2">
                        <Link className="rbt-moderbt-btn" href="/all-course">
                          <span className="moderbt-btn-text">Explore Courses</span>
                          <i className="feather-arrow-right"></i>
                        </Link>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="section-title subtitle mt-3 mb-3 ms-3">
                        <h5 className="title">What Batch Includes?</h5>
                      </div>
                      <ul className="rbt-list-style-1 ms-3">
                        <li><i className="feather-check"></i>Learning with tutor.</li>
                        <li><i className="feather-check"></i>Live sessions.</li>
                        <li><i className="feather-check"></i>Activity + Practice.</li>
                        <li><i className="feather-check"></i>Test for self-evaluation.</li>
                      </ul>
                      <div className="read-more-btn mt--40 ms-3">
                        <Link className="rbt-moderbt-btn" href="/all-batch">
                          <span className="moderbt-btn-text">Explore Batches</span>
                          <i className="feather-arrow-right"></i>
                        </Link>
                      </div>
                    </div>

                  </div>


                </div>
              </div>
            </div>
          </div>

          <div className="rbt-course-area bg-color-extra2 p-5 mt-5">
            <div className="container">
              <div className="row mb--60">
                <div className="col-lg-12">
                  <div className="section-title text-center">
                  <span className="subtitle bg-secondary-opacity">
                    Top Popular Courses
                  </span>
                    <h2 className="title">
                      Our Exclusive Courses for <br/> English Language Aspirants...
                    </h2>
                  </div>
                </div>
              </div>
              <div className="row row--15">
                {isLoading ? <>
                  <div
                      className={`col-lg-4 col-6 mt-3`}
                      data-sal-delay="150"
                      data-sal="data-up"
                      data-sal-duration="800"
                  >
                    <div className="rbt-card variation-01 rbt-hover">
                      <div className="rbt-card-img">
                        <Skeleton height={150} className='lh-20 w-100'/>
                      </div>
                      <div className="rbt-card-body">
                        <div className="rbt-card-top">
                          <div className="rbt-review">
                            <div className="rating">
                              <Skeleton height={20} width={200} className='lh-20'/>
                            </div>
                            <span className="rating-count">
                      <Skeleton height={20} width={268} className='lh-20'/>
                    </span>
                          </div>
                          <div className="rbt-bookmark-btn">
                            <Skeleton height={20} width={50} className='lh-20'/>
                          </div>
                        </div>

                        <h4 className="rbt-card-title">
                          <Skeleton height={20} />
                        </h4>

                        <ul className="rbt-meta">
                          <li>
                            <Skeleton height={20} width={100} className='lh-20'/>
                          </li>
                          <li>
                            <Skeleton height={20} width={100} className='lh-20'/>
                          </li>
                          <li>
                            <Skeleton height={20} width={100} className='lh-20'/>
                          </li>
                        </ul>

                        <p className="rbt-card-text">
                          <Skeleton className='lh-20'/>
                        </p>

                        <div className="rbt-author-meta mb--10">
                          <Skeleton height={20} width={268} className='lh-20'/>
                        </div>
                      </div>

                      <div className="rbt-card-bottom">
                        <div className="rbt-price">
                          <span className="current-price"><Skeleton height={20} width={268} className='lh-20'/></span>
                          <span className="off-price">
                              <Skeleton height={20} width={268} className='lh-20'/>
                            </span>
                        </div>
                        <Skeleton  className='lh-20'/>
                      </div>
                    </div>
                  </div>
                  <div
                      className={`col-lg-4 col-6 mt-3`}
                      data-sal-delay="150"
                      data-sal="data-up"
                      data-sal-duration="800"
                  >
                    <div className="rbt-card variation-01 rbt-hover">
                      <div className="rbt-card-img">
                        <Skeleton height={150} className='lh-20 w-100'/>
                      </div>
                      <div className="rbt-card-body">
                        <div className="rbt-card-top">
                          <div className="rbt-review">
                            <div className="rating">
                              <Skeleton height={20} width={200} className='lh-20'/>
                            </div>
                            <span className="rating-count">
                      <Skeleton height={20} width={268} className='lh-20'/>
                    </span>
                          </div>
                          <div className="rbt-bookmark-btn">
                            <Skeleton height={20} width={50} className='lh-20'/>
                          </div>
                        </div>

                        <h4 className="rbt-card-title">
                          <Skeleton height={20} />
                        </h4>

                        <ul className="rbt-meta">
                          <li>
                            <Skeleton height={20} width={100} className='lh-20'/>
                          </li>
                          <li>
                            <Skeleton height={20} width={100} className='lh-20'/>
                          </li>
                          <li>
                            <Skeleton height={20} width={100} className='lh-20'/>
                          </li>
                        </ul>

                        <p className="rbt-card-text">
                          <Skeleton className='lh-20'/>
                        </p>

                        {/*{isUser ? (*/}
                        <div className="rbt-author-meta mb--10">
                          <Skeleton height={20} width={268} className='lh-20'/>
                        </div>
                      </div>

                      <div className="rbt-card-bottom">
                        <div className="rbt-price">
                          <span className="current-price"><Skeleton height={20} width={268} className='lh-20'/></span>
                          <span className="off-price">
                              <Skeleton height={20} width={268} className='lh-20'/>
                            </span>
                        </div>

                        <Skeleton  className='lh-20'/>
                      </div>
                    </div>
                  </div><div
                    className={`col-lg-4 col-6 mt-3`}
                    data-sal-delay="150"
                    data-sal="data-up"
                    data-sal-duration="800"
                >
                  <div className="rbt-card variation-01 rbt-hover">
                    <div className="rbt-card-img">
                      <Skeleton height={150} className='lh-20 w-100'/>
                    </div>
                    <div className="rbt-card-body">
                      <div className="rbt-card-top">
                        <div className="rbt-review">
                          <div className="rating">
                            <Skeleton height={20} width={200} className='lh-20'/>
                          </div>
                          <span className="rating-count">
                      <Skeleton height={20} width={268} className='lh-20'/>
                    </span>
                        </div>
                        <div className="rbt-bookmark-btn">
                          <Skeleton height={20} width={50} className='lh-20'/>
                        </div>
                      </div>

                      <h4 className="rbt-card-title">
                        <Skeleton height={20} />
                      </h4>

                      <ul className="rbt-meta">
                        <li>
                          <Skeleton height={20} width={100} className='lh-20'/>
                        </li>
                        <li>
                          <Skeleton height={20} width={100} className='lh-20'/>
                        </li>
                        <li>
                          <Skeleton height={20} width={100} className='lh-20'/>
                        </li>
                      </ul>

                      <p className="rbt-card-text">
                        <Skeleton className='lh-20'/>
                      </p>

                      {/*{isUser ? (*/}
                      <div className="rbt-author-meta mb--10">
                        <Skeleton height={20} width={268} className='lh-20'/>
                      </div>
                    </div>

                    <div className="rbt-card-bottom">
                      <div className="rbt-price">
                        <span className="current-price"><Skeleton height={20} width={268} className='lh-20'/></span>
                        <span className="off-price">
                              <Skeleton height={20} width={268} className='lh-20'/>
                            </span>
                      </div>
                      {/*{data.button ? (*/}
                      <Skeleton  className='lh-20'/>
                    </div>
                  </div>
                </div>

                </> : <>

                  {getcourseData && getcourseData.map((data, index) => {
                    return (
                        <>
                          <div
                              className={`col-lg-4 col-md-12 mt-3`}
                              data-sal-delay="150"
                              data-sal="data-up"
                              data-sal-duration="800"
                              key={index}
                          >
                            <div className="rbt-card variation-01 rbt-hover">
                              <div className="rbt-card-img">
                                <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                                  <Image className={"position-relative"} objectFit="none" fill={true} src={data.sImagePath} alt="Card image"></Image>
                                  {/*{data.offPrice > 0 ? (*/}
                                  {/*    <div className="rbt-badge-3 bg-white">*/}
                                  {/*      <span>-{data.offPrice}%</span>*/}
                                  {/*      <span>Off</span>*/}
                                  {/*    </div>*/}
                                  {/*) : (*/}
                                  {/*    ""*/}
                                  {/*)}*/}
                                </Link>
                              </div>
                              <div className="rbt-card-body">
                                <div className="rbt-card-top">
                                  <div className="rbt-review">
                                    <div className="rating">
                                      <i className="fas fa-star"></i>
                                      <i className="fas fa-star"></i>
                                      <i className="fas fa-star"></i>
                                      <i className="fas fa-star"></i>
                                      <i className="fas fa-star"></i>
                                    </div>
                                    <span className="rating-count">
                                    ({data.user_rate_cnt} Reviews)
                                  </span>
                                  </div>
                                  <div className="rbt-bookmark-btn">
                                    <Link className="rbt-round-btn" title="Bookmark" href="#">
                                      <i className="feather-heart"></i>
                                    </Link>
                                  </div>
                                </div>

                                <h4 className="rbt-card-title">
                                  <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                                    {data.sCourseTitle}
                                  </Link>
                                </h4>

                                <ul className="rbt-meta">
                                  <li>
                                    <i className="feather-book"></i>
                                    {data.lesson_cnt} Lessons
                                  </li>
                                  <li>
                                    <i className="feather-book"></i>
                                    {data.section_cnt} Sections
                                  </li>
                                  <li>
                                    <i className="feather-users"></i>
                                    {data.enroll_cnt} Students
                                  </li>
                                </ul>
                                {data.sShortDesc.length > 165 ?
                                    <p className="rbt-card-text">{data.sShortDesc.substring(0, 110)}...</p> :
                                    <p className="rbt-card-text">{data.sShortDesc}</p>
                                }
                                {/*{isUser ? (*/}
                                <div className="rbt-author-meta mb--10">
                                  {/*<div className="rbt-avater">*/}
                                  {/*  <Link href={`/profile/${data.nCId}`}>*/}
                                  {/*    <Image*/}
                                  {/*        src={data.userImg}*/}
                                  {/*        width={33}*/}
                                  {/*        height={33}*/}
                                  {/*        alt="Sophia Jaymes"*/}
                                  {/*    />*/}
                                  {/*  </Link>*/}
                                  {/*</div>*/}
                                  <div className="rbt-author-info">
                                    By{" "}
                                    <Link href={`/profile/${data.nCId}`}>{data.sFName} {data.sLName}</Link>{" "}
                                    In <Link href="#">{data.sCategory}</Link>
                                  </div>
                                </div>
                                {/*) : (*/}
                                {/*    ""*/}
                                {/*)}*/}
                                <div className="rbt-card-bottom">
                                  <div className="rbt-price">
                                    <span className="current-price">₹{data.dAmount}</span>
                                    <span className="off-price">₹{data.nCourseAmount}</span>
                                  </div>
                                  {/*{data.button ? (*/}
                                  <button
                                      className="rbt-btn-link left-icon border-0"
                                      style={{ backgroundColor: 'transparent' }}
                                      onClick={() => addToCartFun(data.nCId, data.dAmount, data)}
                                  >
                                    <i className="feather-shopping-cart"></i> Add To Cart
                                  </button>
                                  {/*) : (*/}

                                  {/*<Link*/}
                                  {/*    className="rbt-btn-link"*/}
                                  {/*    href={`/course-details/${data.nCId}`}*/}
                                  {/*>*/}
                                  {/*  Learn More<i className="feather-arrow-right"></i>*/}
                                  {/*</Link>*/}
                                  {/*)}*/}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                    )
                  })}
                </>}
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="load-more-btn mt--60 text-center">
                    {isLoading ? <>
                      <Skeleton height={50} width={150} />
                    </> : <>
                      <Link
                          className="rbt-btn btn-gradient btn-lg hover-icon-reverse"
                          href="/all-course"
                      >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">Load More Course ({getcoursecount})</span>
                      <span className="btn-icon">
                        <i className="feather-arrow-right"></i>
                      </span>
                      <span className="btn-icon">
                        <i className="feather-arrow-right"></i>
                      </span>
                    </span>
                      </Link>
                    </>}

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rbt-course-area bg-color-extra2 p-5">
            <div className="container">
              {getbatchData.length !== 0 ? <>
                <div className="row mb--60">
                  <div className="col-lg-12">
                    <div className="section-title text-center">
                  <span className="subtitle bg-secondary-opacity">
                    Top Popular Batches
                  </span>
                      <h2 className="title">
                        Our Exclusive Batches for <br/> English Language Aspirants...
                      </h2>
                    </div>
                  </div>
                </div>
              </> : <></>}


              <div className="row row--15 mt-5">
                <div className="">
                  <div className="container">
                    <div className="rbt-course-grid-column list-column-half active-list-view">
                      {isLoading ? <>
                        <div className={`col-lg-4 col-md-12 mt-3`} data-sal-delay="150" data-sal="data-up"
                             data-sal-duration="800">
                          <div className="rbt-card variation-01 rbt-hover">
                            <div className="rbt-card-img">
                              <Skeleton height={150} className='lh-20 w-100'/>
                            </div>
                            <div className="rbt-card-body">
                              <div className="rbt-card-top">
                                <div className="rbt-review">
                                  <div className="rating">
                                    <Skeleton height={20} width={200} className='lh-20'/>
                                  </div>
                                  <span className="rating-count">
                                  <Skeleton height={20} width={268} className='lh-20'/>
                                </span>
                                </div>
                                <div className="rbt-bookmark-btn">
                                  <Skeleton height={20} width={50} className='lh-20'/>
                                </div>
                              </div>

                              <h4 className="rbt-card-title">
                                <Skeleton height={20} />
                              </h4>

                              <ul className="rbt-meta">
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                              </ul>

                              <p className="rbt-card-text">
                                <Skeleton className='lh-20'/>
                              </p>

                              {/*{isUser ? (*/}
                              <div className="rbt-author-meta mb--10">
                                <Skeleton height={20} width={268} className='lh-20'/>
                              </div>
                            </div>

                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price"><Skeleton height={20} width={268} className='lh-20'/></span>
                                <span className="off-price">
                              <Skeleton height={20} width={268} className='lh-20'/>
                            </span>
                              </div>
                              {/*{data.button ? (*/}
                              <Skeleton  className='lh-20'/>
                            </div>
                          </div>
                        </div>
                        <div className={`col-lg-4 col-md-12 mt-3`} data-sal-delay="150" data-sal="data-up"
                             data-sal-duration="800">
                          <div className="rbt-card variation-01 rbt-hover">
                            <div className="rbt-card-img">
                              <Skeleton height={150} className='lh-20 w-100'/>
                            </div>
                            <div className="rbt-card-body">
                              <div className="rbt-card-top">
                                <div className="rbt-review">
                                  <div className="rating">
                                    <Skeleton height={20} width={200} className='lh-20'/>
                                  </div>
                                  <span className="rating-count">
                                  <Skeleton height={20} width={268} className='lh-20'/>
                                </span>
                                </div>
                                <div className="rbt-bookmark-btn">
                                  <Skeleton height={20} width={50} className='lh-20'/>
                                </div>
                              </div>

                              <h4 className="rbt-card-title">
                                <Skeleton height={20} />
                              </h4>

                              <ul className="rbt-meta">
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                              </ul>

                              <p className="rbt-card-text">
                                <Skeleton className='lh-20'/>
                              </p>

                              {/*{isUser ? (*/}
                              <div className="rbt-author-meta mb--10">
                                <Skeleton height={20} width={268} className='lh-20'/>
                              </div>
                            </div>

                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price"><Skeleton height={20} width={268} className='lh-20'/></span>
                                <span className="off-price">
                              <Skeleton height={20} width={268} className='lh-20'/>
                            </span>
                              </div>
                              {/*{data.button ? (*/}
                              <Skeleton  className='lh-20'/>
                            </div>
                          </div>
                        </div>
                        <div className={`col-lg-4 col-6 mt-3`} data-sal-delay="150" data-sal="data-up"
                             data-sal-duration="800">
                          <div className="rbt-card variation-01 rbt-hover">
                            <div className="rbt-card-img">
                              <Skeleton height={150} className='lh-20 w-100'/>
                            </div>
                            <div className="rbt-card-body">
                              <div className="rbt-card-top">
                                <div className="rbt-review">
                                  <div className="rating">
                                    <Skeleton height={20} width={200} className='lh-20'/>
                                  </div>
                                  <span className="rating-count">
                      <Skeleton height={20} width={268} className='lh-20'/>
                    </span>
                                </div>
                                <div className="rbt-bookmark-btn">
                                  <Skeleton height={20} width={50} className='lh-20'/>
                                </div>
                              </div>

                              <h4 className="rbt-card-title">
                                <Skeleton height={20} />
                              </h4>

                              <ul className="rbt-meta">
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                                <li>
                                  <Skeleton height={20} width={100} className='lh-20'/>
                                </li>
                              </ul>

                              <p className="rbt-card-text">
                                <Skeleton className='lh-20'/>
                              </p>

                              {/*{isUser ? (*/}
                              <div className="rbt-author-meta mb--10">
                                <Skeleton height={20} width={268} className='lh-20'/>
                              </div>
                            </div>

                            <div className="rbt-card-bottom">
                              <div className="rbt-price">
                                <span className="current-price"><Skeleton height={20} width={268} className='lh-20'/></span>
                                <span className="off-price">
                              <Skeleton height={20} width={268} className='lh-20'/>
                            </span>
                              </div>
                              {/*{data.button ? (*/}
                              <Skeleton  className='lh-20'/>
                            </div>
                          </div>
                        </div>

                      </> : <>
                        {getbatchData && getbatchData.map((data, index) => {
                          const startHour = parseInt(data.sBatchStartTime[0])
                          const endHour = parseInt(data.sBatchEndTime[0])
                          console.log("startHour",data.sBatchStartTime,"endHour",data.sBatchEndTime)

                          // Calculate the difference in hours
                          const hoursDifference = endHour - startHour
                          return (
                              <>
                                <div className="course-grid-4" data-sal-delay="150" data-sal="data-up"
                                     data-sal-duration="800">
                                  <div className="rbt-card variation-01 rbt-hover card-list-2">
                                    <div className="rbt-card-img">
                                      <Link href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                        <Image src={data.batchimg} objectFit="none" fill={true} alt="Card image"/>
                                      </Link>
                                    </div>
                                    <div className="rbt-card-body">
                                      <div className="rbt-category">
                                        <Link href="#">{data.sCategory}</Link>
                                      </div>
                                      <h4 className="rbt-card-title">
                                        <Link href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                          {data.sCourseTitle}
                                        </Link>
                                      </h4>
                                      <span className="lesson-number mb-1">By <span
                                          className={'text-dark'}><b>{data.sFName} {data.sLName}</b></span></span>
                                      <span className="lesson-number">{data.batchdays} days <span
                                          className="lesson-time">({data.batchdays * hoursDifference} hrs)</span></span>
                                      <p className="rbt-card-text m-0">
                                    <span
                                        className={'mr-2'}>{new Date(data.batchstartdatenew).getDate()} {new Date(data.batchstartdatenew).toLocaleString('default', {month: 'short'})} - {new Date(data.dBatchEndDate).getDate()} {new Date(data.dBatchEndDate).toLocaleString('default', {month: 'short'})}</span> |
                                        <span className={'ms-2'}>{data.sBatchStartTime} to {data.sBatchEndTime}</span>
                                      </p>
                                      <p className="rbt-card-text font-14 m-0">

                                      </p>
                                      <div className='d-flex mt-1 mb-5 mt-2'>

                                        {(JSON.parse(data.sDays).find(obj => obj === 'Monday')) ? <>
                                          <div className='circle-fill-badge'><span>M</span></div>
                                        </> : <>
                                          <div className='circle-badge'><span>M</span></div>
                                        </>}

                                        {(JSON.parse(data.sDays).find(obj => obj === 'Tuesday')) ? <>
                                          <div className='circle-fill-badge'><span>T</span></div>
                                        </> : <>
                                          <div className='circle-badge'><span>T</span></div>
                                        </>}

                                        {(JSON.parse(data.sDays).find(obj => obj === 'Wednesday')) ? <>
                                          <div className='circle-fill-badge'><span>W</span></div>
                                        </> : <>
                                          <div className='circle-badge'><span>W</span></div>
                                        </>}

                                        {(JSON.parse(data.sDays).find(obj => obj === 'Thursday')) ? <>
                                          <div className='circle-fill-badge'><span>T</span></div>
                                        </> : <>
                                          <div className='circle-badge'><span>T</span></div>
                                        </>}

                                        {(JSON.parse(data.sDays).find(obj => obj === 'Friday')) ? <>
                                          <div className='circle-fill-badge'><span>F</span></div>
                                        </> : <>
                                          <div className='circle-badge'><span>F</span></div>
                                        </>}

                                        {(JSON.parse(data.sDays).find(obj => obj === 'Saturday')) ? <>
                                          <div className='circle-fill-badge'><span>S</span></div>
                                        </> : <>
                                          <div className='circle-badge'><span>S</span></div>
                                        </>}

                                        {(JSON.parse(data.sDays).find(obj => obj === 'Sunday')) ? <>
                                          <div className='circle-fill-badge'><span>S</span></div>
                                        </> : <>
                                          <div className='circle-badge'><span>S</span></div>
                                        </>}

                                      </div>
                                      <div className="rbt-card-bottom">
                                        <div className="read-more-btn">
                                          <Link className="rbt-moderbt-btn" href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                            <span className="moderbt-btn-text">Register Now</span>
                                            <i className="feather-arrow-right"></i>
                                          </Link>
                                        </div>
                                        {/*<a className="transparent-button" href="course-details.html">Register Now<i>*/}
                                        {/*  <svg width="17" height="12" xmlns="http://www.w3.org/2000/svg">*/}
                                        {/*    <g stroke="#27374D" fill="none" fill-rule="evenodd">*/}
                                        {/*      <path d="M10.614 0l5.629 5.629-5.63 5.629"/>*/}
                                        {/*      <path stroke-linecap="square" d="M.663 5.572h14.594"/>*/}
                                        {/*    </g>*/}
                                        {/*  </svg>*/}
                                        {/*</i></a>*/}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </>
                          )
                        })}
                      </>}

                    </div>
                  </div>
                </div>
              </div>
              {getbatchcount > 3 ? <>
                <div className="row mb-5">
                  <div className="col-lg-12">
                    <div className="load-more-btn mt--60 text-center">
                      {isLoading ? <>
                        <Skeleton height={50} width={150} />
                      </> :<>
                        <Link
                            className="rbt-btn btn-gradient btn-lg hover-icon-reverse"
                            href="/all-batch"
                        >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">Load More Batch ({getbatchcount})</span>
                      <span className="btn-icon">
                        <i className="feather-arrow-right"></i>
                      </span>
                      <span className="btn-icon">
                        <i className="feather-arrow-right"></i>
                      </span>
                    </span>
                        </Link>
                      </>}

                    </div>
                  </div>
                </div>
              </> : <>

              </>}

            </div>
          </div>

          <div className={'container mt-5 d-none'}>
            <div className={'row'}>
              <div className={'col-lg-4 col-md-12 h-100 mt-3'}>
                <div className="rbt-service rbt-service-2 rbt-hover-02 bg-no-shadow card-bg-1">
                  <div className="inner">
                    <div className="content">
                      <h4 className="title"><Link href="#">Be a Learner</Link></h4>
                      <p>Get Free access to explore our english courses.</p>
                      <Link className="transparent-button" href="#">Learn More
                        <i>
                          <svg width="17" height="12" xmlns="http://www.w3.org/2000/svg">
                            <g stroke="#27374D" fill="none" fill-rule="evenodd">
                              <path d="M10.614 0l5.629 5.629-5.63 5.629"/>
                              <path stroke-linecap="square" d="M.663 5.572h14.594"/>
                            </g>
                          </svg>
                        </i>
                      </Link>
                    </div>
                    <div className="thumbnail text-center d-none">
                      <Image objectFit="none" fill={true} src={'/images/service/6.png'} className={"learner-img"} alt="Education Images"/>
                    </div>
                  </div>
                </div>
              </div>
              <div className={'col-lg-4 col-md-12 h-100 mt-3'}>
                <div className="rbt-service rbt-service-2 rbt-hover-02 bg-no-shadow card-bg-2">
                  <div className="inner">
                    <div className="content">
                      <h4 className="title"><Link href="#">Be a Tutor</Link></h4>
                      <p>Make your English proficiency a career.</p>
                      <Link className="transparent-button" href="#">Learn More<i>
                        <svg width="17" height="12" xmlns="http://www.w3.org/2000/svg">
                          <g stroke="#27374D" fill="none" fill-rule="evenodd">
                            <path d="M10.614 0l5.629 5.629-5.63 5.629"/>
                            <path stroke-linecap="square" d="M.663 5.572h14.594"/>
                          </g>
                        </svg>
                      </i></Link>
                    </div>
                    <div className="thumbnail d-none">
                      <Image objectFit="none" fill={true} src={'/images/service/5.png'} className={""} alt="Education Images"/>
                    </div>
                  </div>
                </div>
              </div>
              <div className={'col-lg-4 col-md-12 h-100 mt-3'}>
                <div className="rbt-service rbt-service-2 rbt-hover-02 bg-no-shadow card-bg-3">
                  <div className="inner">
                    <div className="content">
                      <h4 className="title"><Link href="#">Be a Partener</Link></h4>
                      <p>Grab an opportunity to make your institute online.</p>
                      <Link className="transparent-button" href="#">Learn More<i>
                        <svg width="17" height="12" xmlns="http://www.w3.org/2000/svg">
                          <g stroke="#27374D" fill="none" fill-rule="evenodd">
                            <path d="M10.614 0l5.629 5.629-5.63 5.629"/>
                            <path stroke-linecap="square" d="M.663 5.572h14.594"/>
                          </g>
                        </svg>
                      </i></Link>
                    </div>
                    <div className="thumbnail d-none">
                      <Image objectFit="none" fill={true} src={'/images/service/4.png'} className={""} alt="Education Images"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rbt-about-area bg-color-white rbt-section-gapTop pb_md--80 pb_sm--80 about-style-1">
            <div className="container">
              <AboutTwo/>
            </div>
          </div>

          <div className="rbt-rbt-blog-area bg-color-white rbt-section-gapBottom">
            <div className="container">
              {BlogData.length > 0 ? <>
                <div className="row mb--30 g-5 align-items-end">
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="section-title text-start">
                      <span className="subtitle bg-primary-opacity">Our Blog</span>
                      <h2 className="title">EET Blog</h2>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="read-more-btn text-start text-md-end">
                      <Link
                          className="rbt-btn btn-gradient hover-icon-reverse radius-round"
                          href="/blog-list"
                      >
                        <div className="icon-reverse-wrapper">
                          <span className="btn-text">VIEW ALL BLOGS</span>
                          <span className="btn-icon">
                      <i className="feather-arrow-right"></i>
                    </span>
                          <span className="btn-icon">
                      <i className="feather-arrow-right"></i>
                    </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </> : <></>}


              <div className="row g-5">
                <div
                    className="col-lg-6 col-md-12 col-sm-12 col-12"
                    data-sal-delay="150"
                    data-sal="slide-up"
                    data-sal-duration="800"
                >
                  {isLoading ? <>
                    <div className="rbt-card variation-02 height-330 rbt-hover mt-3">
                      <div className="rbt-card-img">
                        <Skeleton height={150}/>

                      </div>
                      <div className="rbt-card-body">
                        <h3 className="rbt-card-title">
                          <Skeleton/>
                        </h3>
                        {/*<p className="rbt-card-text">{data.sBlogTitle}</p>*/}
                        <div className="rbt-card-bottom">
                          <Skeleton height={20} width={80}/>
                        </div>
                      </div>
                    </div>
                  </> : <>
                    {BlogData &&
                        BlogData.slice(0, 1).map((data, index) => (
                            <div
                                className="rbt-card variation-02 height-330 rbt-hover mt-3"
                                key={index}
                            >
                              <div className="rbt-card-img">
                                <Link href={`/blog-details/${data.nBId}`}>
                                  <Image className={"position-relative"} objectFit="none"
                                         src={data.sImagePath}
                                         width={580}
                                         height={300}
                                         alt="Card image"
                                  />{" "}
                                </Link>
                              </div>
                              <div className="rbt-card-body">
                                <h3 className="rbt-card-title">
                                  <Link href={`/blog-details/${data.nBId}`}>{data.sBlogTitle}</Link>
                                </h3>
                                {/*<p className="rbt-card-text">{data.sBlogTitle}</p>*/}
                                <div className="rbt-card-bottom">
                                  <Link
                                      className="transparent-button"
                                      href={`/blog-details/${data.nBId}`}
                                  >
                                    Learn More
                                    <i>
                                      <svg
                                          width="17"
                                          height="12"
                                          xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g stroke="#27374D" fill="none" fillRule="evenodd">
                                          <path d="M10.614 0l5.629 5.629-5.63 5.629"/>
                                          <path
                                              strokeLinecap="square"
                                              d="M.663 5.572h14.594"
                                          />
                                        </g>
                                      </svg>
                                    </i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                        ))}
                  </>}

                </div>
                <div
                    className="col-lg-6 col-md-12 col-sm-12 col-12"
                    data-sal-delay="150"
                    data-sal="slide-up"
                    data-sal-duration="800"
                >
                  {isLoading ? <>
                    <div
                        className={`rbt-card card-list variation-02 rbt-hover mt-3`}
                    >
                      <div className="rbt-card-img">
                        <Skeleton height={150} width={268} />
                      </div>
                      <div className="rbt-card-body">
                        <h5 className="rbt-card-title">
                          <Skeleton height={20} width={300} />
                          <Skeleton height={20} width={300} />
                        </h5>
                      </div>
                    </div>
                    <div
                        className={`rbt-card card-list variation-02 rbt-hover mt-3`}
                    >
                      <div className="rbt-card-img">
                        <Skeleton height={150} width={268} />
                      </div>
                      <div className="rbt-card-body">
                        <h5 className="rbt-card-title">
                          <Skeleton height={20} width={300} />
                          <Skeleton height={20} width={300} />
                        </h5>
                      </div>
                    </div>
                    <div
                        className={`rbt-card card-list variation-02 rbt-hover mt-3`}
                    >
                      <div className="rbt-card-img">
                        <Skeleton height={150} width={268} />
                      </div>
                      <div className="rbt-card-body">
                        <h5 className="rbt-card-title">
                          <Skeleton height={20} width={300} />
                          <Skeleton height={20} width={300} />
                        </h5>
                      </div>
                    </div>

                  </> : <>
                    {BlogData &&
                        BlogData.slice(1, 4).map((data, index) => (
                            <div
                                className={`rbt-card card-list variation-02 rbt-hover mt-3`}
                                key={index}
                            >
                              <div className="rbt-card-img">
                                <Link href={`/blog-details/${data.nBId}`}>
                                  <Image className={"position-relative"} objectFit="none"
                                         src={data.sImagePath}
                                         width={580}
                                         height={300}
                                         alt="Card image"
                                  />{" "}
                                </Link>
                              </div>
                              <div className="rbt-card-body">
                                <h5 className="rbt-card-title">
                                  <Link href={`/blog-details/${data.nBId}`}>{data.sBlogTitle}</Link>
                                </h5>
                                <div className="rbt-card-bottom">
                                  <Link
                                      className="transparent-button"
                                      href={`/blog-details/${data.nBId}`}
                                  >
                                    Read Article
                                    <i>
                                      <svg
                                          width="17"
                                          height="12"
                                          xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g stroke="#27374D" fill="none" fillRule="evenodd">
                                          <path d="M10.614 0l5.629 5.629-5.63 5.629"/>
                                          <path
                                              strokeLinecap="square"
                                              d="M.663 5.572h14.594"
                                          />
                                        </g>
                                      </svg>
                                    </i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                        ))}
                  </>}

                </div>
              </div>
            </div>
          </div>
          <div className="rbt-event-area rbt-section-gap bg-gradient-3">
            <div className="container">
              <div className="row mb--55">
                <div className="section-title text-center">
                  {/*<span className="subtitle bg-white-opacity">*/}
                  {/*  STIMULATED TO TAKE PART IN?*/}
                  {/*</span>*/}
                  <h2 className="title color-white">Upcoming Courses</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <EventCarouse/>
                </div>
              </div>
            </div>
          </div>


          <div className="rbt-newsletter-area newsletter-style-2 bg-color-primary rbt-section-gap">
            <NewsletterTwo/>
          </div>
        </main>
      </>
  );
};

export default MainDemo;
