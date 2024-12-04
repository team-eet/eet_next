import { useEffect, useState } from "react";

import PageHead from "../Head";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import Context from "@/context/Context";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";

import BackToTop from "../backToTop";
import Separator from "@/components/Common/Separator";
import FooterTwo from "@/components/Footer/Footer-Two";
import CreateCourse from "@/components/create-course/CreateCourse";

const CreateCourseLayout = () => {
  return (
    <>
      <PageHead title="Create  Course - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType={true} />
          <MobileMenu />
          <Cart />

          <div className="rbt-create-course-area bg-color-white rbt-section-gap">
            <div className="container">
              <CreateCourse />
            </div>
          </div>

          <Separator />
          <BackToTop />
          <FooterTwo />
        </Context>
      </Provider>
    </>
  );
};

export default CreateCourseLayout;
