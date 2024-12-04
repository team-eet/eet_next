import Image from "next/image";

import CourseBreadcrumb from "./Course-Breadcrumb";

import bgImage from "../../../public/images/bg/bg-image-10.jpg";
import { useRouter } from "next/router";
import CourseBreadcrumbTwo from "./CourseBreadcrumb-Two";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {useEffect, useState} from "react";

const CourseHead = ({ checkMatch, getFname, getLname, getstdcnt, CourseTag, Tag }) => {
  // console.log(checkMatch)
  const router = useRouter();
  const path = router.pathname;


  return (
    <>
      {path === "/course-details-2/[courseId]" ? (
        <>
          <div className="container">
            <div className="row">
                <CourseBreadcrumbTwo getMatchCourse={checkMatch && checkMatch} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="breadcrumb-inner">
            <Image src={bgImage} alt="Education Images" />
          </div>
          <div className="container">
            <div className="row">
                <CourseBreadcrumb Tag={Tag} CourseTag={CourseTag} getstdcnt={getstdcnt} getName1={getFname} getName2={getLname} getMatchCourse={checkMatch && checkMatch} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CourseHead;
