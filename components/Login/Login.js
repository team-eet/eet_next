import Link from "next/link";
import React, {useState, useEffect} from "react";
import {EncryptData, DecryptData} from "@/components/Services/encrypt-decrypt";
import { Facebook, Twitter, Mail, GitHub, Eye, EyeOff } from 'react-feather'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { Row, Col, CardTitle, CardText, FormGroup, Label, CustomInput, Button } from 'reactstrap'
import { toast } from 'react-toastify'
import Axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/router';
import { API_URL, API_KEY } from "../../constants/constant";
import { SuccessProgressToast } from '@/components/Services/Toast'
import { InfoAlert, ErrorAlert } from "@/components/Services/SweetAlert";

const UserValidationSchema = Yup.object().shape({
  username: Yup.string()
      .required('Username is required'),
  password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(14, 'Only 14 characters allowed')
      .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain at least 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .required('Password is required')
})

let emailOrmobile = 'NA'

function validateMobile(value) {
  let error = ''
  const mob = /^(\+\d{1,4})?[1-9]\d{9}$/
  // const mob = /^[1-9]{1}[0-9]{9}$/
  const emailpattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i

  if (value === '') {
    error = 'Please enter Username'
  } else if (isNaN(value)) {
    emailOrmobile = 'email'
    if (!emailpattern.test(value)) {
      error = 'Invalid Email'
    }
  } else if (!mob.test(value)) {
    emailOrmobile = 'mobile'
    error = 'Invalid Mobile Number'
  }
  return error
}
const Login = () => {
  const router = useRouter()
  const REACT_APP = API_URL
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loginsts, setLoginsts] = useState(false);
  const [eyehideshow, setEyehideshow] = useState(false);
  const [showPass, setshowPass] = useState(false);

  const [fieldtype, setFieldType] = useState('password');
  const [redirectTo, setRedirectTo] = useState(null);

  const [passwordShown, setPasswordShown] = useState(false);

  const handleChangePsw = () => {
    // // setEyehideshow(true);
    // setshowPass(true)
    // // setFieldType(eyehideshow ? 'text' : 'password');
    // var x = document.getElementById("passwordField");
    // if (fieldtype === "password") {
    //   x.type = "text";
    // } else {
    //   x.type = "password";
    // }

    setPasswordShown(!passwordShown);
    let temp = document.getElementById("typepass");

    if (temp.type === "password") {
      temp.type = "text";
    }
    else {
      temp.type = "password";
    }
  }

  useEffect(() => {
    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    setUsername(username)
    setPassword(password)
    if (localStorage.getItem('checkbox') && localStorage.getItem('username') !== "") {
      setIsChecked(true);
      setUsername(localStorage.getItem('username'));
      setPassword(DecryptData(localStorage.getItem('password').toString()));
    }
    // Call your method here if needed
    // GetCompanySettings();
  }, []);
  const onChangeCheckbox = (event) => {
    setIsChecked(event.target.checked)
  }

  const handleToggle = () =>{

  }


  return (
      <>
        <div className="col-lg-6">
          <div className="rbt-contact-form contact-form-style-1 max-width-auto">
            <h3 className="title">Login</h3>
            <Formik
                validationSchema={UserValidationSchema}
                initialValues={{
                  username: username,
                  password : password
                }}
                enableReinitialize={true}
                onSubmit={(input, { resetForm }) => {
                  setIsLoading(true)
                  // console.log(input)
                  const mob = /^(\+\d{1,4})?[1-9]\d{9}$/
                  // const mob = /^[1-9]{1}[0-9]{9}$/
                  const emailpattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
                  if (emailpattern.test(input.username)) {
                    emailOrmobile = 'email'
                    // console.log('email')
                  } else {
                    emailOrmobile = 'mobile'
                    // console.log('mobile')
                  }

                  // validateMobile(input.username)
                  console.log(emailOrmobile)
                  const checkdata = {
                    Username: input.username,
                    Password: input.password,
                    EM: emailOrmobile
                  }
                  // console.log(EncryptData(checkdata))
                  Axios.get(`${API_URL}/api/token/getUserRegData/${EncryptData(checkdata)}`, {
                    headers: {
                      ApiKey: `${API_KEY}`
                    }
                  }).then(res => {

                    if (res.data) {
                      const retData = DecryptData(res.data)
                      const srt = DecryptData(res.data)
                      console.log('retData', retData)
                      //check user login is true or false by company setting
                      if (retData.ulogin) {
                        if (retData.success === "1") {
                          localStorage.setItem('userData', JSON.stringify(srt))
                          localStorage.setItem('roles', retData.role)
                          const notificationdata = {
                            nSenderID : EncryptData(0),
                            nReciverID : localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).regid : '',
                            sNMID : EncryptData(3)
                          }
                          // console.log(notificationdata)
                          Axios.post(`${API_URL}/api/notification/InsertNotificationHistory`, notificationdata, {
                            headers: {
                              ApiKey: `${API_KEY}`
                            }
                          }).then(res => {
                            // console.log('api called', res.data)
                          })
                              .catch(err => {
                                toast.error(err)
                              })
                          if (isChecked && input.username !== "") {
                            localStorage.setItem('username', input.username)
                            localStorage.setItem('password', EncryptData(input.password))
                            localStorage.setItem('checkbox', isChecked)
                          } else {
                            localStorage.removeItem('username')
                            localStorage.removeItem('password')
                            localStorage.removeItem('checkbox')
                          }
                          resetForm({})
                          const sharedLink = localStorage.getItem('sharedLink')
                          // if (sharedLink) {
                          //   localStorage.removeItem('sharedLink')
                          //   window.location.href = sharedLink// Redirect to the shared link
                          // } else {

                            router.push('/') // Redirect to home page
                            // window.location.reload()
                            toast.success(<SuccessProgressToast pdata={retData} />, { hideProgressBar: true })
                          // }

                        } else {
                          { ErrorAlert(retData) }
                          setIsLoading(false)
                          resetForm({})
                          // toast.success(<SuccessProgressToast pdata={retData} />)
                          // this.props.history.push("/notauthorized")
                        }
                      } else {
                        const retData = {
                          title: 'Info',
                          message: `Incorrect username or password`
                          // message: `Login temparary unavailable.`
                        }
                        InfoAlert(retData)
                        // toast.error(<ErrorMessageToast pdata={retData} />, { hideProgressBar: true })
                        setTimeout(() => {
                          setIsLoading(false)
                          resetForm({})
                        }, 2000)
                      }
                    }
                  })
                      .catch(err => {
                        toast.error(err)
                      })
                }
                }
            >
              {({ errors, touched }) => (
                  <div className='auth-wrapper auth-v2'>
                    {/*<form className="max-width-auto" method={"post"}>*/}
                    <Form className='auth-login-form mt-2'>
                      <FormGroup>
                        <Label className='form-label' for='username'>
                          Username<span className="text-danger">*</span>
                        </Label>
                        <Field validate={validateMobile} name="username" type="text" size={'sm'}
                               className={`form-control ${errors.username && touched.username && 'is-invalid'}`}
                               placeholder="Enter Email or Mobile number" tabIndex='1'/>
                        <ErrorMessage name='username' component='div' className='field-error text-danger'/>
                      </FormGroup>
                      <Label className='form-label' for='password'>
                        Password<span className="text-danger">*</span>
                      </Label>
                      <FormGroup className='input-group input-group-merge mb-0'>

                        <Field name="password" id="typepass" type={passwordShown ? "text" : "password"} size={'sm'}
                               className={`form-control form-control-merge ${errors.password && touched.password && 'is-invalid'}`}
                               placeholder="******" tabIndex='2'/>
                        <div className="input-group-append">
                          <div className="input-group-text h-100">
                            <Button onClick={handleChangePsw} className={'bg-transparent text-dark border-0'}>
                              {passwordShown ? <EyeOff size={14}/> : <Eye size={14}/>}
                            </Button>
                            {/*{!eyehideshow ? <Eye onClick={handleChangePsw} size={14}/> : <EyeOff onClick={handleChangePsw} size={14}/>}*/}
                            {/*<Button onClick={handleChangePsw}>*/}
                            {/*  {(!eyehideshow) ? (<Eye size={14}/>) : (<EyeOff size={14}/>)}*/}
                            {/*</Button>*/}
                          </div>


                        </div>
                      </FormGroup>

                      {/*<strong>Password</strong>:*/}
                      {/*<input type={passwordShown ? "text" : "password"} value="geeksforgeeks" id="typepass"/>*/}
                      {/*<button onClick={handleChangePsw} style={{border: 'none', background: 'none'}}>*/}
                      {/*  {passwordShown ? <EyeOff size={14}/> : <Eye size={14}/>}*/}
                      {/*</button>*/}
                      {/*<strong>Show Password</strong>*/}

                      <div className="row mb--30">
                        <div className="col-lg-6">
                          <div className="rbt-checkbox">
                            <input type="checkbox" id="rememberme" name="rememberme"/>
                            <label htmlFor="rememberme">Remember me</label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="rbt-lost-password text-end">
                            <Link className="rbt-btn-link" href="/forgotpassword">
                              Lost your password?
                            </Link>
                          </div>
                        </div>
                      </div>
                      <FormGroup>
                        <button className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100" color='primary'
                                type='submit' disabled={isLoading}>
                          {isLoading ? <div>
                            <div role="status" className="spinner-border-sm spinner-border"><span
                                className="sr-only">Loading...</span></div>
                            <span className="ml-50">Loading...</span></div> : <>
                            <span className="icon-reverse-wrapper">
                                <span className="btn-text">Log In</span>
                                <span className="btn-icon">
                                  <i className="feather-arrow-right"></i>
                                </span>
                                <span className="btn-icon">
                                  <i className="feather-arrow-right"></i>
                                </span>
                              </span>
                          </>}
                        </button>
                      </FormGroup>
                      <p className={'text-center'}>
                        Create an account !
                        <Link href={'/register'} className={'ms-1'}>
                          Sign up
                        </Link>
                      </p>
                    </Form>


                    <div className="form-submit-group">

                      {/*<button*/}
                      {/*    type="submit"*/}
                      {/*    className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"*/}
                      {/*>*/}
                      {/*<span className="icon-reverse-wrapper">*/}
                      {/*  <span className="btn-text">Log In</span>*/}
                        {/*  <span className="btn-icon">*/}
                        {/*    <i className="feather-arrow-right"></i>*/}
                        {/*  </span>*/}
                        {/*  <span className="btn-icon">*/}
                        {/*    <i className="feather-arrow-right"></i>*/}
                        {/*  </span>*/}
                        {/*</span>*/}
                        {/*</button>*/}
                      </div>
                    {/*</Form>*/}
                  </div>

              )
              }
            </Formik>

          </div>
        </div>
      </>
  );
};

export default Login;
