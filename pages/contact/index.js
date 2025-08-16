import PageHead from "../Head";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import Context from "@/context/Context";

import Contact from "@/components/Contacts/Contact";
import ContactForm from "@/components/Contacts/Contact-Form";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import FooterOne from "@/components/Footer/Footer-One";
import FooterThree from "@/components/Footer/Footer-Three";

const ContactPage = () => {
  return (
    <>
      <PageHead title="Contact - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <MobileMenu />
          <Cart />

          <div className="rbt-conatct-area bg-gradient-11 rbt-section-gap">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="section-title text-center mb--60">
                    <span className="subtitle bg-secondary-opacity">
                      Contact Us
                    </span>
                    <h2 className="title">
                      You can contact us
                    </h2>
                  </div>
                </div>
              </div>
              <Contact />
            </div>
          </div>

          {/* <ContactForm /> */}

          <div className="rbt-google-map bg-color-white rbt-section-gapTop">
            {/*<iframe*/}
            {/*    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.5971381704053!2d72.631637!3d23.184899200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2b9940c4e883%3A0xa9cbf9b99eb71cdf!2sGNYANAM%20ENGLISH%20INSTITUTE!5e0!3m2!1sen!2sin!4v1724331710206!5m2!1sen!2sin"*/}
            {/*    width="600" height="450" style="border:0;" allowFullScreen="" loading="lazy"*/}
            {/*    referrerPolicy="no-referrer-when-downgrade"></iframe>*/}
            <iframe
                className="w-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.5971381704053!2d72.631637!3d23.184899200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2b9940c4e883%3A0xa9cbf9b99eb71cdf!2sGNYANAM%20ENGLISH%20INSTITUTE!5e0!3m2!1sen!2sin!4v1724331710206!5m2!1sen!2sin"
                height="600"
                style={{border: "0"}}
            ></iframe>
          </div>

          {/*<FooterOne/>*/}
          <FooterThree/>
        </Context>
      </Provider>
    </>
  );
};

export default ContactPage;
