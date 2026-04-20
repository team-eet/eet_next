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



const AllBatches = () => {
    const REACT_APP = API_URL
    const [getBatchData, setBatchData] = useState([])
    const [getbatchcount, setbatchcount] = useState(0)
    const [getcategoryData, setcategoryData] = useState([])
    const [getcategoryLevel, setcategoryLevel] = useState([])
    const [gettutorList, settutorList] = useState([])
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
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [priceFilter, setPriceFilter] = useState(''); // 'free' | 'paid' | ''
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [ratingFilter, setRatingFilter] = useState(0); // minimum rating
    const [filteredData, setFilteredData] = useState([]);
    // AFTER
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(filteredData.length / recordsPerPage);
// ADD after const [filteredData, setFilteredData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTutor, setSelectedTutor] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
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
            // console.error("Invalid time format:", startTime, endTime);
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


        return { totalHours, remainingMinutes };
    };


    useEffect(() => {
        getCourse();
        bindCourseCategory();
        bindLevel();
        bindTutor();

    }, [])
    // AFTER
    // AFTER
    useEffect(() => {
        let result = [...getBatchData];

        // Default sort: upcoming batches first (closest to today first)
        const today = new Date();
        result.sort((a, b) => {
            const aDate = new Date(a.dBatchStartDate);
            const bDate = new Date(b.dBatchStartDate);
            const aFuture = aDate >= today;
            const bFuture = bDate >= today;

            // Both upcoming: show nearest first
            if (aFuture && bFuture) return aDate - bDate;
            // Both past: show most recent past first
            if (!aFuture && !bFuture) return bDate - aDate;
            // Upcoming always above past
            return aFuture ? -1 : 1;
        });

        // Smart search across title, category, tutor, level
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(batch =>
                batch.sCourseTitle?.toLowerCase().includes(query) ||
                batch.sCategory?.toLowerCase().includes(query) ||
                batch.sFName?.toLowerCase().includes(query) ||
                batch.sLName?.toLowerCase().includes(query) ||
                `${batch.sFName} ${batch.sLName}`.toLowerCase().includes(query) ||
                batch.sLevel?.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedCategory) {
            result = result.filter(batch => batch.sCategory === selectedCategory);
        }

        // Level filter
        if (selectedLevel) {
            result = result.filter(batch => batch.sLevel === selectedLevel);
        }

        if (selectedTutor) {
            result = result.filter(batch =>
                `${batch.sFName?.trim()} ${batch.sLName?.trim()}`.toLowerCase() === selectedTutor.toLowerCase()
            );
        }

        // Price filter
        if (priceFilter === 'free') {
            result = result.filter(batch => !batch.dAmount || Number(batch.dAmount) === 0);
        } else if (priceFilter === 'paid') {
            result = result.filter(batch => batch.dAmount && Number(batch.dAmount) > 0);
        }

        // Price range filter
        if (selectedPriceRange === '0-200') {
            result = result.filter(batch => Number(batch.dAmount) >= 0 && Number(batch.dAmount) <= 200);
        } else if (selectedPriceRange === '200-900') {
            result = result.filter(batch => Number(batch.dAmount) > 200 && Number(batch.dAmount) <= 900);
        } else if (selectedPriceRange === '900+') {
            result = result.filter(batch => Number(batch.dAmount) > 900);
        }

        // Rating filter
        if (ratingFilter > 0) {
            result = result.filter(batch => Number(batch.user_rate) >= ratingFilter);
        }

        // Start date filter
        if (startDateFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);

            if (startDateFilter === 'today') {
                result = result.filter(batch => {
                    const start = new Date(batch.dBatchStartDate);
                    return start >= today && start < new Date(today.getTime() + 86400000);
                });
            } else if (startDateFilter === 'this_week') {
                result = result.filter(batch => {
                    const start = new Date(batch.dBatchStartDate);
                    return start >= today && start <= weekEnd;
                });
            } else if (startDateFilter === 'upcoming') {
                result = result.filter(batch => new Date(batch.dBatchStartDate) >= today);
            }
        }

        // Override sort if user picks oldest (farthest upcoming date first)
        if (sortBy === 'oldest') {
            const today = new Date();
            result.sort((a, b) => {
                const aDate = new Date(a.dBatchStartDate);
                const bDate = new Date(b.dBatchStartDate);
                const aFuture = aDate >= today;
                const bFuture = bDate >= today;

                // Both upcoming: show farthest first
                if (aFuture && bFuture) return bDate - aDate;
                // Both past: show oldest past first
                if (!aFuture && !bFuture) return aDate - bDate;
                // Upcoming always above past
                return aFuture ? -1 : 1;
            });
        }

        setFilteredData(result);
        setCurrentPage(1);
    }, [getBatchData, searchQuery, sortBy, priceFilter, selectedCategory, selectedLevel, selectedTutor, selectedPriceRange, ratingFilter, startDateFilter]);


    const getCourse = () => {
        Axios.get(`${API_URL}/api/coursemain/GetBatchCoursesMem/0`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                console.log("GET COURSE", res.data)
                if (res.data) {
                    console.log("GET COURSE", res.data)
                    if (res.data.length !== 0) {
                        // console.log("Batches All Data",res.data)
                        const enriched = res.data.map(item => ({
                            ...item,
                            _encCId: EncryptData(item.nCId),
                            _encTBId: EncryptData(item.nTBId),
                        }));
                        setBatchData(enriched);
                        setbatchcount(res.data[0]['remain_course_count'])
                    }
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
            .finally(() => setisLoading(false))  // ← ADD THIS
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
                   //  setisLoading(false)
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const bindTutor = () => {
        Axios.get(`${API_URL}/api/student/BindTutor`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
                if (raw.length !== 0) {
                    settutorList(raw);
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

    // AFTER — pure client-side, no API call needed
    const onCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const onTutorchange = (e) => {
        setSelectedTutor(e.target.value);
        setCurrentPage(1);
    };
// ADD just before return (
    const uniqueTutors = getBatchData.length > 0
        ? [...new Map(
            getBatchData.map(b => [
                `${b.sFName?.trim()} ${b.sLName?.trim()}`,
                { sFName: b.sFName?.trim(), sLName: b.sLName?.trim() }
            ])
        ).values()]
        : [];


    return (


        <>
            {/* ── paste this style block once, near the top of your component's return ── */}
            <style>{`
/* ── Screenshot-matching card styles ── */
.ss-card {
    background: #fff;
    border-radius: 10px;
    border: 0px solid #ebebf0;
    overflow: hidden;
    transition: box-shadow 0.22s ease, transform 0.22s ease;
    height: 100%;
    display: flex;
}
.ss-card:hover {
    box-shadow: 0 8px 32px rgba(80,60,180,0.13);
    transform: translateY(-2px);
}

/* Grid card: vertical */
.ss-card-grid { flex-direction: column; }
.ss-card-img-wrap {
    position: relative;
    width: calc(100% - 20px);
    aspect-ratio: 16 / 9;          /* keeps 480×270 ratio */
    flex-shrink: 0;
    display: block;
    overflow: hidden;
    border: 1px solid #ebebf0;
    border-radius: 12px;
    margin: 10px 10px 0 10px;
}

/* List card: horizontal */
.ss-card-list { 
    flex-direction: row;
    align-items: center;
    min-height: unset;
    border-radius: 16px;
    border: 1px solid #ebebf0;
    box-shadow: 0 2px 12px rgba(80,60,180,0.07);
    overflow: hidden;
}
.ss-list-img-wrap {
    position: relative;
    width: 420px;
    min-width: 420px;
    height: auto;
    aspect-ratio: 16 / 9;
    flex-shrink: 0;
    display: block;
    align-self: flex-start;
    overflow: hidden;
    border-radius: 12px;
    margin: 12px;
    border: none;
    background: transparent !important;
}
@media (max-width: 768px) {
    .ss-card-list { flex-direction: column; min-height: unset; }
  .ss-list-img-wrap {
    width: calc(100% - 24px);
    min-width: unset;
    aspect-ratio: 16 / 9;
    height: auto;
    min-height: unset;
    margin: 12px;
    align-self: auto;
    flex-shrink: 0;
    border-radius: 12px;
    background: transparent !important;
}
}
@media (max-width: 480px) {
    .ss-title { font-size: 14px; }
    .ss-day-dot { width: 22px; height: 22px; font-size: 9px; }
}
/* Adjust spacing when tutor is below image in grid */
.ss-card-grid .ss-tutor-row {
    margin-bottom: 8px;
    padding: 0 20px;
}

/* Card body */
.ss-card-body {
    padding: 18px 20px 18px;
    display: flex; flex-direction: column; flex: 1;
    min-width: 0;
}

/* Top row */
.ss-card-top-row {
    display: flex; align-items: center; justify-content: flex-start;
    margin-bottom: 8px;
}
.ss-stars-row { display: flex; align-items: center; gap: 2px; }
.ss-rating-text { font-size: 12px; color: #888; margin-left: 5px; }
.ss-bookmark-btn {
    background: none; border: none; cursor: pointer;
    color: #bbb; padding: 2px 4px; border-radius: 6px;
    transition: color 0.15s;
}
.ss-bookmark-btn:hover { color: #7c3aed; }

/* Title */
.ss-title { font-size: 16px; font-weight: 700; margin: 0 0 10px; line-height: 1.35; color: #1a1a2e; }
.ss-title a { color: inherit; text-decoration: none; }
.ss-title a:hover { color: #7c3aed; }

/* Meta row */
.ss-meta-row {
    display: flex; align-items: center; flex-wrap: wrap;
    gap: 4px; font-size: 12px; color: #666; margin-bottom: 6px;
}
.ss-meta-item { display: flex; align-items: center; gap: 3px; }
.ss-meta-dot { color: #ccc; }
.ss-date-range { color: #555; }

/* Day dots */
.ss-day-dots { display: flex; gap: 5px; margin: 10px 0; }
.ss-day-dot {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 600;
}
.ss-day-on  { background: #7c3aed; color: #fff; }
.ss-day-off { background: #f4f4f8; color: #bbb; border: 1px solid #e8e8ee; }

/* Tutor */
/* Tutor row - remove avatar, keep text only */
.ss-tutor-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: #555; margin-bottom: 12px; flex-wrap: wrap;
}
.ss-tutor-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg,#7c3aed,#a78bfa);
    color: #fff; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; text-transform: uppercase;
}
.ss-cat-badge {
    background: #ede9fe; color: #5b21b6;
    font-size: 10px; font-weight: 600; padding: 2px 9px;
    border-radius: 20px;
}

/* Footer */
.ss-card-footer {
    display: flex; align-items: center;
    justify-content: space-between; gap: 8px;
    padding-top: 12px; border-top: 1px solid #f0eef8;
    margin-top: auto; flex-wrap: wrap;
}
.ss-price-area { display: flex; align-items: center; gap: 7px; }
.ss-price { font-size: 17px; font-weight: 800; color: #1a1a2e; }
.ss-free-badge {
    background: #22c55e; color: #fff;
    font-size: 11px; font-weight: 700;
    padding: 4px 11px; border-radius: 20px; letter-spacing: 0.4px;
}
.ss-level-badge {
    background: #fff4e5; color: #b45309;
    font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
}
.ss-learn-btn {
    background: #7c3aed; color: #fff;
    border: none; border-radius: 22px;
    padding: 8px 16px; font-size: 12px; font-weight: 600;
    cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; gap: 4px;
    white-space: nowrap; transition: background 0.18s;
}
.ss-learn-btn:hover { background: #5b21b6; color: #fff; }
`}</style>
            <div className="rbt-page-banner-wrapper">
                <div className="rbt-banner-image"></div>
                <div className="rbt-banner-content">
                    <div className="rbt-banner-content-top">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <ul className="page-list">
                                        <li className="rbt-breadcrumb-item"><Link href={`/`}>Home</Link></li>
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
                                                className="course-index">Showing {Math.min(indexOfFirstRecord + 1, filteredData.length)}-{Math.min(indexOfLastRecord, filteredData.length)} of {filteredData.length} results</span>
                                        </div> : ''}
                                    </div>
                                </div>

                                <div className="col-lg-7 col-md-12">
                                    <div
                                        className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                        <div className="rbt-short-item">
                                            <div className="rbt-search-style me-0" style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    className={'search-btn'}
                                                    placeholder="Search by title, tutor, PTE, IELTS..."
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                        setCurrentPage(1);
                                                    }}
                                                    style={{ paddingRight: searchQuery ? '60px' : '40px' }}
                                                />
                                                {searchQuery && (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                                                        style={{
                                                            position: 'absolute',
                                                            right: '42px',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '0 6px',
                                                            color: '#999',
                                                            fontSize: '16px',
                                                            lineHeight: 1,
                                                            zIndex: 2
                                                        }}
                                                    >
                                                        <i className="feather-x"></i>
                                                    </button>
                                                )}
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

                                <Row className="align-items-end g-3">
                                    <Col md={2}>
                                        <div className="filter-select rbt-modern-select">
                                            <span className="select-label d-block">Category</span>
                                            <select value={selectedCategory} onChange={onCategoryChange}>
                                                <option value="">All Categories</option>
                                                {getcategoryData.map((data, index) => (
                                                    <option key={index} value={data.sCategory}>{data.sCategory}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>

                                    <Col md={2}>
                                        <div className="filter-select rbt-modern-select">
                                            <span className="select-label d-block">Level</span>
                                            <select value={selectedLevel} onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}>
                                                <option value="">All Levels</option>
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col md={2}>
                                        <div className="filter-select rbt-modern-select">
                                            <span className="select-label d-block">Tutor</span>
                                            <select value={selectedTutor} onChange={onTutorchange}>
                                                <option value="">All Tutors</option>
                                                {uniqueTutors.map((data, index) => (
                                                    <option key={index} value={`${data.sFName} ${data.sLName}`}>
                                                        {data.sFName} {data.sLName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </Col>

                                    <Col md={2}>
                                        <div className="filter-select rbt-modern-select">
                                            <span className="select-label d-block">Price</span>
                                            <select value={priceFilter} onChange={(e) => { setPriceFilter(e.target.value); setSelectedPriceRange(''); setCurrentPage(1); }}>
                                                <option value="">All</option>
                                                <option value="free">Free</option>
                                                <option value="paid">Paid</option>
                                            </select>
                                        </div>
                                    </Col>

                                    {priceFilter === 'paid' && (
                                        <Col md={2}>
                                            <div className="filter-select rbt-modern-select">
                                                <span className="select-label d-block">Price Range</span>
                                                <select value={selectedPriceRange} onChange={(e) => { setSelectedPriceRange(e.target.value); setCurrentPage(1); }}>
                                                    <option value="">Any</option>
                                                    <option value="0-200">₹0 – ₹200</option>
                                                    <option value="200-900">₹200 – ₹900</option>
                                                    <option value="900+">₹900+</option>
                                                </select>
                                            </div>
                                        </Col>
                                    )}

                                    <Col md={2}>
                                        <div className="filter-select rbt-modern-select">
                                            <span className="select-label d-block">Rating</span>
                                            <select value={ratingFilter} onChange={(e) => { setRatingFilter(Number(e.target.value)); setCurrentPage(1); }}>
                                                <option value={0}>Any Rating</option>
                                                <option value={4}>4★ & above</option>
                                                <option value={3}>3★ & above</option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col md={2}>
                                        <div className="filter-select rbt-modern-select">
                                            <span className="select-label d-block">Start Date</span>
                                            <select value={startDateFilter} onChange={(e) => { setStartDateFilter(e.target.value); setCurrentPage(1); }}>
                                                <option value="">Any Time</option>
                                                <option value="today">Starting Today</option>
                                                <option value="this_week">This Week</option>
                                                <option value="upcoming">Upcoming</option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col md={2}>
                                        <div className="filter-select rbt-modern-select">
                                            <span className="select-label d-block">Sort By</span>
                                            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                                                <option value="">Starting Soon</option>
                                                <option value="oldest">Starting Later</option>
                                            </select>
                                        </div>
                                    </Col>

                                    <Col md={12} className="d-flex justify-content-end mt-2">
                                        <button
                                            className="rbt-btn btn-gradient btn-md"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedCategory('');
                                                setSelectedLevel('');
                                                setSelectedTutor('');
                                                setPriceFilter('');
                                                setSelectedPriceRange('');
                                                setRatingFilter(0);
                                                setStartDateFilter('');
                                                setSortBy('');
                                                setCurrentPage(1);
                                            }}
                                        >
                                            Clear All <i className="feather-x ms-1"></i>
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
                        <div className="row" style={{margin: '0 -8px'}}>
                            {isLoading ? <>
                                <div className="course-grid-4 col-md-6 col-sm-6 col-12 mt-5">
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
                                <div className="course-grid-4 col-md-6 col-sm-6 col-12 mt-5">
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
                                <div className="course-grid-4 col-md-6 col-sm-6 col-12 mt-5">
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
                                <div className="course-grid-4 col-md-6 col-sm-6 col-12 mt-5">
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
                                        data.sBatchStartTime, data.sBatchEndTime, data.batchdays
                                    );
                                    const days = JSON.parse(data.sDays);
                                    const rating = parseFloat(data.user_rate) || 0;
                                    const fullStars = Math.floor(rating);
                                    const hasHalf = rating % 1 >= 0.5;
                                    const startD = new Date(data.batchstartdatenew);
                                    const endD = new Date(data.dBatchEndDate);
                                    const fmt = (d) => `${d.getDate()} ${d.toLocaleString('default', {month: 'short'})}`;
                                    const WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
                                    const LABELS = ['M','T','W','T','F','S','S'];
                                    const StarIcon = ({filled}) => (
                                        <svg width="13" height="13" viewBox="0 0 24 24"
                                             fill={filled ? '#EF9F27' : 'none'} stroke="#EF9F27" strokeWidth="2">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                        </svg>
                                    );
                                    return (
                                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mt-4" key={index} style={{padding: '8px'}}>
                                            <div className="ss-card ss-card-grid">
                                                {/* Image */}
                                                <Link href={data._encCId && data._encTBId ? `/batch-details/${data._encCId}/${data._encTBId}` : '#'} className="ss-card-img-wrap">
                                                    <Image
                                                        src={data.batchimg}
                                                        alt={data.sCourseTitle}
                                                        fill
                                                        sizes="(max-width: 630px) 100vw, (max-width: 1250px) 50vw, 33vw"
                                                        style={{objectFit:'cover', objectPosition:'center center'}}
                                                    />
                                                </Link>

                                                {/* Body with fixed sequence */}
                                                <div className="ss-card-body">
                                                    {/* 1. Reviews/Stars - TOP */}
                                                    <div className="ss-card-top-row">
                                                        <div className="ss-stars-row">
                                                            {[1,2,3,4,5].map(s => (
                                                                <StarIcon key={s} filled={s <= fullStars || (s === fullStars+1 && hasHalf)} />
                                                            ))}
                                                            <span className="ss-rating-text">
                                {rating > 0 ? `(${data.user_rate_cnt || 0} Reviews)` : '(0 Reviews)'}
                            </span>
                                                        </div>
                                                    </div>

                                                    {/* 2. Course Title */}
                                                    <h4 className="ss-title">
                                                        <Link href={data._encCId && data._encTBId ? `/batch-details/${data._encCId}/${data._encTBId}` : '#'}>{data.sCourseTitle}</Link>
                                                    </h4>

                                                    {/* 3. Duration & Hours */}
                                                    <div className="ss-meta-row">
                        <span className="ss-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {data.batchdays} Days
                        </span>
                                                        <span className="ss-meta-dot">·</span>
                                                        <span className="ss-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                            {totalHours}h {remainingMinutes}m
                        </span>
                                                    </div>

                                                    {/* 4. Date Range & Time */}
                                                    <div className="ss-meta-row">
                        <span className="ss-meta-item ss-date-range">
                            {fmt(startD)} – {fmt(endD)} | {data.sBatchStartTime} – {data.sBatchEndTime}
                        </span>
                                                    </div>

                                                    {/* 5. Day Dots */}
                                                    <div className="ss-day-dots">
                                                        {WEEK.map((day, i) => (
                                                            <div key={i} className={`ss-day-dot ${days.includes(day) ? 'ss-day-on' : 'ss-day-off'}`}>{LABELS[i]}</div>
                                                        ))}
                                                    </div>

                                                    {/* 6. Tutor Name */}
                                                    <div className="ss-tutor-row">
                                                        <span>Tutor: <strong>{data.sFName} {data.sLName}</strong></span>
                                                        {data.sCategory && <span className="ss-cat-badge">{data.sCategory}</span>}
                                                    </div>
                                                    {/* 7. Footer: Price, Level & Button */}
                                                    <div className="ss-card-footer">
                                                        <div className="ss-price-area">
                                                            {data.sLevel && <span className="ss-level-badge">{data.sLevel}</span>}
                                                            {(!data.dAmount || Number(data.dAmount) === 0) && (
                                                                <span className="ss-free-badge">FREE</span>
                                                            )}
                                                        </div>
                                                        <Link className="ss-learn-btn" href={data._encCId && data._encTBId ? `/batch-details/${data._encCId}/${data._encTBId}` : '#'}>
                                                            Register Now →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
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

                        <div className="row" style={{margin: '0 -8px'}}>
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
                                        data.sBatchStartTime, data.sBatchEndTime, data.batchdays
                                    );
                                    const days = JSON.parse(data.sDays);
                                    const rating = parseFloat(data.user_rate) || 0;
                                    const fullStars = Math.floor(rating);
                                    const hasHalf = rating % 1 >= 0.5;
                                    const startD = new Date(data.batchstartdatenew);
                                    const endD = new Date(data.dBatchEndDate);
                                    const fmt = (d) => `${d.getDate()} ${d.toLocaleString('default',{month:'short'})}`;
                                    const WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
                                    const LABELS = ['M','T','W','T','F','S','S'];
                                    const StarIcon = ({filled}) => (
                                        <svg width="13" height="13" viewBox="0 0 24 24"
                                             fill={filled ? '#EF9F27' : 'none'}
                                             stroke="#EF9F27" strokeWidth="2">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                        </svg>
                                    );
                                    return (

                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-4" key={index} style={{padding: '8px'}}>
                                            <div className="ss-card ss-card-list">
                                                {/* Left image */}
                                                <Link href={data._encCId && data._encTBId ? `/batch-details/${data._encCId}/${data._encTBId}` : '#'} className="ss-list-img-wrap">
                                                    <Image
                                                        src={data.batchimg}
                                                        alt={data.sCourseTitle}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 300px"
                                                        style={{objectFit:'contain', background:'transparent'}}

                                                    />
                                                </Link>

                                                {/* Right content with fixed sequence */}
                                                <div className="ss-card-body">
                                                    {/* 1. Reviews/Stars - TOP */}
                                                    <div className="ss-card-top-row">
                                                        <div className="ss-stars-row">
                                                            {[1,2,3,4,5].map(s => (
                                                                <StarIcon key={s} filled={s <= fullStars || (s === fullStars+1 && hasHalf)} />
                                                            ))}
                                                            <span className="ss-rating-text">
                                {rating > 0 ? `(${data.user_rate_cnt || 0} Reviews)` : '(0 Reviews)'}
                            </span>
                                                        </div>
                                                    </div>

                                                    {/* 2. Course Title */}
                                                    <h4 className="ss-title">
                                                        <Link href={data._encCId && data._encTBId ? `/batch-details/${data._encCId}/${data._encTBId}` : '#'}>{data.sCourseTitle}</Link>
                                                    </h4>

                                                    {/* 3. Duration & Hours */}
                                                    <div className="ss-meta-row">
                        <span className="ss-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {data.batchdays} Days
                        </span>
                                                        <span className="ss-meta-dot">·</span>
                                                        <span className="ss-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                            {totalHours}h {remainingMinutes}m
                        </span>
                                                    </div>

                                                    {/* 4. Date Range & Time */}
                                                    <div className="ss-meta-row">
                        <span className="ss-meta-item ss-date-range">
                            {fmt(startD)} – {fmt(endD)} | {data.sBatchStartTime} – {data.sBatchEndTime}
                        </span>
                                                    </div>

                                                    {/* 5. Day Dots */}
                                                    <div className="ss-day-dots">
                                                        {WEEK.map((day, i) => (
                                                            <div key={i} className={`ss-day-dot ${days.includes(day) ? 'ss-day-on' : 'ss-day-off'}`}>{LABELS[i]}</div>
                                                        ))}
                                                    </div>

                                                    {/* 6. Tutor Name */}
                                                    <div className="ss-tutor-row">
                                                        <span>Tutor: <strong>{data.sFName} {data.sLName}</strong></span>
                                                        {data.sCategory && <span className="ss-cat-badge">{data.sCategory}</span>}
                                                    </div>

                                                    {/* 7. Footer: Level, Price & Button */}
                                                    <div className="ss-card-footer">
                                                        <div className="ss-price-area">
                                                            {data.sLevel && <span className="ss-level-badge">{data.sLevel}</span>}
                                                            {(!data.dAmount || Number(data.dAmount) === 0) && (
                                                                <span className="ss-free-badge">FREE</span>
                                                            )}
                                                        </div>
                                                        <Link className="ss-learn-btn" href={data._encCId && data._encTBId ? `/batch-details/${data._encCId}/${data._encTBId}` : '#'} >
                                                            Register Now →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
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