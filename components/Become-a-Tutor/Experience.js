import Link from "next/link";
import React, {useEffect, useState} from "react";
import {API_URL, API_KEY} from '../../constants/constant'
import Axios from "axios";
import { useRouter } from "next/router";
import { Formik, ErrorMessage, Form } from 'formik'
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import img from "@/public/images/others/thumbnail-placeholder.svg";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {Alert} from "reactstrap";

const Experience = () => {
  const router = useRouter()
  const [country, setCountry] = useState([]);
  const [regId, setregId] = useState('')
  const [fields, showFields] = useState(false)
  const REACT_APP = API_URL
  const defaultValue = new Date().getFullYear();
  const [Isfresher, setIsFresher] = useState('')
  const minOffset = 0;
  const maxOffset = 53;

  const ExperienceList = []
  const [expFields, setExpFields] = useState([
    {
      sIs_fresher:Isfresher,
      nTotal_exper:'',
      nTotal_online_exper:'',
      nCountryId:101,
      sOrganization:'',
      sPosition:'',
      sFrom_years:'',
      sTo_years:''
    }
  ]);
  const [TotalExp, setTotalExp] = useState('')

  ExperienceList.push(expFields);
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

  const handleChange = (e, index) => {
    // console.log(e.target.value)
    setIsFresher(e.target.value)
    if(e.target.value === 'experience') {
      showFields(true)
    } else {
      showFields(false)
    }
  }

  const handleChangeTotalExp = (e, index) => {
    // console.log(e.target.value)
    const { value } = e.target;
    if(expFields >= 1){
      const updatedFields = [...expFields];
      updatedFields[index].nTotal_exper = parseInt(value);
      setExpFields(updatedFields);
    } else {
      const updatedFields = expFields;
      // console.log(updatedFields)
      updatedFields[0].nTotal_exper = parseInt(value);
      setExpFields(updatedFields);
    }

  };

  const handleTotalExp = (e, index) => {
    console.log(e.target.value)
    const { value } = e.target;
    // if(expFields >= 1){
    //   const updatedFields = [...expFields];
    //   updatedFields[index].nTotal_exper = parseInt(value);
    //   setExpFields(updatedFields);
    // }
    // else {
      const updatedFields = expFields;

      updatedFields[0].nTotal_exper = parseInt(value);
      console.log('updatedFields', updatedFields)
      setExpFields(updatedFields);
    // }
  }

  const handleChangeOnlineExp = (e, index) => {
    console.log(e)
    const { value } = e.target;
    if(expFields.length >= 1){
      const updatedFields = [...expFields];
      updatedFields[index].nTotal_online_exper = parseInt(value);
      setExpFields(updatedFields);
    } else {
      const updatedFields = expFields;
      updatedFields[0].nTotal_online_exper = parseInt(value);
      setExpFields(updatedFields);
    }

  };
  const handleChangeCountry = (e, index) => {
    const { value } = e.target;
    if(expFields.length >= 1){
      const updatedFields = [...expFields];
      updatedFields[index].nCountryId = parseInt(value);
      setExpFields(updatedFields);
    } else {
      const updatedFields = expFields;
      updatedFields.nCountryId = parseInt(value);
      setExpFields(updatedFields);
    }

  };

  const handleChangeOrganization = (e, index) => {
    const { value } = e.target;
    if(expFields.length >= 1){
      const updatedFields = [...expFields];
      updatedFields[index].sOrganization = value;
      setExpFields(updatedFields);
    } else {
      const updatedFields = expFields;
      updatedFields.sOrganization = value;
      setExpFields(updatedFields);
    }

  };
  const handleChangePosition = (e, index) => {
    const { value } = e.target;
    if(expFields.length >= 1){
      const updatedFields = [...expFields];
      updatedFields[index].sPosition = value;
      setExpFields(updatedFields);
    } else {
      const updatedFields = expFields;
      updatedFields.sPosition = value;
      setExpFields(updatedFields);
    }

  };

  const options = [];

  for (let i = minOffset; i <= maxOffset; i++) {
    const year = defaultValue - i;
    options.push(
        <option key={year} value={year}>
          {year}
        </option>
    );
  }

  const [gettutorDetails, settutorDetails] = useState([])

  const handleYearFromChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...expFields];
    const yearOfBirth = new Date(gettutorDetails[0].dDOB).getFullYear(); // Extract the year from DOB


    updatedFields[index].sFrom_year = value;


    if (parseInt(value) < yearOfBirth) {
      alert(`Year of study "From" should not be greater than the year of birth (${yearOfBirth}).`);
      return; // Stop further execution
    }
    // Validation: Check if "To" year is less than "From" year
    if (
        updatedFields[index].sTo_year &&
        parseInt(updatedFields[index].sTo_year) < parseInt(value)

    ) {
      alert("Year of study to should not be less than Year of study from.");
      setExpFields('');
    }

    setExpFields(updatedFields)


  };
  const handleYearToChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...expFields];

    updatedFields[index].sTo_year = value;
    // Validation: Check if "To" year is less than "From" year
    if (
        updatedFields[index].sFrom_year &&
        parseInt(value) < parseInt(updatedFields[index].sFrom_year)
    ) {
      updatedFields[index].sTo_year = '';
      alert("Year of study to should not be less than Year of study from.");
    }

    setExpFields(updatedFields);
  };


  const handleAddExperience = () => {
    const newId = expFields.length + 1;
    const newExperience = {
      nTTEId: 0,
      sIs_fresher:Isfresher,
      nTotal_exper:'',
      nTotal_online_exper:'',
      nCountryId:'',
      sOrganization:'',
      sPosition:'',
      sFrom_years:'',
      sTo_years:''
    };
    setExpFields([...expFields, newExperience]);
  };

  const handleRemoveExperience = (id) => {
    const updatedFields = expFields.filter((field) => field.nTTEId !== id);
    setExpFields(updatedFields);

    const deletedFields = expFields.filter((field) => field.nTTEId === id);
    console.log('deletedFields', deletedFields)

    const deletedarray = deletedFields.map((item) => {
      return item.nTTEId
    })
    console.log('deletedArray', deletedarray)
    setdeletedArray(deletedarray)
    const originalArray = updateArray;

    const elementsToRemove = deletedarray;

// Use filter() to create a new array excluding elements to remove
    const filteredArray = originalArray.filter((element) => !elementsToRemove.includes(element));

    setUpdatearray(filteredArray)

    Axios.delete(`${API_URL}/api/TutorTeachExperience/DeleteTutorTeachExper/${EncryptData(deletedarray[0])}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log(res.data)
          window.location.reload()
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })

  };
  // const [hideFields, sethideFields] = useState(false)

  const [tutorcnt, setTutorcnt] = useState('')
  const [updateArray, setUpdatearray] = useState([])
  const [deletedArray, setdeletedArray] = useState([])
  const [verifySts, setverifySts] = useState()
  useEffect(() => {
    if(localStorage.getItem('userData')) {
      setregId(JSON.parse(localStorage.getItem('userData')).regid)


    Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log("GetTutorVerify",res.data)
          if (res.data.length !== 0) {
            setverifySts(res.data[0].sTeachExper_verify)
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })

    bindCountry()
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

    Axios.get(`${API_URL}/api/TutorTeachExperience/GetTutorTeachExper/${JSON.parse(localStorage.getItem('userData')).regid}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          console.log(res.data)
          if(res.data.length !== 0){
            setIsFresher(res.data[0]['sIs_fresher'])
            if(res.data[0]['sIs_fresher'] === 0){
              showFields(true)
            } else {
              showFields(false)
            }

            const array = res.data.map((item, index) => {
              return item.nTTEId
            })

            // console.log(array)
            setUpdatearray(array)
          }

          // ---------------------
          if(res.data.length !== 0) {
            setExpFields(res.data)
          } else {
            setExpFields(expFields)
          }
          // ---------------------

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
          <Formik
              initialValues={{
                nRegId : regId,
                sExperience : ExperienceList[0]
              }}
              enableReinitialize={true}
              onSubmit={async (values, {resetForm}) => {
                // console.log([values])
                if(verifySts === 2) {
                    router.push('/become-a-tutor/description')
                } else {

                  if(tutorcnt !== 0) {
                    if (fields === false) {
                      // alert('hello')
                      // fresher
                      const noExperience = {
                        nRegId : regId,
                        sIsExperience : "fresher"
                      }
                      // console.log(noExperience)
                      await Axios.post(`${API_URL}/api/TutorTeachExperience/InsertTutorBasicTeachExp`, noExperience, {
                        headers: {
                          ApiKey: `${API_KEY}`
                          // 'Content-Type' : 'application/json'
                        }
                      }).then(res => {
                        console.log(res.data)
                        const retData = JSON.parse(res.data)
                        // localStorage.removeItem('verify_uname')
                        // console.log(retData)
                        resetForm({})
                        if(retData.success === '1') {
                          router.push('/become-a-tutor/description')
                        }
                      })
                          .catch(err => {
                            {
                              ErrorDefaultAlert(JSON.stringify(err.response))
                            }
                          })
                    } else {
                      // alert('yes education')
                      const updateValues = [{
                        nRegId : regId,
                        updateId: updateArray,
                        deleteId: deletedArray,
                        sExperience : ExperienceList[0]
                      }]
                      // console.log(updateValues)
                      // console.log(hideFields)
                      await Axios.put(`${API_URL}/api/TutorTeachExperience/UpdateTutorTeachExper`, updateValues, {
                        headers: {
                          ApiKey: `${API_KEY}`
                        }
                      }).then(res => {
                        console.log(res.data)
                        const retData = JSON.parse(res.data)
                        // localStorage.removeItem('verify_uname')
                        // console.log(retData)
                        resetForm({})
                        if(retData.success === '1') {
                          Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                            headers: {
                              ApiKey: `${API_KEY}`
                            }
                          })
                              .then(res => {
                                // console.log(res.data)
                                if(res.data.length !== 0) {
                                  const array2 = res.data.map((item) => {
                                    return item.verify_list
                                  })
                                  // console.log(array2)
                                  let array = array2[0].split(',').map(Number);
                                  // console.log('---------------', array);
                                  let array1 = ['basics', 'profile-photo', 'cover-photo', 'cover-photo', 'cover-photo', 'education', 'certification', 'teaching-experience', 'description', 'intro-video', 'interest', 'time-availability'];

                                  let url = array1
                                  let verify_string = array;
                                  if(verify_string.length !== 0){
                                    // Check the 0th position in array2 and get the corresponding string from array1
                                    let positionToCheck = verify_string[0];
                                    // let conditionString = url[positionToCheck - 1];

                                    // Check the position of the first 3 numbers in array2
                                    let positionOfThree = verify_string.findIndex(num => num === 3);

                                    // Get the string at that position from array1
                                    let stringForUrl = url[positionOfThree];

                                    console.log('stringForUrl', stringForUrl)
                                    router.push(`/become-a-tutor/description`)
                                  } else {
                                    router.push('/become-a-tutor/description')
                                  }
                                }
                              })
                              .catch(err => {
                                { ErrorDefaultAlert(err) }
                              })

                        }
                      })
                          .catch(err => {
                            {
                              ErrorDefaultAlert(JSON.stringify(err.response))
                            }
                          })
                    }
                  } else {
                    // console.log(hideFields)
                    if (fields === true) {
                      //no education
                      const noExperience = {
                        nRegId : regId,
                        sIsExperience : "fresher"
                      }
                      // console.log(noExperience)
                      await Axios.post(`${API_URL}/api/TutorTeachExperience/InsertTutorBasicTeachExp`, noExperience, {
                        headers: {
                          ApiKey: `${API_KEY}`
                          // 'Content-Type' : 'application/json'
                        }
                      }).then(res => {
                        console.log(res.data)
                        const retData = JSON.parse(res.data)
                        // localStorage.removeItem('verify_uname')
                        // console.log(retData)
                        resetForm({})
                        if(retData.success === '1') {
                          router.push('/become-a-tutor/description')
                        }
                      })
                          .catch(err => {
                            {
                              ErrorDefaultAlert(JSON.stringify(err.response))
                            }
                          })
                    } else {
                      // alert('yes education')
                      await Axios.post(`${API_URL}/api/TutorTeachExperience/InsertTutorTeachExp`, [values], {
                        headers: {
                          ApiKey: `${API_KEY}`
                        }
                      }).then(res => {
                        console.log(res.data)
                        const retData = JSON.parse(res.data)
                        // localStorage.removeItem('verify_uname')
                        // console.log(retData)
                        resetForm({})
                        if(retData.success === '1') {
                          router.push('/become-a-tutor/description')
                        }
                      })
                          .catch(err => {
                            {
                              ErrorDefaultAlert(JSON.stringify(err.response))
                            }
                          })
                    }
                  }
                }

              }}
          >
            {({errors, touched}) => {
              return (
                  <>
                    <Form>
                      <div className="section-title">
                        <h4 className="rbt-title-style-3">Teaching Experience</h4>
                      </div>
                      {verifySts === 2 ? <>
                        <Alert color='success'>
                          <h6 className='alert-heading m-0 text-center'>
                            Teaching experience verification has been approved by admin
                          </h6>
                        </Alert>

                      </> : <>
                        {verifySts === 1 ? <>
                          <Alert color='warning'>
                            <h6 className='alert-heading m-0 text-center'>
                              Teaching experience verification is in pending state
                            </h6>
                          </Alert>

                        </> : <>
                          {verifySts === 0 || verifySts === null ? <></> : <>
                            <Alert color='danger'>
                              <h6 className='alert-heading m-0 text-center'>
                                Teaching experience verification has been disapproved by admin
                              </h6>
                            </Alert>
                          </>}
                        </>}
                      </>}
                      <div className={'row'}>
                        <div className={'col-lg-12'}>
                          <label style={{fontSize: '16px'}}>
                            Are you a fresher or an experienced teacher?
                          </label>
                          <div className={''}>
                            <div>
                              {Isfresher === 1 ? <>
                                <input id="fresher" disabled={verifySts === 2} value={'fresher'} checked
                                       onChange={handleChange} type="radio"
                                       name="Tech_exp"
                                       className="custom-radio"/>
                                <label htmlFor="fresher">
                                  Fresher
                                </label>
                              </> : <>
                                <input id="fresher" disabled={verifySts === 2} value={'fresher'}
                                       onChange={handleChange} type="radio"
                                       name="Tech_exp"
                                       className="custom-radio"/>
                                <label htmlFor="fresher">
                                  Fresher
                                </label>
                              </>}

                            </div>
                            <div className={"ms-3"}>
                              {Isfresher === 0 ? <>
                                <input id="experience" disabled={verifySts === 2} value={'experience'} checked
                                       onChange={handleChange} type="radio"
                                       name="Tech_exp"/>
                                <label htmlFor="experience">
                                  Experience
                                </label>
                              </> : <>
                                <input id="experience" disabled={verifySts === 2} value={'experience'}
                                       onChange={handleChange} type="radio"
                                       name="Tech_exp"/>
                                <label htmlFor="experience">
                                  Experience
                                </label>
                              </>}

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={'row'}>
                        {fields ? <>
                          {expFields.length >= 1 ? <>
                            {expFields.map((education, index) => {
                              console.log(education)
                              return (
                                  <>
                                    <div key={education.nTTEId}>
                                      <div className={'row'}>
                                        <div className={'col-lg-6 mt-4'}>
                                          <label style={{fontSize: '15px'}}>
                                            How many years of total experience in teaching?
                                          </label>
                                          {/*<div className="input-group mb-3">*/}
                                          {/*  <input*/}
                                          {/*      readOnly={verifySts === 2}*/}
                                          {/*      type="number"*/}
                                          {/*      className="form-control"*/}
                                          {/*      placeholder="Total experience"*/}
                                          {/*      value={education.nTotal_exper}*/}
                                          {/*      // value={TotalExp}*/}
                                          {/*      // onChange={(e) => handleChangeTotalExp(e, index)}*/}
                                          {/*      onChange={(e) => handleTotalExp(e, index)}*/}
                                          {/*  />*/}
                                          {/*  <div className="input-group-append">*/}
                                          {/*    <span style={{fontSize: '16px'}}*/}
                                          {/*          className="input-group-text h-100">years</span>*/}
                                          {/*  </div>*/}
                                          {/*</div>*/}
                                          <div className="form-group">
                                            <input
                                                readOnly={verifySts === 2}
                                                onChange={(e) => handleTotalExp(e, index)}
                                                value={education.nTotal_exper}
                                                type="number"
                                                name={"Total Experience"}
                                                placeholder="Total Experience"/>
                                            <span className="focus-border"></span>
                                          </div>
                                        </div>
                                        <div className={'col-lg-6 mt-4'}>
                                          <label style={{fontSize: '16px'}}>
                                            Out of total how many years of online teaching experience?
                                          </label>
                                          <div className="input-group">
                                            <input
                                                type="text"
                                                readOnly={verifySts === 2}
                                                value={education.nTotal_online_exper}
                                                className="form-control"
                                                placeholder="online experience"
                                                onChange={(e) => handleChangeOnlineExp(e, index)}/>
                                            <div className="input-group-append">
                                              <span style={{fontSize: '14px'}} className="input-group-text h-100">years</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-6 mt-3">
                                          <label style={{fontSize: '16px'}}>
                                            Country of experience
                                          </label>
                                          {/*<div className="rbt-modern-select bg-transparent height-45">*/}
                                          <select disabled={verifySts === 2} className="w-100" value={education.nCountryId}
                                                  onChange={(e) => handleChangeCountry(e, index)}>
                                            {country.map((item, index) => {
                                              return (
                                                  <>
                                                    <option key={index}
                                                            value={item.nCountryId}>{item.sCountryname}</option>
                                                  </>
                                              )
                                            })}
                                          </select>
                                        </div>
                                        <div className={'col-lg-6 mt-3'}>
                                          <label style={{fontSize: '16px'}}>
                                            Organization
                                          </label>
                                          <div className="form-group">
                                            <input
                                                readOnly={verifySts === 2}
                                                onChange={(e) => handleChangeOrganization(e, index)}
                                                value={education.sOrganization}
                                                name="organization"
                                                type="text"
                                                placeholder="Organization"
                                            />
                                            <span className="focus-border"></span>
                                          </div>
                                        </div>
                                        <div className={'col-lg-6 mt-3'}>
                                          <label style={{fontSize: '16px'}}>
                                            Position
                                          </label>
                                          <div className="form-group">
                                            <input
                                                readOnly={verifySts === 2}
                                                onChange={(e) => handleChangePosition(e, index)}
                                                value={education.sPosition}
                                                name="position"
                                                type="text"
                                                placeholder="Position"
                                            />
                                            <span className="focus-border"></span>
                                          </div>
                                        </div>
                                        <div className={'col-lg-6 mt-3'}>
                                          <label style={{fontSize: '16px'}}>
                                            Year of study from
                                          </label>
                                          <select disabled={verifySts === 2} value={education.sFrom_years}
                                                  onChange={(e) => handleYearFromChange(e, index)}>
                                            {options}
                                          </select>
                                        </div>
                                        <div className={'col-lg-6 mt-3'}>
                                          <label style={{fontSize: '16px'}}>
                                            Year of study to
                                          </label>
                                          <select disabled={verifySts === 2} value={education.sTo_years}
                                                  onChange={(e) => handleYearToChange(e, index)}>
                                            <option value="Present">Present</option>
                                            {options}
                                          </select>
                                        </div>
                                        {verifySts === 2 ? <></> : <>
                                          <div className="col-lg-12 text-end mt-2">

                                            <button type={'button'} className="btn btn-danger"
                                                    onClick={() => handleRemoveExperience(education.nTTEId)}>Remove
                                            </button>
                                          </div>
                                        </>}
                                      </div>
                                    </div>
                                  </>
                              )
                            })}
                            {console.log(verifySts)}
                            {verifySts !== 2 ? <>
                              <div className={'col-lg-12 mt-5 mb-5'}>
                                <button
                                    type={'button'}
                                    className="rbt-btn-link left-icon border-0 bg-white"
                                    onClick={handleAddExperience}
                                >
                                  <i className="feather-plus"></i>Add Experience
                                </button>
                              </div>
                            </> : <>

                            </>}
                          </> : <>

                            <div key={expFields.nTTEId}>
                              <div className={'row'}>
                                <div className={'col-lg-6 mt-4'}>
                                  <label style={{fontSize: '15px'}}>
                                    How many years of total experience in teaching?
                                  </label>
                                  <div className="input-group mb-3">
                                    <input
                                        readOnly={verifySts === 2}
                                        type="number"
                                        className="form-control"
                                        placeholder="Total experience"
                                        // value={expFields.nTotal_exper}
                                        value={expFields[0].nTotal_exper}
                                        onChange={(e) => handleTotalExp(e, index)}
                                    />
                                    <div className="input-group-append">
                                      <span style={{fontSize: '16px'}} className="input-group-text h-100">years</span>
                                    </div>
                                  </div>
                                </div>
                                <div className={'col-lg-6 mt-4'}>
                                  <label style={{fontSize: '16px'}}>
                                    Out of total how many years of online teaching experience?
                                  </label>
                                  <div className="input-group">
                                    <input
                                        type="text"
                                        readOnly={verifySts === 2}
                                        value={expFields.nTotal_online_exper}
                                        className="form-control"
                                        placeholder="online experience"
                                        onChange={(e) => handleChangeOnlineExp(e)}
                                    />
                                    <div className="input-group-append">
                                            <span style={{fontSize: '14px'}}
                                                  className="input-group-text h-100">years</span>
                                    </div>
                                  </div>
                                </div>

                                <div className={'col-lg-6 mt-3'}>
                                  <label style={{fontSize: '16px'}}>
                                    Organization
                                  </label>
                                  <div className="form-group">
                                    <input
                                        readOnly={verifySts === 2}
                                        onChange={(e) => handleChangeOrganization(e)}
                                        value={expFields.sOrganization}
                                        name="organization"
                                        type="text"
                                        placeholder="Organization"
                                    />
                                    <span className="focus-border"></span>
                                  </div>
                                </div>
                                <div className={'col-lg-6 mt-3'}>
                                  <label style={{fontSize: '16px'}}>
                                    Position
                                  </label>
                                  <div className="form-group">
                                    <input
                                        readOnly={verifySts === 2}
                                        onChange={(e) => handleChangePosition(e)}
                                        value={expFields.sPosition}
                                        name="position"
                                        type="text"
                                        placeholder="Position"
                                    />
                                    <span className="focus-border"></span>
                                  </div>
                                </div>
                                <div className={'col-lg-6 mt-3'}>
                                  <label style={{fontSize: '16px'}}>
                                    Year of study from
                                  </label>
                                  <select disabled={verifySts === 2} value={expFields.sFrom_years}
                                          onChange={(e) => handleYearFromChange(e)}>
                                    {options}
                                  </select>
                                </div>
                                <div className={'col-lg-6 mt-3'}>
                                  <label style={{fontSize: '16px'}}>
                                    Year of study to
                                  </label>
                                  <select disabled={verifySts === 2} value={expFields.sTo_years}
                                          onChange={(e) => handleYearToChange(e)}>
                                    <option value="Present">Present</option>
                                    {options}
                                  </select>
                                </div>
                                <div className="col-lg-6 mt-3">
                                  <label style={{fontSize: '16px'}}>
                                    Country of experience
                                  </label>
                                  {/*<div className="rbt-modern-select bg-transparent height-45">*/}
                                  <select disabled={verifySts === 2} className="w-100" value={expFields.nCountryId}
                                          onChange={(e) => handleChangeCountry(e)}>
                                    {country.map((item, index) => {
                                      return (
                                          <>
                                            <option key={index}
                                                    value={item.nCountryId}>{item.sCountryname}</option>
                                          </>
                                      )
                                    })}
                                  </select>
                                </div>
                                {verifySts !== 2 ? <></> : <>
                                  <div className="col-lg-12 text-end mt-2">
                                    {expFields.length > 1 ? <>
                                      <button type={'button'} className="btn btn-danger"
                                              onClick={() => handleRemoveExperience(expFields.nTTEId)}>Remove
                                      </button>
                                    </> : <></>}

                                  </div>
                                </>}
                              </div>
                            </div>
                          </>}

                        </> : ''}
                      </div>


                      <div className="col-lg-12 mt-5">
                        <div className="form-submit-group">
                          <button
                              type="submit"
                              className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                          >
                            {/*<Link href={"/become-a-tutor/description"} className={'text-white'}>*/}
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

export default Experience;
