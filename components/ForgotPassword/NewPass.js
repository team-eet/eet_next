import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Axios from 'axios';
import { SuccessAlert, ErrorAlert, ErrorDefaultAlert } from '../Services/SweetAlert';
import { API_URL, API_KEY } from '../../constants/constant';

const validationSchema = Yup.object().shape({
    newpassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(14, 'Only 14 characters allowed')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
        )
        .required('New password is required'),
    confirmpassword: Yup.string()
        .oneOf([Yup.ref('newpassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const NewPass = () => {
    const router = useRouter();
    const [em, setEm] = useState('');
    const [emName, setEmName] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('userUpdateData');
        if (data) {
            const parsed = JSON.parse(data);
            setEm(parsed.em || '');
            setEmName(parsed.emname || 'mobile');
        }
    }, []);

    // Eye SVG Icon
    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    // Eye Off SVG Icon
    const EyeOffIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    return (
        <Formik
            validationSchema={validationSchema}
            initialValues={{ newpassword: '', confirmpassword: '' }}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
                try {
                    const res = await Axios.put(
                        `${API_URL}/api/registration/updateForgotPassword/${em}/${emName}/${values.confirmpassword}`,
                        '1',
                        { headers: { ApiKey: API_KEY } }
                    );
                    const retData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                    resetForm();
                    if (retData.success === "1") {
                        SuccessAlert(retData);
                        router.push('/login');
                    } else {
                        ErrorAlert(retData);
                    }
                } catch (err) {
                    ErrorDefaultAlert(err);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form className="auth-register-form mt-2">
                    {/* New Password */}
                    <div className="form-group mb-4">
                        <label className="form-label fw-semibold text-dark"></label>
                        <div className="position-relative">
                            <Field
                                name="newpassword"
                                type={showNewPassword ? "text" : "password"}
                                className={`form-control form-control-lg pe-5 ${errors.newpassword && touched.newpassword ? 'is-invalid' : ''}`}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                className="btn position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0 text-secondary"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{
                                    fontSize: '1.5rem',
                                    lineHeight: 1,
                                    zIndex: 10,
                                }}
                            >
                                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <ErrorMessage name="newpassword" component="div" className="text-danger mt-2 small fw-medium" />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group mb-4">
                        <label className="form-label fw-semibold text-dark"></label>
                        <div className="position-relative">
                            <Field
                                name="confirmpassword"
                                type={showConfirmPassword ? "text" : "password"}
                                className={`form-control form-control-lg pe-5 ${errors.confirmpassword && touched.confirmpassword ? 'is-invalid' : ''}`}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                className="btn position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0 text-secondary"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    fontSize: '1.5rem',
                                    lineHeight: 1,
                                    zIndex: 10,
                                }}
                            >
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <ErrorMessage name="confirmpassword" component="div" className="text-danger mt-2 small fw-medium" />
                    </div>

                    {/* Fixed Update Password Button */}
                    <button
                        type="submit"
                        className="rbt-btn btn-gradient w-100 py-3 mt-3"
                        disabled={isSubmitting}
                        style={{
                            fontSize: '1.6rem',
                            fontWeight: 600,
                            height: '54px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isSubmitting ? 'Updating Password...' : 'Update Password'}
                    </button>

                    <div className="text-center mt-4">

                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default NewPass;