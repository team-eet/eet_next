import Context from "@/context/Context";
import Store from "@/redux/store";
import { Provider } from "react-redux";

import BreadCrumb from "@/components/Common/BreadCrumb";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import StyleGuide from "@/components/StyleGuide/StyleGuide";
import PageHead from "@/pages/Head";
import BackToTop from "@/pages/backToTop";

const StyleGuidePage = () => {
  return (
    <>
      <PageHead title="Style Guide - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="" headerType={true} />
          <MobileMenu />
          <Cart />
          <BreadCrumb title="Style Guide" text="Style Guide" />

          <div className="rbt-style-guide-area rbt-section-gap">
            <StyleGuide />
          </div>

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default StyleGuidePage;
