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


const UserValidationSchema = Yup.object().shape({
    sCoverPhotoLeftPath: Yup.string()
        .required('This field is required'),
    sCoverPhotoCenterPath: Yup.string()
        .required('This field is required'),
    sCoverPhotoRightPath: Yup.string()
        .required('This field is required')
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
                alert('Please select only image file types (jpeg/jpg/png)');
            }
        } else {
            setcoverLeftimg('');
            setSImagePathLeft('');
            alert('Please upload a file less than 2MB');
        }
    };

    const onChangeCenterImage = (event) => {
        const fileext = ['image/jpeg', 'image/jpg', 'image/png'];
        // console.log(event)
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
                alert('Please select only image file types (jpeg/jpg/png)');
            }
        } else {
            setcoverCenterimg('');
            setSImagePathCenter('');
            alert('Please upload a file less than 2MB');
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
                alert('Please select only image file types (jpeg/jpg/png)');
            }
        } else {
            setSImagePathRight('')
            setcoverRightimg('');
            alert('Please upload a file less than 2MB');
        }
    };
    const [regId, setregId] = useState('')
    const [verifysts, setverifySts] = useState([])
    const [isCoverAlert, setisCoverAlert] = useState(0)
    useEffect(() => {
        if (localStorage.getItem('userData')) {
            setregId(JSON.parse(localStorage.getItem('userData')).regid)


        Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                console.log(res.data)
                if(res.data.length !== 0) {

                    if (res.data[0].sCoverPhotoLeft_verify !== null || res.data[0].sCoverPhotoCenter_verify !== null || res.data[0].sCoverPhotoRight_verify !== null){
                        setverifySts(res.data[0])
                        setisCoverAlert(1)
                    }else{
                        setverifySts([])
                    }

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
    return (
        <>
            <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                <div className="content">
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
                                        {verifysts.sCoverPhotoLeft_verify === 3 || verifysts.sCoverPhotoCenter_verify !== 3
                                        || verifysts.sCoverPhotoRight_verify === 3 ? <>
                                            <Alert color='danger'>
                                                <h6 className='alert-heading m-0 text-center'>
                                                    Cover photo verification has been disapproved by admin
                                                </h6>
                                                {verifysts.sCoverPhotoLeft_comment !== "" || verifysts.sCoverPhotoRight_comment !== ""
                                                || verifysts.sCoverPhotoCenter_comment !== "" ? <>
                                                    <p className={'text-center'}
                                                       style={{fontSize: '14px'}}>{verifysts.sCoverPhotoRight_comment}</p>
                                                </> : <></>}
                                            </Alert>
                                        </> : <></>}

                                    </>}
                                </>}
                            </> :
                                <></>}

                        {/*<h3>Your profile photo is your first impression</h3>*/}
                        <p>
                            This image will be used on the cover page of courses and batches to display on our main
                            website and you will have to upload 3 different images as left profile, center profile
                            and right profile
                        </p>

                        <h6>Guidelines for capturing an exceptional photograph</h6>
                    </div>
                    <div className={'row'}>
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
                                    Maintain genuine and engaging facial expression
                                </li>

                            </ul>
                        </div>
                        <div className={'col-lg-6 profile-sample-photo'}>

                            <ul className="rbt-list-style-1">
                                <li>
                                    <i className="feather-check"></i>
                                    Make sure your head and shoulders are covered
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

                    </div>


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
                            if(verifysts.sCoverPhotoLeft_verify === 2 && verifysts.sCoverPhotoCenter_verify === 2
                                && verifysts.sCoverPhotoRight_verify === 2)
                            {
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
                                                    if(final_verifySts.length !== 0){
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
                                                { ErrorDefaultAlert(err) }
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
                                        <div className={'row mt-5 p-0'}>
                                            <div className={'col-lg-6 '}>
                                                <div className={'cover-sample-photo border'}>
                                                    <img src={'/images/client/ML1.png'}></img>
                                                </div>
                                            </div>
                                            <div className={'col-lg-6'}>
                                                <FormGroup>
                                                    <input type="file" name="sCoverPhotoLeftPath" className={'p-0'}
                                                           onChange={onChangeLeftImage} accept="image/*" />
                                                    <small>JPG or PNG format, maximum 2 MB</small>
                                                    {sImagePathLeft ?
                                                        <img src={sImagePathLeft} height={200} width={200}/> : ''}
                                                </FormGroup>
                                                <ErrorMessage name='sCoverPhotoLeftPath' component='div'
                                                              className='field-error text-danger' />

                                            </div>
                                            <div className={'col-lg-6 mt-5'}>
                                                <div className={'cover-sample-photo border'}>
                                                    <img src={'/images/client/MC1.png'}></img>
                                                </div>
                                            </div>
                                            <div className={'col-lg-6 mt-5'}>
                                                <FormGroup>
                                                    <input type="file" name={"sCoverPhotoCenterPath"} className={'p-0'}
                                                           onChange={onChangeCenterImage} accept="image/*"/>
                                                    <small>JPG or PNG format, maximum 2 MB</small>
                                                    {sImagePathCenter ?
                                                        <img src={sImagePathCenter} height={200} width={200}/> : ''}
                                                </FormGroup>
                                                <ErrorMessage name='sCoverPhotoCenterPath' component='div'
                                                              className='field-error text-danger'/>

                                            </div>
                                            <div className={'col-lg-6 mt-5 mt-5'}>
                                                <div className={'cover-sample-photo border'}>
                                                    <img src={'/images/client/MR1.png'}></img>
                                                </div>
                                            </div>
                                            <div className={'col-lg-6 mt-5'}>
                                                <FormGroup>
                                                    <input type="file" name={"sCoverPhotoRightPath"} className={'p-0'}
                                                           onChange={onChangeRightImage} accept="image/*"/>
                                                    <small>JPG or PNG format, maximum 2 MB</small>
                                                    {sImagePathRight ? <img src={sImagePathRight} height={200} width={200}/> : ''}
                                                </FormGroup>
                                                <ErrorMessage name='sCoverPhotoRightPath' component='div'
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

export default Cover;
