// pages/lesson.js

import React, { Fragment, useState, useEffect } from 'react';
import Axios from 'axios';
import parse from 'html-react-parser';
import { SuccessAlert, ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import { API_URL, API_KEY } from "../../../../../../constants/constant";
import { DecryptData, EncryptData } from "@/components/Services/encrypt-decrypt";
import LessonSidebar from '@/components/CourseLesson/CourseLessonSidebar';
import LessonBody from '@/components/CourseLesson/CourseLessonBody';

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
    const [activeTab, setActiveTab] = useState({ tab: 'overview', dayIndex: 0 });
    const [quetypeItems, setquetypeItems] = useState([]);
    const [activitySeperateCard, setactivitySeperateCard] = useState([]);
    const [sepActivityPage, setsepActivityPage] = useState(false);
    const [singleActivityPage, setsingleActivityPage] = useState(true);
    const [SepActivitylist, setSepActivitylist] = useState(true);
    const [cid, setcid] = useState('');
    const [regid, setRegid] = useState('');
    const [getEncodedId, setEncodedId] = useState('');

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

    const handleTabClick = (tab, dayIndex) => {
        setActiveTab({ tab, dayIndex });
    };

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

                        Axios.get(`${API_URL}/api/tutorialDocument/GetTutorialDocumentBatch/${EncryptData(lsn[0]['nLId'])}`, {
                            headers: { ApiKey: `${API_KEY}` }
                        }).then(res => {
                            if (res.data && res.data.length !== 0) {
                                settutresourcearray(res.data);
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
                }
            });
        }
    }, []);

    return (
        <>
            <style jsx>{`
                .rbt-course-main-content li.active span, .rbt-course-main-content li.active i {
                    color: #2f57ef !important;
                }

                .rbt-course-main-content li {
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .rbt-course-main-content li:hover {
                    color: #cc0000;
                }

            `}</style>
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
                    />

                    {/*<LessonBody*/}
                    {/*    isBatch={isBatch}*/}
                    {/*    tutresourcearray={tutresourcearray}*/}
                    {/*    quetypeItems={quetypeItems}*/}
                    {/*    SepActivitylist={SepActivitylist}*/}
                    {/*    handleSepActivityPage={handleSepActivityPage}*/}
                    {/*    singleActivityPage={singleActivityPage}*/}
                    {/*    sepActivityPage={sepActivityPage}*/}
                    {/*    activitySeperateCard={activitySeperateCard}*/}
                    {/*    handleBackActivity={handleBackActivity}*/}
                    {/*/>*/}

                </div>
            </div>
        </>
    );
};

export default CourseLesson;
