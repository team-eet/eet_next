// Render Prop
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {API_URL, API_KEY} from "../../constants/constant";
import Axios from "axios";
import * as Yup from 'yup'
import Image from "next/image";
import Link from "next/link";
import logo from '../../public/images/logo/eetlogo 1.svg'
import {CardText, Button} from "reactstrap";
import UserReg from "@/components/Register/UserReg";
import { auth } from "@/context/firebase";
import { toast } from 'react-toastify'
import { RecaptchaVerifier, signInWithPhoneNumber, sendSignInLinkToEmail } from 'firebase/auth'
import { SuccessProgressToast, ErrorMessageToast } from "@/components/Services/Toast";
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";

const MySwal = withReactContent(Swal)


let emailOrmobile = ''
let chkErr = ''
const mob = /^(\+\d{1,4})?[1-9]\d{9}$/
const emailpattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i

const REACT_APP = API_URL

function validateMobile(value, e) {
    // console.log(value)
    let error = ''
    if (value === '') {
        error = 'Please enter Email or Mobile Number'
    } else if (isNaN(value)) {
        // console.log('email', value)
        emailOrmobile = 'email'
        if (!emailpattern.test(value)) {
            error = 'Invalid Email'
        }
    } else if (!mob.test(value)) {
        // console.log('mobile', value)
        emailOrmobile = 'mobile'
        // console.log(emailOrmobile, value)
        error = 'Invalid Mobile Number'
    }

    if (value) {
        // console.log(value)
        Axios.get(`${API_URL}/api/registration/CheckEmailMobileExist/${value}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        }).then(res => {
            // console.log('called')
            if (res.data[0].ecnt === 1) {

                if (emailOrmobile === 'mobile') {
                    chkErr = 'Mobile number already exists.'
                } else {
                    chkErr = 'Email already exists.'
                }
            } else {
                chkErr = ''
            }
        })
            .catch(err => {
                toast.error('OTP not sent.')
            })
    }
    if (chkErr) {
        error = chkErr
    }
    return error
}
const UserValidationSchema = Yup.object().shape({
    emailmobile: Yup.string()
        .required('Email or Mobile Number is required')
})
const Registration = () => {
        // const history = useHistory()
        const router = useRouter();
        const [getShowOtp, setShowOtp] = useState(false)
        const [getShowEmailMob, sethowEmailMob] = useState(true)
        const [getRegister, setRegister] = useState(false)
        const [timer, setTimer] = useState(true)
        const [result, setresult] = useState('')
        const [codeSent, setcodeSent] = useState(false)
        const [otpValues, setOtpValues] = useState({
            otp1: '',
            otp2: '',
            otp3: '',
            otp4: '',
            otp5: '',
            otp6: ''
        });

        const handleChange = (valueName, event) => {
            setOtpValues({
                ...otpValues,
                [valueName]: event.target.value
            });
        };

        const inputFocus = (event) => {
            if (event.key === "Delete" || event.key === "Backspace") {
                const next = event.target.tabIndex - 2
                if (next > -1) {
                    event.target.form.elements[next].focus()
                }
            } else {
                const next = event.target.tabIndex
                if (next < 6) {
                    event.target.form.elements[next].focus()
                }
            }
        };

        const secondsToTime = (secs) => {
            const hours = Math.floor(secs / (60 * 60));

            const divisor_for_minutes = secs % (60 * 60);
            const minutes = Math.floor(divisor_for_minutes / 60);

            const divisor_for_seconds = divisor_for_minutes % 60;
            const seconds = Math.ceil(divisor_for_seconds);

            const obj = {
                h: hours,
                m: minutes,
                s: seconds
            };
            return obj;
        };

        const timeObj = secondsToTime(3666)
        const handleSubmit = (event) => {
            event.preventDefault(); // Prevent default form submission behavior
            // setRegister(true)

            const { otp1, otp2, otp3, otp4, otp5, otp6 } = otpValues;

            // Check if all OTP fields are filled
            if (otp1 && otp2 && otp3 && otp4 && otp5 && otp6) {
                const finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;

                // Assuming this.state.result.confirm() returns a Promise
                result.confirm(finalOtp)
                    .then((result) => {
                        setShowOtp(false)
                        setRegister(true)
                    }).catch((err) => {
                    toast.error('Invalid OTP');
                });
            } else {
                alert("Please enter OTP");
            }
        };
        useEffect(() => {
            if (timer === 0 && seconds > 0) {
                setTimer(setInterval(countDown, 1000));
            }
            return () => {
                clearInterval(timer);
            };
        }, []);

        const startTimer = () => {
            if (timer === 0 && seconds > 0) {
                setTimer(setInterval(countDown, 1000));
            }
        };

        const resendTimer = () => {
            // history.push('/registration');
            setSeconds(120);
            clearInterval(timer);
            setTimer(setInterval(countDown, 1000));
            setOtpValues({
                otp1: '',
                otp2: '',
                otp3: '',
                otp4: '',
                otp5: '',
                otp6: ''
            });
        };

        const countDown = () => {
            const newSeconds = seconds - 1;
            setSeconds(newSeconds);
            if (newSeconds === 0) {
                clearInterval(timer);
            }
        };

        const setupRecaptcha = () => {
            window.recaptchaVerifier = new RecaptchaVerifier(
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                        onSignInSubmit();
                    },
                },
                auth
            );
        };
        return (
            <>
                <div>
                    {/*<h1>Any place in your app!</h1>*/}
                    <Formik
                        validationSchema={UserValidationSchema}
                        initialValues={{
                            emailmobile: ''
                        }}
                        onSubmit={(input, {setSubmitting}) => {
                            const phone = `+91${input.emailmobile}`
                            // alert('hello')

                            if (emailpattern.test(input.emailmobile)) {
                                //for users entering EMAIL
                                sendSignInLinkToEmail(auth, input.emailmobile, {
                                    // this is the URL that we will redirect back to after clicking on the link in mailbox
                                    // url: 'https://eet-frontend.azurewebsites.net/userreg',
                                    url: 'https://eetenglish.com/register',
                                    handleCodeInApp: true
                                }).then(() => {
                                    alert('hello')
                                    console.log(input.emailmobile, emailOrmobile)
                                    // localStorage.setItem('email', email)
                                    // setLoginLoading(false)
                                    // setLoginError('')
                                    // this.setState({ infoEmail : true })
                                    const userData = { em: (input.emailmobile), emname: (emailOrmobile) }
                                    localStorage.setItem('userRegData', JSON.stringify(userData))
                                    alert('We have sent you an email with a link to sign in')
                                    Axios.get(`${API_URL}/api/registration/getRegData/${EncryptData(input.emailmobile)}/${EncryptData(emailOrmobile)}`, {
                                        headers: {
                                            ApiKey: `${API_KEY}`
                                        }
                                    }).then(res => {
                                        const retData = DecryptData(res.data)
                                        setRegister(true)
                                        // console.log('api called', retData)
                                        // const retData = JSON.parse(res.data)
                                        toast.success(<SuccessProgressToast pdata={retData} />)
                                        resetForm({})
                                        // this.props.history.push({
                                        //     pathname: '/regotp',
                                        //     usrdata: { em: EncryptData(input.emailmobile), emname: EncryptData(emailOrmobile), otp: EncryptData(retData.OTP) }
                                        // })
                                    })

                                }).catch(err => {
                                    // console.error('Firebase Error:', err.code, err.message)

                                    // alert(err)
                                })

                            } else {
                                //for users entering PHONE NUMBER
                                const verify = new RecaptchaVerifier(auth, 'recaptcha', {})
                                // console.log(verify)
                                // setupRecaptcha()

                                const confirmation = signInWithPhoneNumber(auth, phone, verify).then((code) => {
                                    window.code = code
                                    setresult(code)
                                    sethowEmailMob(false)
                                    setShowOtp(true)
                                    setcodeSent(true)
                                    const userData = { em: (input.emailmobile), emname: (emailOrmobile), otp: (code) }

                                    localStorage.setItem('userRegData', JSON.stringify(userData))
                                    Axios.get(`${API_URL}/api/registration/getRegData/${EncryptData(input.emailmobile)}/${EncryptData(emailOrmobile)}`, {
                                        headers: {
                                            ApiKey: `${API_KEY}`
                                        }
                                    }).then(res => {
                                        // console.log(res.data)
                                        const retData = DecryptData(res.data)
                                        toast.success(<SuccessProgressToast pdata={retData} />, { hideProgressBar: true })
                                        resetForm({})
                                    })
                                        .catch(err => {
                                            toast.error('OTP not sent.')
                                        })
                                })
                                    .catch((err) => {
                                        console.log(err)
                                        setShowOtp(false)
                                        sethowEmailMob(true)
                                        setcodeSent(false)
                                        // MySwal.fire({
                                        //     title: 'Info',
                                        //     text: 'You have sent too many requests in given amount of time. Please try again later!',
                                        //     icon: 'info',
                                        //     customClass: {
                                        //         confirmButton: 'btn btn-primary'
                                        //     },
                                        //     buttonsStyling: false
                                        // }).then(() => {
                                        //     // window.location.reload()
                                        // })
                                    })
                            }
                        }}
                    >
                        {({errors, touched, isSubmitting}) => (
                            <div>
                                <Image
                                    src={logo}
                                    priority={true}
                                    className={'w-25'}
                                    alt="Education Logo Images"
                                />

                                <h4 className="title mt-5">Create New Account</h4>

                                {getShowEmailMob ? <>
                                    <Form method={'post'}>
                                        <p className="description mt--20">
                                            Enter your detail to get OTP verification
                                        </p>
                                        {/*<Field type="email" name="email" />*/}
                                        {/*<ErrorMessage name="email" component="div" />*/}
                                        {/*<Field type="password" name="password" />*/}
                                        {/*<ErrorMessage name="password" component="div" />*/}

                                        <div className="form-group">
                                            <Field validate={validateMobile} name="emailmobile" type="text"
                                                   size={'sm'} autoComplete="off"
                                                   className={`form-control ${errors.emailmobile && touched.emailmobile && 'is-invalid'}`}
                                                   placeholder="Enter Email or Mobile number"/>
                                            <ErrorMessage name='emailmobile' component='div'
                                                          className='field-error text-danger'/>
                                            {codeSent ? <>
                                                <p className={'m-0 text-success text-dark'}>Otp Sent to the entered mobile number</p>
                                            </> : <></>}
                                            <span className="focus-border"></span>
                                        </div>
                                        <div id="recaptcha" className={'m-t-5 mb-3'}></div>
                                        <button className="rbt-btn btn-gradient" type="submit" disabled={isSubmitting}>
                                            Submit
                                        </button>
                                    </Form>
                                </> : <></>}

                                {getShowOtp ? <>
                                    <Form className='auth-register-form mt-1' onSubmit={handleSubmit}>
                                        <CardText className='mb-2'>Enter OTP</CardText>
                                        <div className="otpContainer">
                                            <input
                                                name="otp1"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={otpValues.otp1}
                                                onChange={(e) => handleChange('otp1', e)}
                                                tabIndex="1"
                                                maxLength="1"
                                                onKeyUp={inputFocus}
                                            />
                                            <input
                                                name="otp2"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={otpValues.otp2}
                                                onChange={(e) => handleChange('otp2', e)}
                                                onKeyUp={inputFocus}
                                                tabIndex="2"
                                                maxLength="1"
                                            />
                                            <input
                                                name="otp3"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={otpValues.otp3}
                                                onChange={(e) => handleChange('otp3', e)}
                                                onKeyUp={inputFocus}
                                                tabIndex="3" maxLength="1"

                                            />
                                            <input
                                                name="otp4"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={otpValues.otp4}
                                                onChange={(e) => handleChange('otp4', e)}
                                                onKeyUp={inputFocus}
                                                tabIndex="4" maxLength="1"
                                            />

                                            <input
                                                name="otp5"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={otpValues.otp5}
                                                onChange={(e) => handleChange('otp5', e)}
                                                onKeyUp={inputFocus}
                                                tabIndex="5" maxLength="1"
                                            />

                                            <input
                                                name="otp6"
                                                type="text"
                                                autoComplete="off"
                                                className="otpInput"
                                                value={otpValues.otp6}
                                                onChange={(e) => handleChange('otp6', e)}
                                                onKeyUp={inputFocus}
                                                tabIndex="6" maxLength="1"
                                            />
                                        </div>
                                        <button className="rbt-btn btn-gradient mt-4" type="submit">
                                            Submit
                                        </button>
                                        <div id="recaptcha-container" className={"m-t-5 mb-3"}></div>
                                    </Form>
                                </> : <></>}

                                {getRegister ? <UserReg /> : ''}
                                <p className="description mt--20">
                                    Already have an account? {" "}
                                    <Link
                                        className=""
                                        href="/login"
                                    >
                                        <span>Sign in instead</span>
                                    </Link>
                                </p>
                            </div>
                        )}
                    </Formik>
                </div>
            </>
        )
    }
;

export default Registration;