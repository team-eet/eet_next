import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import Profile from "@/components/Student/Profile";
import StudentDashboardHeader from "@/components/Student/StudentDashboardHeader";
import StudentDashboardSidebar from "@/components/Student/StudentDashboardSidebar";
import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import BackToTop from "@/pages/backToTop";
import Store from "@/redux/store";
import { Provider } from "react-redux";
import {useEffect, useState} from "react";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import FooterThree from "@/components/Footer/Footer-Three";
const StudentProfile = () => {

  return (
    <>
      <PageHead title="Student Profile - Online Courses & Education NEXTJS14 Template" />

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
                  {/*<StudentDashboardHeader />*/}

                  <div className="row g-5">
                    <div className="col-lg-3">
                      <StudentDashboardSidebar />
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
          {/*<FooterOne />*/}
          <FooterThree />
        </Context>
      </Provider>
    </>
  );
};

export default StudentProfile;
