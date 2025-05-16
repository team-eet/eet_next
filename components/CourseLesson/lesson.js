import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import parse from 'html-react-parser'
import * as Icon from 'react-feather'
// import Tooltip from "@material-ui/core/Tooltip"
import { SuccessAlert, ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import {
    Card, Alert, CardBody, Row, Col, Progress, Button,
    TabContent, TabPane, Nav, NavItem, NavLink, CardHeader
} from 'reactstrap'
import Link from "next/link";
import {API_URL, API_KEY} from "../../constants/constant";
import { DecryptData, EncryptData } from "@/components/Services/encrypt-decrypt";

const CourseLesson = () => {
    const REACT_APP = API_URL

    const [isBatch, setIsBatch] = useState([]);
    const [TutorialATId, setTutorialATId] = useState(0)
    const [ActivityATId, setActivityATId] = useState(0)
    const [PracticeATId, setPracticeATId] = useState(0)
    const [TestATId, setTestATId] = useState(0)
    const [LessonData, setLessonData] = useState([])
    const [tutresourcearray, settutresourcearray] = useState([])
    const [sContent, setsContent] = useState('')
    const [activeTab, setActiveTab] = useState('overview');
    const [quetypeItems, setquetypeItems] = useState([]);
    const [activityListCard, setactivityListCard] = useState(false)
    const [activityMainCard, setactivityMainCard] = useState(true)
    const [PNView, setPNView] = useState('')
    const [Lid, setLid] = useState('')
    const [cid, setcid] = useState('')
    const [sepActivityPage ,setsepActivityPage] = useState(false)
    const [singleActivityPage, setsingleActivityPage] = useState(true)
    const [SepActivitylist, setSepActivitylist] = useState(true)
    const [regid, setRegid] = useState('')
    const [activitySeperateCard, setactivitySeperateCard] = useState([])


    let getcid = '0'

    const handleSepActivityPage = (aqid) => {
        setsepActivityPage(true)
        setsingleActivityPage(false)
        setSepActivitylist(false)

        document.getElementById('Activity').style.marginBottom = '0'

        Axios.get(`${API_URL}/api/activityQue/GetActivityQueListSeparateViewActivity/${EncryptData(aqid)}/${regid['regid']}/${cid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    console.log('GetActivityQueListSeparateViewActivity', res.data)
                    setactivitySeperateCard(res.data)
                }
            })
            .catch(err => {
                alert("hello")
                { ErrorDefaultAlert(err) }
            })
    }

    const handleBackActivity = () => {
        setsepActivityPage(false)
        setsingleActivityPage(true)
        setSepActivitylist(true)
        document.getElementById('Activity').style.marginBottom = '100px'
    }
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const url = window.location.href
        const parts = url.split("/");
        const acid = parts[parts.length - 5];
        const mid = parts[parts.length - 4];
        const lid = parts[parts.length - 3];
        const pnview = parts[parts.length - 2];
        const cid = parts[parts.length - 1];
        setcid(cid)
        // console.log(DecryptData(this.props.cid))
        if (DecryptData(acid) !== 0) {
            getcid = acid
        } else {
            getcid = cid
        }

        if (localStorage.getItem('userData')) {
            const udata = DecryptData(localStorage.getItem('userData'))
            setRegid(udata)
            console.log("acid",cid)
        console.log("mid",mid)
        Axios.get(`${API_URL}/api/section/GetSectionLessionData/${cid}/${mid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                console.log('GetSectionLessionData', res.data)
                if (res.data) {
                    setPNView(res.data[0]['bSectionView'] === '1' ? EncryptData('N') : EncryptData('P'))
                    const lsn = JSON.parse(res.data[0]['lessionTbl'])
                    if (res.data[0]['lessionTbl'].length > 2) {

                        if (lsn) {
                            setLid(EncryptData(lsn[0]['nLId']))
                        }
                    } else {
                        setLid(EncryptData('0'))
                    }
                    setLessonData(res.data)
                    // console.log(EncryptData(lsn[0]['nLId']))
                    Axios.get(`${API_URL}/api/lession/GetLessionAtid/${EncryptData(lsn[0]['nLId'])}`, {
                        headers: {
                            ApiKey: `${API_KEY}`
                        }
                    })
                        .then(res => {
                            if (res.data) {
                                if (res.data.length !== 0) {
                                    // console.log('GetLessionAtid', res.data)
                                    setTutorialATId(res.data[0]['nTutorialATId'])
                                    setActivityATId(res.data[0]['nActivityATId'])
                                    setPracticeATId(res.data[0]['nPracticeATId'])
                                    setTestATId(res.data[0]['nTestATId'])
                                }
                            }
                        })
                        .catch(err => {
                            {
                                alert("World")
                                ErrorDefaultAlert(err)
                            }
                        })

                    Axios.get(`${API_URL}/api/tutorialDocument/GetTutorialDocumentBatch/${EncryptData(lsn[0]['nLId'])}`, {
                        headers: {
                            ApiKey: `${API_KEY}`
                        }
                    })
                        .then(res => {
                            if (res.data) {
                                // console.log('tutresourcearray', res.data)
                                if (res.data.length !== 0) {
                                    settutresourcearray(res.data)
                                }
                            }
                        })
                        .catch(err => {
                            { ErrorDefaultAlert(err) }
                        })

                    Axios.get(`${API_URL}/api/tutorialDocument/GetTutorialCourseOverview/${EncryptData(lsn[0]['nLId'])}`, {
                        headers: {
                            ApiKey: `${API_KEY}`
                        }
                    })
                        .then(res => {
                            if (res.data) {
                                // console.log('description', res.data)
                                if (res.data.length !== 0) {
                                    setsContent(res.data[0]["sContent"])
                                }
                            }
                        })
                        .catch(err => {
                            { ErrorDefaultAlert(err) }

                        })

                    Axios.get(`${API_URL}/api/activityMember/GetActivityQueTypeMemAct/${EncryptData(lsn[0]['nLId'])}/${udata['regid']}/${cid}`, {
                        headers: {
                            ApiKey: `${API_KEY}`
                        }
                    })
                        .then(res => {
                            if (res.data) {
                                console.log('ACTIVITY', res.data)
                                setquetypeItems(res.data)
                                // this.setState({
                                //     quetypeitems: res.data
                                // })
                            }
                        })
                        .catch(err => {
                            { ErrorDefaultAlert(err) }
                        })
                }
            })
            .catch(err => {
                {
                    ErrorDefaultAlert(err)
                }

            })


        Axios.get(`${API_URL}/api/coursemain/GetCourseName/${cid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    console.log('GetCourseName', res.data)
                    setIsBatch(res.data[0])
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })


        Axios.get(`${API_URL}/api/activityQue/GetActivityQueListSeparateViewActivity/q0n35b7QFQwkemlkqZeYlA==/NcaRT9myjUShi4YozcspTQ==/qOr2fmJ-rEL28x8SQMolTA==`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    // console.log('GetActivityQueListSeparateViewActivity', res.data)
                    // this.setState({
                    //     actquelist: res.data
                    // })
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
        }

    }, []);

    return (
        <>
            <div className="rbt-lesson-area bg-color-white">
                <div className="rbt-lesson-content-wrapper">
                    <div className="rbt-lesson-leftsidebar">
                        <div className="rbt-course-feature-inner rbt-search-activation">
                            <div className="section-title">
                                {isBatch.bIsWithBatch === "yes" ?
                                    <h4 className="rbt-title-style-3">Batch Content</h4> :
                                    <h4 className="rbt-title-style-3">Course Content</h4>}
                            </div>
            
                            <div className="lesson-search-wrapper">
                                <form action="#" className="rbt-search-style-1">
                                    <input className="rbt-search-active" type="text" placeholder="Search Lesson"/>
                                    <button className="search-btn disabled"><i className="feather-search"></i></button>
                                </form>
                            </div>
            
                            <hr className="mt--10"/>
            
                            <div className="rbt-accordion-style rbt-accordion-02 for-right-content accordion">
            
                                <div className="accordion" id="accordionExampleb2">
                                    {LessonData.map((item, index) => {
                                        // console.log(JSON.parse(item.lessionTbl))
                                        return (
                                            <div className="accordion-item card" key={index}>
                                                {JSON.parse(item.lessionTbl).map((lesson, lessonIndex) => {
                                                    return (
                                                        <div key={lessonIndex}>
                                                            <h2 className="accordion-header card-header"
                                                                id={`headingTwo${index + 1}-${lessonIndex + 1}`}>
                                                                <button className={`accordion-button ${activeTab === 'overview' ? 'active' : ''}`} type="button"
                                                                        data-bs-toggle="collapse"
                                                                        aria-expanded={lessonIndex === 0 ? 'true' : 'false'}
                                                                        data-bs-target={`#collapseTwo${index + 1}-${lessonIndex + 1}`}
                                                                        aria-controls={`collapseTwo${index + 1}-${lessonIndex + 1}`}>
                                                                    Day {lessonIndex + 1} : {lesson.sLessionTitle}
                                                                    {/*<span className="rbt-badge-5 ml--10">(Day-1)</span>*/}
                                                                </button>
                                                            </h2>
                                                            <div id={`collapseTwo${index + 1}-${lessonIndex + 1}`}
                                                                 className={`accordion-collapse collapse ${lessonIndex === 0 ? 'show' : ''}`}
                                                                 aria-labelledby={`headingTwo${index + 1}-${lessonIndex + 1}`}>
                                                                <div className="accordion-body card-body">
                                                                    <ul className="rbt-course-main-content liststyle">
                                                                        <li className={`${activeTab === 'overview' ? 'active' : ''}`}  onClick={() => handleTabClick('overview')}>
                                                                            <div
                                                                                className="course-content-left">
                                                                                <i className="feather-play-circle text-dark"></i>
                                                                                <span
                                                                                    className="text text-dark">Overview</span>
                                                                            </div>
                                                                        </li>
                                                                        {TutorialATId === 3 ? <>
                                                                            <li className={`${activeTab === 'content' ? 'active' : ''}`}
                                                                                onClick={() => handleTabClick('content')}>
                                                                                {(isBatch.bIsWithBatch === 'no') ?
                                                                                    <div
                                                                                        className="course-content-left">
                                                                                        <i className="feather-play-circle text-dark"></i>
                                                                                        <span
                                                                                            className="text text-dark">Tutorial</span>
                                                                                    </div>
                                                                                    :
                                                                                    <div
                                                                                        className="course-content-left">
                                                                                        <i className="feather-play-circle text-dark"></i>
                                                                                        <span
                                                                                            className="text text-dark">Content</span>
                                                                                    </div>
                                                                                }
                                                                            </li>
                                                                        </> : <>
            
                                                                        </>}
            
                                                                        {ActivityATId === 3 ? <>
                                                                            <li className={`${activeTab === 'activity' ? 'active' : ''}`}
                                                                                onClick={() => handleTabClick('activity')}>
                                                                                <div
                                                                                    className="course-content-left">
                                                                                    <i className="feather-play-circle text-dark"></i>
                                                                                    <span
                                                                                        className="text text-dark">Activity</span>
                                                                                </div>
                                                                            </li>
                                                                        </> : <>
                                                                            {/*<li>*/}
                                                                            {/*    <a href={""}>*/}
                                                                            {/*        <div*/}
                                                                            {/*            className="course-content-left">*/}
                                                                            {/*            <i className="feather-play-circle text-dark"></i>*/}
                                                                            {/*            <span*/}
                                                                            {/*                className="text text-dark">Activity</span>*/}
                                                                            {/*        </div>*/}
                                                                            {/*    </a>*/}
                                                                            {/*</li>*/}
                                                                        </>}
            
                                                                        {PracticeATId === 3 ? <>
                                                                            <li>
                                                                                <div
                                                                                    className="course-content-left">
                                                                                    <i className="feather-play-circle text-dark"></i>
                                                                                    <span
                                                                                        className="text text-dark">Practice</span>
                                                                                </div>
                                                                            </li>
                                                                        </> : <>
            
                                                                        </>}
            
                                                                        {TestATId === 3 ? <>
                                                                            <li>
                                                                                <a href={""}>
                                                                                    <div
                                                                                        className="course-content-left">
                                                                                        <i className="feather-play-circle text-dark"></i>
                                                                                        <span
                                                                                            className="text text-dark">Test</span>
                                                                                    </div>
                                                                                </a>
                                                                            </li>
                                                                        </> : <>
            
                                                                        </>}
            
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
            
                            </div>
                        </div>
                    </div>
            
                    <div className="rbt-lesson-rightsidebar overflow-hidden lesson-video">
                        <div className="lesson-top-bar">
                            <div className="lesson-top-left">
                                <div className="rbt-lesson-toggle">
                                <button className="lesson-toggle-active btn-round-white-opacity"
                                            title="Toggle Sidebar"><i className="feather-arrow-left"></i></button>
                                </div>
                                <h5>{isBatch.sCourseTitle}</h5>
                            </div>
                            <div className="lesson-top-right">
                                <div className="rbt-btn-close">
                                    <a href="course-details.html" title="Go Back to Course" className="rbt-round-btn"><i
                                        className="feather-x"></i></a>
                                </div>
                            </div>
                        </div>

                        <div className="inner content">

                            <div style={{display: activeTab === 'overview' ? 'block' : 'none'}}>
                                <div className="section-title pt-5 pb-2">
                                    <h4>Introduction</h4>
                                </div>
                                <div>
                                    {parse(sContent)}
                                </div>
                            </div>
                            <div style={{display: activeTab === 'content' ? 'block' : 'none'}}>
                                {/*<div className="section-title pt-5 pb-2">*/}
                                {/*    <h4>PDF Content</h4>*/}
                                {/*</div>*/}

                                <div className={'pt-5 pb-2'}>
                                    PDF Content
                                </div>
                                <div className={'row'} style={{marginBottom: '100px'}}>
                                    {tutresourcearray.map((pdf, index) => {
                                        return (
                                            <>
                                                <div className={'col-lg-4 h-100 mt-3 '} key={index}>
                                                    <div className={'card boxShadow border-0 p-3 h-100'}>
                                                        {/*<p style={{fontSize: '16px'}} data-tooltip-id={index}>{pdf.sFileName.substr(0,25)}</p>*/}
                                                        {/*<ReactTooltip*/}
                                                        {/*    id={index}*/}
                                                        {/*    place="bottom"*/}
                                                        {/*    variant="warning"*/}
                                                        {/*    content={pdf.sFileName}*/}
                                                        {/*//
            
                                                        {/*<Tooltip placement="bottom-start" title={<h6 className={'m-0'}*/}
                                                        {/*                                             style={{*/}
                                                        {/*                                                 color: "white",*/}
                                                        {/*                                                 fontSize: '14px',*/}
                                                        {/*                                                 textAlign: 'left'*/}
                                                        {/*                                             }}>{pdf.sFileName}</h6>}>*/}
                                                        {/*    <p style={{fontSize: '16px'}}>*/}
                                                        {/*        {pdf.sFileName.length > 33 ? <>*/}
                                                        {/*            {pdf.sFileName.substr(0, 33)}...*/}
                                                        {/*        </> : <>*/}
                                                        {/*            {pdf.sFileName}*/}
                                                        {/*        </>}*/}
                                                        {/*    </p>*/}
                                                        {/*</Tooltip>*/}
                                                        <p style={{fontSize: '16px'}}>
                                                            {pdf.sFileName.length > 33 ? <>
                                                                {pdf.sFileName.substr(0, 33)}...
                                                            </> : <>
                                                                {pdf.sFileName}
                                                            </>}
                                                        </p>
                                                        <div className={'row'}>
                                                            <div className={'col'}>
                                                                <small>Size : {pdf.sFileSize}</small>
                                                            </div>
                                                            <div className={'col text-end'}>
                                                                <a href={pdf.sFilePath} target='_blank'
                                                                   className='btn btn-outline-warning icon-b-sm me-2'>
                                                                    <Icon.Eye size={12}
                                                                              className='cursor-pointer'/>
                                                                </a>

                                                                <a href={pdf.sFilePath} target='_blank'
                                                                   className='btn btn-outline-warning icon-b-sm'>
                                                                    <Icon.Download size={12}
                                                                                   className='cursor-pointer'/>
                                                                </a>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                            <div style={{display: activeTab === 'activity' ? 'block' : 'none'}}>
                                {/*<div className="section-title pt-5 pb-2">*/}
                                {/*    <h4>PDF Content</h4>*/}
                                {/*</div>*/}

                                {SepActivitylist ? <>
                                    <div className={'pt-5 pb-2'}>
                                        Activity
                                    </div>
                                </> : <> </>}

                                <div className={"row mt-3"} id={'Activity'} style={{marginBottom: '100px'}}>
                                    {quetypeItems.map((item, index) => {
                                        return (
                                            <>
                                                {item.nSQId === 17 || item.nSQId === 18 || item.nSQId === 19 || item.nSQId === 20 || item.nSQId === 21 ? <>
                                                    <div className={'col-lg-6 mt-4'} key={index}>
                                                        <Link href={`#`}
                                                              onClick={() => handleSepActivityPage(item.nAQId)}>
                                                            {SepActivitylist ? <>
                                                                <Card className="border-primary activity-card">
                                                                    <CardBody className="card-mobile-view p-4">
                                                                        <Row>
                                                                            <Col lg={10}>
                                                                                <div
                                                                                    className="d-flex justify-content-start">
                                                                                    <div className="avatar mr-1">
                                                                                    <span
                                                                                        className="avatar-content">{index + 1}</span>
                                                                                    </div>
                                                                                    <div
                                                                                        className="profile-user-info ms-3">
                                                                                        <h6 className="mb-0 font-weight-600 font-16">{item.sActivityName}</h6>
                                                                                        <small
                                                                                            className="text-muted font-12">({item.sSubQueType})</small>
                                                                                    </div>
                                                                                    {/*{(item.bIsWithBatch === 'no') ? ((this.state.isPackageLabel) ? (<div className="badge badge-primary margin-flex">*/}
                                                                                    {/*    {(this.state.userpackages.find(obj => obj === ((item.nPkgId) ? item.nPkgId : 0)) !== undefined) ? <Icon.Unlock size={14} /> : <Icon.Lock size={14} />}   <span className='text-right'>{(item.sPackageName) ? item.sPackageName : ''}</span>*/}
                                                                                    {/*</div>) : '') : <div className="badge badge-primary margin-flex"><Icon.Unlock size={14} />  <span className='text-right'>{(item.sPackageName) ? item.sPackageName : ''}</span></div>}*/}
                                                                                </div>
                                                                            </Col>
                                                                            <Col>
                                                                                {item.sPackageName !== null ? <>
                                                                                    <div className={'pkgName'}>
                                                                                        <p className={'float-right'}
                                                                                           style={{
                                                                                               paddingTop: '0px',
                                                                                               fontSize: '15px'
                                                                                           }}>{item.sPackageName}</p>
                                                                                    </div>
                                                                                </> : <></>}
                                                                            </Col>
                                                                        </Row>
                                                                        <hr className='mt-3 mb-3'/>
                                                                        <div className="card-text">
                                                                            <div className="mb-3">
                                                                                <div className={'row'}>
                                                                                    <div className={'col'}>
                                                                                        <div
                                                                                            className="font-weight-bolder activity-font font-14 p-1">
                                                                                            Task completed
                                                                                            = {item.act_ans_per} %
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className={'col text-end'}>
                                                                            <span
                                                                                className="font-weight-bolder activity-font bg-secondary-subtle p-1 rounded-2 font-14">
                                                                                Questions: {item.act_ans}/{item.act_cnt}
                                                                            </span>
                                                                                    </div>
                                                                                </div>

                                                                                {/*{(this.state.isPackageLabel) ? ((item.nFreeAccess !== null) ? <div className='font-weight-500 text-danger'><b>Free Access*/}
                                                                                {/*    : {item.nFreeAccess}</b></div> : '') : ''}*/}
                                                                            </div>
                                                                        </div>
                                                                        <Progress color="success"
                                                                                  value={item.act_ans_per}/>
                                                                    </CardBody>
                                                                </Card>
                                                            </> : <></>}

                                                        </Link>
                                                    </div>
                                                </> : <>
                                                    {singleActivityPage ? <>
                                                        <div className={'col-lg-6 mt-4'}>
                                                            <Card className="border-primary activity-card">
                                                                <CardBody className="card-mobile-view p-4">
                                                                    <Row>
                                                                        <Col lg={10}>
                                                                            <div
                                                                                className="d-flex justify-content-start">
                                                                                <div className="avatar mr-1">
                                                                                    <span
                                                                                        className="avatar-content">{index + 1}</span>
                                                                                </div>
                                                                                <div className="profile-user-info ms-3">
                                                                                    <h6 className="mb-0 font-weight-600 font-16">{item.sActivityName}</h6>
                                                                                    <small
                                                                                        className="text-muted font-12">({item.sSubQueType})</small>
                                                                                </div>
                                                                                {/*{(item.bIsWithBatch === 'no') ? ((this.state.isPackageLabel) ? (<div className="badge badge-primary margin-flex">*/}
                                                                                {/*    {(this.state.userpackages.find(obj => obj === ((item.nPkgId) ? item.nPkgId : 0)) !== undefined) ? <Icon.Unlock size={14} /> : <Icon.Lock size={14} />}   <span className='text-right'>{(item.sPackageName) ? item.sPackageName : ''}</span>*/}
                                                                                {/*</div>) : '') : <div className="badge badge-primary margin-flex"><Icon.Unlock size={14} />  <span className='text-right'>{(item.sPackageName) ? item.sPackageName : ''}</span></div>}*/}
                                                                            </div>
                                                                        </Col>
                                                                        <Col>
                                                                            {item.sPackageName !== null ? <>
                                                                                <div className={'pkgName'}>
                                                                                    <p className={'float-right'}
                                                                                       style={{
                                                                                           paddingTop: '0px',
                                                                                           fontSize: '15px'
                                                                                       }}>{item.sPackageName}</p>
                                                                                </div>
                                                                            </> : <></>}
                                                                        </Col>
                                                                    </Row>
                                                                    <hr className='mt-3 mb-3'/>
                                                                    <div className="card-text">
                                                                        <div className="mb-3">
                                                                            <div className={'row'}>
                                                                                <div className={'col'}>
                                                                                    <div
                                                                                        className="font-weight-bolder activity-font font-14 p-1">
                                                                                        Task completed
                                                                                        = {item.act_ans_per} %
                                                                                    </div>
                                                                                </div>
                                                                                <div className={'col text-end'}>
                                                                            <span
                                                                                className="font-weight-bolder activity-font bg-secondary-subtle p-1 rounded-2 font-14">
                                                                                Questions: {item.act_ans}/{item.act_cnt}
                                                                            </span>
                                                                                </div>
                                                                            </div>

                                                                            {/*{(this.state.isPackageLabel) ? ((item.nFreeAccess !== null) ? <div className='font-weight-500 text-danger'><b>Free Access*/}
                                                                            {/*    : {item.nFreeAccess}</b></div> : '') : ''}*/}
                                                                        </div>
                                                                    </div>
                                                                    <Progress color="success" value={item.act_ans_per}/>
                                                                </CardBody>
                                                            </Card>
                                                        </div>
                                                    </> : <></>}

                                                </>}

                                            </>
                                        )
                                    })}


                                </div>
                                <div className={'row'}>
                                    {sepActivityPage ? <>
                                        {activitySeperateCard.length !== 0 ? <>
                                            {activitySeperateCard.map((item, index) => {
                                                return (
                                                    <>
                                                        <div className={'col-lg-6'} key={index}>
                                                            <button className={'btn btn-lg btn-primary'} onClick={handleBackActivity}>
                                                                <i className="feather-arrow-left me-2"></i>
                                                                Back
                                                            </button>
                                                            <Card className='border mb-1 mt-3'>

                                                                <CardHeader
                                                                    className={`${(item.sep_ans_fill === '0') ? 'bg-secondary' : 'bg-success'} p-0`}>

                                                                    {/* <Progress value={30} className='progress-bar-success h-45 position-absolute w-100 h--60' /> */}

                                                                    <div className='row w-100'
                                                                         style={{display: "contents"}}>
                                                                        <div className='col-9'>
                                                                            <h5 className="mb-0 p-1 text-white animate shake position-relative w-100 font-weight-bolder">{index + 1} : {item.sActivityName}
                                                                            </h5>
                                                                        </div>

                                                                    </div>
                                                                </CardHeader>
                                                                <CardBody className='p-2 inner-activity-name'>
                                                                    <div
                                                                        className='font-weight-bolder'>{item.sQueTitle}</div>
                                                                </CardBody>
                                                            </Card>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </> : <></>}
                                    </> : <></>}
                                </div>
                            </div>

                        </div>


                        <div
                            className="bg-color-extra2 ptb--15 overflow-hidden position-absolute bottom-0 start-0 end-0">
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
                </div>
            </div>
            <div className="rbt-progress-parent">
                <svg className="rbt-back-circle svg-inner" width="100%" height="100%" viewBox="-1 -1 102 102">
                    <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"/>
                </svg>
            </div>
        </>
    );
};

export default CourseLesson;
