// components/ForgotPassword/LostPass.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import { toast } from 'react-toastify';

import { API_URL, API_KEY } from '../../constants/constant';
import { auth } from '@/context/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { SuccessProgressToast } from '@/components/Services/Toast';
import { DecryptData } from '@/components/Services/encrypt-decrypt';
import NewPass from './NewPass';

import logo from '../../public/images/logo/eetlogo 1.svg';

const mob = /^(\+\d{1,4})?[1-9]\d{9}$/;
const emailpattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UserValidationSchema = Yup.object().shape({
    emailmobile: Yup.string().required('Mobile Number is required'),
});

const LostPass = () => {
    const [showEmailMob, setShowEmailMob] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const [otpValues, setOtpValues] = useState({
        otp1: '', otp2: '', otp3: '', otp4: '', otp5: '', otp6: '',
    });

    const recaptchaWrapperRef = useRef(null);
    const recaptchaVerifierRef = useRef(null);
    const isSubmittingRef = useRef(false); // Prevent double submission

    const handleOtpChange = (valueName, e) => {
        setOtpValues(prev => ({ ...prev, [valueName]: e.target.value.slice(0, 1) }));
    };

    const inputFocus = (e) => {
        const { value, tabIndex } = e.target;
        if ((e.key === 'Backspace' || e.key === 'Delete') && tabIndex > 1) {
            e.target.form.elements[tabIndex - 2]?.focus();
        } else if (value.length === 1 && tabIndex < 6) {
            e.target.form.elements[tabIndex]?.focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const finalOtp = Object.values(otpValues).join('');
        if (finalOtp.length !== 6) {
            toast.error('Please enter complete 6-digit OTP');
            return;
        }

        try {
            await result.confirm(finalOtp);
            setShowOtp(false);
            setShowNewPass(true);
            toast.success('OTP verified successfully!');
        } catch (err) {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    const cleanupRecaptcha = () => {
        if (recaptchaVerifierRef.current) {
            try {
                recaptchaVerifierRef.current.clear();
            } catch (e) {
                console.warn('Recaptcha clear failed:', e);
            }
            recaptchaVerifierRef.current = null;
        }

        if (recaptchaWrapperRef.current) {
            recaptchaWrapperRef.current.innerHTML = '';
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => cleanupRecaptcha();
    }, []);

    return (
        <div>
            <Image src={logo} priority className="w-25" alt="Logo" />
            <h4 className="title mt-5">Forgot Password?</h4>

            <Formik
                validationSchema={UserValidationSchema}
                initialValues={{ emailmobile: '' }}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    if (isSubmittingRef.current) return; // Prevent double submit
                    isSubmittingRef.current = true;

                    const input = values.emailmobile.trim();
                    setErrorMessage('');
                    setSubmitting(true);

                    if (emailpattern.test(input)) {
                        toast.info("Email forgot password is not implemented yet.");
                        setSubmitting(false);
                        isSubmittingRef.current = false;
                        return;
                    }

                    if (!mob.test(input)) {
                        toast.error("Please enter a valid 10-digit mobile number");
                        setSubmitting(false);
                        isSubmittingRef.current = false;
                        return;
                    }

                    const phone = `+91${input}`;

                    try {
                        // 1. Check user exists
                        const checkRes = await Axios.get(
                            `${API_URL}/api/registration/CheckEmailMobileExist/${input}`,
                            { headers: { ApiKey: API_KEY } }
                        );

                        const exists = checkRes.data?.[0]?.ecnt === 1;

                        if (!exists) {
                            setErrorMessage("This mobile number is not registered. Please sign up first.");
                            toast.error("This number is not registered with us.");
                            setSubmitting(false);
                            isSubmittingRef.current = false;
                            return;
                        }

                        // 2. Clean previous reCAPTCHA
                        cleanupRecaptcha();

                        // 3. Create fresh verifier with nested container
                        const recaptchaContainer = document.createElement('div');
                        recaptchaContainer.id = 'recaptcha-container';
                        recaptchaWrapperRef.current.appendChild(recaptchaContainer);

                        const recaptchaVerifier = new RecaptchaVerifier(
                            auth,
                            recaptchaContainer,
                            { size: 'invisible' }
                        );

                        recaptchaVerifierRef.current = recaptchaVerifier;

                        const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);

                        setResult(confirmationResult);
                        setShowEmailMob(false);
                        setShowOtp(true);

                        localStorage.setItem('userUpdateData', JSON.stringify({ em: input, emname: 'mobile' }));

                        // Optional backend call
                        try {
                            const forgotRes = await Axios.get(
                                `${API_URL}/api/registration/forgotPasswordData/${input}/mobile`,
                                { headers: { ApiKey: API_KEY } }
                            );
                            const retData = DecryptData(forgotRes.data);
                            if (retData.success === "1") {
                                toast.success(<SuccessProgressToast pdata={retData} />, { hideProgressBar: true });
                            }
                        } catch (apiErr) {
                            console.warn("Backend call failed", apiErr);
                        }

                        resetForm();
                    } catch (err) {
                        console.error(err);

                        if (err.code === 'auth/too-many-requests') {
                            setErrorMessage("Too many requests. Please wait 1-2 minutes before trying again.");
                            toast.error("Too many OTP requests. Please wait before retrying.");
                        } else if (err.code === 'auth/invalid-phone-number') {
                            toast.error("Invalid phone number.");
                        } else {
                            toast.error("Failed to send OTP. Please try again.");
                        }
                    } finally {
                        setSubmitting(false);
                        isSubmittingRef.current = false;
                    }
                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <>
                        {showEmailMob && (
                            <Form>
                                <p className="description mt--20">Enter your detail to get OTP verification</p>

                                <div className="form-group">
                                    <Field
                                        name="emailmobile"
                                        type="text"
                                        maxLength="10"
                                        className={`form-control ${errors.emailmobile && touched.emailmobile ? 'is-invalid' : ''}`}
                                        placeholder="Enter Mobile Number"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage name="emailmobile" component="div" className="field-error text-danger" />

                                    {errorMessage && (
                                        <div className="alert alert-danger mt-2" role="alert">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <span className="focus-border" />
                                </div>

                                {/* reCAPTCHA Wrapper */}
                                <div ref={recaptchaWrapperRef} className="my-3" style={{ minHeight: '70px' }} />

                                <button
                                    type="submit"
                                    className="rbt-btn btn-gradient w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </Form>
                        )}

                        {showOtp && (
                            <Form onSubmit={handleOtpSubmit} className="auth-register-form mt-1">
                                <p className="mb-3 fw-medium">Enter 6-digit OTP sent to your mobile</p>
                                <div className="otpContainer d-flex gap-2 justify-content-center mb-4">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            maxLength="1"
                                            className="otpInput form-control text-center"
                                            style={{ width: '48px', height: '52px', fontSize: '1.4rem' }}
                                            value={otpValues[`otp${i}`]}
                                            onChange={(e) => handleOtpChange(`otp${i}`, e)}
                                            onKeyUp={inputFocus}
                                            tabIndex={i}
                                            autoComplete="off"
                                        />
                                    ))}
                                </div>
                                <button type="submit" className="rbt-btn btn-gradient w-100">
                                    Verify OTP
                                </button>
                            </Form>
                        )}

                        {showNewPass && <NewPass />}

                        <p className="description mt-4 text-center">
                            <Link href="/login" className="text-decoration-none text-primary fw-medium">
                                Sign in instead
                            </Link>
                        </p>
                    </>
                )}
            </Formik>
        </div>
    );
};

export default LostPass;