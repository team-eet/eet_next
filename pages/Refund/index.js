import Context from "@/context/Context";
import PageHead from "@/pages/Head";
import Store from "@/redux/store";
import { Provider } from "react-redux";

import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import Instagram from "@/components/Instagram/Instagram";
import PrivacyPolicy from "@/components/Privacy-Policy/PrivacyPolicy";
import TermsOfService from "@/components/Terms&Conditions/TermsOfService";
import RefundPolicy from "@/components/Refund/RefundPolicy";

const Refund = () => {
    return (
        <>
            <PageHead title="Terms & Conditions- Online Courses & Education NEXTJS14 Template" />

            <Provider store={Store}>
                <Context>
                    <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
                    <MobileMenu />
                    <Cart />

                   <RefundPolicy />
                    <FooterOne />
                </Context>
            </Provider>
        </>
    );
};

export default Refund;
