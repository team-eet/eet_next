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
              <div className="media align-items-center">
                  <div className="thumbnail">
                      <Link href={``}>
                          {checkMatchCourses.sProfilePhotoPath !== "" ?
                              <img src={checkMatchCourses.sProfilePhotoPath} className={'rounded-circle shadow cusBatchesImage'} width={150} height={150}></img> :
                              // <Image
                              //     src={img}
                              //     width={250}
                              //     height={250}
                              //     className={'position-relative'}
                              //     alt="Author Images"
                              // />}
                              <img
                                  src={img}
                                  width={150}
                                  height={150}
                                  className={'rounded-circle position-relative'}
                                  alt="Author Images"
                              />}
                      </Link>
                  </div>
                  <div className="media-body">
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
                              <li>
                                  <Link href="#">
                                      <i className="feather-video"></i>5 Batches
                                  </Link>
                              </li>
                          </ul>
                      </div>
                      <div className="content">
                          <p className="b3 subtitle text-start">{checkMatchCourses.sDesc && checkMatchCourses.sDesc.length > 250
                              ? `${checkMatchCourses.sDesc.substring(0, 250)} ............Read More`
                              : checkMatchCourses.sDesc}</p>

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
