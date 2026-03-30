import React, { useState, useEffect, useRef } from 'react';
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

// ─── Constants ────────────────────────────────────────────────────────────────
const mob = /^[6-9]\d{9}$/;
const COOLDOWN_THRESHOLD = 3;
const COOLDOWN_SECONDS   = 90;

// ─── Yup Schema ───────────────────────────────────────────────────────────────
const UserValidationSchema = Yup.object().shape({
    emailmobile: Yup.string()
        .required('Mobile number is required')
        .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
        .matches(mob, 'Invalid mobile number (must start with 6–9)'),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCountdown(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
const Registration = () => {
    const router = useRouter();

    // ── View state ──────────────────────────────────────────────────────────
    const [showEmailMob, setShowEmailMob] = useState(true);
    const [showOtp, setShowOtp]           = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [codeSent, setCodeSent]         = useState(false);
    const [alreadyRegisteredError, setAlreadyRegisteredError] = useState('');
    // ── OTP input ───────────────────────────────────────────────────────────
    const [otpValues, setOtpValues] = useState({
        otp1: '', otp2: '', otp3: '',
        otp4: '', otp5: '', otp6: '',
    });
    const [otpError, setOtpError] = useState('');

    // ── Firebase refs ────────────────────────────────────────────────────────
    // KEY FIX: Store verifier in a ref so it persists across renders
    // and is never recreated on top of an existing one (which causes silent failures).
    const [confirmationResult, setConfirmationResult] = useState(null);
    const recaptchaVerifierRef = useRef(null);   // single persistent verifier
    const recaptchaInitialised = useRef(false);  // guard: only create once

    // ── Rate-limiting state ──────────────────────────────────────────────────
    const [resendCount, setResendCount] = useState(0);
    const [countdown, setCountdown]     = useState(0);
    const timerRef                      = useRef(null);

    // ── sessionStorage cooldown helpers ─────────────────────────────────────
    const getCooldownExpiry = () => {
        const raw = sessionStorage.getItem('otpCooldownExpiry');
        return raw ? parseInt(raw, 10) : 0;
    };
    const setCooldownExpiry = (ms) => {
        sessionStorage.setItem('otpCooldownExpiry', String(ms));
    };

    // ── On mount: restore any in-progress cooldown ───────────────────────────
    useEffect(() => {
        const remaining = Math.ceil((getCooldownExpiry() - Date.now()) / 1000);
        if (remaining > 0) {
            setCountdown(remaining);
            startCountdownTimer(remaining);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── KEY FIX: Initialise reCAPTCHA exactly ONCE after mount ──────────────
    // By creating the verifier a single time and reusing it, we avoid the
    // "reCAPTCHA has already been rendered" error that silently blocks submission.
    useEffect(() => {
        if (recaptchaInitialised.current) return;
        recaptchaInitialised.current = true;

        try {
            recaptchaVerifierRef.current = new RecaptchaVerifier(
                auth,
                'recaptcha-global',   // one hidden div used for ALL OTP sends
                { size: 'invisible' }
            );
            // Pre-render so it is ready immediately on first submit
            recaptchaVerifierRef.current.render();
        } catch (err) {
            console.error('RecaptchaVerifier init failed:', err);
        }

        return () => {
            // Clean up on component unmount
            if (recaptchaVerifierRef.current) {
                try { recaptchaVerifierRef.current.clear(); } catch (_) {}
                recaptchaVerifierRef.current = null;
                recaptchaInitialised.current = false;
            }
        };
    }, []);

    // ── Timer helper ─────────────────────────────────────────────────────────
    function startCountdownTimer(initialSeconds) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
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

    // ── OTP input handlers ───────────────────────────────────────────────────
    const handleOtpChange = (fieldName, e) => {
        const val = e.target.value;
        if (val && !/^\d$/.test(val)) return;
        setOtpValues((prev) => ({ ...prev, [fieldName]: val }));
    };

    const handleOtpKeyUp = (e) => {
        const idx = e.target.tabIndex;
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const prevIdx = idx - 2;
            if (prevIdx >= 0) e.target.form.elements[prevIdx].focus();
        } else {
            const nextIdx = idx;
            if (nextIdx < 6) e.target.form.elements[nextIdx].focus();
        }
    };

    // ── OTP submit ───────────────────────────────────────────────────────────
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

        const finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

        confirmationResult
            .confirm(finalOtp)
            .then(() => {
                setShowOtp(false);
                setShowRegister(true);
            })
            .catch((err) => {
                if (err.code === 'auth/code-expired' || err.message?.includes('expired')) {
                    setOtpError('OTP expired. Please request a new one.');
                } else if (err.code === 'auth/invalid-verification-code') {
                    setOtpError('Wrong OTP. Please check and try again.');
                } else {
                    setOtpError('OTP verification failed. Please try again.');
                }
            });
    };

    // ── Core OTP send (used by both first-send and resend) ───────────────────
    // KEY FIX: Reuses the single persistent recaptchaVerifierRef instead of
    // creating a new one each time, which was the root cause of the submit freeze.
    const sendOtpViaFirebase = (phoneNumber) => {
        if (!recaptchaVerifierRef.current) {
            toast.error('reCAPTCHA not ready. Please refresh the page.');
            return Promise.reject(new Error('reCAPTCHA not ready'));
        }
        return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current);
    };

    // ── Resend OTP ───────────────────────────────────────────────────────────
    const handleResend = () => {
        const remaining = Math.ceil((getCooldownExpiry() - Date.now()) / 1000);
        if (remaining > 0) {
            toast.error(`Please wait ${formatCountdown(remaining)} before resending.`);
            return;
        }

        setConfirmationResult(null);
        setOtpValues({ otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '' });
        setOtpError('Sending a new OTP…');

        const newCount = resendCount + 1;
        setResendCount(newCount);

        if (newCount >= COOLDOWN_THRESHOLD) {
            enforceCooldown();
        }

        const storedPhone = `+91${JSON.parse(localStorage.getItem('userRegData') || '{}')?.em}`;

        sendOtpViaFirebase(storedPhone)
            .then((result) => {
                setConfirmationResult(result);
                setOtpError('');
                toast.success('OTP sent successfully.');
            })
            .catch(() => {
                setCountdown(0);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                toast.error('Failed to send OTP. Please try again later.');
            });
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* KEY FIX: Single global invisible reCAPTCHA div, never unmounted */}
            <div id="recaptcha-global" style={{ display: 'none' }} />

            <div>
                <Formik
                    validationSchema={UserValidationSchema}
                    initialValues={{ emailmobile: '' }}
                    onSubmit={async (input, { setSubmitting }) => {
                        const phone = `+91${input.emailmobile}`;

                        // ── Step 1: Check if number already registered ───────
                        try {
                            const checkRes = await Axios.get(
                                `${API_URL}/api/registration/CheckEmailMobileExist/${input.emailmobile}`,
                                { headers: { ApiKey: API_KEY } }
                            );
                            if (checkRes?.data[0]?.ecnt === 1) {
                                setAlreadyRegisteredError('This mobile number is already registered. Please login instead.');
                                setSubmitting(false);
                                return;
                            }
                        } catch (_) {
                            // ✅ API check failed — stop spinner and bail out
                            // (do NOT fall through to Firebase)
                            toast.error('Could not verify mobile number. Please try again.');
                            setSubmitting(false);
                            return;
                        }

                        // ── Step 2: Send OTP via Firebase ────────────────────
                        // KEY FIX: Uses the single persistent verifier from ref,
                        // never constructs a new RecaptchaVerifier here.
                        sendOtpViaFirebase(phone)
                            .then(async (code) => {
                                setConfirmationResult(code);
                                setShowEmailMob(false);
                                setShowOtp(true);
                                setCodeSent(true);
                                const userData = { em: input.emailmobile, emname: 'mobile' };
                                localStorage.setItem('userRegData', JSON.stringify(userData));

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
                                setShowOtp(false);
                                setShowEmailMob(true);
                                setCodeSent(false);
                                toast.error('Failed to send OTP. Please try again later.');
                            })
                            .finally(() => setSubmitting(false)); // ✅ always unblocks the button
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
                                                    autoComplete="off"
                                                    maxLength={10}
                                                    placeholder="Enter 10-digit Mobile Number"
                                                    className={`form-control ${
                                                        form.errors.emailmobile && form.touched.emailmobile
                                                            ? 'is-invalid'
                                                            : ''
                                                    }`}
                                                    onChange={(e) => {
                                                        field.onChange(e);              // ← Formik's own handler (keeps value updating)
                                                        setAlreadyRegisteredError('');  // ← clears your custom error
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
                                            <div className="field-error text-danger mt-1" style={{ fontWeight: 600 }}>
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
                                        className="rbt-btn btn-gradient"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending OTP…' : 'Submit'}
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
                                                    autoComplete="off"
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