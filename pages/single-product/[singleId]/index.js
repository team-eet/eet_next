import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHead from "@/pages/Head";

import ShopData from "../../../data/shop.json";

import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import Separator from "@/components/Common/Separator";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";

import Context from "@/context/Context";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import SingleProduct from "@/components/Single-Product/SingleProduct";
import FooterOne from "@/components/Footer/Footer-One";

const SingleProductPage = () => {
  const router = useRouter();
  const productId = parseInt(router.query.singleId);
  let getProduct;

  getProduct = JSON.parse(JSON.stringify(ShopData.shop));

  const checkMatch = getProduct.find((product) => product.id === productId);

  useEffect(() => {
    if (productId && checkMatch === undefined) {
      router.push("/shop");
    }
  }, [checkMatch, router]);

  return (
    <>
      <PageHead title="Single Product - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <Cart />

          <SingleProduct
            checkMatchProduct={checkMatch !== undefined ? checkMatch : ""}
          />

          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default SingleProductPage;
