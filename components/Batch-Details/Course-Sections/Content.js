import Link from "next/link";
import React, { useEffect, useState } from "react";
import { API_URL, API_KEY } from "../../../constants/constant";
import { useRouter } from "next/router";
import { DecryptData, EncryptData } from "@/components/Services/encrypt-decrypt";
import Axios from "axios";
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
const Content = ({ batchStartTime, batchEndTime, batchStartDate, batchEndDate, batchDays }) => {
  const REACT_APP = API_URL;
  const router = useRouter();
  const postId = parseInt(router.query.courseId);

  const [courseInfo, setCourseInfo] = useState(null);
  const [getsectionItems, setsectionItems] = useState([]);
  const [isApiCall, setIsApiCall] = useState(0);
  const [isAlreadyPurchased, setIsAlreadyPurchased] = useState(false);
  const [batchScheduleInfo, setBatchScheduleInfo] = useState(null);
  const [batchMeta, setBatchMeta] = useState(null);
  const [isPurchaseChecking, setIsPurchaseChecking] = useState(true);

  // Scheduled Links: nLId → { sBatchLink, isScheduled }
  const [scheduledLinks, setScheduledLinks] = useState({});

  // Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentLink, setCurrentLink] = useState("");
  const [currentLessonTitle, setCurrentLessonTitle] = useState("");
  const getcourseContent = () => {
    const url = window.location.href;
    const parts = url.split("/");
    const courseId = parts[parts.length - 2];
    const batchId = parts[parts.length - 1];

    const nCId = DecryptData(decodeURIComponent(parts[parts.length - 2]));
    const nTBId = DecryptData(decodeURIComponent(parts[parts.length - 1]));

    setCourseInfo({ nCId, nTBId, nCLId: 2 });

    // Fetch batch meta for date/time/days
    Axios.get(`${API_URL}/api/package/Show_activity_count/${batchId}`, {
      headers: { ApiKey: `${API_KEY}` }
    }).then(res => {
      console.log("📦 Batch Meta:", res.data);
      if (res.data) setBatchMeta(Array.isArray(res.data) ? res.data[0] : res.data);
    }).catch(err => console.log("Batch meta error:", err));
    Axios.get(`${API_URL}/api/section/GetBatchCourseSummaryAll/${courseId}/${EncryptData(0)}/${batchId}`, {
      headers: { ApiKey: `${API_KEY}` }
    })
        .then(res => {
          console.log("✅ Batch Course Summary Response:", res.data);
          if (res.data.length !== 0) {
            setsectionItems(res.data);
            setCourseInfo(prev => ({ ...prev, nCLId: res.data[0]?.nCLId || 2 }));
            fetchAllScheduledLinks(res.data, nTBId);
          }
          setIsApiCall(1);
        })
        .catch(err => {
          console.error("❌ GetBatchCourseSummaryAll Error:", err);
          ErrorDefaultAlert(err);
          setIsApiCall(1);
        });
  };
  const parseBatchTime = (timeStr) => {
    if (!timeStr) return null;
    const s = timeStr.trim();
    const noSpace = s.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
    const withSpace = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    const match = noSpace || withSpace;
    let hours, minutes;
    if (match) {
      hours = parseInt(match[1]);
      minutes = parseInt(match[2]);
      const mer = match[3].toLowerCase();
      if (mer === 'pm' && hours !== 12) hours += 12;
      if (mer === 'am' && hours === 12) hours = 0;
    } else {
      const parts = s.split(':');
      hours = parseInt(parts[0]);
      minutes = parseInt(parts[1]);
    }
    return { hours, minutes };
  };

  const isLessonCompleted = (lessonIndex) => {
    try {
      const lessonDate = getDateForLesson(lessonIndex);
      if (!lessonDate) return false;
      const endTime = batchEndTime || batchMeta?.sBatchEndTime;
      if (!endTime) return false;
      const parsed = parseBatchTime(endTime);
      if (!parsed) return false;
      const lessonEnd = new Date(lessonDate);
      lessonEnd.setHours(parsed.hours, parsed.minutes, 0, 0);
      return new Date() > lessonEnd;
    } catch (e) { return false; }
  };

  const isJoinEnabled = (lessonIndex) => {
    try {
      const lessonDate = getDateForLesson(lessonIndex);
      if (!lessonDate) return false;
      const startTime = batchStartTime || batchMeta?.sBatchStartTime;
      const endTime = batchEndTime || batchMeta?.sBatchEndTime;
      if (!startTime || !endTime) return false;
      const parsedStart = parseBatchTime(startTime);
      const parsedEnd = parseBatchTime(endTime);
      if (!parsedStart || !parsedEnd) return false;
      const lessonStart = new Date(lessonDate);
      lessonStart.setHours(parsedStart.hours, parsedStart.minutes, 0, 0);
      const lessonEnd = new Date(lessonDate);
      lessonEnd.setHours(parsedEnd.hours, parsedEnd.minutes, 0, 0);
      const now = new Date();
      const fifteenMinBefore = new Date(lessonStart.getTime() - 15 * 60 * 1000);
      return now >= fifteenMinBefore && now <= lessonEnd;
    } catch (e) { return false; }
  };
  // Fetch scheduled link for every lesson
  const fetchAllScheduledLinks = (sections, nTBId) => {
    sections.forEach(section => {
      const lessons = JSON.parse(section.lessionTbl || "[]");

      lessons.forEach(lesson => {
        const nLId = lesson.nLId;

        Axios.get(`${API_URL}/api/tutorBatchSchedule/GetTutorBatchSchedule/${EncryptData(nTBId)}/${EncryptData(nLId)}`, {
          headers: { ApiKey: `${API_KEY}` }
        })
            .then(res => {
              console.log("📅 Schedule API Response:", res.data[0]); // Check field names here
              if (res.data && res.data.length > 0 && res.data[0].sBatchLink?.trim()) {
                setScheduledLinks(prev => ({
                  ...prev,
                  [nLId]: {
                    sBatchLink: res.data[0].sBatchLink,
                    sBatchDate: res.data[0].sBatchDate,   // 👈 add this
                    sBatchTime: res.data[0].sBatchTime,   // 👈 add this
                    isScheduled: true
                  }
                }));
              } else {
                setScheduledLinks(prev => ({
                  ...prev,
                  [nLId]: { isScheduled: false }
                }));
              }
            })
            .catch(err => {
              console.error(`❌ Error fetching schedule for lesson ${nLId}:`, err);
              setScheduledLinks(prev => ({
                ...prev,
                [nLId]: { isScheduled: false }
              }));
            });
      });
    });
  };

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
            const matchedBatch = res.data.find(item => Number(item.nTBId) === Number(nTBId));
            console.log("🔍 Matched Batch Data:", matchedBatch);
            const alreadyBought = !!matchedBatch;
            setIsAlreadyPurchased(alreadyBought);
            if (matchedBatch) setBatchScheduleInfo(matchedBatch);
          }
        })
        .catch(err => console.log("Purchase check error:", err))
        .finally(() => setIsPurchaseChecking(false));
  };

  // Modal Handlers
  const openLinkModal = (link, lessonTitle) => {
    setCurrentLink(link);
    setCurrentLessonTitle(lessonTitle);
    setShowLinkModal(true);
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setCurrentLink("");
    setCurrentLessonTitle("");
  };

  const copyLink = () => {
    if (currentLink) {
      navigator.clipboard.writeText(currentLink);
      alert("Link copied to clipboard!");
    }
  };

  const joinMeeting = () => {
    if (currentLink) {
      window.open(currentLink, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    getcourseContent();
    checkIfAlreadyPurchased();
  }, []);
  console.log("🧪 Content Props Check:", { batchStartTime, batchEndTime, batchStartDate, batchEndDate, batchDays });
  const getDateForLesson = (lessonIndex) => {
    try {
      const rawDays = batchDays || batchMeta?.sDays;
      const rawStart = batchStartDate || batchMeta?.dBatchStartDate;
      const rawEnd = batchEndDate || batchMeta?.dBatchEndDate;

      const days = JSON.parse(rawDays || "[]");
      if (!days.length || !rawStart) return null;

      const dayNameToIndex = {
        Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
        Thursday: 4, Friday: 5, Saturday: 6
      };

      const parseLocal = (d) => {
        const dt = new Date(d);
        return new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
      };
      const start = parseLocal(rawStart);
      const end = parseLocal(rawEnd);
      const activeDayIndices = days.map(d => dayNameToIndex[d]);

      let count = 0;
      const cur = new Date(start);
      while (cur <= end) {
        if (activeDayIndices.includes(cur.getDay())) {
          if (count === lessonIndex) return new Date(cur);
          count++;
        }
        cur.setDate(cur.getDate() + 1);
      }
      return null;
    } catch { return null; }
  };
  return (
      <>
        {isPurchaseChecking ? (
            <div className="text-center py-4">
              <Skeleton width={200} height={20} />
            </div>
        ) : isApiCall === 0 ? (
            // Skeleton Loader
            <div className="rbt-course-feature-inner">
              <Skeleton width={150} height={20} />
              <Skeleton height={1} style={{ marginBottom: '15px' }} />
              <div className="d-flex justify-content-between">
                <div className="title"><Skeleton width={150} height={40} /></div>
                <div className="plus"><Skeleton width={40} height={40} /></div>
              </div>
              <Skeleton height={1} style={{ marginBottom: '15px' }} />
              <div className="accordion" id="accordionExampleb2">
                {[...Array(8)].map((_, index) => (
                    <div className="accordion-item card border-0" key={index}>
                      <div className="accordion-body card-body pr--0">
                        <ul className="rbt-course-main-content liststyle">
                          {[...Array(3)].map((_, subIndex) => (
                              <li key={subIndex}>
                                <Skeleton height={60} />
                              </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        ) : (
            <div className="rbt-course-feature-inner">
              <div className="section-title">
                <h4 className="rbt-title-style-3 text-start">Course Content</h4>
              </div>

              <div className="rbt-accordion-style rbt-accordion-02 accordion">
                <div className="accordion" id="accordionExampleb2">
                  {getsectionItems.map((item, innerIndex) => (
                      <div className="accordion-item card" key={innerIndex}>
                        <h2 className="accordion-header card-header" id={`headingTwo${innerIndex}`}>
                          <button
                              className={`accordion-button ${innerIndex === 0 ? "collapsed" : ""}`}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapseTwo${innerIndex + 1}`}
                              aria-expanded={innerIndex === 0}
                              aria-controls={`collapseTwo${innerIndex + 1}`}
                          >
                            {item.sSectionTitle}
                            <span className="rbt-badge-5 ml--10">{item.act_Total} Activities</span>
                          </button>
                        </h2>

                        <div
                            id={`collapseTwo${innerIndex + 1}`}
                            className={`accordion-collapse collapse ${innerIndex === 0 ? "show" : ""}`}
                            aria-labelledby={`headingTwo${innerIndex}`}
                            data-bs-parent="#accordionExampleb2"
                        >
                          <div className="accordion-body card-body pr--0">
                            <ul className="rbt-course-main-content liststyle">
                              {JSON.parse(item.lessionTbl || "[]").map((list, subIndex) => {
                                const schedule = scheduledLinks[list.nLId] || { isScheduled: false };
                                const isScheduled = schedule.isScheduled;
                                const link = schedule.sBatchLink;
                                const lessonDate = getDateForLesson(subIndex);
                                const lessonDateStr = lessonDate
                                    ? lessonDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                    : null;
                                return (
                                    <li key={subIndex}>
                                      {isAlreadyPurchased ? (
                                          <div className="d-flex justify-content-between align-items-center w-100" style={{ flexWrap: 'nowrap', gap: '8px' }}>
                                            {/* Lesson Link */}
                                            <Link
                                                href={`/courselesson/${EncryptData({
                                                  nACId: 0,
                                                  nMId: 0,
                                                  nCLId: courseInfo?.nCLId || 2,
                                                  mode: EncryptData('N'),
                                                  nCId: courseInfo?.nCId,
                                                  nLId: list.nLId,
                                                  nSId: item.nSId,
                                                  nTBId: courseInfo?.nTBId || nTBId   // fallbac
                                                })}`}
                                                className="flex-grow-1 text-decoration-none" style={{ minWidth: 0 }}
                                            >
                                              <div className="course-content-left">
    <span className="text">
        Day - {subIndex + 1} {list.sLessionTitle}
    </span>
                                                {(lessonDateStr || batchStartTime) && (
                                                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px', display: 'inline-flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap' }}>
                                                      {lessonDateStr && <span>📅 {lessonDateStr}</span>}
                                                      {(batchStartTime || batchMeta?.sBatchStartTime) && (
                                                          <span>🕐 {batchStartTime || batchMeta?.sBatchStartTime} — {batchEndTime || batchMeta?.sBatchEndTime}</span>
                                                      )}
                                                    </div>
                                                )}
                                              </div>
                                              <div className="course-content-right">
                                                <span className="min-lable">{list.act_cnt} Activities</span>
                                              </div>
                                            </Link>

                                            {/* Scheduled Button */}
                                            <div className="ms-3">
                                              {isLessonCompleted(subIndex) ? (
                                                  <button
                                                      className="schedule-btn"
                                                      disabled
                                                      style={{ backgroundColor: '#e6f9ed', color: '#1a7a3c', border: '1.5px solid #52c97a', borderRadius: '20px', padding: '5px 14px', fontWeight: 600, cursor: 'not-allowed', fontSize: '12px', whiteSpace: 'nowrap', minWidth: '120px' }}
                                                  >
                                                    Completed
                                                  </button>
                                              ) : isScheduled ? (
                                                  isJoinEnabled(subIndex) ? (
                                                      <button
                                                          className="schedule-btn scheduled immersive-btn"
                                                          style={{ backgroundColor: '#cc0000', color: '#fff', border: 'none', borderRadius: '20px', padding: '5px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', minWidth: '120px', boxShadow: '0 2px 8px rgba(204,0,0,0.25)' }}
                                                          onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
                                                      >
                                                        Join Now
                                                      </button>
                                                  ) : (
                                                      <>
                                                        <button
                                                            className="schedule-btn scheduled"
                                                            style={{ backgroundColor: '#eef3ff', color: '#3b5bdb', border: '1.5px solid #748ffc', borderRadius: '20px', padding: '5px 14px', fontWeight: 600, cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap', minWidth: '120px' }}
                                                            onClick={() => {
                                                              const toast = document.getElementById('batch-schedule-toast');
                                                              if (toast) { toast.style.display = 'flex'; clearTimeout(window._toastTimer); window._toastTimer = setTimeout(() => toast.style.display = 'none', 4000); }
                                                            }}
                                                        >
                                                          Scheduled
                                                        </button>

                                                        {/* Toast — place once, outside loops ideally, but works here too */}
                                                        <div id="batch-schedule-toast" style={{ display: 'none', position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: '10px', padding: '10px 20px', zIndex: 9999, alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                                          <span><strong>Class Not Started Yet.</strong> Join Now button appears 15 min before class starts.</span>
                                                          <span onClick={() => document.getElementById('batch-schedule-toast').style.display = 'none'} style={{ marginLeft: '10px', cursor: 'pointer', fontWeight: 700, color: '#065f46' }}>✕</span>
                                                        </div>
                                                      </>
                                                  )
                                              ) : (
                                                  <button
                                                      className="schedule-btn not-scheduled"
                                                      disabled
                                                      style={{ backgroundColor: '#f8f9fa', color: '#adb5bd', border: '1.5px solid #dee2e6', borderRadius: '20px', padding: '5px 14px', fontWeight: 600, cursor: 'not-allowed', fontSize: '12px', whiteSpace: 'nowrap', minWidth: '120px' }}
                                                  >
                                                    Not Scheduled
                                                  </button>
                                              )}
                                            </div>
                                          </div>
                                      ) : (
                                          <a href="javascript:void(0)" style={{ cursor: 'not-allowed', opacity: 0.7 }}>
                                            <div className="course-content-left" style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '8px' }}>
   <span className="text" style={{
     fontWeight: 600,
     transition: 'color 0.2s'
   }}
         onMouseEnter={e => { e.currentTarget.style.color = '#5078ff'; e.currentTarget.style.fontWeight = '700'; }}
         onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.fontWeight = '600'; }}
   >
    Day - {subIndex + 1} {list.sLessionTitle}
</span>
                                              {(lessonDateStr || batchStartTime) && (
                                                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px', display: 'inline-flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap' }}>
                                                    {lessonDateStr && <span>📅 {lessonDateStr}</span>}
                                                    {(batchStartTime || batchMeta?.sBatchStartTime) && (
                                                        <span>🕐 {batchStartTime || batchMeta?.sBatchStartTime} — {batchEndTime || batchMeta?.sBatchEndTime}</span>
                                                    )}
                                                  </div>
                                              )}
                                            </div>
                                            <div className="course-content-right">
                                              <span className="min-lable">{list.act_cnt} Activities</span>
                                              <span className="course-lock"><i className="feather-lock"></i></span>
                                            </div>
                                          </a>
                                      )}
                                    </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* Beautiful Modal */}
        {showLinkModal && (
            <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.6)' }}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold">Live Class Link</h5>
                    <button type="button" className="btn-close" onClick={closeLinkModal}></button>
                  </div>

                  <div className="modal-body">
                    <p className="text-muted mb-1">Class Title:</p>
                    <h6 className="mb-3">{currentLessonTitle}</h6>

                    <p className="text-muted mb-1">Meeting Link:</p>
                    <div className="input-group mb-3">
                      <input
                          type="text"
                          className="form-control"
                          value={currentLink}
                          readOnly
                      />
                      <button className="btn btn-outline-primary" onClick={copyLink}>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="modal-footer border-0">
                    <button className="btn btn-secondary" onClick={closeLinkModal}>
                      Close
                    </button>
                    <button className="btn btn-success px-4" onClick={joinMeeting}>
                      <i className="feather-log-in me-2"></i> Join Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default Content;