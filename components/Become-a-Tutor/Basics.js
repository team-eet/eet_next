import React, {useEffect, useState} from "react";
import CounterWidget from "./Dashboard-Section/widgets/CounterWidget";
import MyCourses from "./Dashboard-Section/MyCourses";
import {API_URL, API_KEY} from '../../constants/constant'
import Link from "next/link";
import * as Yup from 'yup'
import { Formik, ErrorMessage, Form } from 'formik'
import Axios from 'axios'
import {ErrorDefaultAlert, InfoDefaultAlert} from "@/components/Services/SweetAlert";
import { useRouter } from "next/router";
import {Button, CardText, Alert} from 'reactstrap'
import {DecryptData} from "@/components/Services/encrypt-decrypt";
import {RecaptchaVerifier, sendSignInLinkToEmail, signInWithPhoneNumber} from "firebase/auth";
import {auth} from "@/context/firebase";
import {toast} from "react-toastify";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const UserValidationSchema = Yup.object().shape({
  sFName: Yup.string()
      .required('This field is required'),
  sLName: Yup.string()
      .required('This field is required'),
  sMobile: Yup.string()
      .required('This field is required'),
  dDOB: Yup.string()
      .required('This field is required'),
  nCountryId: Yup.string()
      .required('This field is required'),
  nStateId: Yup.string()
      .required('This field is required'),
  nCityId: Yup.string()
      .required('This field is required')
})

const emailpattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
let chkErr = ''
let error = ''
const Basics = () => {
    const REACT_APP = API_URL
    const router = useRouter();

    const [sFname, setsFname] = useState('')
    const [sLname, setsLname] = useState('')
    const [sEmail, setsEmail] = useState('')
    const [sMobile, setsMobile] = useState('')
    const [dDOB, setdDOB] = useState('')
    const [sGender, setsGender] = useState('')
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);

    const [countryId, setcountryId] = useState('')
    const [stateId, setstateId] = useState('')
    const [cityId, setcityId] = useState('')

    const [isLoading, setisLoading] = useState(false)
    const handleFname = (e) => {
    setsFname(e.target.value)
  }
    const handleLname = (e) => {
    setsLname(e.target.value)
  }

    const handleEmail = (e) => {
    setsEmail(e.target.value)
  }

    const handleMobile = (e) => {
      setmob_verify(false)
        setsMobile(e.target.value)
  }

    const [ageErrorMessage, setAgeErrorMessage] = useState(''); // State for age validation message

    const range = (start, end, step = 1) => {
        const array = [];
        for (let i = start; i <= end; i += step) {
            array.push(i);
        }
        return array;
    };
    const years = range(1960, new Date().getFullYear() + 1, 1);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const handleDOB = (date) => {

        if (date) {
            const today = new Date();
            const birthDate = new Date(date);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            // Check if the birthday hasn't occurred yet this year
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                setAgeErrorMessage('You must be at least 18 years old.'); // Set error message for age below 18
            } else {
                setAgeErrorMessage(''); // Clear error message if age is 18 or above
                // Proceed with further actions if needed
                setdDOB(date)
            }
        }
    }
    const handleGender = (e) => {
    setsGender(e.target.value)
  }
    const bindCountry = () => {
    Axios.get(`${API_URL}/api/registration/BindCountry`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log(res.data)
          if (res.data.length !== 0) {
            setCountry(res.data)
              // const defaultCountry = res.data.find(item => item.sCountryname === 'India')
              // if (defaultCountry) {
              //     setcountryId(defaultCountry.nCountryId); // Set default countryId to India's ID
              // }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

    const  handleChangeCountry = (e) => {
    if (e.target.value) {
        setstateId('')
        setcityId('')
      setcountryId(e.target.value)
        if (e.target.value !== '') {
            Axios.get(`${API_URL}/api/registration/BindState/${e.target.value}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    console.log(res.data)
                    if (res.data.length !== 0) {
                        setState(res.data)
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
        } else {
            InfoDefaultAlert('Please Select proper country')
        }

    }
  }

    const  handleChangeState = (e) => {
    if (e.target.value) {
        setcityId('')
      setstateId(e.target.value)
        if (e.target.value !== '') {
          Axios.get(`${API_URL}/api/registration/BindCity/${e.target.value}`, {
            headers: {
              ApiKey: `${API_KEY}`
            }
          })
              .then(res => {
                // console.log(res.data)
                if (res.data.length !== 0) {
                  setCity(res.data)
                }
              })
              .catch(err => {
                { ErrorDefaultAlert(err) }
              })
            }
        } else {
            InfoDefaultAlert('Please select proper state')
    }
  }

    const [showEmailCheck, setshowEmailcheck] = useState(false)

    const handleChangeCity = (e) => {

    setcityId(e.target.value)
  }

    const VerifyEmail = () => {
      console.log(sEmail)

      if(emailpattern.test(sEmail)) {
          sendSignInLinkToEmail(auth, sEmail, {
              // this is the URL that we will redirect back to after clicking on the link in mailbox
              // url: 'https://eet-frontend.azurewebsites.net/userreg',
              url: 'http://localhost:3000/become-a-tutor/basics',
              handleCodeInApp: true
          }).then(() => {
              localStorage.setItem('verify_email', sEmail)
              // localStorage.setItem('email', email)
              // setLoginLoading(false)
              // setLoginError('')
              // this.setState({ infoEmail : true })
              // const userData = { em: (input.emailmobile), emname: (emailOrmobile) }
              // localStorage.setItem('userRegData', JSON.stringify(userData))
              alert('We have sent you an email with a link to sign in')
          }).catch(err => {
              console.error('Firebase Error:', err.code, err.message)

              alert('Firebase Error:', err)
          })
      }
  }

    const [getShowOtp, setShowOtp] = useState(false)
    const [mob_verify, setmob_verify] = useState(false)
    const verifyMobile = () => {

          // console.log(value)
          Axios.get(`${API_URL}/api/registration/CheckEmailMobileExist/${sMobile}`, {
              headers: {
                  ApiKey: `${API_KEY}`
              }
          }).then(res => {
              // console.log('called')
              if (res.data[0].ecnt === 1) {
                  if (emailpattern.test(sMobile)) {
                      chkErr = 'Email already exists'
                      // alert('Email already exists.')
                  } else {
                      chkErr = 'Mobile number already exists'
                      // alert('Mobile already exists.')
                      setmob_verify(true)
                  }

              } else {
                  // alert('go ahead')
                  const verify = new RecaptchaVerifier(auth, 'recaptcha', {})
                  // console.log(verify)
                  const phone = `+91${sMobile}`
                  const confirmation = signInWithPhoneNumber(auth, phone, verify)
                      .then((code) => {
                          window.code = code
                          setresult(code)
                          setShowOtp(true)
                          document.getElementById('recaptcha').style.display = 'none'
                      })
              }
          })
              .catch(err => {
                  toast.error('OTP not sent.')
              })
      if (chkErr) {
          error = chkErr
      }
      return error

  }
    const [regId, setregId] = useState('')
    const [username, setUsername] = useState('')
    const [otpValues, setOtpValues] = useState({
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: '',
        otp5: '',
        otp6: ''
    });

    const [result, setresult] = useState('')
    const [verified, setverified] = useState(false)
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
                    // router.push('/userreg');
                    setShowOtp(false)
                    document.getElementById('recaptcha').style.display = 'none'
                    setverified(true)
                    localStorage.setItem('verify_mobile', sMobile)
                    // setRegister(true)
                }).catch((err) => {
                // Display error notification if OTP is invalid
                toast.error('Invalid OTP');
            });
        } else {
            // Alert user to enter OTP if any field is empty
            alert("Please enter OTP");
        }
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
    const handleChange = (valueName, event) => {
        setOtpValues({
            ...otpValues,
            [valueName]: event.target.value
        });
    };

    const [showContinue, setshowContinue] = useState(false)
    const [tutorcnt, setTutorcnt] = useState('')

    const [isAdded, setisAdded] = useState(true)
    const [tutorDetail, setTutorDetail] = useState([])
    
    const [verifysts, setverifySts] = useState([])
    useEffect(() => {

      if(localStorage.getItem('userData')) {

          Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
              headers: {
                  ApiKey: `${API_KEY}`
              }
          })
              .then(res => {
                  console.log(res.data)

                  if(res.data.length !== 0) {
                      // if(res.data[0].bIsReview !== 0) {
                      //      router.push('/become-a-tutor/Review')
                      // } else {
                      //
                      // }
                  }

              })
              .catch(err => {
                  { ErrorDefaultAlert(err) }
              })

          Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
              headers: {
                  ApiKey: `${API_KEY}`
              }
          })
              .then(res => {
                  console.log('GetTutorVerify', res.data)
                  if(res.data.length !== 0){
                      setverifySts(res.data[0])
                  } else {
                      setverifySts({ sBasic_verify : 0 })
                  }
              })
              .catch(err => {
                  { ErrorDefaultAlert(err) }
              })
          // console.log(JSON.parse(localStorage.getItem('verify_mobile')))
          // console.log((DecryptData(JSON.parse(localStorage.getItem('userData')).username).Username))
          setsFname(JSON.parse(localStorage.getItem('userData')).fname)
          setsLname(JSON.parse(localStorage.getItem('userData')).lname)
          setregId(JSON.parse(localStorage.getItem('userData')).regid)
          // setUsername(DecryptData(JSON.parse(localStorage.getItem('userData')).username))
          setUsername((DecryptData(JSON.parse(localStorage.getItem('userData')).username).EM))

          console.log(DecryptData(JSON.parse(localStorage.getItem('userData')).username))

          if((DecryptData(JSON.parse(localStorage.getItem('userData')).username).EM) === 'email'){
              // EM
              if(localStorage.getItem('verify_email')) {
                  // setsEmail(DecryptData(JSON.parse(localStorage.getItem('userData')).username).Email)
                  setsEmail(JSON.stringify(localStorage.getItem('verify_email')))
              } else {
                  setsEmail((DecryptData(JSON.parse(localStorage.getItem('userData')).username).Email))
              }
          } else {
              // if(localStorage.getItem('verify_email')) {
              //     alert(localStorage.getItem('verify_email'))
              //     setsEmail(localStorage.getItem('verify_email'))
              //     setshowEmailcheck(true)
              // } else {
              //     setsEmail('')
              // }
              setsEmail('')
              setsMobile((DecryptData(JSON.parse(localStorage.getItem('userData')).username).Username))
          }

          Axios.get(`${API_URL}/api/TutorBasics/GetTutorProfile/${JSON.parse(localStorage.getItem('userData')).regid}`, {
              headers: {
                  ApiKey: `${API_KEY}`
              }
          })
              .then(res => {
                  // console.log(res.data)
                  // if(res.data.)
                  if(res.data[0].cnt !== 0) {
                      setTutorcnt(res.data[0].cnt)
                      setisAdded(false)
                      setshowContinue(true)
                  } else {
                      setisAdded(true)
                      setshowContinue(false)
                  }
              })
              .catch(err => {
                  { ErrorDefaultAlert(err) }
              })

          const formatDate = (dateTimeString) => {
              const date = new Date(dateTimeString); // Create a Date object from the dateTimeString
              const day = date.getDate(); // Get the day of the month (1-31)
              const monthNames = [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ];
              const month = monthNames[date.getMonth()]; // Get the month name (short form)
              const year = date.getFullYear(); // Get the year (4-digit)

              const paddedDay = (day < 10) ? `0${day}` : day;
              // Construct the formatted date string in the "DD-Mon-YYYY" format
              const formattedDate = `${paddedDay}-${month}-${year}`;
              return formattedDate;
          };

          Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
              headers: {
                  ApiKey: `${API_KEY}`
              }
          })
              .then(res => {
                  console.log(res.data)
                  if(res.data.length !== 0) {
                      setsFname(res.data[0].sFName)
                      setsLname(res.data[0].sLName)
                      setsMobile(res.data[0].sMobile)
                      setsEmail(res.data[0].sEmail)
                      setsGender(res.data[0].sGender)
                      setcountryId(res.data[0].nCountryId)
                      setcityId(res.data[0].nCityId)
                      setstateId(res.data[0].nStateId)
                      setdDOB(new Date(res.data[0].dDOB))

                      // setTutorDetail(res.data[0])

                      const dateTimeString = res.data[0].dDOB; // Example input date and time string

                      const formattedDate = formatDate(res.data[0].dDOB);

                      Axios.get(`${API_URL}/api/registration/BindState/${res.data[0].nCountryId}`, {
                          headers: {
                              ApiKey: `${API_KEY}`
                          }
                      })
                          .then(ret => {
                              // console.log(ret.data)
                              if (ret.data.length !== 0) {
                                  setState(ret.data)
                              }
                              const defaultState = ret.data.filter(item => item.nStateId === res.data[0].nStateId)

                              if (defaultState) {
                                  setstateId(res.data[0].nStateId);
                              }
                          })
                          .catch(err => {
                              { ErrorDefaultAlert(err) }
                          })

                      Axios.get(`${API_URL}/api/registration/BindCity/${res.data[0].nStateId}`, {
                          headers: {
                              ApiKey: `${API_KEY}`
                          }
                      })
                          .then(ret => {
                              // console.log(ret.data)
                              if (ret.data.length !== 0) {
                                  setCity(ret.data)
                              }
                              const defaultcity = ret.data.filter(item => item.nCityId === res.data[0].nCityId)

                              // console.log('defaultstate', defaultcity)
                              if (defaultcity) {
                                  setcityId(res.data[0].nCityId); // Set default countryId to India's ID
                              }
                          })
                          .catch(err => {
                              { ErrorDefaultAlert(err) }
                          })
                  }

              })
              .catch(err => {
                  { ErrorDefaultAlert(err) }
              })
      }


      bindCountry()

  }, []);
  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box mb--60">
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Basics</h4>
          </div>
          <Formik
              validationSchema={UserValidationSchema}
              initialValues={{
                  nRegId : regId,
                  sFName: sFname ? sFname : '',
                  sLName: sLname ? sLname : '',
                  sEmail: sEmail ? sEmail : '',
                  sMobile: sMobile ? sMobile : '',
                  dDOB : dDOB ? dDOB : '',
                  sGender: sGender ? sGender: '',
                  nCountryId: countryId ? countryId : '',
                  nStateId: stateId ? stateId : '',
                  nCityId: cityId ? cityId : '',
                  IsAdded: isAdded
              }}
              enableReinitialize={true}
              onSubmit={async (values, {resetForm}) => {
                console.log(values)
                  if(verifysts.sBasic_verify === 2) {
                    // router.push('/become-a-tutor/profile-photo')
                    router.push(`/become-a-tutor/profile-photo`)
                  } else {
                      await Axios.post(`${API_URL}/api/TutorBasics/AddTutor`, values, {
                          headers: {
                              ApiKey: `${API_KEY}`
                          }
                      }).then(res => {
                          // console.log(res.data)
                          setisLoading(true)
                          const retData = JSON.parse(res.data)
                          localStorage.removeItem('verify_uname')
                          // console.log(retData)
                          resetForm({})
                          if(retData.success === '1') {
                              router.push('/become-a-tutor/profile-photo')
                          }
                      })
                          .catch(err => {
                              {
                                  ErrorDefaultAlert(JSON.stringify(err.response))
                              }
                          })
                  }

              }}
          >
            {({errors, touched}) => {
              return (
                  <>
                      <Form>
                              {verifysts.sBasic_verify === 2 ? <>
                                  <Alert color='success'>
                                      <h6 className='alert-heading m-0 text-center'>
                                          Basic information verification has been approved by admin
                                      </h6>
                                  </Alert>
                              </> : <>
                                  {verifysts.sBasic_verify === 1 ? <>
                                      <Alert color='warning'>
                                          <h6 className='alert-heading m-0 text-center'>
                                              Basic information verification is pending state
                                          </h6>
                                      </Alert>
                                  </> : <>
                                      {verifysts.sBasic_verify === 0 || verifysts.sBasic_verify === null ? <></> : <>
                                          <Alert color='danger'>
                                              <h6 className='alert-heading m-0 text-center'>
                                                  Basic information verification has been disapproved by admin
                                              </h6>
                                          </Alert>
                                          <Alert color='danger'>
                                              <h6 className='alert-heading m-0 text-center'>Reason : {verifysts.sBasic_comment}</h6>
                                          </Alert>
                                      </>}
                                  </>}
                              </>}


                          <div className={'row row--15 mt-5'}>
                              <div className="col-lg-6">
                                  <label>
                                      First Name
                                  </label>
                                  <div className="form-group">
                                      <input
                                          onChange={handleFname}
                                          value={sFname}
                                          className={`form-control ${errors.sFName && touched.sFName && 'is-invalid'}`}
                                          name="sFName"
                                          type="text"
                                          readOnly={verifysts.sBasic_verify === 2}
                                          placeholder="First Name"
                                      />

                                      <ErrorMessage name='sFName' component='div'
                                                    className='field-error text-danger'/>
                                      <span className="focus-border"></span>
                                  </div>
                              </div>

                              <div className="col-lg-6">
                                  <label>
                                      Last Name
                                  </label>

                                  <div className="form-group">
                                      <input
                                          onChange={handleLname}
                                          value={sLname}
                                          className={`form-control  ${errors.sLName && touched.sLName && 'is-invalid'}`}
                                          name="sLName"
                                          readOnly={verifysts.sBasic_verify === 2}
                                          type="text"
                                          placeholder="Last Name"
                                      />

                                      <ErrorMessage name='sLName' component='div'
                                                    className='field-error text-danger'/>
                                      <span className="focus-border"></span>
                                  </div>
                              </div>

                              <div className="col-lg-6 mt-3">
                                  <label>
                                      Phone number
                                  </label>
                                  <div className="form-group">
                                      <div className={'d-flex'}>
                                          {username === 'mobile' ?
                                              <>
                                                  <input
                                                      // onChange={handleMobile}
                                                      value={sMobile}
                                                      className={`form-control bg-secondary-opacity ${errors.sMobile && touched.sMobile && 'is-invalid'}`}
                                                      name="sMobile"
                                                      type="text"
                                                      readOnly={verifysts.sBasic_verify === 2}
                                                      placeholder="Phone Number"
                                                  />
                                                      <div className={'btn-email-verified text-white bg-success p-4'}>
                                                          <i className={'feather-check'}></i></div>
                                              </> : <>
                                                  <input
                                                      onChange={handleMobile}
                                                      value={sMobile}
                                                      className={`form-control ${errors.sMobile && touched.sMobile && 'is-invalid'}`}
                                                      name="sMobile"
                                                      type="text"
                                                      placeholder="Phone Number"
                                                  />
                                                  <Button onClick={verifyMobile}
                                                          className={'btn-email-verify'}>Verify</Button>
                                              </>}
                                      </div>

                                      <ErrorMessage name='sMobile' component='div'
                                                    className='field-error text-danger'/>
                                      <span className="focus-border"></span>

                                  </div>
                                  {mob_verify ? <>
                                      <span className={'text-danger'}>Mobile number already exists!</span>
                                  </> : <></>}
                              </div>

                              <div className="col-lg-6 mt-3">
                                  <label>
                                      Email
                                  </label>
                                  <div className="form-group">
                                  <div className={'d-flex'}>
                                      {username === 'email' ?
                                          <>
                                              <input
                                                  // onChange={handleMobile}
                                                  value={sEmail}
                                                  className={`form-control bg-secondary-opacity ${errors.sMobile && touched.sMobile && 'is-invalid'}`}
                                                  name="sEmail"
                                                  type="text"
                                                  readOnly={verifysts.sBasic_verify === 2}
                                                  placeholder="Email"
                                              />
                                              <div className={'btn-email-verified text-white bg-success p-4'}>
                                                  <i className={'feather-check'}></i></div>
                                          </> : <>

                                          {showEmailCheck ? <>
                                              <input
                                                  // onChange={handleEmail}
                                                  value={sEmail}
                                                  className={`form-control bg-secondary-opacity ${errors.sMobile && touched.sMobile && 'is-invalid'}`}
                                                  name="sEmail"
                                                  type="text"
                                                  placeholder="Email"
                                              />
                                                  <Button className={'btn-email-verified btn-success p-4'}>
                                                      <i className={'feather-check'}></i></Button>

                                          </> : <>
                                              <input
                                                  onChange={handleEmail}
                                                  value={sEmail}
                                                  className={`form-control ${errors.sMobile && touched.sMobile && 'is-invalid'}`}
                                                  name="sEmail"
                                                  type="text"
                                                  placeholder="Email"
                                              />

                                                  <Button onClick={VerifyEmail}
                                                          className={'btn-email-verify'}>Verify</Button>
                                              </>}

                                          </>}
                                      </div>
                                      <span className="focus-border"></span>
                                  </div>
                              </div>


                              <div className={'col-lg-12 mt-3'}>
                                  <div id="recaptcha" className={'m-t-5 mb-3'}></div>
                              </div>
                              {getShowOtp ? <>

                                  <div className={'col-lg-12 mt-3'}>

                                      <Form className='auth-register-form mt-1'>
                                          <CardText className='m-0'>Enter OTP</CardText>
                                          <div className="otpContainer">

                                              <input
                                                  name="otp1"
                                                  type="text"
                                                  autoComplete="off"
                                                  className="otpInput"
                                                  value={otpValues.otp1}
                                                  onChange={(e) => handleChange('otp1', e)}
                                                  // onKeyDown={inputFocus}
                                                  // onChange={e => this.handleChange("otp1", e)}
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
                                                  // onKeyDown={inputFocus}
                                                  // onChange={e => this.handleChange("otp1", e)}
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
                                                  // onKeyDown={inputFocus}
                                                  // onChange={e => this.handleChange("otp1", e)}
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
                                              <button className="rbt-btn btn-gradient mt-4" style={{lineHeight: '3'}}
                                                      onClick={handleSubmit}>
                                                  Submit
                                              </button>
                                          </div>
                                      </Form>
                                  </div>
                              </> : <></>}
                              <div className="col-lg-6 mt-3">
                                  <label>
                                      Date of Birth
                                  </label>
                                  {/*<DatePicker label="Basic date picker" />*/}
                                  <div className="form-group">
                                      {verifysts.sBasic_verify === 2 ? <>

                                          <input
                                              onChange={handleDOB}
                                              value={dDOB}
                                              className={`form-control bg-secondary-opacity ${errors.dDOB && touched.dDOB && 'is-invalid'}`}
                                              name="dDOB"
                                              readOnly
                                              type="date"
                                              placeholder="DOB"
                                          />
                                      </> : <>
                                          {/*<DatePicker*/}
                                          {/*    selected={dDOB}*/}
                                          {/*    onChange={handleDOB}*/}
                                          {/*    value={dDOB}*/}
                                          {/*    name="dDOB"*/}
                                          {/*    dateFormat="dd/MM/yyyy"*/}
                                          {/*    className='form-control'*/}
                                          {/*    showYearDropdown*/}
                                          {/*    showMonthDropdown*/}
                                          {/*/>*/}
                                          <DatePicker
                                              renderCustomHeader={({
                                                                       date,
                                                                       changeYear,
                                                                       changeMonth,
                                                                       decreaseMonth,
                                                                       increaseMonth,
                                                                       prevMonthButtonDisabled,
                                                                       nextMonthButtonDisabled,
                                                                   }) => (
                                                  <div
                                                      style={{
                                                          // margin: 10,
                                                          display: "flex",
                                                          justifyContent: "center",
                                                      }}
                                                  >
                                                      {/*<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>*/}
                                                      {/*    {"<"}*/}
                                                      {/*</button>*/}
                                                      <select

                                                          // value={new Date().getFullYear(date)}
                                                          onChange={({ target: { value } }) => changeYear(value)}
                                                      >
                                                          {years.map((option) => (
                                                              <option key={option} value={option}>
                                                                  {option}
                                                              </option>
                                                          ))}
                                                      </select>

                                                      <select

                                                          // value={new Date().getMonth(date)}
                                                          // value={months[getMonth(date)]}
                                                          onChange={({ target: { value } }) =>
                                                              changeMonth(months.indexOf(value))
                                                          }
                                                      >
                                                          {months.map((option) => (
                                                              <option key={option} value={option}>
                                                                  {option}
                                                              </option>
                                                          ))}
                                                      </select>

                                                      {/*<button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>*/}
                                                      {/*    {">"}*/}
                                                      {/*</button>*/}
                                                  </div>
                                              )}
                                              selected={dDOB}
                                              onChange={handleDOB}
                                          />
                                      </>}

                                      <ErrorMessage name='dDOB' component='div' className='field-error text-danger'/>
                                      {ageErrorMessage && <div className="text-danger">{ageErrorMessage}</div>}
                                      <span className="focus-border"></span>
                                  </div>
                              </div>

                              <div className="col-lg-6 mt-3">
                                  <label>
                                      Gender
                                  </label>
                                  <div className="form-group d-flex">
                                      <div>
                                          {verifysts.sBasic_verify === 2 ? <>
                                              {sGender === 1 ? <>
                                                  <input
                                                      onChange={handleGender}
                                                      value={sGender}
                                                      id="sMale"
                                                      type="radio"
                                                      name="sGender"
                                                      checked
                                                      disabled={true}
                                                  />
                                              </> : <>
                                                  <input
                                                      onChange={handleGender}
                                                      value={sGender}
                                                      id="sMale"
                                                      type="radio"
                                                      checked
                                                      name="sGender"
                                                      disabled={true}
                                                  />
                                              </>}
                                          </> : <>
                                              {sGender === 1 ? <>
                                                  <input
                                                      onChange={handleGender}
                                                      value={sGender}
                                                      id="sMale"
                                                      type="radio"
                                                      name="sGender"
                                                      checked
                                                  />
                                              </> : <>
                                                  <input
                                                      onChange={handleGender}
                                                      value={sGender}
                                                      id="sMale"
                                                      type="radio"
                                                      name="sGender"
                                                      checked
                                                  />
                                              </>}
                                          </>}

                                          <label htmlFor="sMale">
                                              Male
                                          </label>
                                      </div>
                                      <div className={"ms-3"}>

                                          {verifysts.sBasic_verify === 2 ? <>
                                              {sGender === 0 ? <>
                                                  <input
                                                      onChange={handleGender}
                                                      value={sGender}
                                                      id="sFemale"
                                                      type="radio"
                                                      name="sGender"
                                                      checked
                                                      disabled={true}
                                                  />
                                              </> : <>
                                                  <input
                                                      onChange={handleGender}
                                                      value={sGender}
                                                      id="sFemale"
                                                      type="radio"
                                                      name="sGender"
                                                      disabled={true}
                                                      checked
                                                  />
                                              </>}
                                          </> : <>
                                              {sGender === 0 ? <>
                                                  <input
                                                      onChange={handleGender}
                                                      value={sGender}
                                                      id="sFemale"
                                                      type="radio"
                                                      name="sGender"
                                                      checked
                                                  />
                                              </> : <>
                                                  <input
                                                      onChange={handleGender}
                                                      value={sGender}
                                                      id="sFemale"
                                                      type="radio"
                                                      name="sGender"
                                                  />
                                              </>}
                                          </>}


                                          <label htmlFor="sFemale">
                                              Female
                                          </label>
                                      </div>

                                      <span className="focus-border"></span>
                                  </div>
                                  {/*<ErrorMessage name='sGender' component='div'*/}
                                  {/*              className='field-error text-danger' style={{ marginTop: '10px', marginLeft: '10px' }}/>*/}
                              </div>

                              <div className="col-lg-4 mb-5 mt-3">
                                  <label>
                                      Country
                                  </label>
                                  {/*<div className="rbt-modern-select bg-transparent height-45">*/}
                                  {verifysts.sBasic_verify === 2 ? <>
                                      <select disabled={true} value={countryId}
                                              style={{fontSize: '15px', color: '#6b7385'}}
                                              name={"nCountryId"}
                                              className={`form-control bg-secondary-opacity ${errors.nCountryId && touched.nCountryId && 'is-invalid'}`}
                                              onChange={handleChangeCountry}>
                                          <option value={''}>Select</option>
                                          {country.map((item, index) => {
                                              return (
                                                  <>
                                                      <option key={index}
                                                              value={item.nCountryId}>{item.sCountryname}</option>
                                                  </>
                                              )
                                          })}
                                      </select>
                                  </> : <>
                                      <select value={countryId} style={{fontSize: '15px', color: '#6b7385'}}
                                              name={"nCountryId"}
                                              className={`form-control ${errors.nCountryId && touched.nCountryId && 'is-invalid'}`}
                                              onChange={handleChangeCountry}>
                                          <option value={''}>Select</option>
                                          {country.map((item, index) => {
                                              return (
                                                  <>
                                                      <option key={index}
                                                              value={item.nCountryId}>{item.sCountryname}</option>
                                                  </>
                                              )
                                          })}
                                      </select>
                                  </>}

                                  <ErrorMessage name='nCountryId' component='div'
                                                className='field-error text-danger'/>
                              </div>
                              <div className="col-lg-4 mt-3">
                                  <label>
                                      State
                                  </label>
                                  {/*<div className="rbt-modern-select bg-transparent height-45">*/}
                                  {verifysts.sBasic_verify === 2 ? <>
                                      <select disabled={true} value={stateId}
                                              style={{fontSize: '15px', color: '#6b7385'}}
                                              name={"nStateId"}
                                              className={`form-control bg-secondary-opacity ${errors.nStateId && touched.nStateId && 'is-invalid'}`}
                                              onChange={handleChangeState}>
                                          <option value={''}>Select</option>
                                          {state.map((item, index) => {
                                              return (
                                                  <>
                                                      <option key={index}
                                                              value={item.nStateId}>{item.sStateName}</option>
                                                  </>
                                              )
                                          })}
                                      </select>
                                  </> : <>
                                      <select value={stateId} style={{fontSize: '15px', color: '#6b7385'}}
                                              name={"nStateId"}
                                              className={`form-control ${errors.nStateId && touched.nStateId && 'is-invalid'}`}
                                              onChange={handleChangeState}>
                                          <option value={''}>Select</option>
                                          {state.map((item, index) => {
                                              return (
                                                  <>
                                                      <option key={index}
                                                              value={item.nStateId}>{item.sStateName}</option>
                                                  </>
                                              )
                                          })}
                                      </select>
                                  </>}

                                  <ErrorMessage name='nStateId' component='div'
                                                className='field-error text-danger'/>
                                  {/*</div>*/}
                              </div>
                              <div className="col-lg-4 mt-3">
                                  <label>
                                      City
                                  </label>
                                  {/*<div className="rbt-modern-select bg-transparent height-45">*/}
                                  {verifysts.sBasic_verify === 2 ? <>
                                      <select disabled={true} value={cityId}
                                              style={{fontSize: '15px', color: '#6b7385'}}
                                              name={"nCityId"}
                                              className={`form-control bg-secondary-opacity ${errors.nCityId && touched.nCityId && 'is-invalid'}`}
                                              onChange={handleChangeCity}>
                                          <option value={''}>Select</option>
                                          {city.map((item, index) => {
                                              return (
                                                  <>
                                                      <option key={item.nCityId}
                                                              value={item.nCityId}>{item.sCityName}</option>
                                                  </>
                                              )
                                          })}
                                      </select>
                                  </> : <>
                                      <select value={cityId} style={{fontSize: '15px', color: '#6b7385'}}
                                              name={"nCityId"}
                                              className={`form-control ${errors.nCityId && touched.nCityId && 'is-invalid'}`}
                                              onChange={handleChangeCity}>
                                          <option value={''}>Select</option>
                                          {city.map((item, index) => {
                                              return (
                                                  <>
                                                      <option key={item.nCityId}
                                                              value={item.nCityId}>{item.sCityName}</option>
                                                  </>
                                              )
                                          })}
                                      </select>
                                  </>}

                                  <ErrorMessage name='nCityId' component='div'
                                                className='field-error text-danger'/>
                                  {/*</div>*/}
                              </div>

                              <div className="col-lg-12">
                                  <div className="form-submit-group">
                                      {isLoading ? <>
                                          <button
                                              disabled={true}
                                              type="submit"
                                              className="rbt-btn btn-md btn-gradient w-100"
                                          >
                                              <span className="btn-text"><i className="feather-loader"></i>isLoading...</span>
                                          </button>
                                      </> : <>
                                          <button
                                              disabled={isLoading}
                                              type="submit"
                                              className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                                          >
                                              <span className="icon-reverse-wrapper">
                                                  <span className="btn-text">Continue</span>
                                                  <span className="btn-icon">
                                                    <i className="feather-arrow-right"></i>
                                                  </span>
                                                  <span className="btn-icon">
                                                    <i className="feather-arrow-right"></i>
                                                  </span>
                                              </span>
                                              {/*</Link>*/}
                                          </button>
                                      </>}

                                  </div>
                              </div>
                          </div>
                      </Form>

                  </>
              )
            }}


          </Formik>


        </div>
      </div>
    </>
  );
};

export default Basics;
