import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";


import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "@/context/Context";
import { addToCartAction } from "@/redux/action/CartAction";
import { API_URL, API_KEY } from "../../../constants/constant";
import {useRouter} from "next/router";
import Axios from "axios";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import Skeleton from "react-loading-skeleton";

const Viedo = ({ checkMatchCourses }) => {
  const REACT_APP = API_URL
  const router = useRouter();
  const postId = parseInt(router.query.courseId);

  const [getCntActivity, setCntActivity] = useState('')
  const [getCntVideo, setCntVideo] = useState(0)
  const [getCntPdf, setCntPdf] = useState(0)
  const [getCntImg, setCntImg] = useState('')
  const [getNumberCount, setNumberCount] = useState({});
  const [isApiCall, setAPiCall] = useState({});
  const [getvideoOpenData,setvideoOpenData] = useState('')
  const [showVideoModal, setShowVideoModal] = useState(false);
console.log("VideoData",checkMatchCourses)
   const getFeatureCount = (crsid) => {
    // console.log(checkMatchCourses.nCId)
     const url = window.location.href
     const parts = url.split("/");
     const courseId = parts[parts.length - 1];
     const course_mainId = parts[parts.length - 2];
// With this:
     console.log('courseId:', courseId, 'course_mainId:', course_mainId);

     // Debug - log raw responses of all 3 APIs
     Axios.get(`${API_URL}/api/package/Show_video_count/${EncryptData(parseInt(courseId))}`, {
       headers: { ApiKey: `${API_KEY}` }
     }).then(r => console.log('Show_video_count RAW:', JSON.stringify(r.data)))

     Axios.get(`${API_URL}/api/package/Show_pdf_count/${EncryptData(parseInt(courseId))}`, {
       headers: { ApiKey: `${API_KEY}` }
     }).then(r => console.log('Show_pdf_count RAW:', JSON.stringify(r.data)))

     Axios.get(`${API_URL}/api/coursemain/GetBatchDocumentCount/${course_mainId}`, {
       headers: { ApiKey: `${API_KEY}` }
     }).then(r => console.log('GetBatchDocumentCount RAW:', JSON.stringify(r.data)))

  //     //activity
       Axios.get(`${API_URL}/api/package/Show_activity_count/${EncryptData(parseInt(courseId))}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntActivity', res.data)
                setCntActivity(res.data[0].cntAct)
                // this.setState({
                //   CntActivity: res.data[0].cntAct
                // })

              }
              setAPiCall(prevState => ({ ...prevState, acttivity: 1 }));
            }

          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
     // With this:
     Axios.all([
       Axios.get(`${API_URL}/api/coursemain/GetBatchDocumentCount/${course_mainId}`, {
         headers: { ApiKey: `${API_KEY}` }
       }),
       Axios.get(`${API_URL}/api/package/Show_video_count/${EncryptData(parseInt(courseId))}`, {
         headers: { ApiKey: `${API_KEY}` }
       }),
       Axios.get(`${API_URL}/api/package/Show_pdf_count/${EncryptData(parseInt(courseId))}`, {
         headers: { ApiKey: `${API_KEY}` }
       })
     ]).then(Axios.spread((batchRes, videoRes, pdfRes) => {
       const batchData = batchRes.data.length !== 0 ? batchRes.data[0] : {};
       const videoUrlCount = videoRes.data.length !== 0 ? (videoRes.data[0].cntf || 0) : 0;
       const pdfUrlCount = pdfRes.data.length !== 0 ? (pdfRes.data[0].cntf || 0) : 0;
       console.log('BATCH:', batchData, 'VIDEO URL COUNT:', videoUrlCount, 'PDF URL COUNT:', pdfUrlCount);
       setNumberCount({
         ...batchData,
         video_count: (batchData.video_count || 0) + videoUrlCount,
         pdf_count: (batchData.pdf_count || 0) + pdfUrlCount,
       });
       setAPiCall(prevState => ({ ...prevState, pdfcount: 1 }));
     }))
         .catch(err => { ErrorDefaultAlert(err) })

  //     //image
      Axios.get(`${API_URL}/api/package/Show_image_count/${EncryptData(parseInt(courseId))}`, {
        headers: {
           ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntImg', res.data)
                setCntImg(res.data[0].cntf)
                // this.setState({
                //   CntImg: res.data[0].cntf
                // })
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
  //
  }

  useEffect(() => {
    getFeatureCount();
    // console.log(EncryptData('0'))
    if (checkMatchCourses.sVideoPath !== "") {
      setvideoOpenData(checkMatchCourses.sVideoPath)
    } else if (checkMatchCourses.sVideoURL !== "") {
      setvideoOpenData(checkMatchCourses.sVideoURL)
    } else {
      setvideoOpenData('')
    }
  }, [])
  console.log("getNumberCount",getNumberCount)


  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const [getsectionItems, setsectionItems] = useState([])
  const { cartToggle, setCart } = useAppContext();
  const [toggle, setToggle] = useState(false);


  // =====> Start ADD-To-Cart
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.CartReducer);

  const [amount, setAmount] = useState(1);

  const addToCartFun = (id, amount, product) => {
    dispatch(addToCartAction(id, amount, product));
    setCart(!cartToggle);
  };

    // Difference Day Left
    const nowDate = new Date();
    let dBatchStartDate = new Date(checkMatchCourses.dBatchStartDate);
    dBatchStartDate.setDate(dBatchStartDate.getDate() - 1);

    const timeDifference = dBatchStartDate - nowDate;

    const daysLeft = Math.max(0, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)));

    console.log(`Time left: ${daysLeft} day(s)`);

    //  Close

  useEffect(() => {
    dispatch({ type: "COUNT_CART_TOTALS" });
    localStorage.setItem("eetData", JSON.stringify(cart));
  }, []);


  return (
    <>
      {/*<Link*/}
      {/*  className={`video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15 ${*/}
      {/*    hideOnScroll ? "d-none" : ""*/}
      {/*  }`}*/}
      {/*  data-vbtype="video"*/}
      {/*  href={`${checkMatchCourses.sVideoPath !== "" ? checkMatchCourses.sVideoPath : ""}`}*/}
      {/*>*/}
      {/* Add state at top of component: const [showVideoModal, setShowVideoModal] = useState(false); */}

      <Link
          className="video-popup-with-text video-popup-wrapper text-center sidebar-video-hidden mb--15"

          href="javascript:void(0)"
          onClick={() => getvideoOpenData && setShowVideoModal(true)}
      >
        <div className="video-content">
          <Image className={"position-relative"} src={checkMatchCourses.sImagePath} height={255} width={355} />
          <div className="position-to-top">
      <span className="rbt-btn rounded-player-2 with-animation">
        <span className="play-icon"></span>
      </span>
          </div>
          <span className="play-view-text d-block color-white">
      <i className="feather-eye"></i> Preview this course
    </span>
        </div>
      </Link>

      {/* Video Modal */}
      {showVideoModal && (
          <div
              style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)", zIndex: 9999,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onClick={() => setShowVideoModal(false)}
          >
            <div
                style={{ width: "70%", maxWidth: "800px", position: "relative" }}
                onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                  onClick={() => setShowVideoModal(false)}
                  style={{
                    position: "absolute", top: "-40px", right: "0",
                    background: "transparent", border: "none",
                    color: "#fff", fontSize: "28px", cursor: "pointer", zIndex: 10
                  }}
              >
                <i className="feather-x"></i>
              </button>

              <Plyr
                  source={{
                    type: 'video',
                    sources: [{ src: getvideoOpenData }]
                  }}
                  options={{ autoplay: true }}
              />
            </div>
          </div>
      )}
      <div className="content-item-content">
        <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
          <div className="rbt-price">
            {
              checkMatchCourses.dAmount === 0 ? (
                  <span className="current-price">Free</span>
              ) : <span className="current-price">₹{checkMatchCourses.dAmount}</span>
            }

            {
              checkMatchCourses.nCourseAmount ? (
                  <span className="off-price">₹{checkMatchCourses.nCourseAmount}</span>
              ) : null
            }

          </div>
          <div className="discount-time">
            <span className="rbt-badge color-danger bg-color-danger-opacity">
              <i className="feather-clock"></i> {daysLeft} days
              left!
            </span>
          </div>
        </div>

        <div className="add-to-card-button mt--15">
          <Link
            className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
            href="#"
            onClick={() =>
              addToCartFun(checkMatchCourses.id, checkMatchCourses.dAmount, checkMatchCourses)
            }
          >
            <span className="btn-text">Add to Cart</span>
            <span className="btn-icon">
              <i className="feather-arrow-right"></i>
            </span>
          </Link>
        </div>

        <div className="buy-now-btn mt--15">
          <Link
            className="rbt-btn btn-border icon-hover w-100 d-block text-center"
            href="#"
          >
            <span className="btn-text">Buy Now</span>
            <span className="btn-icon">
              <i className="feather-arrow-right"></i>
            </span>
          </Link>
        </div>
        <div
          className={`rbt-widget-details has-show-more ${
            toggle ? "active" : ""
          }`}
        >
          <ul className="has-show-more-inner-content rbt-course-details-list-wrapper mt--10">
            <li className={'d-flex align-items-center'}>
              <span>Acitivity</span>
              {
                isApiCall.acttivity === 1 ? <>
                  <span className="rbt-feature-value rbt-badge-5">
                    {getNumberCount.activity_count}
                  </span>
                </> : <>
                  <Skeleton width="40px" height="20px"/>
                </>
              }
            </li>
            <li className={'d-flex align-items-center'}>
              <span>Acitivity Questions</span>
              {
                isApiCall.acttivity === 1 ? <>
                <span className="rbt-feature-value rbt-badge-5">
                    {getNumberCount.activity_question_count}
                  </span>
                </> : <>
                  <Skeleton width="40px" height="20px"/>
                </>
              }
            </li>
            <li className={'d-flex align-items-center'}>
              <span>Practice</span>
              {
                isApiCall.acttivity === 1 ? <>
                <span className="rbt-feature-value rbt-badge-5">
                    {getNumberCount.practice_count}
                  </span>
                </> : <>
                  <Skeleton width="40px" height="20px"/>
                </>
              }
            </li>
            <li className={'d-flex align-items-center'}>
              <span>Practice Questions</span>
              {
                isApiCall.acttivity === 1 ? <>
                <span className="rbt-feature-value rbt-badge-5">
                   {getNumberCount.practice_question_count}
                  </span>
                </> : <>
                  <Skeleton width="40px" height="20px"/>
                </>
              }
            </li>

          </ul>
          <div
              className={`rbt-show-more-btn ${toggle ? "active" : ""}`}
              onClick={() => setToggle(!toggle)}
          >
            {!toggle ? 'Show More' : ' Show Less'}
          </div>
        </div>

        <div className="social-share-wrapper mt--30 text-center">
          <div className="rbt-post-share d-flex align-items-center justify-content-center">
            <ul className="social-icon social-default transparent-with-border justify-content-around w-100">
              <li>
                {
                  isApiCall.pdfcount === 1 ? <>
                    <Link href="javascript:void(0);">
                      {(getNumberCount.video_count || 0)}
                    </Link>
                    <span className="rbt-feature-value rbt-badge-5">
                     VIDEOs
                  </span>
                  </> : <>
                    <a href="javascript:void(0);">
                      <Skeleton width="20px" height="20px"/>
                    </a>
                    <span className="rbt-feature-value rbt-badge-5">
                      <Skeleton width="60px" height="15px"/>
                    </span>
                  </>
                }

              </li>
              <li>
                {
                  isApiCall.pdfcount === 1 ? <>
                    <Link href="javascript:void(0);">
                      {(getNumberCount.pdf_count || 0)}

                    </Link>
                    <span className="rbt-feature-value rbt-badge-5">
                     PDFs
                    </span>
                  </> : <>
                    <a href="javascript:void(0);">
                      <Skeleton width="20px" height="20px"/>
                    </a>
                    <span className="rbt-feature-value rbt-badge-5">
                      <Skeleton width="60px" height="15px"/>
                    </span>
                  </>
                }
              </li>

            </ul>
          </div>
          <hr className="mt--20"/>
          <div className="contact-with-us text-center">
            <p>For details about the course</p>
            <p className="rbt-badge-2 mt--10 justify-content-center w-100">
              <i className="feather-help-circle mr--5"></i> Inquiry Now
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Viedo;
