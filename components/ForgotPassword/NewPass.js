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
    newpassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(14, 'Only 14 characters allowed')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        )
        .required('New password is required'),
    confirmpassword: Yup.string()
        .oneOf([Yup.ref('newpassword'), null], 'Passwords must match')
        .required('Confirm password is required')
});

let newPsw = ''
let ConfPsw = ''
let pwdMsg = ''

const MySwal = withReactContent(Swal);


function validateNewPassword(value) {
    console.log(value)
    newPsw = value
}

function validateConfirmPassword(value) {
    // console.log(value)
    let error = ''
    ConfPsw = value
    if (newPsw && ConfPsw) {
        if (newPsw !== ConfPsw) {
            pwdMsg = 'Confirm password do not match'
        } else {
            pwdMsg = ''
        }
    }
    if (pwdMsg) {
        error = pwdMsg
    }

    return error
}

const NewPassword = () => {
    const REACT_APP = API_URL
    const router = useRouter();
    const [sFName, setSFName] = useState('');
    const [sLName, setSLName] = useState('');
    const [sPassword, setSPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roleID, setRoleID] = useState('');
    const [em, setem] = useState('')
    const [emName, setemName] = useState('')

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
        const em = JSON.parse(localStorage.getItem('userUpdateData')).emname ? (JSON.parse(localStorage.getItem('userUpdateData')).em) : ''
        const emName = JSON.parse(localStorage.getItem('userUpdateData')).emname ? (JSON.parse(localStorage.getItem('userUpdateData')).emname) : ''
        setem(em)
        setemName(emName)
    }, []);

    return (
        <Formik
            validationSchema={UserValidationSchema}
            initialValues={{
                newpassword: '',
                confirmpassword: ''
            }}
            enableReinitialize={true}
            onSubmit={async (input, { resetForm }) => {
                await Axios.put(`${API_URL}/api/registration/updateForgotPassword/${em}/${emName}/${ConfPsw}`, '1', {
                    headers: {
                        ApiKey: `${API_KEY}`
                    }
                }).then(res => {
                    console.log(res)
                    const retData = JSON.parse(res.data);
                    resetForm({});
                    if (retData.success === "1") {
                        { SuccessAlert(retData) }
                        router.push('/login')

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
                            {/*<p className="description mt--20">*/}
                            {/*    Fill in the form below to get instant access*/}
                            {/*</p>*/}
                            <Form className='auth-register-form mt-2'>
                                <FormGroup>
                                    <Label style={{ fontSize: '15px' }} className='form-label' for='sFName'>
                                        New Password<span className="text-danger">*</span>
                                    </Label>
                                    <Field validate={validateNewPassword} name="newpassword" type="password" size={'sm'} className={`form-control ${errors.newpassword && touched.newpassword && 'is-invalid'}`} placeholder="******" />

                                    {/*<Field name="sFName" type="text" size={'sm'}*/}
                                    {/*       className={`form-control ${errors.sFName && touched.sFName && 'is-invalid'}`}*/}
                                    {/*       placeholder="Enter First Name" value={sFName} onChange={handleFirstName}/>*/}
                                    <ErrorMessage name='newpassword' component='div' className='field-error text-danger' />
                                </FormGroup>
                                <FormGroup>
                                    <Label style={{ fontSize: '15px' }} className='form-label' for='sLName'>
                                        Last Name<span className="text-danger">*</span>
                                    </Label>
                                    <Field validate={validateConfirmPassword} name="confirmpassword" type="password" size={'sm'} className={`form-control ${errors.confirmpassword && touched.confirmpassword && 'is-invalid'}`} placeholder="******" />

                                    {/*<Field name="sLName" type="text" size={'sm'}*/}
                                    {/*       className={`form-control ${errors.sLName && touched.sLName && 'is-invalid'}`}*/}
                                    {/*       placeholder="Enter Last Name" autoComplete="new-lname" value={sLName}*/}
                                    {/*       onChange={handleLastName}/>*/}
                                    <ErrorMessage name='confirmpassword' component='div' className='field-error text-danger' />
                                </FormGroup>

                                <FormGroup className={'mb-1'}>
                                    <button className="rbt-btn btn-gradient" type="submit">
                                        Submit
                                    </button>
                                    <br></br>
                                    <p className={'text-muted font-12 mb-1'}>By Signing up, you agree to
                                        our <b><Link href={'/pc/termsofuse'} className={'text-muted'}>Terms of
                                            use</Link></b> and <b><Link href={'/pc/privacypolicy'}
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

export default NewPassword;
