import Image from "next/image";
import Link from "next/link";

import img from "../../public/images/blog/blog-card-01.jpg";
import bgImg from "../../public/images/bg/bg-image-10.jpg";
import {useEffect, useState} from "react";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import parse from 'html-react-parser'
import {API_URL, API_KEY} from "../../constants/constant";


const PrivacyPolicy = () => {
  const REACT_APP = API_URL
  const [privacy, setPrivacy] = useState('')

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
              setPrivacy(res.data[0].sPrivacyPolicy)
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
            <h1 className="title">Privacy Policy</h1>
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
              <li className="rbt-breadcrumb-item active">Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="rbt-putchase-guide-area breadcrumb-style-max-width rbt-section-gapBottom">
          <div className="rbt-article-content-wrapper">
            <div className="post-thumbnail mb--30 position-relative wp-block-image alignwide">
              <img className="w-100" src={'/images/service/privacy.jpg'} alt="Blog Images" />
            </div>
            <div className="content">
             <div>
               {parse(privacy)}
             </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
