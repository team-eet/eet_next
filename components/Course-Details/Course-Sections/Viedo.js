import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import "venobox/dist/venobox.min.css";

import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "@/context/Context";
import { addToCartAction } from "@/redux/action/CartAction";
import { API_URL, API_KEY } from "../../../constants/constant";
import {useRouter} from "next/router";
import Axios from "axios";
import {EncryptData, DecryptData} from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import Razorpay from 'razorpay';
import Skeleton from "react-loading-skeleton";


const MySwal = withReactContent(Swal);

const Viedo = ({ checkMatchCourses }) => {
  const REACT_APP = API_URL
  // console.log(checkMatchCourses)
  const router = useRouter();
  const courseId = router.query.courseId;
  console.log("Ankit postId", courseId);
  const [getCntActivity, setCntActivity] = useState('')
  const [getCntVideo, setCntVideo] = useState('')
  const [getCntPdf, setCntPdf] = useState('')
  const [getCntImg, setCntImg] = useState('')
  const [isCartItem, setisCartItem] = useState(false)
  const [isCartId, setisCartId] = useState('')
  const [getNumberCount, setNumberCount] = useState({});
  const [isApiCall, setAPiCall] = useState({});
  const [cid, setcid] = useState('')


  const getFeatureCount = (crsid) => {
    // console.log(checkMatchCourses.nCId)
    //  const url = window.location.href
    //  const parts = url.split("/");
    //  const courseId = parts[parts.length - 1];
  //     //activity
       Axios.get(`${API_URL}/api/package/Show_activity_count/${courseId}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntActivity', res.data)
                setCntActivity(res.data[0].cntAct)
              }
              setAPiCall(prevState => ({ ...prevState, acttivity: 1 }));
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
  //
  //     //video

    Axios.get(`${API_URL}/api/coursemain/GetCourseDocumentCount/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            console.log("Count Data",res.data,'courseId',courseId)
            if (res.data.length !== 0) {
              console.log('CntVideo', res.data)
              // setCntVideo(res.data[0].cntf)
              setNumberCount(res.data[0]);

              // this.setState({
              //   CntVideo: res.data[0].cntf
              // })
            }
            setAPiCall(prevState => ({ ...prevState, pdfcount: 1 }));

          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })

      Axios.get(`${API_URL}/api/package/Show_video_count/${courseId}`, {
        headers: {
           ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntVideo', res.data)
                setCntVideo(res.data[0].cntf)
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

  //     //pdf
      Axios.get(`${API_URL}/api/package/Show_pdf_count/${courseId}`, {
        headers: {
           ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntPdf', res.data)
                setCntPdf(res.data[0].cntf)
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

  //     //image
      Axios.get(`${API_URL}/api/package/Show_image_count/${courseId}`, {
        headers: {
           ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              if (res.data.length !== 0) {
                // console.log('CntImg', res.data)
                setCntImg(res.data[0].cntf)
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
  //
  }

  const getCartItem = () => {
    if(localStorage.getItem('userData')){
      const udata = JSON.parse(localStorage.getItem('userData'))
      Axios.get(`${API_URL}/api/cart/GetCartItem/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            console.log("Ankit Cart Data isCartItem")
            if(res.data.length !== 0){
              console.log("Ankit Get Cart Video.js",res.data)
              for (let i = 0; i < res.data.length; i++) {
                if (!isCartItem) {
                  if (EncryptData(res.data[i].cid) === courseId) {
                    setisCartItem(true)
                  }
                  setisCartId(res.data[0].nCartId)

                } else {
                  console.log("Ankit Cart Data Blank")
                  break
                }
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isHide = currentScrollPos > 200;

      setHideOnScroll(isHide);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }

  useEffect(() => {
    getFeatureCount();
    dispatch({ type: "COUNT_CART_TOTALS" });
    localStorage.setItem("hiStudy", JSON.stringify(cart));
    getCartItem();
    // console.log(EncryptData('0'))
  }, [])
  // console.log(checkMatchCourses)
  const { cartToggle, setCart } = useAppContext();
  const [toggle, setToggle] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);

  // =====> Start ADD-To-Cart
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.CartReducer);

  const [amount, setAmount] = useState(1);

  let cart_arr = []
  let genCart_arr = []

  const handlePayment = useCallback(() => {

  }, [Razorpay]);
  const addToCartFun = (id, amount, product) => {
    // alert('hellooooooooo')
    if(localStorage.getItem('userData')) {
      // const order = createOrder(params);


    dispatch(addToCartAction(id, amount, product));


    let cartitemcnt = 0
    if (localStorage.getItem('cart')) {
      const str_arr = JSON.parse(localStorage.getItem('cart'))
      if (str_arr.length !== 0) {
        cartitemcnt = str_arr.length
      }
    }

    let maximumItemCart = 0

      Axios.get(`${API_URL}/api/companySettings/FillCompanySettings`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data.length !== 0) {
              //console.log(res.data)

              maximumItemCart = res.data[0]['nMaximumItemCart']

              if (maximumItemCart >= (cartitemcnt + 1)) {

                const url = window.location.href
                const parts = url.split("/");
                const courseId = parts[parts.length - 1];
                //alert(courseId)
                setcid(courseId)
                setisCartItem(true)

                const getamt = (checkMatchCourses.bIsAccosiateCourse === 'yes') ? parseInt(checkMatchCourses.dAmount) : parseInt(checkMatchCourses.pkg_price)

                //check user is login or not
                if(localStorage.getItem('userData')) {
                  const udata = JSON.parse(localStorage.getItem('userData'))

                  Axios.get(`${API_URL}/api/promocode/Get_promocode_detail/${courseId}/${udata['regid']}/${EncryptData(getamt)}`, {
                    headers: {
                      ApiKey: `${API_KEY}`
                    }
                  })
                      .then(res => {
                        if (res.data) {
                          if (res.data.length !== 0) {
                            console.log(res.data)
                            const resData = JSON.parse(res.data)
                            // console.log("promoCode",resData)
                            if(isCartId === ''){
                              const insert_arr = {
                                nRegId: udata['regid'],
                                cid: courseId,
                                cname: checkMatchCourses.sCourseTitle,
                                fname: checkMatchCourses.sFName,
                                lname: checkMatchCourses.sLName,
                                camt: (checkMatchCourses.nCourseAmount) ? checkMatchCourses.nCourseAmount : 0,
                                cnewamt: (checkMatchCourses.dAmount) ? checkMatchCourses.dAmount : 0,
                                pkgprice: checkMatchCourses.pkg_price,
                                isaccosiatecourse: checkMatchCourses.bIsAccosiateCourse,
                                cimg: checkMatchCourses.sImagePath,
                                pkgId: EncryptData(0),
                                pkgname: '',
                                PCId: resData.pcid,
                                promocode: resData.promocode,
                                Discount: resData.discAmt
                              }

                              console.log("insert_arr",insert_arr)
                              if (insert_arr) {
                                Axios.post(`${API_URL}/api/cart/InsertCart`, insert_arr, {
                                  headers: {
                                    ApiKey: `${API_KEY}`
                                  }
                                }).then(res => {
                                  const retData = JSON.parse(res.data)
                                  // localStorage.setItem('cart', insert_arr)
                                  localStorage.setItem('cart', JSON.stringify(insert_arr))
                                  if (retData.success === "1") {
                                    if (!localStorage.getItem('cart')) {
                                      const str_arr = JSON.stringify([insert_arr])
                                      console.log(str_arr)
                                      localStorage.setItem('cart', str_arr)

                                    } else {
                                      const gitem = JSON.parse(localStorage.getItem('cart'))
                                      genCart_arr = []
                                      if (gitem.length !== 0) {
                                        for (let i = 0; i < gitem.length; i++) {
                                          genCart_arr.push(gitem[i])
                                        }
                                      }
                                      genCart_arr.push(insert_arr)

                                      const str_arr = JSON.stringify(genCart_arr)
                                      localStorage.setItem('cart', str_arr)
                                    }

                                    setCart(!cartToggle);

                                  } else if (retData.success === "0") {
                                    { ErrorAlert(retData) }
                                  }
                                })
                                    .catch(err => {
                                      console.log('err', err)
                                      { ErrorDefaultAlert(JSON.stringify(err.response)) }
                                    })
                              }
                            }else{
                              const update_arr = {
                                nCartId : parseInt(isCartId),
                                nRegId: udata['regid'],
                                cid: courseId,
                                cname: checkMatchCourses.sCourseTitle,
                                fname: checkMatchCourses.sFName,
                                lname: checkMatchCourses.sLName,
                                camt: (checkMatchCourses.nCourseAmount) ? checkMatchCourses.nCourseAmount : 0,
                                cnewamt: (checkMatchCourses.dAmount) ? checkMatchCourses.dAmount : 0,
                                pkgprice: checkMatchCourses.pkg_price,
                                isaccosiatecourse: checkMatchCourses.bIsAccosiateCourse,
                                cimg: checkMatchCourses.sImagePath,
                                pkgId: EncryptData(0),
                                pkgname: '',
                                PCId: resData.pcid,
                                promocode: resData.promocode,
                                Discount: resData.discAmt
                              }

                              console.log("update_arr",update_arr)
                              if (update_arr) {
                                Axios.post(`${API_URL}/api/cart/InsertCart`, update_arr, {
                                  headers: {
                                    ApiKey: `${API_KEY}`
                                  }
                                }).then(res => {
                                  const retData = JSON.parse(res.data)
                                  // localStorage.setItem('cart', insert_arr)
                                  if (retData.success === "1") {
                                    delete update_arr['nCartId'];
                                    localStorage.setItem('cart', JSON.stringify(update_arr))
                                    if (!localStorage.getItem('cart')) {
                                      const str_arr = JSON.stringify([update_arr])
                                      console.log(str_arr)
                                      localStorage.setItem('cart', str_arr)

                                    } else {
                                      const gitem = JSON.parse(localStorage.getItem('cart'))
                                      genCart_arr = []
                                      if (gitem.length !== 0) {
                                        for (let i = 0; i < gitem.length; i++) {
                                          genCart_arr.push(gitem[i])
                                        }
                                      }
                                      genCart_arr.push(update_arr)

                                      const str_arr = JSON.stringify(genCart_arr)
                                      localStorage.setItem('cart', str_arr)
                                    }

                                    setCart(!cartToggle);

                                  } else if (retData.success === "0") {
                                    { ErrorAlert(retData) }
                                  }
                                })
                                    .catch(err => {
                                      console.log('err', err)
                                      { ErrorDefaultAlert(JSON.stringify(err.response)) }
                                    })
                              }
                            }


                          }
                        }
                      })
                      .catch(err => {
                        console.log('err1', err)
                        { ErrorDefaultAlert(err) }
                      })

                }

              }
            }
          })
          .catch(err => {
            console.log('err2', err)
            { ErrorDefaultAlert(err) }
          })
    } else {
      // alert('Please login first')
      return MySwal.fire({
        title: 'Login',
        text: "Login to add course to cart",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: false,
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-primary ms-1'
        },
        buttonsStyling: false
      }).then(function (result) {
          // window.location.href = retData.rlink
        if (result.value) {
          router.push('/login')
        }
      })
    }
  };

  // const updateCart = (id) => {
  //   alert(id)
  // }

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString); // Create a Date object from the dateTimeString
    const day = date.getDate(); // Get the day of the month (1-31)
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()]; // Get the month name (short form)
    const year = date.getFullYear(); // Get the year (4-digit)

    const paddedDay = (day < 10) ? `0${day}` : day;
    // Construct the formatted date string in the "DD-Mon-YYYY" format
    const formattedDate = `${paddedDay}-${month}-${year}`;
    return formattedDate;
  }

  return (
    <>
      <Link
        className={`video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15 ${
          hideOnScroll ? "d-none" : ""
        }`}
        data-vbtype="video"
        href={`${checkMatchCourses.sVideoURL !== "" ? checkMatchCourses.sVideoURL : ""}`}
      >
        {/*{console.log(checkMatchCourses)}*/}
        <div className="video-content">
          {/*<Image className={'position-relative'} src={checkMatchCourses.sImagePath} height={255} width={355}></Image>*/}
          <img className={'position-relative'} src={checkMatchCourses.sImagePath} height={255} width={355}></img>

          {checkMatchCourses.sVideoPath !== null ? <>
            <div className="position-to-top">
            <span className="rbt-btn rounded-player-2 with-animation">
              <span className="play-icon"></span>
            </span>
            </div>
            <span className="play-view-text d-block color-white">
            <i className="feather-eye"></i> Preview this course
          </span>
          </> : <></>}


        </div>
      </Link>
      <div className="content-item-content">
        <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
          <div className="rbt-price">
            <span className="current-price">₹{checkMatchCourses.dAmount}</span>
            <span className="off-price">₹{checkMatchCourses.nCourseAmount}</span>
          </div>
          {/*<div className="discount-time">*/}
          {/*  <span className="rbt-badge color-danger bg-color-danger-opacity">*/}
          {/*    <i className="feather-clock"></i> {checkMatchCourses.days} days*/}
          {/*    left!*/}
          {/*  </span>*/}
          {/*</div>*/}
        </div>

        <div className="add-to-card-button mt--15">
          {checkMatchCourses.nATId === 4 ? <>
            <button className="rbt-btn btn-gradient icon-hover w-100 d-block text-center">
              <span className="btn-text">Upcoming on {formatDate(checkMatchCourses.sUpcomingDate)}</span>
              <span className="btn-icon">
              <i className="feather-arrow-right"></i>
            </span>
            </button>
          </> : <>
            {(!isCartItem) ? ((checkMatchCourses.bIsAccosiateCourse === 'no') && (checkMatchCourses.bIsAccosiateModule === 'yes')) ? <>
              <Link href={`/`} className="rbt-btn btn-gradient icon-hover w-100 d-block text-center">
                <span className="btn-text">Add to Cart</span>
                <span className="btn-icon">
                  <i className="feather-arrow-right"></i>
                </span>
              </Link>
            </> : <>
              <button
                  className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
                  onClick={() =>
                      addToCartFun(cid, checkMatchCourses.dAmount, checkMatchCourses)
                  }
              >
                <span className="btn-text">Add to Cart</span>
                <span className="btn-icon">
              <i className="feather-arrow-right"></i>
            </span>
              </button>
            </> : <>
              {
                isCartId !== '' ? <button
                    className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
                    onClick={() => addToCartFun(cid, checkMatchCourses.dAmount, checkMatchCourses)}
                >
                  <span className="btn-text">Go to Cart</span>
                  <span className="btn-icon">
    <i className="feather-arrow-right"></i>
  </span>
                </button> :
                    <Link href={'/cart'}
                          className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
                    >
                      <span className="btn-text">Go to Cart</span>
                      <span className="btn-icon">
                <i className="feather-arrow-right"></i>
              </span>
                    </Link>
              }




            </>}

          </>}

          {/*<button onClick={handlePayment}>Pay Now</button>*/}

        </div>

        <div
            className={`rbt-widget-details has-show-more mt--15${
                toggle ? "active" : ""
            }`}
        >
          <ul className="has-show-more-inner-content rbt-course-details-list-wrapper">

            <li className={'d-flex align-items-center'}>
              <span>Activity</span>
              {
                isApiCall.acttivity === 1 ? <>
                  <span className="rbt-feature-value rbt-badge-5">
                    {getNumberCount.activity_count}
                  </span>
                </> : <>
                  <Skeleton width="40px" height="20px"/>
                </>
              }
            </li>
            <li className={'d-flex align-items-center'}>
              <span>Activity Questions</span>
              {
                isApiCall.acttivity === 1 ? <>
                <span className="rbt-feature-value rbt-badge-5">
                    {getNumberCount.activity_question_count}
                  </span>
                </> : <>
                  <Skeleton width="40px" height="20px"/>
                </>
              }
            </li>
            <li className={'d-flex align-items-center'}>
              <span>Practice</span>
              {
                isApiCall.acttivity === 1 ? <>
                <span className="rbt-feature-value rbt-badge-5">
                    {getNumberCount.practice_count}
                  </span>
                </> : <>
                  <Skeleton width="40px" height="20px"/>
                </>
              }
            </li>
            <li className={'d-flex'}>
              <span>Practice Questions</span>
              {
                isApiCall.acttivity === 1 ? <>
                <span className="rbt-feature-value rbt-badge-5">
                   {getNumberCount.practice_question_count}
                  </span>
                </> : <>
                  <Skeleton width="40px" height="20px"/>
                </>
              }
            </li>
          </ul>
          <div
              className={`rbt-show-more-btn ${toggle ? "active" : ""}`}
              onClick={() => setToggle(!toggle)}
          >
            {!toggle ? 'Show More' : ' Show Less'}
          </div>
        </div>

        <div className="social-share-wrapper mt--30 text-center">
          <div className="rbt-post-share d-flex align-items-center justify-content-center">
            <ul className="social-icon social-default transparent-with-border justify-content-around w-100">
              <li>
                {
                  isApiCall.pdfcount === 1 ? <>
                    <Link href="javascript:void(0);">
                      {getNumberCount.video_count}
                    </Link>
                    <span className="rbt-feature-value rbt-badge-5">
                     VIDEOs
                  </span>
                  </> : <>
                    <a href="javascript:void(0);">
                      <Skeleton width="20px" height="20px"/>
                    </a>
                    <span className="rbt-feature-value rbt-badge-5">
                      <Skeleton width="60px" height="15px"/>
                    </span>
                  </>
                }
              </li>
              <li>
                {
                  isApiCall.pdfcount === 1 ? <>
                    <Link href="javascript:void(0);">
                      {getNumberCount.pdf_count}
                    </Link>
                    <span className="rbt-feature-value rbt-badge-5">
                     PDFs
                    </span>
                  </> : <>
                    <a href="javascript:void(0);">
                      <Skeleton width="20px" height="20px"/>
                    </a>
                    <span className="rbt-feature-value rbt-badge-5">
                      <Skeleton width="60px" height="15px"/>
                    </span>
                  </>
                }
              </li>
              <li>
                {
                  isApiCall.pdfcount === 1 ? <>
                    <Link href="javascript:void(0);">
                      {getNumberCount.ppt_count}
                    </Link>
                    <span className="rbt-feature-value rbt-badge-5">
                     PPTs
                  </span>
                  </> : <>
                    <a href="javascript:void(0);">
                      <Skeleton width="20px" height="20px"/>
                    </a>
                    <span className="rbt-feature-value rbt-badge-5">
                      <Skeleton width="60px" height="15px"/>
                    </span>
                  </>
                }
              </li>
            </ul>
          </div>
          <hr className="mt--20" />
          <div className="contact-with-us text-center">
            <p>For details about the course</p>
            <p className="rbt-badge-2 mt--10 justify-content-center w-100">
              <i className="feather-help-circle mr--5"></i> Inquiry Now
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Viedo;
