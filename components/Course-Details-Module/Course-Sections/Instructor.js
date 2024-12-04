import Image from "next/image";
import Link from "next/link";
import React from "react";
import img from "@/public/images/testimonial/client-01.png";

const Instructor = ({ checkMatchCourses }) => {
    console.log('checkMatchCourses', checkMatchCourses)
  return (
      <>
          <div className="about-author border-0 pb--0 pt--0">
              <div className="section-title mb--30">
                  <h4 className="rbt-title-style-3 text-start">Tutor</h4>
              </div>
              {/*{checkMatchCourses.body.map((teacher, innerIndex) => (*/}
              <div className="row align-items-center">
                  <div className="col-lg-4 thumbnail">
                      <Link href={``}>
                          {/*<img src={checkMatchCourses.sProfilePhotoPath} width={250} height={250}></img>*/}
                          <Image
                            className={'position-relative'}
                            src={checkMatchCourses.sProfilePhotoPath}
                            width={250}
                           height={250}
                            alt="Author Images"
                          />
                      </Link>
                  </div>
                  <div className="col-lg-8 media-body">
                      <div className="author-info">
                          <h5 className="title text-start">
                              <Link
                                  className="hover-flip-item-wrapper "
                                  // href={`/profile/${teacher.id}`}
                                  href={``}
                              >
                                  {checkMatchCourses.sFName} {checkMatchCourses.sLName}
                              </Link>
                          </h5>
                          <span className="b3 subtitle text-start">{checkMatchCourses.sDegree} ({checkMatchCourses.sSpecialization})</span>
                          <ul className="rbt-meta mb--20 mt--10">
                              <li>
                                  <i className="fa fa-star color-warning"></i>
                                  0 Reviews
                                  <span className="rbt-badge-5 ml--5">
                      {checkMatchCourses.user_rate_cnt} Rating
                    </span>
                              </li>
                              <li>
                                  <i className="feather-users"></i> 0
                                  Students
                              </li>
                              <li>
                                  <Link href="#">
                                      <i className="feather-video"></i>{checkMatchCourses.total_courses} Courses
                                  </Link>
                              </li>
                          </ul>
                      </div>
                      <div className="content">
                          <p className="description text-start">{checkMatchCourses.sDesc.substring(0,150)}....</p>

                          {/*<ul className="social-icon social-default icon-naked justify-content-start">*/}
                          {/*  {teacher.social.map((social, index) => (*/}
                          {/*    <li key={index}>*/}
                          {/*      <Link href={social.link}>*/}
                          {/*        <i className={`feather-${social.icon}`}></i>*/}
                          {/*      </Link>*/}
                          {/*    </li>*/}
                          {/*  ))}*/}
                          {/*</ul>*/}
                      </div>
                  </div>
              </div>
              {/*))}*/}
          </div>
      </>
  );
};



export default Instructor;
