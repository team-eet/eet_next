import Image from "next/image";
import Link from "next/link";
import {API_URL, API_KEY} from "../../constants/constant";
import {useEffect, useState} from "react";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import Pagination from "@/components/Common/Pagination";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import bgImg from "@/public/images/bg/bg-image-10.jpg";
import img from "@/public/images/blog/blog-card-01.jpg";
import service from '@/public/images/service/istockphoto-1272954248-612x612.jpg'
import parse from 'html-react-parser'

const RefundPolicy = () => {
    const REACT_APP = API_URL

    const [refund, setRefund] = useState('')

    const  FillPrivacy = () => {
        Axios.get(`${API_URL}/api/privacyPolicy/FillPrivacyPolicy`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    if (res.data.length !== 0) {
                        // console.log(res.data)
                        setRefund(res.data[0].sPricingPromotionsPolicy)
                        // this.setState({
                        // sTermsOfUse: res.data[0].sTermsOfUse,
                        // sPrivacyPolicy: res.data[0].sPrivacyPolicy,
                        // sIntellectualPolicy: res.data[0].sIntellectualPolicy,
                        // sAPIAgreement: res.data[0].sAPIAgreement,
                        // sMasterServiceAgreement: res.data[0].sMasterServiceAgreement,
                        // sBusinessPrivacyStatement: res.data[0].sBusinessPrivacyStatement,
                        // sAffiliateTermsConditions: res.data[0].sAffiliateTermsConditions,
                        // sCorpUTermsConditions: res.data[0].sCorpUTermsConditions,
                        // sBusinessProTermsConditions: res.data[0].sBusinessProTermsConditions,
                        // sCreditsProgram: res.data[0].sCreditsProgram,
                        // sPricingPromotionsPolicy: res.data[0].sPricingPromotionsPolicy
                        // })
                    }
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }

            })
    }

    useEffect(() => {
        FillPrivacy()
    }, [])



    return (
        <>
            <div className="rbt-overlay-page-wrapper">
                <div className="breadcrumb-image-container breadcrumb-style-max-width">
                    <div className="breadcrumb-image-wrapper">
                        <Image src={bgImg} alt="Education Images" />
                    </div>
                    <div className="breadcrumb-content-top text-center">
                        <h1 className="title">Refund Policy</h1>
                        {/*<p className="mb--20">Histudy Course Privacy Policy Here.</p>*/}
                        <ul className="page-list">
                            <li className="rbt-breadcrumb-item">
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <div className="icon-right">
                                    <i className="feather-chevron-right"></i>
                                </div>
                            </li>
                            <li className="rbt-breadcrumb-item active">Refund Policy</li>
                        </ul>
                    </div>
                </div>

                <div className="rbt-putchase-guide-area breadcrumb-style-max-width rbt-section-gapBottom">
                    <div className="rbt-article-content-wrapper">
                        <div className="post-thumbnail mb--30 position-relative wp-block-image alignwide">
                            <img className="w-100" src={'/images/service/refund.jpg'} alt="Blog Images" />
                        </div>
                        <div className="content">
                            <div>{parse(refund)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RefundPolicy;
