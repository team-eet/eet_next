// components/LessonBody.jsx

import React, { Fragment } from 'react';
import parse from 'html-react-parser';
import * as Icon from 'react-feather';
import { Card, CardBody, CardHeader, Row, Col, Progress } from 'reactstrap';
import Link from 'next/link';

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
                        handleBackActivity
                    }) => {
    return (
        <div className="rbt-lesson-rightsidebar overflow-hidden lesson-video">
            <div className="lesson-top-bar">
                <div className="lesson-top-left">
                    <div className="rbt-lesson-toggle">
                        <button className="lesson-toggle-active btn-round-white-opacity" title="Toggle Sidebar">
                            <i className="feather-arrow-left"></i>
                        </button>
                    </div>
                    <h5>{isBatch.sCourseTitle}</h5>
                </div>
                <div className="lesson-top-right">
                    <div className="rbt-btn-close">
                        <a href={`/student/student-enrolled-course`} className="rbt-round-btn" title="Go Back to Course">
                            <i className="feather-x"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className="inner content">
                {activeTab.tab === 'overview' && (
                    <div>
                        <div className="section-title pt-5 pb-2">
                            <h4>Introduction</h4>
                        </div>
                        <div>{parse(sContent)}</div>
                    </div>
                )}

                {activeTab.tab === 'content' && (
                    <div>
                        <div className="pt-5 pb-2">PDF Content</div>
                        <div className="row" style={{ marginBottom: '100px' }}>
                            {tutresourcearray.map((pdf, index) => (
                                <div className="col-lg-4 h-100 mt-3" key={index}>
                                    <div className="card boxShadow border-0 p-3 h-100">
                                        <p style={{ fontSize: '16px' }}>
                                            {pdf.sFileName.length > 33 ? `${pdf.sFileName.substr(0, 33)}...` : pdf.sFileName}
                                        </p>
                                        <div className="row">
                                            <div className="col">
                                                <small>Size: {pdf.sFileSize}</small>
                                            </div>
                                            <div className="col text-end">
                                                <a href={pdf.sFilePath} target="_blank" className="btn btn-outline-warning icon-b-sm me-2">
                                                    <Icon.Eye size={12} className="cursor-pointer" />
                                                </a>
                                                <a href={pdf.sFilePath} target="_blank" className="btn btn-outline-warning icon-b-sm">
                                                    <Icon.Download size={12} className="cursor-pointer" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab.tab === 'activity' && (
                    <>
                        {SepActivitylist && (
                            <div className="pt-5 pb-2">Activity</div>
                        )}

                        <div className="row mt-3" id="Activity" style={{ marginBottom: '100px' }}>
                            {quetypeItems.map((item, index) => (
                                <Fragment key={index}>
                                    {(item.nSQId >= 17 && item.nSQId <= 21) ? (
                                        <div className="col-lg-6 mt-4">
                                            <Link href="#" onClick={() => handleSepActivityPage(item.nAQId)}>
                                                {SepActivitylist && (
                                                    <Card className="border-primary activity-card">
                                                        <CardBody className="card-mobile-view p-4">
                                                            <Row>
                                                                <Col lg={10}>
                                                                    <div className="d-flex justify-content-start">
                                                                        <div className="avatar mr-1">
                                                                            <span className="avatar-content">{index + 1}</span>
                                                                        </div>
                                                                        <div className="profile-user-info ms-3">
                                                                            <h6 className="mb-0 font-weight-600 font-16">{item.sActivityName}</h6>
                                                                            <small className="text-muted font-12">({item.sSubQueType})</small>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col>
                                                                    {item.sPackageName && (
                                                                        <div className="pkgName">
                                                                            <p className="float-right" style={{ fontSize: '15px' }}>{item.sPackageName}</p>
                                                                        </div>
                                                                    )}
                                                                </Col>
                                                            </Row>
                                                            <hr className="mt-3 mb-3" />
                                                            <div className="card-text">
                                                                <div className="mb-3">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <div className="font-weight-bolder activity-font font-14 p-1">
                                                                                Task completed = {item.act_ans_per} %
                                                                            </div>
                                                                        </div>
                                                                        <div className="col text-end">
                                      <span className="font-weight-bolder activity-font bg-secondary-subtle p-1 rounded-2 font-14">
                                        Questions: {item.act_ans}/{item.act_cnt}
                                      </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Progress color="success" value={item.act_ans_per} />
                                                        </CardBody>
                                                    </Card>
                                                )}
                                            </Link>
                                        </div>
                                    ) : (
                                        singleActivityPage && (
                                            <div className="col-lg-6 mt-4">
                                                <Card className="border-primary activity-card">
                                                    <CardBody className="card-mobile-view p-4">
                                                        <Row>
                                                            <Col lg={10}>
                                                                <div className="d-flex justify-content-start">
                                                                    <div className="avatar mr-1">
                                                                        <span className="avatar-content">{index + 1}</span>
                                                                    </div>
                                                                    <div className="profile-user-info ms-3">
                                                                        <h6 className="mb-0 font-weight-600 font-16">{item.sActivityName}</h6>
                                                                        <small className="text-muted font-12">({item.sSubQueType})</small>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                {item.sPackageName && (
                                                                    <div className="pkgName">
                                                                        <p className="float-right" style={{ fontSize: '15px' }}>{item.sPackageName}</p>
                                                                    </div>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                        <hr className="mt-3 mb-3" />
                                                        <div className="card-text">
                                                            <div className="mb-3">
                                                                <div className="row">
                                                                    <div className="col">
                                                                        <div className="font-weight-bolder activity-font font-14 p-1">
                                                                            Task completed = {item.act_ans_per} %
                                                                        </div>
                                                                    </div>
                                                                    <div className="col text-end">
                                    <span className="font-weight-bolder activity-font bg-secondary-subtle p-1 rounded-2 font-14">
                                      Questions: {item.act_ans}/{item.act_cnt}
                                    </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Progress color="success" value={item.act_ans_per} />
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        )
                                    )}
                                </Fragment>
                            ))}
                        </div>

                        {sepActivityPage && activitySeperateCard.length !== 0 && (
                            <div className="row">
                                {activitySeperateCard.map((item, index) => (
                                    <div className="col-lg-6" key={index}>
                                        <button className="btn btn-lg btn-primary" onClick={handleBackActivity}>
                                            <i className="feather-arrow-left me-2"></i>
                                            Back
                                        </button>
                                        <Card className='border mb-1 mt-3'>
                                            <CardHeader className={`${item.sep_ans_fill === '0' ? 'bg-secondary' : 'bg-success'} p-0`}>
                                                <div className='row w-100' style={{ display: "contents" }}>
                                                    <div className='col-9'>
                                                        <h5 className="mb-0 p-1 text-white animate shake position-relative w-100 font-weight-bolder">
                                                            {index + 1} : {item.sActivityName}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardBody className='p-2 inner-activity-name'>
                                                <div className='font-weight-bolder'>{item.sQueTitle}</div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab.tab === 'practice' && (
                    <div>
                        <div className="section-title pt-5 pb-2">
                            <h4>Practice</h4>
                        </div>
                        <div><p>Practice content goes here.</p></div>
                    </div>
                )}

                {activeTab.tab === 'test' && (
                    <div>
                        <div className="section-title pt-5 pb-2">
                            <h4>Test</h4>
                        </div>
                        <div><p>Test content goes here.</p></div>
                    </div>
                )}
            </div>

            <div className="footerBar bg-color-extra2 ptb--15 overflow-hidden position-absolute bottom-0 start-0 end-0">
                <div className="rbt-button-group">
                    <a className="rbt-btn icon-hover icon-hover-left btn-md bg-primary-opacity" href="#">
                        <span className="btn-icon"><i className="feather-arrow-left"></i></span>
                        <span className="btn-text">Previous</span>
                    </a>
                    <a className="rbt-btn icon-hover btn-md" href="#">
                        <span className="btn-text">Next</span>
                        <span className="btn-icon"><i className="feather-arrow-right"></i></span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CourseLessonBody;
