import Link from "next/link";

import React, {useEffect, useState} from "react";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import CartItems from "@/components/Cart/CartItems";
import moment from "moment";
import Axios from "axios";
import {API_KEY, API_URL} from "@/constants/constant";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";

const CourseSuccessFile = () => {
    // const [transactionId, settransactionId] = useState('')
    // const [OrderId, setorderId] = useState('')
    // const [totalamount, settotalamount] = useState('')
    const [getDate, setDate] = useState('')
    const [courseitem, setcourseitem] = useState([])
    const [paymentDetails, setPaymentDetails] = useState([])
    const [itemCount, setItemCount] = useState(0)
    useEffect(() => {

        const url = window.location.href
        const parts = url.split("/");

        const payId = (parts[parts.length - 1]);
        const udata = JSON.parse(localStorage.getItem('userData'))
        if (payId !== '' && payId !== null && udata['regid'] !== ''){

            Axios.get(`${API_URL}/api/cart/GetCartCourseDone/${udata['regid']}/${payId}`, {
              headers: {
                ApiKey: `${API_KEY}`
              }
            })
                .then(res => {
                  if(res.data.length !== 0){
                    console.log("Course Payment Details",res.data)
                      setItemCount(res.data.length)
                      setcourseitem(res.data)
                      setPaymentDetails({
                          payment_method: res.data?.[0]?.payment_method || "",
                          payment_status: res.data?.[0]?.payment_status || "",
                          payment_id: res.data?.[0]?.payment_id || "",
                          sOID: res.data?.[0]?.sOID || "",
                          txnAmount: res.data?.[0]?.txnAmount || "",
                      });

                    // Check Payment Status From Razor Pay
                    // //   username: "rzp_test_8zjBFXhPLdvQqc",
                    // //       password: "l6rWAF3kaA5iPfBYIryO7Ory"
                    //   const RAZORPAY_KEY_ID = "rzp_test_8zjBFXhPLdvQqc";
                    //   const RAZORPAY_KEY_SECRET = "l6rWAF3kaA5iPfBYIryO7Ory";
                    //
                    //   if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
                    //       return res.status(500).json({ error: "Razorpay credentials not set" });
                    //   }
                    //
                    //   try {
                    //       const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
                    //
                    //       // Razorpay API request
                    //       const response = Axios.get(`https://api.razorpay.com/v1/payments/${paymentDetails.payment_id}`, {
                    //           headers: {
                    //               Authorization: `Basic ${credentials}`,
                    //           },
                    //       });
                    //       console.log("Order Details:", response.data);
                    //   } catch (error) {
                    //       console.error("Razorpay Error:", error.response?.data || error.message);
                    //   }

                      // Close Check Payment Status From Razor Pay
                  }
                })
                .catch(err => {
                  { ErrorDefaultAlert(err) }
                })
        }


        const date = moment();
        const currentDate = date.format('D/MM/YYYY');
        console.log(currentDate)
        setDate(currentDate)
    },[])

    return (
        <>
            <div className="cart_area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="messageData text-center">
                                {
                                    paymentDetails.payment_status === 'failed' ? <h1 className={'text-danger mb--0'}>Failed</h1>
                                        : paymentDetails.payment_status === 'refunded' ?
                                            <h1 className={'text-success mb--0'}>Refunded</h1> :
                                            <h1 className={'text-success mb--0'}>Success</h1>
                                }

                                {
                                    paymentDetails.payment_status === 'failed' ?
                                        <p>Your Transaction was failed. please try again !</p> :
                                        paymentDetails.payment_status === 'refunded' ?
                                            <p>Your payment has been refunded successfully. If you have any issues, please contact support.</p> :
                                            <p>Your Transaction was successfull</p>
                                }
                            </div>
                        </div>
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
                                        courseitem.map((item, index) => (
                                            <tr key={index}>
                                                <td className="pro-thumbnail">
                                                    <img src={item.cimg} width="140" height="111" alt={item.cname}/>
                                                </td>
                                                <td className={"text-start"}>{item.cname}
                                                    <br/>
                                                    <span className={"font-12"}>By {item.fname} {item.lname}</span>

                                                </td>
                                                <td>₹{item.cnewamt}</td>
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">No items in the cart</td>
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
                                                    <button
                                                        className="rbt-btn btn-gradient icon-hover w-100 text-center">
                                                        <span className="btn-text">Download Invoice</span><span
                                                        className="btn-icon"><i className="feather-download"></i></span>
                                                    </button>
                                                </div>
                                                <div className="single-button mt--10">
                                                    <button
                                                        className="rbt-btn hover-icon-reverse btn-border-gradient w-100 text-center outlineBtnRadius">
                                                        <div className="icon-reverse-wrapper"><span
                                                            className="btn-text">Download Receipt</span><span
                                                            className="btn-icon"><i
                                                            className="feather-download"></i></span><span
                                                            className="btn-icon"><i
                                                            className="feather-download"></i></span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div> : null
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseSuccessFile
