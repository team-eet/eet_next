import PageHead from "../Head";

import Context from "@/context/Context";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import AllCoursetwo from "@/components/AllCourse/allcourse";
const AllCourse = () => {
    return (
        <>
            <PageHead title="Courses - EET English" />

            <Provider store={Store}>
                <Context>

                    {/*<CourseLesson />*/}

                    {/*<MobileMenu />*/}
                    <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
                    {/*<AllCourses />*/}

                    <AllCoursetwo />

                    {/*<Cart />*/}

                    {/*<Separator />*/}
                    {/*<FooterThree />*/}
                </Context>
            </Provider>
        </>
    );
};

export default AllCourse;
