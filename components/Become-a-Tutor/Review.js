import Link from "next/link";
import React, {useEffect, useState} from "react";
import {API_URL, API_KEY} from '../../constants/constant'
import Axios from "axios";
import {Alert, CustomInput} from "reactstrap";
import Select, { components } from "react-select";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { useRouter } from "next/router";

const ReviewPage = () => {
    const REACT_APP = API_URL
    const router = useRouter()
    const [country, setCountry] = useState([]);
    const [countryId, setcountryId] = useState('101')
    const [duration, setDuration] = useState('')
    const [timeSlot, setTimeSlot] = useState('')
    const [weekendBatch, setWeekendBatch] = useState('')
    const [teachingDays, setTeachingDays] = useState([])


    return (
        <>
            <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                <div className="content">

                    <div className={'text-center'}>
                        <img src={'/images/loading.gif'}></img>
                    </div>
                    <h3 className={'text-center'}>Your tutor account is under review</h3>
                    <p className="btn-text text-center">Thanks for submitting your interests with us!</p>
                    <div className="text-center mt-5">
                        <div className="form-submit-group">
                            <button type="submit" className="rbt-btn btn-md btn-gradient hover-icon-reverse">
                                <Link href={"/"} className={'text-white'}>
                                    <span className="icon-reverse-wrapper">
                                     <span className="btn-text">Home</span>
                                      <span className="btn-icon">
                                        <i className="feather-arrow-right"></i>
                                      </span>
                                      <span className="btn-icon">
                                        <i className="feather-arrow-right"></i>
                                      </span>
                                    </span>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewPage;


