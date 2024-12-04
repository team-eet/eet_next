import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import EventData from "../../data/events.json";
import { useEffect, useState } from "react";
import Axios from "axios";
import {API_URL, API_KEY} from '../../constants/constant'
import Moment from 'moment'
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {EncryptData} from "@/components/Services/encrypt-decrypt";

const EventCarouse = () => {
  const REACT_APP = API_URL
  const [courseitem, setcourseitem] = useState([]);
  const [chkUpcm, setchkUpcm] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString); // Create a Date object from the dateTimeString
    const day = date.getDate(); // Get the day of the month (1-31)
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()]; // Get the month name (short form)
    const year = date.getFullYear(); // Get the year (4-digit)

    const paddedDay = (day < 10) ? `0${day}` : day;
    // Construct the formatted date string in the "DD-Mon-YYYY" format
    const formattedDate = `${paddedDay}-${month}-${year}`;
    return formattedDate;
  }
  const getCourse = () => {
    let upc_chk = false
    Axios.get(`${API_URL}/api/coursemain/GetUpcomingCoursesMem/2`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log('Upcoming Course', res.data)
          if (res.data) {
            if (res.data.length !== 0) {
              setcourseitem(res.data)
              setisLoading(false)

              if (res.data.length !== 0) {
                for (let i = 0; i < res.data.length; i++) {
                  if (res.data[i].sUpcomingDate) {
                    if (((Moment(res.data[i].sUpcomingDate).format('YYYY-MM-DD')) >= Moment(new Date()).format('YYYY-MM-DD'))) {



                      let str1 = res.data[i].sUpcomingTime.toString()
                      let str2 = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

                      str1 = str1.split(':')
                      str2 = str2.split(':')

                      const totalSeconds1 = parseInt((str1[0] * 3600) + (str1[1] * 60) + str1[0])
                      const totalSeconds2 = parseInt((str2[0] * 3600) + (str2[1] * 60) + str2[0])
                      // console.log(totalSeconds1, totalSeconds2)
                      if ((totalSeconds1 <= totalSeconds2)) {
                        upc_chk = true
                        setchkUpcm(true)
                      }
                    }
                  }

                }

                // if (upc_chk) {
                //   const arrowPrev = document.querySelector('.relatedcourse-cardslider .swiper-container .swiper-button-prev')
                //   const arrowNext = document.querySelector('.relatedcourse-cardslider .swiper-container .swiper-button-next')
                //
                //   if (res.data.length <= 4) {
                //     arrowPrev.style.display = 'none'
                //     arrowNext.style.display = 'none'
                //   }
                // }

              }


            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  useEffect(() => {
    getCourse()
  }, [])

  return (
    <>
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
           <div className={'col-lg-4 col-4'}>
             <div className="single-slide">
               <div className="rbt-card event-grid-card variation-01 rbt-hover">
                 <div className="rbt-card-img">
                   <Skeleton height={150} />
                 </div>
                 <div className="rbt-card-body">
                   <ul className="rbt-meta">
                     <li>
                       <Skeleton height={20} width={50} />
                     </li>
                     <li>
                       <Skeleton height={20} width={50} />
                     </li>
                   </ul>
                   <h4 className="rbt-card-title">
                     <Skeleton />
                   </h4>
                   {/**/}
                   <div className="read-more-btn">

                     <Skeleton height={20} width={80} />
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <div className={'col-lg-4 col-4'}>
             <div className="single-slide">
               <div className="rbt-card event-grid-card variation-01 rbt-hover">
                 <div className="rbt-card-img">
                   <Skeleton height={150} />
                 </div>
                 <div className="rbt-card-body">
                   <ul className="rbt-meta">
                     <li>
                       <Skeleton height={20} width={50} />
                     </li>
                     <li>
                       <Skeleton height={20} width={50} />
                     </li>
                   </ul>
                   <h4 className="rbt-card-title">
                     <Skeleton />
                   </h4>
                   {/**/}
                   <div className="read-more-btn">

                     <Skeleton height={20} width={80} />
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <div className={'col-lg-4 col-4'}>
             <div className="single-slide">
               <div className="rbt-card event-grid-card variation-01 rbt-hover">
                 <div className="rbt-card-img">
                   <Skeleton height={150} />
                 </div>
                 <div className="rbt-card-body">
                   <ul className="rbt-meta">
                     <li>
                       <Skeleton height={20} width={50} />
                     </li>
                     <li>
                       <Skeleton height={20} width={50} />
                     </li>
                   </ul>
                   <h4 className="rbt-card-title">
                     <Skeleton />
                   </h4>
                   {/**/}
                   <div className="read-more-btn">

                     <Skeleton height={20} width={80} />
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

        </> : <>
          {courseitem.map((data, index) => {
            return (
                <>
                  <SwiperSlide className="swiper-wrapper" key={index}>
                    <div className="swiper-slide">
                      <div className="single-slide">
                        <div className="rbt-card event-grid-card variation-01 rbt-hover">
                          <div className="rbt-card-img">
                            <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                              <Image
                                  src={data.sImagePath}
                                  width={710}
                                  height={480}
                                  alt="Card image"
                                  className={"position-relative"}
                              />
                              {/*/!*       */}
                            </Link>
                          </div>
                          <div className="rbt-card-body">
                            <ul className="rbt-meta">
                              <li>
                                <i className="feather-map-pin"></i> {formatDate(data.sUpcomingDate)}
                              </li>
                              <li>
                                <i className="feather-clock"></i> {data.sUpcomingTime}
                              </li>
                            </ul>
                            <h4 className="rbt-card-title">
                              <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                                {data.sCourseTitle}
                              </Link>
                            </h4>
                            {/**/}
                            <div className="read-more-btn">
                              <Link
                                  className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round"
                                  href={`/course-details/${EncryptData(data.nCId)}`}
                              >
                        <span className="icon-reverse-wrapper">
                          <span className="btn-text">View More</span>
                          <span className="btn-icon">
                            <i className="feather-arrow-right"></i>
                          </span>
                          <span className="btn-icon">
                            <i className="feather-arrow-right"></i>
                          </span>
                        </span>
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

        <div className="rbt-swiper-pagination" style={{ bottom: "0" }}></div>
      </Swiper>
    </>
  );
};

export default EventCarouse;
