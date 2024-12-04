import Image from "next/image";
import Link from "next/link";

import AboutData from "../../data/elements/about.json";

const AboutTwo = () => {
  return (
      <>
        {AboutData &&
            AboutData.aboutTwo.map((data, index) => (
                <div className="row g-5 align-items-center" key={index}>
                  <div className="col-lg-6">
                    <div className="thumbnail-wrapper">
                      {data.images.map((img) => (
                          <div
                              className={`thumbnail image-${img.id} ${img.class}`}
                              key={img.id}
                          >
                            <Image
                                data-parallax='{"x": 0, "y": -20}'
                                src={img.image}
                                width={img.width}
                                height={img.height}
                                alt="Education Images"
                            />
                          </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="inner pl--50 pl_sm--0 pl_md--0">
                      <div className="section-title text-start">
                        {/*<span className="subtitle bg-coral-opacity">{data.tag}</span>*/}
                        <h2 className="title">
                          Top most reasons
                          Why you should connect with us....
                        </h2>
                      </div>

                      {/*<p className="description mt--30">{data.desc}</p>*/}

                      <div className="rbt-feature-wrapper mt--20 ml_dec_20">
                        {data.children.map((item, innerIndex) => (
                            <div
                                className="rbt-feature feature-style-2 rbt-radius"
                                key={innerIndex}
                            >
                              <div
                                  className={`icon ${
                                      item.isPrimary
                                          ? "bg-primary-opacity"
                                          : "bg-pink-opacity"
                                  }`}
                              >
                                <i className={item.icon}></i>
                              </div>
                              <div className="feature-content">
                                <h6 className="feature-title">{item.title}</h6>
                                <p className="feature-description">{item.info}</p>
                              </div>
                            </div>
                        ))}
                      </div>

                      {/*<div className="about-btn mt--40">*/}
                      {/*  <Link*/}
                      {/*    className="rbt-btn btn-gradient hover-icon-reverse"*/}
                      {/*    href="#"*/}
                      {/*  >*/}
                      {/*    <span className="icon-reverse-wrapper">*/}
                      {/*      <span className="btn-text">More About Us</span>*/}
                      {/*      <span className="btn-icon">*/}
                      {/*        <i className="feather-arrow-right"></i>*/}
                      {/*      </span>*/}
                      {/*      <span className="btn-icon">*/}
                      {/*        <i className="feather-arrow-right"></i>*/}
                      {/*      </span>*/}
                      {/*    </span>*/}
                      {/*  </Link>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                </div>
            ))}
      </>
  );
};

export default AboutTwo;
