import { Provider } from "react-redux";
import PageHead from "../Head";
import Store from "@/redux/store";
import Context from "@/context/Context";

import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import CartPage from "@/components/Cart/CartPage";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import CartBreadCrumb from "@/components/Common/Cart-BreadCrumb";
import FooterThree from "@/components/Footer/Footer-Three";
import withAuth from "@/components/Utils/withAuth";

const CartPageLayout = () => {
  return (
    <>
      <PageHead title="Cart - EET English" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />
          <CartBreadCrumb title="Cart" text="Cart" />
          <div className="rbt-cart-area bg-color-white rbt-section-gap">
            <CartPage />
          </div>

          <Separator />
          {/*<FooterOne />*/}
          <FooterThree />
        </Context>
      </Provider>
    </>
  );
};

export default withAuth(CartPageLayout);
