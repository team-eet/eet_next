import Link from "next/link";
import React, {useEffect, useState} from "react";
import Axios from "axios";
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../constants/constant";

const Banner = ({ text, col, getBlog }) => {

  const REACT_APP = API_URL
  const [BlogCount, setBlogCount] = useState('')

  const getBlogCount = () => {
    Axios.get(`${API_URL}/api/blog/GetAllBlog/0`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          setBlogCount(res.data)
          // console.log(res.data)
          // setBlogs(res.data)
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }

        })
  }

  useEffect(() => {
    getBlogCount()
  }, []);

  return (
    <>
      <div className="rbt-page-banner-wrapper">
        <div className="rbt-banner-image"></div>
        <div className="rbt-banner-content">
          <div className="rbt-banner-content-top">
            <div className="container">
              <div className="row">
                <div className={col}>
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

                  <div className=" title-wrapper">
                    <h1 className="title mb--0">{text}</h1>
                    <Link href="#" className="rbt-badge-2">
                      <div className="image">🎉</div>{" "}
                        {BlogCount.length} Blogs
                    </Link>
                  </div>

                  <p className="description">
                    Blog that help beginner designers become true unicorns.{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
