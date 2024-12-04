import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import InstructorDashboardHeader from "@/components/Become-a-Tutor/InstructorDashboardHeader";
import InstructorDashboardSidebar from "@/components/Become-a-Tutor/InstructorDashboardSidebar";
import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import BackToTop from "@/pages/backToTop";
import Store from "@/redux/store";
import React, {useEffect, useState} from "react";
import { Provider } from "react-redux";
import Basics from "@/components/Become-a-Tutor/Basics";

const BasicsDashboard = () => {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const url = window.location.href
    const parts = url.split("/");
    const postId = parts[parts.length - 1];
    // console.log(postId)
    setUrl(postId)
    // if(postId === 'basics') {
    //   alert('basics')
    // }
  }, []);
  return (
    <>
      <PageHead title="Become a tutor - Basics" />
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
                      <InstructorDashboardSidebar url={url}/>
                    </div>

                    <div className="col-lg-9">
                      <Basics />
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

export default BasicsDashboard;
