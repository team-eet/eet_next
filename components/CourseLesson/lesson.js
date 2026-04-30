// pages/lesson.js

import React, { Fragment, useState, useEffect } from 'react';
import Axios from 'axios';
import { SuccessAlert, ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import { API_URL, API_KEY, WEB_URL } from "../../constants/constant";
import { DecryptData, EncryptData } from "@/components/Services/encrypt-decrypt";
import LessonSidebar from '@/components/CourseLesson/CourseLessonSidebar';
import LessonBody from '@/components/CourseLesson/CourseLessonBody';
import withAuth from "@/components/Utils/withAuth";
import dynamic from 'next/dynamic';
//jdjejdjed
const CourseLesson = () => {
    const [isBatch, setIsBatch] = useState({});
    const [LessonData, setLessonData] = useState([]);
    const [TutorialATId, setTutorialATId] = useState(0);
    const [ActivityATId, setActivityATId] = useState(0);
    const [PracticeATId, setPracticeATId] = useState(0);
    const [TestATId, setTestATId] = useState(0);
    const [tutresourcearray, settutresourcearray] = useState([]);
    const [sContent, setsContent] = useState('');
    const [activeTab, setActiveTab] = useState({ tab: 'overview', dayIndex: 0, titleIndex : 0, nlid : 0 });
    const [quetypeItems, setquetypeItems] = useState([]);
    const [activitySeperateCard, setactivitySeperateCard] = useState([]);
    const [sepActivityPage, setsepActivityPage] = useState(false);
    const [singleActivityPage, setsingleActivityPage] = useState(true);
    const [SepActivitylist, setSepActivitylist] = useState(true);
    const [getShowModal, setShowModal] = useState(false);
    const [tutorialDocArray, setTutorialDocArray] = useState([]);

    const [cid, setcid] = useState('');
    const [regid, setRegid] = useState('');
    const [getEncodedId, setEncodedId] = useState('');
    const [getUrlIFrame, setUrlIFrame] = useState('');
    const [getActivityName, setActivityName] = useState('');
    const [getApiCall, setApiCall] = useState(true);
    const [sidebar, setSidebar] = useState(true);
    const tabSequence = ['overview', 'content', 'activity', 'practice'];
    const [isLastTab, setIsLastTab] = useState(false);
    const [isActivityLoading, setIsActivityLoading] = useState(true);
    const [previewModal, setPreviewModal] = useState(false);
    const [previewData, setPreviewData] = useState({
        url: '',
        name: '',
        description: '',
        type: ''   // 'video' | 'pdf'
    });
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    let getcid = '0';

    const handleSepActivityPage = (aqid) => {
        setsepActivityPage(true);
        setsingleActivityPage(false);
        setSepActivitylist(false);

        // ✅ Safe DOM access
        const el = document.getElementById('Activity');
        if (el) el.style.marginBottom = '0';
        Axios.get(`${API_URL}/api/activityQue/GetActivityQueListSeparateViewActivity/${EncryptData(aqid)}/${regid['regid']}/${cid}`, {
            headers: { ApiKey: `${API_KEY}` }
        })
            .then(res => {
                if (res.data) {
                    setactivitySeperateCard(res.data);
                }
            })
            .catch(err => {
                ErrorDefaultAlert(err);
            });
    };
    const Plyr = dynamic(
        () => import('plyr-react').then((mod) => {
            require('plyr/dist/plyr.css'); // load CSS too
            return mod.Plyr;
        }),
        { ssr: false } // 👈 this is the key — disables SSR for this component
    );
    const handleBackActivity = () => {
        setsepActivityPage(false);
        setsingleActivityPage(true);
        setSepActivitylist(true);

        // ✅ Safe DOM access
        const el = document.getElementById('Activity');
        if (el) el.style.marginBottom = '100px';
    };
    const openPreview = (item) => {
        if (item.nPFTId === 11) {
            // Video
            setPreviewData({
                url: item.sURLLink || item.sFilePath,
                name: item.sFileName,
                description: item.sContentDesc || '',
                type: 'video'
            });
            setIsPreviewLoading(false);
        } else if (item.nPFTId === 12) {
            // PDF
            const pdfSource = (item.sURLLink && item.sURLLink.trim() !== '') ? item.sURLLink : item.sFilePath;
            setPreviewData({
                url: `https://docs.google.com/viewer?url=${encodeURIComponent(pdfSource)}&embedded=true`,
                name: item.sFileName,
                description: item.sContentDesc || '',
                type: 'pdf'
            });
            setIsPreviewLoading(true);
        }

        setPreviewModal(true);
    };

    const closePreview = () => {
        setPreviewModal(false);
        setPreviewData({ url: '', name: '', description: '', type: '' });
    };
    // const handleTabClick = (tab, dayIndex) => {
    //     setActiveTab({ tab, dayIndex });
    // };

    const viewActivity = (nAQId,act_first,questionNo,y,nCId,userRegId,sActivityName,nSQId) => {
        //    alert(nAQId + " " + act_first + " " + questionNo + " " + y + " " + nCId + " " + userRegId)
        // alert(nSQId)
        setIsActivityLoading(true);
        setShowModal(true)
        setActivityName(sActivityName)
        switch (nSQId){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                setUrlIFrame(`${WEB_URL}/mcqsingleact/${nAQId}/${act_first}/${questionNo}/${y}/${nCId}/${userRegId}`)
                break;
            case 6:
            case 7:
            case 8:
                setUrlIFrame(`${WEB_URL}/mcqsingleoptionact/${nAQId}/${act_first}/${questionNo}/${y}/${nCId}/${userRegId}`)
                break;
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
                setUrlIFrame(`${WEB_URL}/mcqmultipleact/${nAQId}/${act_first}/${questionNo}/${y}/${nCId}/${userRegId}`)
                break;
            case 14:
            case 15:
            case 16:
                setUrlIFrame(`${WEB_URL}/mcqmultipleoptionact/${nAQId}/${act_first}/${questionNo}/${y}/${nCId}/${userRegId}`)
                break;
            default:
                setUrlIFrame(`${WEB_URL}/frame_error`)
        }

    }




    const handleClose = () => setShowModal(false);

    useEffect(() => {
        const url = window.location.href;
        const parts = url.split("/");

        const encodedId = parts[4]; // index 2 par hoga actual ID

        const urlIdArray = DecryptData(encodedId);
        const acid = EncryptData(urlIdArray.nACId);
        const mid =  EncryptData(urlIdArray.nMId);
        const lid =  EncryptData(urlIdArray.nCLId);
        const pnview = urlIdArray.mode;
        const cid =  EncryptData(urlIdArray.nCId);
        const targetNLId = urlIdArray.nLId || 0;
        const targetNSId = urlIdArray.nSId || 0;
        const targetNTBId = urlIdArray.nTBId || 0;
        setcid(cid);
        if (DecryptData(acid) !== 0) {
            getcid = acid;
        } else {
            getcid = cid;
        }
        setEncodedId(encodedId);
        if (localStorage.getItem('userData')) {
            const udata = DecryptData(localStorage.getItem('userData'));
            setRegid(udata);

            Axios.get(`${API_URL}/api/section/GetSectionLessionData/${cid}/${mid}`, {
                headers: { ApiKey: `${API_KEY}` }
            })
                .then(res => {
                    if (res.data) {
                        const lsn = JSON.parse(res.data[0]['lessionTbl']);
                        if (res.data[0]['lessionTbl'].length > 2) {
                            if (lsn) {
                                // setLid(EncryptData(lsn[0]['nLId']));
                            }
                        }
                        setLessonData(res.data);
                        console.log("setLessonData", res.data);

// Find which section and lesson index matches the targetNLId from URL
                        let initialTitleIndex = 0;
                        let initialDayIndex = 0;
                        let initialNLId = lsn[0]['nLId'];

                        if (targetNLId) {
                            outer: for (let si = 0; si < res.data.length; si++) {
                                const lessons = JSON.parse(res.data[si].lessionTbl);
                                for (let li = 0; li < lessons.length; li++) {
                                    if (Number(lessons[li].nLId) === Number(targetNLId)) {
                                        initialTitleIndex = si;
                                        initialDayIndex = li;
                                        initialNLId = lessons[li].nLId;
                                        break outer;
                                    }
                                }
                            }
                        }

                        setActiveTab({ tab: 'overview', dayIndex: initialDayIndex, titleIndex: initialTitleIndex, nlid: initialNLId });

                        Axios.get(`${API_URL}/api/lession/GetLessionAtid/${EncryptData(initialNLId)}`, {
                            headers: { ApiKey: `${API_KEY}` }
                        })
                            .then(res => {
                                console.log("GetLessionAtid response for nLId:", initialNLId, res.data);
                                if (res.data && res.data.length !== 0) {
                                    setTutorialATId(res.data[0]['nTutorialATId']);
                                    setActivityATId(res.data[0]['nActivityATId']);
                                    setPracticeATId(res.data[0]['nPracticeATId']);
                                    setTestATId(res.data[0]['nTestATId']);
                                }
                            });



                        Axios.get(`${API_URL}/api/tutorialDocument/GetTutorialCourseOverview/${EncryptData(initialNLId)}`, {
                            headers: { ApiKey: `${API_KEY}` }
                        }).then(res => {
                            if (res.data && res.data.length !== 0) {
                                setsContent(res.data[0]['sContent']);
                            }
                        });

                        Axios.get(`${API_URL}/api/activityMember/GetActivityQueTypeMemAct/${EncryptData(initialNLId)}/${udata['regid']}/${cid}`, {
                            headers: { ApiKey: `${API_KEY}` }
                        }).then(res => {
                            if (res.data) {
                                setquetypeItems(res.data);
                            }
                        });
                    }
                });

            Axios.get(`${API_URL}/api/coursemain/GetCourseName/${cid}`, {
                headers: { ApiKey: `${API_KEY}` }
            }).then(res => {
                if (res.data && res.data[0]) {
                    setIsBatch(res.data[0]);
                    console.log("Course Data",res.data[0])
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!getShowModal && activeTab.tab === "activity") {
            Axios.get(`${API_URL}/api/activityMember/GetActivityQueTypeMemAct/${EncryptData(activeTab.nlid)}/${regid['regid']}/${cid}`, {
                headers: { ApiKey: `${API_KEY}` }
            }).then(res => {
                if (res.data) {
                    setquetypeItems(res.data);
                } else {
                    setquetypeItems([]);
                }
            });
        }
    }, [getShowModal]);

    const handleTabClick = (tab, dayIndex,titleIndex,idArray,nsid,nlid) => {
        setApiCall(false);
        // Re-fetch ATIds for the new lesson so Activity/Practice tabs show correctly
        Axios.get(`${API_URL}/api/lession/GetLessionAtid/${EncryptData(nlid)}`, {
            headers: { ApiKey: `${API_KEY}` }
        }).then(res => {
            console.log("handleTabClick GetLessionAtid for nLId:", nlid, res.data);
            if (res.data && res.data.length !== 0) {
                setTutorialATId(res.data[0]['nTutorialATId']);
                setActivityATId(res.data[0]['nActivityATId']);
                setPracticeATId(res.data[0]['nPracticeATId']);
                setTestATId(res.data[0]['nTestATId']);
            }
        });
        switch (tab){
            case "overview":
                Axios.get(`${API_URL}/api/tutorialDocument/GetTutorialCourseOverview/${EncryptData(nlid)}`, {
                    headers: { ApiKey: `${API_KEY}` }
                }).then(res => {
                    if (res.data && res.data.length !== 0) {
                        setsContent(res.data[0]['sContent']);
                    } else {
                        setsContent("");
                    }
                }).finally(() => {
                    setApiCall(true);
                });
                break;
            case "content":
                const isModule = 'yes';
                Axios.get(`${API_URL}/api/tutorialDocument/GetTutorialDocument/${EncryptData(nlid)}/${EncryptData(nsid)}/${EncryptData(isModule)}`, {
                    headers: { ApiKey: `${API_KEY}` }
                }).then(res => {
                    console.log("📄 GetTutorialDocument RAW:", res.data);
                    if (res.data) {
                        const filteredData = res.data.filter(obj => obj.nPFTId === DecryptData(EncryptData(nsid)));
                        console.log("📄 Filtered by nPFTId:", filteredData);
                        console.log("📄 PDF items:", filteredData.filter(i => i.sFileExt === 'pdf'));
                        console.log("🎥 Video items:", filteredData.filter(i => i.sFileExt === 'mp4' || i.sVideoThumbnailPath));
                        setTutorialDocArray(filteredData);
                        settutresourcearray(res.data); // keep for backward compat
                    } else {
                        setTutorialDocArray([]);
                        settutresourcearray([]);
                    }
                }).finally(() => {
                    setApiCall(true);
                });
                break;
            case "activity":
                Axios.get(`${API_URL}/api/activityMember/GetActivityQueTypeMemAct/${EncryptData(nlid)}/${regid['regid']}/${cid}`, {
                    headers: { ApiKey: `${API_KEY}` }
                }).then(res => {
                    console.log("activity",res.data)
                    console.log("Activity URL" + " AQID" + EncryptData(411) + " ACT FIrst " + EncryptData(890), " Question Number" + EncryptData(1) + " Course Id " + cid)
                    console.log("URL",`${API_URL}/api/activityMember/GetActivityQueTypeMemAct/${EncryptData(nlid)}/${regid['regid']}/${cid}`)
                    if (res.data) {
                        setquetypeItems(res.data);
                    }else {
                        setquetypeItems([])
                    }
                }).finally(() => {
                    setApiCall(true);
                });
                break;
            case "practice":
                setApiCall(true);
                break;
            case "test":
                setApiCall(true);
                break;
        }

        console.log("Tabing",tab,dayIndex,titleIndex,idArray,nsid,nlid)
        setActiveTab({ tab, dayIndex, titleIndex,nlid});

        const currentLessonTbl = JSON.parse(LessonData[titleIndex].lessionTbl);
        const isLastSection = titleIndex === LessonData.length - 1;
        const isLastLesson = dayIndex === currentLessonTbl.length - 1;
        const isLastTab = tabSequence.indexOf(tab) === tabSequence.length - 1;

        setIsLastTab(isLastSection && isLastLesson && isLastTab);
    };

    const handleNext = () => {
        const currentTabIndex = tabSequence.indexOf(activeTab.tab);
        const currentLessonTbl = JSON.parse(LessonData[activeTab.titleIndex].lessionTbl);

        if (currentTabIndex < tabSequence.length - 1) {
            const nextTab = tabSequence[currentTabIndex + 1];
            handleTabClick(nextTab, activeTab.dayIndex, activeTab.titleIndex, getEncodedId,
                LessonData[activeTab.titleIndex].nSId,
                currentLessonTbl[activeTab.dayIndex].nLId
            );
        }
        else if (activeTab.dayIndex < currentLessonTbl.length - 1) {
            handleTabClick('overview', activeTab.dayIndex + 1, activeTab.titleIndex, getEncodedId,
                LessonData[activeTab.titleIndex].nSId,
                currentLessonTbl[activeTab.dayIndex + 1].nLId
            );
        }
        else if (activeTab.titleIndex < LessonData.length - 1) {
            const nextLessonTbl = JSON.parse(LessonData[activeTab.titleIndex + 1].lessionTbl);
            handleTabClick('overview', 0, activeTab.titleIndex + 1, getEncodedId,
                LessonData[activeTab.titleIndex + 1].nSId,
                nextLessonTbl[0].nLId
            );
        }
    };

    const handlePrevious = () => {
        const currentTabIndex = tabSequence.indexOf(activeTab.tab);
        const currentLessonTbl = JSON.parse(LessonData[activeTab.titleIndex].lessionTbl);

        if (currentTabIndex > 0) {
            const prevTab = tabSequence[currentTabIndex - 1];
            handleTabClick(prevTab, activeTab.dayIndex, activeTab.titleIndex, getEncodedId,
                LessonData[activeTab.titleIndex].nSId,
                currentLessonTbl[activeTab.dayIndex].nLId
            );
        }
        else if (activeTab.dayIndex > 0) {
            const prevLessonIndex = activeTab.dayIndex - 1;
            const prevLesson = currentLessonTbl[prevLessonIndex];
            handleTabClick(tabSequence[tabSequence.length - 1], prevLessonIndex, activeTab.titleIndex, getEncodedId,
                LessonData[activeTab.titleIndex].nSId,
                prevLesson.nLId
            );
        }
        else if (activeTab.titleIndex > 0) {
            const prevSection = LessonData[activeTab.titleIndex - 1];
            const prevLessonTbl = JSON.parse(prevSection.lessionTbl);
            const lastLessonIndex = prevLessonTbl.length - 1;
            handleTabClick(tabSequence[tabSequence.length - 1], lastLessonIndex, activeTab.titleIndex - 1, getEncodedId,
                prevSection.nSId,
                prevLessonTbl[lastLessonIndex].nLId
            );
        }
    };


    return (
        <>
        <div className="rbt-lesson-area bg-color-white">
            <div className="rbt-lesson-content-wrapper">
                <LessonSidebar
                    isBatch={isBatch}
                    LessonData={LessonData}
                    activeTab={activeTab}
                    handleTabClick={handleTabClick}
                    TutorialATId={TutorialATId}
                    ActivityATId={ActivityATId}
                    PracticeATId={PracticeATId}
                    TestATId={TestATId}
                    IdArray={getEncodedId}
                    sidebar={sidebar}
                    setSidebar={() => setSidebar(!sidebar)}
                    setActiveTab={setActiveTab}
                />
                {
                    getApiCall  ?
                        <LessonBody
                            isBatch={isBatch}
                            activeTab={activeTab}
                            sContent={sContent}
                            tutresourcearray={tutresourcearray}
                            quetypeItems={quetypeItems}
                            SepActivitylist={SepActivitylist}
                            handleSepActivityPage={handleSepActivityPage}
                            singleActivityPage={singleActivityPage}
                            sepActivityPage={sepActivityPage}
                            activitySeperateCard={activitySeperateCard}
                            handleBackActivity={handleBackActivity}
                            viewActivity={viewActivity}
                            userRegId={regid['regid']}
                            tutorialDocArray={tutorialDocArray}
                            sidebar={sidebar}
                            setSidebar={() => setSidebar(!sidebar)}
                            handleNext={handleNext}
                            handlePrevious={handlePrevious}
                            isLastTab={isLastTab}
                            openPreview={openPreview}  // Add this line
                        /> :

                        <div
                            className="d-flex flex-column justify-content-center align-items-center w-100 vh-100 bg-light">
                            <div className="spinner-border text-primary" role="status"
                                 style={{width: "3rem", height: "3rem"}}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 fs-5 fw-semibold text-dark">Loading...</p>
                        </div>
                }
                {previewModal && previewData.url && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog"
                         style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                        <div className="modal-dialog modal-fullscreen" role="document">
                            <div className="modal-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

                                {/* Header */}
                                <div className="modal-header d-flex justify-content-between">
                                    <h5 className="modal-title">{previewData.name}</h5>
                                    <div className="lesson-top-right">
                                        <div className="rbt-btn-close">
                                            <button type="button" className="rbt-round-btn btn-close" onClick={closePreview}>
                                                <i className="feather-x"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Side-by-side: LEFT preview + RIGHT description */}
                                <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden', minHeight: 0 }}>

                                    {/* LEFT: Video / PDF */}
                                    <div style={{
                                        width: '65%',
                                        backgroundColor: '#000',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {previewData.type === 'pdf' ? (
                                            <>
                                                {isPreviewLoading && (
                                                    <div style={{
                                                        position: 'absolute', top: 0, left: 0,
                                                        width: '100%', height: '100%',
                                                        backgroundColor: '#f6f7f8', zIndex: 5,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <iframe
                                                    src={previewData.url}
                                                    title="PDF Preview"
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 'none', display: 'block' }}
                                                    onLoad={() => setIsPreviewLoading(false)}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <style>{`
                                    .plyr-fixed-container { width: 100% !important; height: 100% !important; }
                                    .plyr-fixed-container .plyr { width: 100% !important; height: 100% !important; }
                                    .plyr-fixed-container .plyr video { width: 100% !important; height: 100% !important; object-fit: contain !important; }
                                    .plyr-fixed-container .plyr__video-wrapper { width: 100% !important; height: 100% !important; }
                                `}</style>
                                                <div className="plyr-fixed-container" style={{ width: '100%', height: '100%' }}>
                                                    <Plyr
                                                        source={{
                                                            type: 'video',
                                                            sources: [{
                                                                src: previewData.url,
                                                                provider: previewData.url.includes('youtube.com') || previewData.url.includes('youtu.be') ? 'youtube' : 'html5'
                                                            }]
                                                        }}
                                                        options={{
                                                            autoplay: true,
                                                            ratio: undefined,
                                                            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen']
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* RIGHT: Title + Description */}
                                    <div style={{
                                        width: '35%',
                                        padding: '20px 24px',
                                        backgroundColor: '#fff',
                                        borderLeft: '1px solid #e9ecef',
                                        overflowY: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <h5 style={{ fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
                                            {previewData.name}
                                        </h5>
                                        <hr style={{ margin: '0 0 12px', borderColor: '#f0f0f0' }} />

                                        {previewData.description &&
                                        previewData.description.trim() !== "" &&
                                        !previewData.description.includes('<figure class="media">') ? (
                                            <div>
                                                <p style={{ fontSize: '13px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                                    Description:
                                                </p>
                                                <div
                                                    style={{ fontSize: '15px', color: '#495057', lineHeight: '1.65' }}
                                                    dangerouslySetInnerHTML={{ __html: previewData.description }}
                                                />
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: '13px', color: '#adb5bd', fontStyle: 'italic', margin: 0 }}>
                                                No description available.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closePreview}>Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

        </div>
</div>
</>
);
};

export default withAuth(CourseLesson);