import Image from "next/image";
import React from "react";

const CourseBanner = ({ bannerImg }) => {
  return (
    <>
        <Image className={"position-relative"} src={bannerImg} height={800} width={550}></Image>
    </>
  );
};

export default CourseBanner;
