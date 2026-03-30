import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Axios from 'axios';
import * as Yup from 'yup';
import { Row, Col, CardTitle, CardText, FormGroup, Label, Button } from 'reactstrap';
// import '@styles/base/pages/page-auth.scss';
import { SuccessAlert, ErrorAlert, ErrorDefaultAlert } from '../Services/SweetAlert';
import { DecryptData, EncryptData } from '../Services/encrypt-decrypt';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {API_URL, API_KEY} from "../../constants/constant";

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
    const REACT_APP = API_URL
    const router = useRouter();
    const [sFName, setSFName] = useState('');
    const [sLName, setSLName] = useState('');
    const [sPassword, setSPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roleID, setRoleID] = useState('');

    // const history = useHistory();

    const handleFirstName = (e) => {
        setSFName(e.target.value);
    };

    const handleLastName = (e) => {
        setSLName(e.target.value);
    };

    const handlePassword = (e) => {
        setSPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const checkRole = () => {
        if (localStorage.getItem('lgntr')) {
            const userinfo = localStorage.getItem('lgntr');
            if (userinfo === '1') {
                setRoleID('3');
            }
        } else if (localStorage.getItem('lgninst')) {
            const userinfo = localStorage.getItem('lgninst');
            if (userinfo === '1') {
                setRoleID('4');
            }
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
                sEmail: localStorage.getItem('userRegData') ? JSON.parse(localStorage.getItem('userRegData')).emname === 'email' ? EncryptData(JSON.parse(localStorage.getItem('userRegData')).em) : '' : '',
                sMobile: localStorage.getItem('userRegData') ? JSON.parse(localStorage.getItem('userRegData')).emname === 'mobile' ? EncryptData(JSON.parse(localStorage.getItem('userRegData')).em) : '' : ''
            }}
            enableReinitialize={true}
            onSubmit={async (input, { resetForm }) => {
                await Axios.post(`${API_URL}/api/registration/InsertUserRegData/${EncryptData(input)}`, 1, {
                    headers: {
                        ApiKey: `${API_KEY}`
                    }
                }).then(res => {
                    // console.log(res)
                    const retData = JSON.parse(res.data);
                    resetForm({});
                    if (retData.success === "1") {
                        MySwal.fire({
                            title: retData.message,
                            icon: 'success',
                            confirmButtonText: 'Login',
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            },
                            buttonsStyling: false
                        });
                        if (localStorage.getItem('lgntr')) {
                            const userinfo = localStorage.getItem('lgntr');
                            if (userinfo === '1') {
                                if (!localStorage.getItem('regid')) {
                                    localStorage.setItem('regid', retData.rid);
                                }
                                // router.push("/tutorreg");
                            }
                        } else {
                            router.push("/login");
                        }

                        if (localStorage.getItem('lgninst')) {
                            const userinfo = localStorage.getItem('lgninst');
                            if (userinfo === '1') {
                                if (!localStorage.getItem('regid')) {
                                    localStorage.setItem('regid', retData.rid);
                                }
                                // router.push("/institutionalpartenerreg");
                            }
                        } else {
                            router.push("/login");
                        }

                    } else if (retData.success === "0") {
                        ErrorAlert(retData);
                    }
                }).catch(err => {
                    ErrorDefaultAlert(err);
                });
            }}
        >
            {({ errors, touched }) => (
                <div className='auth-wrapper auth-v2'>
                    <Row className='auth-inner m-0'>
                        {/*<Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='5' sm='12'>*/}
                        <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
                            <p className="description mt--20">
                                Fill in the form below to get instant access
                            </p>
                            <Form className='auth-register-form mt-2'>
                                <FormGroup>
                                    <Label style={{ fontSize: '15px' }} className='form-label' for='sFName'>
                                        First Name<span className="text-danger">*</span>
                                    </Label>
                                    <Field name="sFName" type="text" size={'sm'}
                                           className={`form-control ${errors.sFName && touched.sFName && 'is-invalid'}`}
                                           placeholder="Enter First Name" value={sFName} onChange={handleFirstName}/>
                                    <ErrorMessage name='sFName' component='div' className='field-error text-danger'/>
                                </FormGroup>
                                <FormGroup>
                                    <Label style={{ fontSize: '15px' }} className='form-label' for='sLName'>
                                        Last Name<span className="text-danger">*</span>
                                    </Label>
                                    <Field name="sLName" type="text" size={'sm'}
                                           className={`form-control ${errors.sLName && touched.sLName && 'is-invalid'}`}
                                           placeholder="Enter Last Name" autoComplete="new-lname" value={sLName}
                                           onChange={handleLastName}/>
                                    <ErrorMessage name='sLName' component='div' className='field-error text-danger'/>
                                </FormGroup>
                                <FormGroup>
                                    <Label style={{ fontSize: '15px' }} className='form-label' for='sPassword'>
                                        Create new password<span className="text-danger">*</span>
                                    </Label>
                                    <Field name="sPassword" type="password" size={'sm'}
                                           className={`form-control ${errors.sPassword && touched.sPassword && 'is-invalid'}`}
                                           placeholder="******" autoComplete="new-password" value={sPassword}
                                           onChange={handlePassword}/>
                                    <ErrorMessage name='sPassword' component='div' className='field-error text-danger'/>
                                </FormGroup>
                                <FormGroup>
                                    <Label style={{ fontSize: '15px' }} className='form-label' for='confirmPassword'>
                                        Confirm new password<span className="text-danger">*</span>
                                    </Label>
                                    <Field name="confirmPassword" type="password" size={'sm'}
                                           className={`form-control ${errors.confirmPassword && touched.confirmPassword && 'is-invalid'}`}
                                           placeholder="******" value={confirmPassword}
                                           onChange={handleConfirmPassword}/>
                                    <ErrorMessage name='confirmPassword' component='div'
                                                  className='field-error text-danger'/>
                                </FormGroup>
                                <FormGroup className={'mb-1'}>
                                    <button className="rbt-btn btn-gradient" type="submit">
                                        Submit
                                    </button>
                                    {/*<Button.Ripple className={''} color='primary'*/}
                                    {/*               type='submit'>Submit</Button.Ripple>*/}
                                    <br></br>
                                    <p className={'text-muted font-12 mb-1'}>By Signing up, you agree to our <b>
                                        <Link href={'/pc/termsofuse'} className={'text-muted'}>
                                            Terms of use</Link>
                                    </b> and <b><Link href={'/pc/privacypolicy'}
                                                                        className={'text-muted'}>Privacy
                                            Policy</Link></b></p>
                                </FormGroup>
                            </Form>
                        </Col>
                        {/*</Col>*/}
                    </Row>
                </div>
            )}
        </Formik>
    );
};

export default UserReg;
