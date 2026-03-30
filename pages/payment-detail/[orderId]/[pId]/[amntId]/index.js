import Link from "next/link";

import {useEffect, useState} from "react";
import SuccessFile from "@/components/PaymentSuccess/successfile";
import PageHead from "@/pages/Head";
import {Provider} from "react-redux";
import Store from "@/redux/store";
import Context from "@/context/Context";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import CartBreadCrumb from "@/components/Common/Cart-BreadCrumb";
import CartPage from "@/components/Cart/CartPage";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";

const SuccessPage = () => {


    return (
        <>
            <PageHead title="Success" />

            <Provider store={Store}>
                <Context>
                    <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
                    <MobileMenu />
                    <Cart />
                    {/*<CartBreadCrumb title="Cart" text="Cart" />*/}
                    <div className="rbt-cart-area bg-color-white rbt-section-gap">
                        <SuccessFile />
                    </div>

                    <Separator />
                    <FooterOne />
                </Context>
            </Provider>
        </>
    );
};

export default SuccessPage
