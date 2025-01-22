import Link from "next/link";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {API_URL, API_KEY} from "../../../constants/constant";
import {useRouter} from "next/router";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { useParams} from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const Content = ({ checkMatchCourses }) => {
  const REACT_APP = API_URL
  const router = useRouter();
  const postId = parseInt(router.query.courseId);
  const [isApiCall, setIsApiCall] = useState(0)
  // console.log(router)
  // console.log(checkMatchCourses)
  const [getsectionItems, setsectionItems] = useState([])

  const getcourseContent = () => {
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1]; // Gets the last part of the URL
    console.log(DecryptData('mcFGoepMtDnWOC38Dn11sg=='), EncryptData(0))
    Axios.get(`${API_URL}/api/section/GetCourseSummaryAll/${courseId}/${EncryptData(0)}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          console.log(res.data)
          if (res.data.length !== 0) {
            // console.log(res.data)
            setsectionItems(res.data)
          }
          setIsApiCall(1)
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  useEffect(() => {
    getcourseContent();
  }, []);
  // },[])
  return (
    <>
      {
        isApiCall === 0 ? <>
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
                                !item.collapsed ? "collapsed" : ""
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
                              item.isShow ? "show" : ""
                          }`}
                          aria-labelledby={`headingTwo${innerIndex}`}
                          data-bs-parent="#accordionExampleb2"
                      >
                        <div className="accordion-body card-body pr--0">
                          <ul className="rbt-course-main-content liststyle">
                            {/*{console.log(JSON.parse(item.lessionTbl))}*/}
                            {JSON.parse(item.lessionTbl).map((list, subIndex) => (

                                <li key={subIndex}>
                                  {/*<Link href="/courselesson/mid/lid/pnviewid/cid">*/}
                                  {/*<Link href={`/${courselesson/list.nMId/lid/pnviewid/cid}`}>*/}
                                  <Link
                                      href={`/courselesson/${EncryptData(list.nCId)}/${EncryptData(list.nMId)}/${EncryptData(list.nLId)}/${EncryptData('N')}/${EncryptData(list.nCId)}`}>
                                    <div className="course-content-left">
                                      <i className="feather-play-circle"></i>
                                      <span className="text">{list.sLessionTitle}</span>
                                    </div>
                                    {/*{list.status ? (*/}
                                    <div className="course-content-right">
                                      <span className="min-lable">{list.act_cnt} Activities</span>
                                      <span className="rbt-badge variation-03 bg-primary-opacity">
                                  <i className="feather-eye"></i> Preview
                                </span>
                                    </div>
                                    {/*) : (*/}
                                    <div className="course-content-right">
                                <span className="course-lock">
                                  <i className="feather-lock"></i>
                                </span>
                                    </div>
                                    {/*)}*/}
                                  </Link>
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
