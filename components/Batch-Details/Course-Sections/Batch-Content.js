import Link from "next/link";
import React, {useEffect, useLayoutEffect, useState} from "react";
import { API_URL, API_KEY } from "../../../constants/constant";
import {useRouter} from "next/router";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { useParams} from "react-router-dom";

const BatchContent = () => {
  const REACT_APP = API_URL
  const router = useRouter();
  const postId = parseInt(router.query.courseId);
  // console.log(router)
  // console.log(checkMatchCourses)
  const [getsectionItems, setsectionItems] = useState([])

  const getcourseContent = () => {
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1]; // Gets the last part of the URL
    // console.log(courseId)
    Axios.get(`${API_URL}/api/section/GetBatchCoursesSummaryAll/${EncryptData(parseInt(courseId))}/${EncryptData(0)}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data.length !== 0) {
            console.log("batch Page ",res.data);
            setsectionItems(res.data)
          }
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
                      {JSON.parse(item.lessionTbl).map((list, subIndex) => (
                        <li key={subIndex}>
                          <Link href="/lesson">
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
  );
};

export default BatchContent;
