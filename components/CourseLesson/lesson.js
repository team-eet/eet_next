// pages/lesson.js

import React, { Fragment, useState, useEffect } from 'react';
import Axios from 'axios';
import parse from 'html-react-parser';
import { SuccessAlert, ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import { API_URL, API_KEY, WEB_URL } from "../../constants/constant";
import { DecryptData, EncryptData } from "@/components/Services/encrypt-decrypt";
import LessonSidebar from '@/components/CourseLesson/CourseLessonSidebar';
import LessonBody from '@/components/CourseLesson/CourseLessonBody';
import {Switch} from "@mui/material";
import withAuth from "@/components/Utils/withAuth";

const CourseLesson = () => {
    const REACT_APP = API_URL;
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
    const [getPDFModal, setPDFModal] = useState(false);
    const [cid, setcid] = useState('');
    const [regid, setRegid] = useState('');
    const [getEncodedId, setEncodedId] = useState('');
    const [getUrlIFrame, setUrlIFrame] = useState('');
    const [getActivityName, setActivityName] = useState('');
    const [getApiCall, setApiCall] = useState(true);
    const [sidebar, setSidebar] = useState(true);
    const tabSequence = ['overview', 'content', 'activity', 'practice'];
    const [isLastTab, setIsLastTab] = useState(false);
    const [getPDFData, setPDFData] = useState({ path: '', name: '' });
    const [isPDFLoading, setIsPDFLoading] = useState(true);
    const [isActivityLoading, setIsActivityLoading] = useState(true);
    let getcid = '0';

    const handleSepActivityPage = (aqid) => {
        setsepActivityPage(true);
        setsingleActivityPage(false);
        setSepActivitylist(false);

        document.getElementById('Activity').style.marginBottom = '0';

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

    const handleBackActivity = () => {
        setsepActivityPage(false);
        setsingleActivityPage(true);
        setSepActivitylist(true);
        document.getElementById('Activity').style.marginBottom = '100px';
    };


    // const handleTabClick = (tab, dayIndex) => {
    //     setActiveTab({ tab, dayIndex });
    // };

    const viewActivity = (nAQId,act_first,questionNo,y,nCId,userRegId,sActivityName,nSQId) => {
        alert(nAQId + " " + act_first + " " + questionNo + " " + y + " " + nCId + " " + userRegId)
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

    const pdfViewer = (pdfPath,pdfName) => {
        // alert(pdfPath + " " + pdfName)
        setPDFData({
            path : `https://docs.google.com/gview?url=${pdfPath}&embedded=true`,
            name : pdfName
        })
        setIsPDFLoading(true)
        setPDFModal(true)
    }

    const handlePDFClose = () => setPDFModal(false);

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
                        console.log("setLessonData",res.data)

                        Axios.get(`${API_URL}/api/lession/GetLessionAtid/${EncryptData(lsn[0]['nLId'])}`, {
                            headers: { ApiKey: `${API_KEY}` }
                        })
                            .then(res => {
                                if (res.data && res.data.length !== 0) {
                                    setTutorialATId(res.data[0]['nTutorialATId']);
                                    setActivityATId(res.data[0]['nActivityATId']);
                                    setPracticeATId(res.data[0]['nPracticeATId']);
                                    setTestATId(res.data[0]['nTestATId']);
                                }
                            });



                        Axios.get(`${API_URL}/api/tutorialDocument/GetTutorialCourseOverview/${EncryptData(lsn[0]['nLId'])}`, {
                            headers: { ApiKey: `${API_KEY}` }
                        }).then(res => {
                            if (res.data && res.data.length !== 0) {
                                setsContent(res.data[0]['sContent']);
                            }
                        });

                        Axios.get(`${API_URL}/api/activityMember/GetActivityQueTypeMemAct/${EncryptData(lsn[0]['nLId'])}/${udata['regid']}/${cid}`, {
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
                Axios.get(`${API_URL}/api/tutorialDocument/GetTutorialDocumentBatch/${EncryptData(nlid)}`, {
                    headers: { ApiKey: `${API_KEY}` }
                }).then(res => {
                    if (res.data && res.data.length !== 0) {
                        settutresourcearray(res.data);
                    } else {
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
                                sidebar={sidebar}
                                setSidebar={() => setSidebar(!sidebar)}
                                handleNext={handleNext}
                                handlePrevious={handlePrevious}
                                isLastTab={isLastTab}
                                pdfViewer={pdfViewer}
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
                    {getShowModal && (
                        <div className="modal fade show d-block" tabIndex="-1" role="dialog"
                             style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                            <div className="modal-dialog modal-fullscreen" role="document">
                                <div className="modal-content" style={{height: '100vh'}}>

                                <div className="modal-header d-flex justify-content-between">
                                        <h5 className="modal-title">{getActivityName}</h5>
                                        <div className="lesson-top-right">
                                            <div className="rbt-btn-close">
                                                <button type="button" className="rbt-round-btn btn-close"
                                                        onClick={handleClose}>
                                                    <i className="feather-x"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-body p-0"
                                         style={{height: 'calc(100vh - 120px)', overflow: 'hidden'}}>
                                        {isActivityLoading && (
                                            <div className="d-flex justify-content-center align-items-center"
                                                 style={{
                                                     position: 'absolute',
                                                     top: 0, left: 0, right: 0, bottom: 0,
                                                     backgroundColor: '#fff',
                                                     zIndex: 10
                                                 }}>
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        )}
                                        <iframe
                                            // src="https://eet-frontend.azurewebsites.net/mcqsingleact/pmgn0o-jhTq6ak1pUFrLsQ==/ZygH-gMr7Uo80oqGuiTzOg==/38reo1P9MPCaRV66Hrtl_g==/n/d1EwY7e7aY_66OTtQuHb1w==/LWnmhbJglu1Bt2SwI2JsFg=="
                                            src={getUrlIFrame}
                                            width="100%"
                                            height="100%"
                                            title="Preview"
                                            style={{border: 'none', overflow: 'hidden'}}
                                            onLoad={() => setIsActivityLoading(false)}
                                        ></iframe>
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary"
                                                onClick={handleClose}>Close
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    )}

                    {
                        getPDFModal &&  getPDFData.path && (
                            <div className="modal fade show d-block" tabIndex="-1" role="dialog"
                                 style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                                <div className="modal-dialog modal-fullscreen" role="document">
                                    <div className="modal-content" style={{height: '100vh'}}>

                                        <div className="modal-header d-flex justify-content-between">
                                            <h5 className="modal-title">{getPDFData.name}</h5>
                                            <div className="lesson-top-right">
                                                <div className="rbt-btn-close">
                                                    <button type="button" className="rbt-round-btn btn-close"
                                                            onClick={handlePDFClose}>
                                                        <i className="feather-x"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-body p-0"
                                             style={{height: 'calc(100vh - 120px)', overflow: 'hidden'}}>
                                            {isPDFLoading && (
                                                <div className="d-flex justify-content-center align-items-center"
                                                     style={{
                                                         position: 'absolute',
                                                         top: 0, left: 0, right: 0, bottom: 0,
                                                         backgroundColor: '#fff',
                                                         zIndex: 10
                                                     }}>
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            )}

                                            <iframe
                                                // src="https://eet-frontend.azurewebsites.net/mcqsingleact/pmgn0o-jhTq6ak1pUFrLsQ==/ZygH-gMr7Uo80oqGuiTzOg==/38reo1P9MPCaRV66Hrtl_g==/n/d1EwY7e7aY_66OTtQuHb1w==/LWnmhbJglu1Bt2SwI2JsFg=="
                                                src={getPDFData.path}
                                                width="100%"
                                                height="100%"
                                                title="Preview"
                                                style={{border: 'none', overflow: 'hidden'}}
                                                onLoad={() => setIsPDFLoading(false)}
                                            ></iframe>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary"
                                                    onClick={handlePDFClose}>Close
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        )
                    }
                </div>
            </div>
        </>
    );
};

export default withAuth(CourseLesson);
