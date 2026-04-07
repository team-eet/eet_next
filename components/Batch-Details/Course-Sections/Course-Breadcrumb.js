import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

/* ─────────────────────────────────────────────
   FIXED TEXT SIZE ISSUES
   Changes made:
   1. Increased breadcrumb text size
   2. Enhanced category tag text size and padding
   3. Adjusted title size for better visibility
   4. Fixed description text size to be readable
   5. Increased badge and rating text sizes
   6. Improved instructor section text hierarchy
   7. Enhanced info card text sizes
   8. Fixed days section text size
───────────────────────────────────────────── */
const styles = `
  /* ── Breadcrumb nav - FIXED SIZE ── */
  .cb-breadcrumb {
    display: flex;
    align-items: center;
    gap: 7px;
    list-style: none;
    padding: 0;
    margin: 0 0 2px;
    font-size: 1rem;
    font-weight: 500;
    opacity: 0.8;
  }
  .cb-breadcrumb a { 
    text-decoration: none;
    transition: opacity 0.2s;
    font-size: 1.7rem;
  }
  .cb-breadcrumb a:hover { opacity: 0.9; }
  .cb-breadcrumb .sep { opacity: 0.5; font-size: 1.7rem; }

  /* ── Category + Title block - FIXED SIZE ── */
  .cb-category-tag {
    display: inline-block;
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    background: rgba(var(--rbt-primary-rgb, 80,120,255), 0.1);
    color: var(--rbt-primary, #5078ff);
    border: 1px solid rgba(var(--rbt-primary-rgb, 80,120,255), 0.2);
  }
  .cb-title {
    font-size: clamp(2.1rem, 4vw, 2.1rem);
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 10px;
    letter-spacing: -0.02em;
  }
  .cb-description {
    font-size: 1.9rem;
    line-height: 1.5;
    opacity: 0.85;
    margin: 0 0 12px;
    max-width: 720px;
  }

  /* ── Badges row - FIXED SIZE ── */
  .cb-badges-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 11px;
    margin-bottom: 8px;
    padding-bottom: 1px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .cb-badge-bestseller {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 8px 20px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: #fff;
    box-shadow: 0 2px 10px rgba(245,158,11,0.3);
  }
  .cb-badge-bestseller svg { width: 18px; height: 18px; }

  .cb-rating-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cb-star-score {
    font-size: 2.2rem;
    font-weight: 800;
    color: #f59e0b;
  }
  .cb-stars {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .cb-stars i { 
    font-size: 1.8rem;
    color: #f59e0b; 
  }
  .cb-rating-count {
    font-size: 1.8rem;
    font-weight: 600;
    opacity: 0.85;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .cb-rating-count:hover { opacity: 1; }

  /* ── Instructor row - FIXED SIZE ── */
  .cb-instructor {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 22px;
    padding: 10px 0;
  }
  .cb-avatar {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(var(--rbt-primary-rgb,80,120,255),0.3);
    flex-shrink: 0;
    transition: border-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}
  .cb-avatar:hover { border-color: var(--rbt-primary, #5078ff); }
  .cb-avatar img { object-fit: cover; }
  .cb-instructor-info {
    flex: 1;
  }
  .cb-instructor-label {
    font-size: 1.7rem;
    opacity: 0.95;
    margin-bottom: 2px;
    letter-spacing: 0.02em;
  }
  .cb-instructor-name {
    font-size: 1.8rem;
    font-weight: 700;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .cb-instructor-name:hover { opacity: 0.8; }

  /* ── Info cards grid - FIXED SIZE ── */
 .cb-info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    .cb-info-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
.cb-info-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
    min-width: 0; /* prevents overflow */
    word-break: break-word;
  }

  .cb-info-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  /* Light mode fallback */
  @media (prefers-color-scheme: light) {
    .cb-info-card {
      background: rgba(0, 0, 0, 0.02);
      border-color: rgba(0, 0, 0, 0.08);
    }
    .cb-info-card:hover {
      background: rgba(0, 0, 0, 0.04);
      border-color: rgba(0, 0, 0, 0.12);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
  }

  .cb-info-card-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 1.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.90;
  }

  .cb-info-card-label i { 
    font-size: 1.8rem;
    opacity: 0.9;
  }

  .cb-info-card-value {
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .cb-info-card-sub {
    font-size: 1.8rem;
    opacity: 0.91;
    font-weight: 500;
    margin-top: 4px;
  }

  /* ── Days picker - FIXED SIZE ── */
  .cb-days-section { 
    margin-top: 8px;
    padding-top: 7px;
  }
  .cb-days-label {
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.9;
    margin-bottom: 7px;
  }
  .cb-days-row {
    display: flex;
    flex-wrap: wrap;
    gap: 11px;
    font-size: 1.7rem;
    color: #000000;
  }
  .cb-day-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 11px;
    border-radius: 20px;
    font-size: 1.7rem;
    font-weight: 400;
    transition: all 0.2s ease;
    cursor: default;
  }
  .cb-day-pill.active {
    background: var(--rbt-primary, #5078ff);
    color: #fff;
    box-shadow: 0 2px 12px rgba(80,120,255,0.3);
    transform: scale(1.02);
  }
  .cb-day-pill.inactive {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    opacity: 0.7;
  }
  .cb-day-pill .active-indicator {
    width: 8px;
    height: 8px;
    border-radius: 47%;
    background: currentColor;
  }
  .cb-day-pill.active .active-indicator {
    background: #fff;
    box-shadow: 0 0 3px rgba(255,255,255,0.5);
  }
`;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CourseBreadcrumb = ({ getMatchCourse }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [totalDuration, setTotalDuration] = useState({ adjustedHours: 0, adjustedMinutes: 0 });
    const [activeDays, setActiveDays] = useState([]);
    const [dayCounts, setDayCounts] = useState({});
    useEffect(() => {
        if (getMatchCourse && Object.keys(getMatchCourse).length !== 0) {
            setIsLoading(false);
            calculateDuration();
            parseDays();
        }
    }, [getMatchCourse]);

    /* ── duration helpers ── */
    const getTimeDifference = (startTime, endTime) => {
        if (!startTime || !endTime) throw new Error("Undefined time");
        const isValid = (t) => /^\d{1,2}:\d{2}\s*(am|pm)$/i.test(t);
        if (!isValid(startTime) || !isValid(endTime)) throw new Error("Invalid format");

        const parse = (t) => {
            const [h, m] = t.match(/(\d+):(\d+)/).slice(1).map(Number);
            const period = /pm/i.test(t) ? 12 : 0;
            return new Date(0, 0, 0, (h % 12) + period, m);
        };
        const diff = (parse(endTime) - parse(startTime)) / 60000;
        return { hours: Math.floor(diff / 60), minutes: diff % 60 };
    };

    const calculateDuration = () => {
        try {
            const { sBatchStartTime = "00:00 am", sBatchEndTime = "00:00 pm", nBatchDurationDays = 0 } = getMatchCourse;
            const { hours, minutes } = getTimeDifference(sBatchStartTime, sBatchEndTime);
            const totalMin = minutes * nBatchDurationDays;
            setTotalDuration({
                adjustedHours: hours * nBatchDurationDays + Math.floor(totalMin / 60),
                adjustedMinutes: totalMin % 60,
            });
        } catch (e) {
            console.error("Duration error:", e.message);
        }
    };

    const parseDays = () => {
        try {
            const raw = getMatchCourse.sDays;
            if (!raw || raw === "undefined") return;
            const days = JSON.parse(raw);
            setActiveDays(days);

            // Count occurrences of each active day between start and end date
            const parseLocal = (d) => {
                const dt = new Date(d);
                return new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
            };
            const start = parseLocal(getMatchCourse.dBatchStartDate);
            const end = parseLocal(getMatchCourse.dBatchEndDate);

            const dayNameToIndex = {
                Sunday: 0,
                Monday: 1,
                Tuesday: 2,
                Wednesday: 3,
                Thursday: 4,
                Friday: 5,
                Saturday: 6
            };

            const counts = {};
            days.forEach((dayName) => {
                const targetIndex = dayNameToIndex[dayName];
                let count = 0;
                const cur = new Date(start);
                while (cur <= end) {
                    if (cur.getDay() === targetIndex) count++;
                    cur.setDate(cur.getDate() + 1);
                }
                counts[dayName] = count;
            });
            setDayCounts(counts);
        } catch { /* ignore */ }
    };
    /* ── date formatter ── */
    const fmtDate = (d) => {
        const dt = new Date(d);
        return `${dt.getDate()} ${dt.toLocaleString("default", { month: "short" })}`;
    };

    /* ─────────────────── JSX ─────────────────── */
    return (
        <>
            <style>{styles}</style>

            <div className="col-lg-8">
                <div className="content text-start">

                    {/* ══════════ SKELETON STATE ══════════ */}
                    {isLoading ? (
                        <>
                            <Skeleton width={100} height={16} style={{ marginBottom: 20 }} />
                            <Skeleton width="85%" height={40} style={{ marginBottom: 12 }} />
                            <Skeleton width="60%" height={36} style={{ marginBottom: 20 }} />
                            <Skeleton count={3} height={18} style={{ marginBottom: 8 }} />
                            <Skeleton width="70%" height={18} style={{ marginBottom: 28 }} />

                            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                                <Skeleton width={120} height={36} borderRadius={6} />
                                <Skeleton width={160} height={36} borderRadius={6} />
                            </div>

                            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32 }}>
                                <Skeleton circle width={56} height={56} />
                                <div>
                                    <Skeleton width={80} height={14} style={{ marginBottom: 6 }} />
                                    <Skeleton width={180} height={20} />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} height={100} borderRadius={16} />
                                ))}
                            </div>

                            <div>
                                <Skeleton width={100} height={16} style={{ marginBottom: 16 }} />
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    {[...Array(7)].map((_, i) => (
                                        <Skeleton key={i} width={100} height={42} borderRadius={28} />
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ══════════ LOADED STATE - FIXED TEXT SIZES ══════════ */
                        <>
                            {/* Breadcrumb - Increased text size */}
                            <ul className="cb-breadcrumb page-list">
                                <li className="rbt-breadcrumb-item">
                                    <Link href="/">Home</Link>
                                </li>
                                <li className="sep"><i className="feather-chevron-right" /></li>
                                <li className="rbt-breadcrumb-item active">Batches</li>
                            </ul>

                            {/* Category tag - Improved styling */}
                            {getMatchCourse.sCategory && (
                                <span className="cb-category-tag">{getMatchCourse.sCategory}</span>
                            )}

                            {/* Title - Larger and more prominent */}
                            <h2 className="cb-title">{getMatchCourse.sCourseTitle}</h2>

                            {/* Description - Better readability */}
                            {getMatchCourse.sShortDesc && (
                                <p className="cb-description">{getMatchCourse.sShortDesc}</p>
                            )}

                            {/* ── Badges row: Fixed text sizes ── */}
                            <div className="cb-badges-row">
                                <span className="cb-badge-bestseller">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    Best Seller
                                </span>

                                <div className="cb-rating-wrapper">
                                    <span className="cb-star-score">{getMatchCourse.star}</span>
                                    <div className="cb-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="fa fa-star" />
                                        ))}
                                    </div>
                                    <Link href="javascript:void(0)" className="cb-rating-count">
                                        ({getMatchCourse.user_rate_cnt} ratings)
                                    </Link>
                                </div>
                            </div>

                            {/* ── Instructor - Fixed text sizes ── */}
                            <div className="cb-instructor">
                                {getMatchCourse.sProfilePhotoPath && (
                                    <div className="cb-avatar">
                                        <Image
                                            src={getMatchCourse.sProfilePhotoPath}
                                            width={60}
                                            height={60}
                                            alt={`${getMatchCourse.sFName} ${getMatchCourse.sLName}`}
                                            className="rounded-circle"
                                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                        />
                                    </div>
                                )}
                                <div className="cb-instructor-info">
                                    <div className="cb-instructor-label">Tutor:</div>
                                    <Link href="javascript:void(0)" className="cb-instructor-name">
                                        {getMatchCourse.sFName} {getMatchCourse.sLName}
                                    </Link>
                                </div>
                            </div>

                            {/* ── Info Cards - Enhanced with fixed text sizes ── */}
                            <div className="cb-info-grid">
                                {/* Duration Card */}
                                <div className="cb-info-card">
                                    <div className="cb-info-card-label">
                                        <i className="feather-watch" /> Duration
                                    </div>
                                    <div className="cb-info-card-value">
                                        {totalDuration.adjustedHours}h {totalDuration.adjustedMinutes}m
                                    </div>
                                    <div className="cb-info-card-sub">
                                        {getMatchCourse.nBatchDurationDays} days total
                                    </div>
                                </div>

                                {/* Dates Card */}
                                <div className="cb-info-card">
                                    <div className="cb-info-card-label">
                                        <i className="feather-calendar" /> Dates
                                    </div>
                                    <div className="cb-info-card-value">
                                        {fmtDate(getMatchCourse.dBatchStartDate)} — {fmtDate(getMatchCourse.dBatchEndDate)}
                                    </div>
                                    <div className="cb-info-card-sub">Batch period</div>
                                </div>

                                {/* Timings Card */}
                                <div className="cb-info-card">
                                    <div className="cb-info-card-label">
                                        <i className="feather-clock" /> Time
                                    </div>
                                    <div className="cb-info-card-value">
                                        {getMatchCourse.sBatchStartTime}
                                    </div>
                                    <div className="cb-info-card-sub">
                                        to {getMatchCourse.sBatchEndTime}
                                    </div>
                                </div>
                            </div>

                            {/* ── Days of the week - Fixed text sizes ── */}
                            {/* ── Days of the week - Fixed text sizes ── */}
                            <div className="cb-days-section">
                                <div className="cb-days-label">Weekly Schedule</div>
                                <div className="cb-days-row">
                                    {DAYS.map((day) => {
                                        const isActive = activeDays.includes(day);
                                        const count = dayCounts[day] || 0;
                                        return (
                                            <span
                                                key={day}
                                                className={`cb-day-pill ${isActive ? "active" : "inactive"}`}
                                                style={{ gap: "10px" }}
                                            >
                    {isActive && <span className="active-indicator" />}
                                                {day}
                                                {isActive && count > 0 && (
                                                    <span style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "22px",
                                                        height: "22px",
                                                        borderRadius: "50%",
                                                        background: "rgba(255,255,255,0.25)",
                                                        color: "#fff",
                                                        fontSize: "1.3rem",
                                                        fontWeight: 700,
                                                        lineHeight: 1,
                                                        flexShrink: 0,
                                                    }}>
                            {count}
                        </span>
                                                )}
                </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    );
};

export default CourseBreadcrumb;