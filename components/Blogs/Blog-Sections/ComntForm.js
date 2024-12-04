import React, {useEffect, useState} from "react";
import Axios from 'axios'
import {API_URL} from '../../../constants/constant'
import { ErrorDefaultAlert, ErrorAlert, SuccessAlert } from "@/components/Services/SweetAlert";
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { DecryptData, EncryptData } from "@/components/Services/encrypt-decrypt";
import { Row, Col, Card, CardBody, CardText, CardTitle, CardImg, Badge, Media, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Input, Button, FormGroup, CustomInput } from 'reactstrap'


const UserValidationSchema = Yup.object().shape({
    sName: Yup.string()
        .required().when('nRegId', {
            is: (val) => val === '',
            then: Yup.string().required('This field is required'),
            otherwise: Yup.string().notRequired()
        }).notRequired().when('nRegId', {
            is: (val) => val !== '',
            otherwise: Yup.string().notRequired()
        }),
    sEmail: Yup.string()
        .email("Invalid email address format")
        .required().when('nRegId', {
            is: (val) => val === '',
            then: Yup.string().required('This field is required'),
            otherwise: Yup.string().notRequired()
        }).notRequired().when('nRegId', {
            is: (val) => val !== '',
            otherwise: Yup.string().notRequired()
        }),
    sComment: Yup.string()
        .required('This field is required')
})
const ComntForm = () => {
  const REACT_APP = API_URL
  const [comment, setcomment] = useState('')
  const [blogId, setblogId] = useState('')
  const [sFname, setsFname] = useState('')
  const [RegId, setRegId] = useState('')
  const [sLname, setsLname] = useState('')
  const [sEmail, setsEmail] = useState('')
  const [sName, setsName] = useState('')
  const [sCategory, setsCategory] = useState('')
  const [sBlogTitle, setsBlogTitle] = useState('')
  const [sImagePath, setsImagePath] = useState('')
  const [sPhoto, setsPhoto] = useState('')
  const [sBlogContent, setsBlogContent] = useState('')
  const [dCreatedDate, setdCreatedDate] = useState('')
  const [blogcomment, setblogcomment] = useState('')
  const onCommentChange = (e) => {
    setcomment(e.target.value)
  }

  const handleEmail = (e) => {
      setsEmail(e.target.value)
  }

  const handleName = (e) => {
      setsName(e.target.value)
  }

  const getAllBlog = () => {
        Axios.get(`${REACT_APP.API_URL}/api/blog/GetBlogDetail/${blogId}`, {
            headers: {
                ApiKey: `${REACT_APP.API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                if (res.data) {
                    if (res.data.length !== 0) {
                        // setsFname(res.data[0]['sFName'])
                        // setsLname(res.data[0]['sLName'])
                        setsCategory(res.data[0]['sCategory'])
                        setsBlogTitle(res.data[0]['sBlogTitle'])
                        setsImagePath(res.data[0]['sImagePath'])
                        setsPhoto(res.data[0]['sPhoto'])
                        setsBlogContent(res.data[0]['sBlogContent'])
                        setdCreatedDate(res.data[0]['dCreatedDate'])
                        setblogcomment(res.data[0]['bIsCommentAllowed'])
                    }
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }
    useEffect(() => {
        const url = window.location.href
        const parts = url.split("/");
        const postId = parts[parts.length - 1];
        setblogId(postId)
        // console.log(DecryptData(JSON.parse(localStorage.getItem('userData')).username))
        setsFname(JSON.parse(localStorage.getItem('userData')).fname)
        setsLname(JSON.parse(localStorage.getItem('userData')).lname)
        setRegId(JSON.parse(localStorage.getItem('userData')).regid)
        getAllBlog()
    }, []);

  return (
    <>
      <div className="comment-respond">
        <h4 className="title">Post a Comment</h4>
        <Formik
            // validationSchema={UserValidationSchema}
            initialValues={{
              nBId: blogId,
              nRegId: RegId ? RegId : '',
              sName: sFname ? `${sFname} ${sLname}` : sName,
              sEmail: sEmail ? sEmail : '',
              sComment: comment ? comment : ''
            }}
            enableReinitialize={true}
            onSubmit={async (values, { resetForm }) => {
              console.log(values)
                console.log(EncryptData(values))
              await Axios.post(`${REACT_APP.API_URL}/api/blogComment/InsertBlogComment/${EncryptData(values)}`, 1, {
                headers: {
                  ApiKey: `${REACT_APP.API_KEY}`
                }
              }).then(res => {
                const retData = JSON.parse(res.data)
                resetForm({})
                if (retData.success === "1") {
                  { SuccessAlert(retData) }
                    setcomment('')
                } else if (retData.success === "0") {

                  { ErrorAlert(retData) }
                }

              })
                  .catch(err => {
                      console.log(err)
                      { ErrorDefaultAlert(JSON.stringify(err.response)) }
                  })
            }
            }

        >

          {({ errors, touched, values }) => (
              <Form>

                <div className="row row--10">
                    <Field type="hidden" className="form-control" name="nRegId" id="nRegId"></Field>

                    {RegId === '' ? <>
                        <Row>
                            <Col md='6'>
                            <FormGroup className='mb-2'>
                                <Field type='text' placeholder='Name'
                                       name='sName'
                                       id='sName'
                                       className={`form-control ${errors.sName && touched.sName && 'is-invalid'}`}
                                       values={sName} onChange={handleName}
                                />
                                <ErrorMessage name='sName' component='div' className='field-error text-danger' />
                            </FormGroup>
                        </Col>
                            <Col md='6'>
                                <FormGroup className='mb-2'>
                                    <Field type='text' placeholder='Email'
                                           name='sEmail'
                                           id='sEmail'
                                           className={`form-control ${errors.sEmail && touched.sEmail && 'is-invalid'}`} values={sEmail} onChange={handleEmail}
                                    />
                                    <ErrorMessage name='sEmail' component='div' className='field-error text-danger' />
                                </FormGroup>
                            </Col></Row>
                    </> : <></>}
                  <div className="col-12 mt-3">
                    <div className="form-group">
                        {/*<Field*/}
                        {/*    as='textarea'*/}
                        {/*    type='text'*/}
                        {/*    name='sComment'*/}
                        {/*    id='sComment'*/}
                        {/*    value={comment}*/}
                        {/*    onChange={onCommentChange}*/}
                        {/*    className={`form-control ${errors.sComment && touched.sComment && 'is-invalid'}`}*/}
                        {/*    placeholder='Comment'*/}
                        {/*/>*/}
                        {/*<ErrorMessage name='sComment' component='div' className='field-error text-danger' />*/}
                      {/*<label htmlFor="sComment" className={'ps-2'}>Comment</label>*/}
                      <textarea id="sComment" placeholder={'Comment'} name="sComment" value={comment} onChange={onCommentChange}></textarea>
                        <ErrorMessage name='sComment' component='div' className='field-error text-danger' />

                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button
                        className="rbt-btn btn-gradient icon-hover radius-round btn-md mt-5"
                        type={'submit'}
                    >
                      <span className="btn-text">Post Comment</span>
                      <span className="btn-icon">
                  <i className="feather-arrow-right"></i>
                </span>
                    </button>
                  </div>
                </div>

              </Form>
          )}
        </Formik>

      </div>
    </>
  );
};

export default ComntForm;
