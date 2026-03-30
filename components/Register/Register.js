import Link from "next/link";
import React, {useState} from "react";
import TestimonialSix from "@/components/Testimonials/Testimonial-Six";
import Basic from "@/components/Register/Registration";
import Registration from "@/components/Register/Registration";

const Register = () => {

    return (
        <>
            <div className="rbt-testimonial-area bg-color-white rbt-section-gapBottom overflow-hidden">
                <div className="">
                    {/*align-items-center  vh-100 shadow style={{ paddingTop: '200px'}}*/}
                    <div className="row g-5 align-items-center">
                        <TestimonialSix/>
                        <div className="col-xl-4">
                            <Registration />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

{/*<div>*/
}
{/*
{/*</div>*/
}

export default Register;
