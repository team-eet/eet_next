import Link from "next/link";
import Courses from "../../data/dashboard/instructor/instructor.json";
import CourseWidgets from "./Dashboard-Section/widgets/CourseWidget";
import React, {useState, useEffect} from "react";
import Axios from "axios";
import {API_URL, API_KEY} from "../../constants/constant";
import * as Yup from 'yup'
import { Formik, ErrorMessage, Form } from 'formik'
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { useRouter } from "next/router";
import {Alert, Button, CardText} from "reactstrap";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import img from "@/public/images/others/thumbnail-placeholder.svg";

const Education = () => {
    const router = useRouter()
    const [country, setCountry] = useState([]);
    const [sEdu_Image, setsEdu_Image] = useState('')
    const [regId, setregId] = useState('')
    const [hideFields, sethideFields] = useState(true)
    const [getedu_data, setedu_data] = useState([])
    const [tutorcnt, setTutorcnt] = useState('')
    const minOffset = 0;
    const maxOffset = 53;
    const [drid, setdrid] = useState('')
    const [isLoading, setisLoading] = useState(false)

    const EducationList = []
    const [educationFields, setEducationFields] = useState([
        {
            nCountryId: 0,
            sUniversity:'',
            sDegree:'',
            sSpecialization:'',
            sEdu_imagePath:'',
            sEdu_Image: '',
            sFrom_year:'',
            sTo_year:''
        }
    ]);

    EducationList.push(educationFields);

    const handleChangeCountry = (e, index) => {
        console.log(e.target.value)
        const { value } = e.target;
        if(educationFields.length >= 1){
            const updatedFields = [...educationFields];
            updatedFields[index].nCountryId = parseInt(value);
            setEducationFields(updatedFields);
        } else {
            const updatedFields = educationFields

            updatedFields.nCountryId = parseInt(e.target.value);
            console.log(updatedFields, parseInt(e.target.value))
            setEducationFields(updatedFields);
        }
        // if(educationFields.length >= 1){
        //     const updatedFields = [...educationFields];
        //     updatedFields[index].nCountryId = parseInt(value);
        //     setEducationFields(updatedFields);
        // } else {
        //     const updatedFields = educationFields;
        //     updatedFields.nCountryId = parseInt(e.target.value);
        //     // console.log(updatedFields)
        //     setEducationFields(updatedFields);
        // }

    };

    const handleChangeUniversity = (e, index) => {
        const { value } = e.target;
       // if(educationFields.length >= 1){
       //     const updatedFields = [...educationFields];
       //     updatedFields[index].sUniversity = value;
       //     setEducationFields(updatedFields);
       // } else {
       //     const updatedFields = educationFields;
       //     updatedFields.sUniversity = e.target.value;
       //     console.log(updatedFields)
       //     setEducationFields(updatedFields);
       // }
        if(educationFields.length >= 1){
            const updatedFields = [...educationFields];
            updatedFields[index].sUniversity = value;
            setEducationFields(updatedFields);
        } else {
            const updatedFields = educationFields;
            updatedFields.sUniversity = value;
            setEducationFields(updatedFields);
        }
    };

    const handleChangeDegree = (e, index) => {
        const { value } = e.target;
        if(educationFields.length >= 1) {
            const updatedFields = [...educationFields];
            updatedFields[index].sDegree = value;
            setEducationFields(updatedFields);
        } else {
            const updatedFields = educationFields
            updatedFields.sDegree = value;
            setEducationFields(updatedFields);
        }

    };

    const handleChangeSpecialization = (e, index) => {
        const { value } = e.target;
        if(educationFields.length >= 1) {
            const updatedFields = [...educationFields];
            updatedFields[index].sSpecialization = value;
            setEducationFields(updatedFields);
        } else {
            const updatedFields = educationFields;
            updatedFields.sSpecialization = value;
            setEducationFields(updatedFields);
        }

    };

    const [isEducation, setisEducation] = useState('')
    const handleIsEducation= (e) => {
        // console.log(e.target.checked)
        setisEducation(e.target.checked)
        // console.log(e.target.checked)
        if(e.target.checked){
            sethideFields(false)
        } else {
            sethideFields(true)
        }
    }
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
        const updatedFields = [...educationFields];

        const fileext = ['image/jpeg', 'image/jpg', 'image/png'];

        if (event.target.files[0].size < 5000000) {
            if (fileext.includes(event.target.files[0].type)) {
                // console.log(event.target.files[0])
                getBase64(event.target.files[0])
                    .then((result) => {
                        if(educationFields.length > 1){
                            const updatedFields = [...educationFields];
                            updatedFields[index].sEdu_imagePath = result;
                            // updatedFields[index].sEdu_imagePath = result
                            setEducationFields(updatedFields);
                        } else {
                            const updatedFields = educationFields;
                            updatedFields[0].sEdu_imagePath = result;
                            // updatedFields[index].sEdu_imagePath = result
                            setEducationFields(updatedFields);
                        }

                    })
                    .catch((err) => {
                        console.error('Error converting image to base64:', err);
                    });

                if(educationFields.length >= 1){
                    const updatedFields = [...educationFields];
                    updatedFields[index].sEdu_Image = URL.createObjectURL(event.target.files[0]);
                    setEducationFields(updatedFields);
                } else {
                    const updatedFields = educationFields;
                    updatedFields[0].sEdu_Image = URL.createObjectURL(event.target.files[0]);
                    setEducationFields(updatedFields);
                }

                // setsEdu_Image(URL.createObjectURL(event.target.files[0]));
            } else {
                alert('Please select only image file types (jpeg/jpg/png)');
            }
        } else {
            alert('Please upload a file less than 5MB');
        }
    };

    const handleYearFromChange = (e, index) => {
        const { value } = e.target;
        if(educationFields.length >= 1) {
            const updatedFields = [...educationFields];
            updatedFields[index].sFrom_year = value;
            setEducationFields(updatedFields);
        } else {
            const updatedFields = educationFields;
            updatedFields.sFrom_year = value;
            setEducationFields(updatedFields);
        }

    };

    const handleYearToChange = (e, index) => {
        const { value } = e.target;
       if(educationFields.length >= 1){
           const updatedFields = [...educationFields];
           updatedFields[index].sTo_year = value;
           setEducationFields(updatedFields);
       } else {
           const updatedFields = educationFields;
           updatedFields.sTo_year = value;
           setEducationFields(updatedFields);
       }
    };

    const handleAddEducation = () => {
        const newId = educationFields.length + 1;
        const newEducation = {
            nTEId: 0,
            nCountryId:'',
            sUniversity:'',
            sDegree:'',
            sSpecialization:'',
            sEdu_imagePath:'',
            sEdu_Image:'',
            sFrom_year:'',
            sTo_year:''
        };
        setEducationFields([...educationFields, newEducation]);
    };


    const handleRemoveEducation = (id) => {
        const updatedFields = educationFields.filter((field) => field.nTEId !== id);
        // console.log(updatedFields)
        setEducationFields(updatedFields);

        const deletedFields = educationFields.filter((field) => field.nTEId === id);
        // console.log('deletedFields', deletedFields)

        const deletedarray = deletedFields.map((item) => {
            return item.nTEId
        })
        // console.log('deletedArray', deletedarray)
        setdeletedArray(deletedarray)

        const originalArray = updateArray;

        const elementsToRemove = deletedarray;

// Use filter() to create a new array excluding elements to remove
        const filteredArray = originalArray.filter((element) => !elementsToRemove.includes(element));
        // console.log(originalArray)
        // console.log(filteredArray)
        setUpdatearray(filteredArray)
        Axios.delete(`${API_URL}/api/TutorEducation/DeleteTutorEduc/${EncryptData(deletedarray[0])}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
               // console.log(res.data)
               //  window.location.reload()
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    };

    const REACT_APP = API_URL
    const bindCountry = () => {
        Axios.get(`${API_URL}/api/registration/BindCountry`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data.length !== 0) {
                    setCountry(res.data)
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }

    const options = [];
    const defaultValue = new Date().getFullYear();
    for (let i = minOffset; i <= maxOffset; i++) {
        const year = defaultValue - i;
        options.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    }

    const [updateArray, setUpdatearray] = useState([])
    const [deletedArray, setdeletedArray] = useState([])
    const [verifySts, setverifySts] = useState()

    useEffect(() => {
        if(localStorage.getItem('userData')) {
            const rid = DecryptData(JSON.parse(localStorage.getItem('userData')).regid)
            setdrid(rid)
            Axios.get(`${API_URL}/api/TutorEducation/GetTutorEducationVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    // console.log("GetTutorEducationVerify",res.data)
                    if (res.data.length !== 0) {
                        setverifySts(res.data[0].sEducation_verify)
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
            setregId(JSON.parse(localStorage.getItem('userData')).regid)


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

        Axios.get(`${API_URL}/api/TutorEducation/GetTutorEducation/${JSON.parse(localStorage.getItem('userData')).regid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                const array = res.data.map((item, index) => {
                    return item.nTEId
                })

                // console.log(array)
                setUpdatearray(array)

                // ---------------------
                    if(res.data.length !== 0) {
                        setEducationFields(res.data)
                    } else {
                        setEducationFields(...educationFields)
                    }
                // ---------------------

            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })

        }
        // const updatedFields = [...educationFields];
        // console.log(updatedFields)
        bindCountry()

    }, []);

    return (
        <>
            <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                <div className="content">
                    <Formik
                        initialValues={{
                            nRegId : regId,
                            sEducation : EducationList[0]
                        }}
                        enableReinitialize={true}
                        onSubmit={async (values, {resetForm}) => {
                            // console.log([values])

                            if(verifySts === 2) {

                                router.push('/become-a-tutor/certification')

                            } else {
                                if(tutorcnt !== 0) {
                                    //if tutorcnt is not equal to 0 the call update tutor education api

                                    if (hideFields === false) {
                                        //no education
                                        const noEducation = {
                                            nRegid : regId,
                                            sIsEducation : "true"
                                        }
                                        setisLoading(true)
                                        // console.log(noEducation)
                                        await Axios.post(`${REACT_APP.API_URL}/api/TutorEducation/InsertTutorBasicEducation`, noEducation, {
                                            headers: {
                                                ApiKey: `${REACT_APP.API_KEY}`
                                                // 'Content-Type' : 'application/json'
                                            }
                                        }).then(res => {
                                            // console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            resetForm({})
                                            if(retData.success === '1') {

                                                router.push('/become-a-tutor/certification')
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
                                            sEducation : EducationList[0]
                                        }]

                                        setisLoading(true)
                                        // console.log(updateValues)
                                        await Axios.put(`${REACT_APP.API_URL}/api/TutorEducation/UpdateTutorEducation`, updateValues, {
                                            headers: {
                                                ApiKey: `${REACT_APP.API_KEY}`
                                            }
                                        }).then(res => {
                                            // console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            // localStorage.removeItem('verify_uname')
                                            // console.log(retData)
                                            resetForm({})
                                            if(retData.success === '1') {
                                                Axios.get(`${REACT_APP.API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                                                    headers: {
                                                        ApiKey: `${REACT_APP.API_KEY}`
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
                                                                router.push(`/become-a-tutor/certification`)
                                                            } else {
                                                                router.push('/become-a-tutor/certification')
                                                            }

                                                        }
                                                    })
                                                    .catch(err => {
                                                        { ErrorDefaultAlert(err) }
                                                    })

                                            }
                                        })
                                            .catch(err => {
                                                console.log(err)
                                                {
                                                    ErrorDefaultAlert(JSON.stringify(err.response))
                                                }
                                            })
                                    }
                                } else {
                                    //if tutorcnt is equal to 0 the call insert tutor education api

                                    if (hideFields === false) {
                                        //no education
                                        const noEducation = {
                                            nRegid : regId,
                                            sIsEducation : "true"
                                        }
                                        setisLoading(true)
                                        // console.log(noEducation)
                                        await Axios.post(`${REACT_APP.API_URL}/api/TutorEducation/InsertTutorBasicEducation`, noEducation, {
                                            headers: {
                                                ApiKey: `${REACT_APP.API_KEY}`
                                                // 'Content-Type' : 'application/json'
                                            }
                                        }).then(res => {
                                            // console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            resetForm({})
                                            if(retData.success === '1') {
                                                router.push('/become-a-tutor/certification')
                                            }
                                        })
                                            .catch(err => {
                                                {
                                                    ErrorDefaultAlert(JSON.stringify(err.response))
                                                }
                                            })
                                    } else {
                                        // alert('yes education')
                                        setisLoading(true)
                                        await Axios.post(`${REACT_APP.API_URL}/api/TutorEducation/InsertTutorEducation`, [values], {
                                            headers: {
                                                ApiKey: `${REACT_APP.API_KEY}`
                                            }
                                        }).then(res => {
                                            // console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            // localStorage.removeItem('verify_uname')
                                            // console.log(retData)
                                            resetForm({})
                                            if(retData.success === '1') {
                                                router.push('/become-a-tutor/certification')
                                            }
                                        })
                                            .catch(err => {
                                                {
                                                    ErrorDefaultAlert(JSON.stringify(err.response))
                                                }
                                            })
                                    }}

                            }


                        }}
                    >
                        {({errors, touched}) => {
                            return (
                                <>
                                    <Form>
                                        <div className="section-title mb-3">
                                            <h4 className="rbt-title-style-3">Education</h4>
                                            {verifySts === 2 ? <>
                                                <Alert color='success'>
                                                    <h6 className='alert-heading m-0 text-center'>
                                                        Education information verification has been approved by admin
                                                    </h6>
                                                </Alert>

                                            </> : <>
                                                {verifySts === 1 ? <>
                                                    <Alert color='warning'>
                                                        <h6 className='alert-heading m-0 text-center'>
                                                            Education verification is pending state
                                                        </h6>
                                                    </Alert>

                                                </> : <>
                                                    {verifySts === 0 || verifySts === null ? <>

                                                    </> : <>
                                                        <Alert color='warning'>
                                                            <h6 className='alert-heading m-0 text-center'>
                                                                Education verification has been disapproved by admin
                                                            </h6>
                                                        </Alert>
                                                    </>}
                                                </>}
                                            </>}
                                            <p>Let us know about the highest education or ongoing degree</p>
                                            <input id="education" type="checkbox" value={isEducation} name="isEducation" onChange={handleIsEducation}/>
                                            <label htmlFor="education">
                                                I have not pursued any professional degree
                                            </label>

                                        </div>
                                        <div className={'row'}>
                                            {hideFields ? <>
                                            {educationFields.length >= 1 ?<>
                                                {educationFields && educationFields.map((education, index) => (
                                                        <div key={education.nTEId}>
                                                            {/*{console.log(education)}*/}
                                                            <div className={'row'}>
                                                                <div className={'col-lg-6'}>
                                                                    <input type={'hidden'} value={education.nTEId} />
                                                                    <label>Country of Education</label>
                                                                    <select
                                                                        disabled={verifySts === 2}
                                                                        value={education.nCountryId}
                                                                        onChange={(e) => handleChangeCountry(e, index)}
                                                                    >
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
                                                                <div className={'col-lg-6'}>
                                                                    <label>University</label>
                                                                    <input
                                                                        // Disable if verifycount is 1
                                                                        readOnly={verifySts === 2} // Make readonly if verifycount is
                                                                        type="text"
                                                                        value={education.sUniversity}
                                                                        onChange={(e) => handleChangeUniversity(e, index)}
                                                                    />
                                                                </div>
                                                                <div className={'col-lg-6'}>
                                                                    <label>Degree</label>
                                                                    <input
                                                                        type="text"
                                                                        readOnly={verifySts === 2}
                                                                        value={education.sDegree}
                                                                        onChange={(e) => handleChangeDegree(e, index)}
                                                                    />
                                                                </div>
                                                                <div className={'col-lg-6'}>
                                                                    <label>Specialization</label>
                                                                    <input
                                                                        type="text"
                                                                        readOnly={verifySts === 2}
                                                                        value={education.sSpecialization}
                                                                        onChange={(e) => handleChangeSpecialization(e, index)}
                                                                    />
                                                                </div>
                                                                <div className={'col-lg-6'}>
                                                                    <label>Year of study from</label>
                                                                    <select value={education.sFrom_year}
                                                                            disabled={verifySts === 2}
                                                                            onChange={(e) => handleYearFromChange(e, index)}>
                                                                        {options}
                                                                    </select>
                                                                </div>
                                                                <div className={'col-lg-6'}>
                                                                    <label>Year of study to</label>
                                                                    <select disabled={verifySts === 2} value={education.sTo_year}
                                                                            onChange={(e) => handleYearToChange(e, index)}>
                                                                        <option value="Present">Present</option>
                                                                        {options}
                                                                    </select>

                                                                </div>
                                                                <div className={'col-lg-12 mt-5 mb-3'}>
                                                                    <div className={'rounded-2 p-3'}
                                                                         style={{background: "#f4f4f8"}}>
                                                                        <h5>Get a qualification verified badge</h5>
                                                                        <small>Upload your diploma to boost your
                                                                            credibility! Our team will review it and add
                                                                            the badge to
                                                                            your profile. Once reviewed, your files will
                                                                            be deleted.
                                                                            JPG or PNG format; maximum size of
                                                                            2MB</small>
                                                                        {/*<input type="file" className={'p-0 mt-3'}*/}
                                                                        {/*       onChange={(e) => handleChangeImage(e, index)}/>*/}
                                                                        {/*{console.log(education.sEdu_Image)}*/}

                                                                        {/*<button type="submit"*/}
                                                                        {/*        className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100">*/}
                                                                        {/*    <input type="file" id="file" name="file"*/}
                                                                        {/*           onChange={(e) => handleChangeImage(e, index)}*/}
                                                                        {/*           accept="image/*"/>*/}
                                                                        {/*</button>*/}
                                                                        <div>
                                                                            <label id='label'
                                                                                   className='rbt-btn btn-md btn-gradient hover-icon-reverse'>Upload
                                                                                image
                                                                                <input type="file" id="file" name="file"
                                                                                       onChange={(e) => handleChangeImage(e, index)}
                                                                                       accept="image/*"/>
                                                                            </label>
                                                                            <div>
                                                                                {education.sEdu_imagePath && (
                                                                                    <img className={'mt-3'} src={education.sEdu_imagePath} alt=""
                                                                                         style={{width: 100}}/>
                                                                                )}
                                                                            </div>

                                                                        </div>



                                                                    </div>
                                                                </div>

                                                                {verifySts !== 2 ? <>
                                                                    <div className="col-lg-12 text-end mt-2">
                                                                        <button type={'button'}
                                                                                className="btn btn-danger"
                                                                                onClick={() => handleRemoveEducation(education.nTEId)}>Remove
                                                                        </button>
                                                                    </div>
                                                                </> : <></>}
                                                            </div>
                                                        </div>
                                                ))}
                                                {verifySts !== 2 ? <>
                                                        <div className={'col-lg-5 mt-5 mb-5'}>
                                                            <button type={'button'}
                                                                    className="rbt-btn-link left-icon border-0 bg-white"
                                                                    onClick={handleAddEducation}>
                                                                <i className="feather-plus"></i>Add More Education
                                                            </button>
                                                        </div>
                                                    </> : <>

                                                    </>}
                                            </> : <>
                                                <div key={educationFields.nTEId}>
                                                    {/*{console.log(education)}*/}
                                                    <div className={'row'}>
                                                        <div className={'col-lg-6'}>
                                                            <input type={'hidden'} value={educationFields.nTEId}/>
                                                            <label>Country of Education</label>
                                                            <select
                                                                disabled={verifySts === 2}
                                                                value={educationFields.nCountryId}
                                                                onChange={(e) => handleChangeCountry(e)}
                                                            >
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
                                                        <div className={'col-lg-6'}>
                                                            <label>University</label>
                                                            <input
                                                                // Disable if verifycount is 1
                                                                readOnly={verifySts === 2} // Make readonly if verifycount is
                                                                type="text"
                                                                value={educationFields.sUniversity}
                                                                onChange={(e) => handleChangeUniversity(e)}
                                                            />
                                                        </div>
                                                        <div className={'col-lg-6'}>
                                                            <label>Degree</label>
                                                            <input
                                                                type="text"
                                                                readOnly={verifySts === 2}
                                                                value={educationFields.sDegree}
                                                                onChange={(e) => handleChangeDegree(e)}
                                                            />
                                                        </div>
                                                        <div className={'col-lg-6'}>
                                                            <label>Specialization</label>
                                                            <input
                                                                type="text"
                                                                readOnly={verifySts === 2}
                                                                value={educationFields.sSpecialization}
                                                                onChange={(e) => handleChangeSpecialization(e)}
                                                            />
                                                        </div>
                                                        <div className={'col-lg-6'}>
                                                            <label>Year of study from</label>
                                                            <select value={educationFields.sFrom_year}
                                                                    disabled={verifySts === 2}
                                                                    onChange={(e) => handleYearFromChange(e)}>
                                                                {options}
                                                            </select>
                                                        </div>
                                                        <div className={'col-lg-6'}>
                                                            <label>Year of study to</label>
                                                            <select disabled={verifySts === 2}
                                                                    value={educationFields.sTo_year}
                                                                    onChange={(e) => handleYearToChange(e)}>
                                                                <option value="Present">Present</option>
                                                                {options}
                                                            </select>

                                                        </div>
                                                        <div className={'col-lg-12 mt-5 mb-3'}>
                                                            <div className={'rounded-2 p-3'}
                                                                 style={{background: "#f4f4f8"}}>
                                                                <h5>Get a qualification verified badge</h5>
                                                                <small>Upload your diploma to boost your
                                                                    credibility! Our team will review it and add the
                                                                    badge to
                                                                    your profile. Once reviewed, your files will be
                                                                    deleted.
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
                                                                        {education.sEdu_imagePath && (
                                                                            <img className={'mt-3'}
                                                                                 src={education.sEdu_imagePath} alt=""
                                                                                 style={{width: 100}}/>
                                                                        )}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {verifySts == 2 ? <>
                                                            <div className="col-lg-12 text-end mt-2">
                                                                <button type={'button'} className="btn btn-danger"
                                                                        onClick={() => handleRemoveEducation(educationFields.nTEId)}>Remove
                                                                </button>
                                                            </div>
                                                        </> : <></>}
                                                    </div>
                                                </div>
                                                {verifySts !== 2 ? <>
                                                    <div className={'col-lg-5 mt-5 mb-5'}>
                                                        <button type={'button'}
                                                                className="rbt-btn-link left-icon border-0 bg-white"
                                                                onClick={handleAddEducation}>
                                                            <i className="feather-plus"></i>Add More Education
                                                        </button>
                                                    </div>
                                                </> : <>

                                                </>}
                                            </>}
                                            </> : <></>}
                                            {/*{hideFields ? <>*/}
                                            {/*

                                            {/*</> : <></>}*/}

                                            {/*{console.log(educationFields)}*/}
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
                                                        <button type="submit"
                                                                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100">
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


export default Education;
