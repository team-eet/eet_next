import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EncryptData } from "@/components/Services/encrypt-decrypt";

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
    const [getIdArray, setIdArray] = useState([]);

    const getDiscountPercentage = () => {
        let discount = data.coursePrice * ((100 - data.offerPrice) / 100);
        setDiscountPercentage(discount.toFixed(0));
    };

    const getTotalReviews = () => {};
    const getTotalRating = () => {};

    // Compute time difference (same helper as AllBatches)
    const getTimeDifference = (startTime, endTime, days) => {
        if (!startTime || !endTime || !days) return { totalHours: 0, remainingMinutes: 0 };
        days = parseInt(days);
        const isValidTimeFormat = (time) => /^\d{1,2}:\d{2}\s*(am|pm)$/i.test(time);
        if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) return { totalHours: 0, remainingMinutes: 0 };
        const [startHour, startMinute] = startTime.match(/(\d+):(\d+)/).slice(1).map(Number);
        const [endHour, endMinute] = endTime.match(/(\d+):(\d+)/).slice(1).map(Number);
        const startPeriod = startTime.toLowerCase().includes("pm") && startHour !== 12 ? 12 : 0;
        const endPeriod = endTime.toLowerCase().includes("pm") && endHour !== 12 ? 12 : 0;
        const startDate = new Date(0, 0, 0, (startHour % 12) + startPeriod, startMinute);
        const endDate = new Date(0, 0, 0, (endHour % 12) + endPeriod, endMinute);
        let differenceInMs = endDate - startDate;
        if (differenceInMs < 0) differenceInMs += 24 * 60 * 60 * 1000;
        const differenceInMinutes = differenceInMs / (1000 * 60);
        const totalMinutes = differenceInMinutes * days;
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        return { totalHours, remainingMinutes };
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
        setIdArray(EncryptData(courseInfo));
    });

    // Derived values (same logic as AllBatches grid)
    const { totalHours, remainingMinutes } = getTimeDifference(
        data.sBatchStartTime, data.sBatchEndTime, data.batchdays
    );

    let days = [];
    try { days = data.sDays ? JSON.parse(data.sDays) : []; } catch (e) { days = []; }

    // const ratingVal = parseFloat(data.user_rate) || 0;
    // const fullStars = Math.floor(ratingVal);
    // const hasHalf = ratingVal % 1 >= 0.5;

    const startD = data.dBatchStartDate ? new Date(data.dBatchStartDate) : (data.batchstartdatenew ? new Date(data.batchstartdatenew) : null);
    const endD = data.dBatchEndDate ? new Date(data.dBatchEndDate) : null;
    const fmt = (d) => d ? `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}` : '';

    const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    const _encCId = data._encCId || EncryptData(data.nCId);
    const _encTBId = data._encTBId || EncryptData(data.nTBId);



    return (
        <>
            <style>{`
/* ── BatchWidget grid card styles (mirrors AllBatches grid) ── */
.bw-card {
    background: #fff;
    border-radius: 10px;
    border: 0.4px solid #d4d0e8;
    overflow: hidden;
    transition: box-shadow 0.22s ease, transform 0.22s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.bw-card:hover {
    box-shadow: 0 8px 32px rgba(80,60,180,0.35);
    transform: translateY(-2px);
}
.bw-card-img-wrap {
    position: relative;
    width: calc(100% - 20px);
    aspect-ratio: 16 / 9;
    flex-shrink: 0;
    display: block;
    overflow: hidden;
    border: 1px solid #ebebf0;
    border-radius: 12px;
    margin: 10px 10px 0 10px;
}
.bw-card-body {
    padding: 18px 20px 18px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
}
.bw-card-top-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 8px;
}
.bw-stars-row { display: flex; align-items: center; gap: 2px; }
.bw-rating-text { font-size: 12px; color: #888; margin-left: 5px; }

.bw-title { font-size: 16px; font-weight: 700; margin: 0 0 10px; line-height: 1.35; color: #1a1a2e; }
.bw-title a { color: inherit; text-decoration: none; }
.bw-title a:hover { color: #7c3aed; }

.bw-meta-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 12px;
    color: #666;
    margin-bottom: 6px;
}
.bw-meta-item { display: flex; align-items: center; gap: 3px; }
.bw-meta-dot { color: #ccc; }
.bw-date-range { color: #555; }

.bw-day-dots { display: flex; gap: 5px; margin: 10px 0; }
.bw-day-dot {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 600;
}
.bw-day-on  { background: #7c3aed; color: #fff; }
.bw-day-off { background: #f4f4f8; color: #bbb; border: 1px solid #e8e8ee; }

.bw-tutor-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: #555; margin-bottom: 12px; flex-wrap: wrap;
}
.bw-cat-badge {
    background: #ede9fe; color: #5b21b6;
    font-size: 10px; font-weight: 600; padding: 2px 9px;
    border-radius: 20px;
}

/* Lesson / student meta */
.bw-ls-row {
    display: flex; align-items: center; gap: 12px;
    font-size: 12px; color: #666; margin-bottom: 10px; flex-wrap: wrap;
}
.bw-ls-item { display: flex; align-items: center; gap: 4px; }
.bw-card-footer {
  display: flex;
  align-items: stretch;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid #f0eef8;
  margin-top: auto;
  flex-wrap: nowrap;
  width: 100%;
}

.bw-learn-btn {
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 59px;
  padding: 9px 19px;
  font-size: 9px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex: 1 1 50%;         /* each button takes exactly 50% */
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 2px 6px rgba(124, 58, 237, 0.2);
}
.bw-learn-btn:hover {
  background: #6d28d9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.bw-learn-btn:first-child {
  background: #6d28d9;
}

.bw-learn-btn:first-child:hover {
  background: #42c273;
}

/* Progress bar */
.bw-progress-wrap { margin: 10px 0 14px; }
.bw-progress-label {
    font-size: 12px; font-weight: 600; color: #1a1a2e; margin-bottom: 6px;
}
.bw-progress {
    height: 7px; background: #ede9fe; border-radius: 99px; overflow: hidden; position: relative;
}
.bw-progress-bar {
    height: 100%; background: #7c3aed; border-radius: 99px;
    transition: width 0.5s ease;
}
.bw-progress-num {
    font-size: 11px; color: #7c3aed; font-weight: 700;
    margin-top: 3px; display: block; text-align: right;
}
`}</style>

            <div className="bw-card">
                {/* Image */}
                <Link
                    href={_encCId && _encTBId ? `/batch-details/${_encCId}/${_encTBId}` : `/course-details/${data.nCId}`}
                    className="bw-card-img-wrap"
                >
                    <Image
                        src={data.batchimg || data.sImagePath}
                        alt={data.sCourseTitle}
                        fill
                        sizes="(max-width: 630px) 100vw, (max-width: 1250px) 50vw, 33vw"
                        style={{ objectFit: 'cover', objectPosition: 'center center' }}
                    />
                </Link>

                {/* Body */}
                <div className="bw-card-body">


                    {/* 2. Title */}
                    <h4 className="bw-title">
                        <Link href={_encCId && _encTBId ? `/batch-details/${_encCId}/${_encTBId}` : `/course-details/${data.nCId}`}>
                            {data.sCourseTitle}
                        </Link>
                    </h4>

                    {/* 3. Lessons, Students, Duration, Session */}
                    <div className="bw-ls-row">
    <span className="bw-ls-item">
        <i className="feather-book" style={{ fontSize: 13 }} />
        {data.lesson_cnt} Lessons
    </span>
                        <span className="bw-ls-item">
        <i className="feather-users" style={{ fontSize: 13 }} />
                            {data.enroll_cnt} Students
    </span>
                        {data.nBatchDurationDays && (
                            <span className="bw-ls-item">
            <i className="feather-calendar" style={{ fontSize: 13 }} />
                                {data.nBatchDurationDays} Days
        </span>
                        )}
                        {data.sBatchTime && (
                            <span className="bw-ls-item">
            <i className="feather-clock" style={{ fontSize: 13 }} />
                                {data.sBatchTime} min/session
        </span>
                        )}
                    </div>

                    {/* 4. Duration & Hours */}
                    {(data.batchdays || totalHours > 0) && (
                        <div className="bw-meta-row">
                            <span className="bw-meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {data.batchdays} Days
                            </span>
                            <span className="bw-meta-dot">·</span>
                            <span className="bw-meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {totalHours}h {remainingMinutes}m
                            </span>
                        </div>
                    )}

                    {/* 5. Date Range & Time */}
                    {startD && endD && (
                        <div className="bw-meta-row">
        <span className="bw-meta-item bw-date-range">
            {fmt(startD)} – {fmt(endD)}
            {(data.sBatchStartTime || data.sBatchEndTime) && (
                <> | {data.sBatchStartTime} – {data.sBatchEndTime}</>
            )}
        </span>
                        </div>
                    )}
                    {/* 6. Day Dots */}
                    {days.length > 0 && (
                        <div className="bw-day-dots">
                            {WEEK.map((day, i) => (
                                <div key={i} className={`bw-day-dot ${days.includes(day) ? 'bw-day-on' : 'bw-day-off'}`}>
                                    {LABELS[i]}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 7. Tutor & Category */}
                    {(data.sFName || data.sCategory || data.sLevel) && (
                        <div className="bw-tutor-row">
                            {(data.sFName || data.sLName) && (
                                <span>Tutor: <strong>{data.sFName} {data.sLName}</strong></span>
                            )}
                            {data.sCategory && <span className="bw-cat-badge">{data.sCategory}</span>}
                            {data.sLevel && <span className="bw-level-badge">{data.sLevel}</span>}
                        </div>
                    )}

                    {/* 8. Progress Bar (retained from original) */}
                    {isProgress && (
                        <div className="bw-progress-wrap">
                            <div className="bw-progress-label">Progress</div>
                            <div className="bw-progress">
                                <div
                                    className="bw-progress-bar"
                                    style={{ width: isCompleted ? '100%' : `${data.progressValue || 0}%` }}
                                />
                            </div>
                            <span className="bw-progress-num">
                                {isCompleted ? '100' : (data.progressValue || 0)}%
                            </span>
                        </div>
                    )}

                    {/* 9. Footer */}
                    <div className="bw-card-footer" style={isProgress ? { justifyContent: 'flex-end', flexWrap: 'nowrap' } : {}}>
                        {/* View Batch button (retained from original) */}
                        {isProgress && (
                            <>
                                <Link
                                    className="bw-learn-btn"
                                    href={_encCId && _encTBId ? `/batch-details/${_encCId}/${_encTBId}` : `/course-details/${data.nCId}`}
                                    style={{ background: '#5b21b6' }}
                                >
                                    View Batch →
                                </Link>
                                <Link
                                    className="bw-learn-btn"
                                    href={`/courselesson/${getIdArray}`}
                                >
                                    Continue Learning →
                                </Link>
                            </>
                        )}
                        {/* Register Now for non-progress cards */}
                        {!isProgress && (
                            <Link
                                className="bw-learn-btn"
                                href={_encCId && _encTBId ? `/batch-details/${_encCId}/${_encTBId}` : `/course-details/${data.nCId}`}
                            >
                                Register Now →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BatchWidget;