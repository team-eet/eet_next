import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Icon from 'react-feather'
import {
  TabContent,
  TabPane,
  Nav,
  NavLink,
  NavItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardImg,
  CardBody,
  CardText,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
  Badge
} from 'reactstrap'
import Axios from 'axios'

import "venobox/dist/venobox.min.css";

import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "@/context/Context";
import { addToCartAction } from "@/redux/action/CartAction";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../../constants/constant";
const Viedo = ({ checkMatchCourses }) => {
  // console.log(checkMatchCourses)

  const REACT_APP = API_URL
  const { cartToggle, setCart } = useAppContext();
  const [toggle, setToggle] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);


  // =====> Start ADD-To-Cart
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.CartReducer);

  const [amount, setAmount] = useState(1);

  const addToCartFun = (id, amount, product) => {
    dispatch(addToCartAction(id, amount, product));
    setCart(!cartToggle);
  };

  useEffect(() => {
    dispatch({ type: "COUNT_CART_TOTALS" });
    localStorage.setItem("hiStudy", JSON.stringify(cart));
  }, [cart]);

  const [CntActivity, setCntActivity] = useState('')
  const [CntVideo, setCntVideo] = useState('')
  const [CntPdf, setCntPdf] = useState('')
  const [CntImg, setCntImg] = useState('')
  const [crsid, setcrsid] = useState('')

  const getFeatureCount = () => {
    // console.log(checkMatchCourses.nCId)
    const url = window.location.href
    const parts = url.split("/");
    const courseId = parts[parts.length - 1];
    setcrsid(courseId)
    //activity
    Axios.get(`${API_URL}/api/package/Show_activity_count/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
            if (res.data.length !== 0) {
              console.log(res.data)
              setCntActivity(res.data[0].cntAct)
              // this.setState({
              //   CntActivity: res.data[0].cntAct
              // })
            }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
    //
    // //video
    Axios.get(`${API_URL}/api/package/Show_video_count/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            if (res.data.length !== 0) {
              setCntVideo(res.data[0].cntf)
              // this.setState({
              //   CntVideo: res.data[0].cntf
              // })
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })

    //pdf
    Axios.get(`${API_URL}/api/package/Show_pdf_count/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            if (res.data.length !== 0) {
              setCntPdf(res.data[0].cntf)
              // this.setState({
              //   CntPdf: res.data[0].cntf
              // })
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
    //
    // //image
    Axios.get(`${API_URL}/api/package/Show_image_count/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            if (res.data.length !== 0) {
              setCntImg(res.data[0].cntf)

            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  // =====> For video PopUp
  useEffect(() => {
    getFeatureCount()
    import("venobox/dist/venobox.min.js").then((venobox) => {
      new venobox.default({
        selector: ".popup-video",
      });
    });

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isHide = currentScrollPos > 200;

      setHideOnScroll(isHide);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Link
        className={`video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15 ${
          hideOnScroll ? "d-none" : ""
        }`}
        data-vbtype="video"
        href="https://www.youtube.com/watch?v=nA1Aqp0sPQo"
      >
        <div className="video-content">

              <img className="w-100 rbt-radius" src={checkMatchCourses.sImagePath}
                   width={355}
                   height={255}></img>
          <div className="position-to-top">
            <span className="rbt-btn rounded-player-2 with-animation">
              <span className="play-icon"></span>
            </span>
          </div>
          <span className="play-view-text d-block color-white">
            <i className="feather-eye"></i> Preview this course
          </span>
        </div>
      </Link>
      <div className="content-item-content">
        <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
          <div className="rbt-price">
            <div className='plan-price'>
                <span className='font-28 font-weight-bolder'>
                  {(checkMatchCourses.bIsAccosiateCourse === 'no' && checkMatchCourses.bIsAccosiateModule === 'yes') ? ((parseInt(checkMatchCourses.pkg_price) === "0") ? 'Free' : `₹ ${parseInt(checkMatchCourses.pkg_price)}`) : `₹ ${(parseInt(checkMatchCourses.dAmount))}`}
                </span>{(checkMatchCourses.bIsAccosiateCourse === 'yes') ?
                <span className='font-18'
                      style={{verticalAlign: '5px'}}> | </span> : ''} {(checkMatchCourses.bIsAccosiateCourse === 'yes') ?
                <span className="font-weight-600 font-18 text-muted" style={{verticalAlign: '3px'}}><del>₹ {checkMatchCourses.nCourseAmount}</del></span> : ''}
              
              {(checkMatchCourses.bIsAccosiateCourse === 'no' && checkMatchCourses.bIsAccosiateModule === 'no') ?
                  <span className='font-18'
                        style={{verticalAlign: '5px'}}> | </span> : ''} {(checkMatchCourses.bIsAccosiateCourse === 'no' && checkMatchCourses.bIsAccosiateModule === 'no') ?
                <span className="font-weight-600 font-18 text-muted" style={{verticalAlign: '3px'}}><del>₹ {checkMatchCourses.nCourseAmount}</del></span> : ''}
              
            </div>
            
          </div>
          <div className="discount-time">
            <span className="rbt-badge color-danger bg-color-danger-opacity">
              <i className="feather-clock"></i> {checkMatchCourses.days} days
              left!
            </span>
          </div>
        </div>

        <div className="add-to-card-button mt--15">
          <Link
              className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
              href={`/Package/${crsid}`}
          >
            <span className="btn-text">View Packages</span>
            <span className="btn-icon">
              <i className="feather-arrow-right"></i>
            </span>
          </Link>
        </div>

        {/*<div className="buy-now-btn mt--15">*/}
        {/*  <Link*/}
        {/*    className="rbt-btn btn-border icon-hover w-100 d-block text-center"*/}
        {/*    href="#"*/}
        {/*  >*/}
        {/*    <span className="btn-text">Buy Now</span>*/}
        {/*    <span className="btn-icon">*/}
        {/*      <i className="feather-arrow-right"></i>*/}
        {/*    </span>*/}
        {/*  </Link>*/}
        {/*</div>*/}
        <span className="subtitle">
          <i className="feather-rotate-ccw"></i> 30-Day Money-Back Guarantee
        </span>
        <div
            className={`rbt-widget-details has-show-more ${
                toggle ? "active" : ""
            }`}
        >
          <ul className="has-show-more-inner-content rbt-course-details-list-wrapper">
            {/*{checkMatchCourses &&*/}
            {/*  checkMatchCourses.roadmap.map((item, innerIndex) => (*/}
            <ListGroupItem tag='li'>
              <Icon.Youtube size={15} className='mr-1' />  <span className='font-weight-bolder'>{(CntVideo !== null) ? CntVideo : ''}</span> Videos
            </ListGroupItem>
            <ListGroupItem tag='li'>
              <Icon.FileText size={15} className='mr-1' />   <span className='font-weight-bolder'>{CntPdf}</span> PDFs
            </ListGroupItem>
            <ListGroupItem tag='li'>
              <Icon.Image size={15} className='mr-1' />   <span className='font-weight-bolder'>{CntImg}</span> Images
            </ListGroupItem>
            <ListGroupItem tag='li'>
              <Icon.BookOpen size={15} className='mr-1' />   <span className='font-weight-bolder'>{CntActivity}</span> Activities
            </ListGroupItem>
            {(checkMatchCourses.bIsAccosiateCourse === 'yes') ? <ListGroupItem tag='li'>
              <Icon.Layers size={15} className='mr-1' />  Lifetime course access
            </ListGroupItem> : ''}
            <ListGroupItem tag='li'>
              <Icon.Smartphone size={15} className='mr-1' />  Access on multiple device
            </ListGroupItem>
            {/*  ))}*/}
          </ul>
          <div
            className={`rbt-show-more-btn ${toggle ? "active" : ""}`}
            onClick={() => setToggle(!toggle)}
          >
            Show More
          </div>
        </div>

        <div className="social-share-wrapper mt--30 text-center">
          <div className="rbt-post-share d-flex align-items-center justify-content-center">
            <ul className="social-icon social-default transparent-with-border justify-content-center">
              <li>
                <Link href="https://www.facebook.com/">
                  <i className="feather-facebook"></i>
                </Link>
              </li>
              <li>
                <Link href="https://www.twitter.com">
                  <i className="feather-twitter"></i>
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/">
                  <i className="feather-instagram"></i>
                </Link>
              </li>
              <li>
                <Link href="https://www.linkdin.com/">
                  <i className="feather-linkedin"></i>
                </Link>
              </li>
            </ul>
          </div>
          <hr className="mt--20" />
          <div className="contact-with-us text-center">
            <p>For details about the course</p>
            <p className="rbt-badge-2 mt--10 justify-content-center w-100">
              <i className="feather-phone mr--5"></i> Call Us:{" "}
              <Link href="#">
                <strong>+444 555 666 777</strong>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Viedo;
