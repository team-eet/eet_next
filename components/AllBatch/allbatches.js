import Image from "next/image";
import Link from "next/link";
import { API_URL, API_KEY } from "../../constants/constant";
import {useEffect, useState} from "react";
import Axios from "axios";
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import { Row, Col } from 'reactstrap'
import "rc-slider/assets/index.css";
import { useRouter } from "next/router";
import Pagination from "@/components/Common/Pagination";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { EncryptData } from "@/components/Services/encrypt-decrypt";

let categoryId;
let tutordId;
let shortBy;
let searchBy;

const AllBatches = () => {
    const REACT_APP = API_URL
    const [getBatchData, setBatchData] = useState([])
    const [getbatchcount, setbatchcount] = useState(0)
    const [getcategoryData, setcategoryData] = useState([])
    const [getcategoryLevel, setcategoryLevel] = useState([])
    const [gettutorList, settutorList ] = useState([])
    const [getshowFilter, setshowFilter] = useState(false)
    const [value, setValue] = useState([0, 400]);
    const [activeView, setActiveView] = useState('List');
    const router = useRouter()
    const [isLoading, setisLoading] = useState(true)

    const [currentPage, setCurrentPage] = useState(1);
    // const [recordsPerPage] = useState(2);
    const recordsPerPage = 10
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const currentRecords = getBatchData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(getBatchData.length / recordsPerPage)

    // Handlers for changing page
    const goToNextPage = () => {
        if (currentPage < nPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // New Code
    const getTimeDifference = (startTime, endTime, days) => {
        if (!startTime || !endTime || !days) {
            return { hours: 0, minutes: 0 };
        }

        days = parseInt(days); // Ensure days is a number

        const isValidTimeFormat = (time) => /^\d{1,2}:\d{2}\s*(am|pm)$/i.test(time);
        if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
            console.error("Invalid time format:", startTime, endTime);
            return { hours: 0, minutes: 0 };
        }

        const [startHour, startMinute] = startTime.match(/(\d+):(\d+)/).slice(1).map(Number);
        const [endHour, endMinute] = endTime.match(/(\d+):(\d+)/).slice(1).map(Number);

        const startPeriod = startTime.toLowerCase().includes("pm") && startHour !== 12 ? 12 : 0;
        const endPeriod = endTime.toLowerCase().includes("pm") && endHour !== 12 ? 12 : 0;

        const startDate = new Date(0, 0, 0, (startHour % 12) + startPeriod, startMinute);
        const endDate = new Date(0, 0, 0, (endHour % 12) + endPeriod, endMinute);

        let differenceInMs = endDate - startDate;
        if (differenceInMs < 0) {
            differenceInMs += 24 * 60 * 60 * 1000; // Adjust for next day scenarios
        }

        const differenceInMinutes = differenceInMs / (1000 * 60);
        const totalMinutes = differenceInMinutes * days; // Multiply by days
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        console.log("Final Calculation:", { totalHours, remainingMinutes });

        return { totalHours, remainingMinutes };
    };
    // Close Code


    useEffect(() => {
        getCourse();
        bindCourseCategory();
        bindLevel();
        bindTutor();
        setTimeout(() => {
            setisLoading(false)
        }, 7000)
    }, [])

    const getCourse = () => {
        Axios.get(`${API_URL}/api/coursemain/GetBatchCoursesMem/0`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    // console.log(res.data)
                    if (res.data.length !== 0) {
                        console.log("Batches All Data",res.data)
                        setBatchData(res.data)
                        setbatchcount(res.data[0]['remain_course_count'])
                    }
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const bindCourseCategory = () => {
        Axios.get(`${API_URL}/api/coursemain/GetBatchWiseCategory`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data.length !== 0) {
                    setcategoryData(res.data)
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const bindLevel = () => {
        Axios.get(`${API_URL}/api/coursemain/GetCourseLevelCount`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res)
                if (res.data.length !== 0) {
                    setcategoryLevel(res.data)
                    // setisLoading(false)
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const  bindTutor = () => {
        Axios.get(`${API_URL}/api/student/BindTutor`, {
        // Axios.get(`${REACT_APP.API_URL}/api/tutorBatch/BindAllTutors`, {
        // Axios.get(`${REACT_APP.API_URL}/api/TutorBasics/GetAllTutors/2`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                if (res.data.length !== 0) {
                    settutorList(res.data)

                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const showFilter = () => {
        setshowFilter(true)
    }
    const handleSliderChange = (newValue) => {
        setValue(newValue);
    };
    const handleBatchView = (view) => {
        setActiveView(view);
    };

    const onTutorchange = (e) => {
        console.log(e.target.value)


        Axios.get(`${API_URL}/api/coursemain/GetBatchCoursesMem/0/${categoryId}/${e.target.value}/${shortBy}/${searchBy}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    console.log(res.data)
                    // if (res.data.length !== 0) {
                    //     setBatchData(res.data)
                    //     setbatchcount(res.data[0]['remain_course_count'])
                    //     // setisLoading(false)
                    // }
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
            // Axios.get(`${REACT_APP.API_URL}/api/tutorBatch/GetApprovedBatchesAdminByTutor/${e.target.value}`, {
            //     headers: {
            //         ApiKey: `${REACT_APP.API_KEY}`
            //     }
            // })
            //     .then(res => {
            //         if (res.data.length !== 0) {
            //             console.log(res.data)
            //             // this.setState({ approvedbatchitems: res.data })
            //         }
            //     })
            //     .catch(err => {
            //         { ErrorDefaultAlert(err) }
            //
            //     })
    }

    const onCategoryChange = (e) => {
        // console.log(e.target.value)
        categoryId = e.target.value
        const tutorid = tutordId ? tutordId : '~'
        const shortby = shortBy ? shortBy : 'L'
        const searchby = searchBy ? searchBy : '~'

        // console.log(e.target.value, tutorid, shortby, searchby)

        Axios.get(`${API_URL}/api/coursemain/GetBatchCoursesMem/2/${e.target.value}/${tutorid}/${shortby}/${searchby}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    // console.log(res.data)
                    setdatactageorywise(res.data)
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }
    return (
        <>
            <div className="rbt-page-banner-wrapper">
                <div className="rbt-banner-image"></div>
                <div className="rbt-banner-content">
                    <div className="rbt-banner-content-top">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <ul className="page-list">
                                        <li className="rbt-breadcrumb-item"><Link href="index.html">Home</Link></li>
                                        <li>
                                            <div className="icon-right"><i className="feather-chevron-right"></i></div>
                                        </li>
                                        <li className="rbt-breadcrumb-item active">All Batches</li>
                                    </ul>

                                    <div className=" title-wrapper">
                                        <h1 className="title mb--0">All Batches</h1>
                                        <Link href="#" className="rbt-badge-2">
                                            <div className="image">🎉</div>
                                            {getBatchData.length} Batches
                                        </Link>
                                    </div>

                                    <p className="description">Batches that help beginner designers become true
                                        unicorns. </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rbt-course-top-wrapper mt--40">
                        <div className="container">
                            <div className="row g-5 align-items-center">
                                <div className="col-lg-5 col-md-12">
                                    <div className="rbt-sorting-list d-flex flex-wrap align-items-center">

                                        <div className="rbt-short-item switch-layout-container">
                                            <ul className="course-switch-layout">
                                                <li className="course-switch-item">
                                                    <button
                                                        className={activeView === 'Grid' ? 'rbt-grid-view active' : 'rbt-grid-view'}
                                                        title="Grid Layout" onClick={() => handleBatchView('Grid')}>
                                                        <i className="feather-grid"></i>
                                                        <span className="text">Grid</span>
                                                    </button>
                                                </li>
                                                <li className="course-switch-item">
                                                    <button
                                                        className={activeView === 'List' ? 'rbt-list-view active' : 'rbt-list-view'}
                                                        title="List Layout" onClick={() => handleBatchView('List')}>
                                                        <i className="feather-list"></i>
                                                        <span className="text">List</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        {getBatchData.length !== 0 ? <div className="rbt-short-item">
                                            <span
                                                className="course-index">Showing {indexOfFirstRecord + 1}-{indexOfLastRecord} of {getBatchData.length} results</span>
                                        </div> : ''}
                                    </div>
                                </div>

                                <div className="col-lg-7 col-md-12">
                                    <div
                                        className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                        <div className="rbt-short-item">
                                            <div className="rbt-search-style me-0">
                                                <input type="text" className={'search-btn'}
                                                       placeholder="Search Your batch.."/>
                                                <button type="submit" className="rbt-search-btn rbt-round-btn">
                                                    <i className="feather-search"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="rbt-short-item">
                                            {getshowFilter ? <>
                                                <div className="view-more-btn text-start text-sm-end">
                                                    <button onClick={() => setshowFilter(false)}
                                                            className="discover-filter-button discover-filter-activation rbt-btn btn-white btn-md radius-round">
                                                        Close
                                                        <i className="feather-x"></i>
                                                    </button>
                                                </div>
                                            </> : <>
                                                <div className="view-more-btn text-start text-sm-end">
                                                    <button onClick={showFilter}
                                                            className="discover-filter-button discover-filter-activation rbt-btn btn-white btn-md radius-round">
                                                        Filter
                                                        <i className="feather-filter"></i>
                                                    </button>
                                                </div>
                                            </>}

                                        </div>
                                    </div>
                                </div>
                            </div>


                            {getshowFilter ? <div className="filter-inner" style={{marginTop: '70px'}}>
                                <hr color={'#e6e3f14f'} style={{opacity: '0.2'}}></hr>
                                <Row>
                                    <Col>
                                        <div className="filter-select-option">
                                            <div className="filter-select rbt-modern-select">
                                                <span className="select-label d-block">Short By Category</span>
                                                <select onChange={onCategoryChange}>
                                                    {getcategoryData.map((data, index) => {
                                                        return (
                                                            <>
                                                                <option key={index}
                                                                        value={data.nCCId}>{data.sCategory}</option>
                                                            </>
                                                        )
                                                    })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="filter-select-option">
                                            <div className="filter-select rbt-modern-select">
                                                <span className="select-label d-block">Select Tutor</span>
                                                <select onChange={onTutorchange}>
                                                    {gettutorList.map((data, index) => {
                                                        // console.log(data.nCreatedBy)
                                                        return (
                                                            <div key={index}>
                                                                <option
                                                                    value={data.nCreatedBy}>{data.sFName} {data.sLName}</option>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="filter-select-option">
                                            <div className="filter-select rbt-modern-select">
                                                <span className="select-label d-block">Short By</span>
                                                <select>
                                                    <option value={"lowest"}>Lowest</option>
                                                    <option value={"highest"}>Highest</option>
                                                </select>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col style={{marginTop: '25px'}}>
                                        <button className="rbt-btn btn-gradient btn-md">
                                            Filter
                                        </button>
                                    </Col>
                                </Row>


                            </div> : ''}


                        </div>
                    </div>

                </div>
            </div>

            {activeView === 'Grid' ? (
                <div className="rbt-section-overlayping-top rbt-section-gapBottom">
                    <div className="container">
                        <div className="rbt-course-grid-column list-column-half active-list-view">
                            {isLoading ? <>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt-5">
                                    <div className="rbt-card variation-01 rbt-hover" style={{margin: '10px'}}>
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                                <Skeleton height={20} width={50}/>
                                            </div>
                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>

                                            <span className="lesson-number mb-1"><span
                                                className={'text-dark'}>
                                                    <Skeleton height={20}/>
                                                </span></span>
                                            <br></br>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt-5">
                                    <div className="rbt-card variation-01 rbt-hover" style={{margin: '10px'}}>
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                                <Skeleton height={20} width={50}/>
                                            </div>
                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>

                                            <span className="lesson-number mb-1"><span
                                                className={'text-dark'}>
                                                    <Skeleton height={20}/>
                                                </span></span>
                                            <br></br>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt-5">
                                    <div className="rbt-card variation-01 rbt-hover" style={{margin: '10px'}}>
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                                <Skeleton height={20} width={50}/>
                                            </div>
                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>

                                            <span className="lesson-number mb-1"><span
                                                className={'text-dark'}>
                                                    <Skeleton height={20}/>
                                                </span></span>
                                            <br></br>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt-5">
                                    <div className="rbt-card variation-01 rbt-hover" style={{margin: '10px'}}>
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                                <Skeleton height={20} width={50}/>
                                            </div>
                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>

                                            <span className="lesson-number mb-1"><span
                                                className={'text-dark'}>
                                                    <Skeleton height={20}/>
                                                </span></span>
                                            <br></br>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </> : <>
                                {currentRecords && currentRecords.map((data, index) => {
                                    const { totalHours, remainingMinutes } = getTimeDifference(
                                        data.sBatchStartTime,
                                        data.sBatchEndTime,
                                        data.batchdays
                                    );
                                    return (
                                        <div className="col-lg-4 col-md-6 col-sm-6 col-12 mt-5" key={index}>
                                            <div className="rbt-card variation-01 rbt-hover" style={{margin: '10px'}}>
                                                <div className="rbt-card-img">
                                                    <Link
                                                        href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                                        <Image className={"position-relative"} objectFit="inherit"
                                                               fill={true} src={data.batchimg} alt="Card image"/>
                                                        {/*style={{ height: '200px' }}*/}
                                                    </Link>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-category">
                                                        <Link href="#">{data.sCategory}</Link>
                                                    </div>
                                                    <h4 className="rbt-card-title">
                                                        <Link
                                                            href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                                            {data.sCourseTitle}
                                                        </Link>
                                                    </h4>

                                                    <span className="lesson-number mb-1">By <span
                                                        className={'text-dark'}><b>{data.sFName} {data.sLName}</b></span></span>
                                                    <br></br>
                                                    <span className="lesson-number">
    {data.batchdays} Days
    <span className="lesson-time ms-2">
        ({totalHours} Hours {remainingMinutes} Minutes)
    </span>
</span>
                                                    <p className="rbt-card-text m-0">
                                                        <span
                                                            className={'mr-2'}>{new Date(data.batchstartdatenew).getDate()} {new Date(data.batchstartdatenew).toLocaleString('default', {month: 'short'})} - {new Date(data.dBatchEndDate).getDate()} {new Date(data.dBatchEndDate).toLocaleString('default', {month: 'short'})}</span> |
                                                        <span
                                                            className={'ms-2'}>{data.sBatchStartTime} to {data.sBatchEndTime}</span>
                                                    </p>

                                                    <div className='d-flex mt-1 mb-5 mt-2'>
                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Monday')) ? <>
                                                            <div className='circle-fill-badge'><span>M</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>M</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Tuesday')) ? <>
                                                            <div className='circle-fill-badge'><span>T</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>T</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Wednesday')) ? <>
                                                            <div className='circle-fill-badge'><span>W</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>W</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Thursday')) ? <>
                                                            <div className='circle-fill-badge'><span>T</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>T</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Friday')) ? <>
                                                            <div className='circle-fill-badge'><span>F</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>F</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Saturday')) ? <>
                                                            <div className='circle-fill-badge'><span>S</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>S</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Sunday')) ? <>
                                                            <div className='circle-fill-badge'><span>S</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>S</span></div>
                                                        </>}

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>}

                        </div>
                    </div>
                    <div className="row mt--15">
                        <div className="col-lg-12 mt--60">
                            {recordsPerPage >= 10 ? <>
                                <div className="pagination-controls mt-4">
                                    <button className="prev-btn" onClick={goToPreviousPage}
                                            disabled={currentPage === 1}>
                                        {/*Previous*/}
                                        <i className="feather-chevrons-left"></i>
                                    </button>

                                    {/* Page Number Buttons */}
                                    {Array.from({length: nPages}, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index + 1)}  // Set the current page to the clicked page number
                                            className={`page-number-btn ${currentPage === index + 1 ? 'active' : ''}`}  // Add 'active' class to the current page
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button className="next-btn" onClick={goToNextPage}
                                            disabled={currentPage === nPages}>
                                        {/*Next*/}
                                        <i className="feather-chevrons-right"></i>

                                    </button>
                                </div>
                            </> : <></>}
                        </div>
                    </div>
                </div>

            ) : (
                <div className="rbt-section-overlayping-top rbt-section-gapBottom">
                    <div className="container">

                        <div className={`rbt-course-grid-column list-column-half active-list-view`}>
                            {isLoading ? <>
                                <div className="course-grid-4" data-sal-delay="150" data-sal="data-up"
                                     data-sal-duration="800">
                                    <div className="rbt-card variation-01 rbt-hover card-list-2">
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                            </div>
                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>
                                            <span className="lesson-number mb-1">By <span
                                                className={'text-dark'}>
                                                    <Skeleton height={20} width={70}/>
                                                </span></span>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                            </div>
                                            <div className="rbt-card-bottom">
                                                <div className="read-more-btn">
                                                    <Skeleton height={20} width={50}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="course-grid-4" data-sal-delay="150" data-sal="data-up"
                                     data-sal-duration="800">
                                    <div className="rbt-card variation-01 rbt-hover card-list-2">
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                            </div>
                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>
                                            <span className="lesson-number mb-1">By <span
                                                className={'text-dark'}>
                                                    <Skeleton height={20} width={70}/>
                                                </span></span>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                            </div>
                                            <div className="rbt-card-bottom">
                                                <div className="read-more-btn">
                                                    <Skeleton height={20} width={50}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="course-grid-4" data-sal-delay="150" data-sal="data-up"
                                     data-sal-duration="800">
                                    <div className="rbt-card variation-01 rbt-hover card-list-2">
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                                {/*<Link href="#">{data.sCategory}</Link>*/}
                                            </div>
                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>
                                            <span className="lesson-number mb-1">By <span
                                                className={'text-dark'}>
                                                    <Skeleton height={20} width={70}/>
                                                </span></span>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                            </div>
                                            <div className="rbt-card-bottom">
                                                <div className="read-more-btn">
                                                    <Skeleton height={20} width={50}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="course-grid-4" data-sal-delay="150" data-sal="data-up"
                                     data-sal-duration="800">
                                    <div className="rbt-card variation-01 rbt-hover card-list-2">
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                                {/*<Link href="#">{data.sCategory}</Link>*/}
                                            </div>
                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>
                                            <span className="lesson-number mb-1">By <span
                                                className={'text-dark'}>
                                                    <Skeleton height={20} width={70}/>
                                                </span></span>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                            </div>
                                            <div className="rbt-card-bottom">
                                                <div className="read-more-btn">
                                                    <Skeleton height={20} width={50}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="course-grid-4" data-sal-delay="150" data-sal="data-up"
                                     data-sal-duration="800">
                                    <div className="rbt-card variation-01 rbt-hover card-list-2">
                                        <div className="rbt-card-img">
                                            <Skeleton height={150}/>
                                        </div>
                                        <div className="rbt-card-body">
                                            <div className="rbt-category">
                                                {/*<Link href="#">{data.sCategory}</Link>*/}
                                            </div>

                                            <h4 className="rbt-card-title">
                                                <Skeleton height={20}/>
                                            </h4>
                                            <span className="lesson-number mb-1">By <span
                                                className={'text-dark'}>
                                                    <Skeleton height={20} width={70}/>
                                                </span></span>
                                            <div className='d-flex mt-1 mb-5 mt-2'>

                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                                <Skeleton height={20} width={30}/>
                                            </div>
                                            <div className="rbt-card-bottom">
                                                <div className="read-more-btn">
                                                    <Skeleton height={20} width={50}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </> : <>
                                {currentRecords && currentRecords.map((data, index) => {
                                    const { totalHours, remainingMinutes } = getTimeDifference(
                                        data.sBatchStartTime,
                                        data.sBatchEndTime,
                                        data.batchdays
                                    );
                                    return (
                                        <div className="course-grid-4" key={index} data-sal-delay="150"
                                             data-sal="data-up"
                                             data-sal-duration="800">
                                            <div className="rbt-card variation-01 rbt-hover card-list-2">
                                                <div className="rbt-card-img">
                                                    <Link
                                                        href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                                        <Image className={"position-relative"} objectFit="inherit"
                                                               fill={true} src={data.batchimg} alt="Card image"/>
                                                    </Link>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-category">
                                                        <Link href="#">{data.sCategory}</Link>
                                                    </div>
                                                    <h4 className="rbt-card-title">
                                                        <Link
                                                            href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                                            {data.sCourseTitle}
                                                        </Link>
                                                    </h4>
                                                    <span className="lesson-number mb-1">By <span
                                                        className={'text-dark'}><b>{data.sFName} {data.sLName}</b></span></span>
                                                    <span className="lesson-number">
    {data.batchdays} Days
    <span className="lesson-time ms-2">
        ({totalHours} Hours {remainingMinutes} Minutes)
    </span>
</span>
                                                    <p className="rbt-card-text m-0">
                                                    <span
                                                        className={'mr-2'}>{new Date(data.batchstartdatenew).getDate()} {new Date(data.batchstartdatenew).toLocaleString('default', {month: 'short'})} - {new Date(data.dBatchEndDate).getDate()} {new Date(data.dBatchEndDate).toLocaleString('default', {month: 'short'})}</span> |
                                                        <span
                                                            className={'ms-2'}>{data.sBatchStartTime} to {data.sBatchEndTime}</span>
                                                    </p>
                                                    <p className="rbt-card-text font-14 m-0">

                                                    </p>
                                                    <div className='d-flex mt-1 mb-5 mt-2'>

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Monday')) ? <>
                                                            <div className='circle-fill-badge'><span>M</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>M</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Tuesday')) ? <>
                                                            <div className='circle-fill-badge'><span>T</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>T</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Wednesday')) ? <>
                                                            <div className='circle-fill-badge'><span>W</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>W</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Thursday')) ? <>
                                                            <div className='circle-fill-badge'><span>T</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>T</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Friday')) ? <>
                                                            <div className='circle-fill-badge'><span>F</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>F</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Saturday')) ? <>
                                                            <div className='circle-fill-badge'><span>S</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>S</span></div>
                                                        </>}

                                                        {(JSON.parse(data.sDays).find(obj => obj === 'Sunday')) ? <>
                                                            <div className='circle-fill-badge'><span>S</span></div>
                                                        </> : <>
                                                            <div className='circle-badge'><span>S</span></div>
                                                        </>}

                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <div className="read-more-btn">
                                                            <Link className="rbt-moderbt-btn"
                                                                  href={`/batch-details/${EncryptData(data.nCId)}/${EncryptData(data.nTBId)}`}>
                                                                    <span
                                                                        className="moderbt-btn-text">Register Now</span>
                                                                <i className="feather-arrow-right"></i>
                                                            </Link>
                                                        </div>
                                                        {/*<Link className="transparent-button" href="course-details.html">Register Now<i>*/}
                                                        {/*  <svg width="17" height="12" xmlns="http://www.w3.org/2000/svg">*/}
                                                        {/*    <g stroke="#27374D" fill="none" fill-rule="evenodd">*/}
                                                        {/*      <path d="M10.614 0l5.629 5.629-5.63 5.629"/>*/}
                                                        {/*      <path stroke-linecap="square" d="M.663 5.572h14.594"/>*/}
                                                        {/*    </g>*/}
                                                        {/*  </svg>*/}
                                                        {/*</i></Link>*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>}

                        </div>
                    </div>
                    <div className="row mt--15">
                        <div className="col-lg-12 mt--60">
                            {recordsPerPage >= 10 ? <>
                                <div className="pagination-controls mt-4">
                                    <button className="prev-btn" onClick={goToPreviousPage}
                                            disabled={currentPage === 1}>
                                        {/*Previous*/}
                                        <i className="feather-chevrons-left"></i>
                                    </button>

                                    {/* Page Number Buttons */}
                                    {Array.from({length: nPages}, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index + 1)}  // Set the current page to the clicked page number
                                            className={`page-number-btn ${currentPage === index + 1 ? 'active' : ''}`}  // Add 'active' class to the current page
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button className="next-btn" onClick={goToNextPage}
                                            disabled={currentPage === nPages}>
                                        {/*Next*/}
                                        <i className="feather-chevrons-right"></i>

                                    </button>
                                </div>
                            </> : <></>}
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default AllBatches;
