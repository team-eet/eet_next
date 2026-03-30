import Image from "next/image";
import React from "react";

const CourseBanner = ({ bannerImg }) => {
  return (
    <>
      <Image
        className="position-relative"
        src={bannerImg}
        width={800}
        height={550}
        priority
        alt="Card image"
      />
    </>
  );
};

export default CourseBanner;
