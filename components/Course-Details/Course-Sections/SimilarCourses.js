import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import Axios from 'axios'
import {API_URL, API_KEY} from '../../../constants/constant'
import { DecryptData, EncryptData } from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {useRouter} from "next/router";

const SimilarCourses = ({ checkMatchCourses }) => {
    const router = useRouter();
  const REACT_APP = API_URL
  const [getcourse, setcourse] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const courseIds = router.asPath.split("/").pop();
    const getCourse = (courseId) => {
        // const url = window.location.href
        // const parts = url.split("/");
        // const courseId = parts[parts.length - 1];
        setcourse([]);
        setisLoading(true);
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
                                    const filteredCourses = res.data.filter(course => course.nCId !== DecryptData(courseId));

                                    // setcourse(res.data)
                                    setcourse(filteredCourses)
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
      if (courseIds && courseIds !== "[courseId]") {
          // alert(courseIds + " Hello World")
          getCourse(courseIds)
      }
  }, [router.asPath])
  return (
    <>
        {
            isLoading ?
                <div className="container">
                    <div className="section-title mb--30">
                          <span className="subtitle bg-primary-opacity mb-2">
                            <Skeleton width={200} height={20}/>
                          </span>
                          <h4 className="title">
                            <Skeleton width={250} height={28}/>
                          </h4>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="rbt-card variation-01 rbt-hover">

                            {/* Image Skeleton */}
                            <div className="rbt-card-img mb-3">
                                <Skeleton height={240} width={`100%`}/>
                            </div>

                            {/* Card Body */}
                            <div className="rbt-card-body">

                                {/* Top Rating & Bookmark */}
                                <div className="rbt-card-top d-flex justify-content-between align-items-center mb-2">
                                    <div className="rbt-review">
                                        <Skeleton width={100} height={20}/>
                                    </div>
                                    <div className="rbt-bookmark-btn">
                                        <Skeleton circle height={30} width={30}/>
                                    </div>
                                </div>

                                {/* Title */}
                                <h4 className="rbt-card-title mb-2">
                                    <Skeleton height={22} width={`80%`}/>
                                </h4>

                                {/* Meta Info */}
                                <ul className="rbt-meta d-flex gap-3 mb-2 list-unstyled">
                                    <li><Skeleton width={80} height={16}/></li>
                                    <li><Skeleton width={80} height={16}/></li>
                                </ul>

                                {/* Description */}
                                <p className="rbt-card-text mb-3">
                                    <Skeleton count={2} height={14}/>
                                </p>

                                {/* Author Info */}
                                <div className="rbt-author-meta d-flex align-items-center gap-2 mb-3">
                                    <Skeleton circle height={33} width={33}/>
                                    <div className="rbt-author-info">
                                        <Skeleton width={100} height={14}/>
                                    </div>
                                </div>

                                {/* Price and Button */}
                                <div className="rbt-card-bottom d-flex justify-content-between align-items-center">
                                    <div className="rbt-price">
                                        <Skeleton width={60} height={20}/>
                                    </div>
                                    <Skeleton width={100} height={20}/>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                :

                getcourse.length > 0 && (
                    <div className="rbt-related-course-area bg-color-white pt--60 rbt-section-gapBottom">
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
                                                        <Link className="rbt-btn-link" href="javascript:void(0)">
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
                                                        <Link className="rbt-btn-link" href="javascript:void(0)">
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
                                                <SwiperSlide className="swiper-wrapper" key={index}>
                                                    <div className="swiper-slide">
                                                        <div className="single-slide">
                                                            <div className="rbt-card variation-01 rbt-hover">
                                                                <div className="rbt-card-img">
                                                                    {/*<Image*/}
                                                                    {/*    src={data.sImagePath}*/}
                                                                    {/*    className={'position relative'}*/}
                                                                    {/*    width={355}*/}
                                                                    {/*    height={244}*/}
                                                                    {/*    alt="Card image"*/}
                                                                    {/*/>*/}
                                                                    <img
                                                                        src={data.sImagePath}
                                                                        className={'position relative'}
                                                                        width={355}
                                                                        height={244}
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
                                                                            <span className="rating-count">
                              {" "}
                                                                                (0 Reviews)
                            </span>
                                                                        </div>
                                                                        <div className="rbt-bookmark-btn">
                                                                            <Link
                                                                                className="rbt-round-btn"
                                                                                title="Bookmark"
                                                                                href="javascript:void(0)"
                                                                            >
                                                                                <i className="feather-bookmark"></i>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="rbt-card-title">
                                                                        <Link
                                                                            href={`/course-details/${EncryptData(data.nCId)}`}>{data.sCourseTitle}</Link>
                                                                    </h4>
                                                                    <ul className="rbt-meta">
                                                                        <li>
                                                                            <i className="feather-book"></i>
                                                                            Lessons
                                                                        </li>
                                                                        <li>
                                                                            <i className="feather-users"></i>
                                                                            Students
                                                                        </li>
                                                                    </ul>
                                                                    {/**/}
                                                                    <p className="rbt-card-text">{data.sShortDesc.substring(0, 100)}</p>
                                                                    {/**/}
                                                                    <div className="rbt-author-meta mb--20">
                                                                        <div className="rbt-avater">
                                                                            <Link href={`javascript:void(0)`}>
                                                                                {/*<Image*/}
                                                                                {/*    src={data.sPhoto}*/}
                                                                                {/*    width={33}*/}
                                                                                {/*    className={'position-relative'}*/}
                                                                                {/*    height={33}*/}
                                                                                {/*    alt="Sophia Jaymes"*/}
                                                                                {/*/>*/}

                                                                                <img
                                                                                    src={data.sPhoto}
                                                                                    width={33}
                                                                                    className={'position-relative'}
                                                                                    height={33}
                                                                                    alt="Sophia Jaymes"
                                                                                />
                                                                            </Link>
                                                                        </div>
                                                                        <div className="rbt-author-info">
                                                                            By{" "}
                                                                            <Link
                                                                                href={`javascript:void(0)`}>{data.sFName} {data.sLName}</Link>
                                                                        </div>
                                                                    </div>
                                                                    <div className="rbt-card-bottom">
                                                                        <div className="rbt-price">
                                                                    <span
                                                                        className="current-price">₹ {data.dAmount}</span>
                                                                            <span
                                                                                className="off-price">{data.nCourseAmount}</span>
                                                                        </div>
                                                                        <Link className="rbt-btn-link"
                                                                              href={`/course-details/${EncryptData(data.nCId)}`}>
                                                                            Learn More<i
                                                                            className="feather-arrow-right"></i>
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
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
                    </div>
                    )}
                </>
            );
        };

        export default SimilarCourses;
