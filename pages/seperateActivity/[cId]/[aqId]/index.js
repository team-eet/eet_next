import PageHead from "../../../Head";

import Context from "@/context/Context";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import MainDemo from "@/components/01-Main-Demo/01-Main-Demo";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
// import Cart from ''
// import Separator from
import CourseLesson from "@/components/CourseLesson/lesson";
import AllCourses from "@/components/AllCourse/allcourses";

import SeperateActivity from '@/components/seperatectivity/sepActvity'


const Courselesson = () => {
    return (
        <>
            <PageHead title={"Activity - Seperate Activity"} />

            <Provider store={Store}>
                <Context>

                    {/**/}

                    {/*<MobileMenu />*/}
                    <HeaderStyleTen headerSticky="rbt-sticky" headerType="" />
                    <SeperateActivity />

                    {/*<Separator />*/}
                    {/*<FooterThree />*/}
                </Context>
            </Provider>
        </>
    );
};

export default Courselesson;
