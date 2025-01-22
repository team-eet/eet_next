import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import 'react-loading-skeleton/dist/skeleton.css'
import Skeleton from "react-loading-skeleton";

const CourseBreadcrumb = ({ getMatchCourse }) => {
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    if (getMatchCourse.length !== 0) {
      setisLoading(false);
    }
  }, [getMatchCourse]);
  // console.log(getMatchCourse)
  // const formattedDate = `${getMatchCourse.dUpdatedDate.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
  const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
  }
  // Function to calculate time difference
  // const sBatchStartTime = getMatchCourse.sBatchStartTime;
  // const sBatchEndTime = getMatchCourse.sBatchEndTime;
  // const sBatchStartTime = "12:30pm";
  // const sBatchEndTime = "13:45pm";

// Function to calculate time difference
  console.log("Time",getMatchCourse.sBatchStartTime,getMatchCourse.sBatchEndTime,getMatchCourse.nBatchDurationDays)
//   const TimeDurationCalculator = () => {
    const sBatchStartTime = "09:30am";
    const sBatchEndTime = "10:45am";
    const nBatchDurationDays = 10;
//     const sBatchStartTime = getMatchCourse.sBatchStartTime;
//     const sBatchEndTime = getMatchCourse.sBatchEndTime;
//     const nBatchDurationDays = getMatchCourse.nBatchDurationDays;

  const getTimeDifference = (startTime, endTime) => {
      // Match hours and minutes
      const [startHour, startMinute] = startTime.match(/(\d+):(\d+)/).slice(1).map(Number);
      const [endHour, endMinute] = endTime.match(/(\d+):(\d+)/).slice(1).map(Number);

      // Determine AM/PM
      const startPeriod = startTime.includes("pm") ? 12 : 0;
      const endPeriod = endTime.includes("pm") ? 12 : 0;

      // Convert to Date objects
      const startDate = new Date(0, 0, 0, (startHour % 12) + startPeriod, startMinute);
      const endDate = new Date(0, 0, 0, (endHour % 12) + endPeriod, endMinute);

      // Calculate difference in minutes
      const differenceInMs = endDate - startDate;
      const differenceInMinutes = differenceInMs / (1000 * 60);

      const hours = Math.floor(differenceInMinutes / 60);
      const minutes = differenceInMinutes % 60;

      return { hours, minutes };
    };

    const calculateTotalDuration = (startTime, endTime, days) => {
      const { hours, minutes } = getTimeDifference(startTime, endTime);

      // Multiply hours and minutes by the number of days
      const totalHours = hours * days;
      const totalMinutes = minutes * days;

      // Adjust total hours by converting minutes to hours
      const adjustedHours = totalHours + Math.floor(totalMinutes / 60);
      const adjustedMinutes = totalMinutes % 60;

      return { adjustedHours, adjustedMinutes };
    };


    const totalDuration = calculateTotalDuration(sBatchStartTime, sBatchEndTime, nBatchDurationDays);
    // console.log("totalDuration",totalDuration)
  // };
