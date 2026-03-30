import Link from "next/link";
import {useEffect, useState} from "react";
import Axios from "axios";
import {API_URL, API_KEY} from "../../constants/constant";
import {useRouter} from "next/router";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
const CartBreadCrumb = ({ title, text }) => {
    const router = useRouter()
    const REACT_APP = API_URL

    const [regId, setregId] = useState('')
    const [showContinue, setshowContinue] = useState(false)
    const [Review, setReview] = useState('')
    useEffect(() => {

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
                                <li className="rbt-breadcrumb-item">
                                    <Link href="/">Home</Link>
                                </li>
                                <li>
                                    <div className="icon-right">
                                        <i className="feather-chevron-right"></i>
                                    </div>
                                </li>
                                <li className="rbt-breadcrumb-item active">{text}</li>
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartBreadCrumb;
