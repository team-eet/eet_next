"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import Axios from "axios";
import {API_URL, API_KEY} from "../../constants/constant";
import {ErrorDefaultAlert, SuccessRedirectAlert, SuccessAlert, InfoDefaultAlert} from "@/components/Services/SweetAlert";
import { TabContent, TabPane, Nav, NavLink, NavItem, Row, Col, CardText, Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, CardBody, Table, Media } from 'reactstrap'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import React from "react";


const Setting = () => {
  const [textareaText, setTextareaText] = useState(
    "I'm the Front-End Developer for #Rainbow IT in Bangladesh, OR. I have serious passion for UI effects, animations and creating intuitive, dynamic user experiences."
  );
  const REACT_APP = API_URL
  const [sFname, setsFname] = useState('')
  const [sLname, setsLname] = useState('')
  const [sEmail, setsEmail] = useState('')
  const [sMobile, setsMobile] = useState('')
  const [dDateOfBirth, setdDateOfBirth] = useState('')
  const [sGender, setsGender] = useState('')
  const [sMaritalStatus, setsMaritalStatus] = useState('')
  const [nCountryId, setnCountryId] = useState('')
  const [nStateId, setnStateId] = useState('')
  const [nCityId, setnCityId] = useState('')
  const [hfb, sethfb] = useState('')
  const [street, setstreet] = useState('')
  const [sLandmark, setsLandmark] = useState('')
  const [sPincode, setsPincode] = useState('')
  const [getimg, setgetimg] = useState('')
  const [sPhoto, setsPhoto] = useState('')
  const [sPhotoName, setsPhotoName] = useState('')
  const [nRegid, setnRegid] = useState('')
  const [updatedrole, setupdatedrole] = useState('')
  const [countryarr, setCountryArr] = useState([])
  const [statearr, setStateArr] = useState([])
  const [cityarr, setCityArr] = useState([])

  const [currentPass, setcurrentPass] = useState('')
  const [newPass, setnewPass] = useState('')
  const [confirmPass, setconfirmPass] = useState('')

  const [twitter, setTwitter] = useState('')
  const [facebook, setfacebook] = useState('')
  const [linkedin, setlinkedin] = useState('')
  const [google, setgoogle] = useState('')
  const [instagram, setinstagram] = useState('')
  const [quora, setquora] = useState('')

  const  getBase64 = (file) => {
    return new Promise(resolve => {
      let baseURL = ""
      // Make new FileReader
      const reader = new FileReader()

      // Convert the file to base64 text
      reader.readAsDataURL(file)

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result
        resolve(baseURL)
      }
    })
  }
  const onChangeImage = (event) => {
    const fileext = ['image/jpeg', 'image/jpg', 'image/png']
    if (event.target.files[0].size < 5000000) {
      if (fileext.includes(event.target.files[0].type)) {
        getBase64(event.target.files[0])
            .then(result => {
              //getimg = result
              setgetimg(result)
            })
            .catch(err => {

            })
        setsPhoto(URL.createObjectURL(event.target.files[0]))
      } else {
        alert("Only select image file type with JPG, JPEG, PNG")
      }
    } else {
      alert("Please upload file less than 5MB")
    }
  }
  const handleChangeFname = (e) => {
    setsFname(e.target.value)
  }

  const handleChangeLname = (e) => {
    setsLname(e.target.value)
  }

  const handleChangeEmail = (e) => {
    setsEmail(e.target.value)
  }

  const handleChangeMobile = (e) => {
    setsMobile(e.target.value)
  }

  const handleChangeCurrPass = (e) => {
    setcurrentPass(e.target.value)
  }

  const handleChangeNewPass = (e) => {
    setnewPass(e.target.value)
  }

  const handleChangeConfirmPass = (e) => {
    setconfirmPass(e.target.value)
  }

  const handleChangeDob = (date) => {
    if(date) {
      setdDateOfBirth(date)
    }
  }

  const handleChangeGender = (e) => {
    setsGender(e.target.value)
  }

  const handleChangeStatus = (e) => {
    setsMaritalStatus(e.target.value)
  }

  const handleChangeCountry = (e) => {
    setnCountryId(e.target.value)
    Axios.get(`${API_URL}/api/registration/BindState/${e.target.value}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data.length !== 0) {
            setStateArr(res.data)
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  const handleChangeState = (e) => {
    setnStateId(e.target.value)
    Axios.get(`${API_URL}/api/registration/BindCity/${e.target.value}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data.length !== 0) {
            setCityArr(res.data)
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  const handleChangeCity = (e) => {
    setnCityId(e.target.value)
  }

  const handleChangeHFB = (e) => {
    sethfb(e.target.value)
  }

  const handleChangestreet = (e) => {
    setstreet(e.target.value)
  }

  const handleChangeLandmark = (e) => {
    setsLandmark(e.target.value)
  }

  const handleChangepincode = (e) => {
    setsPincode(e.target.value)
  }

  const handleChangeTwitter = (e) => {
    setTwitter(e.target.value)
  }

  const handleChangeFacbeook = (e) => {
    setfacebook(e.target.value)
  }

  const handleChangeLinkedin = (e) => {
    setlinkedin(e.target.value)
  }
  const handleChangeGoogle = (e) => {
    setgoogle(e.target.value)
  }

  const handleChangeInstagram = (e) => {
    setinstagram(e.target.value)
  }

  const handleChangeQuora = (e) => {
    setquora(e.target.value)
  }


  useEffect(() => {
    Axios.get(`${API_URL}/api/registration/BindCountry`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data.length !== 0) {
            setCountryArr(res.data)
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
    if(localStorage.getItem('userData')){
      const udata = DecryptData(localStorage.getItem('userData'))
      setnRegid(udata)
      setupdatedrole(udata['roleid'])
      Axios.get(`${API_URL}/api/registration/FillUserProfile/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data.length !== 0) {
              console.log(res.data[0])
              setsFname(res.data[0]['sFName'])
              setsLname(res.data[0]['sLName'])
              setsEmail(res.data[0]['sEmail'])
              setsMobile(res.data[0]['sMobile'])
              setdDateOfBirth(res.data[0]['dDateOfBirth'])
              setsGender(res.data[0]['sGender'])
              setsMaritalStatus(res.data[0]['sMaritalStatus'])
              setnCountryId(res.data[0]['nCountryId'])
              setnStateId(res.data[0]['nStateId'])
              setnCityId(res.data[0]['nCityId'])
              sethfb(res.data[0]['sHFBInfo'])
              setstreet(res.data[0]['sStreetAddr'])
              setsLandmark(res.data[0]['sLandmark'])
              setsPincode(res.data[0]['sPincode'])
              setsPhotoName(res.data[0]['sPhotoName'])
                setsPhoto(res.data[0]['sPhoto'])
                setTwitter(res.data[0]['sTwitter'])
                setfacebook(res.data[0]['sFacebook'])
                setgoogle(res.data[0]['sGoogle'])
                setlinkedin(res.data[0]['sLinkedIn'])
                setinstagram(res.data[0]['sInstagram'])
                setquora(res.data[0]['sQuora'])
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
  }, []);

  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Settings</h4>
          </div>

          <div className="advance-tab-button mb--30">
            <ul
              className="nav nav-tabs tab-button-style-2 justify-content-start"
              id="settinsTab-4"
              role="tablist"
            >
              <li role="presentation">
                <Link
                  href="#"
                  className="tab-button active"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="true"
                >
                  <span className="title">Profile</span>
                </Link>
              </li>
              <li role="presentation">
                <Link
                  href="#"
                  className="tab-button"
                  id="password-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#password"
                  role="tab"
                  aria-controls="password"
                  aria-selected="false"
                >
                  <span className="title">Password</span>
                </Link>
              </li>
              <li role="presentation">
                <Link
                    href="#"
                    className="tab-button"
                    id="personal-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#personal"
                    role="tab"
                    aria-controls="personal"
                    aria-selected="false"
                >
                  <span className="title">Personal Info</span>
                </Link>
              </li>
              <li role="presentation">
                <Link
                  href="#"
                  className="tab-button"
                  id="social-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#social"
                  role="tab"
                  aria-controls="social"
                  aria-selected="false"
                >
                  <span className="title">Social Share</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            <div
              className="tab-pane fade active show"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <Formik
                  // validationSchema={UserValidationSchema}
                  initialValues={{
                    nRegId: nRegid['regid'],
                    sPhoto: getimg ? getimg : '',
                    sPhotoName: sPhotoName ? sPhotoName : '',
                    sFName: (sFname) ? sFname : '',
                    sLName: (sLname) ? sLname : '',
                    sEmail: (sEmail) ? sEmail : '',
                    sMobile: (sMobile) ? sMobile : '',
                    nUpdatedBy: nRegid['regid'],
                    nURoleId: updatedrole ? updatedrole : ''
                  }}
                  enableReinitialize={true}
                  // validateOnChange={false}
                  onSubmit={async (values, { resetForm }) => {
                    console.log(values)
                    // if (values.dDateOfBirth || values.sGender || values.sMaritalStatus || values.nCountryId || values.nStateId || values.nCityId || values.sHFBInfo || values.sStreetAddr || values.sLandmark || values.sPincode) {

                    if (values.sFName && values.sLName) {
                      // this.setState({ isLoading: true })
                      await Axios.put(`${API_URL}/api/registration/UpdateProfileGeneral`, values, {
                        headers: {
                          ApiKey: `${API_KEY}`
                        }
                      }).then(res => {
                        const retData = JSON.parse(res.data)
                        resetForm({})
                        //alert(retData.success)
                        if (retData.success === "1") {
                          { SuccessAlert(retData) }

                          //get localstorage and update name
                          const gdata = DecryptData(localStorage.getItem('userData'))

                          if (gdata.length !== 0) {
                            gdata.fname = values.sFName
                            gdata.lname = values.sLName
                            gdata.profile = values.sPhoto
                          }

                          localStorage.setItem('userData', JSON.stringify(gdata))

                          { SuccessRedirectAlert({ title: "Updated", message: "Profile updated successfully.", rlink: "1" }) }

                        } else if (retData.success === "0") {
                          { ErrorAlert(retData) }
                        }
                      })
                          .catch(err => { console.log(err)
                            { ErrorDefaultAlert(JSON.stringify(err.response)) }
                            //alert('Something went wrong.')
                          })
                    } else {
                      this.setState({ isLoading: false })
                      InfoDefaultAlert('Please enter values properly.')
                    }
                  }
                  }

              >

                {({ errors, touched, values }) => (

                    <Form
                        className="rbt-profile-row rbt-default-form row row--15"
                    >
                      <div className="rbt-dashboard-content-wrapper">
                        <div className="tutor-bg-photo bg_image bg_image--23 height-245"></div>
                        <div className="rbt-tutor-information">
                          <div className="rbt-tutor-information-left">
                            <div className="thumbnail rbt-avatars size-lg position-relative">
                              <img src={sPhoto} width={300} height={300}/>

                              <div className="rbt-edit-photo-inner">

                                <label id='label' className='btn-sm text-center pt-3 text-white rbt-edit-photo bg-primary mr-75'>
                                  <i className="feather-camera"/>
                                  <input type="file" id="file" name="file" onChange={onChangeImage} accept="image/*" />
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="rbt-tutor-information-right">
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="firstname">First Name</label>
                          <input
                              id="firstname"
                              type="text"
                              value={sFname}
                              onChange={handleChangeFname}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="lastname">Last Name</label>
                          <input
                              id="lastname"
                              type="text"
                              value={sLname}
                              onChange={handleChangeLname}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="phonenumber">Email</label>
                          <input
                              id="Email"
                              type="email"
                              value={sEmail}
                              onChange={handleChangeEmail}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="phonenumber">Phone Number</label>
                          <input
                              id="phonenumber"
                              type="tel"
                              value={sMobile}
                              onChange={handleChangeMobile}
                          />
                        </div>
                      </div>
                      <div className="col-12 mt--20">
                        <div className="rbt-form-group">
                          <button type='submit' className="rbt-btn btn-gradient">
                            Update Info
                          </button>
                        </div>
                      </div>
                    </Form>
                )}
              </Formik>

            </div>

            <div
                className="tab-pane fade"
                id="password"
                role="tabpanel"
                aria-labelledby="password-tab"
            >
              <Formik
                  // validationSchema={UserValidationSchema}
                  initialValues={{
                    nRegId: nRegid['regid'],
                    sOldPassword: currentPass ? currentPass : '',
                    sNewPassword: newPass ? newPass : '',
                    sPassword: confirmPass ? confirmPass: '',
                    nUpdatedBy: nRegid['regid'],
                    nURoleId: updatedrole ? updatedrole : ''
                  }}
                  enableReinitialize={true}
                  // validateOnChange={false}
                  onSubmit={async (values, { resetForm }) => {
                    console.log(values)

                    if(values.sPassword) {

                      await Axios.put(`${API_URL}/api/registration/PasswordChange`, values, {
                        headers: {
                          ApiKey: `${API_KEY}`
                        }
                      }).then(res => {
                        const retData = JSON.parse(res.data)
                        // resetForm({})
                        setcurrentPass('')
                        setnewPass('')
                        setconfirmPass('')
                        //alert(retData.success)
                        if (retData.success === "1") {
                          {
                            SuccessAlert(retData)
                          }

                        } else if (retData.success === "0") {
                          {
                            ErrorAlert(retData)
                          }
                        }
                      })
                          .catch(err => {
                            console.log(err)
                            {
                              ErrorDefaultAlert(JSON.stringify(err.response))
                            }
                            //alert('Something went wrong.')
                          })
                    } else {
                      InfoDefaultAlert('Please enter values properly.')
                    }

                  }
                  }

              >

                {({ errors, touched, values }) => (

                    <Form
                        className="rbt-profile-row rbt-default-form row row--15"
                    >
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="currentpassword">Current Password</label>
                          <input
                              id="currentpassword"
                              type="password"
                              value={currentPass}
                              onChange={handleChangeCurrPass}
                              placeholder="Current Password"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="newpassword">New Password</label>
                          <input
                              id="newpassword"
                              type="password"
                              value={newPass}
                              onChange={handleChangeNewPass}
                              placeholder="New Password"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="retypenewpassword">
                            Re-type New Password
                          </label>
                          <input
                              id="retypenewpassword"
                              type="password"
                              value={confirmPass}
                              onChange={handleChangeConfirmPass}
                              placeholder="Re-type New Password"
                          />
                        </div>
                      </div>
                      <div className="col-12 mt--10">
                        <div className="rbt-form-group">
                          <button type={'submit'} className="rbt-btn btn-gradient">
                            Update Password
                          </button>
                        </div>
                      </div>
                    </Form>
                )}
              </Formik>

            </div>

            <div
                className="tab-pane fade show"
                id="personal"
                role="tabpanel"
                aria-labelledby="personal-tab"
            >
              <Formik
                  // validationSchema={UserValidationSchema}
                  initialValues={{
                    nRegId: nRegid['regid'],
                    dDateOfBirth: dDateOfBirth ? dDateOfBirth : '',
                    sGender: sGender ? sGender : '',
                    sMaritalStatus : sMaritalStatus ? sMaritalStatus : '',
                    nCountryId: nCountryId ? parseInt(nCountryId) : '',
                    nStateId: nStateId ? parseInt(nStateId) : '',
                    nCityId: nCityId ? parseInt(nCityId) : '',
                    sHFBInfo : hfb ? hfb : '',
                    sStreetAddr : street ? street : '',
                    sLandmark: sLandmark ? sLandmark : '',
                    sPincode: sPincode ? sPincode : '',
                    nUpdatedBy: nRegid['regid'],
                    nURoleId: updatedrole ? updatedrole : ''
                  }}
                  enableReinitialize={true}
                  // validateOnChange={false}
                  onSubmit={async (values, { resetForm }) => {
                    // console.log(values)
                      await Axios.put(`${API_URL}/api/registration/UpdateProfilePersonal`, values, {
                        headers: {
                          ApiKey: `${API_KEY}`
                        }
                      }).then(res => {
                        const retData = JSON.parse(res.data)
                        resetForm({})
                        //alert(retData.success)
                        if (retData.success === "1") {
                          { SuccessAlert(retData) }

                        } else if (retData.success === "0") {
                          { ErrorAlert(retData) }
                        }
                      })
                          .catch(err => { console.log(err)
                            { ErrorDefaultAlert(JSON.stringify(err.response)) }
                            //alert('Something went wrong.')
                          })
                  }
                  }

              >

                {({ errors, touched, values }) => (

                    <Form
                        className="rbt-profile-row rbt-default-form row row--15"
                    >
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="phonenumber">Date of Birth</label>
                          <DatePicker
                              selected={dDateOfBirth}
                              onChange={handleChangeDob}
                              name="dDateOfBirth"
                              dateFormat="dd/MM/yyyy"
                              className='form-control'
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <FormGroup>
                            <Label className="font-weight-bold f-14" htmlFor='sGender'>Gender</Label>
                            <div className='mt-1'>
                              <input style={{opacity: '1', position: 'relative', height: '15px', width: '25px'}}
                                     type='radio'
                                     name='sGender' value='male' onChange={handleChangeGender}
                                     checked={sGender === 'male'} className='ml-1 mb-0'/>
                              <span className={'m-0'}>Male</span>

                              <input style={{opacity: '1', position: 'relative', height: '15px', width: '25px'}}
                                     type='radio'
                                     name='sGender' value='female' className='ms-3 mb-0' onChange={handleChangeGender}
                                     checked={sGender === 'female'}/>
                              <span>Female</span>
                            </div>
                          </FormGroup>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <Label className="font-weight-bold f-14" htmlFor='sMaritalStatus'>Marital Status</Label>
                          <select name="sMaritalStatus"
                                  className='form-control'
                                  onChange={handleChangeStatus}
                          >
                            <option value="">Select</option>
                            <option value='Married'>Married</option>
                            <option value='Unmarried'>Unmarried</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <Label className="font-weight-bold f-14" htmlFor='sCountry'>Country</Label>

                          <select name="sCountry"
                                  className='form-control'
                                  onChange={handleChangeCountry}
                          >
                            <option value="">Select</option>
                            {countryarr.map((e) => {
                              return <option key={e.nCountryId} value={e.nCountryId}>{e.sCountryname}</option>
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <Label className="font-weight-bold f-14 mt-3" htmlFor='sState'>State</Label>
                          <select name="sState"
                                  className='form-control'
                                  onChange={handleChangeState}
                          >
                            <option value="">Select</option>
                            {statearr.map((e) => {
                              return <option key={e.nStateId} value={e.nStateId}>{e.sStateName}</option>
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <Label className="font-weight-bold f-14 mt-3" htmlFor='sCity'>City</Label>
                          <select name="sCity"
                                  className='form-control'
                                  onChange={handleChangeCity}
                          >
                            <option value="">Select</option>
                            {cityarr.map((e) => {
                              return <option key={e.nCityId} value={e.nCityId}>{e.sCityName}</option>
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="hfb" className={'mt-3'}>House/Flat/Block No</label>
                          <input
                              id="hfb"
                              type="text"
                              value={hfb}
                              onChange={handleChangeHFB}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="street" className={'mt-3'}>Street/Society Address</label>
                          <textarea
                              id="street"
                              name="street"
                              value={street}
                              onChange={handleChangestreet}
                              rows="3"
                              cols="30"/>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="street" className={'mt-3'}>Landmark</label>
                          <input
                              id="landmark"
                              type="text"
                              value={sLandmark}
                              onChange={handleChangeLandmark}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="street" className={'mt-3'}>Pincode</label>
                          <input
                              id="pincode"
                              type="text"
                              value={sPincode}
                              onChange={handleChangepincode}
                          />
                        </div>
                      </div>
                      <div className="col-12 mt--20">
                        <div className="rbt-form-group">
                          <button type='submit' className="rbt-btn btn-gradient">
                            Update Info
                          </button>
                        </div>
                      </div>
                    </Form>
                )}
              </Formik>

            </div>

            <div
              className="tab-pane fade"
              id="social"
              role="tabpanel"
              aria-labelledby="social-tab"
            >
              <Formik
                  // validationSchema={UserValidationSchema}
                  initialValues={{
                    nRegId: nRegid['regid'],
                    sTwitter: (twitter) ? twitter : '',
                    sFacebook: (facebook) ? facebook : '',
                    sGoogle: (google) ? google : '',
                    sLinkedIn: (linkedin) ? linkedin : '',
                    sInstagram: (instagram) ? instagram : '',
                    sQuora: (quora) ? quora : '',
                    nUpdatedBy: nRegid['regid'],
                    nURoleId: updatedrole ? updatedrole : ''
                  }}
                  enableReinitialize={true}
                  // validateOnChange={false}
                  onSubmit={async (values, { resetForm }) => {
                    console.log(values)

                      await Axios.put(`${API_URL}/api/registration/UpdateProfileSocialLink`, values, {
                        headers: {
                          ApiKey: `${API_KEY}`
                        }
                      }).then(res => {
                        const retData = JSON.parse(res.data)

                        if (retData.success === "1") {
                          {
                            SuccessAlert(retData)
                          }

                        } else if (retData.success === "0") {
                          {
                            ErrorAlert(retData)
                          }
                        }
                      })
                          .catch(err => {
                            console.log(err)
                            {
                              ErrorDefaultAlert(JSON.stringify(err.response))
                            }
                            //alert('Something went wrong.')
                          })
                  }
                  }

              >

                {({ errors, touched, values }) => (

                    <Form
                        className="rbt-profile-row rbt-default-form row row--15"
                    >
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="facebook">
                            <i className="feather-facebook"></i> Facebook
                          </label>
                          <input
                              id="facebook"
                              type="text"
                              value={facebook}
                              onChange={handleChangeFacbeook}
                              // placeholder="https://facebook.com/"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="twitter">
                            <i className="feather-twitter"></i> Twitter
                          </label>
                          <input
                              id="twitter"
                              type="text"
                              value={twitter}
                              onChange={handleChangeTwitter}
                              // placeholder="https://twitter.com/"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="linkedin">
                            <i className="feather-linkedin"></i> Linkedin
                          </label>
                          <input
                              id="linkedin"
                              type="text"
                              value={linkedin}
                              onChange={handleChangeLinkedin}
                              // placeholder="https://linkedin.com/"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="website">
                            <i className="feather-globe"></i> Google
                          </label>
                          <input
                              id="website"
                              type="text"
                              value={google}
                              onChange={handleChangeGoogle}
                              // placeholder="https://website.com/"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="instagram">
                            <i className="feather-instagram"></i> Instagram
                          </label>
                          <input
                              id="instagram"
                              type="text"
                              value={instagram}
                              onChange={handleChangeInstagram}
                              // placeholder="https://instagram.com/"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="rbt-form-group">
                          <label htmlFor="quora">
                            <i className="feather-help-circle"></i> Quora
                          </label>
                          <input
                              id="quora"
                              type="text"
                              value={quora}
                              onChange={handleChangeQuora}
                              // placeholder="https://quora.com/"
                          />
                        </div>
                      </div>
                      <div className="col-12 mt--10">
                        <div className="rbt-form-group">
                          <button type={'submit'} className="rbt-btn btn-gradient">
                            Update Profile
                          </button>
                        </div>
                      </div>
                    </Form>
                )}
              </Formik>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
