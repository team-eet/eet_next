import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Axios from 'axios';
import * as Yup from 'yup';
import { Row, Col, FormGroup, Label } from 'reactstrap';
import { SuccessAlert, ErrorAlert, ErrorDefaultAlert } from '../Services/SweetAlert';
import { DecryptData, EncryptData } from '../Services/encrypt-decrypt';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { API_URL, API_KEY } from "../../constants/constant";

const UserValidationSchema = Yup.object().shape({
    sFName: Yup.string()
        .required('First Name is required'),
    sLName: Yup.string()
        .required('Last Name is required'),
    sPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(14, 'Only 14 characters allowed')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        )
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('sPassword'), null], 'Passwords must match')
        .required('Confirm Password is required')
});

const MySwal = withReactContent(Swal);

const UserReg = () => {
    const router = useRouter();
    const [sFName, setSFName] = useState('');
    const [sLName, setSLName] = useState('');
    const [sPassword, setSPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roleID, setRoleID] = useState('2'); // Default to '2'

    const handleFirstName = (e) => setSFName(e.target.value);
    const handleLastName = (e) => setSLName(e.target.value);
    const handlePassword = (e) => setSPassword(e.target.value);
    const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);

    const checkRole = () => {
        const lgntr = localStorage.getItem('lgntr');
        const lgninst = localStorage.getItem('lgninst');

        if (lgntr === '1') {
            setRoleID('3');
        } else if (lgninst === '1') {
            setRoleID('4');
        } else {
            setRoleID('2');
        }
    };

    useEffect(() => {
        checkRole();
    }, []);

    return (
        <Formik
            validationSchema={UserValidationSchema}
            initialValues={{
                nRoleId: roleID,
                sFName,
                sLName,
                sPassword,
                confirmPassword,
                sEmail: localStorage.getItem('userRegData')
                    ? (JSON.parse(localStorage.getItem('userRegData')).emname === 'email'
                        ? EncryptData(JSON.parse(localStorage.getItem('userRegData')).em) : '') : '',
                sMobile: localStorage.getItem('userRegData')
                    ? (JSON.parse(localStorage.getItem('userRegData')).emname === 'mobile'
                        ? EncryptData(JSON.parse(localStorage.getItem('userRegData')).em) : '') : ''
            }}
            enableReinitialize={true}
            onSubmit={async (values, { resetForm }) => {
                try {
                    const response = await Axios.post(`${API_URL}/api/registration/InsertUserRegData/${EncryptData(values)}`, 1, {
                        headers: { ApiKey: `${API_KEY}` }
                    });

                    const retData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

                    if (retData.success === "1") {
                        resetForm();
                        MySwal.fire({
                            title: retData.message || "Registration Successful",
                            icon: 'success',
                            confirmButtonText: 'Login',
                            customClass: { confirmButton: 'btn btn-primary' },
                            buttonsStyling: false
                        }).then(() => {
                            // Handle redirection logic
                            const lgntr = localStorage.getItem('lgntr');
                            const lgninst = localStorage.getItem('lgninst');

                            if (retData.rid) {
                                localStorage.setItem('regid', retData.rid);
                            }

                            if (lgntr === '1') {
                                router.push("/tutorreg");
                            } else if (lgninst === '1') {
                                router.push("/institutionalpartenerreg");
                            } else {
                                router.push("/login");
                            }
                        });
                    } else {
                        ErrorAlert(retData);
                    }
                } catch (err) {
                    ErrorDefaultAlert(err);
                }
            }}
        >
            {({ errors, touched }) => (
                <div className='auth-wrapper auth-v2'>
                    <Row className='auth-inner m-0'>
                        <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
                            <p className="description mt--20">
                                Fill in the form below to get instant access
                            </p>
                            <Form className='auth-register-form mt-2'>
                                <FormGroup>
                                    <Label className='form-label' for='sFName' style={{ fontSize: '15px' }}>
                                        First Name<span className="text-danger">*</span>
                                    </Label>
                                    <Field
                                        name="sFName"
                                        type="text"
                                        className={`form-control ${errors.sFName && touched.sFName && 'is-invalid'}`}
                                        placeholder="Enter First Name"
                                        value={sFName}
                                        onChange={handleFirstName}
                                    />
                                    <ErrorMessage name='sFName' component='div' className='field-error text-danger'/>
                                </FormGroup>

                                <FormGroup>
                                    <Label className='form-label' for='sLName' style={{ fontSize: '15px' }}>
                                        Last Name<span className="text-danger">*</span>
                                    </Label>
                                    <Field
                                        name="sLName"
                                        type="text"
                                        className={`form-control ${errors.sLName && touched.sLName && 'is-invalid'}`}
                                        placeholder="Enter Last Name"
                                        autoComplete="new-lname"
                                        value={sLName}
                                        onChange={handleLastName}
                                    />
                                    <ErrorMessage name='sLName' component='div' className='field-error text-danger'/>
                                </FormGroup>

                                <FormGroup>
                                    <Label className='form-label' for='sPassword' style={{ fontSize: '15px' }}>
                                        Create new password<span className="text-danger">*</span>
                                    </Label>
                                    <Field
                                        name="sPassword"
                                        type="password"
                                        className={`form-control ${errors.sPassword && touched.sPassword && 'is-invalid'}`}
                                        placeholder="******"
                                        autoComplete="new-password"
                                        value={sPassword}
                                        onChange={handlePassword}
                                    />
                                    <ErrorMessage name='sPassword' component='div' className='field-error text-danger'/>
                                </FormGroup>

                                <FormGroup>
                                    <Label className='form-label' for='confirmPassword' style={{ fontSize: '15px' }}>
                                        Confirm new password<span className="text-danger">*</span>
                                    </Label>
                                    <Field
                                        name="confirmPassword"
                                        type="password"
                                        className={`form-control ${errors.confirmPassword && touched.confirmPassword && 'is-invalid'}`}
                                        placeholder="******"
                                        value={confirmPassword}
                                        onChange={handleConfirmPassword}
                                    />
                                    <ErrorMessage name='confirmPassword' component='div' className='field-error text-danger'/>
                                </FormGroup>

                                <FormGroup className='mb-1'>
                                    <button className="rbt-btn btn-gradient" type="submit">
                                        Submit
                                    </button>
                                    <br />
                                    <p className='text-muted font-12 mb-1'>
                                        By Signing up, you agree to our <b>
                                        <Link href='/pc/TermsOfService'>
                                            <span className='text-muted' style={{ cursor: 'pointer' }}>Terms of use</span>
                                        </Link>
                                    </b> and <b>
                                        <Link href='/pc/privacypolicy'>
                                            <span className='text-muted' style={{ cursor: 'pointer' }}>Privacy Policy</span>
                                        </Link>
                                    </b>
                                    </p>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </div>
            )}
        </Formik>
    );
};

export default UserReg;