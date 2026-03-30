import React, { useEffect } from "react";
import Context from "@/context/Context";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import { useRouter } from "next/router";

import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import PageHead from "@/pages/Head";
import BackToTop from "@/pages/backToTop";

const ProfileLayout = () => {
  const router = useRouter();
  const postId = router.query.profileId;

  useEffect(() => {
    if (postId === undefined) {
      router.push("/profile/1");
    }
  }, []);

  return (
    <>
      <PageHead title="Profile - Online Courses & Education NEXTJS14 Template" />
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <Cart />

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default ProfileLayout;
