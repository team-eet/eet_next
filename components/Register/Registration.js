import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { API_URL, API_KEY } from "../../constants/constant";
import Axios from "axios";
import * as Yup from 'yup';
import Image from "next/image";
import Link from "next/link";
import logo from '../../public/images/logo/eetlogo 1.svg';
import { CardText } from "reactstrap";
import UserReg from "@/components/Register/UserReg";
import { auth } from "@/context/firebase";
import { toast } from 'react-toastify';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { SuccessProgressToast } from "@/components/Services/Toast";
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";

// ─── Constants ─────────────────────────────────────────────────────────────
const MOB_REGEX          = /^[6-9]\d{9}$/;
const COOLDOWN_THRESHOLD = 3;
const COOLDOWN_SECONDS   = 90;
const STORAGE_KEY        = 'otpCooldownExpiry';

// ─── Yup Schema ─────────────────────────────────────────────────────────────
const UserValidationSchema = Yup.object().shape({
    emailmobile: Yup.string()
        .required('Mobile number is required')
        .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
        .matches(MOB_REGEX, 'Invalid mobile number (must start with 6–9)'),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCountdown(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// FIX: All storage access wrapped in try/catch — production browsers (Safari ITP,
// private mode) can throw SecurityError on any sessionStorage/localStorage access.
function safeGetSession(key) {
    try {
        if (typeof window === 'undefined') return null;
        return sessionStorage.getItem(key);
    } catch (_) { return null; }
}

function safeSetSession(key, value) {
    try {
        if (typeof window === 'undefined') return;
        sessionStorage.setItem(key, String(value));
    } catch (_) {}
}

function safeGetLocal(key) {
    try {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(key);
    } catch (_) { return null; }
}

function safeSetLocal(key, value) {
    try {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
}

function getCooldownExpiry() {
    const raw = safeGetSession(STORAGE_KEY);
    return raw ? parseInt(raw, 10) : 0;
}

function setCooldownExpiry(ms) {
    safeSetSession(STORAGE_KEY, ms);
}

// ─── Component ───────────────────────────────────────────────────────────────
const Registration = () => {
    const router = useRouter();

    // ── View state ────────────────────────────────────────────────────────
    const [showEmailMob, setShowEmailMob]   = useState(true);
    const [showOtp, setShowOtp]             = useState(false);
    const [showRegister, setShowRegister]   = useState(false);
    const [codeSent, setCodeSent]           = useState(false);
    const [alreadyRegisteredError, setAlreadyRegisteredError] = useState('');

    // ── OTP input ─────────────────────────────────────────────────────────
    const [otpValues, setOtpValues] = useState({
        otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '',
    });
    const [otpError, setOtpError] = useState('');

    // ── Firebase refs ─────────────────────────────────────────────────────
    const [confirmationResult, setConfirmationResult] = useState(null);
    const recaptchaVerifierRef  = useRef(null);
    const recaptchaInitialised  = useRef(false);

    // ── Rate-limiting state ───────────────────────────────────────────────
    // FIX: Use ref for resendCount so it never resets on re-render and is
    // always in sync when read inside async callbacks (closure-safe).
    const resendCountRef        = useRef(0);
    const [countdown, setCountdown] = useState(0);
    const timerRef              = useRef(null);

    // FIX: Track mounted state to prevent setState after unmount (production
    // unmounts components more aggressively during navigation than dev mode).
    const mountedRef            = useRef(true);

    // ── Restore cooldown on mount ─────────────────────────────────────────
    useEffect(() => {
        mountedRef.current = true;

        const remaining = Math.ceil((getCooldownExpiry() - Date.now()) / 1000);
        if (remaining > 0) {
            setCountdown(remaining);
            startCountdownTimer(remaining);
        }

        return () => {
            mountedRef.current = false;
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Initialise reCAPTCHA exactly once ─────────────────────────────────
    // FIX: Wrapped in a try/catch with a retry on failure. In production,
    // Firebase sometimes throws on first init if the SDK hasn't fully loaded;
    // a small delay retry handles this without user impact.
    useEffect(() => {
        if (recaptchaInitialised.current) return;

        const initRecaptcha = () => {
            try {
                // FIX: Guard against double-init — clear any stale widget first.
                if (recaptchaVerifierRef.current) {
                    try { recaptchaVerifierRef.current.clear(); } catch (_) {}
                    recaptchaVerifierRef.current = null;
                }

                recaptchaVerifierRef.current = new RecaptchaVerifier(
                    auth,
                    'recaptcha-global',
                    {
                        size: 'invisible',
                        // FIX: 'expired-callback' resets the verifier so the next
                        // OTP send doesn't silently fail with a stale token.
                        'expired-callback': () => {
                            try { recaptchaVerifierRef.current?.clear(); } catch (_) {}
                            recaptchaVerifierRef.current = null;
                            recaptchaInitialised.current  = false;
                            // Re-init immediately so it's ready for the next attempt
                            initRecaptcha();
                        },
                    }
                );

                recaptchaVerifierRef.current
                    .render()
                    .then(() => { recaptchaInitialised.current = true; })
                    .catch((err) => {
                        console.error('reCAPTCHA render failed:', err);
                        // FIX: Retry once after a short delay (handles race with
                        // Firebase SDK loading in production bundles).
                        setTimeout(initRecaptcha, 1500);
                    });
            } catch (err) {
                console.error('RecaptchaVerifier init failed:', err);
                setTimeout(initRecaptcha, 1500);
            }
        };

        initRecaptcha();

        return () => {
            if (recaptchaVerifierRef.current) {
                try { recaptchaVerifierRef.current.clear(); } catch (_) {}
                recaptchaVerifierRef.current = null;
                recaptchaInitialised.current  = false;
            }
        };
    }, []);

    // ── Timer helpers ─────────────────────────────────────────────────────
    function startCountdownTimer(initialSeconds) {
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            // FIX: Guard prevents setState on unmounted component — common
            // production crash source when navigating away mid-countdown.
            if (!mountedRef.current) {
                clearInterval(timerRef.current);
                return;
            }
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    function enforceCooldown() {
        const expiryMs = Date.now() + COOLDOWN_SECONDS * 1000;
        setCooldownExpiry(expiryMs);
        setCountdown(COOLDOWN_SECONDS);
        startCountdownTimer(COOLDOWN_SECONDS);
    }

    // ── OTP input handlers ────────────────────────────────────────────────
    const handleOtpChange = (fieldName, e) => {
        const val = e.target.value;
        if (val && !/^\d$/.test(val)) return;
        setOtpValues((prev) => ({ ...prev, [fieldName]: val }));
    };

    const handleOtpKeyUp = (e) => {
        const idx = e.target.tabIndex;
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const prevIdx = idx - 2;
            if (prevIdx >= 0) e.target.form?.elements[prevIdx]?.focus();
        } else if (/^\d$/.test(e.key)) {
            // FIX: Only advance on digit key — not on Tab, Shift, etc.
            const nextIdx = idx;
            if (nextIdx < 6) e.target.form?.elements[nextIdx]?.focus();
        }
    };

    // ── OTP submit ────────────────────────────────────────────────────────
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setOtpError('');

        const { otp1, otp2, otp3, otp4, otp5, otp6 } = otpValues;

        if (!(otp1 && otp2 && otp3 && otp4 && otp5 && otp6)) {
            setOtpError('Please enter all 6 digits of the OTP.');
            return;
        }

        if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
            setOtpError('OTP session expired. Please click Resend OTP.');
            return;
        }

        const finalOtp = `${otp1}${otp2}${otp3}${otp4}${otp5}${otp6}`;

        confirmationResult
            .confirm(finalOtp)
            .then(() => {
                if (!mountedRef.current) return;
                setShowOtp(false);
                setShowRegister(true);
            })
            .catch((err) => {
                if (!mountedRef.current) return;
                if (err.code === 'auth/code-expired' || err.message?.includes('expired')) {
                    setOtpError('OTP expired. Please request a new one.');
                } else if (err.code === 'auth/invalid-verification-code') {
                    setOtpError('Wrong OTP. Please check and try again.');
                } else {
                    setOtpError('OTP verification failed. Please try again.');
                }
            });
    };

    // ── Core OTP send ─────────────────────────────────────────────────────
    // FIX: If the verifier was cleared (e.g. by expired-callback), we
    // re-create it inline rather than failing silently. This is the most
    // common production failure path after a user sits on the page too long.
    const sendOtpViaFirebase = useCallback((phoneNumber) => {
        return new Promise((resolve, reject) => {
            const attemptSend = (retries = 0) => {
                if (recaptchaVerifierRef.current) {
                    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current)
                        .then(resolve)
                        .catch(reject);
                    return;
                }

                if (retries >= 3) {
                    reject(new Error('reCAPTCHA not ready after retries'));
                    return;
                }

                // Verifier was cleared — re-init and retry
                try {
                    recaptchaVerifierRef.current = new RecaptchaVerifier(
                        auth,
                        'recaptcha-global',
                        { size: 'invisible' }
                    );
                    recaptchaVerifierRef.current
                        .render()
                        .then(() => {
                            recaptchaInitialised.current = true;
                            setTimeout(() => attemptSend(retries + 1), 300);
                        })
                        .catch(() => setTimeout(() => attemptSend(retries + 1), 800));
                } catch (_) {
                    setTimeout(() => attemptSend(retries + 1), 800);
                }
            };

            attemptSend();
        });
    }, []);

    // ── Resend OTP ────────────────────────────────────────────────────────
    const handleResend = useCallback(() => {
        const remaining = Math.ceil((getCooldownExpiry() - Date.now()) / 1000);
        if (remaining > 0) {
            toast.error(`Please wait ${formatCountdown(remaining)} before resending.`);
            return;
        }

        setConfirmationResult(null);
        setOtpValues({ otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '' });
        setOtpError('Sending a new OTP…');

        // FIX: Use ref so this is always the true accumulated count,
        // regardless of React batching or stale closure captures.
        resendCountRef.current += 1;

        if (resendCountRef.current >= COOLDOWN_THRESHOLD) {
            enforceCooldown();
        }

        // FIX: Parse phone from localStorage with a safe fallback — production
        // users sometimes have localStorage cleared between sessions.
        let storedPhone = '';
        try {
            const raw = safeGetLocal('userRegData');
            // safeGetLocal already parses JSON for us via JSON.stringify on set,
            // but it returns the raw string here — parse manually:
            const parsed = raw ? JSON.parse(raw) : {};
            storedPhone = `+91${parsed?.em || ''}`;
        } catch (_) {
            storedPhone = '';
        }

        if (!storedPhone || storedPhone === '+91') {
            toast.error('Could not find your phone number. Please go back and re-enter.');
            setOtpError('');
            return;
        }

        sendOtpViaFirebase(storedPhone)
            .then((result) => {
                if (!mountedRef.current) return;
                setConfirmationResult(result);
                setOtpError('');
                toast.success('OTP sent successfully.');
            })
            .catch(() => {
                if (!mountedRef.current) return;
                // FIX: Reset countdown if send fails so user isn't stuck
                setCountdown(0);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                toast.error('Failed to send OTP. Please try again later.');
                setOtpError('');
            });
    }, [sendOtpViaFirebase]);

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <>
            {/* FIX: Must always be present in the DOM — never conditionally
                rendered — or Firebase loses the widget reference in production. */}
            <div id="recaptcha-global" style={{ display: 'none' }} />

            <div>
                <Formik
                    validationSchema={UserValidationSchema}
                    initialValues={{ emailmobile: '' }}
                    onSubmit={async (input, { setSubmitting }) => {
                        const phone = `+91${input.emailmobile}`;

                        // ── Step 1: Check if already registered ─────────
                        try {
                            const checkRes = await Axios.get(
                                `${API_URL}/api/registration/CheckEmailMobileExist/${input.emailmobile}`,
                                { headers: { ApiKey: API_KEY } }
                            );
                            if (checkRes?.data[0]?.ecnt === 1) {
                                setAlreadyRegisteredError(
                                    'This mobile number is already registered. Please login instead.'
                                );
                                setSubmitting(false);
                                return;
                            }
                        } catch (_) {
                            toast.error('Could not verify mobile number. Please try again.');
                            setSubmitting(false);
                            return;
                        }

                        // ── Step 2: Send OTP ─────────────────────────────
                        sendOtpViaFirebase(phone)
                            .then(async (code) => {
                                if (!mountedRef.current) return;
                                setConfirmationResult(code);
                                setShowEmailMob(false);
                                setShowOtp(true);
                                setCodeSent(true);

                                // FIX: Use safe storage helper (never throws in production)
                                safeSetLocal('userRegData', { em: input.emailmobile, emname: 'mobile' });

                                try {
                                    const res = await Axios.get(
                                        `${API_URL}/api/registration/getRegData/${EncryptData(input.emailmobile)}/${EncryptData('mobile')}`,
                                        { headers: { ApiKey: API_KEY } }
                                    );
                                    const retData = DecryptData(res.data);
                                    toast.success(
                                        <SuccessProgressToast pdata={retData} />,
                                        { hideProgressBar: true }
                                    );
                                } catch (_) {
                                    toast.error('Registration data fetch failed.');
                                }
                            })
                            .catch(() => {
                                if (!mountedRef.current) return;
                                setShowOtp(false);
                                setShowEmailMob(true);
                                setCodeSent(false);
                                toast.error('Failed to send OTP. Please try again later.');
                            })
                            .finally(() => {
                                // FIX: Guard here too — Formik may be unmounted by
                                // the time .finally() runs on slow mobile networks.
                                if (mountedRef.current) setSubmitting(false);
                            });
                    }}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <div>
                            <Image
                                src={logo}
                                priority={true}
                                className="w-25"
                                alt="Education Logo"
                            />

                            <h4 className="title mt-5">Create New Account</h4>

                            {/* ── Step 1: Phone number entry ── */}
                            {showEmailMob && (
                                <Form method="post">
                                    <p className="description mt--20">
                                        Enter your mobile number to receive an OTP
                                    </p>

                                    <div className="form-group">
                                        <Field name="emailmobile">
                                            {({ field, form }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    inputMode="numeric"
                                                    autoComplete="off"
                                                    maxLength={10}
                                                    placeholder="Enter 10-digit Mobile Number"
                                                    className={`form-control ${
                                                        form.errors.emailmobile && form.touched.emailmobile
                                                            ? 'is-invalid'
                                                            : ''
                                                    }`}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setAlreadyRegisteredError('');
                                                    }}
                                                />
                                            )}
                                        </Field>

                                        <ErrorMessage
                                            name="emailmobile"
                                            component="div"
                                            className="field-error text-danger"
                                        />

                                        {alreadyRegisteredError && (
                                            <div
                                                className="field-error text-danger mt-1"
                                                style={{ fontWeight: 600 }}
                                            >
                                                {alreadyRegisteredError}{' '}
                                                <Link href="/login">
                                                    <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                                        Login here
                                                    </span>
                                                </Link>
                                            </div>
                                        )}

                                        {codeSent && (
                                            <p className="m-0 text-success">
                                                OTP sent to the entered mobile number
                                            </p>
                                        )}
                                        <span className="focus-border" />
                                    </div>

                                    <button
                                        className="rbt-btn btn-gradient mt-4"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
            <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
            />
                                                Sending OTP…
                                            </>
                                        ) : 'Submit'}
                                    </button>
                                </Form>
                            )}

                            {/* ── Step 2: OTP verification ── */}
                            {showOtp && (
                                <form
                                    className="auth-register-form mt-1"
                                    onSubmit={handleOtpSubmit}
                                >
                                    <CardText className="mb-2">Enter OTP</CardText>

                                    <div className="otpContainer">
                                        {['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'].map(
                                            (field, i) => (
                                                <input
                                                    key={field}
                                                    name={field}
                                                    type="text"
                                                    inputMode="numeric"
                                                    autoComplete="one-time-code"
                                                    className="otpInput"
                                                    value={otpValues[field]}
                                                    onChange={(e) => handleOtpChange(field, e)}
                                                    onKeyUp={handleOtpKeyUp}
                                                    tabIndex={i + 1}
                                                    maxLength={1}
                                                />
                                            )
                                        )}
                                    </div>

                                    {otpError && (
                                        <p style={{ color: 'red', marginTop: 8, fontSize: 14 }}>
                                            {otpError}
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                                        <button
                                            className="rbt-btn btn-gradient"
                                            type="submit"
                                            style={{ width: '100%' }}
                                        >
                                            Verify OTP
                                        </button>

                                        <div style={{ minHeight: 44 }}>
                                            <button
                                                type="button"
                                                className="rbt-btn btn-gradient"
                                                onClick={countdown > 0 ? undefined : handleResend}
                                                disabled={countdown > 0}
                                                style={{
                                                    width: '100%',
                                                    opacity: countdown > 0 ? 0.6 : 1,
                                                    cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                                                    pointerEvents: countdown > 0 ? 'none' : 'auto',
                                                }}
                                            >
                                                {countdown > 0
                                                    ? `Resend in ${formatCountdown(countdown)}`
                                                    : 'Resend OTP'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* ── Step 3: Registration form ── */}
                            {showRegister && <UserReg />}

                            <p className="description mt--20">
                                Already have an account?{' '}
                                <Link href="/login">
                                    <span>Sign in instead</span>
                                </Link>
                            </p>
                        </div>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default Registration;