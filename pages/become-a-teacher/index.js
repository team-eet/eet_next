import { Provider } from "react-redux";
import PageHead from "../Head";
import Store from "@/redux/store";
import Context from "@/context/Context";
import {useEffect, useState} from "react";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import BreadCrumb from "@/components/Common/BreadCrumb";
import VerifyBreadCrumb from "@/components/Common/VerifyBreadCrumb";
import BecomeATeacher from "@/components/Become-a-Teacher/BecomeATeacher";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import BackToTop from "../backToTop";
import Axios from "axios";
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../constants/constant";

const TeacherPage = () => {
  const REACT_APP = API_URL

  const [verifysts, setverifySts] = useState([])

  useEffect(() => {
      if(localStorage.getItem('userData')){
          Axios.get(`${API_URL}/api/TutorBasics/GetTutorDetails/${JSON.parse(localStorage.getItem('userData')).regid}`, {
              headers: {
                  ApiKey: `${API_KEY}`
              }
          })
              .then(res => {
                  // console.log(res.data)
                  if(res.data.length !== 0) {
                      setverifySts(res.data[0].bVerifyStatus)
                  }

              })
              .catch(err => {
                  { ErrorDefaultAlert(err) }
              })
      }

  }, [])

  return (
    <>
      <PageHead title="Become a Teacher - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
            {/*{verifysts === 1 ? <>*/}
                <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
            {/*</> : <>*/}

            {/*</>}*/}

          <MobileMenu />
          <Cart />
          {verifysts === 2 ? <>
              <VerifyBreadCrumb title="Cheers to your success as a tutor"  />
          </> : <>
              <BreadCrumb title="Start Your Tutoring Journey Today" text="Become a Tutor"/>
          </>}

            {/*{verifysts === null ? <>*/}
            {/*    <BreadCrumb title="Start Your Tutoring Journey Today" text="Become a Tutor"/>*/}
            {/*</> : <>*/}

            {/*</>}*/}


          {verifysts === 1 ? <>
          </> : <>
              <div className="rbt-become-area bg-color-white rbt-section-gap">
                  <BecomeATeacher/>
              </div>
          </>}

            <BackToTop/>
            <Separator />
            {verifysts === 1 ? <>
                <FooterOne />
            </> : <>
                <FooterOne />
            </>}

        </Context>
      </Provider>
    </>
  );
};

export default TeacherPage;
