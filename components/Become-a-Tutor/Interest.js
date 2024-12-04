import Link from "next/link";
import Courses from "../../data/dashboard/instructor/instructor.json";
import CourseWidgets from "./Dashboard-Section/widgets/CourseWidget";
import React, {useState, useCallback, useEffect} from "react";
import { ReactTags } from 'react-tag-autocomplete'
import {API_URL, API_KEY} from '../../constants/constant'
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { useRouter } from "next/router";
import {DecryptData} from "@/components/Services/encrypt-decrypt";
import * as Yup from 'yup'
import { Formik, ErrorMessage, Form } from 'formik'
import {Alert, Button, CardText} from "reactstrap";
import Select from 'react-select';


const UserValidationSchema = Yup.object().shape({
    sFieldOfInterest: Yup.array()
        .required('This field is required'),
    sContentCourse: Yup.string()
        .required('This field is required'),
    sOwnCourse: Yup.string()
        .required('This field is required')
})
const Interest = () => {
    const REACT_APP = API_URL
    const router = useRouter()
    const [category, setCategory] = useState([])

    const [Interest, setInterest] = useState([])
    const [selfCourse, setselfCourse] = useState('')
    const [content, setContent] = useState('')
    const [regId, setregId] = useState('')
    const [isLoading, setisLoading] = useState(false)


    const handleChangeInterest = (values) => {
        // console.log(values)
        const category1 = values.map((obj) => {
            return obj.sCategory
        })
        // console.log(category1)
        setInterest(category1)
    }

    const handleChangeSelfCourse = (e) => {
        setselfCourse(e.target.value)
    }

    const handleChangeContent = (e) => {
        setContent(e.target.value)
    }

    const getCategory = () => {
        Axios.get(`${API_URL}/api/coursecategory/GetCourseCategory`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                console.log(res.data)
                if (res.data.length !== 0) {
                    setCategory(res.data)
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }

            })

    }
    const [tutorcnt, setTutorcnt] = useState('')
    const [verifySts, setverifySts] = useState()

    const options = category.map(cat => ({
        value: cat.nCCId,
        label: cat.sCategory
    }));

    const [selectedOptions, setSelectedOptions] = useState('');

    const handleChange = (selected) => {
        // const selectedValues = selected ? selected.map(option => option.label).join(',') : '';
        setSelectedOptions(selected);
    };

    const [interestcnt, setinterestcnt] = useState('')

    useEffect(() => {
        if(localStorage.getItem('userData')) {
            setregId(JSON.parse(localStorage.getItem('userData')).regid)

        getCategory()

        Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${JSON.parse(localStorage.getItem('userData')).regid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log("GetTutorVerify",res.data)
                if (res.data.length !== 0) {
                    setverifySts(res.data[0].sInterests_verify)
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


        Axios.get(`${API_URL}/api/TutorInterestQue/CheckTutorInterestQue/${JSON.parse(localStorage.getItem('userData')).regid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                console.log(res.data)
                setinterestcnt(res.data.length)
                if(res.data.length !== 0){
                    const daysString = res.data[0]['sFieldOfInterest'];

                    // const daysArray = daysString.split(",");
                    console.log('daysArray', daysString.split(','))
                    // const daysArray = daysString.map(option => {
                    //     return options.find(opt => opt.label === option);
                    // });
                    console.log(daysArray)
                    // setSelectedOptions(daysArray)
                    setselfCourse(res.data[0]['sOwnCourse'])
                    setContent(res.data[0]['sContentCourse'])
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
          <div className="section-title">
            <h4 className="rbt-title-style-3">Interests</h4>
              {verifySts === 2 ? <>
                  <Alert color='success'>
                      <h6 className='alert-heading m-0 text-center'>
                          Interests verification has been approved by admin
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
                      </>}
                  </>}
              </>}
          </div>
                <Formik
                    // validationSchema={UserValidationSchema}
                    initialValues={{
                        nRegId : regId,
                        // sFieldOfInterest: selectedOptions ? selectedOptions.map(option => option.label).join(',') : '',
                        sFieldOfInterest: '',
                        sOwnCourse: selfCourse ? selfCourse : '',
                        sContentCourse: content ? content : ''
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values, {resetForm}) => {
                        console.log(values)
                        if(verifySts === 2) {
                            router.push('/become-a-tutor/time-availability')
                        } else {
                            if(interestcnt !== 0) {
                                setisLoading(true)
                                // alert('Update')
                                await Axios.put(`${API_URL}/api/TutorInterestQue/UpdateTutorInterestQue`, values, {
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
                                        router.push('/become-a-tutor/time-availability')
                                    }
                                })
                                    .catch(err => {
                                        {
                                            ErrorDefaultAlert(JSON.stringify(err.response))
                                        }
                                    })
                            } else {
                                setisLoading(true)
                                // alert('Insert')
                                await Axios.post(`${API_URL}/api/TutorInterestQue/InsertTutorInterestQue`, values, {
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
                                        router.push('/become-a-tutor/time-availability')
                                    }
                                })
                                    .catch(err => {
                                        {
                                            ErrorDefaultAlert(JSON.stringify(err.response))
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

                                        {/*<div className={'col-lg-12 mb-5'}>*/}
                                        {/*    <label>Field of interest</label>*/}
                                        {/*    {verifySts === 2 ? <>*/}
                                        {/*        <Select*/}
                                        {/*            isMulti*/}
                                        {/*            name="sFieldOfInterest"*/}
                                        {/*            options={options}*/}
                                        {/*            className="basic-multi-select"*/}
                                        {/*            classNamePrefix="select"*/}
                                        {/*            isDisabled={true}*/}
                                        {/*            defaultValue={selectedOptions}*/}
                                        {/*        />*/}
                                        {/*    </> : <>*/}
                                        {/*        <Select*/}
                                        {/*            isMulti*/}
                                        {/*            name="sFieldOfInterest"*/}
                                        {/*            options={options}*/}
                                        {/*            className="basic-multi-select"*/}
                                        {/*            classNamePrefix="select"*/}
                                        {/*            value={selectedOptions}*/}
                                        {/*            onChange={handleChange}*/}
                                        {/*        />*/}
                                        {/*    </>}*/}

                                        {/*    <ErrorMessage style={{ marginTop: '50px' }} name='sFieldOfInterest' component='div'*/}
                                        {/*                  className='field-error text-danger ms-3'/>*/}
                                        {/*    <span className="focus-border"></span>*/}
                                        {/*</div>*/}

                                        <div className="col-lg-6 m-t-30">
                                            <label>
                                                Are you interested in creating your own course?
                                            </label>
                                            <div className="form-group d-flex">
                                                <div>
                                                    {selfCourse === 1 ? <input disabled={verifySts === 2} checked
                                                                               onChange={handleChangeSelfCourse}
                                                                               value={'yes'} id="yes" type="radio"
                                                                               name="sOwnCourse"/> :
                                                        <input disabled={verifySts === 2}
                                                               onChange={handleChangeSelfCourse}
                                                               value={'yes'} id="yes" type="radio"
                                                               name="sOwnCourse"/>
                                                    }

                                                    <label htmlFor="yes">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className={"ms-3"}>
                                                    {selfCourse === 0 ? <input disabled={verifySts === 2} checked
                                                                               value={'no'}
                                                                               id="no" type="radio"
                                                                               name="sOwnCourse"/> :
                                                        <input disabled={verifySts === 2}
                                                               onChange={handleChangeSelfCourse} value={'no'}
                                                               id="no" type="radio" name="sOwnCourse"/>
                                                    }
                                                    <label htmlFor="no">
                                                        No
                                                    </label>
                                                </div>
                                                <ErrorMessage name='sOwnCourse' component='div'
                                                              className='field-error text-danger ms-3 mt-3'/>
                                                <span className="focus-border"></span>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 m-t-30">
                                            <label>
                                                Do you have content to create a course?
                                            </label>
                                            <div className="form-group d-flex">
                                                <div>
                                                    {content === 1 ? <>
                                                        <input disabled={verifySts === 2} id="yes" checked type="radio"
                                                               value={'yes'} name="sContentCourse"/>

                                                    </> : <>
                                                        <input disabled={verifySts === 2} id="yes" type="radio"
                                                               onChange={handleChangeContent}
                                                               value={'yes'} name="sContentCourse"/>

                                                    </>}
                                                    <label htmlFor="yes">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className={"ms-3"}>
                                                    {content === 0 ? <>
                                                        <input disabled={verifySts === 2} checked
                                                               onChange={handleChangeContent} value={'no'} id="no"
                                                               type="radio" name="sContentCourse"/>
                                                    </> : <>
                                                        <input disabled={verifySts === 2} onChange={handleChangeContent}
                                                               value={'no'} id="no"
                                                               type="radio" name="sContentCourse"/>
                                                    </>}
                                                    <label htmlFor="no">
                                                        No
                                                    </label>
                                                </div>
                                                <ErrorMessage name='sContentCourse' component='div'
                                                              className='field-error text-danger mt-3 ms-3'/>
                                                <span className="focus-border"></span>
                                            </div>
                                        </div>

                                        {/*<div className={'col-lg-6'}>*/}
                                        {/*    <label>*/}
                                        {/*        Select the field of interest for teaching*/}
                                        {/*    </label>*/}

                                        {/*    <Multiselect*/}
                                        {/*        options={category} // Options to display in the dropdown*/}
                                        {/*        // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown*/}
                                        {/*        onChange={handleChangeInterest(category)}*/}
                                        {/*        value={Interest} // Function will trigger on select event*/}
                                        {/*        // onRemove={this.onRemove} // Function will trigger on remove event*/}
                                        {/*        displayValue="sCategory" // Property name to display in the dropdown options*/}
                                        {/*    />*/}

                                        {/*    <ErrorMessage name='sFieldOfInterest' component='div'*/}
                                        {/*                  className='field-error text-danger'/>*/}
                                        {/*</div>*/}


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

export default Interest;
