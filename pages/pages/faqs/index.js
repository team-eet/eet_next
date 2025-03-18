import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import Store from "@/redux/store";
import { Provider } from "react-redux";

import BreadCrumb from "@/components/Common/BreadCrumb";
import Separator from "@/components/Common/Separator";
import ContactForm from "@/components/Contacts/Contact-Form";
import Faq from "@/components/Faqs/Faq";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import FooterThree from "@/components/Footer/Footer-Three";

const FaqsPage = () => {
  return (
    <>
      <PageHead title="Faqs - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />
          <BreadCrumb title="FAQs" text="FAQs" />

          <div className="rbt-accordion-area accordion-style-1 bg-color-white rbt-section-gap">
            <Faq />
          </div>
          <ContactForm gap="rbt-section-gap" />

          <Separator />
          {/*<FooterOne />*/}
          <FooterThree />
        </Context>
      </Provider>
    </>
  );
};

export default FaqsPage;
