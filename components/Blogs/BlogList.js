import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// import BlogData from "../../data/blog/blog.json";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import BlogListItems from "./Blog-Sections/BlogList-Items";
import Pagination from "../Common/Pagination";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../constants/constant";
import {EncryptData} from "@/components/Services/encrypt-decrypt";

const BlogList = ({ isPagination }) => {
  const [BlogData, setBlogData] = useState([])
  const REACT_APP = API_URL
  const [isLoading, setisLoading] = useState(true);

  const getBlog = () => {
    Axios.get(`${API_URL}/api/blog/GetAllBlog/0`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          // console.log(res.data)
          setBlogData(res.data)
          setisLoading(false)
          // setBlogs(res.data)
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }

        })
  }
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = (page - 1) * 7;
  const selectedBlogs = blogs.slice(startIndex, startIndex + 7);

  const handleClick = (num) => {
    setPage(num);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const getBlogs = () => {
      setBlogs(BlogData);
      setTotalPages(Math.ceil(BlogData.length / 7));
    };
    getBlog()
    getBlogs();
  }, [BlogData, setBlogs, setTotalPages, 7]);

  return (
    <>
      <>
        <div className="row">
          <div className="col-lg-10 offset-lg-1 mt_dec--30">
            {isLoading ? <>
              <div className="col-12 mt--30">
                <div className="rbt-card variation-02 height-auto rbt-hover">
                  <div className="rbt-card-img">
                    <Skeleton height={150}/>
                  </div>
                  <div className="rbt-card-body">
                    <h3 className="rbt-card-title">
                      <Skeleton height={30} />
                    </h3>
                    {/*<p className="rbt-card-text">{data.desc}</p>*/}
                    <div className="rbt-card-bottom mt-3">
                      <Skeleton height={30} width={70} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rbt-card card-list variation-02 rbt-hover mt--30">
                <div className="rbt-card-img">
                  <Skeleton height={150} width={200} />
                </div>
                <div className="rbt-card-body">
                  <h5 className="rbt-card-title">
                    <Skeleton height={30} width={600} />
                  </h5>
                  <div className="rbt-card-bottom">
                    <Skeleton height={30} width={70} />
                  </div>
                </div>
              </div>
              <div className="rbt-card card-list variation-02 rbt-hover mt--30">
                <div className="rbt-card-img">
                  <Skeleton height={150} width={200} />
                </div>
                <div className="rbt-card-body">
                  <h5 className="rbt-card-title">
                    <Skeleton height={30} width={600} />
                  </h5>
                  <div className="rbt-card-bottom">
                    <Skeleton height={30} width={70} />
                  </div>
                </div>
              </div>
              <div className="rbt-card card-list variation-02 rbt-hover mt--30">
                <div className="rbt-card-img">
                  <Skeleton height={150} width={200} />
                </div>
                <div className="rbt-card-body">
                  <h5 className="rbt-card-title">
                    <Skeleton height={30} width={600} />
                  </h5>
                  <div className="rbt-card-bottom">
                    <Skeleton height={30} width={70} />
                  </div>
                </div>
              </div>
              <div className="rbt-card card-list variation-02 rbt-hover mt--30">
                <div className="rbt-card-img">
                  <Skeleton height={150} width={200} />
                </div>
                <div className="rbt-card-body">
                  <h5 className="rbt-card-title">
                    <Skeleton height={30} width={600} />
                  </h5>
                  <div className="rbt-card-bottom">
                    <Skeleton height={30} width={70} />
                  </div>
                </div>
              </div>
            </> : <>
              {BlogData &&
                  selectedBlogs.slice(0, 1).map((data, index) => (
                      <div className="col-12 mt--30" key={index}>
                        <div className="rbt-card variation-02 height-auto rbt-hover">
                          <div className="rbt-card-img">
                            <Link href={`/blog-details/${EncryptData(data.nBId)}`}>
                              <Image className={"position-relative"}
                                  src={data.sImagePath}
                                  width={1085}
                                  height={645}
                                  alt="Card image"
                              />
                            </Link>
                          </div>
                          <div className="rbt-card-body">
                            <h3 className="rbt-card-title">
                              <Link href={`/blog-details/${EncryptData(data.nBId)}`}>{data.sBlogTitle}</Link>
                            </h3>
                            {/*<p className="rbt-card-text">{data.desc}</p>*/}
                            <div className="rbt-card-bottom">
                              <Link
                                  className="transparent-button"
                                  href={`/blog-details/${EncryptData(data.nBId)}`}
                              >
                                Learn More
                                <i>
                                  <svg
                                      width="17"
                                      height="12"
                                      xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                        stroke="#27374D"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                      <path d="M10.614 0l5.629 5.629-5.63 5.629" />
                                      <path
                                          strokeLinecap="square"
                                          d="M.663 5.572h14.594"
                                      />
                                    </g>
                                  </svg>
                                </i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))}
            </>}


            <BlogListItems selectedBlogs={selectedBlogs} start={1} end={5} />
          </div>
        </div>

        {isPagination ? (
          <div className="row">
            <div className="col-lg-12 mt--60">
              <Pagination
                totalPages={totalPages}
                pageNumber={page}
                handleClick={handleClick}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    </>
  );
};

export default BlogList;
