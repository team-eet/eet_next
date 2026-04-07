import React, { useState, useEffect } from "react";
import Axios from "axios";
import { API_URL, API_KEY } from "../../constants/constant";
import { EncryptData } from "@/components/Services/encrypt-decrypt";
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
const InquiryPopup = ({ onClose, courseData }) => {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Close on ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        }
        if (!formData.mobile.trim()) {
            newErrors.mobile = "Mobile number is required.";
        } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
            newErrors.mobile = "Enter a valid 10-digit mobile number.";
        }
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Enter a valid email address.";
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                sName: formData.name.trim(),
                sMobile: formData.mobile.trim(),
                sEmail: formData.email.trim() || null,
                sDescription: formData.description.trim() || null,
                nTBId: courseData?.nTBId || null,
                sCourseTitle: courseData?.sCourseTitle || null,
            };

            await Axios.post(
                `${API_URL}/api/inquiry/InsertInquiry`,
                payload,
                { headers: { ApiKey: `${API_KEY}` } }
            );

            setIsSuccess(true);
        } catch (err) {
            ErrorDefaultAlert(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* ── Backdrop ── */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(10, 14, 40, 0.75)",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    zIndex: 10000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    animation: "iq-fadeIn 0.2s ease",
                }}
            >
                {/* ── Modal Card ── */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "480px",
                        boxShadow: "0 24px 64px rgba(61,89,245,0.18), 0 4px 16px rgba(0,0,0,0.12)",
                        overflow: "hidden",
                        animation: "iq-slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                        position: "relative",
                    }}
                >
                    {/* ── Header ── */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #3d59f5 0%, #5b73ff 100%)",
                            padding: "28px 28px 24px",
                            position: "relative",
                        }}
                    >
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px",
                                background: "rgba(255,255,255,0.18)",
                                border: "none",
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#ffffff",
                                fontSize: "16px",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.32)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                        >
                            <i className="feather-x"></i>
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "10px",
                                    background: "rgba(255,255,255,0.22)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "20px",
                                    color: "#fff",
                                }}
                            >
                                <i className="feather-help-circle"></i>
                            </div>
                            <div>
                                <h5 style={{ margin: 0, color: "#ffffff", fontSize: "18px", fontWeight: 700 }}>
                                    Inquiry Now
                                </h5>
                                {courseData?.sCourseTitle && (
                                    <p
                                        style={{
                                            margin: "2px 0 0",
                                            color: "rgba(255,255,255,0.75)",
                                            fontSize: "12px",
                                            maxWidth: "340px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {courseData.sCourseTitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Body ── */}
                    <div style={{ padding: "24px 28px 28px" }}>
                        {isSuccess ? (
                            /* ── Success State ── */
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "16px 0 8px",
                                    animation: "iq-fadeIn 0.3s ease",
                                }}
                            >
                                <div
                                    style={{
                                        width: "64px",
                                        height: "64px",
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #3d59f5, #5b73ff)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 16px",
                                        fontSize: "28px",
                                        color: "#fff",
                                        boxShadow: "0 8px 24px rgba(61,89,245,0.35)",
                                    }}
                                >
                                    <i className="feather-check"></i>
                                </div>
                                <h5 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 700, color: "#1a1a2e" }}>
                                    Inquiry Submitted!
                                </h5>
                                <p style={{ margin: "0 0 24px", color: "#6c757d", fontSize: "14px", lineHeight: 1.6 }}>
                                    Thank you for reaching out. Our team will get back to you shortly.
                                </p>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: "linear-gradient(135deg, #3d59f5, #5b73ff)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "10px 32px",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "opacity 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            /* ── Form ── */
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {/* Name */}
                                <div>
                                    <label style={labelStyle}>
                                        Full Name <span style={{ color: "#e53e3e" }}>*</span>
                                    </label>
                                    <div style={inputWrapStyle}>
                                        <i className="feather-user" style={inputIconStyle}></i>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{
                                                ...inputStyle,
                                                borderColor: errors.name ? "#e53e3e" : "#e2e8f0",
                                            }}
                                            onFocus={(e) => (e.target.style.borderColor = "#3d59f5")}
                                            onBlur={(e) =>
                                                (e.target.style.borderColor = errors.name ? "#e53e3e" : "#e2e8f0")
                                            }
                                        />
                                    </div>
                                    {errors.name && <p style={errorStyle}>{errors.name}</p>}
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label style={labelStyle}>
                                        Mobile Number <span style={{ color: "#e53e3e" }}>*</span>
                                    </label>
                                    <div style={inputWrapStyle}>
                                        <i className="feather-phone" style={inputIconStyle}></i>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="10-digit mobile number"
                                            maxLength={10}
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            style={{
                                                ...inputStyle,
                                                borderColor: errors.mobile ? "#e53e3e" : "#e2e8f0",
                                            }}
                                            onFocus={(e) => (e.target.style.borderColor = "#3d59f5")}
                                            onBlur={(e) =>
                                                (e.target.style.borderColor = errors.mobile ? "#e53e3e" : "#e2e8f0")
                                            }
                                        />
                                    </div>
                                    {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
                                </div>

                                {/* Email (optional) */}
                                <div>
                                    <label style={labelStyle}>
                                        Email{" "}
                                        <span style={{ color: "#a0aec0", fontWeight: 400, fontSize: "11px" }}>
                      (optional)
                    </span>
                                    </label>
                                    <div style={inputWrapStyle}>
                                        <i className="feather-mail" style={inputIconStyle}></i>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{
                                                ...inputStyle,
                                                borderColor: errors.email ? "#e53e3e" : "#e2e8f0",
                                            }}
                                            onFocus={(e) => (e.target.style.borderColor = "#3d59f5")}
                                            onBlur={(e) =>
                                                (e.target.style.borderColor = errors.email ? "#e53e3e" : "#e2e8f0")
                                            }
                                        />
                                    </div>
                                    {errors.email && <p style={errorStyle}>{errors.email}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={labelStyle}>
                                        Message{" "}
                                        <span style={{ color: "#a0aec0", fontWeight: 400, fontSize: "11px" }}>
                      (optional)
                    </span>
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="Tell us what you'd like to know about this course…"
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleChange}
                                        style={{
                                            ...inputStyle,
                                            paddingLeft: "14px",
                                            resize: "vertical",
                                            minHeight: "80px",
                                            fontFamily: "inherit",
                                            lineHeight: 1.5,
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = "#3d59f5")}
                                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    style={{
                                        marginTop: "4px",
                                        background: isSubmitting
                                            ? "#a0aec0"
                                            : "linear-gradient(135deg, #3d59f5 0%, #5b73ff 100%)",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "10px",
                                        padding: "13px 24px",
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        cursor: isSubmitting ? "not-allowed" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        transition: "opacity 0.2s, transform 0.15s",
                                        width: "100%",
                                        boxShadow: isSubmitting ? "none" : "0 4px 16px rgba(61,89,245,0.35)",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSubmitting) e.currentTarget.style.opacity = "0.9";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = "1";
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                      <span
                          style={{
                              width: "16px",
                              height: "16px",
                              border: "2px solid rgba(255,255,255,0.4)",
                              borderTopColor: "#fff",
                              borderRadius: "50%",
                              display: "inline-block",
                              animation: "iq-spin 0.7s linear infinite",
                          }}
                      />
                                            Submitting…
                                        </>
                                    ) : (
                                        <>
                                            <i className="feather-send" style={{ fontSize: "15px" }}></i>
                                            Submit Inquiry
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Keyframe Animations ── */}
            <style>{`
        @keyframes iq-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes iq-slideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes iq-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
};

/* ── Shared inline style objects ── */
const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#2d3748",
};

const inputWrapStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
};

const inputIconStyle = {
    position: "absolute",
    left: "12px",
    fontSize: "14px",
    color: "#a0aec0",
    pointerEvents: "none",
};

const inputStyle = {
    width: "100%",
    paddingLeft: "36px",
    paddingRight: "12px",
    paddingTop: "10px",
    paddingBottom: "10px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#2d3748",
    background: "#f8fafc",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
};

const errorStyle = {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#e53e3e",
    display: "flex",
    alignItems: "center",
    gap: "4px",
};

export default InquiryPopup;