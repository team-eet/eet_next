import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import Context from "@/context/Context";

import MobileMenu from "@/components/Header/MobileMenu";
import HeaderStyleTen from "@/components/Header/HeaderStyle-Ten";
import Cart from "@/components/Header/Offcanvas/Cart";
import BackToTop from "@/pages/backToTop";
// import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";
import CourseHead from "@/components/Batch-Details/Course-Sections/course-head";
import PageHead from "@/pages/Head";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../../../constants/constant";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import BatchDetailsOne from "@/components/Batch-Details/CourseDetails-One";
import FooterThree from "@/components/Footer/Footer-Three";

const SingleCourse = () => {
  const router = useRouter();
  // const postId = parseInt(router.query.courseId);
  const [getbatchData, setbatchData] = useState([])
  const [getFirstName, setFirstName] = useState([])
  const [getLastName, setLastName] = useState([])
  const [getStudentcnt, setStudentcnt] = useState(0)
  const[getsectionItems, setsectionItems] = useState([])
  const REACT_APP = API_URL
  // let getCourse;


  const getEnrollStudent = () => {
    const url = window.location.href
    const parts = url.split("/");
    const  batchId = parts[parts.length - 1];
    const  courseId = parts[parts.length - 2];
    Axios.get(`${API_URL}/api/coursemain/Get_Enrolled_Student/${courseId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            if (res.data.length !== 0) {
              //console.log(res.data)
              setStudentcnt(res.data[0]['ecnt'])
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  const getCourse = () => {
    const url = window.location.href
    const parts = url.split("/");
    const  batchId = parts[parts.length - 1];
    const  courseId = parts[parts.length - 2];
    // console.log(courseId, batchId)
    Axios.get(`${API_URL}/api/coursemain/GetBatchCoursesOnly/${batchId}`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            if (res.data.length !== 0) {
              console.log('Final Result', res.data)
              setbatchData(res.data)
              if (res.data[0].nTBId === null) {
                setFirstName(res.data[0].sFName)
                setLastName(res.data[0].sLName)
              } else {
                //get created by from tutor

                Axios.get(`${API_URL}/api/coursemain/GetBatchCourseCreatedBy/${batchId}`, {
                  headers: {
                    ApiKey: `${API_KEY}`
                  }
                })
                    .then(res => {
                      if (res.data) {
                        console.log('Names', res.data)
                        if (res.data.length !== 0) {
                          setFirstName(res.data[0].sFName)
                          setLastName(res.data[0].sLName)
                        }
                      }
                    })
                    .catch(err => {
                      { ErrorDefaultAlert(err) }
                    })

              }
              // setBatchData()
              // this.setState({
              //   nATId: res.data[0].nATId,
              //   sCourseTitle: res.data[0].sCourseTitle,
              //   sShortDesc: res.data[0].sShortDesc,
              //   sFullDesc: res.data[0].sFullDesc,
              //   dUpdatedDate: res.data[0].dUpdatedDate,
              //   sVideoPath: res.data[0].sVideoPath,
              //   dbatchstartdate: res.data[0].dBatchStartDate,
              //   dbatchenddate: res.data[0].dBatchEndDate,
              //   batchduration: res.data[0].nBatchDurationDays,
              //   // sFName: res.data[0].sF.Name,
              //   // sLName: res.data[0].sLName,
              //   sVideoURL: res.data[0].sVideoURL,
              //   sImagePath: (res.data[0].sImagePath) ? res.data[0].sImagePath : res.data[0].crsimg,
              //   sLevel: res.data[0].sLevel,
              //   sCategory: res.data[0].sCategory,
              //   //bIsAccosiateCourse: res.data[0].bIsAccosiateCourse,
              //   //bIsAccosiateModule: res.data[0].bIsAccosiateModule,
              //   //bIsWithBatch: res.data[0].bIsWithBatch,
              //   dAmount: res.data[0].dAmount,
              //   //dBatchPrice: res.data[0].dBatchPrice,
              //   tbid: res.data[0].nTBId,
              //   startTime: res.data[0].sBatchStartTime,
              //   endTime: res.data[0].sBatchEndTime,
              //   Days: JSON.parse(res.data[0].sDays)
              // })
              // const days = JSON.parse(res.data[0].sDays)
              //
              // const orderOfDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
              //
              // const sortedDays = days.sort((a, b) => {
              //   return orderOfDays.indexOf(a) - orderOfDays.indexOf(b)
              // })


              // this.setState({ Days: sortedDays })
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })

  }
  // getCourse = JSON.parse(JSON.stringify(CourseData.courseDetails));

  const checkMatch = getbatchData.length !== 0 ? getbatchData[0] : ''
  // console.log(checkMatch)
  // console.log(EncryptData(postId), EncryptData(0))


  const courseContentMatch = getsectionItems.length !== 0 ? getsectionItems : ''


  useEffect(() => {
      getCourse();
      getEnrollStudent();
      // getcourseContent();
    // console.log(postId, checkMatch)
    // if (postId && checkMatch === undefined) {
    //   router.push("/course-filter-one-toggle");
    // }

    // sal({
    //   threshold: 0.01,
    //   once: true,
    // });
  }, []);

  return (
    <>
      <PageHead title="Batch Details - Online Courses & Education NEXTJS14 Template" />
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <HeaderStyleTen headerSticky="" headerType={true} />
          <Cart />

          <div className="rbt-breadcrumb-default rbt-breadcrumb-style-3">
            <CourseHead getstdcnt={getStudentcnt} getFname={getFirstName} getLname={getLastName}
              checkMatch={checkMatch !== undefined ? checkMatch : ""}
            />
          </div>

          <div className="rbt-course-details-area ptb--60">
            <div className="container">
              <div className="row g-5">
                <BatchDetailsOne getFname={getFirstName} getLname={getLastName}
                  checkMatchCourses={checkMatch !== undefined ? checkMatch : ""}
                />
              </div>
            </div>
          </div>

          <BackToTop />
          {/*<Separator />*/}
          {/*<FooterOne />*/}
          <FooterThree />
        </Context>
      </Provider>
    </>
  );
};

export default SingleCourse;
