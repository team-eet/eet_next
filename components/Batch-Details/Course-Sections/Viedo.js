import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "@/context/Context";
import { addToCartAction } from "@/redux/action/CartAction";
import { API_URL, API_KEY } from "../../../constants/constant";
import { useRouter } from "next/router";
import Axios from "axios";
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";
import { ErrorAlert, ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import InquiryPopup from "@/components/Inquiry/InquiryPopup";
import useRazorpay from "react-razorpay";


const MySwal = withReactContent(Swal);

const Viedo = ({ checkMatchCourses }) => {
    console.log("Batch Data Check", checkMatchCourses);
    console.log("checkMatchCourses FULL DATA:", checkMatchCourses);
    const router = useRouter();
    // batchId comes from URL — e.g. /batch-details/[courseId]/[batchId]
    // Adjust the query key names to match your actual Next.js route params.
    const rawBatchId = router.query.batchId;   // encrypted batch id from URL
    const rawCourseId = router.query.courseId; // encrypted course id from URL

    // ─── State ────────────────────────────────────────────────────────────────
    const [getNumberCount, setNumberCount]       = useState({});
    const [isApiCall, setAPiCall]                = useState({});
    const [isCartItem, setisCartItem]            = useState(false);
    const [isCartId, setisCartId]                = useState(EncryptData(0));
    const [getvideoOpenData, setvideoOpenData]   = useState("");
    const [showVideoModal, setShowVideoModal]    = useState(false);
    const [showInquiryPopup, setShowInquiryPopup] = useState(false);
    const [getPromoCodeData, setPromoCodeData]   = useState({});
    const [isLoading, setIsLoading]              = useState(false);
    const [toggle, setToggle]                    = useState(false);
    const [hideOnScroll, setHideOnScroll]        = useState(false);
    const [Razorpay] = useRazorpay();
    const [getOrderIDData, setOrderIDData]   =     useState("");
    const [getTBID, setTBID]   =     useState("");
    // ─── Redux / Context ──────────────────────────────────────────────────────
    const dispatch               = useDispatch();
    const { cart }               = useSelector((state) => state.CartReducer);
    const { cartToggle, setCart } = useAppContext();
    const [isAlreadyPurchased, setIsAlreadyPurchased] = useState(false);
    // ─── Days left until batch starts ─────────────────────────────────────────
    const nowDate          = new Date();
    const dBatchStartDate  = new Date(checkMatchCourses.dBatchStartDate);
    nowDate.setHours(0, 0, 0, 0);
    dBatchStartDate.setHours(0, 0, 0, 0);
    const timeDifference   = dBatchStartDate - nowDate;
    const daysLeft         = Math.max(0, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) - 1);

    // ─── Fetch feature counts ─────────────────────────────────────────────────
    const getFeatureCount = () => {
        const batchId = rawBatchId;       // already encrypted from router.query
        const courseMainId = rawCourseId; // already encrypted from router.query
        console.log("batchId:", batchId, "courseMainId:", courseMainId);
        console.log("batchId-ankit:", DecryptData(batchId), "courseMainId-ankit:", DecryptData(courseMainId));
        // Activity count
        Axios.get(`${API_URL}/api/package/Show_activity_count/${batchId}`, {
            headers: { ApiKey: `${API_KEY}` },
        })
            .then((res) => {
                if (res.data && res.data.length !== 0) {
                    console.log("CntActivity", res.data);
                }
                setAPiCall((prev) => ({ ...prev, acttivity: 1 }));
            })
            .catch((err) => ErrorDefaultAlert(err));

        // Batch document counts + video + pdf in parallel
        Axios.all([
            Axios.get(`${API_URL}/api/coursemain/GetBatchDocumentCount/${courseMainId}`, {
                headers: { ApiKey: `${API_KEY}` },
            }),
            Axios.get(`${API_URL}/api/package/Show_video_count/${batchId}`, {
                headers: { ApiKey: `${API_KEY}` },
            }),
            Axios.get(`${API_URL}/api/package/Show_pdf_count/${batchId}`, {
                headers: { ApiKey: `${API_KEY}` },
            }),
        ])
            .then(
                Axios.spread((batchRes, videoRes, pdfRes) => {
                    const batchData     = batchRes.data.length !== 0 ? batchRes.data[0] : {};
                    const videoUrlCount = videoRes.data.length !== 0 ? videoRes.data[0].cntf || 0 : 0;
                    const pdfUrlCount   = pdfRes.data.length !== 0  ? pdfRes.data[0].cntf  || 0 : 0;
                    console.log(batchData.nTBId, "FOUND nTBId") // CHECK THIS
                    console.log("BatchDoc nTBId ANOTHER SOURCE:", batchRes.data[0].nTBId)
                    console.log(batchData, "BatchData PASSED")
                    // ADD THESE 3 LINES
                    console.log("RAW batchRes.data:", batchRes.data);
                    console.log("RAW videoRes.data:", videoRes.data);
                    console.log("RAW pdfRes.data:", pdfRes.data);
                    setNumberCount({
                        ...batchData,
                        video_count: (batchData.video_count || 0) + videoUrlCount,
                        pdf_count:   (batchData.pdf_count   || 0) + pdfUrlCount,
                    });
                    setAPiCall((prev) => ({ ...prev, pdfcount: 1, acttivity: 1 }));
                })
            )
            .catch((err) => ErrorDefaultAlert(err));
    };

    useEffect(() => {
        if (checkMatchCourses?.nTBId) {
            setTBID(checkMatchCourses.nTBId);
        }
    }, [checkMatchCourses]);

    // ─── useEffect ────────────────────────────────────────────────────────────
    useEffect(() => {
        getFeatureCount();
        localStorage.setItem("eetData", JSON.stringify(cart));
        localStorage.setItem("cart", JSON.stringify(cart));
        // Update this specific block in your useEffect
        if (checkMatchCourses.sVideoPath && checkMatchCourses.sVideoPath !== "") {
            setvideoOpenData(checkMatchCourses.sVideoPath); // Direct MP4 first
        } else if (checkMatchCourses.sVideoURL && checkMatchCourses.sVideoURL !== "") {
            setvideoOpenData(checkMatchCourses.sVideoURL); // YouTube second
        } else {
            setvideoOpenData("");
        }
        const purchasedBatches = JSON.parse(localStorage.getItem("purchasedBatches") || "[]");
        const decryptedBatchId = String(DecryptData(rawBatchId));
        if (purchasedBatches.includes(decryptedBatchId)) {
            setIsAlreadyPurchased(true);
        }
    }, [rawBatchId]);

    // ─── Add to Cart ──────────────────────────────────────────────────────────
    const addToCartFun = (batchId, amount,  product) => {
        const courseMainId = rawCourseId;
        setIsLoading(true);

        if (!localStorage.getItem("userData")) {
            return MySwal.fire({
                title: "Login",
                text: "Login to add batch to cart",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Cancel",
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-primary ms-1",
                },
                buttonsStyling: false,
            }).then((result) => {
                if (result.value) {
                    router.push("/login");
                }
            });
        }

        const getamt = parseInt(checkMatchCourses.dAmount) || 0;
        const udata  = DecryptData(localStorage.getItem("userData"));

        console.log("courseMainId-ankit:", courseMainId, "batchId-ankit:", batchId);
        const cnewamt = checkMatchCourses.dAmount ? String(checkMatchCourses.dAmount) : "0";
        const insert_arr = {
            nCartId: EncryptData(0),
            nRegId: udata["regid"],
            cid: courseMainId,
            batchId: batchId,  // ← Use 'batchId' as the field name
            cname: checkMatchCourses.sCourseTitle,
            fname: checkMatchCourses.sFName || "",
            lname: checkMatchCourses.sLName || "",
            camt: Number(checkMatchCourses.nCourseAmount || 0),
            cnewamt: Number(cnewamt),
            pkgprice: Number(checkMatchCourses.pkg_price || 0),
            isaccosiatecourse: checkMatchCourses.bIsAccosiateCourse || "no",
            cimg: checkMatchCourses.sImagePath || "",
            pkgId: EncryptData(0),
            pkgname: "",
            PCId: "",
            promocode:"",
            dDiscount: "",
            isBatch: "true"
        };
        console.log("batch insert_arr", insert_arr);
        console.log("Batch ID ", batchId);
        console.log("Sending to InsertBatchCart:", JSON.parse(JSON.stringify(insert_arr)));
        //   console.log("InsertCart nTBId:",retData.nTBId);
        Axios.post(`${API_URL}/api/cart/InsertBatchCart`, insert_arr,
            {
                headers: {
                    ApiKey:         `${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => {
                const retData = JSON.parse(res.data);
                if (retData.success === "1") {
                    // Processed to Create and Order handle
                    const nTBId = getTBID;
                    handlePayment(Number(cnewamt),batchId,nTBId);
                } else if (retData.success === "0") {
                    ErrorDefaultAlert(retData);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.log("InsertCart err", err);
                ErrorDefaultAlert(JSON.stringify(err.response));
                setIsLoading(false);
            });
    };

    const handlePayment = (amount,batchId,nTBId) => {
        if(localStorage.getItem('userData')) {
            const regID = DecryptData(localStorage.getItem('userData'))
            const totalAmnt = amount;
            Axios.post(`${API_URL}/api/cart/PaymentBatchOrderInsert/${regID['regid']}/${EncryptData(totalAmnt)}/${EncryptData(batchId)}`, '1', {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            }).then(res => {
                const retData = JSON.parse(res.data)
                // console.log('Response', res.data)
                console.log('paydata', DecryptData(retData.pay_data))
                console.log("Payment nTBId:", DecryptData(retData.pay_data).nTBId)
                const OrderDetails = DecryptData(retData.pay_data)

                if (retData.success === "1") {
                    if (totalAmnt > 0) {
                        CreatePayment(OrderDetails,nTBId)
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
                }
                else if (retData.success === "0") {
                    // console.log(retData)
                    { ErrorAlert(retData) }
                }
            })
                .catch(err => {
                    { ErrorDefaultAlert(JSON.stringify(err.response)) }
                })

        }
    }

    const CreatePayment = (orderDetails,nTBId) => {
        console.log("ankit-OrderID", orderDetails)
        console.log("ankit-nTBId", nTBId)
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
                    const udata = DecryptData(localStorage.getItem('userData'))
                    const verifyURL = `${API_URL}/api/cart/PaymentOrderVerify/${udata['regid']}/${EncryptData(orderDetails.orderId)}/${EncryptData(response)}`
                    Axios.post(`${API_URL}/api/cart/PaymentOrderVerify/${udata['regid']}/${EncryptData(orderDetails.orderId)}/${EncryptData(response)}`, '1', {
                        headers: {
                            ApiKey: `${API_KEY}`
                        }
                    }).then(res => {
                        if (res.data) {
                            console.log(res.data)
                            const retData = JSON.parse(res.data)
                            const resDB = EncryptData(response);
                            const u_data = udata['regid'];
                            if(retData.success === "1"){
                                // New Code
                                console.log("ankit-OrderID", orderDetails.orderId);
                                response["eet_orderID"] = orderDetails.orderId;
                                response["query_for"] = "batch";
                                response["eet_tbid"] = getTBID;
                                console.log("ankit-getTBID", getTBID);
                                console.log("ankit-response", EncryptData(response));
                                Axios.get(`${API_URL}/api/cart/GetUserCart/${udata['regid']}/${EncryptData(response)}`, {
                                    headers: {
                                        ApiKey: `${API_KEY}`
                                    }
                                }).then(res => {
                                    if (res.data) {
                                        const innerRetData = JSON.parse(res.data)
                                        if(innerRetData.success === "1"){
                                            // Save purchased batch to localStorage
                                            const purchasedBatches = JSON.parse(localStorage.getItem("purchasedBatches") || "[]");
                                            const decryptedBatchId = String(DecryptData(rawBatchId));
                                            if (!purchasedBatches.includes(decryptedBatchId)) {
                                                purchasedBatches.push(decryptedBatchId);
                                                localStorage.setItem("purchasedBatches", JSON.stringify(purchasedBatches));
                                            }
                                            router.push(`/payment-detail/${innerRetData.payid}`)
                                        } else {
                                            rzpay.close();
                                        }
                                    }
                                })
                                    .catch(err => {
                                        console.log(err)
                                        ErrorDefaultAlert(err)
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
            modal: {
                ondismiss: function () {
                    setIsLoading(false);  // this is here for the payment gateway loading fixes
                },
            },
        };

        const rzpay = new Razorpay(options);
        rzpay.on('payment.failed', function (response){
            // alert(EncryptData(response.error.metadata.payment_id));
            // alert(rzpay.close())
            setIsLoading(false)
            if(response.error.code !== 'undefined'){
                window.location.href = `/payment-detail/${EncryptData(response.error.metadata.payment_id)}`;
            }
            // alert(response.error.code);
            // alert(response.error.description);
            // alert(response.error.source);
            // alert(response.error.step);
            // alert(response.error.reason);
            // alert(response.error.metadata.order_id);

        })
        rzpay.open();
    };

    // ─── Date formatter ───────────────────────────────────────────────────────
    const formatDate = (dateTimeString) => {
        const date      = new Date(dateTimeString);
        const day       = date.getDate();
        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const month     = monthNames[date.getMonth()];
        const year      = date.getFullYear();
        const paddedDay = day < 10 ? `0${day}` : day;
        return `${paddedDay}-${month}-${year}`;
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Video Preview Thumbnail ── */}
            <Link
                className={`video-popup-with-text video-popup-wrapper text-center popup-video sidebar-video-hidden mb--15 ${
                    hideOnScroll ? "d-none" : ""
                }`}
                href="javascript:void(0)"
                onClick={() => getvideoOpenData && setShowVideoModal(true)}
            >
                <div className="video-content">
                    <img
                        className="position-relative"
                        src={checkMatchCourses.sImagePath}
                        height={255}
                        width={355}
                        alt={checkMatchCourses.sCourseTitle}
                    />
                    {getvideoOpenData ? (
                        <>
                            <div className="position-to-top">
                <span className="rbt-btn rounded-player-2 with-animation">
                  <span className="play-icon"></span>
                </span>
                            </div>
                            <span className="play-view-text d-block color-white">
                <i className="feather-eye"></i> Preview this batch
              </span>
                        </>
                    ) : null}
                </div>
            </Link>

            {/* ── Video Modal ── */}
            {showVideoModal && (
                <div
                    style={{
                        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                        backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    onClick={() => setShowVideoModal(false)}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "480px",
                            maxWidth: "95vw",
                            border: "3px solid #7c3aed",
                            borderRadius: "14px",
                            overflow: "hidden",
                            boxShadow: "0 8px 40px rgba(124,58,237,0.35)",
                            background: "#000",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button inside top-right corner of the box */}
                        <button
                            onClick={() => setShowVideoModal(false)}
                            style={{
                                position: "absolute", top: "8px", right: "10px",
                                background: "#7c3aed", border: "none",
                                color: "#fff", fontSize: "16px", cursor: "pointer",
                                zIndex: 10, borderRadius: "50%",
                                width: "28px", height: "28px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                lineHeight: 1,
                            }}
                        >
                            <i className="feather-x"></i>
                        </button>

                        {getvideoOpenData && (
                            <Plyr
                                source={{
                                    type: "video",
                                    sources: [
                                        {
                                            src: getvideoOpenData,
                                            provider: getvideoOpenData.includes("youtube.com") || getvideoOpenData.includes("youtu.be")
                                                ? "youtube"
                                                : "html5",
                                        },
                                    ],
                                }}
                                options={{
                                    autoplay: true,
                                    hideControls: false,
                                    resetOnEnd: true,
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
            {/* ── Content ── */}
            <div className="content-item-content">

                {/* Price */}
                <div className="rbt-price-wrapper d-flex flex-wrap align-items-center justify-content-between">
                    <div className="rbt-price flex-wrap">
                        {checkMatchCourses.dAmount === 0 ? (
                            <span className="current-price">Free</span>
                        ) : (
                            <span className="current-price">₹{checkMatchCourses.dAmount}</span>
                        )}
                        {checkMatchCourses.nCourseAmount ? (
                            <span className="off-price">₹{checkMatchCourses.nCourseAmount}</span>
                        ) : null}

                        {/* Promo code discount badge */}
                        <div className="dicount d-block">
              <span className="quantity d-block">
                {getPromoCodeData.discount_type === "amount" && getPromoCodeData.discount !== 0 && (
                    <span className="font-13 text-success m-0">
                    Get ₹{getPromoCodeData.discount} discount in cart
                  </span>
                )}
                  {getPromoCodeData.discount_type === "percentage" && getPromoCodeData.discount !== 0 && (
                      <span className="font-13 text-success m-0">
                    Get {getPromoCodeData.discount}% discount in cart (upto ₹{parseInt(getPromoCodeData.user_pay)})
                  </span>
                  )}
              </span>
                        </div>
                    </div>

                    <div className="discount-time">
            <span className="rbt-badge color-danger bg-color-danger-opacity">
              <i className="feather-clock"></i> {daysLeft} days left!
            </span>
                    </div>
                </div>

                {/* ── Add to Cart / Go to Cart button ── */}
                <div className="add-to-card-button mt--15">
                    {checkMatchCourses.nATId === 4 ? (
                        /* Upcoming batch */
                        <button className="rbt-btn btn-gradient icon-hover w-100 d-block text-center">
              <span className="btn-text">
                Upcoming on {formatDate(checkMatchCourses.sUpcomingDate)}
              </span>
                            <span className="btn-icon">
                <i className="feather-arrow-right"></i>
              </span>
                        </button>
                    ) : (
                        <>
                            {isAlreadyPurchased ? (
                                <button
                                    className="rbt-btn btn-gradient w-100 text-center disabled"
                                    style={{ pointerEvents: "none", opacity: 0.8, background: "linear-gradient(to right, #28a745, #218838)" }}
                                    disabled
                                >
                                    <span data-text="Already Purchased">✓ Already Purchased</span>
                                </button>
                            ) : !isCartItem ? (
                                <button
                                    className={`rbt-btn btn-gradient rbt-switch-y w-100 text-center ${isLoading ? "disabled" : ""}`}
                                    onClick={() => addToCartFun(rawBatchId, checkMatchCourses.dAmount, checkMatchCourses)}
                                    style={{
                                        pointerEvents: isLoading ? "none" : "auto",
                                        opacity: isLoading ? 0.7 : 1,
                                    }}
                                >
                                    {isLoading ? (
                                        <span data-text="Loading...">
                    <i className="fa fa-spinner fa-spin p-0"></i> Loading...
                </span>
                                    ) : (
                                        <span data-text="Add to Cart">Buy Now</span>
                                    )}
                                </button>
                            ) : (
                                isCartId !== "" ? (
                                    <button
                                        className={`rbt-btn btn-gradient rbt-switch-y w-100 text-center ${isLoading ? "disabled" : ""}`}
                                        onClick={() => addToCartFun(rawBatchId, checkMatchCourses.dAmount, checkMatchCourses)}
                                        style={{
                                            pointerEvents: isLoading ? "none" : "auto",
                                            opacity: isLoading ? 0.7 : 1,
                                        }}
                                    >
                                        {isLoading ? (
                                            <span data-text="Loading...">
                        <i className="fa fa-spinner fa-spin p-0"></i> Loading...
                    </span>
                                        ) : (
                                            <span data-text="Go to Cart">Go to Cart</span>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href="/cart"
                                        className="rbt-btn btn-gradient icon-hover w-100 d-block text-center"
                                    >
                                        <span className="btn-text">Go to Cart</span>
                                        <span className="btn-icon">
                    <i className="feather-arrow-right"></i>
                </span>
                                    </Link>
                                )
                            )}
                        </>
                    )}
                </div>

                {/* ── Activity / Practice counts ── */}
                <div
                    className={`rbt-widget-details has-show-more mt--15${toggle ? " active" : ""}`}
                >
                    <ul className="has-show-more-inner-content rbt-course-details-list-wrapper">
                        {[
                            { label: "Activity",           key: "activity_count" },
                            { label: "Activity Questions", key: "activity_question_count" },
                            { label: "Practice",           key: "practice_count" },
                            { label: "Practice Questions", key: "practice_question_count" },
                        ].map(({ label, key }) => (
                            <li key={key} className="d-flex align-items-center">
                                <span>{label}</span>
                                {isApiCall.acttivity === 1 ? (
                                    <span className="rbt-feature-value rbt-badge-5">
                    {getNumberCount[key] ?? 0}
                  </span>
                                ) : (
                                    <Skeleton width="40px" height="20px" />
                                )}
                            </li>
                        ))}
                    </ul>
                    <div
                        className={`rbt-show-more-btn ${toggle ? "active" : ""}`}
                        onClick={() => setToggle(!toggle)}
                    >
                        {!toggle ? "Show More" : "Show Less"}
                    </div>
                </div>

                {/* ── Video / PDF / PPT counts + Inquiry ── */}
                <div className="social-share-wrapper mt--30 text-center">
                    <div className="rbt-post-share d-flex align-items-center justify-content-center">
                        <ul className="social-icon social-default transparent-with-border justify-content-around w-100">
                            {[
                                { label: "VIDEOs", key: "video_count" },
                                { label: "PDFs",   key: "pdf_count"   },
                                { label: "PPTs",   key: "ppt_count"   },
                            ].map(({ label, key }) => (
                                <li key={key}>
                                    {isApiCall.pdfcount === 1 ? (
                                        <>
                                            <Link href="javascript:void(0);">
                                                {getNumberCount[key] ?? 0}
                                            </Link>
                                            <span className="rbt-feature-value rbt-badge-5">{label}</span>
                                        </>
                                    ) : (
                                        <>
                                            <a href="javascript:void(0);">
                                                <Skeleton width="20px" height="20px" />
                                            </a>
                                            <span className="rbt-feature-value rbt-badge-5">
                        <Skeleton width="60px" height="15px" />
                      </span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <hr className="mt--20" />
                    <div className="contact-with-us text-center">
                        <p>For details about the course</p>
                        <button
                            onClick={() => setShowInquiryPopup(true)}
                            className="rbt-badge-2 mt--10 justify-content-center w-100"
                            style={{
                                display: "flex", alignItems: "center",
                                cursor: "pointer", border: "none",
                                background: "transparent", width: "100%", padding: 0,
                            }}
                        >
                            <i className="feather-help-circle mr--5"></i> Inquiry Now
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Inquiry Popup ── */}
            {showInquiryPopup && (
                <InquiryPopup
                    onClose={() => setShowInquiryPopup(false)}
                    courseData={checkMatchCourses}
                />
            )}
        </>
    );
};

export default Viedo;