console.log(`${totalDuration.adjustedHours}:  hour(s) and ${totalDuration.adjustedMinutes} minutes`);

  console.log('getMatchCourse', getMatchCourse)
  return (
    <>
      <div className="col-lg-8">
        <div className="content text-start">
            {
                isLoading ?
                    <>
                        <Skeleton width={150}/>
                        <h2 className="title">
                            <Skeleton width={600}/>
                        </h2>
                        <p className="description">
                            <Skeleton height={20} width={"100%"}/>
                            <Skeleton height={20} width={"100%"}/>
                            <Skeleton height={20} width={"100%"}/>
                            <Skeleton height={20} width={"100%"}/>
                            <Skeleton height={20} width={"60%"}/>
                        </p>
                        <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
                            {/* Skeleton for the Best Seller badge */}
                            <div className="feature-sin best-seller-badge">
                                <Skeleton width={100} height={25}/>
                            </div>

                            {/* Skeleton for the star ratings */}
                            <div className="feature-sin rating d-flex">
                                {Array.from({length: 5}).map((_, index) => (
                                    <div key={index} className="me-2">
                                        <Skeleton circle={true} width={20} height={20}/>
                                    </div>
                                ))}
                            </div>

                            {/* Skeleton for the total rating */}
                            <div className="feature-sin total-rating">
                                <Skeleton width={70} height={25}/>
                            </div>
                        </div>
                        <div className="rbt-author-meta mb--20 d-flex align-items-center">
                            <div className="rbt-avater me-3">
                                <Skeleton circle={true} width={40} height={40}/>
                            </div>
                            <div className="rbt-author-info d-flex ">
                                <Skeleton width={120} height={20}/>
                                <Skeleton width={180} height={20} className={'ml--10'}/>
                            </div>
                        </div>
                        <ul className="rbt-meta d-flex flex-column">
                            {/* Skeleton for Batch Duration */}
                            <li className={'d-flex'}>
                                <Skeleton width={150} height={15} className={'mr--10'}/>
                                <Skeleton width={150} height={15}/>
                            </li>
                            <li className={'d-flex'}>
                                <Skeleton width={200} height={15} className={'mr--10'}/>
                                <Skeleton width={150} height={15}/>
                            </li>
                            <li className={'d-flex'}>
                                <Skeleton width={150} height={15} className={'mr--10'}/>
                                <Skeleton width={150} height={15}/>
                            </li>


                            {/* Skeleton for Circle Badges */}
                            <li>
                                <div className="d-flex mt-1 mb-5 mt-2">
                                    {[...Array(7)].map((_, index) => (
                                        <div key={index} className="me-2">
                                            <Skeleton circle={true} width={30} height={30}/>
                                        </div>
                                    ))}
                                </div>
                            </li>
                        </ul>

                    </>
                    :
                    <>
                        <ul className="page-list">
                            <li className="rbt-breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <div className="icon-right">
                                    <i className="feather-chevron-right"></i>
                                </div>
                            </li>
                            <li className="rbt-breadcrumb-item active">
                                {/*{getMatchCourse.sCategory}*/}
                                Batches
                            </li>
                        </ul>
                        <div className="d-block d-md-flex">
                            <div className="rbt-category mb--10 mb_md--0 order-1 order-md-2">
                                <Link href="#">{getMatchCourse.sCategory}</Link>
                            </div>
                            <h4 className="rbt-card-title order-2 order-md-1 mr--10">{getMatchCourse.sCourseTitle}</h4>
                        </div>


                        <p className="description">{getMatchCourse.sShortDesc}</p>

                        <div className="d-flex align-items-center mb--20 flex-wrap rbt-course-details-feature">
                            <div className="feature-sin best-seller-badge">
              <span className="rbt-badge-2">
                <span className="image">
                  {/*{getMatchCourse.awardImg && (*/}
                    {/*  <Image*/}
                    {/*    src={getMatchCourse.awardImg}*/}
                    {/*    width={30}*/}
                    {/*    height={30}*/}
                    {/*    alt="Best Seller Icon"*/}
                    {/*  />*/}
                    {/*)}*/}
                </span>
               Best Seller
              </span>
                            </div>

                            <div className="feature-sin rating">
                                <Link href="#">{getMatchCourse.star}</Link>
                                <Link href="#">
                                    <i className="fa fa-star"></i>
                                </Link>
                                <Link href="#">
                                    <i className="fa fa-star"></i>
                                </Link>
                                <Link href="#">
                                    <i className="fa fa-star"></i>
                                </Link>
                                <Link href="#">
                                    <i className="fa fa-star"></i>
                                </Link>
                                <Link href="#">
                                    <i className="fa fa-star"></i>
                                </Link>
                            </div>

                            <div className="feature-sin total-rating">
                                <Link className="rbt-badge-4" href="#">
                                    {getMatchCourse.user_rate_cnt} rating
                                </Link>
                            </div>

                        </div>

                        <div className="rbt-author-meta mb--20">
                            <div className="rbt-avater">
                                {/*<Link href={`/profile/${getMatchCourse.id}`}>*/}
                                <Link href={``}>
                                    {getMatchCourse.sProfilePhotoPath && (
                                        <Image className={"position-relative"} src={getMatchCourse.sProfilePhotoPath}
                                               width={40}
                                               height={40}></Image>
                                        // <Image
                                        //   width={40}
                                        //   height={40}
                                        //   src={getMatchCourse.userImg}
                                        //   alt={getMatchCourse.userName}
                                        // />
                                    )}
                                </Link>
                            </div>
                            <div className="rbt-author-info">
                                Batch By{" "}
                                <Link href={`/profile/${getMatchCourse.id}`}>
                                    {getMatchCourse.sFName} {getMatchCourse.sLName}
                                </Link>{" "}
                            </div>
                        </div>

                        <ul className="rbt-meta d-flex flex-column">
                            <li>
                                <b><i className="feather-watch"></i>Batch Duration{": "}</b>
                                {getMatchCourse.nBatchDurationDays} Days
                                ({totalDuration.adjustedHours} Hours {totalDuration.adjustedMinutes} Minutes)
                            </li>
                            <li>
                                <b><i className="feather-calendar"></i>Batch Date{": "}</b>
                                <span
                                    className={'mr-2'}>{new Date(getMatchCourse.dBatchStartDate).getDate()} {new Date(getMatchCourse.dBatchStartDate).toLocaleString('default', {month: 'short'})} - {new Date(getMatchCourse.dBatchEndDate).getDate()} {new Date(getMatchCourse.dBatchEndDate).toLocaleString('default', {month: 'short'})}</span>
                            </li>
                            <li>
                                <b><i className="feather-clock"></i>Batch Time{": "}</b>
                                <span
                                    className={'ms-2'}>{getMatchCourse.sBatchStartTime} to {getMatchCourse.sBatchEndTime}</span>
                            </li>
                            <li>
                                <div className='d-flex mt-1 mb-5 mt-2'>
                                    {getMatchCourse.sDays && getMatchCourse.sDays !== 'undefined' ? (
                                        JSON.parse(getMatchCourse.sDays).find(obj => obj === 'Monday') ? (
                                            <div className='circle-fill-badge'><span>M</span></div>
                                        ) : (
                                            <div className='circle-badge'><span>M</span></div>
                                        )
                                    ) : (
                                        <div className='circle-badge'><span>M</span></div> // or handle the fallback case
                                    )}


                                    {
                                        getMatchCourse.sDays && getMatchCourse.sDays !== 'undefined' ? (
                                            JSON.parse(getMatchCourse.sDays).find(obj => obj === 'Tuesday') ? (
                                                <div className='circle-fill-badge'><span>T</span></div>
                                            ) : (
                                                <div className='circle-badge'><span>T</span></div>
                                            )
                                        ) : (
                                            <div className='circle-badge'><span>T</span></div> // Fallback case when sDays is invalid
                                        )
                                    }

                                    {
                                        getMatchCourse.sDays && getMatchCourse.sDays !== 'undefined' ? (
                                            JSON.parse(getMatchCourse.sDays).find(obj => obj === 'Wednesday') ? (
                                                <div className='circle-fill-badge'><span>W</span></div>
                                            ) : (
                                                <div className='circle-badge'><span>W</span></div>
                                            )
                                        ) : (
                                            <div className='circle-badge'><span>W</span></div> // Fallback case when sDays is invalid
                                        )
                                    }


                                    {
                                        getMatchCourse.sDays && getMatchCourse.sDays !== 'undefined' ? (
                                            JSON.parse(getMatchCourse.sDays).find(obj => obj === 'Thursday') ? (
                                                <div className='circle-fill-badge'><span>T</span></div>
                                            ) : (
                                                <div className='circle-badge'><span>T</span></div>
                                            )
                                        ) : (
                                            <div className='circle-badge'><span>T</span></div> // Fallback case when sDays is invalid
                                        )
                                    }


                                    {
                                        getMatchCourse.sDays && getMatchCourse.sDays !== 'undefined' ? (
                                            JSON.parse(getMatchCourse.sDays).find(obj => obj === 'Friday') ? (
                                                <div className='circle-fill-badge'><span>F</span></div>
                                            ) : (
                                                <div className='circle-badge'><span>F</span></div>
                                            )
                                        ) : (
                                            <div className='circle-badge'><span>F</span></div> // Fallback case when sDays is invalid
                                        )
                                    }

                                    {
                                        getMatchCourse.sDays && getMatchCourse.sDays !== 'undefined' ? (
                                            JSON.parse(getMatchCourse.sDays).find(obj => obj === 'Saturday') ? (
                                                <div className='circle-fill-badge'><span>S</span></div>
                                            ) : (
                                                <div className='circle-badge'><span>S</span></div>
                                            )
                                        ) : (
                                            <div className='circle-badge'><span>S</span></div> // Fallback case when sDays is invalid
                                        )
                                    }


                                    {
                                        getMatchCourse.sDays && getMatchCourse.sDays !== 'undefined' ? (
                                            JSON.parse(getMatchCourse.sDays).find(obj => obj === 'Sunday') ? (
                                                <div className='circle-fill-badge'><span>S</span></div>
                                            ) : (
                                                <div className='circle-badge'><span>S</span></div>
                                            )
                                        ) : (
                                            <div className='circle-badge'><span>S</span></div> // Fallback case when sDays is invalid
                                        )
                                    }


                                </div>
                            </li>
                        </ul>
                    </>
                    }

                    </div>
                </div>
                </>
                );
            };

            export default CourseBreadcrumb;
