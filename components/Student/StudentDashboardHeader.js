import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import Axios from 'axios'
import {API_URL, API_KEY} from '../../constants/constant'
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";

const StudentDashboardHeader = () => {
  const REACT_APP = API_URL
  const [profilephoto, setprofilePhoto] = useState('')
  const [fName, setFname] = useState('')
  const [lName, setLname] = useState('')
  const [crscnt, setcrscnt] = useState('')
  const [uuid, setuuid] = useState('')

  const getPurchasedCourse = () => {
    if (localStorage.getItem('userData')) {
      const udata = JSON.parse(localStorage.getItem('userData')).regid
      // console.log('api called')
      Axios.get(`${API_URL}/api/purchasedCourse/GetPurchasedCourse/${udata}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            // console.log('api called 2')
            if (res.data) {
              setcrscnt(res.data.length)
              // console.log('My Learning', res.data)
            } else {

            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
  }
  useEffect(() => {
    if (localStorage.getItem('userData')){
      // if(JSON.parse(localStorage.getItem('userData')).profile === "") {
        setprofilePhoto(JSON.parse(localStorage.getItem('userData')).profile)
        setFname(JSON.parse(localStorage.getItem('userData')).fname)
        setLname(JSON.parse(localStorage.getItem('userData')).lname)
        setuuid(JSON.parse(localStorage.getItem('userData')).uuid)
    }
    getPurchasedCourse()
  }, [])
  return (
    <>
      <div className="rbt-dashboard-content-wrapper">
        <div className="tutor-bg-photo bg_image bg_image--23 height-350">
        </div>

        <div className="rbt-tutor-information">
          <div className="rbt-tutor-information-left">
            <div className="thumbnail rbt-avatars size-lg">
              {profilephoto === "" ?
                  <img
                      width={300}
                      height={300}
                      src="/images/client/blank-profile-picture-973460_1280.png"
                      alt="Instructor"
                  /> : <img
                      style = {{ height: '120px' }}
                      src={profilephoto}
                      alt="Instructor"
                  />
              }

            </div>
            <div className="tutor-content">
              <h5 className="title">{fName} {lName}</h5>
              <ul className="rbt-meta rbt-meta-white mt--5">
                <li>
                  <i className="feather-book"></i>{crscnt} Courses Enrolled
                </li>
                <li>
                  <i className="feather-award"></i>4 Certificate
                </li>
              </ul>
              {uuid !== "" ? <small className={'rbt-meta-white text-white'} style={{ fontSize: '14px' }}><i className="feather-user me-1"></i>Unique User Id (uuid)
                : {uuid}</small> : <></>}

            </div>

          </div>

          <div className="rbt-tutor-information-right">
            <div className="tutor-btn">
              <Link className="rbt-btn btn-md hover-icon-reverse" href="/student/student-settings">
                <span className="icon-reverse-wrapper">
                  <span className="btn-text">Update Profile</span>
                  <span className="btn-icon">
                    <i className="feather-arrow-right" />
                  </span>
                  <span className="btn-icon">
                    <i className="feather-arrow-right" />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboardHeader;
