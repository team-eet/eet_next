import { useEffect } from "react";
import sal from "sal.js";
import { Provider } from "react-redux";
import BlogData from "../../data/blog/blog.json";
import PageHead from "../Head";
import Store from "@/redux/store";
import Context from "@/context/Context";
import MobileMenu from "@/components/Header/MobileMenu";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import Cart from "@/components/Header/Offcanvas/Cart";
import Banner from "@/components/Common/Banner";
import BlogGrid from "@/components/Blogs/BlogGrid";
import BackToTop from "../backToTop";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";

const BlogGridLayout = () => {  useEffect(() => {
  sal({
    threshold: 0.01,
    once: true,
  });
}, []);
  let getAllBlogs = JSON.parse(JSON.stringify(BlogData.blogGrid));
  return (
    <>
      <PageHead title="Blog Grid - Online Courses & Education NEXTJS14 Template" />
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
          <Cart />

          <Banner col="col-lg-12" text="All Blog" getBlog={getAllBlogs} />
          <div className="rbt-blog-area rbt-section-overlayping-top rbt-section-gapBottom">
            <div className="container">
              <BlogGrid isPagination={true} top={true} start={0} end={6} />
            </div>
          </div>

          <BackToTop />
          <Separator />
          <FooterOne />
        </Context>
      </Provider>
    </>
  );
};

export default BlogGridLayout;
