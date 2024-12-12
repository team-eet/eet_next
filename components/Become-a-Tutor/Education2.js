import Courses from "../../data/dashboard/instructor/instructor.json";
import CourseWidgets from "./Dashboard-Section/widgets/CourseWidget";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import { API_URL, API_KEY } from "../../constants/constant";
import {ErrorMessage, Form, Formik} from "formik";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import img from "@/public/images/others/thumbnail-placeholder.svg";
import { useRouter } from "next/router";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {Alert} from "reactstrap";
import * as Yup from "yup";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'


const UserValidationSchema = Yup.object().shape({
    nCountryId: Yup.string()
        .required('This field is required'),
    sDegree: Yup.string()
        .required('This field is required'),
    sUniversity: Yup.string()
        .required('This field is required'),
    sSpecialization: Yup.string()
        .required('This field is required'),
    sFrom_year: Yup.string()
        .required('This field is required'),
    sTo_year: Yup.string()
        .required('This field is required')
})

const Education = () => {
    const REACT_APP = API_URL
    const [country, setCountry] = useState([]);
    const [countryId, setcountryId] = useState('101')
    const [hideFields, sethideFields] = useState(true)
    const [isLoading, setisLoading] = useState(false)
    const defaultValue = new Date().getFullYear();
    const [regId, setregId] = useState('')
    const [Certi_Image, setCerti_Image] = useState('')
    // const [selectedYear, SetselectedYear] = useState(new Date().getFullYear());
    // const [thisYear, setthisYear] = useState(defaultValue);
    const minOffset = 0;
    const maxOffset = 53;
    const [gettutorDetails, settutorDetails] = useState([])

    // const [file, setFile] = useState();

    const EducationList = []
    const [educationFields, seteducationFields] = useState([
        {
            nCountryId: 101,
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
        console.log(educationFields.length)
        const { value } = e.target;
        if(educationFields.length >= 1){
            const updatedFields = [...educationFields];
            updatedFields[index].nCountryId = value;
            seteducationFields(updatedFields);
        } else {
            const updatedFields = educationFields
            updatedFields[0].nCountryId = value;
            seteducationFields(updatedFields);
        }

    };

    const handleChangeUniversity = (e, index) => {
        const { value } = e.target;
        if(educationFields.length >= 1){
            const updatedFields = [...educationFields];
            updatedFields[index].sUniversity = value;
            seteducationFields(updatedFields);
        } else {
            const updatedFields = educationFields;
            updatedFields[0].sUniversity = value;
            seteducationFields(updatedFields);
        }
    };

    const handleChangeDegree = (e, index) => {
        const { value } = e.target;
        if(educationFields.length >= 1){
            const updatedFields = [...educationFields];
            updatedFields[index].sDegree = value;
            seteducationFields(updatedFields);
        } else {
            const updatedFields = educationFields;
            updatedFields[0].sDegree = value;
            seteducationFields(updatedFields);
        }
    };

    const handleChangeSpecialization = (e, index) => {
        const { value } = e.target;
        if(educationFields.length >= 1){
            const updatedFields = [...educationFields];
            updatedFields[index].sSpecialization = value;
            seteducationFields(updatedFields);
        } else {
            const updatedFields = educationFields;
            updatedFields[0].sSpecialization = value;
            seteducationFields(updatedFields);
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
        const updatedFields = [...educationFields];

        const fileext = ['image/jpeg', 'image/jpg', 'image/png'];

        if (event.target.files[0].size < 2000000) {
            if (fileext.includes(event.target.files[0].type)) {
                // console.log(event.target.files[0])
                getBase64(event.target.files[0])
                    .then((result) => {
                        if(educationFields.length > 1){
                            const updatedFields = [...educationFields];
                            updatedFields[index].sEdu_imagePath = result;
                            // updatedFields[index].sEdu_imagePath = result
                            seteducationFields(updatedFields);
                        } else {
                            const updatedFields = educationFields;
                            updatedFields[0].sEdu_imagePath = result;
                            // updatedFields[index].sEdu_imagePath = result
                            seteducationFields(updatedFields);
                        }

                    })
                    .catch((err) => {
                        console.error('Error converting image to base64:', err);
                    });

                if(educationFields.length >= 1){
                    const updatedFields = [...educationFields];
                    updatedFields[index].sEdu_Image = URL.createObjectURL(event.target.files[0]);
                    seteducationFields(updatedFields);
                } else {
                    const updatedFields = educationFields;
                    updatedFields[0].sEdu_Image = URL.createObjectURL(event.target.files[0]);
                    seteducationFields(updatedFields);
                }``

                // setsEdu_Image(URL.createObjectURL(event.target.files[0]));
            } else {
                alert('Please select only image file types (jpeg/jpg/png)');
            }
        } else {
            alert('Please upload a file less than 2MB');
        }
    };

    const handleYearFromChange = (e, index) => {
        const { value } = e.target;
        const updatedFields = [...educationFields];
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
            seteducationFields('');
        }

        seteducationFields(updatedFields)


    };
    const handleYearToChange = (e, index) => {
        const { value } = e.target;
        const updatedFields = [...educationFields];

        updatedFields[index].sTo_year = value;
        // Validation: Check if "To" year is less than "From" year
        if (
            updatedFields[index].sFrom_year &&
            parseInt(value) < parseInt(updatedFields[index].sFrom_year)
        ) {
            updatedFields[index].sTo_year = '';
            alert("Year of study to should not be less than Year of study from.");
        }

        seteducationFields(updatedFields);
    };

    // const [educationFields, setEducationFields] = useState([{ id: 1 }]);
    const [cancelButton, setCancelButton] = useState(false);

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
        seteducationFields([...educationFields, newEducation]);
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


    const options = [];

    for (let i = minOffset; i <= maxOffset; i++) {
        const year = defaultValue - i;
        options.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    }
    const [isEducated, setEducated] = useState('')
    const handleIsCertification= (e) => {
        // console.log(e.target.checked)
        setEducated(e.target.checked)
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
    const [isEducationAlert, setisEducationAlert] = useState(0)
    const [verifyeduSts, setverifyeduSts] = useState()
    const [noeducation, setnoeducation] = useState(false)
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
    const [tuteducnt, settuteducnt] = useState('')

    useEffect(() => {
        bindCountry()

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
                        console.log("sCertification_verify ", res.data[0].sCertification_verify)
                        console.log("sEducation_verify ", res.data[0].sEducation_verify)
                        if(res.data[0].sEducation_verify !== null){
                            // setverifySts(res.data[0].sCertification_verify)
                            setverifySts(res.data[0].sEducation_verify)
                            setverifyeduSts(res.data[0].sEducation_verify)
                            setisEducationAlert(1)
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
                    console.log('GetTutorProfile', res.data)
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
                    console.log('res.data', res.data)
                    if(res.data.length !== 0){
                        settuteducnt(res.data[0].education_data)
                    }
                    if (verifyeduSts === 2) {
                        setnoeducation(true)
                        sethideFields(false)
                    }
                    const array = res.data.map((item, index) => {
                        return item.nTEId
                    })

                    // console.log(array)
                    setUpdatearray(array)

                    // ---------------------
                    if(res.data.length !== 0) {

                        const eduvalue = res.data.map((item, index) => {
                            return item.sEducation_comment
                        })
                        // console.log(eduvalue)
                        if(eduvalue[0] === 'No Education') {
                            sethideFields(false)
                        }
                        setEducated(eduvalue[0])
                        seteducationFields(res.data)

                    } else {
                        seteducationFields(educationFields)
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
                    console.log('GetTutorDetails' ,res.data)
                    if(res.data.length !== 0) {
                        settutorDetails(res.data)
                        // if(res.data[0].bIsReview !== 0) {
                        //     router.push('/become-a-tutor/Review')
                        // } else {
                        //
                        // }
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

                    {
                        isEducationAlert !== 1 && verifySts !== 0 && verifySts !== '' ? <>
                            <div className="section-title">
                                <Skeleton height={20} width={150} className='rbt-title-style-3 mb-0'/>
                            </div>
                            <div className={'mb-3'}>
                                <Skeleton height={1} width={'100%'} className='my-4'/>
                            </div>
                            <Skeleton height={40} className="w-100 mb-2"/>
                            <div className="mb-3">
                                <Skeleton height={20} width="60%"/> {/* Note text */}
                                <Skeleton height={15} width="80%" className="mt-2"/> {/* Paragraph text */}
                            </div>
                            {
                                isEducated !== 'No Education' ? <>
                                        <div className="form-group d-flex align-items-center mt-3">
                                            <Skeleton circle height={20} width={20} className="me-2"/> {/* Checkbox icon */}
                                            <Skeleton height={15} width={200}/> {/* Label text */}
                                        </div>
                                        <div className={'row row--15 mt-3'}>
                                            <div className={'col-lg-6 mb-3'}>
                                                <div className="form-group">
                                                    <Skeleton height={40} className="w-100 mb-2"/>
                                                </div>
                                            </div>
                                            <div className={'col-lg-6 mb-3'}>
                                                <div className="form-group">
                                                    <Skeleton height={40} className="w-100 mb-2"/>
                                                </div>
                                            </div>
                                            <div className={'col-lg-6 mb-3'}>
                                                <div className="form-group">
                                                    <Skeleton height={40} className="w-100 mb-2"/>
                                                </div>
                                            </div>
                                            <div className={'col-lg-6 mb-3'}>
                                                <div className="form-group">
                                                    <Skeleton height={40} className="w-100 mb-2"/>
                                                </div>
                                            </div>
                                            <div className={'col-lg-6 mb-3'}>
                                                <div className="form-group">
                                                    <Skeleton height={40} className="w-100 mb-2"/>
                                                </div>
                                            </div>
                                            <div className={'col-lg-6 mb-3'}>
                                                <div className="form-group">
                                                    <Skeleton height={40} className="w-100 mb-2"/>
                                                </div>
                                            </div>
                                            <div className={'col-lg-12 mb-3'}>
                                                <div className="rounded-2 p-3"
                                                     style={{background: 'rgb(244, 244, 248)'}}>
                                                    <Skeleton height={30} width="70%"/> {/* Title */}
                                                    <Skeleton height={20} width="100%"
                                                              className="mt-2"/> {/* Description text */}
                                                    <div className="mt-3">
                                                        <Skeleton height={40} width={180}/> {/* Upload Button */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={'col-lg-12'}>
                                                <div className="form-group">
                                                    <Skeleton height={40} className="w-100 mb-2"/>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    : <>
                                        <div className="form-group d-flex align-items-center mt-3">
                                            <Skeleton circle height={20} width={20} className="me-2"/> {/* Checkbox icon */}
                                            <Skeleton height={15} width={200}/> {/* Label text */}
                                    </div>
                                </>
                                    }
                                </> : <>


                                    <Formik
                                        // validationSchema={UserValidationSchema}
                                        initialValues={{
                                            nRegId: regId,
                                            sEducation: EducationList[0]
                                        }}
                                        enableReinitialize={true}


                                        onSubmit={async (values, {resetForm}) => {
                                            console.log([values])
                                            // console.log([values])s
                                            if(verifySts === 2) {
                                router.push('/become-a-tutor/certification')
                            } else {
                                if (tutorcnt !== 0) {
                                    if (hideFields === false) {
                                        //no education
                                        const noEducation = {
                                            nRegId : regId,
                                            sIsEducation : "true"
                                        }
                                        setisLoading(true)
                                        // console.log(noEducation)
                                        await Axios.post(`${API_URL}/api/TutorEducation/InsertTutorBasicEducation`, noEducation, {
                                            headers: {
                                                ApiKey: `${API_KEY}`
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
                                    }
                                    else {
                                        if(tuteducnt === "0") {
                                            setisLoading(true)
                                            await Axios.post(`${API_URL}/api/TutorEducation/InsertTutorEducation`, [values], {
                                                headers: {
                                                    ApiKey: `${API_KEY}`
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
                                                    // console.log(err)
                                                    {
                                                        ErrorDefaultAlert(JSON.stringify(err.response))
                                                    }
                                                })
                                        }
                                        else {
                                                    // alert('yes education')
                                                    const updateValues = [{
                                                        nRegId : regId,
                                                        updateId: updateArray,
                                                        deleteId: deletedArray,
                                                        sEducation : EducationList[0]
                                                    }]
                                                    console.log('updateValues', updateValues)
                                                    setisLoading(true)
                                                    await Axios.put(`${API_URL}/api/TutorEducation/UpdateTutorEducation  `, updateValues, {
                                                        headers: {
                                                            ApiKey: `${API_KEY}`
                                                        }
                                                    }).then(res => {
                                                        console.log(res.data)
                                                        const retData = JSON.parse(res.data)

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

                                                                            let positionOfThree = verify_string.findIndex(num => num === 3);
                                                                            let stringForUrl = url[positionOfThree];
                                                                            let result = array1.indexOf(stringForUrl)


                                                                            console.log('stringForUrl', stringForUrl, result)
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
                                                            // console.log(err)
                                                            {
                                                                ErrorDefaultAlert(JSON.stringify(err.response))
                                                            }
                                                        })

                                            }
                                    }
                                }
                                else {
                                    alert('Tutor not found')
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
                                            <h4 className="rbt-title-style-3">Education</h4>
                                            {isEducationAlert === 1 ? <>
                                                    {verifySts === 2 ? <>
                                                        <Alert color='success'>
                                                            <h6 className='alert-heading m-0 text-center'>
                                                                Education verification has been approved by admin
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
                                                                <Alert color='danger'>
                                                                    <h6 className='alert-heading m-0 text-center'>
                                                                        Education verification has been disapproved by admin
                                                                    </h6>
                                                                </Alert>
                                                            </>}
                                                        </>}
                                                    </>}
                                                </> : <></>}

                                            <small className={'text-warning'}>Note : Add the Highest Qualification only</small>
                                            <p>Let us know about Education</p>
                                            {isEducated === 'No Education' ? <>
                                                {verifyeduSts === 2 ? <>
                                                    <input id="Education" type="checkbox" checked value={isEducated}
                                                           name="Education" onChange={handleIsCertification} />
                                                    <label htmlFor="Education">
                                                        I have not pursued any professional degree
                                                    </label>
                                                </> : <>
                                                    <input id="Education" type="checkbox" checked value={isEducated}
                                                           name="Education" onChange={handleIsCertification}/>
                                                    <label htmlFor="Education">
                                                        I have not pursued any professional degree
                                                    </label>
                                                </>}
                                            </> : <>
                                                {verifyeduSts === 2 ? <>
                                                    <input id="Education" type="checkbox" checked value={isEducated}
                                                           name="Education" onChange={handleIsCertification} />
                                                    <label htmlFor="Education">
                                                        I have not pursued any professional degree
                                                    </label>
                                                </> : <>
                                                    <input id="Education" type="checkbox" value={isEducated}
                                                           name="Education" onChange={handleIsCertification}/>
                                                    <label htmlFor="Education">
                                                        I have not pursued any professional degree
                                                    </label>
                                                </>}
                                            </>}




                                        </div>
                                        <div className={'row'}>
                                        {/*{console.log(certificationFields)}*/}
                                            {/*<form action="#" className="row row--15 mt-5">*/}
                                            {hideFields ? <>
                                                {verifyeduSts !== 2 ? <>
                                                    {educationFields.length >= 1 ? <>

                                                        {educationFields && educationFields.map((education, index) => {
                                                            // console.log(certification)
                                                            return (
                                                                <>
                                                                    <div key={education.nTCId}>
                                                                        <div className={'row'}>
                                                                            <div className="col-lg-6">
                                                                                <input type={'hidden'}
                                                                                       value={education.nTEId}/>
                                                                                <label>
                                                                                    Country of Education
                                                                                </label>
                                                                                <div className="form-group">
                                                                                    <select
                                                                                        disabled={verifySts === 2}
                                                                                        name={"nCountryId"}
                                                                                        value={education.nCountryId ? education.nCountryId : '101'}
                                                                                        onChange={(e) => handleChangeCountry(e, index)}
                                                                                    >
                                                                                        {country.map((item, index) => {
                                                                                            return (
                                                                                                <>
                                                                                                    <option key={index}
                                                                                                            value={item.nCountryId ?  item.nCountryId : '101'}>{item.sCountryname}</option>
                                                                                                </>
                                                                                            )
                                                                                        })}
                                                                                    </select>
                                                                                    <ErrorMessage name='nCountryId' component='div'
                                                                                                  className='field-error text-danger' />
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-lg-6">
                                                                                <label>
                                                                                    University
                                                                                </label>
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        readOnly={verifySts === 2}
                                                                                        onChange={(e) => handleChangeUniversity(e, index)}
                                                                                        value={education.sUniversity}
                                                                                        type="text"
                                                                                        name={"sUniversity"}
                                                                                        placeholder="university"/>
                                                                                    <ErrorMessage name='sUniversity' component='div'
                                                                                                  className='field-error text-danger' />
                                                                                    <span className="focus-border"></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label>
                                                                                    Degree
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    readOnly={verifySts === 2}
                                                                                    value={education.sDegree}
                                                                                    name={"sDegree"}
                                                                                    onChange={(e) => handleChangeDegree(e, index)}
                                                                                />
                                                                                <ErrorMessage name='sDegree' component='div'
                                                                                              className='field-error text-danger' />
                                                                                <span className="focus-border"></span>
                                                                            </div>
                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label>
                                                                                    Specialization
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    readOnly={verifySts === 2}
                                                                                    name={"sSpecialization"}
                                                                                    value={education.sSpecialization}
                                                                                    onChange={(e) => handleChangeSpecialization(e, index)}
                                                                                />
                                                                                <ErrorMessage name='sSpecialization' component='div'
                                                                                              className='field-error text-danger' />
                                                                                <span className="focus-border"></span>
                                                                            </div>
                                                                            <div className={'col-lg-6'}>
                                                                                <label>Year of study from</label>
                                                                                <select value={education.sFrom_year}
                                                                                        name={"sFrom_year"}
                                                                                        disabled={verifySts === 2}
                                                                                        onChange={(e) => handleYearFromChange(e, index)}>
                                                                                    {options}
                                                                                </select>
                                                                                <ErrorMessage name='sFrom_year' component='div'
                                                                                              className='field-error text-danger' />
                                                                                <span className="focus-border"></span>
                                                                            </div>
                                                                            <div className={'col-lg-6'}>
                                                                                <label>Year of study to</label>
                                                                                <select disabled={verifySts === 2}
                                                                                        value={education.sTo_year}
                                                                                        name={"sTo_year"}
                                                                                        onChange={(e) => handleYearToChange(e, index)}>
                                                                                    <option value="Present">Present</option>
                                                                                    {options}
                                                                                </select>
                                                                                <ErrorMessage name='sTo_year' component='div'
                                                                                              className='field-error text-danger' />
                                                                                <span className="focus-border"></span>
                                                                            </div>
                                                                            <div className={'col-lg-12 mt-5 mb-3'}>
                                                                                <div className={'rounded-2 p-3'}
                                                                                     style={{background: "#f4f4f8"}}>
                                                                                    <h5>Get a qualification verified
                                                                                        badge</h5>
                                                                                    <small>Upload your diploma to boost your
                                                                                        credibility! Our team will review it
                                                                                        and add
                                                                                        the badge to
                                                                                        your profile. Once reviewed, your
                                                                                        files will
                                                                                        be deleted.
                                                                                        JPG or PNG format; maximum size of
                                                                                        2MB</small>
                                                                                    <div>
                                                                                        <label id='label'
                                                                                               className='rbt-btn btn-md btn-gradient hover-icon-reverse'>Upload
                                                                                            image
                                                                                            <input type="file" id="file"
                                                                                                   name="file"
                                                                                                   onChange={(e) => handleChangeImage(e, index)}
                                                                                                   accept="image/*"/>
                                                                                        </label>
                                                                                        <div>
                                                                                            {education.sEdu_imagePath && (
                                                                                                <img className={'mt-3'}
                                                                                                     src={education.sEdu_imagePath}
                                                                                                     alt=""
                                                                                                     style={{width: 100}}/>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            {verifySts === 2 ? <></> : <>
                                                                                <div className="col-lg-12 text-end mt-2">
                                                                                    {educationFields.length > 1 ? <>
                                                                                        <button type={'button'}
                                                                                                className="btn btn-danger"
                                                                                                onClick={() => handleRemoveEducation(education.nTEId)}>Remove
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

                                                        {/*{verifySts === 2 ? <></> : <>*/}
                                                        {/*    <div className={'col-lg-5 mt-5 mb-5'}>*/}
                                                        {/*        <button type={'button'}*/}
                                                        {/*                className="rbt-btn-link left-icon border-0 bg-white"*/}
                                                        {/*                onClick={handleAddEducation}>*/}
                                                        {/*            <i className="feather-plus"></i>Add More Education*/}
                                                        {/*        </button>*/}
                                                        {/*    </div>*/}
                                                        {/*</>}*/}
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

                        </>}
                </div>
            </div>

        </>
    );
};

export default Education;
