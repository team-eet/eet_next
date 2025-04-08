import Link from "next/link";
import {useEffect, useState} from "react";
import Axios from "axios";
import {API_URL, API_KEY} from "../../constants/constant";
import {useRouter} from "next/router";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import confetti from 'canvas-confetti';
const VerifyBreadCrumb = ({ title, text }) => {
    const router = useRouter()
    const REACT_APP = API_URL

    const [regId, setregId] = useState('')
    const [showContinue, setshowContinue] = useState(false)
    useEffect(() => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.5, {
            spread: 70,
            startVelocity: 55,
        });
        fire(0.5, {
            spread: 60,
        });
        fire(0.5, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.5, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.5, {
            spread: 120,
            startVelocity: 45,
        });
        if(localStorage.getItem('userData')) {
            setregId(DecryptData(localStorage.getItem('userData')).regid)
        }
        Axios.get(`${API_URL}/api/TutorBasics/GetTutorProfile/${DecryptData(localStorage.getItem('userData')).regid}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                // console.log(res.data)
                // if(res.data.)
                if(res.data.length !== 0){
                    if(res.data[0].cnt !== 0) {
                        setshowContinue(true)
                    } else {
                        setshowContinue(false)
                    }
                }

            })
            .catch(err => {
                console.log(err)
                { ErrorDefaultAlert(err) }
            })
    }, [])
    return (

        // linear-gradient(270deg, var(--color-secondary) 0, var(--color-primary) 100%) !important
        <div className="rbt-breadcrumb-default ptb--100 ptb_md--50 ptb_sm--30 bg-gradient-9">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="breadcrumb-inner text-center">
                            {/*<div className={'bg-gradient-10 text-dark'}>abc</div>*/}
                            <h2 className="title">{title}</h2>
                            <ul className="page-list">
                                <li className="rbt-breadcrumb-item active text-dark">Congratulations on embarking on this fulfilling path as a tutor</li>
                            </ul>
                            {showContinue ? <>
                                <a
                                    className="rbt-btn btn-gradient hover-icon-reverse radius-round mt-3 ms-3"
                                    href="https://eet-frontend.azurewebsites.net/tutorbatch/dashboard"
                                    target={'_blank'}
                                >
                                    <span className="icon-reverse-wrapper">
                                      <span className="btn-text">Go to dashboard</span>
                                      <span className="btn-icon">
                                        <i className="feather-arrow-right"></i>
                                      </span>
                                      <span className="btn-icon">
                                        <i className="feather-arrow-right"></i>
                                      </span>
                                    </span>
                                </a>
                            </> : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyBreadCrumb;
