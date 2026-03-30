import Image from "next/image";
import React from "react";

const CourseBanner = ({ bannerImg }) => {
  return (
    <>
        <img src={bannerImg} className={'position-relative'} height={800} width={550} />
        {/*<Image src={bannerImg} className={'position-relative'} height={800} width={550}></Image>*/}
      {/*<Image*/}
      {/*  className="w-100"*/}
      {/*  src={bannerImg}*/}
      {/*  width={800}*/}
      {/*  height={550}*/}
      {/*  priority*/}
      {/*  alt="Card image"*/}
      {/*/>*/}
    </>
  );
};

export default CourseBanner;
