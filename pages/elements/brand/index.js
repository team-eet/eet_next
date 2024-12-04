import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import Store from "@/redux/store";
import { Provider } from "react-redux";

import BrandOne from "@/components/Brand/Brand-One";
import BrandThree from "@/components/Brand/Brand-Three";
import BrandTwo from "@/components/Brand/Brand-Two";
import BreadCrumb from "@/components/Common/BreadCrumb";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import BackToTop from "@/pages/backToTop";

const BrandPage = () => {
  return (
    <>
      <PageHead title="Brand - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />
          <BreadCrumb title="Brand" text="Brand" />

          <div className="rbt-brand-area bg-color-white rbt-section-gap">
            <div className="container">
              <BrandOne />
            </div>
          </div>

          <div className="rbt-brand-area bg-color-extra2 rbt-section-gap">
            <BrandTwo />
          </div>

          <div className="rbt-brand-area bg-color-white rbt-section-gap">
            <BrandThree />
          </div>

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default BrandPage;
