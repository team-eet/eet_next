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
import FooterThree from "@/components/Footer/Footer-Three";

const TermsConditions = () => {
    return (
        <>
            <PageHead title="Terms And Conditions" />

            <Provider store={Store}>
                <Context>
                    <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
                    <MobileMenu />
                    <Cart />

                    <TermsOfService />
                    {/*<FooterOne />*/}
                    <FooterThree />
                </Context>
            </Provider>
        </>
    );
};

export default TermsConditions;
