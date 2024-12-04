import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination } from "swiper/modules";

import EventData from "../../data/events.json";
import {API_URL, API_KEY} from "../../constants/constant";
import Axios from "axios";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {useEffect, useState} from "react";

const ModuleCarousel = ({ Cid }) => {
  const REACT_APP = API_URL

  const [getModule, setModule] = useState([])
  // console.log(Cid)

  const getCourseModule = () => {
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1];
    // console.log(courseId)
    Axios.get(`${API_URL}/api/courseModule/GetModule/${EncryptData(parseInt(courseId))}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            // console.log(res.data)
            setModule(res.data)
            // if (res.data.length !== 0) {
            //   this.setState({
            //     modulearray: res.data
            //   })
            //
            //   if (this.state.Mid === '') {
            //     this.setState({
            //       Mid: res.data[0]['nMId']
            //     })
            //   }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  useEffect(() => {
    getCourseModule()
  }, []);
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
        {getModule.map((data, index) => (
          <SwiperSlide className="swiper-wrapper" key={index}>
            <div className="swiper-slide">
              <div className="single-slide">
                <div className="rbt-card event-grid-card variation-01 rbt-hover">
                  <div className="rbt-card-img">
                    <Link href={`/event-details/${data.id}`}>
                      <img src={data.sImagePath} width={710}
                           height={480}></img>
                      <div className="rbt-badge-3 bg-white">
                        <span>{data.badgeDate}</span>
                        <span>{data.badgeYear}</span>
                      </div>
                    </Link>
                  </div>
                  <div className="rbt-card-body">
                    <ul className="rbt-meta">
                      <li>
                        <i className="fa fa-book"></i> {data.section_cnt} Sections
                      </li>
                      <li>
                        <i className="fa fa-list"></i> {data.lesson_cnt} Lessons
                      </li>
                    </ul>
                    <h4 className="rbt-card-title">
                      <Link href={`/event-details/${data.id}`}>
                        {data.sModuleTitle}
                      </Link>
                    </h4>

                    <div className="read-more-btn">
                      <Link
                        className="rbt-btn btn-border hover-icon-reverse btn-sm radius-round"
                        href={`/event-details/${data.id}`}
                      >
                        <span className="icon-reverse-wrapper">
                          <span className="btn-text">Get Ticket</span>
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
        ))}

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

export default ModuleCarousel;
