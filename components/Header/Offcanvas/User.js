import Image from "next/image";

import UserData from "../../../data/user.json";
import Link from "next/link";
import {useEffect, useState} from "react";
import {EncryptData, DecryptData} from "@/components/Services/encrypt-decrypt";
import nouser from '../../../public/images/testimonial/default-avatar-profile-icon-of-social-media-user-vector.jpg'
import {WEB_URL} from "@/constants/constant";
// Add this at the top of the component
import { useRouter } from "next/router";
// random comments
const User = ({fname, lname, profile}) => {
  // console.log(UserData)
  const router = useRouter()
  const [userRole, setuserRole] = useState('')
  const [uuid, setuuid] = useState('')
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userUpdateData');
    localStorage.clear();
    router.push('/login');
  };

  useEffect(() => {
    if (localStorage.getItem('userData')){
      const data = DecryptData(localStorage.getItem('userData'))
      setuserRole(data)
      setuuid(DecryptData(localStorage.getItem('userData')).uuid)
    }
  }, []);
  return (
    <div className="rbt-user-menu-list-wrapper">
      {UserData &&
        UserData.user.map((person, index) => (
          <div className="inner" key={index}>
            <div className="rbt-admin-profile">
              <div className="admin-thumbnail">
                {profile === "" ? <>

                  <Image
                      src={nouser}
                        width={43}
                        height={43}
                      // alt="User Images"
                  />
                </> : <>
                  <Image
                      src={profile}
                      width={43}
                      height={43}
                      // alt="User Images"
                  />
                </>}

              </div>
              <div className="admin-info">
                <span className="name">{fname} {lname}</span>
                <Link
                  className="rbt-btn-link color-primary"
                  href="/student/student-dashboard"
                >
                  View Profile
                </Link>
              </div>

            </div>
            {uuid !== "" ? <small>UUID : {uuid}</small> : ''}
            {/*<ul className="user-list-wrapper">*/}
            {/*  {person.userList.map((list, innerIndex) => (*/}
            {/*    <li key={innerIndex}>*/}
            {/*      <Link href={list.link}>*/}
            {/*        <i className={list.icon}></i>*/}
            {/*        <span>{list.text}</span>*/}
            {/*      </Link>*/}
            {/*    </li>*/}
            {/*  ))}*/}
            {/*</ul>*/}
            <hr className="mt--10 mb--10" />
            <ul className="user-list-wrapper">
              {userRole.role === 'Admin' ? <>
                <li>
                  <Link target={'_blank'} href={`${WEB_URL}/admin/dashboard`}>
                    <i className="feather-book-open"></i>
                    <span>Admin Dashboard</span>
                  </Link>
                </li>
              </> : <>
                {userRole.role === 'Tutor' ? <>
                  <li>
                    <Link target={"_blank"} href={`${WEB_URL}/tutorbatch/dashboard`}>
                      <i className="feather-book-open"></i>
                      <span>Tutor Dashboard</span>
                    </Link>
                  </li>
                </> : <>

                </>}
              </>}

            </ul>
            <hr className="mt--10 mb--10"/>
            <ul className="user-list-wrapper">

              <li>
                <Link href="/login" onClick={handleLogout}>
                  <i className="feather-log-out"></i>
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        ))}
    </div>
  );
};

export default User;
