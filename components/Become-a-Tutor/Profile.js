import Image from "next/image";
import React, {useEffect, useState} from "react";
import img from "@/public/images/others/thumbnail-placeholder.svg";
import Link from "next/link";
import * as Yup from 'yup'
import {Formik, ErrorMessage, Form} from 'formik'
import Axios from 'axios'
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {useRouter} from "next/router";
import {Alert, FormGroup} from "reactstrap";
import {API_URL, API_KEY} from "../../constants/constant";
import client1 from '../../public/images/client/img1.PNG'
import client2 from '../../public/images/client/img2.PNG'
import client3 from '../../public/images/client/img3.PNG'
import "venobox/dist/venobox.min.css";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const UserValidationSchema = Yup.object().shape({
  sProfilePhotoPath: Yup.string()
      .required('Profile Photo is required')
})
const Profile = () => {
    const REACT_APP = API_URL
    const [Profileimg, setProfileimg] = useState();
    const [sImagePath, setSImagePath] = useState('');
    const [isLoading, setisLoading] = useState(false);

    // const [sProfilePhotoPath, setsProfilePhotoPath] = useState('')
    const router = useRouter();
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

    const onChangeImage = (event) => {
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
                        setSImagePath(result);
                    })
                    .catch((err) => {
                        console.error('Error converting image to base64:', err);
                    });

                setProfileimg(URL.createObjectURL(event.target.files[0]));
            } else {
                setProfileimg('');
                setSImagePath('');
                alert('Please select only image file types (jpeg/jpg/png)');
            }
        } else {
            alert('Please upload a file less than 2MB');
            setSImagePath('');
        }
    };

    const [regId, setregId] = useState('')
    const [verifysts, setverifySts] = useState([])
    const [isProfileAlert, setisProfileAlert] = useState(0)
    useEffect(() => {

        // console.log(DecryptData(JSON.parse(localStorage.getItem('userData')).accessToken))


        if (localStorage.getItem('userData')) {
            setregId(JSON.parse(localStorage.getItem('userData')).regid)

            Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    // console.log(res.data)
                    if(res.data.length !== 0) {
                        if (res.data[0].sProfilePhoto_verify !== null){
                            setverifySts(res.data[0])
                            setisProfileAlert(1)
                        }else{
                            setverifySts({ sProfilePhoto_verify : 0 })
                        }

                    }else{
                        setverifySts({ sProfilePhoto_verify : 0 })
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
                // console.log(res.data)
                if (res.data.length !== 0) {
                    setSImagePath(res.data[0]['sProfilePhotoPath'])
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
        if (sImagePath) {
            initializeVenobox();
        }
    }, [sImagePath]);

    // Close

    return (
        <>
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
            <div className="content">
                {
                    isProfileAlert !== 1 && verifysts.sProfilePhoto_verify !== 0 && verifysts.sProfilePhoto_verify !== ''  ? <>
                    <div className="section-title">
                        <Skeleton height={20} width={150} className='rbt-title-style-3 mb-0'/>
                    </div>
                    <div className={'mb-3'}>
                        <Skeleton height={1} width={'100%'} className='my-4'/>
                    </div>
                    <Skeleton height={40} className="w-100 mb-2"/>
                    <div>
                        <Skeleton height={30} width="60%" className="mb-3"/>
                        <Skeleton height={20} width="80%"/>
                    </div>
                            <div className={'row row--15 mt-5'}>
                                <div className={'col-lg-6 mb-3'}>
                                    <Skeleton height={40} width="100%" className="mb-2"/> {/* File input */}
                                    <Skeleton height={15} width="50%" className="mb-3"/> {/* Small text */}
                                    <Skeleton height={150} width={150} className="rounded"/> {/* Profile image */}
                                </div>

                                <div className={'col-lg-6 mb-3'}>
                                    <Skeleton height={20} width="60%" className="mb-3"/>

                                    <div className="d-flex">
                                        <Skeleton height={150} width={150} className="me-2 rounded"/>
                                        <Skeleton height={150} width={150} className="me-2 rounded"/>
                                        <Skeleton height={150} width={150} className="rounded"/>
                                    </div>

                                    <ul className="rbt-list-style-1 mt-5">
                                        {[...Array(5)].map((_, index) => (
                                            <li key={index} className="d-block align-items-center mb-2">
                                                <Skeleton height={15} width="100%"/> {/* List text */}
                                            </li>
                                        ))}
                                    </ul>
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
                                <h4 className="rbt-title-style-3">Profile Photo</h4>
                                {isProfileAlert === 1 ? <>
                                {verifysts ? <>
                                    {verifysts.sProfilePhoto_verify === 2 ? <>
                                        <Alert color='success'>
                                            <h6 className='alert-heading m-0 text-center'>
                                                Profile photo verification has been approved by admin
                                            </h6>
                                        </Alert>

                                    </> : <>
                                        {verifysts.sProfilePhoto_verify === 1 ? <>
                                            <Alert color='warning'>
                                                <h6 className='alert-heading m-0 text-center'>
                                                    Profile photo verification is in pending state
                                                </h6>
                                            </Alert>

                                        </> : <>
                                            {verifysts.sProfilePhoto_verify === null || verifysts.sProfilePhoto_verify === 0 ? <>

                                            </> : <>
                                                <Alert color='danger'>
                                                    <h6 className='alert-heading m-0 text-center'>
                                                        Profile photo verification has been disapproved by admin
                                                    </h6>
                                                </Alert>
                                            </>}
                                        </>}
                                    </>}
                                </> : <></>}
                            </> : <></>}


                            <h3>Your profile photo is your first impression</h3>
                            <p>Having a friendly and professional photo enriches your profile</p>
                        </div>

                        <Formik
                            validationSchema={UserValidationSchema}
                            initialValues={{
                                nRegId: regId,
                                sProfilePhotoPath: sImagePath
                            }}
                            enableReinitialize={true}
                            onSubmit={async (values, {resetForm}) => {
                                // console.log(values)
                                if (verifysts.sProfilePhoto_verify === 2) {
                                    router.push('/become-a-tutor/cover-photo')
                                } else {
                                    setisLoading(true)
                                    await Axios.put(`${API_URL}/api/TutorBasics/UpdateTutorProfile`, values, {
                                        headers: {
                                            ApiKey: `${API_KEY}`
                                        }
                                    }).then(res => {
                                        // console.log(values)
                                        // console.log(res.data)

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
                                                        console.log(array2)
                                                        let array = array2[0].split(',').map(Number);
                                                        const url1 = window.location.href.split('/')
                                                        // console.log(url1[4])
                                                        // console.log('---------------', array);
                                                        let array1 = ['basics', 'profile-photo', 'cover-photo', 'cover-photo', 'cover-photo', 'education', 'certification', 'teaching-experience', 'description', 'intro-video', 'interest', 'time-availability'];
                                                        const filter = array1.findIndex((item) => item === url1[4])
                                                        console.log(filter + 1)
                                                        let url = array1
                                                        let verify_string = array;
                                                        const final_verifySts = verify_string.slice(filter + 1)
                                                        // console.log('-----------------', final_verifySts)
                                                        if (final_verifySts.length !== 0) {
                                                            // Check the 0th position in array2 and get the corresponding string from array1
                                                            let positionToCheck = verify_string[0];
                                                            let conditionString = url[positionToCheck + 1];

                                                            // Check the position of the first 3 numbers in array2
                                                            let positionOfThree = final_verifySts.findIndex(num => num === 3);
                                                            // console.log(positionOfThree)
                                                            // Get the string at that position from array1
                                                            let stringForUrl = url[positionOfThree];
                                                            console.log('stringForUrl', stringForUrl)
                                                            // router.push(`/become-a-tutor/${stringForUrl}`)
                                                            router.push(`/become-a-tutor/cover-photo`)
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
                                                <div className={'col-lg-6'}>
                                                    <FormGroup>
                                                        <input type="file" id={'sProfilePhoto'} className={'p-0'} name='sProfilePhotoPath'
                                                               onChange={onChangeImage} accept="image/*"/>
                                                        <label htmlFor="sProfilePhoto"
                                                               className="btn btn-primary">
                                                            Choose File
                                                        </label>
                                                        <small className={'d-block'}>JPG or PNG format, maximum 2 MB</small>
                                                        {/*{file && <img src={file} alt="Selected" style={{ maxWidth: '100px', maxHeight: '100px' }} />}*/}

                                                        {/*{(this.state.batchimagefile) ? <img className='w-100 h-200' src={this.state.batchimagefile} /> : <img*/}
                                                        {/*    className='w-100 h-180 bg-light-primary p-1' src={noimg} alt='no-img' />}*/}
                                                        {sImagePath ?

                                                            // <img src={sImagePath}  className='child-gallery-single profilePhoto d-block'/>
                                                            <a
                                                                className="child-gallery-single col-lg-2 col-md-4 col-sm-6 col-6"
                                                                href={sImagePath} // This is required by Venobox
                                                                data-gall="gallery01"
                                                                onClick={(e) => e.preventDefault()} // Prevents default navigation
                                                            >
                                                                <div className="rbt-gallery">
                                                                    <Image
                                                                        className="profilePhoto d-block"
                                                                        src={sImagePath}
                                                                        width={253}
                                                                        height={274}
                                                                        alt="Gallery Images"
                                                                    />
                                                                </div>
                                                            </a>

                                                            : ''}
                                                    </FormGroup>
                                                    <ErrorMessage name='sProfilePhotoPath' component='div'
                                                                  className='field-error text-danger'/>
                                                </div>
                                                <div className={'col-lg-6 profile-sample-photo'}>
                                                    <h6>Guidelines for capturing an exceptional photograph</h6>
                                                    <div className={'d-flex'}>
                                                        <Image className={'w-25'} src={client1} alt={'client1'}></Image>
                                                        <Image className={'w-25'} src={client2} alt={'client2'}></Image>
                                                        <Image className={'w-25'} src={client3} alt={'client3'}></Image>
                                                    </div>

                                                    <ul className="rbt-list-style-1 mt-5">
                                                        <li>
                                                            <i className="feather-check"></i>
                                                            Look straight at camera and smile
                                                        </li>
                                                        <li>
                                                            <i className="feather-check"></i>
                                                            Maintain genuine and engaging facial expression
                                                        </li>
                                                        <li>
                                                            <i className="feather-check"></i>
                                                            Make sure your head and shoulders are covered
                                                        </li>
                                                        <li>
                                                            <i className="feather-check"></i>
                                                            Use natural lighting
                                                        </li>
                                                        <li>
                                                            <i className="feather-check"></i>
                                                            Simple, uncluttered and white background
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="col-lg-12 mt-5">
                                                    <div className="form-submit-group">
                                                        {isLoading ? <>
                                                            <button
                                                                disabled={true}
                                                                type="submit"
                                                                className="rbt-btn btn-md btn-gradient w-100"
                                                            >
                                                    <span className="btn-text">
                                                        <i className="fa fa-spinner fa-spin p-0"></i> Proceeding...
                                                    </span>
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
                                                                {/*</Link>*/}
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
                    )
                    ;
};

export default Profile;
