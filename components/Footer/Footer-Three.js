import Image from "next/image";
import Link from "next/link";

import logo from "../../public/images/logo/eetlogo 1.svg";

import FooterData from "../../data/footer.json";
import SingleFooter from "./FooterProps/SingleFooter";
import CopyRight from "./CopyRight";

const FooterThree = () => {
  return (
    <>
      <footer className="rbt-footer footer-style-1">
        <div className="footer-top">
          <div className="container">
            {FooterData &&
              FooterData.footerOne.map((footer, index) => (
                <div className="row row--15 mt_dec--30" key={index}>
                  <div className="col-lg-3 col-md-6 col-sm-6 col-12 mt--30">
                      <div className="footer-widget">
                          <div className="logo">
                              <Link href="/">
                                  <Image
                                      src={logo}
                                      width={152}
                                      height={50}
                                      priority={true}
                                      alt="Edu-cause"
                                  />
                              </Link>
                          </div>

                          <p className="description mt--20 mb--10">{footer.description}</p>

                          <ul className="social-icon social-default justify-content-start">
                              {footer.socialLink.map((value, innerIndex) => (
                                  <li key={innerIndex}>
                                      <Link href={value.link}>
                                          <i className={value.icon}></i>
                                      </Link>
                                  </li>
                              ))}
                          </ul>

                          <div className="contact-btn mt--30">
                              <Link
                                  className="rbt-btn hover-icon-reverse btn-border-gradient radius-round"
                                  href="/contact"
                              >
                                  <div className="icon-reverse-wrapper">
                                      <span className="btn-text">Contact Us</span>
                                      <span className="btn-icon">
                              <i className="feather-arrow-right"></i>
                            </span>
                                      <span className="btn-icon">
                              <i className="feather-arrow-right"></i>
                            </span>
                                  </div>
                              </Link>
                          </div>
                      </div>
                  </div>

                    <SingleFooter
                        classOne="offset-lg-1 col-lg-2 col-md-6 col-sm-6 col-12 mt--30"
                        title="Useful Links"
                        footerType={footer.usefulLinks}
                    />

                    <SingleFooter
                        classOne="col-lg-3 col-md-6 col-sm-6 col-12 mt--30"
                        title="Our Company"
                        footerType={footer.ourCompany}
                  />

                    <SingleFooter
                        classOne="col-lg-3 col-md-6 col-sm-6 col-12 mt--30"
                        title="Policies"
                        footerType={footer.policies}
                  />

                  {/*<div className="col-lg-3 col-md-6 col-sm-6 col-12 mt--30">*/}
                  {/*  <div className="footer-widget">*/}
                  {/*    <h5 className="ft-title">Get Contact</h5>*/}
                  {/*    <ul className="ft-link">*/}
                  {/*      <li>*/}
                  {/*        <span>Phone:</span>{" "}*/}
                  {/*        <Link href="#">9909080665</Link>*/}
                  {/*      </li>*/}
                  {/*      <li>*/}
                  {/*        <span>E-mail:</span>{" "}*/}
                  {/*        <Link href="info@eetenglish.com">*/}
                  {/*            info@eet.english.com*/}
                  {/*        </Link>*/}
                  {/*      </li>*/}
                  {/*      <li>*/}
                  {/*        <span>Location:</span> Gandhinagar, Gujarat*/}
                  {/*      </li>*/}
                  {/*    </ul>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              ))}
          </div>
        </div>
      </footer>
      <CopyRight />
    </>
  );
};

export default FooterThree;
