import Link from "next/link";
import Image from "next/image";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {useState} from "react";

const BlogListItems = ({ start, end, selectedBlogs }) => {
  const [isLoading, setisLoading] = useState(true);

  return (
    <>
      {selectedBlogs &&
        selectedBlogs.slice(start, end).map((item, index) => (
          <div
            className="rbt-card card-list variation-02 rbt-hover mt--30"
            key={index}
          >
            <div className="rbt-card-img">
              <Link href={`/blog-details/${EncryptData(item.nBId)}`}>
                <img
                  src={item.sImagePath}
                  width={580}
                  height={300}
                  alt="Card image"
                />{" "}
              </Link>
            </div>
            <div className="rbt-card-body">
              <h5 className="rbt-card-title">
                <Link href={`/blog-details/${EncryptData(item.nBId)}`}>{item.sBlogTitle}</Link>
              </h5>
              <div className="rbt-card-bottom">
                <Link className="transparent-button" href={`/blog-details/${EncryptData(item.nBId)}`}>
                  Read Article
                  <i>
                    <svg
                      width="17"
                      height="12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g stroke="#27374D" fill="none" fillRule="evenodd">
                        <path d="M10.614 0l5.629 5.629-5.63 5.629" />
                        <path strokeLinecap="square" d="M.663 5.572h14.594" />
                      </g>
                    </svg>
                  </i>
                </Link>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default BlogListItems;
