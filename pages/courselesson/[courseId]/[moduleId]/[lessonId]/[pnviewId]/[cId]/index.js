import PageHead from "../../../../../../Head";

import Context from "@/context/Context";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import MainDemo from "@/components/01-Main-Demo/01-Main-Demo";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import CourseLesson from "@/components/CourseLesson/lesson";
import AllCourses from "@/components/AllCourse/allcourses";


const Courselesson = () => {
    return (
        <>
            <PageHead title="Home - Online Courses & Education NEXTJS14 Template" />

            <Provider store={Store}>
                <Context>
                    <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
                    <CourseLesson />

                </Context>
            </Provider>
        </>
    );
};

export default Courselesson;
