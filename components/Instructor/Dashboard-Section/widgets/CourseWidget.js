import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {EncryptData} from "@/components/Services/encrypt-decrypt";

const CourseWidget = ({
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
  const [getIdArray, setIdArray] = useState([]);

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
    const courseInfo = {
      nACId: data.nACId,
      nMId: data.nMId,
      nCLId: data.nCLId,
      mode: EncryptData('N'),
      nCId: data.nCId,
    };
    setIdArray(EncryptData(courseInfo))

  });

  return (
    <>
      {}
      <div className="rbt-card variation-01 rbt-hover">
        <div className="rbt-card-img">
          {/*<Link href={`/courselesson/${EncryptData(data.nCId)}/${EncryptData(data.nMId)}/${EncryptData(data.nCLId)}`}>*/}
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
        </div>
        <div className="rbt-card-body">
          {courseStyle === "two" && (
            <>
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
              </div>
              <h4 className="rbt-card-title">
                {/*<Link*/}
                {/*    href={`/courselesson/${EncryptData(data.nACId)}/${EncryptData(data.nMId)}/${EncryptData(data.nCLId)}/${EncryptData('N')}/${EncryptData((data.nCId))}`}>{data.sCourseTitle}</Link>*/}
                {data.sCourseTitle}
              </h4>
            </>
          )}
          <ul className="rbt-meta">
            <li>
              <i className="feather-book"/>
              {data.lesson_cnt} Lessons
            </li>
            <li>
              <i className="feather-book"/>
              {data.section_cnt} Students
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
                  href={`/courselesson/${getIdArray}`}
                >
                  View Course
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

export default CourseWidget;
