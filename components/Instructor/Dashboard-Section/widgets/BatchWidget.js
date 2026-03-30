import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const BatchWidget = ({
                          data,
                          courseStyle,
                          showDescription,
                          showAuthor,
                          isProgress,
                          isCompleted,
                          isEdit,
                      }) => {
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [totalReviews, setTotalReviews] = useState("");
    const [rating, setRating] = useState("");

    const getDiscountPercentage = () => {
        let discount = data.coursePrice * ((100 - data.offerPrice) / 100);
        setDiscountPercentage(discount.toFixed(0));
    };

    const getTotalReviews = () => {
        // let reviews =
        //   data.reviews.oneStar +
        //   data.reviews.twoStar +
        //   data.reviews.threeStar +
        //   data.reviews.fourStar +
        //   data.reviews.fiveStar;
        // setTotalReviews(reviews);
    };

    const getTotalRating = () => {
        // let ratingStar = data.rating.average;
        // setRating(ratingStar.toFixed(0));
    };

    useEffect(() => {
        getDiscountPercentage();
        getTotalReviews();
        getTotalRating();
    });

    return (
        <>
            <div className="rbt-card variation-01 rbt-hover">
                <div className="rbt-card-img">
                    <Link href={`/course-details/${data.nCId}`}>
                        <img
                            width={330}
                            height={227}
                            src={data.sImagePath}
                            alt={data.sCourseTitle}
                        />
                        {/*<div className="rbt-badge-3 bg-white">*/}
                        {/*  <span>{`-${discountPercentage}%`}</span>*/}
                        {/*  <span>Off</span>*/}
                        {/*</div>*/}
                    </Link>
                </div>
                <div className="rbt-card-body">
                    {courseStyle === "two" && (
                        <>
                            <div className="rbt-card-top">
                                <div className="rbt-review">
                                    <span className="rating-count">({data.user_rate_cnt} Reviews)</span>
                                </div>
                                <div className="rbt-bookmark-btn">
                                    <Link className="rbt-round-btn" title="Bookmark" href="#">
                                        <i className="feather-bookmark" />
                                    </Link>
                                </div>
                            </div>
                            <h4 className="rbt-card-title">
                                <Link href={`/course-details/${data.nCId}`}>{data.sCourseTitle}</Link>
                            </h4>
                        </>
                    )}
                    <ul className="rbt-meta">
                        <li>
                            <i className="feather-book" />
                            {data.lesson_cnt} Lessons
                        </li>
                        <li>
                            <i className="feather-users" />
                            {data.enroll_cnt} Students
                        </li>
                    </ul>

                    {isProgress ? (
                        <>
                            <div className="rbt-progress-style-1 mb--20 mt--10">
                                <div className="single-progress">
                                    <h6 className="rbt-title-style-2 mb--10">Complete</h6>
                                    {isCompleted ? (
                                        <div className="progress">
                                            <div
                                                className="progress-bar wow fadeInLeft bar-color-success"
                                                data-wow-duration="0.5s"
                                                data-wow-delay=".3s"
                                                role="progressbar"
                                                style={{ width: `100%` }}
                                                aria-valuenow={100}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            ></div>
                                            <span className="rbt-title-style-2 progress-number">
                        100%
                      </span>
                                        </div>
                                    ) : (
                                        <div className="progress">
                                            <div
                                                className="progress-bar wow fadeInLeft bar-color-success"
                                                data-wow-duration="0.5s"
                                                data-wow-delay=".3s"
                                                role="progressbar"
                                                style={{ width: `${data.progressValue}%` }}
                                                aria-valuenow={data.progressValue}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            ></div>
                                            <span className="rbt-title-style-2 progress-number">
                        {data.progressValue}%
                      </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="rbt-card-bottom">
                                <Link
                                    className="rbt-btn btn-sm bg-primary-opacity w-100 text-center"
                                    href="#"
                                >
                                   View Batch
                                </Link>
                            </div>
                        </>
                    ) : (
                        ""
                    )}


                </div>
            </div>
        </>
    );
};

export default BatchWidget;
