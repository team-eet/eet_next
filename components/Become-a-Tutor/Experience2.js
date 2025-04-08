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
import * as Yup from "yup";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal)

const UserValidationSchema = Yup.object().shape({

    sExperience: Yup.array().of(
        Yup.object().shape({
            sIs_fresher: Yup.string()
                .required('This field is required'),
            // nTotal_exper: Yup.string()
            //     .required('This field is required'),
            // nTotal_online_exper: Yup.string()
            //     .required('This field is required'),
            sOrganization: Yup.string()
                .required('Organization is required'),
            sPosition: Yup.string()
                .required('Position is required'),
            sFrom_years: Yup.string().trim()
                .required('Year of work from is required')
        })
    ),
})
const Experience = () => {
    const REACT_APP = API_URL
    const [country, setCountry] = useState([]);
    const [countryId, setcountryId] = useState('')
    const [hideFields, sethideFields] = useState(true)
    const defaultValue = new Date().getFullYear();
    const [regId, setregId] = useState('')
    const [Certi_Image, setCerti_Image] = useState('')
    // const [selectedYear, SetselectedYear] = useState(new Date().getFullYear());
    // const [thisYear, setthisYear] = useState(defaultValue);
    const minOffset = 0;
    const maxOffset = 53;
    const [Isfresher, setIsFresher] = useState('Fresher')
    const [fields, showFields] = useState(false)
    const [isLoading, setisLoading] = useState(false)

    const handleChange = (e, index) => {
        console.log(e.target.value)
        // setIsFresher(e.target.checked)
        if(e.target.value === 'Experience') {
            setIsFresher('Experience')
            showFields(true)
        } else {
            setIsFresher('Fresher')
            showFields(false)
        }
    }

    // const [file, setFile] = useState();

    const ExperienceList = []
    const [expFields, setExpFields] = useState([
        {
            // sIs_fresher:Isfresher,
            sIs_fresher:'',
            nTotal_exper:'',
            nTotal_online_exper:'',
            nCountryId:101,
            sOrganization:'',
            sPosition:'',
            sFrom_years:'',
            sTo_years:'',
        }
    ]);

    ExperienceList.push(expFields);

    const handleChangeTotalExp = (e, index) => {
        const { value } = e.target;
        let totalExp = parseFloat(value);

        if (value === "") {
            const updatedFields = [...expFields];
            updatedFields[index].nTotal_exper = ""; // Set to empty string when input is cleared
            setExpFields(updatedFields);
            return; // Stop further execution
        }

        // Validate that totalExp is a number
        if (isNaN(totalExp) || totalExp < 0) {
            return; // Ignore invalid inputs
        }

        const updatedFields = [...expFields];

        // Update the total experience
        updatedFields[index].nTotal_exper = totalExp;

        // Ensure online experience does not exceed total experience
        if (parseFloat(updatedFields[index].nTotal_online_exper) >= totalExp) {
            updatedFields[index].nTotal_exper = totalExp; // Set online experience to the total experience if it exceeds
        }

        setExpFields(updatedFields);
    };

    const handleChangeOnlineExp = (e, index) => {
        const { value } = e.target;
        let onlineExp = parseFloat(value);
        if (value === "") {
            const updatedFields = [...expFields];
            updatedFields[index].nTotal_online_exper = ""; // Set to empty string when input is cleared
            setExpFields(updatedFields);
            return; // Stop further execution
        }



        // Validate that onlineExp is a number
        if (isNaN(onlineExp) || onlineExp < 0) {
            return; // Ignore invalid inputs
        }

        const updatedFields = [...expFields];

        // Ensure online experience does not exceed total experience
        if (onlineExp > parseFloat(updatedFields[index].nTotal_exper)) {
            // alert('online exp cannot be grater than total exp')
            Swal.fire({
                icon: "error", // Error icon
                title: "Invalid Value", // Alert Title
                text: "Online experience cannot be greater than total experience.", // Alert Message
                confirmButtonText: "Okay", // Button text
            });
            updatedFields[index].nTotal_online_exper = '';
            // onlineExp = updatedFields[index].nTotal_online_exper; // Cap online experience to the total experience
        } else {
            updatedFields[index].nTotal_online_exper = onlineExp;
        }

        setExpFields(updatedFields);
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
            updatedFields[index].sIs_fresher = Isfresher;
            setExpFields(updatedFields);
        } else {
            const updatedFields = expFields;
            updatedFields.sOrganization = value;
            updatedFields[index].sIs_fresher = Isfresher;
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
                // alert('Please select only image file types (jpeg/jpg/png)');
                MySwal.fire({
                    icon: "error",
                    title: "Invalid File Type",
                    text: "Please select only image file types (jpeg/jpg/png)",
                    confirmButtonText: "Okay",
                });
            }
        } else {
            MySwal.fire({
                icon: "error",
                title: "File Too Large",
                text: "Please upload a file less than 2MB",
                confirmButtonText: "Okay",
            });
        }
    };

    const [gettutorDetails, settutorDetails] = useState([])

    const handleYearFromChange = (e, index) => {
        const { value } = e.target;
        const updatedFields = [...expFields];
        const yearOfBirth = new Date(gettutorDetails[0].dDOB).getFullYear(); // Extract the year from DOB

        updatedFields[index].sFrom_years = value;

        if (parseInt(value) < yearOfBirth) {
            MySwal.fire({
                icon: "error", // Error icon
                title: "Invalid Year",
                text: `Year of study From should not be greater than the year of birth (${yearOfBirth}).`,
                confirmButtonText: "Okay", // Button text
            });
            return; // Stop further execution
        }

        // Validation: Check if "To" year is less than "From" year
        if (
            updatedFields[index].sTo_years &&
            parseInt(updatedFields[index].sTo_years) < parseInt(value)

        ) {
            MySwal.fire({
                icon: "error", // Error icon
                title: "Invalid Year Range",
                text: "Year of study To should not be less than Year of study From.",
                confirmButtonText: "Okay", // Button text
            });
            setExpFields('');
            updatedFields[index].sFrom_years = " ";
        }

        setExpFields(updatedFields)


    };
    const handleYearToChange = (e, index) => {
        const { value } = e.target;
        const updatedFields = [...expFields];

        updatedFields[index].sTo_years = value;
        // Validation: Check if "To" year is less than "From" year
        if (
            updatedFields[index].sFrom_years &&
            parseInt(value) < parseInt(updatedFields[index].sFrom_years)
        ) {
            updatedFields[index].sTo_years = '';
            MySwal.fire({
                icon: "error", // Error icon
                title: "Invalid Year Range", // Alert Title
                text: "Year of study To should not be less than Year of study From.", // Message
                confirmButtonText: "Okay", // Button text
            });
        }

        setExpFields(updatedFields);
    };

    const handleAddExperience = () => {
        const newId = expFields.length + 1;
        const newExperience = {
            nTTEId: newId,
            sIs_fresher:Isfresher,
            nTotal_exper: expFields.some(exp => exp.nTotal_exper !== '') ? expFields[0].nTotal_exper : '', // Only if there is no existing value
            nTotal_online_exper: expFields.some(exp => exp.nTotal_online_exper !== '') ? expFields[0].nTotal_online_exper : '', // Only if there is no existing value
            nCountryId:'',
            sOrganization:'',
            sPosition:'',
            sFrom_years:'',
            sTo_years:'',
            isAdded:'yes'
        };
        setExpFields([...expFields, newExperience]);
    };

    const handleRemoveCertification = (id) => {
        // const updatedFields = certificationFields.filter((field) => field.nTCId !== id);
        // setcertificationFields(updatedFields);
        //
        // const deletedFields = certificationFields.filter((field) => field.nTCId === id);
        // console.log('deletedFields', deletedFields)

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

        console.log("delete Array" ,EncryptData(deletedarray[0]))

        Axios.delete(`${API_URL}/api/TutorTeachExperience/DeleteTutorTeachExper/${EncryptData(deletedarray[0])}`, {
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

    const options = [];

    for (let i = minOffset; i <= maxOffset; i++) {
        const year = defaultValue - i;
        options.push(
            <option key={year} value={year}>
                {year}
            </option>
        );
    }

    const router = useRouter()
    const [tutorcnt, setTutorcnt] = useState('')
    const [updateArray, setUpdatearray] = useState([])
    const [deletedArray, setdeletedArray] = useState([])
    const [commentMessage, setCommentMessage] = useState([])
    const [verifySts, setverifySts] = useState()
    const [isExperienceAlert, setisExperienceAlert] = useState(0)
    const [nocertificate, setnocertificate] = useState(false)

    const [tutexpcnt, settutexpcnt] = useState('')

    useEffect(() => {
        if(localStorage.getItem('userData')) {
            setregId(DecryptData(localStorage.getItem('userData')).regid)


            Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${DecryptData(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    // console.log("GetTutorVerify",res.data[0].sTeachExper_verify)
                    if (res.data.length !== 0) {
                        if(res.data[0].sTeachExper_verify !== null){
                            setCommentMessage(res.data[0])
                            setverifySts(res.data[0].sTeachExper_verify)
                            setisExperienceAlert(1)
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

            bindCountry()
            Axios.get(`${API_URL}/api/TutorBasics/GetTutorProfile/${DecryptData(localStorage.getItem('userData')).regid}`, {
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

            Axios.get(`${API_URL}/api/TutorTeachExperience/GetTutorExpData/${DecryptData(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    console.log(res.data)
                    if(res.data.length !== 0){
                        console.log("Hello",res.data[0])
                        settutexpcnt(res.data[0].experience_data)
                        if(res.data[0]['sTeachExper_comment'] === 'Fresher'){
                            showFields(false)

                            // setIsFresher(res.data[0]['sTeachExper_comment'])
                        } else {
                            // setIsFresher('Experience')
                            showFields(true)

                        }
                        const array = res.data.map((item, index) => {
                            return item.nTTEId
                        })
                        if (res.data[0].experience_data === '0'){
                            setIsFresher('Fresher')
                            showFields(false)
                        }else{
                            setIsFresher('Experience')
                            showFields(true)
                        }
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

            Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${DecryptData(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if(res.data.length !== 0){
                        settutorDetails(res.data)
                        // if(res.data[0].bIsReview !== 0) {
                        //     router.push('/become-a-tutor/Review')
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

                    {
                        isExperienceAlert !== 1 && verifySts !== 0 && verifySts !== '' ? <>
                            <div className="section-title">
                                <Skeleton height={20} width={150} className='rbt-title-style-3 mb-0'/>
                            </div>
                            <div className={'mb-3'}>
                                <Skeleton height={1} width={'100%'} className='my-4'/>
                            </div>
                            <Skeleton height={40} className="w-100 mb-4"/>
                            <div className="section-title">
                                <Skeleton height={20} width={350} className='rbt-title-style-3 mb-0'/>
                            </div>
                            <div className="form-group d-flex align-items-center mt-4">
                                <Skeleton circle height={20} width={20} className="me-2"/> {/* Checkbox icon */}
                                <Skeleton height={15} width={100}/> {/* Label text */}
                                <Skeleton circle height={20} width={20} className="ms-4 me-2"/> {/* Checkbox icon */}
                                <Skeleton height={15} width={100}/> {/* Label text */}
                            </div>

                            {
                                Isfresher === 'Fresher' ? <>
                                    <Skeleton height={40} className="w-100 mt-4"/>
                                </> : <>
                                    <div className={'row row--15 mt-3'}>
                                        <div className={'col-lg-6 mb-3'}>
                                            <Skeleton height={20} width="70%"/> {/* Label Text */}
                                            <div className="form-group">
                                                <Skeleton height={40} width="100%"/> {/* Input Field */}
                                                <span className="focus-border"></span>
                                            </div>

                                        </div>
                                        <div className={'col-lg-6 mb-3'}>
                                            <Skeleton height={20} width="70%"/> {/* Label Text */}
                                            <div className="form-group">
                                                <Skeleton height={40} width="100%"/> {/* Input Field */}
                                                <span className="focus-border"></span>
                                            </div>
                                        </div>
                                        <div className={'col-lg-12 mb-3'}>
                                            <div>
                                                <Skeleton height={1} width={'100%'} className='my-4'/>
                                            </div>
                                        </div>
                                        <div className={'col-lg-12 mb-3'}>
                                            <Skeleton height={20} width="30%"/> {/* Label Text */}
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
                                        <div className={'col-lg-6 mb-5'}>
                                            <div className="form-group">
                                                <Skeleton height={40} className="w-100 mb-2"/>
                                            </div>
                                        </div>
                                        <div className={'col-lg-12 mb-5'}>
                                            <div className="form-group">
                                                <Skeleton height={20} width={130} className="mb-2"/>
                                            </div>
                                        </div>
                                        <div className={'col-lg-12'}>
                                            <div className="form-group">
                                                <Skeleton height={40} className="w-100 mb-2"/>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }


                        </> : <>

                            <Formik
                                // validationSchema={UserValidationSchema}
                                validationSchema={fields ? UserValidationSchema : undefined}
                                initialValues={{
                                    nRegId: regId,
                                    sExperience: ExperienceList[0]
                                }}
                                enableReinitialize={true}
                                onSubmit={async (values, {resetForm}) => {
                                    console.log(values)

                                    if (verifySts === 2) {
                                        router.push('/become-a-tutor/description')
                                    } else {
                                        if (tutorcnt !== 0) {
                                            if (fields === false) {
                                                // alert('hello')
                                                // fresher
                                                const noExperience = {
                                            nRegId : regId,
                                            sIsExperience : "fresher"
                                        }
                                        setisLoading(true)
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
                                    }
                                    else {
                                        if(tutexpcnt === "0") {
                                            // alert('yes education')
                                            setisLoading(true)
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
                                        } else {
                                            // alert('yes education')
                                            const updateValues = [{
                                                nRegId : regId,
                                                updateId: updateArray,
                                                deleteId: deletedArray,
                                                sExperience : ExperienceList[0]
                                            }]
                                            console.log(updateValues)
                                            // console.log(hideFields)
                                            setisLoading(true)
                                            // first time
                                            // status == 0 call InsertTutorBasicTeachExp


                                            if(Isfresher === 'Fresher') {
                                                const noExperience = {
                                                    nRegId : regId,
                                                    sIsExperience : "fresher"
                                                }
                                                setisLoading(true)
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
                                            }
                                            else {
                                                console.log("New Data",updateValues)
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
                                                        Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${DecryptData(localStorage.getItem('userData')).regid}`, {
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

                                        }
                                    }

                                    }

                                else {
                                   MySwal.fire({
                                       icon: "error", // Error icon
                                       title: "Error", // Alert Title
                                       text: "No Tutor added", // Alert Message
                                       confirmButtonText: "Okay", // Button text
                                   });
                                }
                            }

                        }}
                    >
                        {({values,errors, touched}) => {
                            return (
                                <>
                                    <Form>
                                        {/*{console.log(educationFields.length)}*/}
                                        <div className="section-title mb-3">
                                            <h4 className="rbt-title-style-3">Teaching Experience</h4>
                                            {
                                                isExperienceAlert === 1 ? <>
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

                                                                {
                                                                    commentMessage.sTeachExper_comment !== null && commentMessage.sTeachExper_comment !== '' ?

                                                                        <Alert color='danger'>
                                                                            <span className={'text-center'}
                                                                                  style={{fontSize: '14px'}}><b>Reason :</b> {commentMessage.sTeachExper_comment}</span>
                                                                        </Alert> : <></>
                                                                }
                                                            </>}
                                                        </>}
                                                    </>}
                                                </> : <></>
                                            }

                                        </div>
                                        <div className={'row'}>
                                            <div className={'col-lg-12'}>
                                                <label style={{fontSize: '16px'}}>
                                                    Are you a fresher or an experienced teacher?
                                                </label>
                                            </div>
                                            {/*<div className={'d-flex mb-3'}>*/}
                                            {/*    <div>*/}
                                            {/*        {Isfresher === 1 ? <>*/}
                                            {/*            <input id="sIs_fresher" disabled={verifySts === 2}*/}
                                            {/*                   value={'Fresher'}*/}
                                            {/*                   checked*/}
                                            {/*                   onChange={handleChange} type="radio"*/}
                                            {/*                   name="sIs_fresher"*/}
                                            {/*                   className="custom-radio"/>*/}
                                            {/*            <label htmlFor="sIs_fresher">*/}
                                            {/*                Fresher*/}
                                            {/*            </label>*/}
                                            {/*        </> : <>*/}
                                            {/*            <input id="sIs_fresher" disabled={verifySts === 2}*/}
                                            {/*                   value={'Fresher'}*/}
                                            {/*                   onChange={handleChange} type="radio"*/}
                                            {/*                   name="sIs_fresher"*/}
                                            {/*                   className="custom-radio"/>*/}
                                            {/*            <label htmlFor="sIs_fresher">*/}
                                            {/*                Fresher*/}
                                            {/*            </label>*/}
                                            {/*        </>}*/}
                                            {/*    </div>*/}
                                            {/*    <div className={'ms-3'}>*/}
                                            {/*        {Isfresher === 0 ? <>*/}
                                            {/*            <input id="sIs_fresher" disabled={verifySts === 2}*/}
                                            {/*                   value={'Experience'}*/}
                                            {/*                   checked*/}
                                            {/*                   onChange={handleChange} type="radio"*/}
                                            {/*                   name="sIs_fresher"*/}
                                            {/*                   className="custom-radio"/>*/}
                                            {/*            <label htmlFor="sIs_fresher">*/}
                                            {/*                Experience*/}
                                            {/*            </label>*/}
                                            {/*        </> : <>*/}
                                            {/*            <input id="sIs_fresher" disabled={verifySts === 2}*/}
                                            {/*                   value={'Experience'}*/}
                                            {/*                   onChange={handleChange} type="radio"*/}
                                            {/*                   name="sIs_fresher"*/}
                                            {/*                   className="custom-radio"/>*/}
                                            {/*            <label htmlFor="sIs_fresher">*/}
                                            {/*                Experience*/}
                                            {/*            </label>*/}
                                            {/*        </>}*/}
                                            {/*    </div>*/}
                                            {/*    /!*<div className={""}>*!/*/}
                                            {/*    /!*    {Isfresher === 0 ? <>*!/*/}
                                            {/*    /!*        <input id="sIs_fresher" disabled={verifySts === 2}*!/*/}
                                            {/*    /!*               value={'Experience'} checked*!/*/}
                                            {/*    /!*               onChange={handleChange} type="radio"*!/*/}
                                            {/*    /!*               name="sIs_fresher"/>*!/*/}
                                            {/*    /!*        <label htmlFor="sIs_fresher">*!/*/}
                                            {/*    /!*            Experience*!/*/}
                                            {/*    /!*        </label>*!/*/}
                                            {/*    /!*    </> : <>*!/*/}
                                            {/*    /!*        <input id="sIs_fresher" disabled={verifySts === 2}*!/*/}
                                            {/*    /!*               value={'Experience'}*!/*/}
                                            {/*    /!*               onChange={handleChange} type="radio"*!/*/}
                                            {/*    /!*               name="sIs_fresher"/>*!/*/}
                                            {/*    /!*        <label htmlFor="sIs_fresher">*!/*/}
                                            {/*    /!*            Experience*!/*/}
                                            {/*    /!*        </label>*!/*/}
                                            {/*    /!*    </>}*!/*/}

                                            {/*    /!*</div>*!/*/}

                                            {/*    <ErrorMessage name='sIs_fresher' component='div'*/}
                                            {/*                  className='field-error text-danger'/>*/}
                                            {/*    <span className="focus-border"></span>*/}
                                            {/*</div>*/}
                                            <div className="col-lg-6 mt-4">
                                                <div className="form-group d-flex">
                                                    <div>
                                                        {/* Fresher Radio Button */}
                                                        <input
                                                            disabled={verifySts === 2}  // Disable if verifySts is 2
                                                            value="Fresher"
                                                            id="yes"
                                                            type="radio"
                                                            checked={Isfresher === 'Fresher'}  // Check if 'Fresher' is selected
                                                            onChange={handleChange}
                                                            name="sIs_fresher"
                                                        />
                                                        <label htmlFor="yes">Fresher</label>
                                                    </div>

                                                    <div className="ms-3">
                                                        {/* Experience Radio Button */}
                                                        <input
                                                            disabled={verifySts === 2}  // Disable if verifySts is 2
                                                            value="Experience"
                                                            id="no"
                                                            type="radio"
                                                            checked={Isfresher === 'Experience'}  // Check if 'Experience' is selected
                                                            onChange={handleChange}
                                                            name="sIs_fresher"
                                                        />
                                                        <label htmlFor="no">Experienced</label>
                                                    </div>

                                                    <ErrorMessage name='sWeekend_batches' component='div'
                                                                  className='field-error text-danger ms-3 mt-3'/>
                                                    <span className="focus-border"></span>
                                                </div>
                                            </div>
                                            {fields ? <>
                                                {/*{verifySts !== 2 ? <>*/}
                                                    {expFields.length >= 1 ? <>
                                                        {values.sExperience.map((experience, index) => {
                                                            console.log("Length" , expFields.length)

                                                            console.log("Errors Message" , errors)
                                                            return (
                                                                <>
                                                                    <div key={experience.nTTEId}>
                                                                        <div className={'row mt-4'}>
                                                                            {
                                                                                index === 0 ? <>
                                                                                    <div className="col-lg-6">
                                                                                        <label
                                                                                            style={{fontSize: '15px'}}>
                                                                                            How many years of total
                                                                                            experience
                                                                                            in <br/> English language teaching?
                                                                                        </label>
                                                                                        <div className="form-group">
                                                                                            <input
                                                                                                readOnly={verifySts === 2}
                                                                                                onChange={(e) => handleChangeTotalExp(e, index)}
                                                                                                value={experience.nTotal_exper}
                                                                                                className={`form-control ${errors.sExperience?.[index]?.nTotal_exper && errors.sExperience?.[index]?.nTotal_exper && 'is-invalid'}`}
                                                                                                type="text"
                                                                                                placeholder="Total Experience"
                                                                                                name="nTotal_exper"
                                                                                                onKeyPress={(event) => {
                                                                                                    if (!/[0-9]/.test(event.key)) {
                                                                                                        event.preventDefault();
                                                                                                    }
                                                                                                }}
                                                                                                maxLength={3}
                                                                                            />
                                                                                            {
                                                                                                index === 0 ? <div className={'field-error text-danger'}>
                                                                                                    {errors.sExperience?.[index]?.nTotal_exper}
                                                                                                </div> : <></>
                                                                                            }
                                                                                            <span
                                                                                                className="focus-border"></span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-lg-6">
                                                                                        <label
                                                                                            style={{fontSize: '16px'}}>
                                                                                            Out of total, how many years
                                                                                            of
                                                                                            online
                                                                                            English language <br/> teaching
                                                                                            experience?
                                                                                        </label>
                                                                                        <div className="form-group">
                                                                                            <input
                                                                                                readOnly={verifySts === 2}
                                                                                                onChange={(e) => handleChangeOnlineExp(e, index)}
                                                                                                value={experience.nTotal_online_exper}
                                                                                                className={`form-control ${errors.sExperience?.[index]?.nTotal_online_exper && errors.sExperience?.[index]?.nTotal_online_exper && 'is-invalid'}`}
                                                                                                type="text"
                                                                                                name="nTotal_online_exper"
                                                                                                placeholder="Online Experience"
                                                                                                onKeyPress={(event) => {
                                                                                                    if (!/[0-9]/.test(event.key)) {
                                                                                                        event.preventDefault();
                                                                                                    }
                                                                                                }}
                                                                                                maxLength={3}
                                                                                            />
                                                                                            {
                                                                                                index === 0 ? <div className={'field-error text-danger'}>
                                                                                                    {errors.sExperience?.[index]?.nTotal_online_exper}
                                                                                                </div> : <></>
                                                                                            }
                                                                                            <span
                                                                                                className="focus-border"></span>
                                                                                        </div>
                                                                                    </div>

                                                                                    <hr className={'mt-4 mb-0'} style={{height:'3px',background:'#c38ae8'}}/>
                                                                                    <div className={'col-12 mt-3'}>
                                                                                        <label
                                                                                            style={{fontSize: '16px'}}>
                                                                                            <b>
                                                                                                Add Most Recent English Teaching Experience
                                                                                            </b>
                                                                                        </label>
                                                                                    </div>
                                                                                </> : <>
                                                                                    <hr className={'mt-4 mb-0'} style={{
                                                                                        height: '3px',
                                                                                        background: '#c38ae8'
                                                                                    }}/>
                                                                                </>
                                                                            }


                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Organization
                                                                                </label>
                                                                                <div className="form-group">
                                                                                    <input
                                                                                        readOnly={verifySts === 2}
                                                                                        onChange={(e) => handleChangeOrganization(e, index)}
                                                                                        value={experience.sOrganization}
                                                                                        className={`form-control ${errors.sExperience?.[index]?.sOrganization && errors.sExperience?.[index]?.sOrganization && 'is-invalid'}`}
                                                                                        name="sOrganization"
                                                                                        type="text"
                                                                                        placeholder="Organization"
                                                                                    />
                                                                                    {
                                                                                        index === 0 ? <div className={'field-error text-danger'}>
                                                                                            {errors.sExperience?.[index]?.sOrganization}
                                                                                        </div> : <ErrorMessage name={`sExperience.${index}.sOrganization`}
                                                                                                               component='div'
                                                                                                               className='field-error text-danger'/>
                                                                                    }
                                                                                    <span
                                                                                        className="focus-border"></span>
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
                                                                                        value={experience.sPosition}
                                                                                        className={`form-control ${errors.sExperience?.[index]?.sPosition && errors.sExperience?.[index]?.sPosition && 'is-invalid'}`}
                                                                                        name="sPosition"
                                                                                        type="text"
                                                                                        placeholder="Position"
                                                                                    />
                                                                                    {
                                                                                        index === 0 ? <div className={'field-error text-danger'}>
                                                                                            {errors.sExperience?.[index]?.sPosition}
                                                                                        </div> : <ErrorMessage name={`sExperience.${index}.sPosition`}
                                                                                                               component='div'
                                                                                                               className='field-error text-danger'/>
                                                                                    }
                                                                                    <span
                                                                                        className="focus-border"></span>
                                                                                </div>
                                                                            </div>
                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Year of work from
                                                                                </label>
                                                                                <select disabled={verifySts === 2}
                                                                                        name={"sFrom_years"}
                                                                                        value={experience.sFrom_years}
                                                                                        onChange={(e) => handleYearFromChange(e, index)}
                                                                                        className={`form-select ${errors.sExperience?.[index]?.sFrom_years && errors.sExperience?.[index]?.sFrom_years && 'is-invalid'}`}
                                                                                >
                                                                                    <option value="">Select
                                                                                    </option>
                                                                                    {options}
                                                                                </select>
                                                                                {
                                                                                    index === 0 ? <div className={'field-error text-danger'}>
                                                                                        {errors.sExperience?.[index]?.sFrom_years}
                                                                                    </div> : <ErrorMessage name={`sExperience.${index}.sFrom_years`}
                                                                                                           component='div'
                                                                                                           className='field-error text-danger'/>
                                                                                }
                                                                                <span className="focus-border"></span>
                                                                            </div>
                                                                            <div className={'col-lg-6 mt-3'}>
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Year of work to
                                                                                </label>
                                                                                <select disabled={verifySts === 2}
                                                                                        value={experience.sTo_years}
                                                                                        name={"sTo_years"}
                                                                                        onChange={(e) => handleYearToChange(e, index)}>
                                                                                    <option value="Present">Present
                                                                                    </option>
                                                                                    {options}
                                                                                </select>
                                                                            </div>
                                                                            <div className="col-lg-6 mt-3">
                                                                                <label style={{fontSize: '16px'}}>
                                                                                    Country of experience
                                                                                </label>
                                                                                {/*<div className="rbt-modern-select bg-transparent height-45">*/}
                                                                                <select disabled={verifySts === 2}
                                                                                        className="w-100"
                                                                                        name={"nCountryId"}
                                                                                        value={experience.nCountryId ? experience.nCountryId : '101'}
                                                                                        onChange={(e) => handleChangeCountry(e, index)}>
                                                                                    {country.map((item, index) => {
                                                                                        return (
                                                                                            <>
                                                                                                <option key={index}
                                                                                                        value={item.nCountryId ? item.nCountryId : '101'}>{item.sCountryname}</option>
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </select>
                                                                            </div>

                                                                            {verifySts === 2 ? <></> : <>
                                                                                <div
                                                                                    className="col-lg-12 text-end mt-2">
                                                                                    {index !== 0 ? <>
                                                                                        <button type={'button'}
                                                                                                className="btn btn-danger"
                                                                                                onClick={() => handleRemoveCertification(experience.nTTEId)}>Remove
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
                                                                    onClick={handleAddExperience}
                                                                >
                                                                    <i className="feather-plus"></i>Add English Teaching Experience
                                                                </button>
                                                            </div>
                                                        </>}
                                                    </> : ''}
                                                {/*</> : <></>}*/}

                                            </> : <>
                                                {/*    <div key={expFields.nTTEId}>*/}
                                                {/*        <div className={'row'}>*/}
                                                {/*            <div className={'col-lg-6 mt-4'}>*/}
                                                {/*                <label style={{fontSize: '15px'}}>*/}
                                                {/*                    How many years of total experience in teaching?*/}
                                                {/*                </label>*/}
                                                {/*                <div className="input-group mb-3">*/}
                                                {/*                    <input*/}
                                                {/*                        readOnly={verifySts === 2}*/}
                                                {/*                        type="number"*/}
                                                {/*                        className="form-control"*/}
                                                {/*                        placeholder="Total experience"*/}
                                                {/*                        // value={expFields.nTotal_exper}*/}
                                                {/*                        value={expFields[0].nTotal_exper}*/}
                                                {/*                        onChange={(e) => handleTotalExp(e, index)}*/}
                                                {/*                    />*/}
                                                {/*                    <div className="input-group-append">*/}
                                                {/*                        <span style={{fontSize: '16px'}}*/}
                                                {/*                              className="input-group-text h-100">years</span>*/}
                                                {/*                    </div>*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}
                                                {/*            <div className={'col-lg-6 mt-4'}>*/}
                                                {/*                <label style={{fontSize: '16px'}}>*/}
                                                {/*                    Out of total how many years of online teaching*/}
                                                {/*                    experience?*/}
                                                {/*                </label>*/}
                                                {/*                <div className="input-group">*/}
                                                {/*                    <input*/}
                                                {/*                        type="text"*/}
                                                {/*                        readOnly={verifySts === 2}*/}
                                                {/*                        value={expFields.nTotal_online_exper}*/}
                                                {/*                        className="form-control"*/}
                                                {/*                        placeholder="online experience"*/}
                                                {/*                        onChange={(e) => handleChangeOnlineExp(e)}*/}
                                                {/*                    />*/}
                                                {/*                    <div className="input-group-append">*/}
                                                {/*<span style={{fontSize: '14px'}}*/}
                                                {/*      className="input-group-text h-100">years</span>*/}
                                                {/*                    </div>*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}

                                                {/*            <div className={'col-lg-6 mt-3'}>*/}
                                                {/*                <label style={{fontSize: '16px'}}>*/}
                                                {/*                    Organization*/}
                                                {/*                </label>*/}
                                                {/*                <div className="form-group">*/}
                                                {/*                    <input*/}
                                                {/*                        readOnly={verifySts === 2}*/}
                                                {/*                        onChange={(e) => handleChangeOrganization(e)}*/}
                                                {/*                        value={expFields.sOrganization}*/}
                                                {/*                        name="organization"*/}
                                                {/*                        type="text"*/}
                                                {/*                        placeholder="Organization"*/}
                                                {/*                    />*/}
                                                {/*                    <span className="focus-border"></span>*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}
                                                {/*            <div className={'col-lg-6 mt-3'}>*/}
                                                {/*                <label style={{fontSize: '16px'}}>*/}
                                                {/*                    Position*/}
                                                {/*                </label>*/}
                                                {/*                <div className="form-group">*/}
                                                {/*                    <input*/}
                                                {/*                        readOnly={verifySts === 2}*/}
                                                {/*                        onChange={(e) => handleChangePosition(e)}*/}
                                                {/*                        value={expFields.sPosition}*/}
                                                {/*                        name="position"*/}
                                                {/*                        type="text"*/}
                                                {/*                        placeholder="Position"*/}
                                                {/*                    />*/}
                                                {/*                    <span className="focus-border"></span>*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}
                                                {/*            <div className={'col-lg-6 mt-3'}>*/}
                                                {/*                <label style={{fontSize: '16px'}}>*/}
                                                {/*                    Year of study from*/}
                                                {/*                </label>*/}
                                                {/*                <select disabled={verifySts === 2}*/}
                                                {/*                        value={expFields.sFrom_years}*/}
                                                {/*                        onChange={(e) => handleYearFromChange(e)}>*/}
                                                {/*                    {options}*/}
                                                {/*                </select>*/}
                                                {/*            </div>*/}
                                                {/*            <div className={'col-lg-6 mt-3'}>*/}
                                                {/*                <label style={{fontSize: '16px'}}>*/}
                                                {/*                    Year of study to*/}
                                                {/*                </label>*/}
                                                {/*                <select disabled={verifySts === 2}*/}
                                                {/*                        value={expFields.sTo_years}*/}
                                                {/*                        onChange={(e) => handleYearToChange(e)}>*/}
                                                {/*                    <option value="Present">Present</option>*/}
                                                {/*                    {options}*/}
                                                {/*                </select>*/}
                                                {/*            </div>*/}
                                                {/*            <div className="col-lg-6 mt-3">*/}
                                                {/*                <label style={{fontSize: '16px'}}>*/}
                                                {/*                    Country of experience*/}
                                                {/*                </label>*/}
                                                {/*                /!*<div className="rbt-modern-select bg-transparent height-45">*!/*/}
                                                {/*                <select disabled={verifySts === 2} className="w-100"*/}
                                                {/*                        value={expFields.nCountryId}*/}
                                                {/*                        onChange={(e) => handleChangeCountry(e)}>*/}
                                                {/*                    {country.map((item, index) => {*/}
                                                {/*                        return (*/}
                                                {/*                            <>*/}
                                                {/*                                <option key={index}*/}
                                                {/*                                        value={item.nCountryId}>{item.sCountryname}</option>*/}
                                                {/*                            </>*/}
                                                {/*                        )*/}
                                                {/*                    })}*/}
                                                {/*                </select>*/}
                                                {/*            </div>*/}
                                                {/*            {verifySts !== 2 ? <></> : <>*/}
                                                {/*                <div className="col-lg-12 text-end mt-2">*/}
                                                {/*                    {expFields.length > 1 ? <>*/}
                                                {/*                        <button type={'button'} className="btn btn-danger"*/}
                                                {/*                                onClick={() => handleRemoveExperience(expFields.nTTEId)}>Remove*/}
                                                {/*                        </button>*/}
                                                {/*                    </> : <></>}*/}

                                                {/*                </div>*/}
                                                {/*            </>}*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}

                                            </>}


                                            <div className="col-lg-12 mt-5">
                                                <div className="form-submit-group">
                                                    {isLoading ? <>
                                                        <button disabled={true} type="submit"
                                                                className="rbt-btn btn-md btn-gradient w-100">
                                                            <span className="btn-text">
                                                                <i className="fa fa-spinner fa-spin p-0"></i> Proceeding...</span>
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

export default Experience;
