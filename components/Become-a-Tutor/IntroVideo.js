import React, {useEffect, useState} from "react";
import img from "@/public/images/others/thumbnail-placeholder.svg";
import Link from "next/link";
import ReactPlayer from 'react-player'
import * as Yup from 'yup'
import {Formik, ErrorMessage, Form} from 'formik'
import Axios from 'axios'
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {useRouter} from "next/router";
import {Alert, FormGroup} from "reactstrap";
import {API_URL, API_KEY} from "../../constants/constant";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'


const UserValidationSchema = Yup.object().shape({
  sIntroVideoPath: Yup.string()
      .required('This field is required'),
  sIntroVideoUrl: Yup.string()
      .required('This field is required')
})
const IntroVideo = () => {
  const REACT_APP = API_URL
  const router = useRouter();
  const [IntroVideo, setIntroVideo] = useState('');
  const [videoUrl, setvideoUrl] = useState('')

  const [thumbnail, setthumbnail] = useState();
  const [isLoading, setisLoading] = useState(false);
  function handleChangeThumbnail(e) {
    // console.log(e.target.files);
    setthumbnail(URL.createObjectURL(e.target.files[0]));
  }

  const getBase64 = (file) => {
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
  const [video, setVideo] = useState('')
  const handleChange = (event) => {
    const fileext = ['video/mp4']
    if (event.target.files[0].size < 1000000000) {
      if (fileext.includes(event.target.files[0].type)) {
        getBase64(event.target.files[0])
            .then(result => {
                console.log(result)
                setVideo(result)
            })
            .catch(err => {

            })
        setIntroVideo(URL.createObjectURL(event.target.files[0]))
      } else {
        alert("Only select video file type")
      }
    } else {
      alert("Please upload file less than 100MB")
    }
  };
  const [regId, setregId] = useState('')
  const [verifySts, setverifySts] = useState()
  const [isIntroVideoAlert, setisIntroVideoAlert] = useState(0)

  useEffect(() => {
    if (localStorage.getItem('userData')) {
      setregId(JSON.parse(localStorage.getItem('userData')).regid)


    Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
            console.log("Intro Video" , res.data[0].sIntroVideo_verify)
          if (res.data.length !== 0) {
              if(res.data[0].sIntroVideo_verify !== null){
                  setverifySts(res.data[0].sIntroVideo_verify)
                  setisIntroVideoAlert(1)
              }else {
                  setverifySts(0)
              }

          }else{
              setverifySts(0)
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
          console.log(res.data)
            if(res.data.length !== 0){
                setVideo(res.data[0]['sIntroVideoPath'])
                setvideoUrl(res.data[0]['sIntroVideoUrl'])
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

  const handleChangeURL = (e) => {
    setvideoUrl(e.target.value)
  }
  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
          <div className="content">
              {

                  isIntroVideoAlert !== 1 && verifySts !== 0 && verifySts !== '' ? <>

                  <div className="section-title">
                      <Skeleton height={20} width={150} className='rbt-title-style-3 mb-0'/>
                  </div>
                  <div className={'mb-3'}>
                      <Skeleton height={1} width={'100%'} className='my-4'/>
                  </div>
                  <Skeleton height={40} className="w-100 mb-2"/>
                  <Skeleton height={20} className="w-75 mb-4"/>
                          <div className={'row row--15 mt-3'}>
                              <div className="col-lg-6 mb-3">
                                  <div>
                                      {/* Upload video button */}
                                      <div className="d-flex align-items-center mb-3">
                                          <Skeleton height={40} width={150} className="me-2"/> {/* Button skeleton */}
                                      </div>
                                      <div className={'mt-3'}>
                                          <Skeleton height={200} width="100%" />
                                      </div>
                                  </div>
                                  {/* Or text */}
                                  <Skeleton height={15} width={50} className="mt-5"/> {/* "Or" text skeleton */}
                                  <Skeleton height={15} width={120}
                                            className="mt-2"/> {/* "Paste a link of video" text skeleton */}
                                  {/* Video URL input */}
                                  <Skeleton height={40} width="100%" className="mt-2"/> {/* Input field skeleton */}
                              </div>
                              <div className="col-lg-6 thumbnail-preview mb-3">
                                  {/* Guidelines heading */}
                                  <Skeleton height={20} width={250} className="mb-3"/> {/* Heading skeleton */}

                                  {/* List skeleton */}
                                  <ul className="rbt-list-style-1 mt-5">
                                      {[...Array(5)].map((_, index) => (
                                          <li key={index} className="d-block align-items-center mb-2">
                                              <Skeleton
                                                  height={15}
                                                  width={index === 1 || index === 3 || index === 5 ? 170 : 200}
                                              />
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
                              <h4 className="rbt-title-style-3">Introduction video</h4>
                              {isIntroVideoAlert === 1 ? <>
                                  {verifySts === 2 ? <>
                                      <Alert color='success'>
                                          <h6 className='alert-heading m-0 text-center'>
                                              Introduction video verification has been approved by admin
                                          </h6>
                                      </Alert>

                                  </> : <>
                                  {verifySts === 1 ? <>
                                      <Alert color='warning'>
                                          <h6 className='alert-heading m-0 text-center'>
                                              Introduction video verification is in pending state
                                          </h6>
                                      </Alert>
                                  </> : <>
                                      {verifySts === 0 || verifySts === null ? <></> : <>
                                          <Alert color='danger'>
                                              <h6 className='alert-heading m-0 text-center'>
                                                  Introduction video verification has been disapproved by admin
                                              </h6>
                                          </Alert>
                                      </>}
                                  </>}
                              </>}
                          </> : <></>}

                          {/*<h3>Your profile photo is your first impression</h3>*/}
                          <p>Add a landscape video of maximum 100 mb</p>
                      </div>

                      <Formik
                          // validationSchema={UserValidationSchema}
                          initialValues={{
                              nRegId: regId,
                              sIntroVideoPath: video ? video : '',
                              sIntroVideoUrl: videoUrl ? videoUrl : ''
                          }}
                          enableReinitialize={true}
                          onSubmit={async (values, {resetForm}) => {
                              console.log(values)
                              if (verifySts === 2) {
                                  router.push('/become-a-tutor/interest')
                              } else {
                                  setisLoading(true)
                                  await Axios.put(`${API_URL}/api/TutorBasics/UpdateTutorProfile`, values, {
                                      headers: {
                                          ApiKey: `${API_KEY}`
                                      }
                                  }).then(res => {
                                      console.log(values)
                                      const retData = JSON.parse(res.data)
                                      console.log(retData)
                                      resetForm({})
                                      if (retData.success === '1') {
                                          router.push('/become-a-tutor/interest')
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
                                                  <div>
                                                      <label id='label'
                                                             className='rbt-btn btn-md btn-gradient hover-icon-reverse'>Upload
                                                          video
                                                          <input type="file" id="videofile" name="sIntroVideoPath"
                                                                 onChange={handleChange}
                                                                 accept="video/* "/>
                                                      </label>
                                                      <div className={'mt-3'}>
                                                          {video ? <ReactPlayer
                                                              // playing={this.state.videoplay}
                                                              controls
                                                              width="100%"
                                                              height="200px"
                                                              url={video}></ReactPlayer> : ''}
                                                      </div>
                                                      {/*<ErrorMessage name='sIntroVideoPath' component='div'*/}
                                                      {/*              className='field-error text-danger'/>*/}
                                                      {/*<span className="focus-border"></span>*/}
                                                  </div>

                                                  <p className={'mt-5 m-0'}>Or</p>
                                                  <p className={'m-0 mb-3'}>Paste a link of video</p>
                                                  <div className="form-group">
                                                      <input required={verifySts === 2} onChange={handleChangeURL}
                                                             name="sIntroVideoUrl" type="text"
                                                             placeholder="Video Url"/>
                                                      {/*<ErrorMessage name='sIntroVideoUrl' component='div'*/}
                                                      {/*              className='field-error text-danger'/>*/}
                                                      {/*<span className="focus-border"></span>*/}
                                                  </div>
                                              </div>
                                              <div className={'col-lg-6 thumbnail-preview'}>
                                                  <h6>Guidelines for capturing an exceptional video</h6>
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

                                                  {/*    <label className={'mt-5 ms-5'}>Add a thumbnail</label>*/}
                                                  {/*    <input type="file" className={'p-0 mt-5 ms-5'} onChange={handleChangeThumbnail}/>*/}
                                                  {/*    <small className={'p-0 mt-5 ms-5'}>JPG or PNG format, maximum 2 MB</small>*/}
                                                  {/*{thumbnail ? <img className={'mt-5 ms-5'} src={thumbnail}/> : ''}*/}
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

              export default IntroVideo;
