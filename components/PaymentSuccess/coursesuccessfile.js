import Link from "next/link";

import React, {useEffect, useState} from "react";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import CartItems from "@/components/Cart/CartItems";
import moment from "moment";
import Axios from "axios";
import {API_KEY, API_URL} from "@/constants/constant";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import paymentFail from "@/public/images/eet_payment_failed.png";
import invalidData from "@/public/images/invalid.png";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "@/public/images/logo/eetlogo 1.svg";

const CourseSuccessFile = () => {
    // const [transactionId, settransactionId] = useState('')
    // const [OrderId, setorderId] = useState('')
    // const [totalamount, settotalamount] = useState('')
    const [getDate, setDate] = useState('')
    const [courseitem, setcourseitem] = useState([])
    const [paymentDetails, setPaymentDetails] = useState([])
    const [itemCount, setItemCount] = useState(0)
    const [getApiCall, setApiCall] = useState(0)
    const [getPaymentUrlId, setPaymentUrlId] = useState('')
    const [getUserData, setUserData] = useState([])
    const [getServerError, setServerError] = useState(1)
    const [getPurchaseAmount, setPurchaseAmount] = useState(0)
    let setCartAmount = 0;
    useEffect(() => {

        const url = window.location.href
        const parts = url.split("/");

        const payId = (parts[parts.length - 1]);
        // const payId = EncryptData('pay_QAyKg76vNPtgjYs');
        // const payId = (EncryptData('pay_QAyKg76vNPtgjY'));
        const udata = DecryptData(localStorage.getItem('userData'))
        if (payId !== '' && payId !== null && udata['regid'] !== ''){
            setUserData(udata)
            Axios.get(`${API_URL}/api/cart/GetCartCourseDone/${udata['regid']}/${payId}`, {
              headers: {
                ApiKey: `${API_KEY}`
              }
            })
                .then(res => {
                  if(Array.isArray(res.data) && res.data.length !== 0){
                      setPaymentUrlId(payId)
                    console.log("Course Payment Details",res.data)
                      setItemCount(res.data.length)
                      setcourseitem(res.data)
                      setPaymentDetails({
                          payment_method: res.data?.[0]?.payment_method || "",
                          payment_status: res.data?.[0]?.payment_status || "",
                          payment_id: res.data?.[0]?.payment_id || "",
                          sOID: res.data?.[0]?.sOID || "",
                          txnAmount: res.data?.[0]?.txnAmount || "",
                          purchaseDate: res.data?.[0]?.dCreatedDate2 || "",
                      });
                      setApiCall(1)
                      setServerError(1)
                  }else {
                      // Payment Failed And Refueled
                      Axios.get(`${API_URL}/api/cart/checkPaymentStatus/${DecryptData(payId)}/${udata['regid']}`, {
                          headers: {
                              ApiKey: `${API_KEY}`
                          }
                      })
                          .then(res => {
                              console.log("Payment Failled Data",res.data)
                              if(res.data.length !== 0){

                                  setPaymentDetails({
                                      payment_status: res.data.status || "",
                                      error_description : res.data.error_description || ""
                                  });
                                  setApiCall(1)
                                  setServerError(1)
                              }
                          })
                          .catch(err => {
                              {
                                  ErrorDefaultAlert(err)
                                  setServerError(0)
                              }
                          })
                  }
                })
                .catch(err => {
                  { ErrorDefaultAlert(err)
                      setServerError(0)
                  }
                })
        }


        const date = moment();
        const currentDate = date.format('D/MM/YYYY');
        console.log(currentDate)
        setDate(currentDate)
    },[])

    const downloadInvoice = () => {
        const invoiceContent = document.getElementById("invoice-content");

        html2canvas(invoiceContent, {
            scale: 2,
            useCORS: true, // If you're using external images
            scrollY: -window.scrollY, // fix scroll capture
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");

            // A4 size dimensions in mm
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
            const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

            // Get image dimensions in pixels
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Calculate aspect ratio
            const ratio = imgWidth / imgHeight;

            // Convert canvas height to fit A4 width
            const pdfWidth = pageWidth - 20; // 10mm padding on each side
            const pdfHeight = pdfWidth / ratio;

            // Add image to PDF
            pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

            pdf.save(`invoice_${paymentDetails.payment_id}.pdf`);
        });
    };

    return (
        <>
            <div className="cart_area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {
                                getServerError === 1 ?
                                    getApiCall !== 1 ?
                                        <div className="messageData text-center">
                                            <h1 className="text-success mb--0">
                                                <Skeleton width="120px" height="30px"/>
                                            </h1>
                                            <p>
                                                <Skeleton width="250px" height="20px"/>
                                            </p>
                                        </div>
                                        : <div className="messageData text-center">
                                            {
                                                paymentDetails.payment_status === 'failed' ?
                                                    <h1 className={'text-danger mb--0'}>Failed</h1>
                                                    : paymentDetails.payment_status === 'refunded' ?
                                                        <h1 className={'text-success mb--0'}>Refunded</h1> : paymentDetails.payment_status === 'captured' ?
                                                            <h1 className={'text-success mb--0'}>Success</h1> : null
                                            }

                                            {
                                                paymentDetails.payment_status === 'failed' ?
                                                    <p>{paymentDetails.error_description ? paymentDetails.error_description : 'Your Transaction was failed. please try again !'}</p> :
                                                    paymentDetails.payment_status === 'refunded' ?
                                                        <p>Your payment has been refunded successfully. If you have any
                                                            issues,
                                                            please contact
                                                            support.</p> : paymentDetails.payment_status === 'captured' ?
                                                            <p>Your Transaction was successfull</p> : null
                                            }
                                        </div> :
                                    <div className="messageData text-center">
                                        <h4 className="text-danger mb--0">
                                            Missing or Invalid Parameter
                                        </h4>
                                        <p>
                                            A required parameter is either missing or invalid. Please verify your request.
                                        </p>
                                    </div>
                            }

                        </div>
                        {
                            getServerError === 1 ?
                                Array.isArray(courseitem) && courseitem.length !== 0 ? <>
                                        <div className="col-12">
                                            <b>{itemCount} {itemCount === 1 ? "item" : "items"} purchased</b>
                                            <hr className={"mt--10"}/>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="cart-table table-responsive mb--60">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Product</th>
                                                        <th>Price</th>
                                                        <th>Purchase Date</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {courseitem.length > 0 ? (
                                                        courseitem.map((item, index) => {
                                                            const finalPrice = parseInt(item.cnewamt || "0") - parseInt(item.dDiscount || "0");

                                                            return (  // ✅ Return statement added
                                                                <tr key={index}>
                                                                    <td className="pro-thumbnail">
                                                                        <img src={item.cimg} width="140" height="111"
                                                                             alt={item.cname}/>
                                                                    </td>
                                                                    <td className={"text-start"}>{item.cname}
                                                                        <br/>
                                                                        <span
                                                                            className={"font-12"}>By {item.fname} {item.lname}</span>
                                                                    </td>
                                                                    <td>₹{finalPrice}</td>
                                                                    {/* ✅ Correct syntax for final price */}
                                                                    <td>
                                                                        {new Date(item.dCreatedDate2).toLocaleString("en-GB", {
                                                                            day: "2-digit",
                                                                            month: "2-digit",
                                                                            year: "numeric",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            hour12: true
                                                                        })}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">No items in the cart
                                                            </td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="col-lg-4">
                                            <div className="cart-summary">
                                                <div className="cart-summary-wrap p-5">
                                                    <div className="section-title text-start">
                                                        <h5 className="title mb--30">Transaction Details</h5>
                                                    </div>
                                                    <p>
                                                        Order Id <span
                                                        className={'ml--10'}> {paymentDetails.sOID}</span>
                                                    </p>
                                                    <p>
                                                        Payment Id <span> {paymentDetails.payment_id}</span>
                                                    </p>
                                                    <p>
                                                        Payment Method <span> {paymentDetails.payment_method}</span>
                                                    </p>
                                                    <p>
                                                        Amount <span> {paymentDetails.txnAmount}</span>
                                                    </p>
                                                    {
                                                        paymentDetails.payment_status === 'captured' || paymentDetails.payment_status === 'created' || paymentDetails.payment_status === 'authorized' ?
                                                            <div className="mt-5">
                                                                <div className="single-button">
                                                                    {/*<Link href={`/inovice/${getPaymentUrlId}`}>*/}
                                                                    {/*    <button*/}
                                                                    {/*        className="rbt-btn btn-gradient icon-hover w-100 text-center">*/}
                                                                    {/*        <span className="btn-text">Download Invoice</span><span*/}
                                                                    {/*        className="btn-icon"><i*/}
                                                                    {/*        className="feather-download"></i></span>*/}
                                                                    {/*    </button>*/}
                                                                    {/*</Link>*/}
                                                                    <button onClick={downloadInvoice}
                                                                            className="rbt-btn btn-gradient icon-hover w-100 text-center">
                                                                    <span
                                                                        className="btn-text">Download Invoice</span><span
                                                                        className="btn-icon"><i
                                                                        className="feather-download"></i></span>
                                                                    </button>
                                                                </div>
                                                            </div> : null
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </> :
                                    (
                                        getApiCall !== 1 ? (
                                            <>
                                                <div className="col-12">
                                                    <b><Skeleton width="150px" height="20px"/></b>
                                                    <hr className="mt--10"/>
                                                </div>
                                                <div className="col-lg-8">
                                                    <div className="cart-table table-responsive mb--60">
                                                        <table className="table">
                                                            <thead>
                                                            <tr>
                                                                <th><Skeleton width="80px" height="20px"/></th>
                                                                <th><Skeleton width="100px" height="20px"/></th>
                                                                <th><Skeleton width="60px" height="20px"/></th>
                                                                <th><Skeleton width="120px" height="20px"/></th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td className="pro-thumbnail"><Skeleton width="140px"
                                                                                                        height="111px"/>
                                                                </td>
                                                                <td className="text-start">
                                                                    <Skeleton width="250px" height="20px"/>
                                                                    <br/>
                                                                    <Skeleton width="200px" height="15px"/>
                                                                </td>
                                                                <td><Skeleton width="60px" height="20px"/></td>
                                                                <td><Skeleton width="120px" height="20px"/></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="pro-thumbnail"><Skeleton width="140px"
                                                                                                        height="111px"/>
                                                                </td>
                                                                <td className="text-start">
                                                                    <Skeleton width="250px" height="20px"/>
                                                                    <br/>
                                                                    <Skeleton width="200px" height="15px"/>
                                                                </td>
                                                                <td><Skeleton width="60px" height="20px"/></td>
                                                                <td><Skeleton width="120px" height="20px"/></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="pro-thumbnail"><Skeleton width="140px"
                                                                                                        height="111px"/>
                                                                </td>
                                                                <td className="text-start">
                                                                    <Skeleton width="250px" height="20px"/>
                                                                    <br/>
                                                                    <Skeleton width="200px" height="15px"/>
                                                                </td>
                                                                <td><Skeleton width="60px" height="20px"/></td>
                                                                <td><Skeleton width="120px" height="20px"/></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="pro-thumbnail"><Skeleton width="140px"
                                                                                                        height="111px"/>
                                                                </td>
                                                                <td className="text-start">
                                                                    <Skeleton width="250px" height="20px"/>
                                                                    <br/>
                                                                    <Skeleton width="200px" height="15px"/>
                                                                </td>
                                                                <td><Skeleton width="60px" height="20px"/></td>
                                                                <td><Skeleton width="120px" height="20px"/></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4">
                                                    <div className="cart-summary">
                                                        <div className="cart-summary-wrap p-5">
                                                            <div className="section-title text-start">
                                                                <h5 className="title mb--30"><Skeleton width="180px"
                                                                                                       height="25px"/>
                                                                </h5>
                                                            </div>
                                                            <p className={'d-flex justify-content-between align-items-center'}>
                                                                <Skeleton width="100px" height="15px"/> <span
                                                                className="ml--10"><Skeleton width="150px"
                                                                                             height="15px"/></span></p>
                                                            <p className={'d-flex justify-content-between align-items-center'}>
                                                                <Skeleton width="120px" height="15px"/> <span><Skeleton
                                                                width="180px" height="15px"/></span></p>
                                                            <p className={'d-flex justify-content-between align-items-center'}>
                                                                <Skeleton width="140px" height="15px"/> <span><Skeleton
                                                                width="80px" height="15px"/></span></p>
                                                            <p className={'d-flex justify-content-between align-items-center'}>
                                                                <Skeleton width="90px" height="15px"/> <span><Skeleton
                                                                width="100px" height="15px"/></span></p>


                                                            <div className="mt-5">
                                                                <div className="single-button">
                                                                    <button
                                                                        className="rbt-btn btn-gradient icon-hover w-100 text-center"
                                                                        disabled>
                                                                        <Skeleton width="100%" height="20px"/>
                                                                    </button>
                                                                </div>
                                                                <div className="single-button mt--10">
                                                                    <button
                                                                        className="rbt-btn hover-icon-reverse btn-border-gradient w-100 text-center outlineBtnRadius"
                                                                        disabled>
                                                                        <Skeleton width="100%" height="20px"/>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </>

                                        ) : (
                                            <div className={"col-12"}>
                                                <div className="emptyImage w-25 m-auto">
                                                    <Image
                                                        src={paymentFail}
                                                        width={372}
                                                        height={200}
                                                        alt="Cart Empty"
                                                        className={'w-100'}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    ) : <div className={"col-12"}>
                                    <div className="emptyImage w-25 m-auto">
                                        <Image
                                            src={invalidData}
                                            width={372}
                                            height={200}
                                            alt="Cart Empty"
                                            className={'w-100'}
                                        />
                                    </div>
                                </div>
                        }

                    </div>
                </div>
            </div>

            {
                getServerError === 1 && (
                    <div id="invoice-content" className="cart_area">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="invoiceHeader">
                                        <div
                                            className="companyDetailsImage d-flex justify-content-between align-items-center">
                                            <div className="imageTitle">
                                                <div className="logo">
                                                    <Image
                                                        src={logo}
                                                        width={137}
                                                        height={45}
                                                        alt="EET English"
                                                    />
                                                </div>
                                            </div>
                                            <div className="invoiceTitle">
                                                <h4 className={`mb-2`}>INVOICE</h4>
                                                <span>Date :
                                                    {new Date().toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour12: true,
                                                    })}
                                        </span>
                                            </div>
                                        </div>
                                        <hr className={`mt--10`}/>
                                        <div className="companyAddress d-flex justify-content-between mt--20">
                                            <div className="userComapnyDetails">
                                                <div className="companyDetails">
                                                    <h5 className={`mb-2`}>Company Address</h5>
                                                    <address className={`mb-0`}>
                                                        Urjanagar 1, near Reliance <br/> Cross Road in Kudasan <br/>
                                                        Gandhinagar, Gujarat, India
                                                    </address>
                                                    <span>
                                          info@eet.english.com
                                        </span>
                                                </div>
                                                <div className="userDetails mt--20">
                                                    <h5 className={`mb-2`}>Bill To</h5>
                                                    <span><b
                                                        className={'font-weight-500'}>Name : </b>{getUserData.fname} {getUserData.lname}</span>
                                                    <br/>
                                                    <span><b
                                                        className={'font-weight-500'}>Customer Id : </b>{getUserData.uuid}</span>
                                                    <br/>
                                                    <span>
                                                        <b className={'font-weight-500'}>Purchase Date : </b>
                                                        {new Date(paymentDetails.purchaseDate).toLocaleString("en-GB", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour12: true,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="paymentDetils">
                                                <h5 className={`mb-2`}>Transaction Details</h5>
                                                <span><b className={'font-weight-500'}>Order Id : </b>{paymentDetails.sOID}</span>
                                                <br/>
                                                <span><b
                                                    className={'font-weight-500'}>Payment Id : </b>{paymentDetails.payment_id}</span>
                                                <br/>
                                                <span><b
                                                    className={'font-weight-500'}>Payment Method : </b>{paymentDetails.payment_method}</span>
                                                <br/>
                                                <span><b className={'font-weight-500'}>Payment Status : </b>
                                                    {
                                                        paymentDetails.payment_status === 'failed' ?
                                                            'Failed'
                                                            : paymentDetails.payment_status === 'refunded' ?
                                                                'Refunded' : paymentDetails.payment_status === 'captured' ?
                                                                    'Success' : null
                                                    }
                                        </span>
                                                <br/>
                                                <span><b
                                                    className={'font-weight-500'}>Amount : </b>{paymentDetails.txnAmount}</span>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {
                                    Array.isArray(courseitem) && courseitem.length !== 0 ? <>
                                        <div className="col-lg-12 mt--30">
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead className="table-light">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Product</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {courseitem.length > 0 ? (

                                                        courseitem.map((item, index) => {
                                                            const finalPrice =
                                                                parseInt(item.cnewamt || "0") - parseInt(item.dDiscount || "0");
                                                            setCartAmount += finalPrice;
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        {item.cname}
                                                                        <br/>
                                                                        <small
                                                                            className="text-muted">By {item.fname} {item.lname}</small>
                                                                    </td>
                                                                    <td>₹{finalPrice}</td>
                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">No items in the cart
                                                            </td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <td colSpan={2} className={'text-end font-weight-500'}>Base Amount</td>
                                                        <td>{(setCartAmount / (1+(18/100))).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className={'text-end font-weight-500'}>GST Amount (18%)</td>
                                                        <td>{(setCartAmount - (setCartAmount / (1+(18/100))).toFixed(2)).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className={'text-end font-weight-500'}>Paid Amount</td>
                                                        <td>{setCartAmount}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </> : null
                                }

                            </div>
                        </div>
                    </div>
                )
            }

        </>
    );
};

export default CourseSuccessFile
