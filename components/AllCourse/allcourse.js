import Image from "next/image";
import Link from "next/link";
import {API_URL, API_KEY} from "../../constants/constant";
import {useEffect, useState, useCallback} from "react";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

let categoryId;
let levelId;
let priceId;

const AllCoursetwo = () => {
    const REACT_APP = API_URL
    const maxVisibleCategories = 4

    const [activeView, setActiveView] = useState('Grid');
    const [categoryData, setcategoryData] = useState([])
    const [getpriceData, setpriceData] = useState([])
    const [getAllCount, setAllCount] = useState('')
    const [searchValue, setSearchvalue] = useState('')
    const [getdatacategorywise, setdatacategorywise] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLevels, setselectedLevels] = useState([]);
    const [selectedPrice, setselectedPrice] = useState([]);
    // const [getcoursecount, setcoursecount] = useState(0)



    const [levelData, setlevelData] = useState([])
    const [getcourseData, setcourseData] = useState([])
    const [getcoursecount, setcoursecount] = useState(0)
    const [getcourseresult, setcourseresult] = useState(0)
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [categoryChecked, setcategoryChecked] = useState(false);

    let updatedCategories;
    let updatedLevels;
    let updatedPrice;


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    // const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 6

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentRecords = getcourseData.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(getcourseData.length / recordsPerPage);

    // Handlers for changing page
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };


    // const totalPages = Math.ceil(getcourseData.length / itemsPerPage);

    const currentData = getcourseData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleCourseView = (view) => {
        setActiveView(view);
    };
    const bindCourseCategory = () => {
        Axios.get(`${API_URL}/api/coursemain/GetCourseCategory`, {
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

    const bindPricePack = () => {
        Axios.get(`${API_URL}/api/coursemain/GetCoursePriceCount`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data.length !== 0) {
                    setpriceData(res.data)

                    const count = res.data[0]['cpcnt'] + res.data[1]['cpcnt'] + res.data[2]['cpcnt']
                    setAllCount(count)
                    // setisLoading(false)
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
                if (res.data.length !== 0) {
                    setlevelData(res.data)
                    // setisLoading(false)
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const getCourse = () => {
        Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/2`, {
            //timeout: 60000,
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    if (res.data.length !== 0) {
                        setcourseData(res.data)
                        setcoursecount(res.data[0]['remain_course_count'])
                        setisLoading(false)
                    }
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const handleShortBy = (e) => {
        const category = categoryId !== undefined ? categoryId : EncryptData('0')
        const level = levelId !== undefined ? levelId : EncryptData('0')
        const price = priceId !== undefined ? priceId : "~"
        const searchvalue = searchValue ? searchValue : "~"
        if (e.target.value === 'L') {
            setcategoryChecked(true)
            setcourseData([])
            // Axios.get(`${REACT_APP.API_URL}/api/coursemain/GetCoursesMem/2/L/ccid/clid/""/price`, {
            Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/2/L/${category}/${level}/${searchvalue}/${price}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data.length !== 0) {
                        setdatacategorywise(res.data)
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
        } else {
            setcategoryChecked(true)
            setcourseData([])
            Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/2/H/${category}/${level}/${searchvalue}/${price}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data.length !== 0) {
                        setdatacategorywise(res.data)
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
        }
    }

    const handleChangeCategory = (ccid,isChecked) => {

        const category = categoryId !== undefined ? categoryId : EncryptData('0')
        const level = levelId !== undefined ? levelId : EncryptData('0')
        const price = priceId !== undefined ? priceId : "~"
        const searchvalue = searchValue ? searchValue : "~"
        setcategoryChecked(true)
        setcourseData([])
        // updatedCategories= [...selectedCategories];
        updatedCategories= Array.isArray(selectedCategories) ? [...selectedCategories] : [];

    // Toggle the selected state of the category
    if (updatedCategories.includes(ccid)) {
        updatedCategories = updatedCategories.filter(id => id !== ccid);
    } else {
        updatedCategories.push(ccid);
    }


    setSelectedCategories(updatedCategories);

    const categoryParam = updatedCategories.join('-');
    categoryId = EncryptData(categoryParam)
        Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/2/L/${EncryptData(categoryParam)}/${level}/${searchvalue}/${price}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if(isChecked){
                    // alert("isChecked True")
                    if (res.data.length !== 0) {
                        // setcourseData(res.data)
                        setdatacategorywise(res.data)
                    }
                }else{

                    // ✅ Use updatedCategories instead of selectedCategories
                    if (updatedCategories.length === 0 && selectedLevels.length === 0 && selectedPrice.length === 0) {
                        getCourse();
                        // alert("isChecked False 1");
                    } else {
                        if (res.data.length !== 0) {
                            // alert("isChecked False 2");
                            setdatacategorywise(res.data);
                        }
                    }

                }

            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const handleChangeLevel = (clid,isChecked) => {

        const category = categoryId !== undefined ? categoryId : EncryptData('0')
        const level = clid !== undefined ? EncryptData(clid) : EncryptData('0')
        const price = priceId !== undefined ? priceId : "~"
        const searchvalue = searchValue ? searchValue : "~"
        updatedLevels= [...selectedLevels];
        setcourseData([])
        setcategoryChecked(true)
        // Toggle the selected state of the category
        if (updatedLevels.includes(clid)) {
            updatedLevels = updatedLevels.filter(id => id !== clid);
        } else {
            updatedLevels.push(clid);
        }

        alert(clid)
        alert(updatedLevels)

        setSelectedCategories(updatedCategories);

        const levelParam = updatedLevels.join('-');
        Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/2/L/${category}/${level}/${searchvalue}/${price}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // Old Code
                // if (res.data.length !== 0) {
                //     setdatacategorywise(res.data)
                //     // setcourseData(res.data)
                // } else {
                //     getCourse()
                // }

                if(isChecked){
                    if (res.data.length !== 0) {
                        setdatacategorywise(res.data)
                    }
                }else{
                    // ✅ Use updatedCategories instead of selectedCategories
                    if (updatedLevels.length === 0 && updatedCategories.length === 0 && selectedPrice.length === 0) {
                        getCourse();
                    } else {
                        if (res.data.length !== 0) {
                            setdatacategorywise(res.data);
                        }
                    }

                }


            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }


    const handleChangePrice = (pricetype) => {

        const category = categoryId !== undefined ? categoryId : EncryptData('0')
        const level = levelId !== undefined ? levelId : EncryptData('0')
        const price = priceId !== undefined ? priceId : "~"
        const searchvalue = searchValue ? searchValue : "~"
        updatedPrice= [...selectedPrice];
        setcourseData([])
        setcategoryChecked(true)
        // Toggle the selected state of the category
        if (updatedPrice.includes(pricetype)) {
            updatedPrice = updatedPrice.filter(id => id !== pricetype);
        } else {
            updatedPrice.push(pricetype);
        }

        setselectedPrice(updatedPrice);

        const PriceParam = updatedPrice.join('-');
        priceId = PriceParam
        Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/2/L/${category}/${level}/${searchvalue}/${price}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data.length !== 0) {
                    setdatacategorywise(res.data)
                    // setcourseData(res.data)
                } else {
                    getCourse()
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }


    const handleChangeSearch = (e) => {
        setSearchvalue(e.target.value)
    }
    const handleClickSearch = () => {
        setcategoryChecked(true)
        setcourseData([])
        const category = categoryId !== undefined ? categoryId : EncryptData('0')
        const level = levelId !== undefined ? levelId : EncryptData('0')
        const price = priceId !== undefined ? priceId : EncryptData('0')

        if(searchValue.length !== 0) {
            Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/2/L/${category}/${level}/${searchValue}/${price}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data.length !== 0) {
                        setdatacategorywise(res.data)
                    } else {
                        getCourse()
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
        } else {
            getCourse()
        }

    }

    useEffect(() => {
        // setTimeout(() => {
        //     setisLoading(false)
        // }, 7000)

        bindCourseCategory()
        bindLevel()
        getCourse()
        bindPricePack()
    }, []);

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
                                        <li className="rbt-breadcrumb-item">
                                            <Link href="index.html">Home</Link>
                                        </li>
                                        <li>
                                            <div className="icon-right"><i className="feather-chevron-right"></i></div>
                                        </li>
                                        <li className="rbt-breadcrumb-item active">All Courses</li>
                                    </ul>

                                    <div className=" title-wrapper">
                                        <h1 className="title mb--0">All Courses</h1>
                                        <Link href="#" className="rbt-badge-2">
                                            <div className="image">🎉</div>
                                            {getcoursecount} Courses
                                        </Link>
                                    </div>

                                    <p className="description">Courses that help beginner designers become true unicorns. </p>
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
                                                        title="Grid Layout" onClick={() => handleCourseView('Grid')}>
                                                        <i className="feather-grid"></i>
                                                        <span className="text">Grid</span>
                                                    </button>
                                                </li>
                                                <li className="course-switch-item">
                                                    <button
                                                        className={activeView === 'List' ? 'rbt-list-view active' : 'rbt-list-view'}
                                                        title="List Layout" onClick={() => handleCourseView('List')}>
                                                        <i className="feather-list"></i>
                                                        <span className="text">List</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="rbt-short-item">
                                            {/*<span className="course-index">Showing {indexOfFirstRecord + 1}-{indexOfLastRecord} of {getcourseData.length} results</span>*/}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7 col-md-12">
                                    <div className="rbt-sorting-list d-flex flex-wrap align-items-center justify-content-start justify-content-lg-end">
                                        <div className="rbt-short-item">
                                            <div className="filter-select">
                                                <span className="select-label d-block">Short By</span>
                                                <div className="filter-select rbt-modern-select search-by-category">
                                                    <select onChange={handleShortBy}>
                                                        <option>Select</option>
                                                        <option value={"L"}>Affordable courses</option>
                                                        <option value={"H"}>High value courses</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rbt-section-overlayping-top rbt-section-gapBottom">
                <div className="container">
                    <div className="row row--30 gy-5">
                        <div className="col-lg-3 order-md-1 order-lg-1">
                            <aside className="rbt-sidebar-widget-wrapper">
                                <div className="rbt-single-widget rbt-widget-search">
                                    <div className="inner">
                                        <div className="rbt-search-style-1">
                                            <input
                                                value={searchValue}
                                                onChange={handleChangeSearch}
                                                type="text"
                                                placeholder="Search Courses"
                                            />
                                            <button onClick={handleClickSearch} className="search-btn">
                                                <i className="feather-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="rbt-single-widget rbt-widget-categories has-show-more">
                                    <div className="inner">
                                        <h4 className="rbt-widget-title">Categories</h4>
                                        <ul className="rbt-sidebar-list-wrapper categories-list-check has-show-more-inner-content">
                                            {categoryData && categoryData.slice(0, showAllCategories ? categoryData.length : maxVisibleCategories).map((data, index) => {
                                                return (
                                                    <li className="rbt-check-group" key={index}>
                                                        <input
                                                            id={`cat-list-${index}`}
                                                            type="checkbox"
                                                            name={`cat-list-${index}`}
                                                            onChange={() => handleChangeCategory(data.nCCId,event.target.checked)}
                                                        />
                                                        <label htmlFor={`cat-list-${index}`}>{data.sCategory}<span
                                                            className="rbt-lable count">{data.courrsecnt}</span></label>
                                                    </li>
                                                )
                                            })}
                                            {categoryData && categoryData.length > maxVisibleCategories &&
                                                <li onClick={() => setShowAllCategories(!showAllCategories)}
                                                    className="show-more text-primary">
                                                    {showAllCategories ?
                                                        'Show Less' :
                                                        'Show More'
                                                    }
                                                </li>
                                            }
                                        </ul>
                                    </div>
                                </div>

                                <div className="rbt-single-widget rbt-widget-rating">
                                    <div className="inner">
                                        <h4 className="rbt-widget-title">Ratings</h4>
                                        <ul className="rbt-sidebar-list-wrapper rating-list-check">
                                            <li className="rbt-check-group">
                                                <input id="cat-radio-1" type="radio" name="rbt-radio"/>
                                                <label htmlFor="cat-radio-1">
                                                    <span className="rating">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                    </span>
                                                    <span className="rbt-lable count">5</span>
                                                </label>
                                            </li>
                                            <li className="rbt-check-group">
                                                <input id="cat-radio-2" type="radio" name="rbt-radio"/>
                                                <label htmlFor="cat-radio-2">
                                                    <span className="rating">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                    </span>
                                                    <span className="rbt-lable count">4</span>
                                                </label>
                                            </li>
                                            <li className="rbt-check-group">
                                                <input id="cat-radio-3" type="radio" name="rbt-radio"/>
                                                <label htmlFor="cat-radio-3">
                                                    <span className="rating">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                    </span>
                                                    <span className="rbt-lable count">3</span>
                                                </label>
                                            </li>
                                            <li className="rbt-check-group">
                                                <input id="cat-radio-4" type="radio" name="rbt-radio"/>
                                                <label htmlFor="cat-radio-4">
                                                    <span className="rating">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                    </span>
                                                    <span className="rbt-lable count">2</span>
                                                </label>
                                            </li>

                                            <li className="rbt-check-group">
                                                <input id="cat-radio-5" type="radio" name="rbt-radio"/>
                                                <label htmlFor="cat-radio-5">
                                                    <span className="rating">
                                                        <i className="fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                        <i className="off fas fa-star"></i>
                                                    </span>
                                                    <span className="rbt-lable count">1</span>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="rbt-single-widget rbt-widget-prices">
                                    <div className="inner">
                                        <h4 className="rbt-widget-title">Prices</h4>
                                        <ul className="rbt-sidebar-list-wrapper prices-list-check">
                                            {/*<li className="rbt-check-group">*/}
                                            {/*    <input id="prices-list-2" type="checkbox" onChange={getCourse()} name="prices-list-2"/>*/}
                                            {/*    <label htmlFor="prices-list-2">All <span*/}
                                            {/*        className="rbt-lable count">{getAllCount}</span></label>*/}
                                            {/*</li>*/}
                                            {getpriceData.map((data, index) => {
                                                return (
                                                    <>
                                                        <li className="rbt-check-group">
                                                            <input id={`prices-list-${index}`} type="checkbox"
                                                                   name={`prices-list-${index}`} onChange={() => handleChangePrice(data.course_type)} />
                                                            <label
                                                                htmlFor={`prices-list-${index}`}>{data.course_type}<span
                                                                className="rbt-lable count">{data.cpcnt}</span></label>
                                                        </li>
                                                    </>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>

                                <div className="rbt-single-widget rbt-widget-lavels">
                                    <div className="inner">
                                        <h4 className="rbt-widget-title">Levels</h4>
                                        <ul className="rbt-sidebar-list-wrapper lavels-list-check">
                                            {levelData && levelData.map((data, index) => {
                                                return (
                                                    <>
                                                        <li className="rbt-check-group">
                                                            <input id={`lavels-list-${index}`} type="checkbox"
                                                                   name="lavels-list-1" onChange={() => handleChangeLevel(data.nCLId,event.target.checked)}/>
                                                            <label htmlFor={`lavels-list-${index}`}>{data.sLevel}<span
                                                                className="rbt-lable count">{data.clcnt}</span></label>
                                                        </li>
                                                    </>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </aside>
                        </div>
                        <div className="col-lg-9 order-md-1 order-lg-2">
                            {categoryChecked ? <>
                                <h5 className={'text-end'}>{getdatacategorywise.length} results</h5>
                            </> : <></>}

                            {activeView === "Grid" ? <>
                                <div className="rbt-course-grid-column">
                                    {isLoading ? <>
                                        <div className="course-grid-3">
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <Skeleton height={150}/>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <Skeleton height={20} width={70}/>
                                                    </div>

                                                    <h4 className="rbt-card-title">
                                                        {/*<a href="course-details.html">*/}
                                                        <Skeleton height={20}/>
                                                        {/*</a>*/}
                                                    </h4>

                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                    </ul>


                                                    <p className="rbt-card-text">
                                                        <Skeleton height={50}/>
                                                    </p>

                                                    <div className="rbt-author-meta mb--10">
                                                        <div className="rbt-author-info">
                                                            <Skeleton height={20} width={50}/>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <Skeleton height={20}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course-grid-3">
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <Skeleton height={150}/>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <Skeleton height={20} width={70}/>
                                                    </div>

                                                    <h4 className="rbt-card-title">
                                                        {/*<a href="course-details.html">*/}
                                                        <Skeleton height={20}/>
                                                        {/*</a>*/}
                                                    </h4>

                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                    </ul>


                                                    <p className="rbt-card-text">
                                                        <Skeleton height={50}/>
                                                    </p>

                                                    <div className="rbt-author-meta mb--10">
                                                        <div className="rbt-author-info">
                                                            <Skeleton height={20} width={50}/>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <Skeleton height={20}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course-grid-3">
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <Skeleton height={150}/>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <Skeleton height={20} width={70}/>
                                                    </div>

                                                    <h4 className="rbt-card-title">
                                                        {/*<a href="course-details.html">*/}
                                                        <Skeleton height={20}/>
                                                        {/*</a>*/}
                                                    </h4>

                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                    </ul>


                                                    <p className="rbt-card-text">
                                                        <Skeleton height={50}/>
                                                    </p>

                                                    <div className="rbt-author-meta mb--10">
                                                        <div className="rbt-author-info">
                                                            <Skeleton height={20} width={50}/>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <Skeleton height={20}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course-grid-3">
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <Skeleton height={150}/>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <Skeleton height={20} width={70}/>
                                                    </div>

                                                    <h4 className="rbt-card-title">
                                                        {/*<a href="course-details.html">*/}
                                                        <Skeleton height={20}/>
                                                        {/*</a>*/}
                                                    </h4>

                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                    </ul>


                                                    <p className="rbt-card-text">
                                                        <Skeleton height={50}/>
                                                    </p>

                                                    <div className="rbt-author-meta mb--10">
                                                        <div className="rbt-author-info">
                                                            <Skeleton height={20} width={50}/>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <Skeleton height={20}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course-grid-3">
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <Skeleton height={150}/>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <Skeleton height={20} width={70}/>
                                                    </div>

                                                    <h4 className="rbt-card-title">
                                                        {/*<a href="course-details.html">*/}
                                                        <Skeleton height={20}/>
                                                        {/*</a>*/}
                                                    </h4>

                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                    </ul>


                                                    <p className="rbt-card-text">
                                                        <Skeleton height={50}/>
                                                    </p>

                                                    <div className="rbt-author-meta mb--10">
                                                        <div className="rbt-author-info">
                                                            <Skeleton height={20} width={50}/>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <Skeleton height={20}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="course-grid-3">
                                            <div className="rbt-card variation-01 rbt-hover">
                                                <div className="rbt-card-img">
                                                    <Skeleton height={150}/>
                                                </div>
                                                <div className="rbt-card-body">
                                                    <div className="rbt-card-top">
                                                        <Skeleton height={20} width={70}/>
                                                    </div>

                                                    <h4 className="rbt-card-title">
                                                        {/*<a href="course-details.html">*/}
                                                        <Skeleton height={20}/>
                                                        {/*</a>*/}
                                                    </h4>

                                                    <ul className="rbt-meta">
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                        <li>
                                                            <Skeleton height={20} width={50}/>
                                                        </li>
                                                    </ul>


                                                    <p className="rbt-card-text">
                                                        <Skeleton height={50}/>
                                                    </p>

                                                    <div className="rbt-author-meta mb--10">
                                                        <div className="rbt-author-info">
                                                            <Skeleton height={20} width={50}/>
                                                        </div>
                                                    </div>
                                                    <div className="rbt-card-bottom">
                                                        <Skeleton height={20}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </> : <>
                                        {selectedCategories?.length !== 0 || selectedLevels.length !== 0 || selectedPrice.length !== 0 ? <>
                                            {getdatacategorywise.length !== 0 ? <>
                                                {getdatacategorywise.map((data, index) => {
                                                    return (
                                                        <>
                                                            <div className="course-grid-3" key={index}>
                                                                {data.bIsAccosiateModule === "no" ? <Link
                                                                    href={`/course-details/${EncryptData(data.nCId)}`}>
                                                                    <div className="rbt-card variation-01 rbt-hover">
                                                                        <div className="rbt-card-img">
                                                                            {/*<a href="course-details.html">*/}
                                                                            <Image className={"position-relative"} objectFit="inherit" fill={true}
                                                                                 alt="Card image" src={data.sImagePath}/>
                                                                            {/*<div className="rbt-badge-3 bg-white">*/}
                                                                            {/*    <span>-40%</span>*/}
                                                                            {/*    <span>Off</span>*/}
                                                                            {/*</div>*/}
                                                                            {/*</a>*/}
                                                                        </div>
                                                                        <div className="rbt-card-body">
                                                                            <div className="rbt-card-top">
                                                                                <div className="rbt-review">
                                                                                    <div className="rating">
                                                                                        <i className="fas fa-star"></i>
                                                                                        <i className="fas fa-star"></i>
                                                                                        <i className="fas fa-star"></i>
                                                                                        <i className="fas fa-star"></i>
                                                                                        <i className="fas fa-star"></i>
                                                                                    </div>
                                                                                    ({data.user_rate_cnt} Reviews)
                                                                                </div>
                                                                                <div className="rbt-bookmark-btn">
                                                                                    <Link className="rbt-round-btn"
                                                                                          title="Bookmark"
                                                                                          href="#"><i
                                                                                        className="feather-heart"></i></Link>
                                                                                </div>
                                                                            </div>

                                                                            <h4 className="rbt-card-title">
                                                                                {/*<a href="course-details.html">*/}
                                                                                {data.sCourseTitle}
                                                                                {/*</a>*/}
                                                                            </h4>

                                                                            <ul className="rbt-meta">
                                                                                <li>
                                                                                    <i className="feather-book"></i>
                                                                                    {data.lesson_cnt} Lessons
                                                                                </li>
                                                                                <li>
                                                                                    <i className="feather-book"></i>
                                                                                    {data.section_cnt} Sections
                                                                                </li>
                                                                                <li>
                                                                                    <i className="feather-users"></i>
                                                                                    {data.enroll_cnt} Students
                                                                                </li>
                                                                            </ul>
                                                                            {
                                                                                data.sLevel !== '' || data.sCategory !== '' ? <>
                                                                                    <div
                                                                                        className="lavelArea d-flex align-items-center justify-content-between mb--15">
                                                                                        {data.sLevel !== '' ? <div
                                                                                            className={`badge text-bg-secondary`}>{data.sLevel}</div> : null}
                                                                                        {data.sCategory !== '' ? <div
                                                                                            className={`badge customBadge`}>{data.sCategory}</div> : null}
                                                                                    </div>
                                                                                </> : null
                                                                            }
                                                                            {data.sShortDesc.length > 165 ?
                                                                                <p className="rbt-card-text">{data.sShortDesc.substring(0, 110)}...</p> :
                                                                                <p className="rbt-card-text">{data.sShortDesc}</p>
                                                                            }
                                                                            <div className="rbt-author-meta mb--10">
                                                                                {/*<div className="rbt-avater">*/}
                                                                                {/*    <a href="#">*/}
                                                                                {/*        <img src="assets/images/client/avatar-02.png"*/}
                                                                                {/*             alt="Sophia Jaymes"/>*/}
                                                                                {/*    </a>*/}
                                                                                {/*</div>*/}
                                                                                <div className="rbt-author-info">
                                                                                    By <Link
                                                                                    href="javascript:void(0)">{data.sFName} {data.sLName}</Link>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rbt-card-bottom">
                                                                                {data.bIsAccosiateModule === 'no' ? <>
                                                                                    <div className="rbt-price">
                                                                                    <span
                                                                                        className="current-price">₹{data.dAmount}</span>
                                                                                        <span
                                                                                            className="off-price">₹{data.nCourseAmount}</span>
                                                                                    </div>
                                                                                    <Link className="rbt-btn-link"
                                                                                          href={`/course-details/${EncryptData(data.nCId)}`}>Learn
                                                                                        More<i
                                                                                            className="feather-arrow-right"></i></Link>
                                                                                </> : <>
                                                                                    <div
                                                                                        className="read-more-btn m-auto">
                                                                                        <Link
                                                                                            className="rbt-moderbt-btn"
                                                                                            href="#">
                                                                                        <span
                                                                                            className="moderbt-btn-text">View Packages</span>
                                                                                            <i className="feather-arrow-right"></i>
                                                                                        </Link>
                                                                                    </div>
                                                                                </>}


                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Link> : <>
                                                                    <Link
                                                                        href={`/course-details-module/${EncryptData(data.nCId)}`}>
                                                                        <div
                                                                            className="rbt-card variation-01 rbt-hover">
                                                                            <div className="rbt-card-img">
                                                                                {/*<a href="course-details.html">*/}
                                                                                <Image className={"position-relative"} objectFit="inherit" fill={true} src={data.sImagePath}
                                                                                     alt="Card image"/>
                                                                                {/*<div className="rbt-badge-3 bg-white">*/}
                                                                                {/*    <span>-40%</span>*/}
                                                                                {/*    <span>Off</span>*/}
                                                                                {/*</div>*/}
                                                                                {/*</a>*/}
                                                                            </div>
                                                                            <div className="rbt-card-body">
                                                                                <div className="rbt-card-top">
                                                                                    <div className="rbt-review">
                                                                                        <div className="rating">
                                                                                            <i className="fas fa-star"></i>
                                                                                            <i className="fas fa-star"></i>
                                                                                            <i className="fas fa-star"></i>
                                                                                            <i className="fas fa-star"></i>
                                                                                            <i className="fas fa-star"></i>
                                                                                        </div>
                                                                                        ({data.user_rate_cnt} Reviews)
                                                                                    </div>
                                                                                    <div className="rbt-bookmark-btn">
                                                                                        <Link className="rbt-round-btn"
                                                                                              title="Bookmark"
                                                                                              href="#"><i
                                                                                            className="feather-heart"></i></Link>
                                                                                    </div>
                                                                                </div>

                                                                                <h4 className="rbt-card-title">
                                                                                    {/*<a href="course-details.html">*/}
                                                                                    {data.sCourseTitle}
                                                                                    {/*</a>*/}
                                                                                </h4>

                                                                                <ul className="rbt-meta">
                                                                                    <li>
                                                                                        <i className="feather-book"></i>
                                                                                        {data.lesson_cnt} Lessons
                                                                                    </li>
                                                                                    <li>
                                                                                        <i className="feather-book"></i>
                                                                                        {data.section_cnt} Sections
                                                                                    </li>
                                                                                    <li>
                                                                                        <i className="feather-users"></i>
                                                                                        {data.enroll_cnt} Students
                                                                                    </li>
                                                                                </ul>
                                                                                {
                                                                                    data.sLevel !== '' || data.sCategory !== '' ? <>
                                                                                        <div
                                                                                            className="lavelArea d-flex align-items-center justify-content-between mb--15">
                                                                                            {data.sLevel !== '' ? <div
                                                                                                className={`badge text-bg-secondary`}>{data.sLevel}</div> : null}
                                                                                            {data.sCategory !== '' ? <div
                                                                                                className={`badge customBadge`}>{data.sCategory}</div> : null}
                                                                                        </div>
                                                                                    </> : null
                                                                                }
                                                                                {data.sShortDesc.length > 165 ?
                                                                                    <p className="rbt-card-text">{data.sShortDesc.substring(0, 110)}...</p> :
                                                                                    <p className="rbt-card-text">{data.sShortDesc}</p>
                                                                                }
                                                                                <div className="rbt-author-meta mb--10">
                                                                                    {/*<div className="rbt-avater">*/}
                                                                                    {/*    <a href="#">*/}
                                                                                    {/*        <img src="assets/images/client/avatar-02.png"*/}
                                                                                    {/*             alt="Sophia Jaymes"/>*/}
                                                                                    {/*    </a>*/}
                                                                                    {/*</div>*/}
                                                                                    <div className="rbt-author-info">
                                                                                        By <Link
                                                                                        href="javascript:void(0)">{data.sFName} {data.sLName}</Link>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rbt-card-bottom">
                                                                                    {data.bIsAccosiateModule === 'no' ? <>
                                                                                        <div className="rbt-price">
                                                                    <span
                                                                        className="current-price">₹{data.dAmount}</span>
                                                                                            <span
                                                                                                className="off-price">₹{data.nCourseAmount}</span>
                                                                                        </div>
                                                                                        <Link className="rbt-btn-link"
                                                                                              href={`/course-details/${EncryptData(data.nCId)}`}>Learn
                                                                                            More<i
                                                                                                className="feather-arrow-right"></i></Link>
                                                                                    </> : <>
                                                                                        <div
                                                                                            className="read-more-btn m-auto">
                                                                                            <Link
                                                                                                className="rbt-moderbt-btn"
                                                                                                href={`/Package/${EncryptData(data.nCId)}`}>
                                                                                            <span
                                                                                                className="moderbt-btn-text">View Packages</span>
                                                                                                <i className="feather-arrow-right"></i>
                                                                                            </Link>
                                                                                        </div>
                                                                                    </>}


                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </>}
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </> : <></>}
                                        </> : <>
                                            {getcourseData.length !== 0 ? <>
                                                {currentRecords.map((data, index) => {
                                                    return (
                                                        <>
                                                            <div className="course-grid-3" key={index}>
                                                                {data.bIsAccosiateModule === "no" ? <Link
                                                                    href={`/course-details/${EncryptData(data.nCId)}`}>
                                                                    <div className="rbt-card variation-01 rbt-hover">
                                                                        <div className="rbt-card-img">
                                                                            {/*<a href="course-details.html">*/}
                                                                            <Image className={"position-relative"} objectFit="inherit" fill={true} src={data.sImagePath}
                                                                                 alt="Card image"/>
                                                                            {/*<div className="rbt-badge-3 bg-white">*/}
                                                                            {/*    <span>-40%</span>*/}
                                                                            {/*    <span>Off</span>*/}
                                                                            {/*</div>*/}
                                                                            {/*</a>*/}
                                                                        </div>
                                                                        <div className="rbt-card-body">
                                                                            <div className="rbt-card-top">
                                                                                <div className="rbt-review">
                                                                                    <div className="rating">
                                                                                        <i className="fas fa-star"></i>
                                                                                        <i className="fas fa-star"></i>
                                                                                        <i className="fas fa-star"></i>
                                                                                        <i className="fas fa-star"></i>
                                                                                        <i className="fas fa-star"></i>
                                                                                    </div>
                                                                                    ({data.user_rate_cnt} Reviews)
                                                                                </div>
                                                                                <div className="rbt-bookmark-btn">
                                                                                    <Link className="rbt-round-btn"
                                                                                       title="Bookmark"
                                                                                       href="#"><i
                                                                                        className="feather-heart"></i></Link>
                                                                                </div>
                                                                            </div>

                                                                            <h4 className="rbt-card-title">
                                                                                {/*<a href="course-details.html">*/}
                                                                                {data.sCourseTitle}
                                                                                {/*</a>*/}
                                                                            </h4>

                                                                            <ul className="rbt-meta">
                                                                                <li>
                                                                                    <i className="feather-book"></i>
                                                                                    {data.lesson_cnt} Lessons
                                                                                </li>
                                                                                <li>
                                                                                    <i className="feather-book"></i>
                                                                                    {data.section_cnt} Sections
                                                                                </li>
                                                                                <li>
                                                                                    <i className="feather-users"></i>
                                                                                    {data.enroll_cnt} Students
                                                                                </li>
                                                                            </ul>
                                                                            {
                                                                                data.sLevel !== '' || data.sCategory !== '' ? <>
                                                                                    <div
                                                                                        className="lavelArea d-flex align-items-center justify-content-between mb--15">
                                                                                        {data.sLevel !== '' ? <div
                                                                                            className={`badge text-bg-secondary`}>{data.sLevel}</div> : null}
                                                                                        {data.sCategory !== '' ? <div
                                                                                            className={`badge customBadge`}>{data.sCategory}</div> : null}
                                                                                    </div>
                                                                                </> : null
                                                                            }

                                                                            {data.sShortDesc.length > 165 ?
                                                                                <p className="rbt-card-text">{data.sShortDesc.substring(0, 110)}...</p> :
                                                                                <p className="rbt-card-text">{data.sShortDesc}</p>
                                                                            }
                                                                            <div className="rbt-author-meta mb--10">
                                                                                {/*<div className="rbt-avater">*/}
                                                                                {/*    <a href="#">*/}
                                                                                {/*        <img src="assets/images/client/avatar-02.png"*/}
                                                                                {/*             alt="Sophia Jaymes"/>*/}
                                                                                {/*    </a>*/}
                                                                                {/*</div>*/}
                                                                                <div className="rbt-author-info">
                                                                                    By <Link
                                                                                    href="javascript:void(0)">{data.sFName} {data.sLName}</Link>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rbt-card-bottom">
                                                                                {data.bIsAccosiateModule === 'no' ? <>
                                                                                    <div className="rbt-price">
                                                                                        <span
                                                                                            className="current-price">₹{data.dAmount}</span>
                                                                                        <span
                                                                                            className="off-price">₹{data.nCourseAmount}</span>
                                                                                    </div>
                                                                                    <Link className="rbt-btn-link"
                                                                                       href={`/course-details/${EncryptData(data.nCId)}`}>Learn
                                                                                        More<i
                                                                                            className="feather-arrow-right"></i></Link>
                                                                                </> : <>
                                                                                    <div
                                                                                        className="read-more-btn m-auto">
                                                                                        <Link className="rbt-moderbt-btn"
                                                                                           href="#">
                                                                                            <span
                                                                                                className="moderbt-btn-text">View Packages</span>
                                                                                            <i className="feather-arrow-right"></i>
                                                                                        </Link>
                                                                                    </div>
                                                                                </>}


                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Link> : <>
                                                                    <Link
                                                                        href={`/course-details-module/${EncryptData(data.nCId)}`}>
                                                                        <div
                                                                            className="rbt-card variation-01 rbt-hover">
                                                                            <div className="rbt-card-img">
                                                                                {/*<a href="course-details.html">*/}
                                                                                <Image className={"position-relative"} objectFit="inherit" fill={true} src={data.sImagePath}
                                                                                     alt="Card image"/>
                                                                                {/*<div className="rbt-badge-3 bg-white">*/}
                                                                                {/*    <span>-40%</span>*/}
                                                                                {/*    <span>Off</span>*/}
                                                                                {/*</div>*/}
                                                                                {/*</a>*/}
                                                                            </div>
                                                                            <div className="rbt-card-body">
                                                                                <div className="rbt-card-top">
                                                                                    <div className="rbt-review">
                                                                                        <div className="rating">
                                                                                            <i className="fas fa-star"></i>
                                                                                            <i className="fas fa-star"></i>
                                                                                            <i className="fas fa-star"></i>
                                                                                            <i className="fas fa-star"></i>
                                                                                            <i className="fas fa-star"></i>
                                                                                        </div>
                                                                                        ({data.user_rate_cnt} Reviews)
                                                                                    </div>
                                                                                    <div className="rbt-bookmark-btn">
                                                                                        <Link className="rbt-round-btn"
                                                                                              title="Bookmark"
                                                                                              href="#"><i
                                                                                            className="feather-heart"></i></Link>
                                                                                    </div>
                                                                                </div>

                                                                                <h4 className="rbt-card-title">
                                                                                    {/*<a href="course-details.html">*/}
                                                                                    {data.sCourseTitle}
                                                                                    {/*</a>*/}
                                                                                </h4>

                                                                                <ul className="rbt-meta">
                                                                                    <li>
                                                                                        <i className="feather-book"></i>
                                                                                        {data.lesson_cnt} Lessons
                                                                                    </li>
                                                                                    <li>
                                                                                        <i className="feather-book"></i>
                                                                                        {data.section_cnt} Sections
                                                                                    </li>
                                                                                    <li>
                                                                                        <i className="feather-users"></i>
                                                                                        {data.enroll_cnt} Students
                                                                                    </li>
                                                                                </ul>
                                                                                {
                                                                                    data.sLevel !== '' || data.sCategory !== '' ? <>
                                                                                        <div
                                                                                            className="lavelArea d-flex align-items-center justify-content-between mb--15">
                                                                                            {data.sLevel !== '' ? <div
                                                                                                className={`badge text-bg-secondary`}>{data.sLevel}</div> : null}
                                                                                            {data.sCategory !== '' ? <div
                                                                                                className={`badge customBadge`}>{data.sCategory}</div> : null}
                                                                                        </div>
                                                                                    </> : null
                                                                                }
                                                                                {data.sShortDesc.length > 165 ?
                                                                                    <p className="rbt-card-text">{data.sShortDesc.substring(0, 110)}...</p> :
                                                                                    <p className="rbt-card-text">{data.sShortDesc}</p>
                                                                                }
                                                                                <div className="rbt-author-meta mb--10">
                                                                                    {/*<div className="rbt-avater">*/}
                                                                                    {/*    <a href="#">*/}
                                                                                    {/*        <img src="assets/images/client/avatar-02.png"*/}
                                                                                    {/*             alt="Sophia Jaymes"/>*/}
                                                                                    {/*    </a>*/}
                                                                                    {/*</div>*/}
                                                                                    <div className="rbt-author-info">
                                                                                        By <Link
                                                                                        href="javascript:void(0)">{data.sFName} {data.sLName}</Link>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rbt-card-bottom">
                                                                                    {data.bIsAccosiateModule === 'no' ? <>
                                                                                        <div className="rbt-price">
                                                                    <span
                                                                        className="current-price">₹{data.dAmount}</span>
                                                                                            <span
                                                                                                className="off-price">₹{data.nCourseAmount}</span>
                                                                                        </div>
                                                                                        <Link className="rbt-btn-link"
                                                                                              href={`/course-details/${EncryptData(data.nCId)}`}>Learn
                                                                                            More<i
                                                                                                className="feather-arrow-right"></i></Link>
                                                                                    </> : <>
                                                                                        <div
                                                                                            className="read-more-btn m-auto">
                                                                                            <Link
                                                                                                className="rbt-moderbt-btn"
                                                                                                href={`/Package/${EncryptData(data.nCId)}`}>
                                                                                                <span
                                                                                                    className="moderbt-btn-text">View Packages</span>
                                                                                                <i className="feather-arrow-right"></i>
                                                                                            </Link>
                                                                                        </div>
                                                                                    </>}


                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </>}
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </> : <></>}
                                        </>}

                                    </>}
                                </div>
                            </> : <>
                                {isLoading ? <>
                                    <div className="course-grid-12 mt-5" data-sal-delay="150"
                                         data-sal="data-up"
                                         data-sal-duration="800">
                                        <div className="rbt-card variation-01 rbt-hover card-list-2">
                                            <div className="rbt-card-img">
                                                <Skeleton width={50}/>

                                            </div>
                                            <div className="rbt-card-body">
                                                <div className="rbt-card-top">
                                                    <Skeleton height={20}/>
                                                </div>
                                                <h4 className="rbt-card-title">
                                                    <Skeleton height={20}/>
                                                </h4>
                                                <ul className="rbt-meta">
                                                    <li>
                                                        <Skeleton height={20} width={70}/>
                                                    </li>
                                                    <li>
                                                        <Skeleton height={20} width={70}/>
                                                    </li>
                                                    <li>
                                                        <Skeleton height={20} width={70}/>
                                                    </li>
                                                </ul>

                                                <p className="rbt-card-text">
                                                    <Skeleton height={50}/>
                                                </p>

                                                <div className="rbt-author-meta mb--10">

                                                    <div className="rbt-author-info">
                                                        <Skeleton height={20} width={100}/>
                                                    </div>
                                                </div>
                                                <div className="rbt-card-bottom">
                                                    <Skeleton height={20} width={70}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </> : <>
                                    <div className="rbt-course-grid-column">
                                        {categoryChecked ? <>
                                            {categoryData.map((data, index) => {
                                                return (
                                                    <>
                                                        <div className="course-grid-12 mt-5" key={index}
                                                             data-sal-delay="150"
                                                             data-sal="data-up"
                                                             data-sal-duration="800">
                                                            <div
                                                                className="rbt-card variation-01 rbt-hover card-list-2">
                                                                <div className="rbt-card-img">
                                                                    <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                                                                        <Image className={"position-relative"} objectFit="inherit" fill={true} src={data.sImagePath} alt="Card image"/>
                                                                    </Link>
                                                                </div>
                                                                <div className="rbt-card-body">
                                                                    <div className="rbt-card-top">
                                                                        <div className="rbt-review">
                                                                            <div className="rating">
                                                                                <i className="fas fa-star"></i>
                                                                                <i className="fas fa-star"></i>
                                                                                <i className="fas fa-star"></i>
                                                                                <i className="fas fa-star"></i>
                                                                                <i className="fas fa-star"></i>
                                                                            </div>
                                                                            ({data.user_rate_cnt} Reviews)
                                                                        </div>
                                                                        <div className="rbt-bookmark-btn">
                                                                            <Link className="rbt-round-btn"
                                                                                  title="Bookmark"
                                                                                  href="#"><i
                                                                                className="feather-heart"></i></Link>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="rbt-card-title">
                                                                        <Link
                                                                            href={`/course-details/${EncryptData(data.nCId)}`}>
                                                                            {data.sCourseTitle}
                                                                        </Link>
                                                                    </h4>
                                                                    <ul className="rbt-meta">
                                                                        <li>
                                                                            <i className="feather-book"></i>
                                                                            {data.lesson_cnt} Lessons
                                                                        </li>
                                                                        <li>
                                                                            <i className="feather-book"></i>
                                                                            {data.section_cnt} Sections
                                                                        </li>
                                                                        <li>
                                                                            <i className="feather-users"></i>
                                                                            {data.enroll_cnt} Students
                                                                        </li>
                                                                    </ul>
                                                                    {
                                                                        data.sLevel !== '' || data.sCategory !== '' ? <>
                                                                            <div
                                                                                className="lavelArea d-flex align-items-center justify-content-between mb--15">
                                                                                {data.sLevel !== '' ? <div
                                                                                    className={`badge text-bg-secondary`}>{data.sLevel}</div> : null}
                                                                                {data.sCategory !== '' ? <div
                                                                                    className={`badge customBadge`}>{data.sCategory}</div> : null}
                                                                            </div>
                                                                        </> : null
                                                                    }
                                                                    {data.sShortDesc.length > 165 ?
                                                                        <p className="rbt-card-text">{data.sShortDesc.substring(0, 110)}...</p> :
                                                                        <p className="rbt-card-text">{data.sShortDesc}</p>
                                                                    }
                                                                    <div className="rbt-author-meta mb--10">

                                                                        <div className="rbt-author-info">
                                                                            By {data.sFName} {data.sLName}
                                                                        </div>
                                                                    </div>
                                                                    <div className="rbt-card-bottom">
                                                                        {data.bIsAccosiateModule === 'no' ? <>
                                                                            <div className="rbt-price">
                                                                    <span
                                                                        className="current-price">₹{data.dAmount}</span>
                                                                                <span
                                                                                    className="off-price">₹{data.nCourseAmount}</span>
                                                                            </div>
                                                                            <Link className="rbt-btn-link m-auto"
                                                                                  href={`/course-details/${EncryptData(data.nCId)}`}>Learn
                                                                                More<i
                                                                                    className="feather-arrow-right"></i></Link>
                                                                        </> : <>
                                                                            <div className="read-more-btn m-auto">
                                                                                <Link className="rbt-moderbt-btn"
                                                                                      href={`/Package/${EncryptData(data.nCId)}`}>
                                                                        <span
                                                                            className="moderbt-btn-text">View Packages</span>
                                                                                    <i className="feather-arrow-right"></i>
                                                                                </Link>
                                                                            </div>
                                                                        </>}


                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )

                                            })}
                                        </> : <>
                                            {currentRecords.map((data, index) => {
                                                return (
                                                    <>
                                                        <div className="course-grid-12 mt-5" key={index}
                                                             data-sal-delay="150"
                                                             data-sal="data-up"
                                                             data-sal-duration="800">
                                                            <div
                                                                className="rbt-card variation-01 rbt-hover card-list-2">
                                                                <div className="rbt-card-img">
                                                                    <Link href={`/course-details/${EncryptData(data.nCId)}`}>
                                                                        <Image className={"position-relative"} objectFit="inherit" fill={true} src={data.sImagePath} alt="Card image"/>
                                                                    </Link>
                                                                </div>
                                                                <div className="rbt-card-body">
                                                                    <div className="rbt-card-top">
                                                                        <div className="rbt-review">
                                                                            <div className="rating">
                                                                                <i className="fas fa-star"></i>
                                                                                <i className="fas fa-star"></i>
                                                                                <i className="fas fa-star"></i>
                                                                                <i className="fas fa-star"></i>
                                                                                <i className="fas fa-star"></i>
                                                                            </div>
                                                                            ({data.user_rate_cnt} Reviews)
                                                                        </div>
                                                                        <div className="rbt-bookmark-btn">
                                                                            <Link className="rbt-round-btn"
                                                                                  title="Bookmark"
                                                                                  href="#"><i
                                                                                className="feather-heart"></i></Link>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="rbt-card-title">
                                                                        <Link
                                                                            href={`/course-details/${EncryptData(data.nCId)}`}>
                                                                            {data.sCourseTitle}
                                                                        </Link>
                                                                    </h4>
                                                                    <ul className="rbt-meta">
                                                                        <li>
                                                                            <i className="feather-book"></i>
                                                                            {data.lesson_cnt} Lessons
                                                                        </li>
                                                                        <li>
                                                                            <i className="feather-book"></i>
                                                                            {data.section_cnt} Sections
                                                                        </li>
                                                                        <li>
                                                                            <i className="feather-users"></i>
                                                                            {data.enroll_cnt} Students
                                                                        </li>
                                                                    </ul>
                                                                    {
                                                                        data.sLevel !== '' || data.sCategory !== '' ? <>
                                                                            <div
                                                                                className="lavelArea d-flex align-items-center justify-content-between mb--15">
                                                                                {data.sLevel !== '' ? <div
                                                                                    className={`badge text-bg-secondary`}>{data.sLevel}</div> : null}
                                                                                {data.sCategory !== '' ? <div
                                                                                    className={`badge customBadge`}>{data.sCategory}</div> : null}
                                                                            </div>
                                                                        </> : null
                                                                    }
                                                                    {data.sShortDesc.length > 165 ?
                                                                        <p className="rbt-card-text">{data.sShortDesc.substring(0, 110)}...</p> :
                                                                        <p className="rbt-card-text">{data.sShortDesc}</p>
                                                                    }
                                                                    <div className="rbt-author-meta mb--10">

                                                                        <div className="rbt-author-info">
                                                                            By {data.sFName} {data.sLName}
                                                                        </div>
                                                                    </div>
                                                                    {/*<div className="rbt-card-bottom">*/}
                                                                    <div
                                                                        className={`rbt-card-bottom ${data.bIsAccosiateModule !== 'no' ? 'justify-content-end' : ''}`}>
                                                                        {data.bIsAccosiateModule === 'no' ? <>
                                                                            <div className="rbt-price">
                                                                    <span
                                                                        className="current-price">₹{data.dAmount}</span>
                                                                                <span
                                                                                    className="off-price">₹{data.nCourseAmount}</span>
                                                                            </div>
                                                                            {/*<Link className="rbt-btn-link m-auto"*/}
                                                                            <Link
                                                                                className={`rbt-btn-link ${data.bIsAccosiateModule !== 'no' ? 'm-auto' : ''}`}
                                                                                href={`/course-details/${EncryptData(data.nCId)}`}>Learn
                                                                                More<i
                                                                                    className="feather-arrow-right"></i></Link>
                                                                        </> : <>
                                                                            <div className="read-more-btn">
                                                                                <Link className="rbt-moderbt-btn"
                                                                                      href={`/Package/${EncryptData(data.nCId)}`}>
                                                                        <span
                                                                            className="moderbt-btn-text">View Packages</span>
                                                                                    <i className="feather-arrow-right"></i>
                                                                                </Link>
                                                                            </div>
                                                                        </>}


                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )

                                            })}
                                        </>}

                                    </div>
                                </>}

                            </>}


                            <div className="row">
                                <div className="col-lg-12 mt--60">


                                    {recordsPerPage >= 6 ? <>
                                        <div className="pagination-controls mt-4">
                                            <button className="prev-btn" onClick={goToPreviousPage}
                                                    disabled={currentPage === 1}>
                                                {/*Previous*/}
                                                <i className="feather-chevrons-left"></i>
                                            </button>

                                            {/* Page Number Buttons */}
                                            {Array.from({length: totalPages}, (_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentPage(index + 1)}  // Set the current page to the clicked page number
                                                    className={`page-number-btn ${currentPage === index + 1 ? 'active' : ''}`}  // Add 'active' class to the current page
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}

                                            <button className="next-btn" onClick={goToNextPage}
                                                    disabled={currentPage === totalPages}>
                                                {/*Next*/}
                                                <i className="feather-chevrons-right"></i>

                                            </button>
                                        </div>
                                    </> : <></>}


                                    {/*<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />*/}

                                    {/*{currentRecords.length > 6 ? <>*/}
                                    {/*    <Pagination*/}
                                    {/*        nPages={nPages}*/}
                                    {/*        currentPage={currentPage}*/}
                                    {/*        setCurrentPage={setCurrentPage}*/}
                                    {/*    />*/}
                                    {/*</> : <></>}*/}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllCoursetwo;
