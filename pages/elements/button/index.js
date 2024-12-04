import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import Store from "@/redux/store";
import { Provider } from "react-redux";

import Button from "@/components/Button/Button";
import BreadCrumb from "@/components/Common/BreadCrumb";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";

const Page = () => {
  return (
    <>
      <PageHead title="Button - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />
          <BreadCrumb title="Welcome to Histudy Button" text="Button" />

          <Button />

          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default Page;
