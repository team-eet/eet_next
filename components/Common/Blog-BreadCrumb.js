import Image from "next/image";
import Link from "next/link";

import bgImage from "../../public/images/bg/bg-image-10.jpg";

const BlogBreadCrumb = ({ matchedBlog }) => {
  // console.log(matchedBlog)
  const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
  }
  return (
    <>
      <div className="breadcrumb-image-container breadcrumb-style-max-width">
        <div className="breadcrumb-image-wrapper">
          <Image src={bgImage} alt="Education Images" />
        </div>
        <div className="breadcrumb-content-top text-center">
          <ul className="meta-list justify-content-center mb--10">
            <li className="list-item">
              <div className="author-thumbnail tutor-img">
                {/*{matchedBlog[0] && (*/}
                {/*  <img*/}
                {/*    src={matchedBlog[0]['sPhoto']}*/}
                {/*    width={494}*/}
                {/*    height={494}*/}
                {/*    // className={'border'}*/}
                {/*    alt="blog-image"*/}
                {/*  />*/}
                {/*)}*/}
              </div>
              <div>
                {matchedBlog[0] && (
                    <div className="author-info">
                      <Link href="#">
                        <strong>{matchedBlog[0].sFName} {matchedBlog[0].sLName}</strong>
                      </Link>{" "}
                      in{" "}
                      <Link href="#">
                        <strong>{matchedBlog[0].sCategory}</strong>
                      </Link>
                    </div>
                )}
              </div>

            </li>
            {matchedBlog[0] && (
              <li className="list-item">
                <i className="feather-clock"></i>
                <span>{formatDate(matchedBlog[0].dCreatedDate)}</span>
              </li>
            )}
          </ul>
          {matchedBlog[0] && <h1 className="title">{matchedBlog[0].sBlogTitle}</h1>}
          {/*{matchedBlog && <p>{matchedBlog.desc}</p>}*/}
        </div>
      </div>
    </>
  );
};

export default BlogBreadCrumb;
