import { Provider } from "react-redux";
import PageHead from "../Head";
import Store from "@/redux/store";
import Context from "@/context/Context";

import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import BreadCrumb from "@/components/Common/BreadCrumb";
import Checkout from "@/components/Checkout/Checkout";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";

const CheckoutPage = () => {
  return (
    <>
      <PageHead title="Checkout - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />
          <BreadCrumb title="Checkout" text="Checkout" />
          <div className="checkout_area bg-color-white rbt-section-gap">
            <Checkout />
          </div>

          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default CheckoutPage;
