//code for main-demo.js here below
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
                const udata = DecryptData(localStorage.getItem('userData'))

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
                                // console.log('done')

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
          <style>{`
/* ── Screenshot-matching card styles ── */
.ss-card {
    background: #fff;
    border-radius: 10px;
    border: 0px solid #ebebf0;
    overflow: hidden;
    transition: box-shadow 0.22s ease, transform 0.22s ease;
    height: 100%;
    display: flex;
}
.ss-card:hover {
    box-shadow: 0 8px 32px rgba(80,60,180,0.13);
    transform: translateY(-2px);
}

/* Grid card: vertical */
.ss-card-grid { flex-direction: column; }
.ss-card-img-wrap {
    position: relative;
    width: calc(100% - 20px);
    aspect-ratio: 16 / 9;          /* keeps 480×270 ratio */
    flex-shrink: 0;
    display: block;
    overflow: hidden;
    border: 1px solid #ebebf0;
    border-radius: 12px;
    margin: 10px 10px 0 10px;
}

/* List card: horizontal */
.ss-card-list { 
    flex-direction: row;
    align-items: center;
    min-height: unset;
    border-radius: 16px;
    border: 1px solid #ebebf0;
    box-shadow: 0 2px 12px rgba(80,60,180,0.07);
    overflow: hidden;
}
.ss-list-img-wrap {
    position: relative;
    width: 420px;
    min-width: 420px;
    height: auto;
    aspect-ratio: 16 / 9;
    flex-shrink: 0;
    display: block;
    align-self: flex-start;
    overflow: hidden;
    border-radius: 12px;
    margin: 12px;
    border: none;
    background: transparent !important;
}
@media (max-width: 768px) {
    .ss-card-list { flex-direction: column; min-height: unset; }
  .ss-list-img-wrap {
    width: calc(100% - 24px);
    min-width: unset;
    aspect-ratio: 16 / 9;
    height: auto;
    min-height: unset;
    margin: 12px;
    align-self: auto;
    flex-shrink: 0;
    border-radius: 12px;
    background: transparent !important;
}
}
@media (max-width: 480px) {
    .ss-title { font-size: 14px; }
    .ss-day-dot { width: 22px; height: 22px; font-size: 9px; }
}
/* Adjust spacing when tutor is below image in grid */
.ss-card-grid .ss-tutor-row {
    margin-bottom: 8px;
    padding: 0 20px;
}

/* Card body */
.ss-card-body {
    padding: 18px 20px 18px;
    display: flex; flex-direction: column; flex: 1;
    min-width: 0;
}

/* Top row */
.ss-card-top-row {
    display: flex; align-items: center; justify-content: flex-start;
    margin-bottom: 8px;
}
.ss-stars-row { display: flex; align-items: center; gap: 2px; }
.ss-rating-text { font-size: 12px; color: #888; margin-left: 5px; }
.ss-bookmark-btn {
    background: none; border: none; cursor: pointer;
    color: #bbb; padding: 2px 4px; border-radius: 6px;
    transition: color 0.15s;
}
.ss-bookmark-btn:hover { color: #7c3aed; }

/* Title */
.ss-title { font-size: 16px; font-weight: 700; margin: 0 0 10px; line-height: 1.35; color: #1a1a2e; }
.ss-title a { color: inherit; text-decoration: none; }
.ss-title a:hover { color: #7c3aed; }

/* Meta row */
.ss-meta-row {
    display: flex; align-items: center; flex-wrap: wrap;
    gap: 4px; font-size: 12px; color: #666; margin-bottom: 6px;
}
.ss-meta-item { display: flex; align-items: center; gap: 3px; }
.ss-meta-dot { color: #ccc; }
.ss-date-range { color: #555; }

/* Day dots */
.ss-day-dots { display: flex; gap: 5px; margin: 10px 0; }
.ss-day-dot {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 600;
}
.ss-day-on  { background: #7c3aed; color: #fff; }
.ss-day-off { background: #f4f4f8; color: #bbb; border: 1px solid #e8e8ee; }

/* Tutor */
/* Tutor row - remove avatar, keep text only */
.ss-tutor-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: #555; margin-bottom: 12px; flex-wrap: wrap;
}
.ss-tutor-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg,#7c3aed,#a78bfa);
    color: #fff; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; text-transform: uppercase;
}
.ss-cat-badge {
    background: #ede9fe; color: #5b21b6;
    font-size: 10px; font-weight: 600; padding: 2px 9px;
    border-radius: 20px;
}

/* Footer */
.ss-card-footer {
    display: flex; align-items: center;
    justify-content: space-between; gap: 8px;
    padding-top: 12px; border-top: 1px solid #f0eef8;
    margin-top: auto; flex-wrap: wrap;
}
.ss-price-area { display: flex; align-items: center; gap: 7px; }
.ss-price { font-size: 17px; font-weight: 800; color: #1a1a2e; }
.ss-free-badge {
    background: #22c55e; color: #fff;
    font-size: 11px; font-weight: 700;
    padding: 4px 11px; border-radius: 20px; letter-spacing: 0.4px;
}
.ss-level-badge {
    background: #fff4e5; color: #b45309;
    font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
}
.ss-learn-btn {
    background: #7c3aed; color: #fff;
    border: none; border-radius: 22px;
    padding: 8px 16px; font-size: 12px; font-weight: 600;
    cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; gap: 4px;
    white-space: nowrap; transition: background 0.18s;
}
.ss-learn-btn:hover { background: #5b21b6; color: #fff; }
`}</style>
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
                                  <Image className={"position-relative"} objectFit="inherit" fill={true} src={data.sImagePath} alt="Card image"></Image>
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
                                    Tutor:{" "}
                                    <Link href={`/profile/${data.nCId}`}>{data.sFName} {data.sLName}</Link>
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
                                  <Link className="rbt-btn-link"
                                        href={`/course-details/${EncryptData(data.nCId)}`}>Learn
                                    More<i
                                        className="feather-arrow-right"></i></Link>
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
                          const WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
                          const LABELS = ['M','T','W','T','F','S','S'];

                          const getTimeDifference = (startTime, endTime, days) => {
                            if (!startTime || !endTime || !days) return { totalHours: 0, remainingMinutes: 0 };
                            days = parseInt(days);
                            const isValidTimeFormat = (time) => /^\d{1,2}:\d{2}\s*(am|pm)$/i.test(time);
                            if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) return { totalHours: 0, remainingMinutes: 0 };
                            const [startHour, startMinute] = startTime.match(/(\d+):(\d+)/).slice(1).map(Number);
                            const [endHour, endMinute] = endTime.match(/(\d+):(\d+)/).slice(1).map(Number);
                            const startPeriod = startTime.toLowerCase().includes("pm") && startHour !== 12 ? 12 : 0;
                            const endPeriod = endTime.toLowerCase().includes("pm") && endHour !== 12 ? 12 : 0;
                            const startDate = new Date(0, 0, 0, (startHour % 12) + startPeriod, startMinute);
                            const endDate = new Date(0, 0, 0, (endHour % 12) + endPeriod, endMinute);
                            let differenceInMs = endDate - startDate;
                            if (differenceInMs < 0) differenceInMs += 24 * 60 * 60 * 1000;
                            const differenceInMinutes = differenceInMs / (1000 * 60);
                            const totalMinutes = differenceInMinutes * days;
                            const totalHours = Math.floor(totalMinutes / 60);
                            const remainingMinutes = totalMinutes % 60;
                            return { totalHours, remainingMinutes };
                          };

                          const { totalHours, remainingMinutes } = getTimeDifference(data.sBatchStartTime, data.sBatchEndTime, data.batchdays);
                          const days = JSON.parse(data.sDays);
                          const rating = parseFloat(data.user_rate) || 0;
                          const fullStars = Math.floor(rating);
                          const hasHalf = rating % 1 >= 0.5;
                          const startD = new Date(data.batchstartdatenew);
                          const endD = new Date(data.dBatchEndDate);
                          const fmt = (d) => `${d.getDate()} ${d.toLocaleString('default', {month: 'short'})}`;
                          const StarIcon = ({filled}) => (
                              <svg width="13" height="13" viewBox="0 0 24 24"
                                   fill={filled ? '#EF9F27' : 'none'} stroke="#EF9F27" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                          );

                          return (
                              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-4" key={index} style={{padding: '8px'}}>
                                <div className="ss-card ss-card-list">
                                  {/* Left image */}
                                  <Link href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`} className="ss-list-img-wrap">
                                    <Image
                                        src={data.batchimg}
                                        alt={data.sCourseTitle}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 420px"
                                        style={{objectFit: 'contain', background: 'transparent'}}
                                    />
                                  </Link>

                                  {/* Right content */}
                                  <div className="ss-card-body">
                                    {/* 1. Stars */}
                                    <div className="ss-card-top-row">
                                      <div className="ss-stars-row">
                                        {[1,2,3,4,5].map(s => (
                                            <StarIcon key={s} filled={s <= fullStars || (s === fullStars+1 && hasHalf)} />
                                        ))}
                                        <span className="ss-rating-text">
                {rating > 0 ? `(${data.user_rate_cnt || 0} Reviews)` : '(0 Reviews)'}
              </span>
                                      </div>
                                    </div>

                                    {/* 2. Title */}
                                    <h4 className="ss-title">
                                      <Link href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                        {data.sCourseTitle}
                                      </Link>
                                    </h4>

                                    {/* 3. Duration & Hours */}
                                    <div className="ss-meta-row">
            <span className="ss-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {data.batchdays} Days
            </span>
                                      <span className="ss-meta-dot">·</span>
                                      <span className="ss-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
                                        {totalHours}h {remainingMinutes}m
            </span>
                                    </div>

                                    {/* 4. Date Range & Time */}
                                    <div className="ss-meta-row">
            <span className="ss-meta-item ss-date-range">
              {fmt(startD)} – {fmt(endD)} | {data.sBatchStartTime} – {data.sBatchEndTime}
            </span>
                                    </div>

                                    {/* 5. Day Dots */}
                                    <div className="ss-day-dots">
                                      {WEEK.map((day, i) => (
                                          <div key={i} className={`ss-day-dot ${days.includes(day) ? 'ss-day-on' : 'ss-day-off'}`}>
                                            {LABELS[i]}
                                          </div>
                                      ))}
                                    </div>

                                    {/* 6. Tutor */}
                                    <div className="ss-tutor-row">
                                      <span>Tutor: <strong>{data.sFName} {data.sLName}</strong></span>
                                      {data.sCategory && <span className="ss-cat-badge">{data.sCategory}</span>}
                                    </div>

                                    {/* 7. Footer */}
                                    <div className="ss-card-footer">
                                      <div className="ss-price-area">
                                        {data.sLevel && <span className="ss-level-badge">{data.sLevel}</span>}
                                        {(!data.dAmount || Number(data.dAmount) === 0) && (
                                            <span className="ss-free-badge">FREE</span>
                                        )}
                                      </div>
                                      <Link className="ss-learn-btn" href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                        Register Now →
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          );
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
