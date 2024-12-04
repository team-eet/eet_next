import Link from "next/link";
import Separator from "../Common/Separator";

const CopyRight = () => {
  return (
    <>
      <Separator />
      <div className="copyright-area copyright-style-1 ptb--20">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12">
              <p className="rbt-link-hover text-center text-lg-start">
                Copyright © 2024 EET English Pvt Ltd

                All Rights Reserved
              </p>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-12">
              <ul className="copyright-link rbt-link-hover justify-content-center justify-content-lg-end mt_sm--10 mt_md--10">
                <li>
                  <Link href="/TermsOfService">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy policy</Link>
                </li>
                <li>
                  <Link href="/Refund">Refund Policy</Link>
                </li>
                {/*<li>*/}
                {/*  <Link href="#">Credits Program</Link>*/}
                {/*</li>*/}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyRight;
