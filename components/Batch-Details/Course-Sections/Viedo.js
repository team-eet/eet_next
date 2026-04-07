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

const MySwal = withReactContent(Swal);

const Viedo = ({ checkMatchCourses }) => {
    console.log("Batch Data Check", checkMatchCourses);

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

    // ─── Redux / Context ──────────────────────────────────────────────────────
    const dispatch               = useDispatch();
    const { cart }               = useSelector((state) => state.CartReducer);
    const { cartToggle, setCart } = useAppContext();

    // ─── Days left until batch starts ─────────────────────────────────────────
    const nowDate          = new Date();
    const dBatchStartDate  = new Date(checkMatchCourses.dBatchStartDate);
    nowDate.setHours(0, 0, 0, 0);
    dBatchStartDate.setHours(0, 0, 0, 0);
    const timeDifference   = dBatchStartDate - nowDate;
    const daysLeft         = Math.max(0, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) - 1);

    // ─── Fetch feature counts ─────────────────────────────────────────────────
    const getFeatureCount = () => {
        const url         = window.location.href;
        const parts       = url.split("/");
        const batchId     = parts[parts.length - 1];   // encrypted batch id
        const courseMainId = parts[parts.length - 2];  // encrypted course main id

        console.log("batchId:", batchId, "courseMainId:", courseMainId);

        // Activity count
        Axios.get(`${API_URL}/api/package/Show_activity_count/${EncryptData(parseInt(batchId))}`, {
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
            Axios.get(`${API_URL}/api/package/Show_video_count/${EncryptData(parseInt(batchId))}`, {
                headers: { ApiKey: `${API_KEY}` },
            }),
            Axios.get(`${API_URL}/api/package/Show_pdf_count/${EncryptData(parseInt(batchId))}`, {
                headers: { ApiKey: `${API_KEY}` },
            }),
        ])
            .then(
                Axios.spread((batchRes, videoRes, pdfRes) => {
                    const batchData     = batchRes.data.length !== 0 ? batchRes.data[0] : {};
                    const videoUrlCount = videoRes.data.length !== 0 ? videoRes.data[0].cntf || 0 : 0;
                    const pdfUrlCount   = pdfRes.data.length !== 0  ? pdfRes.data[0].cntf  || 0 : 0;

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

    // ─── Check if batch already in cart ──────────────────────────────────────
    const getCartItem = () => {
        if (localStorage.getItem("userData")) {
            const udata   = DecryptData(localStorage.getItem("userData"));
            // Use the encrypted batchId from the URL (rawBatchId)
            const batchId = rawBatchId;

            Axios.get(
                `${API_URL}/api/cart/GetCartItemCourse/${udata["regid"]}/${batchId}`,
                { headers: { ApiKey: `${API_KEY}` } }
            )
                .then((res) => {
                    console.log("Cart check for batch:", res.data);
                    if (res.data && Array.isArray(res.data)) {
                        if (res.data.length > 0 && EncryptData(res.data[0].cid) === batchId) {
                            setisCartItem(true);
                            setisCartId(EncryptData(res.data[0].nCartId));
                        } else {
                            setisCartId(EncryptData(0));
                        }
                    } else {
                        setisCartId(EncryptData(0));
                    }
                })
                .catch((err) => ErrorDefaultAlert(err));
        }

        // Scroll listener
        const handleScroll = () => {
            setHideOnScroll(window.pageYOffset > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    };

    // ─── Promo code details ───────────────────────────────────────────────────
    const getPromocodeDetails = () => {
        const encryptedData = localStorage.getItem("userData");
        const getamt        = parseInt(checkMatchCourses.dAmount) || 0;
        const batchId       = rawBatchId;

        if (encryptedData) {
            const udatas = DecryptData(encryptedData);
            Axios.get(
                `${API_URL}/api/promocode/Get_promocode_detail/${batchId}/${udatas["regid"]}/${EncryptData(getamt)}`,
                { headers: { ApiKey: `${API_KEY}` } }
            )
                .then((res) => {
                    if (res.data && res.data.length !== 0) {
                        const resData = JSON.parse(res.data);
                        setPromoCodeData(resData);
                        console.log("promoCode", resData);
                    }
                })
                .catch((err) => {
                    console.log("promoCode err", err);
                    ErrorDefaultAlert(err);
                });
        }
    };

    // ─── useEffect ────────────────────────────────────────────────────────────
    useEffect(() => {
        getFeatureCount();
        dispatch({ type: "COUNT_CART_TOTALS" });
        localStorage.setItem("eetData", JSON.stringify(cart));
        localStorage.setItem("cart", JSON.stringify(cart));
        getCartItem();
        getPromocodeDetails();

        // Video preview source
        if (checkMatchCourses.sVideoURL && checkMatchCourses.sVideoURL !== "") {
            setvideoOpenData(checkMatchCourses.sVideoURL);
        } else if (checkMatchCourses.sVideoPath && checkMatchCourses.sVideoPath !== "") {
            setvideoOpenData(checkMatchCourses.sVideoPath);
        } else {
            setvideoOpenData("");
        }
    }, [rawBatchId]);

    useEffect(() => {
        if (!cartToggle) {
            setIsLoading(false);
        }
    }, [cartToggle]);

    // ─── Add to Cart ──────────────────────────────────────────────────────────
    const addToCartFun = (batchId, amount, product) => {
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

        // User is logged in — proceed
        dispatch(addToCartAction(batchId, amount, product));

        let cartitemcnt = 0;
        if (localStorage.getItem("cart")) {
            const str_arr = JSON.parse(localStorage.getItem("cart"));
            if (str_arr.length !== 0) cartitemcnt = str_arr.length;
        }

        Axios.get(`${API_URL}/api/companySettings/FillCompanySettings`, {
            headers: { ApiKey: `${API_KEY}` },
        })
            .then((res) => {
                if (res.data.length !== 0) {
                    const maximumItemCart = res.data[0]["nMaximumItemCart"];

                    if (maximumItemCart >= cartitemcnt + 1) {
                        setisCartItem(true);

                        const getamt = parseInt(checkMatchCourses.dAmount) || 0;
                        const udata  = DecryptData(localStorage.getItem("userData"));

                        Axios.get(
                            `${API_URL}/api/promocode/Get_promocode_detail/${batchId}/${udata["regid"]}/${EncryptData(getamt)}`,
                            { headers: { ApiKey: `${API_KEY}` } }
                        )
                            .then((res) => {
                                if (res.data && res.data.length !== 0) {
                                    const resData = JSON.parse(res.data);
                                    const cnewamt = checkMatchCourses.dAmount ? String(checkMatchCourses.dAmount) : "0";

                                    // ── INSERT (new cart entry) ──────────────────────────────
                                    if (DecryptData(isCartId) === 0) {
                                        const insert_arr = {
                                            nCartId:          EncryptData(0),
                                            nRegId:           udata["regid"],
                                            cid:              batchId,
                                            cname:            checkMatchCourses.sCourseTitle,
                                            fname:            checkMatchCourses.sFName,
                                            lname:            checkMatchCourses.sLName,
                                            camt:             String(checkMatchCourses.nCourseAmount || 0),
                                            cnewamt:          cnewamt,
                                            pkgprice:         String(checkMatchCourses.pkg_price || 0),
                                            isaccosiatecourse: checkMatchCourses.bIsAccosiateCourse || "no",
                                            cimg:             checkMatchCourses.sImagePath,
                                            pkgId:            EncryptData(0),
                                            pkgname:          "",
                                            PCId:             resData.pcid,
                                            promocode:        resData.promocode,
                                            dDiscount:        resData.discount,
                                            isBatch:          true,               // <── batch flag
                                            nTBId:            EncryptData(checkMatchCourses.nTBId), // <── batch specific
                                            batchID: resData.batchId
                                        };

                                        console.log("batch insert_arr", insert_arr);

                                        Axios.post(
                                            `${API_URL}/api/cart/InsertCart`,
                                            JSON.stringify(insert_arr),
                                            {
                                                headers: {
                                                    ApiKey:         `${API_KEY}`,
                                                    "Content-Type": "application/json",
                                                },
                                            }
                                        )
                                            .then((res) => {
                                                const retData = JSON.parse(res.data);
                                                console.log("InsertCart retData", retData);

                                                if (retData.success === "1") {
                                                    // Update localStorage cart
                                                    let genCart_arr = [];
                                                    if (localStorage.getItem("cart")) {
                                                        const gitem = JSON.parse(localStorage.getItem("cart"));
                                                        if (gitem.length !== 0) genCart_arr = [...gitem];
                                                    }
                                                    genCart_arr.push(insert_arr);
                                                    localStorage.setItem("cart", JSON.stringify(genCart_arr));
                                                    setisCartId(EncryptData(retData.nCartId || 0));
                                                    setCart(!cartToggle);
                                                } else if (retData.success === "0") {
                                                    ErrorDefaultAlert(retData);
                                                }
                                            })
                                            .catch((err) => {
                                                console.log("InsertCart err", err);
                                                ErrorDefaultAlert(JSON.stringify(err.response));
                                            });

                                        // ── UPDATE (existing cart entry) ──────────────────────────
                                    } else {
                                        const update_arr = {
                                            nCartId:          isCartId,
                                            nRegId:           udata["regid"],
                                            cid:              batchId,            // <── batch id (encrypted)
                                            cname:            checkMatchCourses.sCourseTitle,
                                            fname:            checkMatchCourses.sFName,
                                            lname:            checkMatchCourses.sLName,
                                            camt:             checkMatchCourses.nCourseAmount || 0,
                                            cnewamt:          cnewamt,
                                            pkgprice:         checkMatchCourses.pkg_price || 0,
                                            isaccosiatecourse: checkMatchCourses.bIsAccosiateCourse || "no",
                                            cimg:             checkMatchCourses.sImagePath,
                                            pkgId:            EncryptData(0),
                                            pkgname:          "",
                                            PCId:             resData.pcid,
                                            promocode:        resData.promocode,
                                            dDiscount:        resData.discount,
                                            isBatch:          true,
                                            nTBId:            EncryptData(checkMatchCourses.nTBId),
                                            batchID: resData.batchId
                                        };

                                        console.log("batch update_arr", update_arr);

                                        Axios.post(
                                            `${API_URL}/api/cart/InsertCart`,
                                            update_arr,
                                            { headers: { ApiKey: `${API_KEY}` } }
                                        )
                                            .then((res) => {
                                                const retData = JSON.parse(res.data);

                                                if (retData.success === "1") {
                                                    delete update_arr["nCartId"];
                                                    let genCart_arr = [];
                                                    if (localStorage.getItem("cart")) {
                                                        const gitem = JSON.parse(localStorage.getItem("cart"));
                                                        if (gitem.length !== 0) genCart_arr = [...gitem];
                                                    }
                                                    genCart_arr.push(update_arr);
                                                    localStorage.setItem("cart", JSON.stringify(genCart_arr));
                                                    setCart(!cartToggle);
                                                } else if (retData.success === "0") {
                                                    ErrorAlert(retData);
                                                }
                                            })
                                            .catch((err) => {
                                                console.log("UpdateCart err", err);
                                                ErrorDefaultAlert(JSON.stringify(err.response));
                                            });
                                    }
                                }
                            })
                            .catch((err) => {
                                console.log("promoCode err", err);
                                ErrorDefaultAlert(err);
                            });
                    }
                }
            })
            .catch((err) => {
                console.log("CompanySettings err", err);
                ErrorDefaultAlert(err);
            });
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
                        backgroundColor: "rgba(0,0,0,0.8)", zIndex: 9999,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    onClick={() => setShowVideoModal(false)}
                >
                    <div
                        style={{ width: "70%", maxWidth: "800px", position: "relative" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowVideoModal(false)}
                            style={{
                                position: "absolute", top: "-40px", right: "0",
                                background: "transparent", border: "none",
                                color: "#fff", fontSize: "28px", cursor: "pointer", zIndex: 10,
                            }}
                        >
                            <i className="feather-x"></i>
                        </button>
                        <Plyr
                            source={{ type: "video", sources: [{ src: getvideoOpenData }] }}
                            options={{ autoplay: true }}
                        />
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
                            {!isCartItem ? (
                                /* Not yet in cart → Add to Cart */
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
                                        <span data-text="Add to Cart">Add to Cart</span>
                                    )}
                                </button>
                            ) : (
                                /* Already in cart → Go to Cart */
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