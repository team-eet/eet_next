import dynamic from "next/dynamic";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import NewsletterData from "../../data/elements/newsletter.json";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import {API_KEY, API_URL} from "@/constants/constant";

const MySwal = withReactContent(Swal)

const Odometer = dynamic(() => import("react-odometerjs"), {
    ssr: false,
    loading: () => 0,
});

const NewsletterTwo = () => {
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
    });

    return (
        <div className="container">
            <div className="row row--15 align-items-center">
                <div className="col-lg-12">
                    {NewsletterData &&
                        NewsletterData.newsletterTwo.map((data, index) => (
                            <div className="inner text-center" key={index}>
                                <div className="section-title text-center">
                  <span className="subtitle bg-white-opacity">
                    {data.subTitle}
                  </span>
                                    <h2 className="title color-white">
                                        <strong>{data.strong}</strong> {data.title}
                                    </h2>
                                    <p className="description color-white mt--20">{data.desc}</p>
                                </div>
                                <Formik
                                    initialValues={{ email: "" }}
                                    validationSchema={validationSchema}
                                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                                        try {
                                            // Request Data
                                            const requestData = {
                                                sSID: "1",
                                                sSubEmail: values.email,
                                                sSubStatus: "1",
                                            };

                                            // API Call
                                            const response = await axios.post(
                                                `${API_URL}/api/companySettings/EmailSubscription`,
                                                requestData,
                                                {
                                                    headers: {
                                                        ApiKey: API_KEY,
                                                        "Content-Type": "application/json",
                                                    },
                                                }
                                            );

                                            Swal.fire({
                                                icon: "success",
                                                title: "Success!",
                                                text: "You have successfully subscribed!",
                                            });

                                            resetForm();
                                        } catch (error) {
                                            Swal.fire({
                                                icon: "error",
                                                title: "Error!",
                                                text: "Something went wrong. Please try again.",
                                            });
                                        } finally {
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {({ isSubmitting,errors,touched }) => (
                                        <Form>
                                            <div className="subscription newsletter-form-1 mt--40">
                                                <Field
                                                    className={`form-control ${errors.email && touched.email ? 'invalidEmail' : ''}`}
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter Your E-Email"
                                                />

                                                <button
                                                    type="submit"
                                                    className="rbt-btn btn-md btn-gradient hover-icon-reverse"
                                                    disabled={isSubmitting}
                                                >
                                            <span className="icon-reverse-wrapper">
                                              <span className="btn-text">Subscribe</span>
                                              <span className="btn-icon">
                                                <i className="feather-arrow-right"></i>
                                              </span>
                                              <span className="btn-icon">
                                                <i className="feather-arrow-right"></i>
                                              </span>
                                            </span>
                                                </button>
                                            </div>
                                            <ErrorMessage name="email" component="p" className="text-white"/>
                                        </Form>
                                    )}
                                </Formik>
                                <div className="row row--15 mt--50">
                                    {data.body.map((item, innerIndex) => (
                                        <div
                                            className={`col-lg-3 col-sm-6 col-md-6 single-counter ${
                                                item.offset ? "" : "single-counter"
                                            }`}
                                            key={innerIndex}
                                        >
                                            <div className="rbt-counterup rbt-hover-03 style-2 text-color-white">
                                                <div className="inner">
                                                    <div className="content">
                                                        <h3 className="counter color-white">
                              <span className="odometer">
                                <Odometer value={item.num} />
                              </span>
                                                        </h3>
                                                        <h6 className="title color-white">{item.title}</h6>
                                                        <h5 className="title color-white">{item.subTitle}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default NewsletterTwo;
