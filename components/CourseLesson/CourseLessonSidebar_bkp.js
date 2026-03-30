import React from 'react';
import Link from "next/link";

const CourseLessonSidebar = ({ isBatch, LessonData, activeTab, handleTabClick, TutorialATId, ActivityATId, PracticeATId, TestATId, IdArray }) => {
    console.log("LessonData",LessonData)
    return (
        <div className="rbt-lesson-leftsidebar">
            <div className="rbt-course-feature-inner rbt-search-activation">
                <div className="section-title">
                    <h4 className="rbt-title-style-3">
                        {isBatch.bIsWithBatch === "yes" ? "Batch Content" : "Course Content"}
                    </h4>
                </div>
                <div className="lesson-search-wrapper">
                    <form className="rbt-search-style-1">
                        <input className="rbt-search-active" type="text" placeholder="Search Lesson" />
                        <button className="search-btn disabled"><i className="feather-search"></i></button>
                    </form>
                </div>
                <hr className="mt--10" />
                <div className="rbt-accordion-style rbt-accordion-02 for-right-content accordion">
                    <div className="accordion" id="accordionExampleb2">
                        {LessonData.map((item, index) => (

                            <div className="accordion-item card" key={index}>
                                <span className="card-header font-weight-700 text-primary border-0">{item.sSectionTitle}</span>
                                {JSON.parse(item.lessionTbl).map((lesson, lessonIndex) => (
                                    <div key={lessonIndex}>
                                        <h2 className="accordion-header card-header" id={`headingTwo${index + 1}-${lessonIndex + 1}`}>
                                            <button
                                                className={`accordion-button ${index === 0 && lessonIndex === 0 ? '' : 'collapsed'}`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                aria-expanded={index === 0 && lessonIndex === 0 ? 'true' : 'false'}
                                                data-bs-target={`#collapseTwo${index + 1}-${lessonIndex + 1}`}
                                                aria-controls={`collapseTwo${index + 1}-${lessonIndex + 1}`}>
                                                - {lesson.sLessionTitle}
                                            </button>
                                        </h2>
                                        <div
                                            id={`collapseTwo${index + 1}-${lessonIndex + 1}`}
                                            className={`accordion-collapse collapse ${index === 0 && lessonIndex === 0 ? 'show' : ''}`}
                                            aria-labelledby={`headingTwo${index + 1}-${lessonIndex + 1}`}
                                            data-bs-parent="#accordionExampleb2">
                                            <div className="accordion-body card-body">
                                                <ul className="rbt-course-main-content liststyle">
                                                    <li className={activeTab.tab === 'overview' && activeTab.dayIndex === lessonIndex ? 'active' : ''}
                                                        onClick={() => handleTabClick('overview', lessonIndex)}>
                                                        <div className="course-content-left">
                                                            <i className="feather-play-circle text-dark"></i>
                                                            <Link href={`/courselesson/${IdArray}/overview/${item.nSId}/${lesson.nLId}`} className="text text-dark">Overview</Link>
                                                        </div>
                                                    </li>
                                                    {TutorialATId === 3 && (
                                                        <li className={activeTab.tab === 'content' && activeTab.dayIndex === lessonIndex ? 'active' : ''}
                                                            onClick={() => handleTabClick('content', lessonIndex)}>
                                                            <div className="course-content-left">
                                                                <i className="feather-play-circle text-dark"></i>
                                                                {/*<span className="text text-dark">{isBatch.bIsWithBatch === 'no' ? 'Tutorial' : 'Content'}</span>*/}
                                                                <Link href={`/courselesson/${IdArray}/tutorial/${item.nSId}/${lesson.nLId}`} className="text text-dark">{isBatch.bIsWithBatch === 'no' ? 'Tutorial' : 'Content'}</Link>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {ActivityATId === 3 && (
                                                        <li className={activeTab.tab === 'activity' && activeTab.dayIndex === lessonIndex ? 'active' : ''}
                                                            onClick={() => handleTabClick('activity', lessonIndex)}>
                                                            <div className="course-content-left">
                                                                <i className="feather-play-circle text-dark"></i>
                                                                {/*<span className="text text-dark">Activity</span>*/}
                                                                <Link href={`/courselesson/${IdArray}/activity/${item.nSId}/${lesson.nLId}`} className="text text-dark">Activity</Link>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {PracticeATId === 3 && (
                                                        <li className={activeTab.tab === 'practice' && activeTab.dayIndex === lessonIndex ? 'active' : ''}
                                                            onClick={() => handleTabClick('practice', lessonIndex)}>
                                                            <div className="course-content-left">
                                                                <i className="feather-play-circle text-dark"></i>
                                                                {/*<span className="text text-dark">Practice</span>*/}
                                                                <Link href={`/courselesson/${IdArray}/practice/${item.nSId}/${lesson.nLId}`} className="text text-dark">Practice</Link>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {TestATId === 3 && (
                                                        <li className={activeTab.tab === 'test' && activeTab.dayIndex === lessonIndex ? 'active' : ''}
                                                            onClick={() => handleTabClick('test', lessonIndex)}>
                                                            <div className="course-content-left">
                                                                <i className="feather-play-circle text-dark"></i>
                                                                <span className="text text-dark">Test</span>
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseLessonSidebar;
