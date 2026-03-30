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

const UserValidationSchema = Yup.object().shape({
    emailmobile: Yup.string().required('Mobile Number is required'),
});

const LostPass = () => {
    const [showEmailMob, setShowEmailMob] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [otpError, setOtpError] = useState(''); // State for wrong OTP message
    const [isVerifying, setIsVerifying] = useState(false);

    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

    const recaptchaWrapperRef = useRef(null);
    const recaptchaVerifierRef = useRef(null);
    const isSubmittingRef = useRef(false);
    const inputRefs = useRef([]);

    // --- OTP LOGIC ---

    const handleOtpChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        if (otpError) setOtpError(''); // Clear error message when user starts typing again

        const newOtp = [...otpValues];
        newOtp[index] = value.substring(value.length - 1);
        setOtpValues(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setOtpError('');
        const finalOtp = otpValues.join('');

        if (finalOtp.length !== 6) {
            setOtpError('Please enter all 6 digits');
            return;
        }

        if (!result) {
            toast.error("Session expired. Please request a new OTP.");
            return;
        }

        setIsVerifying(true);
        try {
            await result.confirm(finalOtp);
            toast.success('OTP verified successfully!');
            setShowOtp(false);
            setShowNewPass(true);
        } catch (err) {
            console.error("OTP Error:", err);
            setOtpError('Invalid OTP. The code you entered is incorrect.');
            setOtpValues(["", "", "", "", "", ""]); // Clear fields on error
            inputRefs.current[0].focus(); // Focus first field
        } finally {
            setIsVerifying(false);
        }
    };

    // --- RECAPTCHA CLEANUP ---
    const cleanupRecaptcha = () => {
        if (recaptchaVerifierRef.current) {
            try {
                recaptchaVerifierRef.current.clear();
            } catch (e) { console.warn('Recaptcha clear failed:', e); }
            recaptchaVerifierRef.current = null;
        }
        if (recaptchaWrapperRef.current) {
            recaptchaWrapperRef.current.innerHTML = '';
        }
    };

    useEffect(() => {
        return () => cleanupRecaptcha();
    }, []);

    return (
        <div className="lost-pass-wrapper">
            <Image src={logo} priority className="w-25" alt="Logo" />

            {!showNewPass && (
                <h4 className="title mt-5">
                    {showOtp ? "Verify OTP" : "Forgot Password?"}
                </h4>
            )}

            {showEmailMob && (
                <Formik
                    validationSchema={UserValidationSchema}
                    initialValues={{ emailmobile: '' }}
                    onSubmit={async (values, { setSubmitting }) => {
                        if (isSubmittingRef.current) return;
                        isSubmittingRef.current = true;

                        const input = values.emailmobile.trim();
                        setErrorMessage('');

                        if (!mob.test(input)) {
                            toast.error("Please enter a valid 10-digit mobile number");
                            isSubmittingRef.current = false;
                            setSubmitting(false);
                            return;
                        }

                        const phone = `+91${input}`;

                        try {
                            const checkRes = await Axios.get(
                                `${API_URL}/api/registration/CheckEmailMobileExist/${input}`,
                                { headers: { ApiKey: API_KEY } }
                            );

                            const exists = checkRes.data?.[0]?.ecnt === 1;

                            if (!exists) {
                                setErrorMessage("This mobile number is not registered.");
                                isSubmittingRef.current = false;
                                setSubmitting(false);
                                return;
                            }

                            cleanupRecaptcha();

                            const recaptchaContainer = document.createElement('div');
                            recaptchaContainer.id = 'recaptcha-container';
                            recaptchaWrapperRef.current.appendChild(recaptchaContainer);

                            const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
                                size: 'invisible'
                            });
                            recaptchaVerifierRef.current = recaptchaVerifier;

                            const confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);

                            setResult(confirmationResult);
                            setShowEmailMob(false);
                            setShowOtp(true);

                            localStorage.setItem('userUpdateData', JSON.stringify({ em: input, emname: 'mobile' }));
                            toast.success("OTP sent successfully!");

                        } catch (err) {
                            console.error(err);
                            toast.error("Failed to send OTP. Please try again.");
                        } finally {
                            setSubmitting(false);
                            isSubmittingRef.current = false;
                        }
                    }}
                >
                    {({ errors, touched, isSubmitting }) => (
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
                                {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
                            </div>

                            <div ref={recaptchaWrapperRef} className="my-2" />

                            <button type="submit" className="rbt-btn btn-gradient w-100" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send OTP'}
                            </button>
                        </Form>
                    )}
                </Formik>
            )}

            {showOtp && (
                <div className="otp-section mt-4">
                    <form onSubmit={handleOtpSubmit}>
                        <p className="mb-3">Enter 6-digit OTP sent to your mobile</p>
                        <div className="d-flex gap-2 justify-content-center mb-2">
                            {otpValues.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className={`form-control text-center fw-bold ${otpError ? 'is-invalid' : ''}`}
                                    style={{ width: '45px', height: '50px', fontSize: '1.2rem' }}
                                    maxLength="1"
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    value={data}
                                    onChange={(e) => handleOtpChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        {/* Wrong OTP Message Display */}
                        {otpError && (
                            <div className="text-danger text-center mb-3 small fw-medium">
                                {otpError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="rbt-btn btn-gradient w-100"
                            disabled={isVerifying}
                        >
                            {isVerifying ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                </div>
            )}

            {showNewPass && <NewPass />}

            {!showNewPass && (
                <p className="description mt-4 text-center">
                    <Link href="/login" className="text-decoration-none text-primary fw-medium">
                        Sign in instead
                    </Link>
                </p>
            )}
        </div>
    );
};

export default LostPass;

//new code with wrong otp validation