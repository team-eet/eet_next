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
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
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
    // const [getimg, setgetimg] = useState('')
    const [sPhoto, setsPhoto] = useState('')
    const [sPhotoName, setsPhotoName] = useState('')
    const [nRegid, setnRegid] = useState('')
    const [updatedrole, setupdatedrole] = useState('')
    const [countryarr, setCountryArr] = useState([])
    const [statearr, setStateArr] = useState([])
    const [cityarr, setCityArr] = useState([])
    const [photoBase64, setPhotoBase64] = useState(null)
    const [photoName, setPhotoName] = useState('')
    const [photoExt, setPhotoExt] = useState('')
    //const [currentPass, setcurrentPass] = useState('')
    //const [newPass, setnewPass] = useState('')
    //const [confirmPass, setconfirmPass] = useState('')

    const [twitter, setTwitter] = useState('')
    const [facebook, setfacebook] = useState('')
    const [linkedin, setlinkedin] = useState('')
    const [google, setgoogle] = useState('')
    const [instagram, setinstagram] = useState('')
    const [quora, setquora] = useState('')
    const [socialErrors, setSocialErrors] = useState({})
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
        const file = event.target.files[0]
        if (!file) return

        if (file.size >= 5000000) {
            alert("Please upload file less than 5MB")
            return
        }
        if (!fileext.includes(file.type)) {
            alert("Only select image file type with JPG, JPEG, PNG")
            return
        }

        const img = new window.Image()
        const objectUrl = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            const canvas = document.createElement('canvas')
            const MAX_SIZE = 200  // reduced from 300 to keep base64 small
            let width = img.width
            let height = img.height
            if (width > height) {
                if (width > MAX_SIZE) { height = Math.round((height * MAX_SIZE) / width); width = MAX_SIZE }
            } else {
                if (height > MAX_SIZE) { width = Math.round((width * MAX_SIZE) / height); height = MAX_SIZE }
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            const compressed = canvas.toDataURL('image/jpeg', 0.5)  // quality 0.5
            const base64Clean = compressed.split(',')[1]

            console.log('Compressed base64 length:', base64Clean.length) // should be under 30000
            setsPhoto(compressed)
            setPhotoBase64(base64Clean)
            setPhotoName(file.name)
            setPhotoExt(file.name.split('.').pop())
        }
        img.src = objectUrl
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

    const isValidUrl = (value) => {
        if (!value) return true // empty is allowed
        try {
            const url = new URL(value)
            return url.protocol === 'http:' || url.protocol === 'https:'
        } catch {
            return false
        }
    }
    // const handleChangeCurrPass = (e) => {
    //   setcurrentPass(e.target.value)
    // }

    // const handleChangeNewPass = (e) => {
    //   setnewPass(e.target.value)
    // }

    // const handleChangeConfirmPass = (e) => {
    //   setconfirmPass(e.target.value)
    // }

    const [dobError, setDobError] = useState('')

    const handleChangeDob = (date) => {
        if (date) {
            const today = new Date()
            const age = today.getFullYear() - date.getFullYear()
            const monthDiff = today.getMonth() - date.getMonth()
            const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) ? age - 1 : age

            if (actualAge < 3) {
                setDobError('Age must be at least 3 years.')
                setdDateOfBirth(date)
            } else if (actualAge > 75) {
                setDobError('Age must not exceed 75 years.')
                setdDateOfBirth(date)
            } else {
                setDobError('')
                setdDateOfBirth(date)
            }
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
    const socialPlaceholders = {
        facebook: 'https://www.facebook.com/yourpage',
        twitter: 'https://www.twitter.com/yourhandle',
        linkedin: 'https://www.linkedin.com/in/yourprofile',
        google: 'https://www.google.com/yourpage',
        instagram: 'https://www.instagram.com/yourhandle',
        quora: 'https://www.quora.com/profile/yourname',
    }

    const handleSocialChange = (field, setter) => (e) => {
        const val = e.target.value
        setter(val)
        setSocialErrors(prev => ({
            ...prev,
            [field]: val && !isValidUrl(val) ? `Please enter a valid URL (e.g. ${socialPlaceholders[field]})` : ''
        }))
    }

    const handleChangeTwitter = handleSocialChange('twitter', setTwitter)
    const handleChangeFacbeook = handleSocialChange('facebook', setfacebook)
    const handleChangeLinkedin = handleSocialChange('linkedin', setlinkedin)
    const handleChangeGoogle = handleSocialChange('google', setgoogle)
    const handleChangeInstagram = handleSocialChange('instagram', setinstagram)
    const handleChangeQuora = handleSocialChange('quora', setquora)


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
                        setdDateOfBirth(res.data[0]['dDateOfBirth'] ? new Date(res.data[0]['dDateOfBirth']) : '')
                        setsGender(res.data[0]['sGender'])
                        setsMaritalStatus(res.data[0]['sMaritalStatus'])
                        setnCountryId(res.data[0]['nCountryId'])
                        setnStateId(res.data[0]['nStateId'])
                        setnCityId(res.data[0]['nCityId'])

                        // Load states for the saved country
                        if (res.data[0]['nCountryId']) {
                            Axios.get(`${API_URL}/api/registration/BindState/${res.data[0]['nCountryId']}`, {
                                headers: { ApiKey: `${API_KEY}` }
                            }).then(r => { if (r.data.length !== 0) setStateArr(r.data) })
                        }

// Load cities for the saved state
                        if (res.data[0]['nStateId']) {
                            Axios.get(`${API_URL}/api/registration/BindCity/${res.data[0]['nStateId']}`, {
                                headers: { ApiKey: `${API_KEY}` }
                            }).then(r => { if (r.data.length !== 0) setCityArr(r.data) })
                        }
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
                        <h4 className="rbt-title-style-3">Update Profile</h4>
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
                            {/*<li role="presentation">*/}
                            {/*  <Link*/}
                            {/*    href="#"*/}
                            {/*    className="tab-button"*/}
                            {/*    id="password-tab"*/}
                            {/*    data-bs-toggle="tab"*/}
                            {/*    data-bs-target="#password"*/}
                            {/*    role="tab"*/}
                            {/*    aria-controls="password"*/}
                            {/*    aria-selected="false"*/}
                            {/*  >*/}
                            {/*    <span className="title">Password</span>*/}
                            {/*  </Link>*/}
                            {/*</li>*/}
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
                                // 3. Fix initialValues — remove getimg dependency
                                initialValues={{
                                    nRegId: nRegid['regid'],
                                    sPhoto: photoBase64 || null,
                                    sPhotoName: photoName || sPhotoName || '',
                                    sPhotoExt: photoExt || '',
                                    sFName: sFname || '',
                                    sLName: sLname || '',
                                    sEmail: sEmail || '',
                                    sMobile: sMobile || '',
                                    nUpdatedBy: nRegid['regid'],
                                    nURoleId: updatedrole || ''
                                }}
                                enableReinitialize={true}
                                // validateOnChange={false}
                                onSubmit={async (values, { resetForm }) => {
                                    console.log('Submitting values:', values)
                                    console.log('sPhoto length:', values.sPhoto?.length)
                                    console.log('sPhoto preview:', values.sPhoto?.substring(0, 50))
                                    console.log('SENDING TO API:', {
                                        nRegId: values.nRegId,
                                        sPhotoLength: values.sPhoto?.length,
                                        sPhotoStart: values.sPhoto?.substring(0, 30),
                                        sPhotoName: values.sPhotoName,
                                        sPhotoExt: values.sPhotoExt,
                                    })
                                    // if (values.dDateOfBirth || values.sGender || values.sMaritalStatus || values.nCountryId || values.nStateId || values.nCityId || values.sHFBInfo || values.sStreetAddr || values.sLandmark || values.sPincode) {

                                    if (values.sFName && values.sLName) {
                                        // this.setState({ isLoading: true })
                                        await Axios.put(`${API_URL}/api/registration/UpdateProfileGeneral`, values, {
                                            headers: {
                                                ApiKey: `${API_KEY}`
                                            }
                                        }).then(res => {
                                            let retData

                                            try {
                                                retData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
                                                retData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
                                                console.log('API retData:', retData)  // ← ADD THIS
                                            } catch (parseErr) {
                                                console.error('JSON parse failed:', res.data)
                                                ErrorDefaultAlert('Server returned an unexpected response.')
                                                return
                                            }
                                            if (retData.success === "1") {
                                                const gdata = DecryptData(localStorage.getItem('userData'))
                                                if (gdata) {
                                                    gdata.fname = values.sFName
                                                    gdata.lname = values.sLName
                                                    gdata.profile = (values.sPhoto && values.sPhoto.length > 0)
                                                        ? `data:image/jpeg;base64,${values.sPhoto}`
                                                        : sPhoto
                                                }
                                                localStorage.setItem('userData', EncryptData(gdata))
                                                { SuccessRedirectAlert({ title: "Updated", message: "Profile updated successfully.", rlink: "1" }) }
                                            } else if (retData.success === "0") {
                                                { ErrorDefaultAlert(retData.message || retData.msg || 'Update failed. Please try again.') }
                                            }
                                        })
                                            .catch(err => {
                                                console.error('Full error:', err)
                                                console.error('Response status:', err.response?.status)
                                                console.error('Response data:', err.response?.data)
                                                const errMsg = err.response?.data?.message
                                                    || err.response?.data
                                                    || err.message
                                                    || 'Something went wrong.'
                                                ErrorDefaultAlert(errMsg)
                                            })
                                    } else {
                                        InfoDefaultAlert('Please enter values properly.')
                                    }
                                }
                                }

                            >

                                {({ errors, touched, values, setFieldValue }) => (

                                    <Form
                                        className="rbt-profile-row rbt-default-form row row--15"
                                    >
                                        <div className="col-12 mb--20 d-flex justify-content-center">
                                            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                                                <img
                                                    src={sPhoto || '/default-avatar.png'}
                                                    alt="Profile"
                                                    style={{
                                                        width: '150px',
                                                        height: '150px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: '3px solid #e0e0e0',
                                                    }}
                                                />
                                                <label
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '6px',
                                                        right: '6px',
                                                        backgroundColor: '#6b38fb',
                                                        borderRadius: '50%',
                                                        width: '36px',
                                                        height: '36px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <i className="feather-camera" style={{ color: '#fff', fontSize: '16px' }}/>
                                                    <input type="file" id="file" name="file" onChange={(e) => onChangeImage(e)} accept="image/*" style={{ display: 'none' }} />
                                                </label>
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
                                                    readOnly
                                                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
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

                        {/*<div*/}
                        {/*    className="tab-pane fade"*/}
                        {/*    id="password"*/}
                        {/*    role="tabpanel"*/}
                        {/*    aria-labelledby="password-tab"*/}
                        {/*>*/}
                        {/*  <Formik*/}
                        {/*      // validationSchema={UserValidationSchema}*/}
                        {/*      initialValues={{*/}
                        {/*        nRegId: nRegid['regid'],*/}
                        {/*        sOldPassword: currentPass ? currentPass : '',*/}
                        {/*        sNewPassword: newPass ? newPass : '',*/}
                        {/*        sPassword: confirmPass ? confirmPass: '',*/}
                        {/*        nUpdatedBy: nRegid['regid'],*/}
                        {/*        nURoleId: updatedrole ? updatedrole : ''*/}
                        {/*      }}*/}
                        {/*      enableReinitialize={true}*/}
                        {/*      // validateOnChange={false}*/}
                        {/*      onSubmit={async (values, { resetForm }) => {*/}
                        {/*        console.log(values)*/}

                        {/*        if(values.sPassword) {*/}

                        {/*          await Axios.put(`${API_URL}/api/registration/PasswordChange`, values, {*/}
                        {/*            headers: {*/}
                        {/*              ApiKey: `${API_KEY}`*/}
                        {/*            }*/}
                        {/*          }).then(res => {*/}
                        {/*            const retData = JSON.parse(res.data)*/}
                        {/*            // resetForm({})*/}
                        {/*            setcurrentPass('')*/}
                        {/*            setnewPass('')*/}
                        {/*            setconfirmPass('')*/}
                        {/*            //alert(retData.success)*/}
                        {/*            if (retData.success === "1") {*/}
                        {/*              {*/}
                        {/*                SuccessAlert(retData)*/}
                        {/*              }*/}

                        {/*            } else if (retData.success === "0") {*/}
                        {/*              {*/}
                        {/*                ErrorAlert(retData)*/}
                        {/*              }*/}
                        {/*            }*/}
                        {/*          })*/}
                        {/*              .catch(err => {*/}
                        {/*                console.log(err)*/}
                        {/*                {*/}
                        {/*                  ErrorDefaultAlert(JSON.stringify(err.response))*/}
                        {/*                }*/}
                        {/*                //alert('Something went wrong.')*/}
                        {/*              })*/}
                        {/*        } else {*/}
                        {/*          InfoDefaultAlert('Please enter values properly.')*/}
                        {/*        }*/}

                        {/*      }*/}
                        {/*      }*/}

                        {/*  >*/}

                        {/*    {({ errors, touched, values }) => (*/}

                        {/*        <Form*/}
                        {/*            className="rbt-profile-row rbt-default-form row row--15"*/}
                        {/*        >*/}
                        {/*          <div className="col-12">*/}
                        {/*            <div className="rbt-form-group">*/}
                        {/*              <label htmlFor="currentpassword">Current Password</label>*/}
                        {/*              <input*/}
                        {/*                  id="currentpassword"*/}
                        {/*                  type="password"*/}
                        {/*                  value={currentPass}*/}
                        {/*                  onChange={handleChangeCurrPass}*/}
                        {/*                  placeholder="Current Password"*/}
                        {/*              />*/}
                        {/*            </div>*/}
                        {/*          </div>*/}
                        {/*          <div className="col-12">*/}
                        {/*            <div className="rbt-form-group">*/}
                        {/*              <label htmlFor="newpassword">New Password</label>*/}
                        {/*              <input*/}
                        {/*                  id="newpassword"*/}
                        {/*                  type="password"*/}
                        {/*                  value={newPass}*/}
                        {/*                  onChange={handleChangeNewPass}*/}
                        {/*                  placeholder="New Password"*/}
                        {/*              />*/}
                        {/*            </div>*/}
                        {/*          </div>*/}
                        {/*          <div className="col-12">*/}
                        {/*            <div className="rbt-form-group">*/}
                        {/*              <label htmlFor="retypenewpassword">*/}
                        {/*                Re-type New Password*/}
                        {/*              </label>*/}
                        {/*              <input*/}
                        {/*                  id="retypenewpassword"*/}
                        {/*                  type="password"*/}
                        {/*                  value={confirmPass}*/}
                        {/*                  onChange={handleChangeConfirmPass}*/}
                        {/*                  placeholder="Re-type New Password"*/}
                        {/*              />*/}
                        {/*            </div>*/}
                        {/*          </div>*/}
                        {/*          <div className="col-12 mt--10">*/}
                        {/*            <div className="rbt-form-group">*/}
                        {/*              <button type={'submit'} className="rbt-btn btn-gradient">*/}
                        {/*                Update Password*/}
                        {/*              </button>*/}
                        {/*            </div>*/}
                        {/*          </div>*/}
                        {/*        </Form>*/}
                        {/*    )}*/}
                        {/*  </Formik>*/}

                        {/*</div>*/}

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
                                    if (dobError) {
                                        InfoDefaultAlert('Please fix Date of Birth before submitting.')
                                        return
                                    }
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
                                                <label htmlFor="dob">Date of Birth</label>
                                                <DatePicker
                                                    selected={dDateOfBirth}
                                                    onChange={handleChangeDob}
                                                    name="dDateOfBirth"
                                                    dateFormat="dd/MM/yyyy"
                                                    className={`form-control ${dobError ? 'is-invalid' : ''}`}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    minDate={new Date(new Date().getFullYear() - 75, new Date().getMonth(), new Date().getDate())}
                                                    maxDate={new Date(new Date().getFullYear() - 3, new Date().getMonth(), new Date().getDate())}
                                                    placeholderText="DD/MM/YYYY"
                                                    //  isClearable
                                                />
                                                {dobError && <div className="text-danger mt-1" style={{fontSize: '13px'}}>{dobError}</div>}
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500'}}>Gender</label>
                                                <div style={{display:'flex', gap:'10px'}}>
                                                    {['male','female'].map(g => (
                                                        <label key={g} onClick={() => setsGender(g)} style={{
                                                            flex:1, display:'flex', alignItems:'center', justifyContent:'center',
                                                            gap:'8px', padding:'10px 16px', borderRadius:'8px', cursor:'pointer',
                                                            border: sGender === g ? '2px solid #6b38fb' : '1.5px solid #e0e0e0',
                                                            background: sGender === g ? '#f3eeff' : 'transparent',
                                                            color: sGender === g ? '#6b38fb' : 'inherit',
                                                            fontWeight: sGender === g ? '500' : '400',
                                                            transition:'all 0.15s'
                                                        }}>
                                                            <span style={{fontSize:'18px'}}>{g === 'male' ? '' : ''}</span>
                                                            {g.charAt(0).toUpperCase() + g.slice(1)}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500'}}>Marital Status</label>
                                                <div style={{display:'flex', gap:'10px'}}>
                                                    {['Married','Unmarried'].map(s => (
                                                        <label key={s} onClick={() => setsMaritalStatus(s)} style={{
                                                            flex:1, display:'flex', alignItems:'center', justifyContent:'center',
                                                            gap:'8px', padding:'10px 16px', borderRadius:'8px', cursor:'pointer',
                                                            border: sMaritalStatus === s ? '2px solid #6b38fb' : '1.5px solid #e0e0e0',
                                                            background: sMaritalStatus === s ? '#f3eeff' : 'transparent',
                                                            color: sMaritalStatus === s ? '#6b38fb' : 'inherit',
                                                            fontWeight: sMaritalStatus === s ? '500' : '400',
                                                            transition:'all 0.15s'
                                                        }}>
                                                            <span style={{fontSize:'16px'}}>{s === 'Married' ? '' : ''}</span>
                                                            {s}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500'}}>Country</label>
                                                <div style={{position:'relative'}}>
                                                    <select name="sCountry" value={nCountryId} onChange={handleChangeCountry} style={{
                                                        width:'100%', appearance:'none', WebkitAppearance:'none',
                                                        padding:'10px 40px 10px 14px', borderRadius:'8px',
                                                        border:'1.5px solid #e0e0e0', background:'transparent',
                                                        fontSize:'14px', cursor:'pointer'
                                                    }}>
                                                        <option value="">Select country</option>
                                                        {countryarr.map(e => <option key={e.nCountryId} value={e.nCountryId}>{e.sCountryname}</option>)}
                                                    </select>
                                                    <span style={{position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#888', fontSize:'12px'}}>▾</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<div className="col-lg-6 col-md-6 col-sm-6 col-12">*/}
                                        {/*    <div className="rbt-form-group">*/}
                                        {/*        <Label className="font-weight-bold f-14 mt-3" htmlFor='sState'>State</Label>*/}
                                        {/*        <select name="sState"*/}
                                        {/*                className='form-control'*/}
                                        {/*                value={nStateId}*/}
                                        {/*                onChange={handleChangeState}*/}
                                        {/*        >*/}
                                        {/*            <option value="">Select</option>*/}
                                        {/*            {statearr.map((e) => {*/}
                                        {/*                return <option key={e.nStateId} value={e.nStateId}>{e.sStateName}</option>*/}
                                        {/*            })}*/}
                                        {/*        </select>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500'}}>State</label>
                                                <div style={{position:'relative'}}>
                                                    <select name="sState" value={nStateId} onChange={handleChangeState} style={{
                                                        width:'100%', appearance:'none', WebkitAppearance:'none',
                                                        padding:'10px 40px 10px 14px', borderRadius:'8px',
                                                        border:'1.5px solid #e0e0e0', background:'transparent',
                                                        fontSize:'14px', cursor:'pointer'
                                                    }}>
                                                        <option value="">Select state</option>
                                                        {statearr.map(e => <option key={e.nStateId} value={e.nStateId}>{e.sStateName}</option>)}
                                                    </select>
                                                    <span style={{position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#888', fontSize:'12px'}}>▾</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<div className="col-lg-6 col-md-6 col-sm-6 col-12">*/}
                                        {/*    <div className="rbt-form-group">*/}
                                        {/*        <Label className="font-weight-bold f-14 mt-3" htmlFor='sCity'>City</Label>*/}
                                        {/*        <select name="sCity"*/}
                                        {/*                className='form-control'*/}
                                        {/*                value={nCityId}*/}
                                        {/*                onChange={handleChangeCity}*/}
                                        {/*        >*/}
                                        {/*            <option value="">Select</option>*/}
                                        {/*            {cityarr.map((e) => {*/}
                                        {/*                return <option key={e.nCityId} value={e.nCityId}>{e.sCityName}</option>*/}
                                        {/*            })}*/}
                                        {/*        </select>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500'}}>City</label>
                                                <div style={{position:'relative'}}>
                                                    <select name="sCity" value={nCityId} onChange={handleChangeCity} style={{
                                                        width:'100%', appearance:'none', WebkitAppearance:'none',
                                                        padding:'10px 40px 10px 14px', borderRadius:'8px',
                                                        border:'1.5px solid #e0e0e0', background:'transparent',
                                                        fontSize:'14px', cursor:'pointer'
                                                    }}>
                                                        <option value="">Select City</option>
                                                        {cityarr.map(e => <option key={e.nCityId} value={e.nCityId}>{e.sCityName}</option>)}
                                                    </select>
                                                    <span style={{position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#888', fontSize:'12px'}}>▾</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500', marginTop:'12px'}}>
                                                    <span style={{marginRight:'6px'}}></span>House/Flat/Block No
                                                </label>
                                                <div style={{position:'relative'}}>
                                                    <input
                                                        id="hfb"
                                                        type="text"
                                                        value={hfb}
                                                        onChange={handleChangeHFB}
                                                        placeholder="e.g. B-204, Tower 3"
                                                        style={{
                                                            width:'100%', padding:'10px 14px', borderRadius:'8px',
                                                            border:'1.5px solid #e0e0e0', fontSize:'14px',
                                                            background:'transparent', outline:'none',
                                                            transition:'border-color 0.15s'
                                                        }}
                                                        onFocus={e => e.target.style.borderColor='#6b38fb'}
                                                        onBlur={e => e.target.style.borderColor='#e0e0e0'}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500', marginTop:'12px'}}>
                                                    <span style={{marginRight:'6px'}}></span>Street/Society Address
                                                </label>
                                                <textarea
                                                    id="street"
                                                    name="street"
                                                    value={street}
                                                    onChange={handleChangestreet}
                                                    rows="3"
                                                    placeholder="e.g. Green Park Society, MG Road"
                                                    style={{
                                                        width:'100%', padding:'10px 14px', borderRadius:'8px',
                                                        border:'1.5px solid #e0e0e0', fontSize:'14px',
                                                        background:'transparent', outline:'none', resize:'vertical',
                                                        transition:'border-color 0.15s', fontFamily:'inherit'
                                                    }}
                                                    onFocus={e => e.target.style.borderColor='#6b38fb'}
                                                    onBlur={e => e.target.style.borderColor='#e0e0e0'}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500', marginTop:'12px'}}>
                                                    <span style={{marginRight:'6px'}}></span>Landmark
                                                </label>
                                                <input
                                                    id="landmark"
                                                    type="text"
                                                    value={sLandmark}
                                                    onChange={handleChangeLandmark}
                                                    placeholder="e.g. Near City Mall"
                                                    style={{
                                                        width:'100%', padding:'10px 14px', borderRadius:'8px',
                                                        border:'1.5px solid #e0e0e0', fontSize:'14px',
                                                        background:'transparent', outline:'none',
                                                        transition:'border-color 0.15s'
                                                    }}
                                                    onFocus={e => e.target.style.borderColor='#6b38fb'}
                                                    onBlur={e => e.target.style.borderColor='#e0e0e0'}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                                            <div className="rbt-form-group">
                                                <label style={{display:'block', marginBottom:'8px', fontWeight:'500', marginTop:'12px'}}>
                                                    <span style={{marginRight:'6px'}}></span>Pincode
                                                </label>
                                                <input
                                                    id="pincode"
                                                    type="text"
                                                    value={sPincode}
                                                    onChange={handleChangepincode}
                                                    placeholder="e.g. 380001"
                                                    maxLength={6}
                                                    style={{
                                                        width:'100%', padding:'10px 14px', borderRadius:'8px',
                                                        border:'1.5px solid #e0e0e0', fontSize:'14px',
                                                        background:'transparent', outline:'none',
                                                        transition:'border-color 0.15s'
                                                    }}
                                                    onFocus={e => e.target.style.borderColor='#6b38fb'}
                                                    onBlur={e => e.target.style.borderColor='#e0e0e0'}
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

                                    const hasErrors = Object.values(socialErrors).some(e => e)
                                    if (hasErrors) {
                                        InfoDefaultAlert('Please enter valid URLs for all social links.')
                                        return
                                    }

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
                                                />
                                                {socialErrors.facebook && <div className="text-danger mt-1" style={{fontSize: '13px'}}>{socialErrors.facebook}</div>}
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
                                                />
                                                {socialErrors.twitter && <div className="text-danger mt-1" style={{fontSize: '13px'}}>{socialErrors.twitter}</div>}
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
                                                {socialErrors.linkedin && <div className="text-danger mt-1" style={{fontSize: '13px'}}>{socialErrors.linkedin}</div>}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="rbt-form-group">
                                                <label htmlFor="website">
                                                    <i className="feather-globe"></i> Google
                                                </label>
                                                <input
                                                    id="google"
                                                    type="text"
                                                    value={google}
                                                    onChange={handleChangeGoogle}
                                                    // placeholder="https://website.com/"
                                                />
                                                {socialErrors.google && <div className="text-danger mt-1" style={{fontSize: '13px'}}>{socialErrors.google}</div>}
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
                                                {socialErrors.instagram && <div className="text-danger mt-1" style={{fontSize: '13px'}}>{socialErrors.instagram}</div>}
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
                                                />
                                                {socialErrors.quora && <div className="text-danger mt-1" style={{fontSize: '13px'}}>{socialErrors.quora}</div>}
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