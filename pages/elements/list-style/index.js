import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import Store from "@/redux/store";
import { Provider } from "react-redux";

import BreadCrumb from "@/components/Common/BreadCrumb";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import ListStyle from "@/components/ListStyle/List-Style";
import BackToTop from "@/pages/backToTop";

const ListStylePage = () => {
  return (
    <>
      <PageHead title="List Style - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />
          <BreadCrumb title="List Style" text="List Style" />

          <div className="rbt-list-style-area bg-color-white rbt-section-gap">
            <ListStyle />
          </div>

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default ListStylePage;
