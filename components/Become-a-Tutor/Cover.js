import Image from "next/image";
import React, {useEffect, useState} from "react";
import img from "@/public/images/others/thumbnail-placeholder.svg";
import img1 from '../../public/images/client/pexels-daniel-xavier-1239288.jpg'
import img2 from '../../public/images/client/pexels-justin-shaifer-1222271.jpg'
import img3 from '../../public/images/client/blank-profile-picture-973460_1280.png'
import Link from "next/link";
import * as Yup from 'yup'
import {Formik, ErrorMessage, Form} from 'formik'
import Axios from 'axios'
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {useRouter} from "next/router";
import {Alert, FormGroup} from "reactstrap";
import {API_URL, API_KEY} from "../../constants/constant";
import "venobox/dist/venobox.min.css";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal)


const UserValidationSchema = Yup.object().shape({
    sCoverPhotoLeftPath: Yup.string()
        .required('Image-1 is required'),
    sCoverPhotoCenterPath: Yup.string()
        .required('Image-2 is required'),
    sCoverPhotoRightPath: Yup.string()
        .required('Image-3 is required')
})
const Cover = () => {
    const REACT_APP = API_URL
    const router = useRouter();
    const [file, setFile] = useState();
    const [file2, setFile2] = useState();
    const [file3, setFile3] = useState();

    const [coverLeftimg, setcoverLeftimg] = useState();
    const [sImagePathLeft, setSImagePathLeft] = useState('');

    const [coverCenterimg, setcoverCenterimg] = useState();
    const [sImagePathCenter, setSImagePathCenter] = useState('');

    const [coverRightimg, setcoverRightimg] = useState();
    const [sImagePathRight, setSImagePathRight] = useState('');
    const [isLoading, setisLoading] = useState(false);

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

    const onChangeLeftImage = (event) => {
        const fileext = ['image/jpeg', 'image/jpg', 'image/png'];
        // console.log(event)
        if (event.target.files[0].size < 2000000) {
            if (fileext.includes(event.target.files[0].type)) {
                // console.log(event.target.files[0])
                getBase64(event.target.files[0])
                    .then((result) => {
                        setSImagePathLeft(result);
                    })
                    .catch((err) => {
                        console.error('Error converting image to base64:', err);
                    });

                setcoverLeftimg(URL.createObjectURL(event.target.files[0]));
            } else {
                setcoverLeftimg('');
                setSImagePathLeft('');
                MySwal.fire({
                    icon: "error",
                    title: "Invalid File Type",
                    text: "Please select only image file types (jpeg/jpg/png)",
                    confirmButtonText: "Okay",
                });
            }
        } else {
            setcoverLeftimg('');
            setSImagePathLeft('');
            MySwal.fire({
                icon: "error",
                title: "File Too Large",
                text: "Please upload a file less than 2MB",
                confirmButtonText: "Okay",
            });
        }
    };

    const onChangeCenterImage = (event) => {
        const fileext = ['image/jpeg', 'image/jpg', 'image/png'];
        // console.log(event)
        if (event.target.files && event.target.files[0]) {
            if (event.target.files[0].size < 2000000) {
                if (fileext.includes(event.target.files[0].type)) {
                    // console.log(event.target.files[0])
                    getBase64(event.target.files[0])
                        .then((result) => {
                            // console.log(result)
                            // const initialVaue = result
                            // setsProfilePhotoPath(result)
                            setSImagePathCenter(result);
                        })
                        .catch((err) => {
                            console.error('Error converting image to base64:', err);
                        });

                    setcoverCenterimg(URL.createObjectURL(event.target.files[0]));
                } else {
                    setcoverCenterimg('');
                    setSImagePathCenter('');
                    MySwal.fire({
                        icon: "error",
                        title: "Invalid File Type",
                        text: "Please select only image file types (jpeg/jpg/png)",
                        confirmButtonText: "Okay",
                    });
                }
            } else {
                setcoverCenterimg('');
                setSImagePathCenter('');
                MySwal.fire({
                    icon: "error",
                    title: "File Too Large",
                    text: "Please upload a file less than 2MB",
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    const onChangeRightImage = (event) => {
        const fileext = ['image/jpeg', 'image/jpg', 'image/png'];
        // console.log(event)
        if (event.target.files[0].size < 2000000) {
            if (fileext.includes(event.target.files[0].type)) {
                // console.log(event.target.files[0])
                getBase64(event.target.files[0])
                    .then((result) => {
                        setSImagePathRight(result);
                    })
                    .catch((err) => {
                        console.error('Error converting image to base64:', err);
                    });

                setcoverRightimg(URL.createObjectURL(event.target.files[0]));
            } else {
                setSImagePathRight('')
                setcoverRightimg('');
                MySwal.fire({
                    icon: "error",
                    title: "Invalid File Type",
                    text: "Please select only image file types (jpeg/jpg/png)",
                    confirmButtonText: "Okay",
                });
            }
        } else {
            setSImagePathRight('')
            setcoverRightimg('');
            MySwal.fire({
                icon: "error",
                title: "File Too Large",
                text: "Please upload a file less than 2MB",
                confirmButtonText: "Okay",
            });
        }
    };
    const [regId, setregId] = useState('')
    const [verifysts, setverifySts] = useState([])
    const [isCoverAlert, setisCoverAlert] = useState(0)
    useEffect(() => {
        if (localStorage.getItem('userData')) {
            setregId(JSON.parse(localStorage.getItem('userData')).regid)

            console.log("verifysts",verifysts)

        Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                if(res.data.length !== 0) {

                    if (res.data[0].sCoverPhotoLeft_verify !== null || res.data[0].sCoverPhotoCenter_verify !== null || res.data[0].sCoverPhotoRight_verify !== null){
                        setverifySts(res.data[0])
                        setisCoverAlert(1)
                    }else{
                        setverifySts({
                            sCoverPhotoLeft_verify: null,
                            sCoverPhotoCenter_verify: null,
                            sCoverPhotoRight_verify: null,
                        });
                    }

                }else{
                    setverifySts({
                        sCoverPhotoLeft_verify: null,
                        sCoverPhotoCenter_verify: null,
                        sCoverPhotoRight_verify: null,
                    });
                }
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

                    // console.log(res.data)
                    setSImagePathRight(res.data[0]['sCoverPhotoRightPath'])
                    setSImagePathLeft(res.data[0]['sCoverPhotoLeftPath'])
                    setSImagePathCenter(res.data[0]['sCoverPhotoCenterPath'])
                    // if(res.data[0].bIsReview !== 0) {
                    //     router.push('/become-a-tutor/Review')
                    // } else {
                    //
                    // }
                }

                // setTutorDetail(res.data[0])

            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
        }
    }, []);
    // Image Popup
    const initializeVenobox = () => {
        import("venobox/dist/venobox.min.js").then((venobox) => {
            new venobox.default({
                selector: ".child-gallery-single",
                numeration: false, // Disable numeration for single image
                infinigall: false,
                spinner: "rotating-plane",
            });
        });
    };
    useEffect(() => {
        if (sImagePathLeft || sImagePathCenter || sImagePathRight) {
            initializeVenobox();
        }
    }, [sImagePathLeft,sImagePathCenter,sImagePathRight]);

    // Close
    return (
        <>
            <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                <div className="content">
                    {
                        isCoverAlert !== 1 && verifysts.sCoverPhotoLeft_verify !== null && verifysts.sCoverPhotoCenter_verify !== null && verifysts.sCoverPhotoRight_verify !== null ? <>
                        <div className="section-title">
                            <Skeleton height={20} width={150} className='rbt-title-style-3 mb-0'/>
                        </div>
                        <div className={'mb-3'}>
                            <Skeleton height={1} width={'100%'} className='my-4'/>
                        </div>
                        <Skeleton height={40} className="w-100 mb-2"/>
                        <div>
                            <Skeleton height={30} width="80%" className="mb-4"/>
                            <Skeleton height={20} width="60%"/>
                        </div>
                                <div className={'row row--15 mt-4'}>
                                    <div className={'col-lg-6 mb-3'}>
                                        <ul className="rbt-list-style-1">
                                            {[...Array(6)].map((_, index) => (
                                                <li key={index} className="d-block align-items-center mb-2">
                                                    <Skeleton height={15} width={index === 2 || index === 3 || index === 4? "100%" : "75%"}/> {/* List text */}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className={'col-lg-6 mb-3'}>
                                        <div className={'row p-0'}>
                                            <div className="col-6 col-sm-4 col-lg-4">
                                                <div className="profile-sample-photo">
                                                    <Skeleton height={110} width="100%"/>
                                                    <Skeleton height={20} width="100%" className={'mt-3'}/>
                                                </div>
                                            </div>
                                            <div className="col-6 col-sm-4 col-lg-4">
                                                <div className="profile-sample-photo">
                                                    <Skeleton height={110} width="100%"/>
                                                    <Skeleton height={20} width="100%" className={'mt-3'}/>
                                                </div>
                                            </div>
                                            <div className="col-6 col-sm-4 col-lg-4">
                                                <div className="profile-sample-photo">
                                                    <Skeleton height={110} width="100%"/>
                                                    <Skeleton height={20} width="100%" className={'mt-3'}/>
                                                </div>
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

                                <div className="section-title">
                                    <h4 className="rbt-title-style-3">Cover Photo</h4>
                                    {
                                        isCoverAlert === 1 ? <>
                                                {verifysts.sCoverPhotoLeft_verify === 2 && verifysts.sCoverPhotoCenter_verify === 2
                                                && verifysts.sCoverPhotoRight_verify === 2 ? <>
                                                    <Alert color='success'>
                                                        <h6 className='alert-heading m-0 text-center'>
                                                            Cover photo verification has been approved by admin
                                                        </h6>
                                                    </Alert>
                                                </> : <>
                                                    {verifysts.sCoverPhotoLeft_verify === 1 && verifysts.sCoverPhotoCenter_verify === 1
                                                    && verifysts.sCoverPhotoRight_verify === 1 ? <>
                                                        <Alert color='warning'>
                                                            <h6 className='alert-heading m-0 text-center'>
                                                                Cover photo verification is in pending state
                                                            </h6>
                                                        </Alert>
                                                    </> : <>
                                                        {verifysts.sCoverPhotoLeft_verify === 3 || verifysts.sCoverPhotoCenter_verify === 3
                                                        || verifysts.sCoverPhotoRight_verify === 3 ? <>
                                                            <Alert color='danger'>
                                                                <h6 className='alert-heading m-0 text-center'>
                                                                    Cover photo verification has been disapproved by admin
                                                                </h6>
                                                            </Alert>
                                                            {/*{verifysts.sCoverPhotoLeft_comment !== "" || verifysts.sCoverPhotoRight_comment !== ""*/}
                                                            {/*|| verifysts.sCoverPhotoCenter_comment !== "" ? <>*/}
                                                            {/*    <p className={'text-center'}*/}
                                                            {/*       style={{fontSize: '14px'}}>{verifysts.sCoverPhotoRight_comment}</p>*/}
                                                            {/*</> : <></>}*/}

                                                            {
                                                                verifysts.sCoverPhotoLeft_comment !== null && verifysts.sCoverPhotoLeft_comment !== "" && verifysts.sCoverPhotoLeft_verify === 3 ? <>
                                                                    <Alert color='danger'><span className={'text-center'}
                                                                                                style={{fontSize: '14px'}}><b>Image-1 :</b> {verifysts.sCoverPhotoLeft_comment}</span>
                                                                    </Alert>
                                                                </> : <></>

                                                            }
                                                            {
                                                                verifysts.sCoverPhotoCenter_comment !== null && verifysts.sCoverPhotoCenter_comment !== "" && verifysts.sCoverPhotoCenter_verify === 3 ? <>
                                                                    <Alert color='danger'><span className={'text-center'}
                                                                                                style={{fontSize: '14px'}}><b>Image-2 :</b> {verifysts.sCoverPhotoCenter_comment}</span>
                                                                    </Alert>
                                                                </> : <></>

                                                            }
                                                            {
                                                                verifysts.sCoverPhotoRight_comment !== null && verifysts.sCoverPhotoRight_comment !== "" && verifysts.sCoverPhotoRight_verify === 3 ? <>
                                                                    <Alert color='danger'><span className={'text-center'}
                                                                                                style={{fontSize: '14px'}}><b>Image-3 :</b> {verifysts.sCoverPhotoRight_comment}</span>
                                                                    </Alert>
                                                                </> : <></>

                                                            }
                                                        </> : <></>}

                                                    </>}
                                                </>}
                                            </> :
                                            <></>}

                                    {/*<h3>Your profile photo is your first impression</h3>*/}
                                    <p>
                                        This image will be used on the cover page of courses and batches to display on our
                                        main
                                        website and you will have to upload 3 different images as left profile, center
                                        profile
                                        and right profile
                                    </p>

                                    <h6>Guidelines for capturing an exceptional photograph</h6>
                                </div>
                                <div className={'row'}>
                                    <Formik
                                        validationSchema={UserValidationSchema}
                                        initialValues={{
                                            nRegId: regId,
                                            sCoverPhotoLeftPath: sImagePathLeft,
                                            sCoverPhotoCenterPath: sImagePathCenter,
                                            sCoverPhotoRightPath: sImagePathRight
                                        }}
                                        enableReinitialize={true}
                                        onSubmit={async (values, {resetForm}) => {
                                            // console.log(values)
                                            if (verifysts.sCoverPhotoLeft_verify === 2 && verifysts.sCoverPhotoCenter_verify === 2
                                                && verifysts.sCoverPhotoRight_verify === 2) {
                                                router.push('/become-a-tutor/education')
                                            } else {

                                                await Axios.put(`${API_URL}/api/TutorBasics/UpdateTutorProfile`, values, {
                                                    headers: {
                                                        ApiKey: `${API_KEY}`
                                                    }
                                                }).then(res => {
                                                    // console.log(values)
                                                    // console.log(res.data)
                                                    setisLoading(true)
                                                    const retData = JSON.parse(res.data)
                                                    resetForm({})
                                                    if (retData.success === '1') {

                                                        Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                                                            headers: {
                                                                ApiKey: `${API_KEY}`
                                                            }
                                                        })
                                                            .then(res => {
                                                                // console.log(res.data)
                                                                if (res.data.length !== 0) {
                                                                    const array2 = res.data.map((item) => {
                                                                        return item.verify_list
                                                                    })
                                                                    // console.log(array2)
                                                                    let array = array2[0].split(',').map(Number);
                                                                    const url1 = window.location.href.split('/')
                                                                    // console.log(url1[4])
                                                                    // console.log('---------------', array);
                                                                    let array1 = ['basics', 'profile-photo', 'cover-photo', 'cover-photo', 'cover-photo', 'education', 'certification', 'teaching-experience', 'description', 'intro-video', 'interest', 'time-availability'];
                                                                    const filter = array1.findIndex((item) => item === url1[4])
                                                                    // console.log(filter)
                                                                    let url = array1
                                                                    let verify_string = array;
                                                                    const final_verifySts = verify_string.slice(filter)
                                                                    // console.log('-----------------', final_verifySts)
                                                                    if (final_verifySts.length !== 0) {
                                                                        // Check the 0th position in array2 and get the corresponding string from array1
                                                                        let positionToCheck = verify_string[0];
                                                                        let conditionString = url[positionToCheck + 1];

                                                                        console.log(conditionString)
                                                                        // Check the position of the first 3 numbers in array2
                                                                        let positionOfThree = final_verifySts.findIndex(num => num === 3);

                                                                        // Get the string at that position from array1
                                                                        let stringForUrl = url[positionOfThree];

                                                                        // console.log('stringForUrl', stringForUrl)
                                                                        // router.push(`/become-a-tutor/${stringForUrl}`)
                                                                        router.push(`/become-a-tutor/education`)
                                                                    } else {
                                                                        router.push('/become-a-tutor/cover-photo')
                                                                    }
                                                                }
                                                            })
                                                            .catch(err => {
                                                                {
                                                                    ErrorDefaultAlert(err)
                                                                }
                                                            })
                                                        // Axios.get(`${REACT_APP.API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                                                        //     headers: {
                                                        //         ApiKey: `${REACT_APP.API_KEY}`
                                                        //     }
                                                        // })
                                                        //     .then(res => {
                                                        //         // console.log(res.data)
                                                        //         if(res.data.length !== 0) {
                                                        //             const array2 = res.data.map((item) => {
                                                        //                 return item.verify_list
                                                        //             })
                                                        //             // console.log(array2)
                                                        //             let array = array2[0].split(',').map(Number);
                                                        //             // console.log('---------------', array);
                                                        //             let array1 = ['basics', 'profile-photo', 'cover-photo', 'cover-photo', 'cover-photo', 'education', 'certification', 'teaching-experience', 'description', 'intro-video', 'interest', 'time-availability'];
                                                        //
                                                        //             let url = array1
                                                        //             let verify_string = array;
                                                        //             if(verify_string.length !== 0){
                                                        //                 // Check the 0th position in array2 and get the corresponding string from array1
                                                        //                 let positionToCheck = verify_string[0];
                                                        //                 // let conditionString = url[positionToCheck - 1];
                                                        //
                                                        //                 // Check the position of the first 3 numbers in array2
                                                        //                 let positionOfThree = verify_string.findIndex(num => num === 3);
                                                        //
                                                        //                 // Get the string at that position from array1
                                                        //                 let stringForUrl = url[positionOfThree];
                                                        //
                                                        //                 console.log('stringForUrl', stringForUrl)
                                                        //                 router.push(`/become-a-tutor/${stringForUrl}`)
                                                        //             } else {
                                                        //                 router.push('/become-a-tutor/education')
                                                        //             }
                                                        //
                                                        //         }
                                                        //     })
                                                        //     .catch(err => {
                                                        //         { ErrorDefaultAlert(err) }
                                                        //     })

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
                                                        <div className={'row p-0'}>
                                                            <div className={'col-lg-6 profile-sample-photo'}>
                                                                <ul className="rbt-list-style-1">
                                                                    <li>
                                                                        <i className="feather-check"></i>
                                                                        Your photo must be half length
                                                                    </li>
                                                                    <li>
                                                                        <i className="feather-check"></i>
                                                                        Look straight at camera and smile
                                                                    </li>
                                                                    <li>
                                                                        <i className="feather-check"></i>
                                                                        Maintain genuine and engaging facial
                                                                        expression
                                                                    </li>
                                                                    <li>
                                                                        <i className="feather-check"></i>
                                                                        Make sure your head and shoulders are
                                                                        covered
                                                                    </li>
                                                                    <li>
                                                                        <i className="feather-check"></i>
                                                                        Simple, uncluttered and white background
                                                                    </li>
                                                                    <li>
                                                                        <i className="feather-check"></i>
                                                                        Use natural lighting
                                                                    </li>

                                                                </ul>
                                                            </div>
                                                            <div className={'col-lg-6 profile-sample-photo'}>
                                                                <div className="row">
                                                                    <div
                                                                        className={'col-6 col-sm-4 col-lg-4 firstImage'}>
                                                                    <span
                                                                        className={'d-block text-center mb-2'}>
                                                                        Image-1
                                                                        {
                                                                            verifysts.sCoverPhotoLeft_verify !== null ? verifysts.sCoverPhotoLeft_verify === 1 ?
                                                                                <i className="feather-clock text-warning font-weight-700 ms-2"/> : verifysts.sCoverPhotoLeft_verify === 2 ?
                                                                                    <i className="feather-check-circle text-success font-weight-700 ms-2"/> :
                                                                                    <i className="feather-x-circle text-danger font-weight-700 ms-2"/> : <></>
                                                                        }

                                                                    </span>
                                                                        <div
                                                                            className={'profile-sample-photo border'}>
                                                                            <img
                                                                                src={'/images/client/ML1.png'}></img>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={'col-6 col-sm-4 col-lg-4 secoundImage'}>
                                                                    <span
                                                                        className={'d-block text-center mb-2'}>Image-2
                                                                        {
                                                                            verifysts.sCoverPhotoCenter_verify !== null ? verifysts.sCoverPhotoCenter_verify === 1 ?
                                                                                <i className="feather-clock text-warning font-weight-700 ms-2"/> : verifysts.sCoverPhotoCenter_verify === 2 ?
                                                                                    <i className="feather-check-circle text-success font-weight-700 ms-2"/> :
                                                                                    <i className="feather-x-circle text-danger font-weight-700 ms-2"/> : <></>
                                                                        }
                                                                    </span>
                                                                        <div
                                                                            className={'profile-sample-photo border'}>
                                                                            <img
                                                                                src={'/images/client/MC1.png'}></img>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={'col-6 col-sm-4 col-lg-4 thirdImage'}>
                                                                    <span
                                                                        className={'d-block text-center mb-2'}>Image-3
                                                                        {
                                                                            verifysts.sCoverPhotoRight_verify !== null ? verifysts.sCoverPhotoRight_verify === 1 ?
                                                                                <i className="feather-clock text-warning font-weight-700 ms-2"/> : verifysts.sCoverPhotoRight_verify === 2 ?
                                                                                    <i className="feather-check-circle text-success font-weight-700 ms-2"/> :
                                                                                    <i className="feather-x-circle text-danger font-weight-700 ms-2"/> : <></>
                                                                        }
                                                                    </span>
                                                                        <div
                                                                            className={'profile-sample-photo border'}>
                                                                            <img
                                                                                src={'/images/client/MR1.png'}></img>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={'col-6 col-sm-4 col-lg-4 mt-3 firstImage'}>
                                                                        <FormGroup>
                                                                            {
                                                                                verifysts ?
                                                                                    verifysts.sCoverPhotoLeft_verify !== 2 ? <>
                                                                                        <input type="file"
                                                                                               id={'sFirstCover'}
                                                                                               name="sCoverPhotoLeftPath"
                                                                                               className={'p-0'}
                                                                                               onChange={onChangeLeftImage}
                                                                                               accept="image/*"/>
                                                                                        <label htmlFor="sFirstCover"
                                                                                               className="d-block btn btn-primary">
                                                                                            Choose File
                                                                                        </label>
                                                                                        <small>JPG or PNG format,
                                                                                            maximum 2
                                                                                            MB</small>
                                                                                    </> : null : null
                                                                            }

                                                                            {/*{sImagePathLeft ?*/}
                                                                            {/*    <img src={sImagePathLeft} height={200}*/}
                                                                            {/*         width={200}*/}
                                                                            {/*         className={'coverImage ms-0'}/> : ''}*/}
                                                                            {
                                                                                sImagePathLeft ?
                                                                                    <a
                                                                                        className="child-gallery-single col-lg-2 col-md-4 col-sm-6 col-6"
                                                                                        href={sImagePathLeft} // This is required by Venobox
                                                                                        data-gall="gallery01"
                                                                                        onClick={(e) => e.preventDefault()} // Prevents default navigation
                                                                                    >
                                                                                        <div
                                                                                            className="rbt-gallery">
                                                                                            <Image
                                                                                                className="coverImage ms-0"
                                                                                                src={sImagePathLeft}
                                                                                                width={200}
                                                                                                height={200}
                                                                                                alt="Gallery Images"
                                                                                            />
                                                                                        </div>
                                                                                    </a>
                                                                                    : ''
                                                                            }
                                                                        </FormGroup>
                                                                        <ErrorMessage name='sCoverPhotoLeftPath'
                                                                                      component='div'
                                                                                      className='field-error text-danger'/>

                                                                    </div>
                                                                    <div
                                                                        className={'col-6 col-sm-4 col-lg-4 mt-3 secoundImage'}>
                                                                        <FormGroup>
                                                                            {
                                                                                verifysts ?
                                                                                    verifysts.sCoverPhotoCenter_verify !== 2 ? <>
                                                                                        <input type="file"
                                                                                               id={'sSecoundCover'}
                                                                                               name={"sCoverPhotoCenterPath"}
                                                                                               className={'p-0'}
                                                                                               onChange={onChangeCenterImage}
                                                                                               accept="image/*"/>
                                                                                        <label htmlFor="sSecoundCover"
                                                                                               className="d-block btn btn-primary">
                                                                                            Choose File
                                                                                        </label>
                                                                                        <small>JPG or PNG format,
                                                                                            maximum 2
                                                                                            MB</small>
                                                                                    </> : null : null
                                                                            }

                                                                            {/*{sImagePathCenter ?*/}
                                                                            {/*    <img src={sImagePathCenter} height={200}*/}
                                                                            {/*         width={200}*/}
                                                                            {/*         className={'coverImage ms-0'}/> : ''}*/}

                                                                            {
                                                                                sImagePathCenter ?
                                                                                    <a
                                                                                        className="child-gallery-single col-lg-2 col-md-4 col-sm-6 col-6"
                                                                                        href={sImagePathCenter} // This is required by Venobox
                                                                                        data-gall="gallery01"
                                                                                        onClick={(e) => e.preventDefault()} // Prevents default navigation
                                                                                    >
                                                                                        <div
                                                                                            className="rbt-gallery">
                                                                                            <Image
                                                                                                className="coverImage ms-0"
                                                                                                src={sImagePathCenter}
                                                                                                width={200}
                                                                                                height={200}
                                                                                                alt="Gallery Images"
                                                                                            />
                                                                                        </div>
                                                                                    </a>
                                                                                    : ''
                                                                            }
                                                                        </FormGroup>
                                                                        <ErrorMessage name='sCoverPhotoCenterPath'
                                                                                      component='div'
                                                                                      className='field-error text-danger'/>

                                                                    </div>
                                                                    <div
                                                                        className={'col-6 col-sm-4 col-lg-4 mt-3 thirdImage'}>
                                                                        <FormGroup>
                                                                            {
                                                                                verifysts ?
                                                                                    verifysts.sCoverPhotoRight_verify !== 2 ? <>
                                                                                        <input type="file"
                                                                                               id={'sThirdCover'}
                                                                                               name={"sCoverPhotoRightPath"}
                                                                                               className={'p-0'}
                                                                                               onChange={onChangeRightImage}
                                                                                               accept="image/*"/>
                                                                                        <label htmlFor="sThirdCover"
                                                                                               className="d-block btn btn-primary">
                                                                                            Choose File
                                                                                        </label>
                                                                                        <small>JPG or PNG format,
                                                                                            maximum 2
                                                                                            MB</small>
                                                                                    </> : null : null
                                                                            }
                                                                            {/*{sImagePathRight ?*/}
                                                                            {/*    <img src={sImagePathRight} height={200}*/}
                                                                            {/*         width={200}*/}
                                                                            {/*         className={'coverImage ms-0'}/> : ''}*/}
                                                                            {
                                                                                sImagePathRight ?
                                                                                    <a
                                                                                        className="child-gallery-single col-lg-2 col-md-4 col-sm-6 col-6"
                                                                                        href={sImagePathRight} // This is required by Venobox
                                                                                        data-gall="gallery01"
                                                                                        onClick={(e) => e.preventDefault()} // Prevents default navigation
                                                                                    >
                                                                                        <div
                                                                                            className="rbt-gallery">
                                                                                            <Image
                                                                                                className="coverImage ms-0"
                                                                                                src={sImagePathRight}
                                                                                                width={200}
                                                                                                height={200}
                                                                                                alt="Gallery Images"
                                                                                            />
                                                                                        </div>
                                                                                    </a>
                                                                                    : ''
                                                                            }
                                                                        </FormGroup>
                                                                        <ErrorMessage name='sCoverPhotoRightPath'
                                                                                      component='div'
                                                                                      className='field-error text-danger'/>

                                                                    </div>
                                                                </div>
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
                            </>}
                </div>
            </div>
        </>
    );
};

export default Cover;
