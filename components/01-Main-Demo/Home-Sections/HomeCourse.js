
import Image from "next/image";
import Link from "next/link";
import Axios from 'axios'
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import { API_URL, API_KEY } from '../../../constants/constant'
// import API_KEY from '../../../pages/constant'
import { SuccessAlert, SuccessAlert2, ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


import MainDemoData from "../../../data/course-details/courseData.json";
import {useEffect, useState} from "react";
import {EncryptData} from "@/components/Services/encrypt-decrypt";

const HomeCourses = ({ start, end }) => {
    const REACT_APP = API_URL
    const [getcourseData, setcourseData] = useState([])
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        getCourse();
    }, [])
    const getCourse = () => {
        Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/0`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    // console.log(res.data)
                    if (res.data.length !== 0) {
                        setcourseData(res.data)
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
            {isLoading ? <>
                <div className="rbt-card variation-01 rbt-hover">
                    <div className="rbt-card-img">
                        <Skeleton height={150} width={268} className='lh-20'/>
                    </div>
                    <div className="rbt-card-body">
                        <ul className="rbt-meta">
                            <li>
                                <Skeleton height={20} width={80} />
                            </li>
                            <li>
                                <Skeleton height={20} width={80} />
                            </li>
                            <li>
                                <Skeleton height={20} width={80} />
                            </li>
                        </ul>
                        <h4 className="rbt-card-title">
                            <Skeleton height={20} width={80} />
                        </h4>

                        <p className="rbt-card-text"><Skeleton /></p>

                        <div className="rbt-review">
                            <Skeleton height={20} width={200} />
                        </div>
                        <div className="rbt-card-bottom">
                            <div className="rbt-price">
                                <span className="current-price"> <Skeleton height={20} width={80} /></span>
                                <span className="off-price"> <Skeleton height={20} width={80} /></span>
                            </div>

                        </div>
                    </div>
                </div>
            </> : <>
                <Swiper
                    className="swiper-wrapper"
                    effect={"cards"}
                    modules={[EffectCards, Pagination]}
                    grabCursor={true}
                    pagination={{
                        el: ".rbt-swiper-pagination",
                        clickable: true,
                    }}
                >
                    {getcourseData && getcourseData.map((data, index) => {
                        return (
                            <>
                                <SwiperSlide className="swiper-slide" key={index}>
                                    <div className="rbt-card variation-01 rbt-hover">
                                        <div className="rbt-card-img">
                                            <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                                                <img className={"position-relative"} objectFit="none" fill={true} src={data.sImagePath} alt="Card image"></img>
                                            </Link>
                                        </div>
                                        <div className="rbt-card-body">
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
                                            <h4 className="rbt-card-title">
                                                <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                                                    {data.sCourseTitle}
                                                </Link>
                                            </h4>
                                            {data.sShortDesc.length > 165 ?
                                                <p className="rbt-card-text">{data.sShortDesc.substring(0, 110)}...</p> :
                                                <p className="rbt-card-text">{data.sShortDesc}</p>
                                            }
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
                                            <div className="rbt-card-bottom">
                                                <div className="rbt-price">
                                                    <span className="current-price">₹{data.dAmount}</span>
                                                    <span className="off-price">₹{data.nCourseAmount}</span>
                                                </div>
                                                <Link
                                                    className="rbt-btn-link"
                                                    href={`/course-details/${EncryptData(data.nCId)}`}
                                                >
                                                    Learn More
                                                    <i className="feather-arrow-right"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </>
                        )
                    })}
                    {/*{MainDemoData &&*/}
                    {/*  MainDemoData.courseDetails.slice(start, end).map((data, index) => (*/}
                    {/*  */}
                    {/*  ))}*/}
                    <div className="rbt-swiper-pagination"></div>
                </Swiper>
            </>}

        </>
    );
};

export default HomeCourses;

