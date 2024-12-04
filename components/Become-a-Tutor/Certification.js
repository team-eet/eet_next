import Courses from "../../data/dashboard/instructor/instructor.json";
import CourseWidgets from "./Dashboard-Section/widgets/CourseWidget";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import { API_URL, API_KEY } from "../../constants/constant";
import {Form, Formik} from "formik";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import img from "@/public/images/others/thumbnail-placeholder.svg";
import { useRouter } from "next/router";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {Alert} from "reactstrap";

const Certification = () => {
  const REACT_APP = API_URL
  const [country, setCountry] = useState([]);
  const [countryId, setcountryId] = useState('')
  const [hideFields, sethideFields] = useState(true)
  const [isLoading, setisLoading] = useState(false)
  const defaultValue = new Date().getFullYear();
  const [regId, setregId] = useState('')
  const [Certi_Image, setCerti_Image] = useState('')
  // const [selectedYear, SetselectedYear] = useState(new Date().getFullYear());
  // const [thisYear, setthisYear] = useState(defaultValue);
  const minOffset = 0;
  const maxOffset = 53;


  // const [file, setFile] = useState();

  const CertificationList = []
  const [certificationFields, setcertificationFields] = useState([
    {
      sCerti_title:'',
      sIssued_by:'',
      sCerti_imagePath:'',
      sFrom_year:'',
      sTo_year:'',
    }
  ]);

  CertificationList.push(certificationFields);


  const handleChangeTitle = (e, index) => {
    console.log(certificationFields.length)
    const { value } = e.target;
    if(certificationFields.length >= 1){
      const updatedFields = [...certificationFields];
      updatedFields[index].sCerti_title = value;
      setcertificationFields(updatedFields);
    } else {
      const updatedFields = certificationFields
      updatedFields[0].sCerti_title = value;
      setcertificationFields(updatedFields);
    }

  };

  const handleChangeIssuedBy = (e, index) => {
    const { value } = e.target;
    if(certificationFields.length >= 1){
      const updatedFields = [...certificationFields];
      updatedFields[index].sIssued_by = value;
      setcertificationFields(updatedFields);
    } else {
      const updatedFields = certificationFields;
      updatedFields[0].sIssued_by = value;
      setcertificationFields(updatedFields);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      // Make new FileReader
      const reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load something...
      reader.onload = () => {
        const baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };
  const handleChangeImage = (event, index) => {
    const file = event.target.files[0];
    const updatedFields = [...certificationFields];

    const fileext = ['image/jpeg', 'image/jpg', 'image/png'];

    if (event.target.files[0].size < 2000000) {
      if (fileext.includes(event.target.files[0].type)) {
        // console.log(event.target.files[0])
        getBase64(event.target.files[0])
            .then((result) => {
              if(certificationFields.length >= 1){
                const updatedFields = [...certificationFields];
                updatedFields[index].sCerti_imagePath = result;
                // updatedFields[index].sEdu_imagePath = result
                setcertificationFields(updatedFields);
              } else {
                const updatedFields = certificationFields;
                updatedFields[0].sCerti_imagePath = result;
                // updatedFields[index].sEdu_imagePath = result
                setcertificationFields(updatedFields);
              }

            })
            .catch((err) => {
              console.error('Error converting image to base64:', err);
            });

        setCerti_Image(URL.createObjectURL(event.target.files[0]));
      } else {
        alert('Please select only image file types (jpeg/jpg/png)');
      }
    } else {
      alert('Please upload a file less than 2MB');
    }
  };

  // const handleYearFromChange = (e, index) => {
  //   const { value } = e.target;
  //   if(certificationFields.length >= 1){
  //     const updatedFields = [...certificationFields];
  //     updatedFields[index].sFrom_year = value;
  //     setcertificationFields(updatedFields);
  //   } else {
  //     const updatedFields = certificationFields;
  //     updatedFields[0].sFrom_year = value;
  //     setcertificationFields(updatedFields);
  //   }
  //
  // };
  // const handleYearToChange = (e, index) => {
  //   const { value } = e.target;
  //  if(certificationFields.length >= 1){
  //    const updatedFields = [...certificationFields];
  //    updatedFields[index].sTo_year = value;
  //    setcertificationFields(updatedFields);
  //  } else {
  //    const updatedFields = certificationFields;
  //    updatedFields[0].sTo_year = value;
  //    setcertificationFields(updatedFields);
  //  }
  // };
  const [gettutorDetails, settutorDetails] = useState([])


  const handleYearFromChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...certificationFields];
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
      setcertificationFields('');
    }

    setcertificationFields(updatedFields)


  };
  const handleYearToChange = (e, index) => {
    const { value } = e.target;
    const updatedFields = [...certificationFields];

    updatedFields[index].sTo_year = value;
    // Validation: Check if "To" year is less than "From" year
    if (
        updatedFields[index].sFrom_year &&
        parseInt(value) < parseInt(updatedFields[index].sFrom_year)
    ) {
      updatedFields[index].sTo_year = '';
      alert("Year of study to should not be less than Year of study from.");
    }

    setcertificationFields(updatedFields);
  };

  const [educationFields, setEducationFields] = useState([{ id: 1 }]);
  const [cancelButton, setCancelButton] = useState(false);

  const handleAddCertification = () => {
    const newId = certificationFields.length + 1;
    const newCertification = {
      nTCId: 0,
      sCerti_title:'',
      sIssued_by:'',
      sCerti_imagePath:'',
      sFrom_year:'',
      sTo_year:''
    };
    setcertificationFields([...certificationFields, newCertification]);
  };

  const handleRemoveCertification = (id) => {
    const updatedFields = certificationFields.filter((field) => field.nTCId !== id);
    setcertificationFields(updatedFields);

    const deletedFields = certificationFields.filter((field) => field.nTCId === id);
    console.log('deletedFields', deletedFields)

    const deletedarray = deletedFields.map((item) => {
      return item.nTCId
    })
    console.log('deletedArray', deletedarray)
    setdeletedArray(deletedarray)

    const originalArray = updateArray;

    const elementsToRemove = deletedarray;

// Use filter() to create a new array excluding elements to remove
    const filteredArray = originalArray.filter((element) => !elementsToRemove.includes(element));

    setUpdatearray(filteredArray)

    Axios.delete(`${API_URL}/api/TutorCertification/DeleteTutorCerti/${EncryptData(deletedarray[0])}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log(res.data)
          // window.location.reload()
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
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
  const [isCertified, setisCertified] = useState('')
  const handleIsCertification= (e) => {
    // console.log(e.target.checked)
    setisCertified(e.target.checked)
    // console.log(e.target.checked)
    if(e.target.checked){
      sethideFields(false)
    } else {
      sethideFields(true)
    }
  }

  const router = useRouter()
  const [tutorcnt, setTutorcnt] = useState('')
  const [updateArray, setUpdatearray] = useState([])
  const [deletedArray, setdeletedArray] = useState([])
  const [verifySts, setverifySts] = useState()
  const [nocertificate, setnocertificate] = useState(false)

  const [tutcerticnt, settutcerticnt] = useState('')

  useEffect(() => {
    let array2 = [2, 2, 1, 3, 2, 2, 3, 2, 2, 2, 3, 2];

    let positionsOfThree = [];
    let currentIndex = -1;

    while ((currentIndex = array2.indexOf(3, currentIndex + 1)) !== -1) {
      positionsOfThree.push(currentIndex);
    }

    // console.log(positionsOfThree);
    let array1 = ['basics', 'profile-photo', 'cover-photo', 'cover-photo', 'cover-photo', 'education', 'certification', 'teaching-experience', 'description', 'intro-video', 'interest', 'time-availability'];
    const array3 = positionsOfThree;

    let valuesFromArray1 = array3.map(index => array1[index - 1]);

    // console.log(valuesFromArray1);
    let startIndex = ''
    for (let i = 0; i < array3.length; i++) {
      startIndex = array3[i];
      console.log(startIndex);
      // let startIndex = 6; // Start checking from the index after the first occurrence of 3
      let nextIndex = -1;

      for (let i = startIndex + 1; i < array2.length; i++) {
        if (array2[i] === 3) {
          nextIndex = i;
          break;
        }
      }

      if (nextIndex !== -1) {
        console.log("The index of the next occurrence of 3 after index", startIndex, "is:", nextIndex);
      } else {
        console.log("No occurrence of 3 found after index", startIndex);
      }


    }

    // console.log(a)

    if(localStorage.getItem('userData')) {
      setregId(JSON.parse(localStorage.getItem('userData')).regid)


    Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log("GetTutorEducationVerify",res.data)
          if (res.data.length !== 0) {
            setverifySts(res.data[0].sCertification_verify)
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

    Axios.get(`${API_URL}/api/TutorCertification/GetTutorCertiData/${JSON.parse(localStorage.getItem('userData')).regid}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          console.log('GetTutorCertiData', res.data)
          if(res.data.length !== 0) {
            settutcerticnt(res.data[0].certification_data)
          }

          if(verifySts === 2 ) {
            setnocertificate(true)
          }
          const array = res.data.map((item, index) => {
            return item.nTCId
          })

          // console.log(array)
          setUpdatearray(array)

          // ---------------------
          if(res.data.length !== 0) {
            const certivalue = res.data.map((item, index) => {
              return item.sCertification_comment
            })
            // console.log(certivalue)
            if(certivalue[0] === 'No Certification') {
              sethideFields(false)
            }
            setisCertified(certivalue[0])
            setcertificationFields(res.data)
          } else {

            setcertificationFields(certificationFields)
          }
          // ---------------------

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
              settutorDetails(res.data)
              // if(res.data[0].bIsReview !== 0) {
              //   router.push('/become-a-tutor/Review')
              // } else {
              //
              // }
            }
            console.log('GetTutorDetails' ,res.data)

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
                  sCertification : CertificationList[0]
                }}
                enableReinitialize={true}
                onSubmit={async (values, {resetForm}) => {
                  // console.log([values])
                  // console.log([values])
                  if(verifySts === 2) {
                    router.push('/become-a-tutor/teaching-experience')
                  } else {
                    if (tutorcnt !== 0) {
                        if (hideFields === false) {
                        //no education
                        setisLoading(true)
                        const noEducation = {
                          nRegId : regId,
                          sIsCertification : "true"
                        }
                        // console.log(noEducation)
                        await Axios.post(`${API_URL}/api/TutorCertification/InsertTutorBasicCertificate`, noEducation, {
                          headers: {
                            ApiKey: `${API_KEY}`
                            // 'Content-Type' : 'application/json'
                          }
                        }).then(res => {
                          // console.log(res.data)
                          const retData = JSON.parse(res.data)
                          resetForm({})
                          if(retData.success === '1') {
                            router.push('/become-a-tutor/teaching-experience')
                          }
                        })
                            .catch(err => {
                              {
                                ErrorDefaultAlert(JSON.stringify(err.response))
                              }
                            })
                      }
                        else {
                        // alert('yes education')
                        if (tutcerticnt === "0") {

                          setisLoading(true)
                          // alert('yes education')
                          await Axios.post(`${API_URL}/api/TutorCertification/InsertTutorCertificate  `, [values], {
                            headers: {
                              ApiKey: `${API_KEY}`
                            }
                          }).then(res => {
                            // console.log(res.data)
                            const retData = JSON.parse(res.data)
                            // localStorage.removeItem('verify_uname')
                            // console.log(retData)
                            resetForm({})
                            if (retData.success === '1') {
                              router.push('/become-a-tutor/teaching-experience')
                            }
                          })
                              .catch(err => {
                                // console.log(err)
                                {
                                  ErrorDefaultAlert(JSON.stringify(err.response))
                                }
                              })
                        }
                          else {
                          const updateValues = [{
                            nRegId : regId,
                            updateId: updateArray,
                            deleteId: deletedArray,
                            sCertification : CertificationList[0]
                          }]
                          setisLoading(true)
                          // console.log(updateValues)
                          await Axios.put(`${API_URL}/api/TutorCertification/UpdateTutorCertification  `, updateValues, {
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
                                      console.log('---------------', array);
                                      let array1 = ['basics', 'profile-photo', 'cover-photo', 'cover-photo', 'cover-photo', 'education', 'certification',
                                        'teaching-experience', 'description', 'intro-video', 'interest', 'time-availability'];

                                      let url = array1
                                      let verify_string = array;
                                      if(verify_string.length !== 0){
                                        // Check the 0th position in array2 and get the corresponding string from array1
                                        let positionToCheck = verify_string[0];
                                        let conditionString = url[positionToCheck + 1];
                                        console.log(conditionString)


                                        // Check the position of the first 3 numbers in array2
                                        let positionOfThree = verify_string.findIndex(num => num === 3);

                                        let stringForUrl = url[positionOfThree];
                                        let result = array1.indexOf(stringForUrl)


                                        console.log('stringForUrl', stringForUrl, result)
                                        router.push(`/become-a-tutor/teaching-experience`)
                                      } else {
                                        router.push('/become-a-tutor/teaching-experience')
                                      }

                                    }
                                  })
                                  .catch(err => {
                                    { ErrorDefaultAlert(err) }
                                  })

                            }
                          })
                              .catch(err => {
                                // console.log(err)
                                {
                                  ErrorDefaultAlert(JSON.stringify(err.response))
                                }
                              })
                        }
                        }
                    }
                    else {
                      alert('No tutor added')
                    }
                  }
                }}
            >
              {({errors, touched}) => {
                return (
                    <>
                      <Form>
                        {/*{console.log(educationFields.length)}*/}
                        <div className="section-title mb-3">
                          <h4 className="rbt-title-style-3">Certification</h4>
                          {verifySts === 2 ? <>
                            <Alert color='success'>
                              <h6 className='alert-heading m-0 text-center'>
                               Certification verification has been approved by admin
                              </h6>
                            </Alert>

                          </> : <>
                            {verifySts === 1 ? <>
                              <Alert color='warning'>
                                <h6 className='alert-heading m-0 text-center'>
                                  Certification verification is pending state
                                </h6>
                              </Alert>

                            </> : <>
                              {verifySts === 0 || verifySts === null ? <>

                              </> : <>
                                <Alert color='danger'>
                                  <h6 className='alert-heading m-0 text-center'>
                                    Certification verification has been disapproved by admin
                                  </h6>
                                </Alert>
                              </>}
                            </>}
                          </>}
                          <p>Let us know about teaching certification</p>
                          {isCertified === 'No Certification' ? <>
                            {verifySts === 2 ? <>
                              <input id="Certifcation" type="checkbox" checked value={isCertified} name="isCertification"
                                     onChange={handleIsCertification}/>
                              <label htmlFor="Certifcation">
                                I have not pursued any professional teaching certification
                              </label>
                            </> : <>
                              <input id="Certifcation" type="checkbox" checked value={isCertified} name="isCertification"
                                     onChange={handleIsCertification}/>
                              <label htmlFor="Certifcation">
                                I have not pursued any professional teaching certification
                              </label>
                            </>}
                          </> : <>
                            {verifySts === 2 ? <>
                              <input id="Certifcation" type="checkbox" checked value={isCertified} name="isCertification"
                                     onChange={handleIsCertification}/>
                              <label htmlFor="Certifcation">
                                I have not pursued any professional teaching certification
                              </label>
                            </> : <>
                              <input id="Certifcation" type="checkbox" value={isCertified} name="isCertification"
                                     onChange={handleIsCertification}/>
                              <label htmlFor="Certifcation">
                                I have not pursued any professional teaching certification
                              </label>
                            </>}
                          </>}


                        </div>
                        <div className={'row'}>
                          {/*{console.log(certificationFields)}*/}
                          {/*<form action="#" className="row row--15 mt-5">*/}
                          {hideFields ? <>
                            {verifySts !== 2 ? <>
                              {certificationFields.length >= 1 ? <>

                                {certificationFields && certificationFields.map((certification, index) => {
                                  // console.log(certification)
                                  return (
                                      <>
                                        <div key={certification.nTCId}>
                                          <div className={'row'}>
                                            <div className="col-lg-6">
                                              <label>
                                                Certification Title
                                              </label>
                                              <div className="form-group">
                                                <input
                                                    readOnly={verifySts === 2}
                                                    onChange={(e) => handleChangeTitle(e, index)}
                                                    value={certification.sCerti_title}
                                                    type="text"
                                                    placeholder="Certification Title"/>
                                                <span className="focus-border"></span>
                                              </div>
                                            </div>
                                            <div className="col-lg-6">
                                              <label>
                                                Issued By
                                              </label>
                                              <div className="form-group">
                                                <input
                                                    readOnly={verifySts === 2}
                                                    onChange={(e) => handleChangeIssuedBy(e, index)}
                                                    value={certification.sIssued_by}
                                                    type="text"
                                                    placeholder="Issued By"/>
                                                <span className="focus-border"></span>
                                              </div>
                                            </div>
                                            <div className={'col-lg-6 mt-3'}>
                                              <label>
                                                Year of study from
                                              </label>
                                              <select disabled={verifySts === 2} value={certification.sFrom_year}
                                                      onChange={(e) => handleYearFromChange(e, index)}>
                                                {options}
                                              </select>

                                            </div>
                                            <div className={'col-lg-6 mt-3'}>
                                              <label>
                                                Year of study to
                                              </label>
                                              <select disabled={verifySts === 2} value={certification.sTo_year}
                                                      onChange={(e) => handleYearToChange(e, index)}>
                                                <option value="Present">Present</option>
                                                {options}
                                              </select>
                                            </div>
                                            <div className={'col-lg-12 mt-5 mb-3'}>
                                              <div className={'rounded-2 p-3'} style={{background: "#f4f4f8"}}>
                                                <h5>Get a certification verified badge</h5>
                                                <small>Upload your diploma to boost your credibility! Our team will review
                                                  it and add
                                                  the badge to your profile.
                                                  Once reviewed, your files will be deleted.
                                                  JPG or PNG format; maximum size of 2MB</small>

                                                <div>
                                                  <label id='label'
                                                         className='rbt-btn btn-md btn-gradient hover-icon-reverse'>Upload
                                                    image
                                                    <input type="file" id="file" name="file"
                                                           onChange={(e) => handleChangeImage(e, index)}
                                                           accept="image/*"/>
                                                  </label>
                                                  <div>
                                                    {certification.sCerti_imagePath && (
                                                        <img className={'mt-3'} src={certification.sCerti_imagePath} alt="Uploaded"
                                                             style={{width: 100}}/>
                                                    )}
                                                  </div>

                                                </div>
                                              </div>
                                            </div>
                                            {verifySts === 2 ? <></> : <>
                                              <div className="col-lg-12 text-end mt-2">
                                                {certificationFields.length > 1 ? <>
                                                  <button type={'button'} className="btn btn-danger"
                                                          onClick={() => handleRemoveCertification(certification.nTCId)}>Remove
                                                  </button>
                                                </> : <>

                                                </>}

                                              </div>
                                            </>}

                                          </div>
                                        </div>

                                      </>
                                  )
                                })
                                }

                                {verifySts === 2 ? <></> : <>
                                  <div className={'col-lg-5 mt-5 mb-5'}>
                                    <button
                                        type={'button'}
                                        className="rbt-btn-link left-icon border-0 bg-white"
                                        onClick={handleAddCertification}
                                    >
                                      <i className="feather-plus"></i>Add Certification
                                    </button>
                                  </div>
                                </>}
                              </> : ''}
                            </> : <></>}

                            </> : <>
                              {/*<div key={certificationFields.nTCId}>*/}
                              {/*  <div className={'row'}>*/}
                              {/*    <div className="col-lg-6">*/}
                              {/*      <label>*/}
                              {/*        Certification Title*/}
                              {/*      </label>*/}
                              {/*      <div className="form-group">*/}
                              {/*        <input*/}
                              {/*            readOnly={verifySts === 2}*/}
                              {/*            onChange={(e) => handleChangeTitle(e)}*/}
                              {/*            value={certificationFields.sCerti_title}*/}
                              {/*            type="text"*/}
                              {/*            placeholder="Certification Title"/>*/}
                              {/*        <span className="focus-border"></span>*/}
                              {/*      </div>*/}
                              {/*    </div>*/}
                              {/*    <div className="col-lg-6">*/}
                              {/*      <label>*/}
                              {/*        Issued By*/}
                              {/*      </label>*/}
                              {/*      <div className="form-group">*/}
                              {/*        <input*/}
                              {/*            readOnly={verifySts === 2}*/}
                              {/*            onChange={(e) => handleChangeIssuedBy(e)}*/}
                              {/*            value={certificationFields.sIssued_by}*/}
                              {/*            type="text"*/}
                              {/*            placeholder="Issued By"/>*/}
                              {/*        <span className="focus-border"></span>*/}
                              {/*      </div>*/}
                              {/*    </div>*/}
                              {/*    <div className={'col-lg-6 mt-3'}>*/}
                              {/*      <label>*/}
                              {/*        Year of study from*/}
                              {/*      </label>*/}
                              {/*      <select disabled={verifySts === 2} value={certificationFields.sFrom_year}*/}
                              {/*              onChange={(e) => handleYearFromChange(e)}>*/}
                              {/*        {options}*/}
                              {/*      </select>*/}

                              {/*    </div>*/}
                              {/*    <div className={'col-lg-6 mt-3'}>*/}
                              {/*      <label>*/}
                              {/*        Year of study to*/}
                              {/*      </label>*/}
                              {/*      <select disabled={verifySts === 2} value={certificationFields.sTo_year}*/}
                              {/*              onChange={(e) => handleYearToChange(e)}>*/}
                              {/*        <option value="Present">Present</option>*/}
                              {/*        {options}*/}
                              {/*      </select>*/}
                              {/*    </div>*/}
                              {/*    <div className={'col-lg-12 mt-5 mb-3'}>*/}
                              {/*      <div className={'rounded-2 p-3'} style={{background: "#f4f4f8"}}>*/}
                              {/*        <h5>Get a certification verified badge</h5>*/}
                              {/*        <small>Upload your diploma to boost your credibility! Our team will review*/}
                              {/*          it and add*/}
                              {/*          the badge to your profile.*/}
                              {/*          Once reviewed, your files will be deleted.*/}
                              {/*          JPG or PNG format; maximum size of 7MB</small>*/}


                              {/*        <div>*/}
                              {/*          <label id='label'*/}
                              {/*                 className='rbt-btn btn-md btn-gradient hover-icon-reverse'>Upload*/}
                              {/*            image*/}
                              {/*            <input type="file" id="file" name="file"*/}
                              {/*                   onChange={(e) => handleChangeImage(e, index)}*/}
                              {/*                   accept="image/*"/>*/}
                              {/*          </label>*/}
                              {/*          <div>*/}
                              {/*            {certificationFields.sCerti_imagePath && (*/}
                              {/*                <img src={certificationFields.sCerti_imagePath} alt="Uploaded"*/}
                              {/*                     style={{width: 100}}/>*/}
                              {/*            )}*/}
                              {/*          </div>*/}

                              {/*        </div>*/}


                              {/*      </div>*/}
                              {/*    </div>*/}
                              {/*    {verifySts === 2 ? <></> : <>*/}
                              {/*      <div className="col-lg-12 text-end mt-2">*/}
                              {/*        <button type={'button'} className="btn btn-danger"*/}
                              {/*                onClick={() => handleRemoveCertification(certificationFields.nTCId)}>Remove*/}
                              {/*        </button>*/}
                              {/*      </div>*/}
                              {/*    </>}*/}

                              {/*  </div>*/}
                              {/*  {verifySts === 2 ? <></> : <>*/}
                              {/*    <div className={'col-lg-5 mt-5 mb-5'}>*/}
                              {/*      <button*/}
                              {/*          type={'button'}*/}
                              {/*          className="rbt-btn-link left-icon border-0 bg-white"*/}
                              {/*          onClick={handleAddCertification}*/}
                              {/*      >*/}
                              {/*        <i className="feather-plus"></i>Add Certification*/}
                              {/*      </button>*/}
                              {/*    </div>*/}
                              {/*  </>}*/}

                              {/*</div>*/}


                            </>}


                          <div className="col-lg-12 mt-5">
                            <div className="form-submit-group">
                              {isLoading ? <>
                                <button
                                    disabled={true}
                                    type="submit"
                                    className="rbt-btn btn-md btn-gradient w-100"
                                >
                                                            <span className="btn-text"><i
                                                                className="feather-loader"></i>isLoading...</span>
                                </button>
                              </> : <>
                                <button
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

export default Certification;
