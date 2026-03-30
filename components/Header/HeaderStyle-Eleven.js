import HeaderNine from "./Headers/Header-Nine";

const HeaderStyleEleven = () => {
  return (
    <>
      <header className="rbt-header rbt-header-10 rbt-transparent-header">
        <div className="rbt-sticky-placeholder"></div>
        <HeaderNine
          transparent="header-not-transparent header-sticky"
          gapSpaceBetween=""
          navigationEnd="rbt-navigation-center"
          btnClass="rbt-marquee-btn marquee-auto btn-border-gradient radius-round btn-sm hover-transform-none"
          btnText="Enroll Now"
        />
      </header>
    </>
  );
};

export default HeaderStyleEleven;
