import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";

import InstructorDashboardHeader from "@/components/Become-a-Tutor/InstructorDashboardHeader";
import InstructorDashboardSidebar from "@/components/Become-a-Tutor/InstructorDashboardSidebar";
import Profile from "@/components/Become-a-Tutor/Profile";
import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import BackToTop from "@/pages/backToTop";
import Store from "@/redux/store";
import React, {useEffect, useState} from "react";
import { Provider } from "react-redux";
import {API_URL, API_KEY} from "../../../constants/constant";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";

const TutorProfile = () => {
  const REACT_APP = API_URL
  // const [regId, setregId] = useState('')
  // const [sFname, setsFname] = useState('')
  // const [sLname, setsLname] = useState('')
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       const userData = DecryptData(localStorage.getItem('userData'));
  //       const regid = userData.regid;
  //
  //       const response = await Axios.get(`${REACT_APP.API_URL}/api/TutorBasics/GetTutorProfile/${regid}`, {
  //         headers: {
  //           ApiKey: REACT_APP.API_KEY
  //         }
  //       });
  //
  //       console.log(response.data);
  //       // Assuming resetForm is defined somewhere in your component
  //       // resetForm({}); // Reset form after successful fetch
  //     } catch (error) {
  //       console.error('API Error:', error);
  //       // Handle error or show alert
  //       ErrorDefaultAlert(JSON.stringify(error.response));
  //     }
  //   };
  //   fetchUserProfile()
  // //   const userData = DecryptData(localStorage.getItem('userData'));
  // //   const regid = userData.regid;
  // //   // console.log(DecryptData(localStorage.getItem('userData')).regid)
  // //   Axios.get(`${REACT_APP.API_URL}/api/TutorBasics/GetTutorProfile/${regid}`, {
  // //     headers: {
  // //       ApiKey: `${REACT_APP.API_KEY}`
  // //     }
  // //   }).then(res => {
  // //     console.log(res.data)
  // //     const retData = JSON.parse(res.data)
  // //     // console.log(retData)
  // //     resetForm({})
  // //   })
  // //       .catch(err => {
  // //         console.log(err)
  // //         {
  // //           ErrorDefaultAlert(JSON.stringify(err.response))
  // //         }
  // //       })
  // }, []);
  return (
    <>
      <PageHead title="Become a tutor - Profile photo" />
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <Cart />

          <div className="rbt-page-banner-wrapper">
            <div className="rbt-banner-image" />
          </div>
          <div className="rbt-dashboard-area rbt-section-overlayping-top rbt-section-gapBottom">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <InstructorDashboardHeader />

                  <div className="row g-5">
                    <div className="col-lg-3">
                      <InstructorDashboardSidebar />
                    </div>

                    <div className="col-lg-9">
                      <Profile />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default TutorProfile;
