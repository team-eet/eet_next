import Image from "next/image";
import Link from "next/link";

import img from "../../public/images/banner/banner-01.png";
import shape1 from "../../public/images/shape/shape-01.png";
import shape2 from "../../public/images/shape/shape-02.png";

import HomeCourses from "./Home-Sections/HomeCourse";
import {useEffect, useState} from "react";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { API_URL,  API_KEY} from "../../constants/constant";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const MainDemoBanner = () => {
  const [verifySts, setverifySts] = useState(0)
  const REACT_APP = API_URL

  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setisLoading(false)
    }, 3000)
    if (localStorage.getItem('userData')) {
      Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            // console.log(res.data)
            if (res.data.length !== 0) {
              setverifySts(res.data[0]['bVerifyStatus'])
              setisLoading(false)
            }

          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
  }, []);
  return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pb--120 pt--70 space-responsive-xxl">
              <div className="content">
                <div className="inner">
                  <div className="rbt-new-badge rbt-new-badge-one">
                    <span className="rbt-new-badge-icon">🏆</span> We provide varieties of English Language Learning Courses and Batches
                  </div>

                  <h1 className="title">
                    Learn English <br/> Language
                  </h1>
                  <p className="description">
                    English Language Proficiency can be attained by attending our Courses and Batches.
                  </p>

                  {isLoading ? <>
                    <div className={'d-flex'}>
                      <Skeleton width={120} height={50} />
                      <Skeleton className={'ms-3'} width={120} height={50} />
                    </div>

                  </> : <>

                    <div className="slider-btn">
                      {
                        !localStorage.getItem('userData') ?
                            <Link
                                className="rbt-btn btn-gradient hover-icon-reverse mt-3 ms-3"
                                href="/register"
                            >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">Free Trial</span>
                      <span className="btn-icon">
                        <i className="feather-arrow-right"></i>
                      </span>
                      <span className="btn-icon">
                        <i className="feather-arrow-right"></i>
                      </span>
                    </span>
                            </Link> : null
                      }
                      {verifySts === 2 ? <>
                        <Link className="rbt-btn btn-gradient hover-icon-reverse mt-3 ms-3"
                              target='_blank' href="https://eet-frontend.azurewebsites.net/tutorbatch/dashboard"
                        >
                          <span className="icon-reverse-wrapper">
                            <span className="btn-text">Tutor</span>
                            <span className="btn-icon">
                                <i className="feather-arrow-right"></i>
                            </span>
                            <span className="btn-icon">
                              <i className="feather-arrow-right"></i>
                            </span>
                          </span>
                        </Link>
                      </> : <>
                        <Link
                            className="rbt-btn btn-gradient hover-icon-reverse mt-3 ms-3"
                            href="/become-a-teacher"
                        >
                        <span className="icon-reverse-wrapper">
                          <span className="btn-text">Become a tutor</span>
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
                  </>}

                </div>
                <div className="shape-wrapper" id="scene">
                  <Image src={img} width={1200} height={1400} alt="Hero Image"/>
                  <div className="hero-bg-shape-1 layer" data-depth="0.4">
                    <Image
                        src={shape1}
                        width={428}
                        height={377}
                        alt="Hero Image Background Shape"
                    />
                  </div>
                  <div className="hero-bg-shape-2 layer" data-depth="0.4">
                    <Image
                        src={shape2}
                        width={372}
                        height={396}
                        alt="Hero Image Background Shape"
                    />
                  </div>
                </div>

                <div className="banner-card pb--60 swiper rbt-dot-bottom-center banner-swiper-active">
                  <HomeCourses start={0} end={3}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default MainDemoBanner;
