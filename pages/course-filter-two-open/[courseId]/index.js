import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import Context from "@/context/Context";

import CategoryHeadTwo from "@/components/Category/CategoryHeadTwo";
import CourseFilterOneOpen from "@/components/Category/Filter/CourseFilterOneOpen";
import PageHead from "@/pages/Head";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import BackToTop from "@/pages/backToTop";
import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";

import CourseDetails from "../../../data/course-details/courseData.json";

const Page = () => {
  const router = useRouter();
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      const courseId = router.query.courseId;
      const slugifiedCourseId = slugify(courseId);

      const getCourse = JSON.parse(JSON.stringify(CourseDetails.courseDetails));
      const checkMatchCourse = getCourse.filter(
        (course) => slugify(course.category) === slugifiedCourseId
      );

      setFilteredCourses(checkMatchCourse);
    }
  }, [router.isReady, router.query.courseId]);
  return (
    <>
      <PageHead title="Course Filter Two Open - Online Courses & Education NEXTJS14 Template" />

      <Provider store={Store}>
        <Context>
          <HeaderStyleTen headerSticky="rbt-sticky" headerType={true} />
          <MobileMenu />
          <Cart />

          <CategoryHeadTwo category={filteredCourses[0]} />

          <div className="rbt-section-overlayping-top rbt-section-gapBottom">
            <div className="inner">
              <div className="container">
                <CourseFilterOneOpen course={filteredCourses} />
              </div>
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

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\d+/g, "") // Remove all numeric digits
    .replace("&", "")
    .replace(/\s+/g, " ") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export default Page;
