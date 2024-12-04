import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import HeaderRightTwo from "../Header-Right/HeaderRight-Two";
import Search from "../Offcanvas/Search";
import Category from "../Category/Category";
import Nav from "../Nav";

import logo from "../../../public/images/logo/eetlogo 1.svg";

const HeaderEight = ({
  headerType,
  gapSpaceBetween,
  sticky,
  headerSticky,
  navigationEnd,
  container,
}) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div
        className={`rbt-header-wrapper ${gapSpaceBetween} ${sticky}  ${
          !headerType && isSticky ? `${headerSticky}` : ""
        }`}
      >
        <div className={`${container}`}>
          <div className={`mainbar-row ${navigationEnd} align-items-center`}>
            <div className="header-left rbt-header-content">
              <div className="header-info">
                <div className="logo">
                  <Link href="/">
                    <Image
                      src={logo}
                      width={152}
                      height={50}
                      priority={true}
                      alt="Education Logo Images"
                    />
                  </Link>
                </div>
              </div>

              {/*<div className="header-info d-none d-lg-block">*/}
              {/*  <Category />*/}
              {/*</div>*/}
            </div>

            <div className="rbt-main-navigation d-none d-xl-block">
              <Nav />
            </div>
            <HeaderRightTwo
              userType="Login"
              btnText="Free Trial"
              btnClass="radius-round btn-sm hover-transform-none"
            />
          </div>
        </div>
        <Search />
      </div>
    </>
  );
};

export default HeaderEight;
