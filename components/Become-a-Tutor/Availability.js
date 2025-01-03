import Link from "next/link";
import React, {useEffect, useState} from "react";
import {API_URL, API_KEY} from '../../constants/constant'
import Axios from "axios";
import {Alert, CustomInput} from "reactstrap";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { useRouter } from "next/router";
import { Formik, ErrorMessage, Form } from 'formik'
import * as Yup from "yup";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const MySwal = withReactContent(Swal)


const UserValidationSchema = Yup.object().shape({
    nCountryId: Yup.string()
        .required('This field is required'),
    sTime_slot: Yup.string()
      .required('This field is required'),
    sPreferable_days: Yup.string()
      .required('This field is required'),
    sWeekend_batches: Yup.string()
        .required('This field is required'),
    sMax_hours: Yup.string()
        .required('This field is required')
})

const Availability = () => {
  const REACT_APP = API_URL
  const router = useRouter()
  const [country, setCountry] = useState([]);
  const [countryId, setcountryId] = useState('101')
  const [duration, setDuration] = useState('1 hours')
  const [timeSlot, setTimeSlot] = useState('')
  const [weekendBatch, setWeekendBatch] = useState('')
  const [teachingDays, setTeachingDays] = useState([])
  const [isLoading, setisLoading] = useState(false)


  const handleChangeDuration = (e) => {
      console.log(e.target.value)
      setDuration(e.target.value)
  }

  const handleChangeTimeSlot = (e) => {
      console.log(e.target.value)
    setTimeSlot(e.target.value)
  }

  const handleChangeWeekendBatch = (e) => {
      console.log(e.target.value)
    setWeekendBatch(e.target.value)
  }

  const handleChangeTeachingDays = (e) => {
      console.log(e.target.value)
      const { checked, value } = e.target;

      if (checked) {
          // Add the value to sDays array if checkbox is checked
          // console.log('values', value)
          setTeachingDays((prevDays) => [...prevDays, value]);
      } else {
          // Remove the value from sDays array if checkbox is unchecked
          setTeachingDays((prevDays) => prevDays.filter((day) => day !== value));
      }

      // const selectedDay = e.target.value;
      // // console.log(selectedDay)
      // if (teachingDays.includes(selectedDay)) {
      //     // If the day is already selected, remove it from the array
      //     setTeachingDays(teachingDays.filter(day => day !== selectedDay));
      // } else {
      //     // If the day is not selected, add it to the array
      //     console.log([...teachingDays, selectedDay])
      //     setTeachingDays([...teachingDays, selectedDay]);
      // }
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
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  const  handleChangeCountry = (e) => {
      // console.log(e.target.value)
    if (e.target.value) {
      setcountryId(parseInt(e.target.value))
    }
  }
  const [regId, setregId] = useState('')
    const [commentMessage, setCommentMessage] = useState([])
    const [verifySts, setverifySts] = useState()
    const [isAvailabililityAlert, setisAvailabililityAlert] = useState(0)
    const [tutorcnt, setTutorcnt] = useState('')
    const [tutoravailcnt, settutoravailcnt] = useState('')
  useEffect(() => {
      bindCountry()
    if(localStorage.getItem('userData')) {
      setregId(JSON.parse(localStorage.getItem('userData')).regid)

      Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
          headers: {
              ApiKey: `${API_KEY}`
          }
      })
          .then(res => {
              // console.log("Ava",res.data[0].sTimeAvail_verify)
              if (res.data.length !== 0) {
                  if (res.data[0].sTimeAvail_verify !== null){
                      setCommentMessage(res.data[0])
                      setverifySts(res.data[0].sTimeAvail_verify)
                      setisAvailabililityAlert(1)
                  }else{
                      setverifySts(0)
                  }

              }else{
                  setverifySts(0)
              }
          })
          .catch(err => {
              { ErrorDefaultAlert(err) }
          })
        Axios.get(`${API_URL}/api/TutorBasics/GetTutorProfile/${JSON.parse(localStorage.getItem('userData')).regid}`, {
          headers: {
              ApiKey: `${API_KEY}`
          }
      })
          .then(res => {
              // console.log(res.data)
              if(res.data[0].cnt !== 0) {
                  setTutorcnt(res.data[0].cnt)
              }
          })
          .catch(err => {
              { ErrorDefaultAlert(err) }
          })

      Axios.get(`${API_URL}/api/TutorAvailQue/GetTutorAvail/${JSON.parse(localStorage.getItem('userData')).regid}`, {
          headers: {
              ApiKey: `${API_KEY}`
          }
      })
          .then(res => {
              console.log("Time",res.data)
              settutoravailcnt(res.data.length)
              if(res.data.length !== 0 ){
                  setcountryId(res.data[0]['nCountryId'])
                  setDuration(res.data[0]['sMax_hours'])
                  setTimeSlot(res.data[0]['sTime_slot'])
                  setWeekendBatch(res.data[0]['sWeekend_batches'])
                  const daysString = res.data[0]['sPreferable_days'];
                    // console.log('daysString', daysString)
                  const daysArray = daysString.split(",");

                  // console.log(daysArray)
                  setTeachingDays(daysArray)
              }


              // if(res.data[0].cnt !== 0) {
              //     setTutorcnt(res.data[0].cnt)
              // }
          })
          .catch(err => {
              { ErrorDefaultAlert(err) }
          })

        Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if(res.data.length !== 0) {
                    // if(res.data[0].bIsReview !== 0) {
                    //     router.push('/become-a-tutor/Review')
                    // } else {
                    //
                    // }
                }
                console.log(res.data)
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
            {
                isAvailabililityAlert !== 1 && verifySts !== 0 && verifySts !== '' ?
                    <>
                    <div className="section-title">
                        <Skeleton height={20} width={150} className='rbt-title-style-3 mb-0'/>
                    </div>
                    <div className={'mb-3'}>
                        <Skeleton height={1} width={'100%'} className='my-4'/>
                    </div>
                    <Skeleton height={40} className="w-100 mb-2"/>
                        <div className={'row row--15 mt-3'}>

                            <div className="col-lg-6 mb-3">
                                <label>
                                    <Skeleton height={15} width={120}/> {/* Label placeholder */}
                                </label>
                                <div className="w-100">
                                    <Skeleton height={40} width="100%"/> {/* Dropdown placeholder */}
                                </div>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <label>
                                    <Skeleton height={15} width={330}/> {/* Label placeholder */}
                                </label>
                                <div className="w-100">
                                    <Skeleton height={40} width="100%"/> {/* Dropdown placeholder */}
                                </div>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <label>
                                    <Skeleton height={15} width={200}/> {/* Label placeholder */}
                                </label>
                                <div className="form-group d-flex mt-2">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className={index !== 0 ? "ms-3" : ""}>
                                            <div className={'d-flex'}>
                                                <Skeleton circle height={20} width={20}
                                                          className="me-2"/> {/* Radio button placeholder */}
                                                <Skeleton height={15} width={70}/> {/* Label text placeholder */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <label>
                                    <Skeleton height={15} width={240}/> {/* Label placeholder */}
                                </label>
                                <div className="form-group d-flex mt-2">
                                    {[...Array(2)].map((_, index) => (
                                        <div key={index} className={index !== 0 ? "ms-3" : ""}>
                                            <div className={'d-flex'}>
                                                <Skeleton circle height={20} width={20}
                                                          className="me-2"/> {/* Radio button placeholder */}
                                                <Skeleton height={15} width={50}/> {/* Label text placeholder */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-12 mb-3">
                                <label>
                                    <Skeleton height={15} width={240}/> {/* Label placeholder */}
                                </label>
                                <div className="form-group d-flex mt-2">
                                    {[...Array(7)].map((_, index) => (
                                        <div key={index} className={index !== 0 ? "ms-3" : ""}>
                                            <div className={'d-flex'}>
                                                <Skeleton circle height={20} width={20}
                                                          className="me-2"/> {/* Radio button placeholder */}
                                                <Skeleton height={15}
                                                          width={index === 2 || index === 3 || index === 5 ? 100 : 70}/> {/* Label text placeholder */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={'col-lg-12'}>
                                <div className="form-group">
                                    <Skeleton height={40} className="w-100 mb-2"/>
                                </div>
                            </div>


                        </div>
                    </>
                    :
                    <>
                        <div className="section-title">
                            <h4 className="rbt-title-style-3">Time Availability</h4>
                        </div>
                        {
                            isAvailabililityAlert === 1 ? <>
                                {verifySts === 2 ? <>
                                    <Alert color='success'>
                                        <h6 className='alert-heading m-0 text-center'>
                                        Time Availibility verification has been approved by admin
                                        </h6>
                                    </Alert>
                                </> : <>
                                    {verifySts === 1 ? <>
                                        <Alert color='warning'>
                                            <h6 className='alert-heading m-0 text-center'>
                                                Interests verification is in pending state
                                            </h6>
                                        </Alert>
                                    </> : <>
                                        {verifySts === 0 || verifySts === null ? <></> : <>
                                            <Alert color='danger'>
                                                <h6 className='alert-heading m-0 text-center'>
                                                    Interests verification has been disapproved by admin
                                                </h6>
                                            </Alert>

                                            {
                                                commentMessage.sTimeAvail_comment !== null && commentMessage.sTimeAvail_comment !== '' && commentMessage.sTimeAvail_comment !== 0 ?

                                                    <Alert color='danger'>
                                                                            <span className={'text-center'}
                                                                                  style={{fontSize: '14px'}}><b>Reason :</b> {commentMessage.sTimeAvail_comment}</span>
                                                    </Alert> : <></>
                                            }
                                        </>}
                                    </>}
                                </>}
                            </> : <></>
                        }

                        <Formik
                            // validationSchema={UserValidationSchema}
                            initialValues={{
                                nRegId: regId,
                                nCountryId: countryId ? countryId : '',
                                sTime_slot: timeSlot === 'morning' ? 'morning' : timeSlot === 'afternoon' ? 'afternoon' : timeSlot === 'evening' ? 'evening' : timeSlot === 'lateEvening' ? 'lateEvening' : timeSlot === 1 ? 'morning' : timeSlot === 2 ? 'afternoon' : timeSlot === 3 ? 'evening' : timeSlot === 4 ? 'lateEvening' : '',
                                sPreferable_days: teachingDays ? [teachingDays].toString() : '',
                                sWeekend_batches: weekendBatch === 'yes' ? 'yes' : weekendBatch === 'no' ? 'no' : weekendBatch === 1 ? 'yes' : weekendBatch === 0 ? 'no' : '',
                                sMax_hours: duration ? `${duration}` : ''
                            }}
                            enableReinitialize={true}
                            onSubmit={async (values, {resetForm}) => {
                                console.log("Form Value",values,"timeSlot",timeSlot,"sMax_hours",duration)
                                //   console.log([teachingDays].toString())
                                if (verifySts === 2) {

                                } else {
                                    if (tutoravailcnt !== 0) {

                                        return MySwal.fire({
                                            title: "Info",
                                            text: "Are You sure you want to update the details",
                                            icon: 'info',
                                            showCancelButton: true,
                                            confirmButtonText: 'Yes',
                                            closeOnCancel: false,
                                            customClass: {
                                                confirmButton: 'btn btn-primary',
                                                cancelButton: 'btn btn-outline-primary ms-2'
                                            },
                                            buttonsStyling: false
                                        }).then(function (result) {
                                            if (result.value) {
                                                setisLoading(true)
                                                console.log(values)
                                                Axios.put(`${API_URL}/api/TutorAvailQue/UpdateTutorAvailQue`, values, {
                                                    headers: {
                                                        ApiKey: `${API_KEY}`
                                                    }
                                                }).then(res => {
                                                    console.log(res.data)
                                                    const retData = JSON.parse(res.data)
                                                    // localStorage.removeItem('verify_uname')
                                                    // console.log(retData)
                                                    resetForm({})
                                                    if (retData.success === '1') {
                                                        router.push('/become-a-tutor/Review')
                                                    }
                                                })
                                                    .catch(err => {
                                                        // console.log(err)
                                                        {
                                                            ErrorDefaultAlert(JSON.stringify(err.response))
                                                        }
                                                    })
                                            } else {

                                            }

                                        })

                                    } else {
                                        return MySwal.fire({
                                            title: "Info",
                                            text: "Are You sure you want to submit the details",
                                            icon: 'info',
                                            showCancelButton: true,
                                            confirmButtonText: 'Yes',
                                            closeOnCancel: false,
                                            customClass: {
                                                confirmButton: 'btn btn-primary',
                                                cancelButton: 'btn btn-outline-primary ms-2'
                                            },
                                            buttonsStyling: false
                                        }).then(function (result) {
                                            if (result.value) {
                                                setisLoading(true)
                                                Axios.post(`${API_URL}/api/TutorAvailQue/InsertTutorAvailQue`, values, {
                                                    headers: {
                                                        ApiKey: `${API_KEY}`
                                                    }
                                                }).then(res => {
                                                    console.log(res.data)
                                                    const retData = JSON.parse(res.data)
                                                    // localStorage.removeItem('verify_uname')
                                                    // console.log(retData)
                                                    resetForm({})
                                                    if (retData.success === '1') {
                                                        router.push('/become-a-tutor/Review')
                                                    }
                                                })
                                                    .catch(err => {
                                                        // console.log(err)
                                                        {
                                                            ErrorDefaultAlert(JSON.stringify(err.response))
                                                        }
                                                    })
                                            } else {

                                            }

                                        })
                                    }
                                }

                            }}
                        >
                            {({errors, touched}) => {
                                return (
                                    <>
                                        <Form>
                                            <div className={'row'}>
                                                <div className={'col-lg-6'}>
                                                    <label>
                                                        Select Country
                                                    </label>
                                                    <select disabled={verifySts === 2} className="w-100"
                                                            name={'nCountryId'} onChange={handleChangeCountry}
                                                            value={countryId}>
                                                        {country.map((item, index) => {
                                                            return (
                                                                <option key={index}
                                                                        value={item.nCountryId}>{item.sCountryname}</option>
                                                            )
                                                        })}
                                                    </select>
                                                    <ErrorMessage name='nCountryId' component='div'
                                                                  className='field-error text-danger'/>
                                                </div>
                                                <div className={'col-lg-6'}>
                                                    <label style={{whiteSpace: 'nowrap'}}>
                                                        How much time can you spend for teaching in a day?
                                                    </label>
                                                    <select disabled={verifySts === 2} className="w-100"
                                                            name={'sMax_hours'} onChange={handleChangeDuration}
                                                            value={duration}>
                                                        <option>1 hour</option>
                                                        <option>2 hours</option>
                                                        <option>3 hours</option>
                                                        <option>4 hours</option>
                                                        <option>5 hours</option>
                                                        <option>6 hours</option>
                                                        <option>7 hours</option>
                                                        <option>8 hours</option>
                                                        <option>9 hours</option>
                                                        <option>10 hours</option>
                                                    </select>
                                                    <ErrorMessage name='sMax_hours' component='div'
                                                                  className='field-error text-danger'/>
                                                </div>
                                                <div className="col-lg-6 mt-4">
                                                    <label>
                                                        Most preferable time slot
                                                    </label>
                                                    <div className="form-group d-flex">
                                                        <div>
                                                            {timeSlot === 1 ? <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTimeSlot} value={'morning'}
                                                                       checked
                                                                       id="morning" type="radio" name="sTime_slot"/>
                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTimeSlot} value={'morning'}
                                                                       id="morning" type="radio" name="sTime_slot"/>
                                                            </>}
                                                            <label htmlFor="morning">
                                                                Morning
                                                            </label>
                                                        </div>
                                                        <div className={"ms-3"}>
                                                            {timeSlot === 2 ? <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTimeSlot} checked
                                                                       value={'afternoon'}
                                                                       id="Afternoon" type="radio" name="sTime_slot"/>
                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTimeSlot}
                                                                       value={'afternoon'}
                                                                       id="Afternoon" type="radio" name="sTime_slot"/>
                                                            </>}

                                                            <label htmlFor="Afternoon">
                                                                Afternoon
                                                            </label>
                                                        </div>
                                                        <div className={"ms-3"}>
                                                            {timeSlot === 3 ? <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTimeSlot} checked
                                                                       value={'evening'}
                                                                       id="Evening" type="radio" name="sTime_slot"/>
                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTimeSlot} value={'evening'}
                                                                       id="Evening" type="radio" name="sTime_slot"/>
                                                            </>}

                                                            <label htmlFor="cat-radio-2">
                                                                Evening
                                                            </label>
                                                        </div>
                                                        <div className={"ms-3"}>
                                                            {timeSlot === 4 ? <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTimeSlot} checked
                                                                       value={'lateEvening'} id="LateEvening"
                                                                       type="radio" name="sTime_slot"/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTimeSlot}
                                                                       value={'lateEvening'} id="LateEvening"
                                                                       type="radio" name="sTime_slot"/>

                                                            </>}

                                                            <label htmlFor="cat-radio-2">
                                                                Late Evening
                                                            </label>
                                                        </div>

                                                        <span className="focus-border"></span>
                                                    </div>
                                                    <ErrorMessage name='sTime_slot' component='div'
                                                                  className='field-error text-danger'/>
                                                </div>

                                                <div className="col-lg-6 mt-4">
                                                    <label>
                                                        Are you interested in weekend batches?
                                                    </label>
                                                    <div className="form-group d-flex">
                                                        <div>
                                                            {weekendBatch === 1 ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeWeekendBatch}
                                                                       value={'yes'} id="yes" type="radio"
                                                                       name="sWeekend_batches"/>
                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeWeekendBatch}
                                                                       value={'yes'} id="yes" type="radio"
                                                                       name="sWeekend_batches"/>
                                                            </>}

                                                            <label htmlFor="yes">
                                                                Yes
                                                            </label>
                                                        </div>
                                                        <div className={"ms-3"}>
                                                            {weekendBatch === 0 ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeWeekendBatch} value={'no'}
                                                                       id="no" type="radio" name="sWeekend_batches"/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeWeekendBatch} value={'no'}
                                                                       id="no" type="radio" name="sWeekend_batches"/>
                                                            </>}
                                                            <label htmlFor="no">
                                                                No
                                                            </label>
                                                        </div>
                                                        <ErrorMessage name='sWeekend_batches' component='div'
                                                                      className='field-error text-danger ms-3 mt-3'/>
                                                        <span className="focus-border"></span>
                                                    </div>
                                                </div>
                                                <div className={'col-lg-12 mt-4'}>
                                                    <label>
                                                        Most preferable days of teaching
                                                    </label>
                                                    <div className='demo-inline-spacing position-sticky d-flex mt-3'>
                                                        <div className='mb-0 mt-0'>
                                                            {(teachingDays).includes('Monday') ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays1' value='Monday'/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays1' value='Monday'/>

                                                            </>}
                                                            <label htmlFor={'sDays1'}>Monday</label>
                                                        </div>

                                                        <div className='mb-0 mt-0 ms-3'>
                                                            {(teachingDays).includes('Tuesday') ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays2' value='Tuesday'/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays2' value='Tuesday'/>

                                                            </>}
                                                            <label htmlFor={'sDays2'}>Tuesday</label>
                                                        </div>

                                                        <div className='mb-0 mt-0 ms-3'>
                                                            {(teachingDays).includes('Wednesday') ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays3' value='Wednesday'/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays3' value='Wednesday'/>

                                                            </>}
                                                            <label htmlFor={'sDays3'}>Wednesday</label>
                                                        </div>

                                                        <div className='mb-0 mt-0 ms-3'>
                                                            {(teachingDays).includes('Thursday') ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays4' value='Thursday'/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays4' value='Thursday'/>

                                                            </>}
                                                            <label htmlFor={'sDays4'}>Thursday</label>
                                                        </div>

                                                        <div className='mb-0 mt-0 ms-3'>
                                                            {(teachingDays).includes('Friday') ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays5' value='Friday'/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays5' value='Friday'/>

                                                            </>}
                                                            <label htmlFor={'sDays5'}>Friday</label>
                                                        </div>

                                                        <div className='mb-0 mt-0 ms-3'>
                                                            {(teachingDays).includes('Saturday') ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays6' value='Saturday'/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays6' value='Saturday'/>

                                                            </>}
                                                            <label htmlFor={'sDays6'}>Saturday</label>
                                                        </div>

                                                        <div className='mb-0 mt-0 ms-3'>
                                                            {(teachingDays).includes('Sunday') ? <>
                                                                <input disabled={verifySts === 2} checked
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays7' value='Sunday'/>

                                                            </> : <>
                                                                <input disabled={verifySts === 2}
                                                                       onChange={handleChangeTeachingDays}
                                                                       type='checkbox' name='sPreferable_days'
                                                                       id='sDays7' value='Sunday'/>

                                                            </>}
                                                            <label htmlFor={'sDays7'}>Sunday</label>
                                                        </div>

                                                    </div>
                                                    <ErrorMessage name='sPreferable_days' component='div'
                                                                  className='field-error text-danger'/>
                                                </div>
                                                <div className="col-lg-12 mt-5">
                                                    <div className="form-submit-group">
                                                        {isLoading ? <>
                                                            <button
                                                                disabled={true}
                                                                type="submit"
                                                                className="rbt-btn btn-md btn-gradient w-100"
                                                            >
                                                            <span className="btn-text"><i
                                                                className="fa fa-spinner fa-spin p-0"></i> Proceeding...</span>
                                                            </button>
                                                        </> : <>
                                                            <button type="submit"
                                                                    className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100">
                                                         <span className="icon-reverse-wrapper">
                                                           <span className="btn-text">Submit</span>
                                                           <span className="btn-icon">
                                                             <i className="feather-arrow-right"></i>
                                                           </span>
                                                           <span className="btn-icon">
                                                            <i className="feather-arrow-right"></i>
                                                           </span>
                                                        </span>
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
                    </>}
                    </div>
                </div>
                </>
                );
            };

            export default Availability;


