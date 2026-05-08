import React, { Fragment, useState } from 'react';
import parse from 'html-react-parser';
import * as Icon from 'react-feather';
import { Card, CardBody, CardHeader, Row, Col, Progress } from 'reactstrap';
import Link from 'next/link';
import Image from 'next/image';
import { EncryptData } from "@/components/Services/encrypt-decrypt";
const CourseLessonBody = ({
                              isBatch,
                              activeTab,
                              sContent,
                              tutresourcearray,
                              quetypeItems,
                              SepActivitylist,
                              handleSepActivityPage,
                              singleActivityPage,
                              sepActivityPage,
                              activitySeperateCard,
                              handleBackActivity,
                              viewActivity,
                              userRegId,
                              sidebar,
                              setSidebar,
                              handleNext,
                              handlePrevious,
                              isLastTab,
                              openPreview,
                              lectureSchedules = {},
                              batchMeta = null,
                              LessonData = []
                          }) => {
    // State for description expansion in content tab
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    //  const [popupCard, setPopupCard] = useState(null); // NEW
    const [activeFilter, setActiveFilter] = useState('all'); // NEW
    const toggleDescription = (index) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Function to get file type icon
    const getFileTypeIcon = (item) => {
        if (item.nPFTId === 11) return <Icon.Video size={20} className="me-2" />;
        if (item.nPFTId === 12) return <Icon.FileText size={20} className="me-2" />;
        return <Icon.File size={20} className="me-2" />;
    };
    const filteredResources = tutresourcearray?.filter(item => {
        if (item.nContentFor !== 2) return false; // Only show nContentFor = 2
        if (activeFilter === 'all') return true;
        if (activeFilter === 'video') return item.nPFTId === 11;
        if (activeFilter === 'pdf') return item.nPFTId === 12;
        return true;
    });

    return (
        <div className="rbt-lesson-rightsidebar overflow-hidden lesson-video">
            {/* Top Bar */}
            <div className="lesson-top-bar">
                <div className="lesson-top-left">
                    <div className="rbt-lesson-toggle">
                        <button
                            className={`lesson-toggle-active btn-round-white-opacity ${!sidebar ? "sidebar-hide" : ""
                            }`}
                            title="Toggle Sidebar"
                            onClick={setSidebar}
                        >
                            <i className="feather-arrow-left"></i>
                        </button>
                    </div>
                    <h5>{isBatch.sCourseTitle}</h5>
                </div>
                <div className="lesson-top-right">
                    <div className="rbt-btn-close">
                        <a href={isBatch.bIsWithBatch === 'yes' ? '/student/student-enrolled-batch' : '/student/student-enrolled-course'}
                           className="rbt-round-btn"
                           title="Go Back to Course">
                            <i className="feather-x"></i>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="inner content">
                {/* Overview Tab */}
                {activeTab.tab === 'overview' && (
                    <div className="overview-content">
                        <div className="section-title mb-4">
                            <h4 className="mb-3">Introduction</h4>
                            <div className="rbt-separator"></div>
                        </div>
                        <div className="overview-description">
                            {sContent ? parse(sContent) : <span className="text-muted fst-italic">No data available</span>}
                        </div>
                    </div>
                )}

                {/* Content Tab - Modern Card Design similar to CallToAction */}
                {activeTab.tab === 'content' && (
                    <div className="content-section">
                        <div className="section-title mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <h4 className="mb-0">Course Content</h4>
                            <div className="filter-tabs d-flex gap-2">
                                {['all', 'video', 'pdf'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setActiveFilter(f)}
                                        className={`btn btn-sm ${activeFilter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        style={{ borderRadius: '20px', fontSize: '12px', padding: '4px 14px' }}
                                    >
                                        {f === 'all' ? 'All' : f === 'video' ? '🎬 Video' : '📄 PDF'}
                                    </button>
                                ))}
                            </div>
                            <div className="rbt-separator w-100"></div>
                        </div>
                        <div className="row g-4 align-items-stretch">
                            {filteredResources && filteredResources.length > 0 ? (
                                filteredResources.map((item, index) => (
                                    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex" key={index}>
                                        <div className="rbt-card modern-card bg-color-white rbt-radius shadow-1 hover-transform d-flex flex-column h-100"
                                             onClick={() => openPreview(item)}
                                             style={{ cursor: 'pointer' }}>
                                            {/* Thumbnail Section with Play Overlay */}
                                            <div className="rbt-card-img position-relative">
                                                <div
                                                    className="thumbnail-wrapper cursor-pointer"
                                                    onClick={() => openPreview(item)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {item.nPFTId === 11 ? (
                                                        // Video Thumbnail
                                                        <>
                                                            <Image
                                                                src={item.sVideoThumbnailPath || '/images/video-placeholder.jpg'}
                                                                alt={item.sFileName}
                                                                className="w-100 rbt-radius-top"
                                                                width={400}
                                                                height={160}
                                                                style={{ objectFit: 'cover', width: '100%', height: '160px' }}
                                                            />
                                                            <div className="video-overlay">
                                                                <div className="play-button pulse-animation">
                                                                    <Icon.Play size={40} color="white" fill="white" />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : item.nPFTId === 12 ? (
                                                        // PDF Thumbnail
                                                        <Image
                                                            src={item.sPDFThumbnailPath || '/images/pdf-thumbnail.jpg'}
                                                            alt={item.sFileName}
                                                            className="w-100 rbt-radius-top"
                                                            width={400}
                                                            height={160}
                                                            style={{ objectFit: 'cover', width: '100%', height: '160px' }}
                                                        />
                                                    ) : (
                                                        // Default Thumbnail
                                                        <Image
                                                            src="/images/default-thumbnail.jpg"
                                                            alt={item.sFileName}
                                                            className="w-100 rbt-radius-top"
                                                            width={400}
                                                            height={160}
                                                            style={{ objectFit: 'cover', width: '100%', height: '160px' }}
                                                        />
                                                    )}
                                                </div>

                                                {/* Category/Tag Badge */}
                                                <div className="rbt-badge-group position-absolute top-0 start-0 m-3">
                                                    <span className={`rbt-badge ${item.nPFTId === 11 ? 'bg-primary' : 'bg-danger'}`}>
                                                        {getFileTypeIcon(item)}
                                                        {item.nPFTId === 11 ? 'Video' : 'PDF'}
                                                    </span>
                                                </div>

                                                {/* Tutor Badge */}

                                            </div>

                                            <div className="rbt-card-body p-3 d-flex flex-column flex-grow-1">
                                                {item.sPackageName && (
                                                    <div className="rbt-category mb-2">
                                                        <Link href="#" className="text-muted small">
                                                            {item.sPackageName}
                                                        </Link>
                                                    </div>
                                                )}

                                                {/* File Name */}
                                                <h5 className="rbt-card-title mb-2">
                                                    <Link href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openPreview(item); }}>
                                                        {item.sFileName.length > 50 ? `${item.sFileName.substring(0, 50)}...` : item.sFileName}
                                                    </Link>
                                                </h5>

                                                {/* Description Section - Improved Logic */}
                                                <div className="description-wrapper flex-grow-1">
                                                    <div className="description-text">
                                                        {item.sContentDesc &&
                                                        item.sContentDesc.trim() !== "" &&
                                                        !item.sContentDesc.includes('<figure class="media">') ? (
                                                            <>
                                                                <div
                                                                    className={`mb-0 ${!expandedDescriptions[index] && item.sContentDesc.length > 120 ? 'text-truncate-multi' : ''}`}
                                                                    style={{ fontSize: '14px', lineHeight: '1.5', color: '#666' }}
                                                                >
                                                                    {expandedDescriptions[index]
                                                                        ? parse(item.sContentDesc)
                                                                        : parse(`${item.sContentDesc.substring(0, 120)}${item.sContentDesc.length > 120 ? '...' : ''}`)
                                                                    }
                                                                </div>

                                                                {item.sContentDesc.length > 120 && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); openPreview(item); }}
                                                                        className="btn-link p-0 mt-1 text-primary"
                                                                        style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: '500' }}
                                                                    >
                                                                        Show More
                                                                    </button>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-muted fst-italic">No description available</span>
                                                        )}
                                                    </div>
                                                </div>



                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-info text-center">
                                        <Icon.Info size={20} className="me-2" />
                                        No content available for this lesson.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Activity Tab */}
                {activeTab.tab === 'activity' && (
                    <div className="activity-section">
                        {SepActivitylist && (
                            <div className="section-title mb-4">
                                <h4 className="mb-3">Activities</h4>
                                <div className="rbt-separator"></div>
                            </div>
                        )}

                        <div className="row g-4" id="Activity" style={{ marginBottom: '100px' }}>
                            {quetypeItems && quetypeItems.length > 0 ? (
                                quetypeItems.map((item, index) => (
                                    <Fragment key={index}>
                                        {(item.nSQId >= 17 && item.nSQId <= 21) ? (
                                            // ✅ FIX 1: Card always renders; no longer gated behind SepActivitylist
                                            <div className="col-lg-6">
                                                <div onClick={() => handleSepActivityPage(item.nAQId)} style={{ cursor: 'pointer' }}>
                                                    <Card className="border-primary activity-card cardDesignEET hover-transform">
                                                        <CardBody className="card-mobile-view p-4">
                                                            <Row>
                                                                <Col lg={10}>
                                                                    <div className="d-flex justify-content-start">
                                                                        <div className="activity-number">
                                                <span className="badge bg-primary rounded-circle p-2 me-3">
                                                    {index + 1}
                                                </span>
                                                                        </div>
                                                                        <div className="profile-user-info">
                                                                            <h6 className="mb-1 font-weight-600 font-16">{item.sActivityName}</h6>
                                                                            <small className="text-muted font-12">
                                                                                <Icon.Type size={12} className="me-1" />
                                                                                {item.sSubQueType}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col>
                                                                    {item.sPackageName && (
                                                                        <div className="pkgName text-end">
                                                <span className="badge bg-light-success text-success">
                                                    {item.sPackageName}
                                                </span>
                                                                        </div>
                                                                    )}
                                                                </Col>
                                                            </Row>
                                                            <hr className="mt-3 mb-3" />
                                                            <div className="card-text">
                                                                <div className="mb-3">
                                                                    <div className="row align-items-center">
                                                                        <div className="col">
                                                                            <div className="font-weight-bolder activity-font font-14">
                                                                                <Icon.CheckCircle size={14} className="me-1" />
                                                                                Task completed = {item.act_ans_per} %
                                                                            </div>
                                                                        </div>
                                                                        <div className="col text-end">
                                                <span className="font-weight-bolder activity-font bg-secondary-subtle p-2 rounded-2 font-14">
                                                    <Icon.HelpCircle size={12} className="me-1" />
                                                    Questions: {item.act_ans}/{item.act_cnt}
                                                </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Progress color="success" value={item.act_ans_per} animated={item.act_ans_per < 100} />
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                            </div>
                                        ) : (
                                            // ✅ FIX 2: Removed `singleActivityPage &&` gate — cards always render
                                            <div className="col-lg-6">
                                                <Card className="border-primary activity-card cardDesignEET hover-transform">
                                                    <CardBody className="card-mobile-view p-4">
                                                        <Row>
                                                            <Col lg={12}>
                                                                <div className="d-flex justify-content-between align-items-start">
                                                                    <div className="d-flex">
                                            <span className="badge bg-primary rounded-circle p-2 me-3">
                                                {index + 1}
                                            </span>
                                                                        <div className="titleQuestion">
                                                                            <h6 className="mb-1 font-weight-600 font-16">{item.sActivityName}</h6>
                                                                            <small className="text-muted font-12">
                                                                                <Icon.Type size={12} className="me-1" />
                                                                                {item.sSubQueType}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                    <div className="profile-user-info">
                                                                        {/* ✅ FIX 3: Added e.stopPropagation() so card click doesn't interfere */}
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                viewActivity(
                                                                                    EncryptData(item.nAQId),
                                                                                    EncryptData(parseInt(item.act_first)),
                                                                                    EncryptData(1),
                                                                                    'y',
                                                                                    EncryptData(isBatch.nCId),
                                                                                    userRegId,
                                                                                    item.sActivityName,
                                                                                    item.nSQId
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Icon.Play size={12} className="me-1" />
                                                                            Start
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                {item.sPackageName && (
                                                                    <div className="pkgName text-end mt-2">
                                            <span className="badge bg-light-success text-success">
                                                {item.sPackageName}
                                            </span>
                                                                    </div>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                        <hr className="mt-3 mb-3" />
                                                        <div className="card-text">
                                                            <div className="mb-3">
                                                                <div className="row align-items-center">
                                                                    <div className="col">
                                                                        <div className="font-weight-bolder activity-font font-14">
                                                                            <Icon.CheckCircle size={14} className="me-1" />
                                                                            Task completed = {item.act_ans_per} %
                                                                        </div>
                                                                    </div>
                                                                    <div className="col text-end">
                                            <span className="font-weight-bolder activity-font bg-secondary-subtle p-2 rounded-2 font-14">
                                                <Icon.HelpCircle size={12} className="me-1" />
                                                Questions: {item.act_ans}/{item.act_cnt}
                                            </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Progress color="success" value={item.act_ans_per} animated={item.act_ans_per < 100} />
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        )}
                                    </Fragment>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-info text-center">
                                        <Icon.Activity size={20} className="me-2" />
                                        No activities available for this lesson.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Separate Activity Page */}
                        {sepActivityPage && activitySeperateCard && activitySeperateCard.length !== 0 && (
                            <div className="row mt-4">
                                <div className="col-12 mb-3">
                                    <button className="btn btn-outline-primary" onClick={handleBackActivity}>
                                        <Icon.ArrowLeft size={16} className="me-2" />
                                        Back to All Activities
                                    </button>
                                </div>
                                {activitySeperateCard.map((item, index) => (
                                    <div className="col-lg-6 mb-3" key={index}>
                                        <Card className='border mb-1 hover-transform'>
                                            <CardHeader className={`${item.sep_ans_fill === '0' ? 'bg-secondary' : 'bg-success'} p-0 text-white`}>
                                                <div className='row w-100 p-3'>
                                                    <div className='col-9'>
                                                        <h5 className="mb-0 font-weight-bolder">
                                                            {index + 1}. {item.sActivityName}
                                                        </h5>
                                                    </div>
                                                    <div className='col-3 text-end'>
                                                        {item.sep_ans_fill === '0' ? (
                                                            <Icon.Clock size={20} />
                                                        ) : (
                                                            <Icon.CheckCircle size={20} />
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardBody className='p-3 inner-activity-name'>
                                                <div className='font-weight-bolder'>{item.sQueTitle}</div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Practice Tab */}
                {activeTab.tab === 'practice' && (
                    <div className="practice-section">
                        <div className="section-title pt-3 pb-3">
                            <h4>Practice Exercises</h4>
                            <div className="rbt-separator"></div>
                        </div>
                        <div className="practice-content">
                            <div className="alert alert-info">
                                <Icon.Award size={20} className="me-2" />
                                Practice content will be available soon.
                            </div>
                        </div>
                    </div>
                )}

                {/* Test Tab */}
                {activeTab.tab === 'test' && (
                    <div className="test-section">
                        <div className="section-title pt-3 pb-3">
                            <h4>Assessment</h4>
                            <div className="rbt-separator"></div>
                        </div>
                        <div className="test-content">
                            <div className="alert alert-warning">
                                <Icon.AlertTriangle size={20} className="me-2" />
                                Test content will be available soon.
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lectures Tab - Small Cards */}
            {activeTab.tab === "lectures" && (() => {
                const getDateForLesson = (lessonIndex) => {
                    try {
                        const rawDays = batchMeta?.sDays || batchMeta?.batchDays || batchMeta?.days || null;
                        const rawStart = batchMeta?.dBatchStartDate || batchMeta?.batchStartDate || batchMeta?.startDate || null;
                        const rawEnd = batchMeta?.dBatchEndDate || batchMeta?.batchEndDate || batchMeta?.endDate || null;

                        if (!rawDays || !rawStart) return null;

                        const days = JSON.parse(rawDays || "[]");
                        if (!days.length) return null;

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
                    } catch (e) {
                        console.error("getDateForLesson error:", e);
                        return null;
                    }
                };

                const isLessonCompleted = (lessonIndex) => {
                    try {
                        const lessonDate = getDateForLesson(lessonIndex);
                        if (!lessonDate) return false;
                        const endTime = batchMeta?.sBatchEndTime;
                        if (!endTime) return false;

                        const endTimeStr = endTime.trim();
                        const match = endTimeStr.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?/i);
                        let hours = 0, minutes = 0;
                        if (match) {
                            hours = parseInt(match[1]);
                            minutes = parseInt(match[2]);
                            if (match[3]?.toLowerCase() === 'pm' && hours !== 12) hours += 12;
                            if (match[3]?.toLowerCase() === 'am' && hours === 12) hours = 0;
                        }
                        const lessonEnd = new Date(lessonDate);
                        lessonEnd.setHours(hours, minutes, 0, 0);
                        return new Date() > lessonEnd;
                    } catch (e) { return false; }
                };

                return (
                    <div className="rbt-lesson-content-inner">
                        <div className="section-title mb-4">
                            <h4 className="rbt-title-style-3">Live Lectures</h4>
                            <div className="rbt-separator"></div>
                        </div>

                        {LessonData.map((section, sIdx) => {
                            const lessons = JSON.parse(section.lessionTbl || "[]");
                            return (
                                <div key={sIdx} className="mb-5">
                                    <h6 className="fw-bold text-muted mb-3" style={{ textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>
                                        {section.sSectionTitle} <span className="text-primary">({lessons.length} Lectures)</span>
                                    </h6>

                                    <div className="row g-3">
                                        {lessons.map((lesson, lIdx) => {
                                            const schedule = lectureSchedules[lesson.nLId] || {};
                                            const isScheduled = !!schedule.sBatchLink || schedule.isScheduled;
                                            const link = schedule.sBatchLink;

                                            const lessonDate = getDateForLesson(lIdx);
                                            const displayDate = lessonDate
                                                ? lessonDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                                                : null;

                                            const completed = isLessonCompleted(lIdx);

                                            return (
                                                <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={lIdx}>
                                                    <div
                                                        className="card h-100 shadow-sm border-0 hover-transform"
                                                        style={{
                                                            minHeight: "148px",
                                                            borderRadius: "12px",
                                                            cursor: isScheduled && link ? "pointer" : "default"
                                                        }}
                                                        onClick={() => isScheduled && link && window.open(link, '_blank')}
                                                    >
                                                        <div className="card-body d-flex flex-column p-3 text-center">
                                                            {/* Day Number */}
                                                            <div className="mb-2">
                                                    <span className="badge bg-primary rounded-pill px-3 py-1 fs-6">
                                                        Day {lIdx + 1}
                                                    </span>
                                                            </div>

                                                            {/* Title */}
                                                            <h6 className="fw-semibold mb-2 flex-grow-1" style={{ fontSize: "14px", lineHeight: "1.3" }}>
                                                                {lesson.sLessionTitle}
                                                            </h6>

                                                            {/* Date & Time */}
                                                            {(displayDate || batchMeta?.sBatchStartTime) && (
                                                                <div className="text-muted small mb-3" style={{ fontSize: "12px" }}>
                                                                    {displayDate && <div>📅 {displayDate}</div>}
                                                                    {batchMeta?.sBatchStartTime && (
                                                                        <div>🕒 {batchMeta.sBatchStartTime}</div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Status */}
                                                            <div>
                                                                {completed ? (
                                                                    <span className="badge bg-success px-3 py-1">✅ Completed</span>
                                                                ) : isScheduled ? (
                                                                    <span className="badge bg-warning px-3 py-1 text-dark">● Scheduled</span>
                                                                ) : (
                                                                    <span className="badge bg-secondary px-3 py-1">○ Not Scheduled</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })()}
            {/* Footer Navigation */}
            <div className="footerBar bg-color-extra2 ptb--15 overflow-hidden position-absolute bottom-0 start-0 end-0">
                <div className="rbt-button-group d-flex justify-content-between px-4">
                    <button
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        onClick={handlePrevious}
                        style={{ borderRadius: '8px', padding: '8px 18px' }}
                    >
                        <Icon.ArrowLeft size={16} />
                        Previous
                    </button>
                    {!isLastTab && (
                        <button
                            className="btn btn-primary d-flex align-items-center gap-2 text-white"
                            onClick={handleNext}
                            style={{ borderRadius: '8px', padding: '8px 18px' }}
                        >
                            Next
                            <Icon.ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Add custom CSS styles */}
            <style jsx>{`
                .hover-transform {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .hover-transform:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                .video-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease;
                }
                .thumbnail-wrapper:hover .video-overlay {
                    background: rgba(0, 0, 0, 0.5);
                }
                .play-button {
                    width: 60px;
                    height: 60px;
                    background-color: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(5px);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .thumbnail-wrapper:hover .play-button {
                    transform: scale(1.1);
                }
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
                }
                .rbt-card.modern-card {
                    overflow: hidden;
                    transition: all 0.3s ease;
                    width: 100%;
                }
                .rbt-card.modern-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                }
                /* Fixed thumbnail height across all devices */
                .rbt-card-img img {
                    height: 180px !important;
                    object-fit: cover !important;
                    width: 100% !important;
                }
                /* Description area fixed min-height so cards stay uniform */
                .description-wrapper {
                    min-height: 72px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                }
                .description-text {
                    font-size: 14px;
                    line-height: 1.5;
                    color: #666;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                /* Title fixed height — 2 lines max */
                .rbt-card-title {
                    min-height: 48px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-size: 15px;
                }
                .rbt-badge {
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    display: inline-flex;
                    align-items: center;
                }
                .bg-light-success {
                    background-color: #d1e7dd;
                    color: #0f5132;
                }
                .cursor-pointer { cursor: pointer; }
                .activity-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .activity-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                }
                .rounded-circle {
                    width: 32px;
                    height: 32px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-outline-primary {
                    border: 1px solid #0d6efd;
                    background: transparent;
                    color: #0d6efd;
                }
                .btn-outline-primary:hover {
                    background: #0d6efd;
                    color: white;
                }

                /* ── Responsive breakpoints ── */

                /* Mobile (up to 575px): 1 column */
                @media (max-width: 575px) {
                    .rbt-card-img img { height: 200px !important; }
                    .rbt-card-title { font-size: 14px; min-height: 42px; }
                }

                /* Tablet / iPad (576px – 991px): 2 columns */
                @media (min-width: 576px) and (max-width: 991px) {
                    .rbt-card-img img { height: 170px !important; }
                }

                /* Laptop (992px – 1399px): 3 columns */
                @media (min-width: 992px) and (max-width: 1399px) {
                    .rbt-card-img img { height: 160px !important; }
                }

                /* Large / dual monitor (1400px+): 4 columns */
                @media (min-width: 1400px) {
                    .rbt-card-img img { height: 180px !important; }
                }
            `}</style>
        </div>
    );
};

export default CourseLessonBody;