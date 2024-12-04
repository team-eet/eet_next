import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "@/context/Context";
import Axios from 'axios'
import {API_URL, API_KEY} from "../../../constants/constant";
import { EncryptData } from "@/components/Services/encrypt-decrypt";
import { ErrorDefaultAlert, ErrorAlert } from "@/components/Services/SweetAlert";
import Skeleton from "react-loading-skeleton";

const Cart = () => {
  const REACT_APP = API_URL
  const [courseitem, setcourseitem] = useState([])

  const router = useRouter();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const dispatch = useDispatch();

  const { cart, total_amount } = useSelector((state) => state.CartReducer);

  const { cartToggle, setCart } = useAppContext();

  const [isLoading, setisLoading] = useState(false)

  const handleRemoveItem = (cartId, cid, pkgid) => {
    if(localStorage.getItem('userData')){
      const udata = JSON.parse(localStorage.getItem('userData'))
      Axios.delete(`${API_URL}/api/cart/DeleteCart/${EncryptData(cartId)}/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            const retData = JSON.parse(res.data)

            if (retData.success === "1") {
              Axios.get(`${API_URL}/api/cart/GetCartItem/${udata['regid']}`, {
                headers: {
                  ApiKey: `${API_KEY}`
                }
              })
                  .then(res => {
                    if (res.data) {
                      // console.log(res.data)
                      if (res.data.length !== 0) {
                        const newcartlist = res.data.filter((v, i, a) => a.findIndex(t => ((t.cid === v.cid) && (t.pkgId === v.pkgId))) === i)
                        setcourseitem(newcartlist)
                        localStorage.removeItem('cart')
                        localStorage.setItem('cart', JSON.stringify(newcartlist))
                      }
                    }
                  })
                  .catch(err => {
                    { ErrorDefaultAlert(err) }
                  })
            } else { { ErrorAlert(retData) } }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
    // setcourseitem((state) => {
    //     state.courseitem.filter((item, i) => i != cid)
    // })
    // setcourseitem((state) => {
    //      state.courseitem.filter((item, i) => i !== cid)
    // }, () => {
    //     localStorage.setItem('cart', JSON.stringify(this.state.courseitem))
    // })

    if (courseitem.length === 1) {
      localStorage.removeItem('cart')
      setcourseitem([])
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setisLoading(true)
    }, 5000)
    dispatch({ type: "COUNT_CART_TOTALS" });
    localStorage.setItem("hiStudy", JSON.stringify(cart));
    if(localStorage.getItem('userData')) {
      const udata = JSON.parse(localStorage.getItem('userData'))

      Axios.get(`${API_URL}/api/cart/GetCartItem/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              // console.log(res.data)
              if (res.data.length !== 0) {
                const newcartlist = res.data.filter((v, i, a) => a.findIndex(t => ((t.cid === v.cid) && (t.pkgId === v.pkgId))) === i)
                // console.log(newcartlist)
                setcourseitem(newcartlist)
                localStorage.removeItem('cart')
                localStorage.setItem('cart', JSON.stringify(newcartlist))
              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }



    if (path === "/cart") {
      setCart(true);
    }
  }, [cart, path]);
  let checkoutAmount = 0

  return (
    <>
      <div className={`${!cartToggle ? "cart-sidenav-menu-active" : ""}`}>
        <div
          className={`rbt-cart-side-menu ${
            !cartToggle ? "side-menu-active" : ""
          }`}
        >
          <div className="inner-wrapper">
            <div className="inner-top">
              <div className="content">
                <div className="title">
                  <h4 className="title mb--0">Your shopping cart</h4>
                </div>
                <div className="rbt-btn-close" id="btn_sideNavClose">
                  <button
                    className="minicart-close-button rbt-round-btn"
                    onClick={() => setCart(!cartToggle)}
                  >
                    <i className="feather-x"></i>
                  </button>
                </div>
              </div>
            </div>
            <nav className="side-nav w-100">

                {courseitem.length !== 0  ? <>
                  <div className="rbt-minicart-wrapper">
                    {courseitem &&
                        courseitem.map((data, index) => {
                              const userPay = (parseInt(data.pay_price) - (parseInt(data.pay_price) * parseInt(data.discount) / 100))
                              // console.log(userPay, pay_amnt)
                              const pay_amnt = parseInt(data.pay_price) - parseInt(data.user_pay)
                              // console.log(pay_amnt)
                              checkoutAmount += userPay
                              return (
                                  <>
                                    <li className="minicart-item" key={index}>
                                      <div className="thumbnail">
                                        <img src={data.cimg}
                                             width={80}
                                             height={64}
                                             alt="Product Images"
                                        />

                                      </div>
                                      <div className="product-content">
                                        <h6 className="title">
                                          {/*<Link*/}
                                          {/*  href={*/}
                                          {/*    data.product.title*/}
                                          {/*      ? `/event-details/${data.id}`*/}
                                          {/*      : `/course-details/${data.id}`*/}
                                          {/*  }*/}
                                          {/*>*/}
                                          {data.cname}
                                          {/*</Link>*/}
                                        </h6>

                                        <span className="quantity">
                                      <span className={'me-2'}>₹{data.pay_price}</span>
                                          {data.sDiscountType === "amount" ? <>
                                            {data.discount !== 0 ? <>
                                              <span className={'font-13 text-success m-0'}>
                                                 - ₹ {data.discount} discount applied
                                              </span>
                                            </> : <></>}
                                          </> : <>
                                            {data.discount !== 0 ? <>
                                              <span className={'font-13 text-success m-0'}>
                                                   - {data.discount}% discount applied
                                              </span>
                                            </> : <></>}
                                          </>}
                                      </span>
                                      </div>
                                      <div className="close-btn">
                                        <button
                                            className="rbt-round-btn"
                                            onClick={() => handleRemoveItem(data.nCartId, data.cid, data.pkgId)}
                                        >
                                          <i className="feather-x"></i>
                                        </button>
                                      </div>
                                    </li>
                                  </>
                              )
                            }
                        )}
                  </div>
                </> : <>
                  {isLoading ? <>
                    <Skeleton height={500} />
                  </> : <>
                  <h6 className={'text-center'}>Your cart is empty!</h6>
                  </>}
                </>}



            </nav>

            <div className="rbt-minicart-footer">
              <hr className="mb--0"/>
              <div className="rbt-cart-subttotal">
                <p className="subtotal">
                  <strong>Subtotal:</strong>
                </p>
                <p className="price">₹{checkoutAmount}</p>
              </div>
              <hr className="mb--0"/>
              <div className="rbt-minicart-bottom mt--20">
                <div className="view-cart-btn">
                  <Link
                      className="rbt-btn btn-border icon-hover w-100 text-center"
                      href="/cart"
                  >
                    <span className="btn-text">View Cart</span>
                    <span className="btn-icon">
                      <i className="feather-arrow-right"></i>
                    </span>
                  </Link>
                </div>
                <div className="checkout-btn mt--20">
                  <Link
                      className="rbt-btn btn-gradient icon-hover w-100 text-center"
                      href="/checkout"
                  >
                    <span className="btn-text">Checkout</span>
                    <span className="btn-icon">
                      <i className="feather-arrow-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Link
            className="close_side_menu"
            href="#"
            onClick={() => setCart(!cartToggle)}
        ></Link>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(Cart), {ssr: false});
