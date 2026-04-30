import Link from "next/link";
import React, {useEffect, useLayoutEffect, useState} from "react";
import { API_URL, API_KEY } from "../../../constants/constant";
import {useRouter} from "next/router";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { useParams} from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
// random comments
// random comments
// random comments
// random comments
// random comments

const Content = () => {
  const REACT_APP = API_URL
  const router = useRouter();
  const postId = parseInt(router.query.courseId);
  // console.log(router)
  // console.log(checkMatchCourses)
  const [courseInfo, setCourseInfo] = useState(null);
  const [getsectionItems, setsectionItems] = useState([])
  const [isApiCall, setIsApiCall] = useState(0)
  const [isAlreadyPurchased, setIsAlreadyPurchased] = useState(false);
  const [isPurchaseChecking, setIsPurchaseChecking] = useState(true);
  const getcourseContent = () => {
    const url = window.location.href
    const parts = url.split("/");
    console.log("parts",parts)
    const courseId = parts[parts.length - 2]; // Gets the last part of the URL
    const batchId = parts[parts.length - 1]; // Gets the last part of the URL
    console.log("courseId",courseId)
    console.log("batchId",batchId)
    console.log("zeroid",EncryptData(0))
// Store for use in links
    const nCId = DecryptData(decodeURIComponent(parts[parts.length - 2]));
    const nTBId = DecryptData(decodeURIComponent(parts[parts.length - 1]));
    setCourseInfo({ nCId, nTBId, nCLId: 2 });
    Axios.get(`${API_URL}/api/section/GetBatchCourseSummaryAll/${courseId}/${EncryptData(0)}/${batchId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          //alert(res.data.length)
          if (res.data.length !== 0) {
          console.log("batch Page ",res.data);
            setsectionItems(res.data)
            setCourseInfo(prev => ({ ...prev, nCLId: res.data[0]?.nCLId || 2 }));
          }
          setIsApiCall(1)
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  useEffect(() => {
    getcourseContent();
    checkIfAlreadyPurchased();
  }, []);
  // },[])

  const checkIfAlreadyPurchased = () => {
    if (!localStorage.getItem("userData")) {
      setIsPurchaseChecking(false);
      return;
    }

    const nTBId = DecryptData(decodeURIComponent(window.location.href.split("/").pop()));
    const udata = DecryptData(localStorage.getItem("userData"));
    const regId = typeof udata === "string" ? JSON.parse(udata).regid : udata.regid;

    Axios.get(`${API_URL}/api/purchasedCourse/GetPurchasedBatch/${regId}`, {
      headers: { ApiKey: `${API_KEY}` }
    })
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            const alreadyBought = res.data.some(
                item => Number(item.nTBId) === Number(nTBId)
            );
            setIsAlreadyPurchased(alreadyBought);
          }
        })
        .catch(err => console.log("Purchase check error:", err))
        .finally(() => setIsPurchaseChecking(false));
  };


  return (
      <>
        {isPurchaseChecking ? (
            <div className="text-center py-4"><Skeleton width={200} height={20}/></div>
        ) : isApiCall === 0 ? <>
          <div className="rbt-course-feature-inner">
            {/* Skeleton for the Course Content title */}
            <Skeleton width={150} height={20}/>
            <Skeleton height={1} style={{marginBottom: '15px'}}/>

            <div className="d-flex justify-content-between">
              <div className="title">
                <Skeleton width={150} height={40}/>
              </div>
              <div className="plus">
                <Skeleton width={40} height={40}/>
              </div>
            </div>
            <Skeleton height={1} style={{marginBottom: '15px'}}/>


            {/* Skeleton for each accordion item */}
            <div className="accordion" id="accordionExampleb2">
              {[...Array(10)].map((_, index) => (
                  <div className="accordion-item card border-0" key={index}>

                    {/* Accordion body */}
                    <div id={`collapseTwo${index + 1}`} className="accordion-collapse collapse show">
                      <div className="accordion-body card-body pr--0">
                        <ul className="rbt-course-main-content liststyle">
                          {/* Skeleton for course content item */}
                          {[...Array(1)].map((_, subIndex) => (
                              <li key={subIndex}>
                                <a href="javascript:void(0)">
                                  <div className="course-content-left">
                                    <Skeleton width={250} height={20}/>
                                  </div>
                                  <div className="course-content-right">
                                    <Skeleton width={100} height={20} style={{margin: '0px'}}/>
                                    <Skeleton width={80} height={20} style={{margin: '0px'}}/>
                                  </div>
                                </a>
                              </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </> : <>
          <div className="rbt-course-feature-inner">
            <div className="section-title">
              <h4 className="rbt-title-style-3 text-start">Course Content</h4>
            </div>
            <div className="rbt-accordion-style rbt-accordion-02 accordion">
              <div className="accordion" id="accordionExampleb2">
                {getsectionItems && getsectionItems.map((item, innerIndex) => (
                    <div className="accordion-item card" key={innerIndex}>
                      <h2
                          className="accordion-header card-header"
                          id={`headingTwo${innerIndex}`}
                      >
                        <button
                            className={`accordion-button ${
                                innerIndex === 0 ? "collapsed" : ""
                            }`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapseTwo${innerIndex + 1}`}
                            aria-expanded={item.expand}
                            aria-controls={`collapseTwo${innerIndex + 1}`}
                        >
                          {item.sSectionTitle}
                          <span className="rbt-badge-5 ml--10">{item.act_Total} Activities</span>
                        </button>
                      </h2>
                      <div
                          id={`collapseTwo${innerIndex + 1}`}
                          className={`accordion-collapse collapse ${
                              innerIndex === 0 ? "show" : ""
                          }`}
                          aria-labelledby={`headingTwo${innerIndex}`}
                          data-bs-parent="#accordionExampleb2"
                      >
                        <div className="accordion-body card-body pr--0">
                          <ul className="rbt-course-main-content liststyle">
                            {JSON.parse(item.lessionTbl).map((list, subIndex) => (
                                <li key={subIndex}>
                                  {isAlreadyPurchased ? (
                                      <Link href={`/courselesson/${EncryptData({
                                        nACId: 0,
                                        nMId: 0,
                                        nCLId: courseInfo?.nCLId || 2,
                                        mode: EncryptData('N'),
                                        nCId: courseInfo?.nCId,
                                        nLId: list.nLId,
                                        nSId: item.nSId,
                                        nTBId: courseInfo?.nTBId,
                                      })}`}>
                                        <div className="course-content-left">
                                          <span className="text">{`Day - ${subIndex + 1}`} {list.sLessionTitle}</span>
                                        </div>
                                        <div className="course-content-right">
                                          <span className="min-lable">{list.act_cnt} Activities</span>
                                          <span className="rbt-badge variation-03 bg-primary-opacity">
          <i className="feather-eye"></i> Practise
        </span>
                                        </div>
                                      </Link>
                                  ) : (
                                      <a href="javascript:void(0)" style={{ cursor: 'not-allowed', opacity: 0.7 }}>
                                        <div className="course-content-left">
                                          <span className="text">{`Day - ${subIndex + 1}`} {list.sLessionTitle}</span>
                                        </div>
                                        <div className="course-content-right">
                                          <span className="min-lable">{list.act_cnt} Activities</span>
                                          <span className="course-lock">
          <i className="feather-lock"></i>
        </span>
                                        </div>
                                      </a>
                                  )}
                                </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </>
        }
      </>
  );
};

export default Content;
