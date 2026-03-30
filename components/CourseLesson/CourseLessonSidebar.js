import React, {useState} from 'react';

const CourseLessonSidebar = ({ isBatch, LessonData, activeTab, handleTabClick, TutorialATId, ActivityATId, PracticeATId, TestATId ,IdArray,sidebar,setActiveTab,setSidebar }) => {
    // 🟢 State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // 🟢 Filter LessonData based on search query
    const filteredLessonData = LessonData.filter(item => {
        const lessons = JSON.parse(item.lessionTbl);
        return lessons.some(lesson =>
            lesson.sLessionTitle.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }).map(item => ({
        ...item,
        lessionTbl: JSON.stringify(
            JSON.parse(item.lessionTbl).filter(lesson =>
                lesson.sLessionTitle.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
    }));

    return (
        // <div className="rbt-lesson-leftsidebar">
        <div
            className={`rbt-lesson-leftsidebar ${
                sidebar ? "" : "sibebar-none"
            }`}
        >
            <div className="rbt-course-feature-inner rbt-search-activation">
                <div className="section-title section-title-with-toggle">
                    <h4 className="rbt-title-style-3 border-0 m-0">
                        {isBatch.bIsWithBatch === "yes" ? "Batch Content" : "Course Content"}
                    </h4>

                    <div className="rbt-lesson-toggle rbt-toggle-css d-none">
                        <button
                            className={`lesson-toggle-active btn-round-white-opacity sidebar-lesson ${
                                !sidebar ? "sidebar-hide" : ""
                            }`}
                            title="Toggle Sidebar"
                            onClick={setSidebar}
                        >
                            <i className="feather-menu"></i>
                        </button>
                    </div>
                </div>
                <div className="lesson-search-wrapper">
                    <form className="rbt-search-style-1">
                        <input
                            className="rbt-search-active"
                            type="text"
                            placeholder="Search Lesson"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // 🟢 Update search query
                        />
                        <button className="search-btn" type="button">
                            <i className="feather-search"></i>
                        </button>
                    </form>
                </div>
                <hr className="mt--10"/>
                {/*<div className="rbt-accordion-style rbt-accordion-02 for-right-content accordion">*/}
                {/*    <div className="accordion" id="accordionExampleb2">*/}
                {/*        {LessonData.map((item, index) => (*/}
                {/*            <div className="accordion-item card" key={index}>*/}
                {/*                <span*/}
                {/*                    className="card-header font-weight-700 text-primary border-0">{item.sSectionTitle}</span>*/}
                {/*                {JSON.parse(item.lessionTbl).map((lesson, lessonIndex) => (*/}
                {/*                    <div key={lessonIndex}>*/}
                {/*                        <h2 className="accordion-header card-header"*/}
                {/*                            id={`headingTwo${index + 1}-${lessonIndex + 1}`}>*/}
                {/*                            <button*/}
                {/*                                className={`accordion-button ${index === 0 && lessonIndex === 0 ? '' : 'collapsed'}`}*/}
                {/*                                type="button"*/}
                {/*                                data-bs-toggle="collapse"*/}
                {/*                                aria-expanded={index === 0 && lessonIndex === 0 ? 'true' : 'false'}*/}
                {/*                                data-bs-target={`#collapseTwo${index + 1}-${lessonIndex + 1}`}*/}
                {/*                                aria-controls={`collapseTwo${index + 1}-${lessonIndex + 1}`}>*/}
                {/*                                - {lesson.sLessionTitle}*/}
                {/*                            </button>*/}
                {/*                        </h2>*/}
                {/*                        <div*/}
                {/*                            id={`collapseTwo${index + 1}-${lessonIndex + 1}`}*/}
                {/*                            className={`accordion-collapse collapse ${index === 0 && lessonIndex === 0 ? 'show' : ''}`}*/}
                {/*                            aria-labelledby={`headingTwo${index + 1}-${lessonIndex + 1}`}*/}
                {/*                            data-bs-parent="#accordionExampleb2">*/}
                {/*                            <div className="accordion-body card-body">*/}
                {/*                                <ul className="rbt-course-main-content liststyle">*/}
                {/*                                    <li className={activeTab.tab === 'overview' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}*/}
                {/*                                        onClick={() => handleTabClick('overview', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>*/}
                {/*                                        <div className="course-content-left">*/}
                {/*                                            <i className="feather-file-text text-dark"></i>*/}
                {/*                                            <span className="text text-dark">Overview</span>*/}
                {/*                                        </div>*/}
                {/*                                    </li>*/}
                {/*                                    {TutorialATId === 3 && (*/}
                {/*                                        <li className={activeTab.tab === 'content' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}*/}
                {/*                                            onClick={() => handleTabClick('content', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>*/}
                {/*                                            <div className="course-content-left">*/}
                {/*                                                <i className="feather-play-circle text-dark"></i>*/}
                {/*                                                <span*/}
                {/*                                                    className="text text-dark">{isBatch.bIsWithBatch === 'no' ? 'Tutorial' : 'Content'}</span>*/}
                {/*                                            </div>*/}
                {/*                                        </li>*/}
                {/*                                    )}*/}
                {/*                                    {ActivityATId === 3 && (*/}
                {/*                                        <li className={activeTab.tab === 'activity' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}*/}
                {/*                                            onClick={() => handleTabClick('activity', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>*/}
                {/*                                            <div className="course-content-left">*/}
                {/*                                                <i className="feather-help-circle text-dark"></i>*/}
                {/*                                                <span className="text text-dark">Activity</span>*/}
                {/*                                            </div>*/}
                {/*                                        </li>*/}
                {/*                                    )}*/}
                {/*                                    {PracticeATId === 3 && (*/}
                {/*                                        <li className={activeTab.tab === 'practice' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}*/}
                {/*                                            onClick={() => handleTabClick('practice', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>*/}
                {/*                                            <div className="course-content-left">*/}
                {/*                                                <i className="feather-clock text-dark"></i>*/}
                {/*                                                <span className="text text-dark">Practice</span>*/}
                {/*                                            </div>*/}
                {/*                                        </li>*/}
                {/*                                    )}*/}
                {/*                                    {TestATId === 3 && (*/}
                {/*                                        <li className={activeTab.tab === 'test' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}*/}
                {/*                                            onClick={() => handleTabClick('test', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>*/}
                {/*                                            <div className="course-content-left">*/}
                {/*                                                <i className="feather-play-circle text-dark"></i>*/}
                {/*                                                <span className="text text-dark">Test</span>*/}
                {/*                                            </div>*/}
                {/*                                        </li>*/}
                {/*                                    )}*/}
                {/*                                </ul>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                ))}*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="rbt-accordion-style rbt-accordion-02 for-right-content accordion">
                    <div className="accordion" id="accordionExampleb2">
                        {filteredLessonData.map((item, index) => (
                            <div className="accordion-item card" key={index}>
                                <span className="card-header font-weight-700 text-primary border-0">{item.sSectionTitle}</span>
                                {JSON.parse(item.lessionTbl).map((lesson, lessonIndex) => (
                                    <div key={lessonIndex}>
                                        <h2 className="accordion-header card-header" id={`headingTwo${index + 1}-${lessonIndex + 1}`}>
                                            <button
                                                className={`accordion-button ${
                                                    activeTab.titleIndex === index && activeTab.dayIndex === lessonIndex ? '' : 'collapsed'
                                                }`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                aria-expanded={activeTab.titleIndex === index && activeTab.dayIndex === lessonIndex ? 'true' : 'false'}
                                                data-bs-target={`#collapseTwo${index + 1}-${lessonIndex + 1}`}
                                                aria-controls={`collapseTwo${index + 1}-${lessonIndex + 1}`}
                                            >
                                                - {lesson.sLessionTitle}
                                            </button>
                                        </h2>
                                        <div
                                            id={`collapseTwo${index + 1}-${lessonIndex + 1}`}
                                            className={`accordion-collapse collapse ${
                                                activeTab.titleIndex === index && activeTab.dayIndex === lessonIndex ? 'show' : ''
                                            }`}
                                            aria-labelledby={`headingTwo${index + 1}-${lessonIndex + 1}`}
                                            data-bs-parent="#accordionExampleb2"
                                        >
                                            <div className="accordion-body card-body">
                                                <ul className="rbt-course-main-content liststyle">
                                                    <li className={activeTab.tab === 'overview' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}
                                                        onClick={() => handleTabClick('overview', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>
                                                        <div className="course-content-left">
                                                            <i className="feather-file-text text-dark"></i>
                                                            <span className="text text-dark">Overview</span>
                                                        </div>
                                                    </li>
                                                    {TutorialATId === 3 && (
                                                        <li className={activeTab.tab === 'content' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}
                                                            onClick={() => handleTabClick('content', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>
                                                            <div className="course-content-left">
                                                                <i className="feather-play-circle text-dark"></i>
                                                                <span
                                                                    className="text text-dark">{isBatch.bIsWithBatch === 'no' ? 'Tutorial' : 'Content'}</span>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {ActivityATId === 3 && (
                                                        <li className={activeTab.tab === 'activity' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}
                                                            onClick={() => handleTabClick('activity', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>
                                                            <div className="course-content-left">
                                                                <i className="feather-help-circle text-dark"></i>
                                                                <span className="text text-dark">Activity</span>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {PracticeATId === 3 && (
                                                        <li className={activeTab.tab === 'practice' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}
                                                            onClick={() => handleTabClick('practice', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>
                                                            <div className="course-content-left">
                                                                <i className="feather-clock text-dark"></i>
                                                                <span className="text text-dark">Practice</span>
                                                            </div>
                                                        </li>
                                                    )}
                                                    {TestATId === 3 && (
                                                        <li className={activeTab.tab === 'test' && activeTab.dayIndex === lessonIndex && activeTab.titleIndex === index ? 'active' : ''}
                                                            onClick={() => handleTabClick('test', lessonIndex, index, IdArray, item.nSId, lesson.nLId)}>
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
