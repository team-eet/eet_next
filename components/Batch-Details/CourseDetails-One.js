import Content from "./Course-Sections/Content";
import CourseMenu from "./Course-Sections/Course-Menu";
import Instructor from "./Course-Sections/Instructor";
import Overview from "./Course-Sections/Overview";
import Requirements from "./Course-Sections/Requirements";
import Review from "./Course-Sections/Review";
import Viedo from "./Course-Sections/Viedo";


const CourseDetailsOne = ({ checkMatchCourses }) => {
  // console.log(checkMatchCourses)
  return (
    <>
      <div className="col-lg-8 mt-0">
        <div className="course-details-content">
          {/*<div className="rbt-course-feature-box rbt-shadow-box thuumbnail">*/}
          {/*  {checkMatchCourses.sImagePath && (*/}
          {/*    <CourseBanner bannerImg={checkMatchCourses.sImagePath} />*/}
          {/*  )}*/}
          {/*</div>*/}
          <div className="rbt-inner-onepage-navigation sticky-top">
            <CourseMenu />
          </div>


          {checkMatchCourses &&
            checkMatchCourses.sFullDesc ?
              <Overview checkMatchCourses={checkMatchCourses.sFullDesc} /> : ''
            }

          <div
            className="course-content rbt-shadow-box coursecontent-wrapper mt--30"
            id="coursecontent"
          >
            {/*{console.log(getsectionItems)}*/}

            <Content />

            {/*{checkMatchCourses ?*/}
            {/*  checkMatchCourses.map((data, index) => (*/}
            {/*    <Content {...data} key={index} checkMatchCourses={data} />*/}
            {/*  )) : ''*/}
            {/*}*/}
          </div>

          <div
            className="rbt-course-feature-box rbt-shadow-box details-wrapper mt--30"
            id="details"
          >
            <div className="row g-5">
              {checkMatchCourses.sPrerequisite &&
                  <Requirements
                    checkMatchCourses={checkMatchCourses.sPrerequisite}
                  />
              }
            </div>
          </div>
          <div
            className="rbt-instructor rbt-shadow-box intructor-wrapper mt--30"
            id="intructor"
          >
            {checkMatchCourses &&

                <Instructor checkMatchCourses={checkMatchCourses} />
            }
          </div>
          <div
            className="rbt-review-wrapper rbt-shadow-box review-wrapper mt--30"
            id="review"
          >
            <Review />
          </div>

          {/*{checkMatchCourses &&*/}
          {/*  checkMatchCourses.featuredReview.map((data, index) => (*/}
          {/*    <Featured {...data} key={index} coursesFeatured={data} />*/}
          {/*  ))}*/}
        </div>
        <div className="related-course mt--60">
          {/*{checkMatchCourses &&*/}
          {/*  checkMatchCourses.relatedCourse.map((data, index) => (*/}
          {/*    <RelatedCourse {...data} key={index} checkMatchCourses={data} />*/}
          {/*  ))}*/}
        </div>
      </div>

      <div className="col-lg-4">
        <div className="course-sidebar sticky-top rbt-shadow-box course-sidebar-top rbt-gradient-border">
          <div className="inner">
            <Viedo checkMatchCourses={checkMatchCourses && checkMatchCourses} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsOne;
