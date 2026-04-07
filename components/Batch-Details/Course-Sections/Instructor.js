import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { API_URL, API_KEY } from "../../../constants/constant";
import img from '../../../public/images/client/blank-profile-picture-973460_1280.png'

const Instructor = ({ checkMatchCourses }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [instructorStats, setInstructorStats] = useState({
    courseCount: 0,
    batchCount: 0,
    studentCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!checkMatchCourses?.sFName) return;

    setStatsLoading(true);
    Axios.get(`${API_URL}/api/coursemain/GetBatchCoursesMem/0`, {
      headers: { ApiKey: `${API_KEY}` }
    }).then(res => {
      if (res.data && res.data.length > 0) {
        const instructorName = `${checkMatchCourses.sFName} ${checkMatchCourses.sLName}`.trim().toLowerCase();

        const instructorBatches = res.data.filter(c =>
            `${c.sFName} ${c.sLName}`.trim().toLowerCase() === instructorName
        );

        const uniqueCourseIds = [...new Set(instructorBatches.map(c => c.nCId))];
        const totalStudents = instructorBatches.reduce((sum, c) => sum + (parseInt(c.enroll_cnt) || 0), 0);

        setInstructorStats({
          courseCount: uniqueCourseIds.length,
          batchCount: instructorBatches.length,
          studentCount: totalStudents,
        });
      }
    }).catch(err => {
      console.error("Instructor stats error:", err);
    }).finally(() => {
      setStatsLoading(false);
    });
  }, [checkMatchCourses]);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const description = checkMatchCourses.sDesc || "";

  return (
      <>
        <div className="about-author border-0 pb--0 pt--0">
          <div className="section-title mb--30">
            <h4 className="rbt-title-style-3 text-start">Tutor</h4>
          </div>

          <div className="media align-items-center">
            {/* ── Avatar ── */}
            <div className="thumbnail">
              <Link href="">
                {checkMatchCourses.sProfilePhotoPath ? (
                    <img
                        src={checkMatchCourses.sProfilePhotoPath}
                        className="rounded-circle shadow cusBatchesImage"
                        width={150}
                        height={150}
                        alt="Instructor"
                    />
                ) : (
                    <Image
                        className="rounded-circle position-relative"
                        src={img}
                        width={150}
                        height={150}
                        alt="Author Images"
                    />
                )}
              </Link>
            </div>

            {/* ── Info ── */}
            <div className="media-body">
              <div className="author-info">

                {/* Name */}
                <h5 className="title text-start">
                  <Link className="hover-flip-item-wrapper" href="">
                    {checkMatchCourses.sFName} {checkMatchCourses.sLName}
                  </Link>
                </h5>

                {/* Degree / Specialization */}
                {(checkMatchCourses.sDegree || checkMatchCourses.sSpecialization) && (
                    <span className="b3 subtitle text-start d-block mb--10">
                                    {checkMatchCourses.sDegree}
                      {checkMatchCourses.sDegree && checkMatchCourses.sSpecialization && " · "}
                      {checkMatchCourses.sSpecialization}
                                </span>
                )}

                {/* Stats */}
                <ul className="rbt-meta mb--20 mt--10">
                  {/* Reviews & Rating */}
                  <li>
                    <i className="fa fa-star color-warning"></i>
                    {checkMatchCourses.user_rate_cnt || 0} Reviews
                    <span className="rbt-badge-5 ml--5">
                                        {checkMatchCourses.user_rate || 0} Rating
                                    </span>
                  </li>

                  {/* Students */}
                  <li>
                    <i className="feather-users"></i>
                    {statsLoading ? (
                        <span style={{ opacity: 0.5 }}>...</span>
                    ) : (
                        <span>{instructorStats.studentCount} Students</span>
                    )}
                  </li>

                  {/* Courses */}
                  <li>
                    <i className="feather-book"></i>
                    {statsLoading ? (
                        <span style={{ opacity: 0.5 }}>...</span>
                    ) : (
                        <span>{instructorStats.courseCount} Courses</span>
                    )}
                  </li>

                  {/* Batches */}
                  <li>
                    <i className="feather-layers"></i>
                    {statsLoading ? (
                        <span style={{ opacity: 0.5 }}>...</span>
                    ) : (
                        <span>{instructorStats.batchCount} Batches</span>
                    )}
                  </li>
                </ul>
              </div>

              {/* Description with Read More / Less */}
              {description.length > 0 && (
                  <div className="content">
                    <p className="b3 subtitle text-start" style={{ marginBottom: 0 }}>
                      {isExpanded || description.length <= 250
                          ? description
                          : `${description.substring(0, 250)}...`}

                      {description.length > 250 && (
                          <button
                              className="btn btn-link p-0 ms-1 border-0 bg-transparent"
                              onClick={toggleReadMore}
                              style={{
                                fontWeight: 700,
                                color: "#3d59f5",
                                fontSize: "inherit",
                                textDecoration: "none",
                                lineHeight: "inherit",
                                verticalAlign: "baseline",
                                cursor: "pointer",
                              }}
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                          </button>
                      )}
                    </p>
                  </div>
              )}

            </div>
          </div>
        </div>
      </>
  );
};

export default Instructor;