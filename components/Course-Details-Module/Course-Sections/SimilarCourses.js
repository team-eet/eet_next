import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import Axios from 'axios'
import {API_URL, API_KEY} from '../../../constants/constant'
import { EncryptData } from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import CornerRibbon from "react-corner-ribbon";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const SimilarCourses = ({ checkMatchCourses }) => {

  const REACT_APP = API_URL
  const [getcourse, setcourse] = useState([])
  const [isLoading, setisLoading] = useState(true)
  const getCourse = () => {
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1];
    Axios.get(`${API_URL}/api/coursemain/GetCoursesView/${courseId}/0`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            // console.log(res.data)
            if (res.data.length !== 0) {
              // setcourseData(res.data[0])

              Axios.get(`${API_URL}/api/coursemain/GetCourseDetailCategorywise/${EncryptData(res.data[0].nCCId)}`, {
                headers: {
                  ApiKey: `${API_KEY}`
                }
              })
                  .then(res => {
                    if (res.data) {
                      console.log("Related Courses",res.data)
                      setcourse(res.data)
                      setisLoading(false)
                    }
                  })
                  .catch(err => {
                    { ErrorDefaultAlert(err) }
                  })
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  useEffect(() =>{
    getCourse()
  }, [])
  return (
      <>
        <div className="container">
          <div className="section-title mb--30">
          <span className="subtitle bg-primary-opacity">
            More Similar Courses
          </span>
            <h4 className="title">Related Courses</h4>
          </div>
          {/*<div className="row g-5">*/}


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

            {isLoading ? <>

              <div className={'row'}>
              <div
                  className="col-lg-4 col-md-6 col-sm-6 col-12"
              >
                <div className="rbt-card variation-01 rbt-hover">
                  <div className="rbt-card-img">
                    <Skeleton height={150}/>
                  </div>
                  <div className="rbt-card-body">
                    <h4 className="rbt-card-title">
                      <Skeleton height={30}/>
                    </h4>
                    <ul className="rbt-meta">
                      <li>
                        <Skeleton height={30} width={30}/>
                      </li>
                      <li>
                        <Skeleton height={30} width={30}/>
                      </li>
                    </ul>
                    {/**/}
                    <Skeleton height={30}/>
                    {/**/}
                    <div className="rbt-author-meta mb--20">
                      <div className="rbt-avater">
                      </div>
                      <div className="rbt-author-info">
                        <Skeleton height={30}/>
                      </div>
                    </div>
                    <div className="rbt-card-bottom">
                      <div className="rbt-price">
                        <Skeleton height={30} width={80}/>
                      </div>
                      <Link className="rbt-btn-link" href="/course-details">
                        <Skeleton height={30} width={50}/>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                  className="col-lg-4 col-md-6 col-sm-6 col-12"
              >
                <div className="rbt-card variation-01 rbt-hover">
                  <div className="rbt-card-img">
                    <Skeleton height={150}/>
                  </div>
                  <div className="rbt-card-body">
                    <h4 className="rbt-card-title">
                      <Skeleton height={30}/>
                    </h4>
                    <ul className="rbt-meta">
                      <li>
                        <Skeleton height={30} width={30}/>
                      </li>
                      <li>
                        <Skeleton height={30} width={30}/>
                      </li>
                    </ul>
                    {/**/}
                    <Skeleton height={30}/>
                    {/**/}
                    <div className="rbt-author-meta mb--20">
                      <div className="rbt-avater">
                      </div>
                      <div className="rbt-author-info">
                        <Skeleton height={30}/>
                      </div>
                    </div>
                    <div className="rbt-card-bottom">
                      <div className="rbt-price">
                        <Skeleton height={30} width={80}/>
                      </div>
                      <Link className="rbt-btn-link" href="/course-details">
                        <Skeleton height={30} width={50}/>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                  className="col-lg-4 col-md-6 col-sm-6 col-12"
              >
                <div className="rbt-card variation-01 rbt-hover">
                  <div className="rbt-card-img">
                    <Skeleton height={150}/>
                  </div>
                  <div className="rbt-card-body">
                    <h4 className="rbt-card-title">
                      <Skeleton height={30}/>
                    </h4>
                    <ul className="rbt-meta">
                      <li>
                        <Skeleton height={30} width={30}/>
                      </li>
                      <li>
                        <Skeleton height={30} width={30}/>
                      </li>
                    </ul>
                    {/**/}
                    <Skeleton height={30}/>
                    {/**/}
                    <div className="rbt-author-meta mb--20">
                      <div className="rbt-avater">
                      </div>
                      <div className="rbt-author-info">
                        <Skeleton height={30}/>
                      </div>
                    </div>
                    <div className="rbt-card-bottom">
                      <div className="rbt-price">
                        <Skeleton height={30} width={80}/>
                      </div>
                      <Link className="rbt-btn-link" href="/course-details">
                        <Skeleton height={30} width={50}/>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </> : <>
              {getcourse.map((data, index) => {
                return (
                    <>
                      {/*<SwiperSlide className="swiper-wrapper" key={index}>*/}
                      {/*  <div className="swiper-slide">*/}
                      {/*    <div className="single-slide">*/}
                      {/*      <div className="rbt-card variation-01 rbt-hover">*/}
                      {/*        <div className="rbt-card-img">*/}
                      {/*          <img*/}
                      {/*              src={data.sImagePath}*/}
                      {/*              className={'w-100'}*/}
                      {/*              // width={355}*/}
                      {/*              // height={244}*/}
                      {/*              alt="Card image"*/}
                      {/*          />*/}
                      {/*        </div>*/}
                      {/*        <div className="rbt-card-body">*/}
                      {/*          <div className="rbt-card-top">*/}
                      {/*            <div className="rbt-review">*/}
                      {/*              <div className="rating">*/}
                      {/*                <i className="fas fa-star"></i>*/}
                      {/*                <i className="fas fa-star"></i>*/}
                      {/*                <i className="fas fa-star"></i>*/}
                      {/*                <i className="fas fa-star"></i>*/}
                      {/*                <i className="fas fa-star"></i>*/}
                      {/*              </div>*/}
                      {/*              <span className="rating-count">*/}
                      {/*    {" "}*/}
                      {/*                (0 Reviews)*/}
                      {/*  </span>*/}
                      {/*            </div>*/}
                      {/*            <div className="rbt-bookmark-btn">*/}
                      {/*              <Link*/}
                      {/*                  className="rbt-round-btn"*/}
                      {/*                  title="Bookmark"*/}
                      {/*                  href="#"*/}
                      {/*              >*/}
                      {/*                <i className="feather-heart"></i>*/}
                      {/*              </Link>*/}
                      {/*            </div>*/}
                      {/*          </div>*/}
                      {/*          <h4 className="rbt-card-title">*/}
                      {/*            <Link href={''}>{data.sCourseTitle}</Link>*/}
                      {/*          </h4>*/}
                      {/*          <ul className="rbt-meta">*/}
                      {/*            <li>*/}
                      {/*              <i className="feather-book"></i>*/}
                      {/*              Lessons*/}
                      {/*            </li>*/}
                      {/*            <li>*/}
                      {/*              <i className="feather-users"></i>*/}
                      {/*              Students*/}
                      {/*            </li>*/}
                      {/*          </ul>*/}
                      {/*          /!**!/*/}
                      {/*          <p className="rbt-card-text">{data.sShortDesc.substring(0, 100)}</p>*/}
                      {/*          /!**!/*/}
                      {/*          <div className="rbt-author-meta mb--20">*/}
                      {/*            <div className="rbt-avater">*/}
                      {/*              <Link href={``}>*/}
                      {/*                <img*/}
                      {/*                    src={data.sPhoto}*/}
                      {/*                    width={33}*/}
                      {/*                    height={33}*/}
                      {/*                    alt="Sophia Jaymes"*/}
                      {/*                />*/}
                      {/*              </Link>*/}
                      {/*            </div>*/}
                      {/*            <div className="rbt-author-info">*/}
                      {/*              By{" "}*/}
                      {/*              <Link href={``}>{data.sFName} {data.sLName}</Link>{" "}*/}
                      {/*              In {" "}*/}
                      {/*              <Link href="#">{data.sCategory}</Link>*/}
                      {/*            </div>*/}
                      {/*          </div>*/}
                      {/*          <div className="rbt-card-bottom">*/}
                      {/*            <div className="rbt-price">*/}
                      {/*              <span className="current-price">₹ {data.dAmount}</span>*/}
                      {/*              <span className="off-price">{data.nCourseAmount}</span>*/}
                      {/*            </div>*/}
                      {/*            <Link className="rbt-btn-link" href="/course-details">*/}
                      {/*              Learn More<i className="feather-arrow-right"></i>*/}
                      {/*            </Link>*/}
                      {/*          </div>*/}
                      {/*        </div>*/}
                      {/*      </div>*/}
                      {/*    </div>*/}
                      {/*  </div>*/}
                      {/*</SwiperSlide>*/}
                        <SwiperSlide className="swiper-wrapper" key={index}>
                            <div className="swiper-slide">
                                <div className="single-slide">
                                    {data.bIsAccosiateModule === "no" ? (
                                        <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                                            <CornerRibbon
                                                position="top-center"
                                                fontColor="#f0f0f0"
                                                backgroundColor="#637FEA"
                                                containerStyle={{}}
                                                style={{'border-bottom-right-radius': '6px'}}
                                                className=""
                                            >
                                                {data.sLevel}
                                            </CornerRibbon>
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <img
                                                        src={data.sImagePath}
                                                        className={'w-100'}
                                                        alt="Card image"
                                                    />
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
                                                            <span className="rating-count">({data.user_rate_cnt} Reviews)</span>
                                                        </div>
                                                        <div className="rbt-bookmark-btn">
                                                            <Link className="rbt-round-btn" title="Bookmark" href="#">
                                                                <i className="feather-heart"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <h4 className="rbt-card-title">{data.sCourseTitle}</h4>
                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <i className="feather-book"></i>
                                                            {data.lesson_cnt} Lessons
                                                        </li>
                                                        <li>
                                                            <i className="feather-users"></i>
                                                            {data.enroll_cnt} Students
                                                        </li>
                                                    </ul>
                                                    <p className="rbt-card-text">
                                                        {data.sShortDesc.length > 165
                                                            ? data.sShortDesc.substring(0, 110) + "..."
                                                            : data.sShortDesc}
                                                    </p>
                                                    <div className="rbt-author-meta mb--20">
                                                        <div className="rbt-avater">
                                                            <Link href={``}>
                                                                <img src={data.sPhoto} width={33} height={33} alt="Sophia Jaymes" />
                                                            </Link>
                                                        </div>
                                                        <div className="rbt-author-info">
                                                            By <Link href={``}>{data.sFName} {data.sLName}</Link> In{" "}
                                                            <Link href="#">{data.sCategory}</Link>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <div className="rbt-price">
                                                            <span className="current-price">₹{data.dAmount}</span>
                                                            <span className="off-price">₹{data.nCourseAmount}</span>
                                                        </div>
                                                        <Link className="rbt-btn-link" href="course-details.html">
                                                            Learn More<i className="feather-arrow-right"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link href={`/course-details-module/${EncryptData(data.nCId)}`}>
                                            <CornerRibbon
                                                position="top-center"
                                                fontColor="#f0f0f0"
                                                backgroundColor="#637FEA"
                                                containerStyle={{}}
                                                style={{'border-bottom-right-radius': '6px'}}
                                                className=""
                                            >
                                                {data.sLevel}
                                            </CornerRibbon>
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <img
                                                        src={data.sImagePath}
                                                        className={'w-100'}
                                                        alt="Card image"
                                                    />
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
                                                            <span className="rating-count">({data.user_rate_cnt} Reviews)</span>
                                                        </div>
                                                        <div className="rbt-bookmark-btn">
                                                            <Link className="rbt-round-btn" title="Bookmark" href="#">
                                                                <i className="feather-heart"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <h4 className="rbt-card-title">{data.sCourseTitle}</h4>
                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <i className="feather-book"></i>
                                                            {data.lesson_cnt} Lessons
                                                        </li>
                                                        <li>
                                                            <i className="feather-users"></i>
                                                            {data.enroll_cnt} Students
                                                        </li>
                                                    </ul>
                                                    <p className="rbt-card-text">
                                                        {data.sShortDesc.length > 165
                                                            ? data.sShortDesc.substring(0, 110) + "..."
                                                            : data.sShortDesc}
                                                    </p>
                                                    <div className="rbt-author-meta mb--20">
                                                        <div className="rbt-avater">
                                                            <Link href={``}>
                                                                <img src={data.sPhoto} width={33} height={33} alt="Sophia Jaymes" />
                                                            </Link>
                                                        </div>
                                                        <div className="rbt-author-info">
                                                            By <Link href={``}>{data.sFName} {data.sLName}</Link> In{" "}
                                                            <Link href="#">{data.sCategory}</Link>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <div className="read-more-btn m-auto">
                                                            <Link className="rbt-moderbt-btn" href={`/Package/${EncryptData(data.nCId)}`}>
                                                                <span className="moderbt-btn-text">View Packages</span>
                                                                <i className="feather-arrow-right"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    </>
                )
              })}
            </>}


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

          {/*{isLoading ? <>*/}
          {/*    <div*/}
          {/*        className="col-lg-4 col-md-6 col-sm-6 col-12"*/}
          {/*    >*/}
          {/*        <div className="rbt-card variation-01 rbt-hover">*/}
          {/*            <div className="rbt-card-img">*/}
          {/*                <Skeleton height={150}/>*/}
          {/*            </div>*/}
          {/*            <div className="rbt-card-body">*/}
          {/*                <h4 className="rbt-card-title">*/}
          {/*                    <Skeleton height={30}/>*/}
          {/*                </h4>*/}
          {/*                <ul className="rbt-meta">*/}
          {/*                    <li>*/}
          {/*                        <Skeleton height={30} width={30}/>*/}
          {/*                    </li>*/}
          {/*                    <li>*/}
          {/*                        <Skeleton height={30} width={30}/>*/}
          {/*                    </li>*/}
          {/*                </ul>*/}
          {/*                /!**!/*/}
          {/*                <Skeleton height={30}/>*/}
          {/*                /!**!/*/}
          {/*                <div className="rbt-author-meta mb--20">*/}
          {/*                    <div className="rbt-avater">*/}
          {/*                    </div>*/}
          {/*                    <div className="rbt-author-info">*/}
          {/*                        <Skeleton height={30}/>*/}
          {/*                    </div>*/}
          {/*                </div>*/}
          {/*                <div className="rbt-card-bottom">*/}
          {/*                    <div className="rbt-price">*/}
          {/*                        <Skeleton height={30} width={80}/>*/}
          {/*                    </div>*/}
          {/*                    <Link className="rbt-btn-link" href="/course-details">*/}
          {/*                        <Skeleton height={30} width={50}/>*/}
          {/*                    </Link>*/}
          {/*                </div>*/}
          {/*            </div>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <div*/}
          {/*        className="col-lg-4 col-md-6 col-sm-6 col-12"*/}
          {/*    >*/}
          {/*        <div className="rbt-card variation-01 rbt-hover">*/}
          {/*            <div className="rbt-card-img">*/}
          {/*                <Skeleton height={150}/>*/}
          {/*            </div>*/}
          {/*            <div className="rbt-card-body">*/}
          {/*                <h4 className="rbt-card-title">*/}
          {/*                    <Skeleton height={30}/>*/}
          {/*                </h4>*/}
          {/*                <ul className="rbt-meta">*/}
          {/*                    <li>*/}
          {/*                        <Skeleton height={30} width={30}/>*/}
          {/*                    </li>*/}
          {/*                    <li>*/}
          {/*                        <Skeleton height={30} width={30}/>*/}
          {/*                    </li>*/}
          {/*                </ul>*/}
          {/*                /!**!/*/}
          {/*                <Skeleton height={30}/>*/}
          {/*                /!**!/*/}
          {/*                <div className="rbt-author-meta mb--20">*/}
          {/*                    <div className="rbt-avater">*/}
          {/*                    </div>*/}
          {/*                    <div className="rbt-author-info">*/}
          {/*                        <Skeleton height={30}/>*/}
          {/*                    </div>*/}
          {/*                </div>*/}
          {/*                <div className="rbt-card-bottom">*/}
          {/*                    <div className="rbt-price">*/}
          {/*                        <Skeleton height={30} width={80}/>*/}
          {/*                    </div>*/}
          {/*                    <Link className="rbt-btn-link" href="/course-details">*/}
          {/*                        <Skeleton height={30} width={50}/>*/}
          {/*                    </Link>*/}
          {/*                </div>*/}
          {/*            </div>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <div*/}
          {/*        className="col-lg-4 col-md-6 col-sm-6 col-12"*/}
          {/*    >*/}
          {/*        <div className="rbt-card variation-01 rbt-hover">*/}
          {/*            <div className="rbt-card-img">*/}
          {/*                <Skeleton height={150}/>*/}
          {/*            </div>*/}
          {/*            <div className="rbt-card-body">*/}
          {/*                <h4 className="rbt-card-title">*/}
          {/*                    <Skeleton height={30}/>*/}
          {/*                </h4>*/}
          {/*                <ul className="rbt-meta">*/}
          {/*                    <li>*/}
          {/*                        <Skeleton height={30} width={30}/>*/}
          {/*                    </li>*/}
          {/*                    <li>*/}
          {/*                        <Skeleton height={30} width={30}/>*/}
          {/*                    </li>*/}
          {/*                </ul>*/}
          {/*                /!**!/*/}
          {/*                <Skeleton height={30}/>*/}
          {/*                /!**!/*/}
          {/*                <div className="rbt-author-meta mb--20">*/}
          {/*                    <div className="rbt-avater">*/}
          {/*                    </div>*/}
          {/*                    <div className="rbt-author-info">*/}
          {/*                        <Skeleton height={30}/>*/}
          {/*                    </div>*/}
          {/*                </div>*/}
          {/*                <div className="rbt-card-bottom">*/}
          {/*                    <div className="rbt-price">*/}
          {/*                        <Skeleton height={30} width={80}/>*/}
          {/*                    </div>*/}
          {/*                    <Link className="rbt-btn-link" href="/course-details">*/}
          {/*                        <Skeleton height={30} width={50}/>*/}
          {/*                    </Link>*/}
          {/*                </div>*/}
          {/*            </div>*/}
          {/*        </div>*/}
          {/*    </div>*/}

          {/*</> : <>*/}
          {/*    {getcourse.map((data, index) => {*/}
          {/*        return (*/}
          {/*            <>*/}
          {/*                <div*/}
          {/*                    key={index}*/}
          {/*                    className="col-lg-4 col-md-6 col-sm-6 col-12"*/}
          {/*                >*/}
          {/*                    <div className="rbt-card variation-01 rbt-hover">*/}
          {/*                        <div className="rbt-card-img">*/}
          {/*                            <img*/}
          {/*                                src={data.sImagePath}*/}
          {/*                                className={'w-100'}*/}
          {/*                                // width={355}*/}
          {/*                                // height={244}*/}
          {/*                                alt="Card image"*/}
          {/*                            />*/}
          {/*                        </div>*/}
          {/*                        <div className="rbt-card-body">*/}
          {/*                            <div className="rbt-card-top">*/}
          {/*                                <div className="rbt-review">*/}
          {/*                                    <div className="rating">*/}
          {/*                                        <i className="fas fa-star"></i>*/}
          {/*                                        <i className="fas fa-star"></i>*/}
          {/*                                        <i className="fas fa-star"></i>*/}
          {/*                                        <i className="fas fa-star"></i>*/}
          {/*                                        <i className="fas fa-star"></i>*/}
          {/*                                    </div>*/}
          {/*                                    <span className="rating-count">*/}
          {/*              {" "}*/}
          {/*                                        (0 Reviews)*/}
          {/*            </span>*/}
          {/*                                </div>*/}
          {/*                                <div className="rbt-bookmark-btn">*/}
          {/*                                    <Link*/}
          {/*                                        className="rbt-round-btn"*/}
          {/*                                        title="Bookmark"*/}
          {/*                                        href="#"*/}
          {/*                                    >*/}
          {/*                                        <i className="feather-bookmark"></i>*/}
          {/*                                    </Link>*/}
          {/*                                </div>*/}
          {/*                            </div>*/}
          {/*                            <h4 className="rbt-card-title">*/}
          {/*                                <Link href={''}>{data.sCourseTitle}</Link>*/}
          {/*                            </h4>*/}
          {/*                            <ul className="rbt-meta">*/}
          {/*                                <li>*/}
          {/*                                    <i className="feather-book"></i>*/}
          {/*                                    Lessons*/}
          {/*                                </li>*/}
          {/*                                <li>*/}
          {/*                                    <i className="feather-users"></i>*/}
          {/*                                    Students*/}
          {/*                                </li>*/}
          {/*                            </ul>*/}
          {/*                            /!**!/*/}
          {/*                            <p className="rbt-card-text">{data.sShortDesc.substring(0, 100)}</p>*/}
          {/*                            /!**!/*/}
          {/*                            <div className="rbt-author-meta mb--20">*/}
          {/*                                <div className="rbt-avater">*/}
          {/*                                    <Link href={``}>*/}
          {/*                                        <img*/}
          {/*                                            src={data.sPhoto}*/}
          {/*                                            width={33}*/}
          {/*                                            height={33}*/}
          {/*                                            alt="Sophia Jaymes"*/}
          {/*                                        />*/}
          {/*                                    </Link>*/}
          {/*                                </div>*/}
          {/*                                <div className="rbt-author-info">*/}
          {/*                                    By{" "}*/}
          {/*                                    <Link href={``}>{data.sFName} {data.sLName}</Link>{" "}*/}
          {/*                                    In {" "}*/}
          {/*                                    <Link href="#">{data.sCategory}</Link>*/}
          {/*                                </div>*/}
          {/*                            </div>*/}
          {/*                            <div className="rbt-card-bottom">*/}
          {/*                                <div className="rbt-price">*/}
          {/*                                    <span className="current-price">₹ {data.dAmount}</span>*/}
          {/*                                    <span className="off-price">{data.nCourseAmount}</span>*/}
          {/*                                </div>*/}
          {/*                                <Link className="rbt-btn-link" href="/course-details">*/}
          {/*                                    Learn More<i className="feather-arrow-right"></i>*/}
          {/*                                </Link>*/}
          {/*                            </div>*/}
          {/*                        </div>*/}
          {/*                    </div>*/}
          {/*                </div>*/}
          {/*            </>*/}
          {/*        )*/}
          {/*    })}*/}
          {/*</>}*/}

        </div>
      </>
  );
};

export default SimilarCourses;
