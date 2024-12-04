"use client"

import {useEffect, useState} from "react";
import Axios from 'axios'
import {API_URL, API_KEY} from '../../constants/constant'
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";


const Profile = () => {
  const REACT_APP = API_URL

  const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
  }


  const [userdata, setuserdata] = useState('')
  const [uuid, setuuid] = useState('')
  useEffect(() => {
    if(localStorage.getItem('userData')){
      const udata = JSON.parse(localStorage.getItem('userData'))
      Axios.get(`${API_URL}/api/registration/FillUserProfile/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data.length !== 0) {
              // console.log(res.data[0])
              setuserdata(res.data[0])
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

      setuuid(JSON.parse(localStorage.getItem('userData')).uuid)
    }
  }, []);

  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">My Profile</h4>
          </div>
          {uuid !== "" ? <div className="rbt-profile-row row row--15">
            <div className="col-lg-4 col-md-4">
              <div className="rbt-profile-content b2">Unique User Id (uuid)</div>
            </div>
            <div className="col-lg-8 col-md-8">
              <div className="rbt-profile-content b2">
                {uuid}
              </div>
            </div>
          </div> : <></>}

          <div className="rbt-profile-row row row--15 mt--15">
            <div className="col-lg-4 col-md-4">
              <div className="rbt-profile-content b2">Registration Date</div>
            </div>
            <div className="col-lg-8 col-md-8">
              <div className="rbt-profile-content b2">
                {formatDate(userdata.dCreatedDate)}
              </div>
            </div>
          </div>
          <div className="rbt-profile-row row row--15 mt--15">
            <div className="col-lg-4 col-md-4">
              <div className="rbt-profile-content b2">First Name</div>
            </div>
            <div className="col-lg-8 col-md-8">
              <div className="rbt-profile-content b2">{userdata.sFName}</div>
            </div>
          </div>
          <div className="rbt-profile-row row row--15 mt--15">
            <div className="col-lg-4 col-md-4">
              <div className="rbt-profile-content b2">Last Name</div>
            </div>
            <div className="col-lg-8 col-md-8">
              <div className="rbt-profile-content b2">{userdata.sLName}</div>
            </div>
          </div>
          <div className="rbt-profile-row row row--15 mt--15">
            <div className="col-lg-4 col-md-4">
              <div className="rbt-profile-content b2">Email</div>
            </div>
            <div className="col-lg-8 col-md-8">
              <div className="rbt-profile-content b2">{userdata.sEmail !== "" ? userdata.sEmail : '-'}</div>
            </div>
          </div>
          <div className="rbt-profile-row row row--15 mt--15">
            <div className="col-lg-4 col-md-4">
              <div className="rbt-profile-content b2">Phone Number</div>
            </div>
            <div className="col-lg-8 col-md-8">
              <div className="rbt-profile-content b2">{userdata.sMobile !== "" ? userdata.sMobile : '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
