import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import Login from "@/components/Login/Login";
import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import BackToTop from "@/pages/backToTop";
import Store from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";

const LoginPage = () => {
  return (
    <>
      <PageHead title="Login & Register " />
      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />

          <div className="rbt-elements-area bg-color-white">
              <div className="row row--30 mt-5 mb-5 justify-content-center">
                <Login />
              </div>
          </div>
          <BackToTop />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default LoginPage;
