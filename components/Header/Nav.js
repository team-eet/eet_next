import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import {useEffect, useState} from "react";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../constants/constant";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";


const  Nav = () => {
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const router = useRouter();
  const [showDashboard, setshowDashboard] = useState(false)
  const [verifySts, setverifySts] = useState(0)
  const [isApiCall, setApiCall] = useState(0)
  const isActive = (href) => router.pathname === href;

  const toggleMenuItem = (item) => {
    setActiveMenuItem(activeMenuItem === item ? null : item);
  };
  const REACT_APP = API_URL
  const [token, setToken] = useState('')
  useEffect(() => {

    const domain = window.location.hostname

    if (localStorage.getItem('userData')) {
      const Token = JSON.parse(localStorage.getItem('userData')).accessToken
      // console.log('EncryptedToken', EncryptData(Token))
      // console.log('AccessToken', JSON.parse(localStorage.getItem('userData')).accessToken)
      setToken(EncryptData(Token))

      setshowDashboard(true)
      Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            // console.log("Hello")
            console.log(res.data)
            if (res.data.length !== 0) {
              setApiCall(1)
              setverifySts(res.data[0]['bVerifyStatus'])
            }

          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }


  }, []);

  return (
    <nav className="mainmenu-nav">
      <ul className="mainmenu">
        <li className="">
          <Link
              className={`${activeMenuItem === "home" ? "open" : ""}`}
              // onClick={() => toggleMenuItem("home")}
              href="/"
          >
            Home

          </Link>
        </li>
        <li className="">
          <Link
              className={`${activeMenuItem === "courses" ? "open" : ""}`}
              // onClick={() => toggleMenuItem("home")}
              href="/all-course"
          >
            Courses

          </Link>
        </li>

        <li className="">
          <Link
              className={`${activeMenuItem === "batches" ? "open" : ""}`}
              href="/all-batch"
          >
            Batches
          </Link>

        </li>
        <li className="">
          {/*{console.log(verifySts)}*/}
          {verifySts === 2 ? <>
            {/*<a*/}
            {/*    className={`${activeMenuItem === "tutor" ? "open" : ""}`}*/}
            {/*    href={`https://eet-frontend.azurewebsites.net/access/${token}`}*/}
            {/*    target={'_blank'}*/}
            {/*>*/}
            {/*  Tutor*/}
            {/*</a>*/}
          </> : <>
            <Link
                className={`${activeMenuItem === "tutor" ? "open" : ""}`}
                href="/become-a-teacher"
            >
              Become a Tutor
            </Link>
          </>}

        </li>
        <li className="">
          <Link
              href="/blog-list"
              className={`${activeMenuItem === "blog" ? "open" : ""}`}
          >
            Blog
          </Link>
        </li>
        <li className="">
          <Link
              href="/pages/about-us-02"
              className={`${activeMenuItem === "about" ? "open" : ""}`}
          >
            About
          </Link>
        </li>
        {showDashboard ? <li className="">
          <Link
              href="/student/student-dashboard"
              className={`${activeMenuItem === "about" ? "open" : ""}`}
          >
            My Dashboard
          </Link>
        </li> : ''}

        {verifySts === 2 ? <>
          <a
              className={`${activeMenuItem === "tutor" ? "open" : ""}`}
              href={`https://eet-frontend.azurewebsites.net/access/${token}`}
              target={'_blank'}
          >
            Tutor dashboard
          </a>
        </> : <>
        </>}

      </ul>
    </nav>
  );
};
export default Nav;
