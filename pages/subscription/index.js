import Context from "@/context/Context";
import Store from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";

import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import PageHead from "@/pages/Head";
import BackToTop from "@/pages/backToTop";
import FooterThree from "@/components/Footer/Footer-Three";
import BreadCrumb from "@/components/Common/BreadCrumb";
import PricingThree from "@/components/Pricing/Pricing-Three";

const SubscriptionPage = () => {
  return (
    <>
      <PageHead title="Subscription - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />
          <BreadCrumb title="Subscription" text="Subscription" />

          <div className="rbt-pricing-area bg-color-white rbt-section-gap">
            <PricingThree title="" tag="" col="col-12" position="text-center" />
          </div>

          <BackToTop />
          <FooterThree />
        </Context>
      </Provider>
    </>
  );
};

export default SubscriptionPage;
