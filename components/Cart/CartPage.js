import Link from "next/link";

import React, {useEffect, useState, useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import CartItems from "./CartItems";
import Axios from "axios";
import {API_URL, API_KEY} from "../../constants/constant";
import { Row, Col, Input, CustomInput, Form } from 'reactstrap'
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import { useRouter } from "next/router";
import useRazorpay from "react-razorpay";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

import {NextResponse} from "next/server";
import emptycart from "@/public/images/emptyCart.png";
import Image from "next/image";

// const razorpay = new Razorpay({
//   key_id: "rzp_test_8zjBFXhPLdvQqc",
//   key_secret: "l6rWAF3kaA5iPfBYIryO7Ory"
// })

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, total_amount, shipping_fee } = useSelector(
    (state) => state.CartReducer
  );

  const router = useRouter()

  const REACT_APP = API_URL
  const [courseitem, setcourseitem] = useState([])
  const [isApiCall, setApiCall] = useState(0)
  const [handleGST, sethandleGST] = useState('')
  const [showTax, setshowTax] = useState(false)
  const [Razorpay] = useRazorpay();


  const CreatePayment = (orderDetails) => {
    console.log(orderDetails)
    const options = {
      key: "rzp_test_8zjBFXhPLdvQqc",
      amount: orderDetails.txnAmount,
      currency: "INR",
      name: "EET English",
      description: "Course Transaction",
      image: "https://eetenglish.com/favicon.ico",
      order_id: orderDetails.razorpayOrderId,
      handler: function (response){
        console.log('Decrypted', response)
        console.log('Encrypted', EncryptData(response))
         // router.push(`/payment-detail/${EncryptData(response.razorpay_order_id)}/${EncryptData(response.razorpay_payment_id)}/${EncryptData(orderDetails.txnAmount)}`)

        //api call backend
        if(localStorage.getItem('userData')){
          const udata = JSON.parse(localStorage.getItem('userData'))
          Axios.post(`${API_URL}/api/cart/PaymentOrderVerify/${udata['regid']}/${EncryptData(orderDetails.orderId)}/${EncryptData(response)}`, '1', {
            headers: {
              ApiKey: `${API_KEY}`
            }
          }).then(res => {
                if (res.data) {
                  console.log(res.data)
                  const retData = JSON.parse(res.data)
                  if(retData.success === "1"){ 
                    // console.log("response.razorpay_order_id",response.razorpay_order_id, "razorpay_payment_id",response.razorpay_payment_id,"txnAmount",orderDetails.txnAmount)
                    // console.log("response.razorpay_order_id",EncryptData(response.razorpay_order_id), "razorpay_payment_id",EncryptData(response.razorpay_payment_id),"txnAmount",EncryptData(orderDetails.txnAmount))
                    // router.push(`/payment-detail/${EncryptData(response.razorpay_order_id)}/${EncryptData(response.razorpay_payment_id)}/${EncryptData(orderDetails.txnAmount)}`)
                  // New Code
                    Axios.get(`${API_URL}/api/cart/GetUserCart/${udata['regid']}/${EncryptData(response)}`, {
                      headers: {
                        ApiKey: `${API_KEY}`
                      }
                    }).then(res => {
                      if (res.data) {
                        const retData = JSON.parse(res.data)
                        if(retData.success === "1"){
                          // console.log("response.razorpay_order_id",response.razorpay_order_id, "razorpay_payment_id",response.razorpay_payment_id,"txnAmount",orderDetails.txnAmount)
                          // console.log("response.razorpay_order_id",EncryptData(response.razorpay_order_id), "razorpay_payment_id",EncryptData(response.razorpay_payment_id),"txnAmount",EncryptData(orderDetails.txnAmount))
                          // router.push(`/payment-detail/${EncryptData(response.razorpay_order_id)}/${EncryptData(response.razorpay_payment_id)}/${EncryptData(orderDetails.txnAmount)}`)
                          router.push(`/payment-detail/${retData.payid}`)
                        } else {
                          //payment not verified error
                        }
                      }
                    })
                        .catch(err => {
                          console.log(err)
                          { ErrorDefaultAlert(err) }
                        })
                    // Close Code
                  } else {
                    //payment not verified error
                  }
                }
              })
              .catch(err => {
                console.log(err)
                { ErrorDefaultAlert(err) }
              })
        }

        //call parameter
      },
      prefill: {
        name: "username",
        email: "user@gmail.com",
        contact: "+919999999999",
      },
      notes: {
        address: "EET English Pvt Ltd",
      },
      theme: {
        color: "#4b71fc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.on('payment.failed', function (response){
      if(response.error.code !== 'undefined'){
        router.push('redirect to failure page')
      }
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    })
    rzpay.open();
  };

  // const [cidarr, setcidarr] = useState([])
  const handlePayment = () => {
    if(localStorage.getItem('userData')) {
    const regID = JSON.parse(localStorage.getItem('userData'))
      // alert(checkoutAmount * 100)


      Axios.get(`${API_URL}/api/cart/GetCartItem/${regID['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              console.log(res.data)
              if (res.data.length !== 0) {

                // setcidarr(res.data)
                const cidarr = res.data.map((obj) => {
                  // console.log(obj)
                  return obj.cid
                })

                // const totalAmnt = 50
                const totalAmnt = checkoutAmount
                console.log(EncryptData(cidarr), cidarr, EncryptData(totalAmnt), regID['regid'])
                Axios.post(`${API_URL}/api/cart/PaymentOrderInsert/${regID['regid']}/${EncryptData(totalAmnt)}/${EncryptData(cidarr)}`, '1', {
                  headers: {
                    ApiKey: `${API_KEY}`
                  }
                }).then(res => {
                  const retData = JSON.parse(res.data)
                  // console.log('Response', res.data)
                  console.log('paydata', DecryptData(retData.pay_data))

                  const OrderDetails = DecryptData(retData.pay_data)

                  if (retData.success === "1") {
                    if (totalAmnt > 0) {
                      CreatePayment(OrderDetails)
                      // initializing razorpay
                    } else if (parseInt(checkoutAmount) === 0) {
                      //if amount id '0' then do not open payment gateway
                      Axios.get(`${API_URL}/api/cart/GetUserCartFree/${regID['regid']}`, {
                        headers: {
                          ApiKey: `${API_KEY}`
                        }
                      })
                          .then(res => {
                            if (res.data.length !== 0) {
                              console.log(res.data)
                              const retData = JSON.parse(res.data)
                              if (retData.success === '1') {
                                const ordid = retData.orderId
                                const pid = retData.payid
                                router.push(`/payment-detail/${EncryptData(ordid)}/${pid}/${EncryptData(parseInt(checkoutAmount))}`)
                              }

                            }
                          })
                          .catch(err => {
                            console.log(err)
                            { ErrorDefaultAlert(err) }
                          })

                    }
                    //this.NewPayment(EncryptData(finalAmt))
                  } else if (retData.success === "0") {
                    // console.log(retData)
                    { ErrorAlert(retData) }
                  }
                })
                    .catch(err => {
                      { ErrorDefaultAlert(JSON.stringify(err.response)) }
                    })

              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

    }
  }

  const handleChangeGST = (e) => {

      if (e.target.checked) {
        setshowTax(true)
        // this.setState({ showTax: true })
      } else {
        setshowTax(false)
      }
      sethandleGST(e.target.checked)
      // this.setState({ handleGST : e.target.checked })
  }
  let checkoutAmount = 0
  let originalPrice = 0
  let discountPrice = 0
  let specialPrice = 0
  useEffect(() => {
    dispatch({ type: "COUNT_CART_TOTALS" });
    localStorage.setItem("hiStudy", JSON.stringify(cart));

    if (localStorage.getItem('userData')) {
      const udata = JSON.parse(localStorage.getItem('userData'))

      //get cart data from db
      Axios.get(`${API_URL}/api/cart/GetCartItem/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              console.log(res.data)
              if (res.data.length !== 0) {
                  const a = res.data.map((obj) => {
                    // console.log(obj)
                    return obj.cid
                  })
                console.log(EncryptData(a))
                const newcartlist = res.data.filter((v, i, a) => a.findIndex(t => ((t.cid === v.cid) && (t.pkgId === v.pkgId))) === i)
                // console.log(newcartlist)
                setcourseitem(newcartlist)
                localStorage.removeItem('cart')
                localStorage.setItem('cart', JSON.stringify(newcartlist))

              }
              setApiCall(1)
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

    } else if (localStorage.getItem('cart')) {
      setcourseitem(JSON.parse(localStorage.getItem('cart')))
      // console.log('cart')
    }
  }, [cart]);

  return (
    <>
      <div className="cart_area">
        <div className="container">

          {
            isApiCall === 0 ? <>

                  <div className="row">
                    <div className="col-lg-8">
                      <b><Skeleton width={150}/></b><b> </b>
                      <hr/>
                      <div className="cart-table table-responsive mb--60">
                        <table className="table">
                          <thead></thead>
                          <tbody>
                          <tr>
                            <td className="pro-thumbnail">
                              <Skeleton width={140} height={111}/>
                            </td>
                            <td>
                              <Skeleton width={100} height={20}/>
                            </td>
                            <td>
                              <Skeleton width={80} height={20}/>
                            </td>
                            <td>
                              <Skeleton width={80} height={20}/>
                            </td>
                            <td>
                              <div className={"d-flex align-items-center"}>
                                <Skeleton className={'mr--10'} width={40} height={40}/>
                                <Skeleton width={40} height={40}/>
                              </div>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="cart-summary">
                        <div className="cart-summary-wrap">
                          <div className="section-title text-start">
                            <Skeleton width={150} height={25}/>
                          </div>

                          <div>
                            <div className="section-title text-start mt--20">
                              <Skeleton width={200} height={20}/>
                            </div>
                            <form>
                              <div className="row mt--10">
                                <div className="col-md-6 col-12 mb--25">
                                  <Skeleton width="100%" height={40}/>
                                </div>
                                <div className="col-md-6 col-12 mb--25">
                                  <Skeleton width="100%" height={40}/>
                                </div>
                              </div>
                            </form>
                          </div>

                          <div className="row">
                            <div className="align-self-center col-sm-10 col-md-10 col-lg-10">
                              <Skeleton width={150} height={20}/>
                            </div>
                            <div className="col-sm-2 col-md-2 col-lg-2">
                              <Skeleton width={40} height={20}/>
                            </div>
                            <div className="align-self-center col-sm-10 col-md-10 col-lg-10">
                              <Skeleton width={120} height={20}/>
                            </div>
                            <div className="col-sm-2 col-md-2 col-lg-2">
                              <Skeleton width={30} height={20}/>
                            </div>
                          </div>

                          <h2>
                            <div className="d-flex justify-content-between">
                              <Skeleton width={100} height={25}/>
                              <Skeleton width={30} height={25}/>
                            </div>

                          </h2>

                          <div className="mt-5">
                            <div className="single-button">
                              <Skeleton width="100%" height={45}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </> :
                <>
                  {courseitem.length !== 0 ? <>
                    <div className="row">
                      <div className="col-lg-8">
                        {courseitem.length > 1 ? <b>{courseitem.length} items in cart</b> :
                            <b>{courseitem.length} item in cart</b>}
                        <b> </b>
                        <hr></hr>
                        {/*<Form>*/}
                        <div className="cart-table table-responsive mb--60">
                          <table className="table">
                            <thead>
                            {/*<tr>*/}
                            {/*  <th className="pro-thumbnail">Image</th>*/}
                            {/*  <th className="pro-title">Product</th>*/}
                            {/*  <th className="pro-price">Price</th>*/}
                            {/*  /!*<th className="pro-quantity">Quantity</th>*!/*/}
                            {/*  /!*<th className="pro-subtotal">Total</th>*!/*/}
                            {/*  <th className="pro-remove">Remove</th>*/}
                            {/*</tr>*/}
                            </thead>
                            <tbody>
                            {courseitem.map((item, index) => {
                              console.log("Course Item List", item)
                              // const userPay = (parseInt(item.pay_price) - (parseInt(item.pay_price) * parseInt(item.discount) / 100))
                              const userPay = item.sDiscountType === "amount"
                                  ? parseInt(item.pay_price) - parseInt(item.discount)
                                  : parseInt(item.pay_price) - (parseInt(item.pay_price) * parseInt(item.discount) / 100);
                              // console.log(userPay, pay_amnt)
                              const pay_amnt = parseInt(item.pay_price) - parseInt(item.user_pay)
                              console.log("User Pay And Pay Amount ", userPay, pay_amnt)
                              // console.log(pay_amnt)
                              checkoutAmount += userPay
                              console.log("checkoutAmount", checkoutAmount)
                              originalPrice += parseInt(item.og_price)
                              discountPrice += parseInt(item.pay_price)
                              // specialPrice += (parseInt(item.pay_price) * parseInt(item.discount) / 100)
                              specialPrice += item.sDiscountType === "amount"
                                  ? parseInt(item.discount)  // Amount type me direct discount add hoga
                                  : (parseInt(item.pay_price) * parseInt(item.discount) / 100); // Percentage type me discount calculate hoga

                              return <CartItems cartitem={courseitem} index={index} checkoutAmount={checkoutAmount}
                                                key={index}
                                                product={item}/>;
                            })}

                            </tbody>
                          </table>
                        </div>
                        {/*</Form>*/}

                        {/*<div className="row g-5">*/}

                        {/*</div>*/}
                      </div>

                      <div className="col-lg-4">
                        <div className="cart-summary">
                          <div className="cart-summary-wrap">
                            <div className="section-title text-start">
                            <h4 className="title mb--30">Cart Summary</h4>
                            </div>
                            <div className="d-none">
                              <div className="section-title text-start">
                                <h6 className="">Discount Coupon Code</h6>
                              </div>
                              <Form>
                                <div className="row">
                                  <div className="col-md-6 col-12 mb--25">
                                    <input type="text" placeholder="Coupon Code"/>
                                  </div>
                                  <div className="col-md-6 col-12 mb--25">
                                    <button className="rbt-btn btn-gradient hover-icon-reverse btn-sm">
                            <span className="icon-reverse-wrapper">
                              <span className="btn-text" style={{fontSize: '14px'}}>Apply Code</span>
                              <span className="btn-icon">
                                <i className="feather-arrow-right"></i>
                              </span>
                              <span className="btn-icon">
                                <i className="feather-arrow-right"></i>
                              </span>
                            </span>
                                    </button>
                                  </div>
                                </div>
                              </Form>
                            </div>
                            <Row className={'d-none'}>
                              <Col lg={10} md={10} sm={10} className="align-self-center">
                                <p> Do you claim GST?</p>
                              </Col>
                              <Col lg={2} md={2} sm={2}>
                                <input
                                    id={`cat-list`}
                                    type="checkbox"
                                    className={'mt-4'}
                                    value={handleGST}
                                    onChange={handleChangeGST}
                                    name={`cat-list`}
                                    style={{opacity: '1', position: 'relative', height: '15px'}}/>
                              </Col>
                              {showTax ? <>
                                <Col>
                                  <input type="text" placeholder="Enter GST Number"/>
                                </Col>
                              </> : <></>}

                            </Row>
                            <p>
                              Original Price <span> <del>₹ {originalPrice} </del> <span className={'ml--10'}> ₹ {discountPrice}</span></span>
                            </p>
                            {/*<p>*/}
                            {/*  Discounted Price <span>₹ {discountPrice}</span>*/}
                            {/*</p>*/}
                            <p>
                              Discounted Price <span> (-) ₹ {specialPrice}</span>
                            </p>
                            {/*{handleGST ? <>*/}
                            {/*  <p>*/}
                            {/*    Sub Total <span>₹{((checkoutAmount * 100) / (100 + 18)).toFixed(2)}</span>*/}
                            {/*  </p>*/}
                            {/*</> : <>*/}
                            {/*  <p>*/}
                            {/*    Sub Total <span>₹ {checkoutAmount}</span>*/}
                            {/*  </p>*/}
                            {/*</>}*/}
                            {showTax ? <>

                              <Row>
                                <Col lg={9} className="align-self-center">
                                  <div
                                      className='detail-title font-weight-bolder lh-16 font-15'>Tax:
                                  </div>
                                </Col>
                                <Col lg={3} className="text-end">
                          <span className={'font-15'}>
                            ₹ {parseFloat((checkoutAmount) - ((checkoutAmount * 100) / (100 + 18))).toFixed(2)}
                          </span>
                                </Col>
                              </Row>
                            </> : <></>}
                            <h2>
                              Payable Price{" "}
                              <span>₹ {checkoutAmount}</span>
                            </h2>
                            <div className="mt-5">
                              <div className="single-button">
                                <div
                                    onClick={handlePayment}
                                    className="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y w-100 text-center"
                                >
                                  <span data-text="Pay Now">Pay Now</span>
                                </div>
                              </div>
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </> : <>
                    <div className="emptyImage w-25 m-auto">
                      <Image
                          src={emptycart}
                          width={372}
                          height={396}
                          alt="Cart Empty"
                          className={'w-100'}
                      />
                      {/*<img src="assets/images/client/avatar-02.png"*!/*/}
                      {/*/!*             alt="Sophia Jaymes"/>*!/*/}
                    </div>
                    <h5 className={'text-center'}>Cart is empty!</h5>
                  </>}
                </>
          }


        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(CartPage), {ssr: false});
