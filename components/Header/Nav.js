import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import {useEffect, useState} from "react";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../constants/constant";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

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
      const Token = DecryptData(localStorage.getItem('userData')).accessToken
      // console.log('EncryptedToken', EncryptData(Token))
      // console.log('AccessToken', DecryptData(localStorage.getItem('userData')).accessToken)
      setToken(EncryptData(Token))

      setshowDashboard(true)
      Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${DecryptData(localStorage.getItem('userData')).regid}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            // console.log("Hello")
            if (res.data.length !== 0) {
              setApiCall(1)
              setverifySts(res.data[0]['bVerifyStatus'])
            }

          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }else{
      setApiCall(1)
    }


  }, []);

  return (
    <nav className="mainmenu-nav">
      <ul className="mainmenu">
        {
          isApiCall !== 1 ? <>
            <li>
              <a href="javascript:void(0)">
                <Skeleton width={80} height={20}/>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <Skeleton width={90} height={20}/>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <Skeleton width={90} height={20}/>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <Skeleton width={70} height={20}/>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <Skeleton width={80} height={20}/>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <Skeleton width={100} height={20}/>
              </a>
            </li>
          </> : <>
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
                  {verifySts !== 2 && (
                      <Link
                          className={`${activeMenuItem === "tutor" ? "open" : ""}`}
                          href="/become-a-teacher"
                      >
                          Become a Tutor
                      </Link>
                  )}


              </li>
              <li className="">
                  <Link
                      href="/blog-list"
                      className={`${activeMenuItem === "blog" ? "open" : ""}`}
                  >
                      Blogs
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
                      My Learning
                  </Link>
              </li> : ''}


              {
                  verifySts === 2 && (
                      <li>
                          <a
                              className={`${activeMenuItem === "tutor" ? "open" : ""}`}
                              href={`https://eet-frontend.azurewebsites.net/access/${token}`}
                              target={'_blank'}
                          >
                              Tutor dashboard
                          </a>
                      </li>
                  )}
          </>}


      </ul>
    </nav>
  );
};
export default Nav;
