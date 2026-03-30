import Image from "next/image";
import Link from "next/link";

import BlogAuthor from "./Blog-Sections/Blog-Author";
import ComntForm from "./Blog-Sections/ComntForm";
import Comment from "./Blog-Sections/Comment";
import parse from "html-react-parser";
import {useEffect, useState} from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const BlogDetails = ({ matchedBlog }) => {
    const [isLoading, setisLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setisLoading(false)
        }, 4000)
    },[])
// console.log()
  return (
    <>
      <div className="content">
        <div className="post-thumbnail mb--30 position-relative wp-block-image alignwide">
          <figure>
              {isLoading ? <>
                <Skeleton height={150} />
              </> : <>
                  {matchedBlog[0] && (
                      <Image
                          src={matchedBlog[0].sImagePath}
                          width={1085}
                          height={645}
                          priority
                          alt="Blog Images"
                          className={"position-relative"}
                      />
                  )}
              </>}

            {/*<figcaption>{matchedBlog.caption}</figcaption>*/}
          </figure>
        </div>
          {isLoading ? <>
                <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />

          </> : <>
              <p>{matchedBlog[0] ? parse(matchedBlog[0]['sBlogContent']) : ''}</p>
          </>}

        {/*<blockquote className="wp-block-quote">*/}
        {/*  <p>{matchedBlog.quote}</p>*/}
        {/*  <cite>*/}
        {/*    <Link href="https://themeforest.net/user/rainbow-themes/portfolio">*/}
        {/*      {matchedBlog.city}*/}
        {/*    </Link>*/}
        {/*  </cite>*/}
        {/*</blockquote>*/}

        {/*<div className="wp-block-gallery columns-3 is-cropped">*/}
        {/*  <ul className="blocks-gallery-grid">*/}
        {/*    {matchedBlog &&*/}
        {/*      matchedBlog.gallery.map((item, innerIndex) => (*/}
        {/*        <li className="blocks-gallery-item" key={innerIndex}>*/}
        {/*          <figure>*/}
        {/*            {item.galleryImg && (*/}
        {/*              <Image*/}
        {/*                className="radius-4"*/}
        {/*                src={item.galleryImg}*/}
        {/*                width={255}*/}
        {/*                height={143}*/}
        {/*                priority*/}
        {/*                alt="Blog Images"*/}
        {/*              />*/}
        {/*            )}*/}
        {/*          </figure>*/}
        {/*        </li>*/}
        {/*      ))}*/}
        {/*  </ul>*/}
        {/*</div>*/}

        {/*<h4>{matchedBlog.title}</h4>*/}

        {/*<p>*/}
        {/*  <Link href="#">{matchedBlog.linkOne}</Link> {matchedBlog.descTwo}*/}
        {/*</p>*/}

        {/*<p>{matchedBlog.descThree}</p>*/}

        {/*<h4>{matchedBlog.titleTwo}</h4>*/}

        <p>
          {/*<Link href="#">{matchedBlog.linkTwo}</Link> {matchedBlog.descSaven}*/}
        </p>

        <div className="post-thumbnail mb--30 position-relative wp-block-image alignwide">
          {/*<figure>*/}
          {/*  {matchedBlog.addImg && (*/}
          {/*    <Image*/}
          {/*      src={matchedBlog.addImg}*/}
          {/*      width={1085}*/}
          {/*      height={645}*/}
          {/*      priority*/}
          {/*      alt="Blog Images"*/}
          {/*    />*/}
          {/*  )}*/}

          {/*  /!*<figcaption>{matchedBlog.caption}</figcaption>*!/*/}
          {/*</figure>*/}
        </div>

        {/*<p>{matchedBlog.descFive}</p>*/}
        {/*<h4>{matchedBlog.titleTwo}</h4>*/}

        {/*<p>*/}
        {/*  {matchedBlog.descSix}*/}
        {/*  <Link href="#">{matchedBlog.linkThree}</Link>.*/}
        {/*</p>*/}

        {/*<p>*/}
        {/*  <Link href="#">{matchedBlog.linkTwo}</Link> {matchedBlog.descFive}*/}
        {/*</p>*/}

        <div className="tagcloud">
          {/*{matchedBlog &&*/}
          {/*  matchedBlog.tag.map((tagItem, innerIndex) => (*/}
          {/*    <Link href="#" key={innerIndex}>*/}
          {/*      {tagItem.tag}*/}
          {/*    </Link>*/}
          {/*  ))}*/}
        </div>

        <div className="social-share-block">
          <div className="post-like">
            <Link href="#">
              <i className="feather feather-thumbs-up"></i>
              <span>2.2k Like</span>
            </Link>
          </div>
            <ul className="social-icon social-default transparent-with-border">
                <li>
                    <Link href={''}>
                        <i className={'feather-facebook'}></i>
                    </Link>
                </li>
                <li>
                    <Link href={''}>
                        <i className={'feather-twitter'}></i>
                    </Link>
                </li>
                <li>
                    <Link href={''}>
                        <i className={'feather-instagram'}></i>
                    </Link>
                </li>
                <li>
                    <Link href={''}>
                        <i className={'feather-linkedin'}></i>
                    </Link>
                </li>
                {/*/// {matchedBlog &&
              matchedBlog.social.map((socialItem, innerIndex) => (

              ))}*/}
            </ul>
        </div>

          {/*<div className="about-author">*/}
          {/*  {matchedBlog &&*/}
          {/*    matchedBlog.author.map((author, innerIndex) => (*/}
        {/*      <BlogAuthor {...author} author={author} key={innerIndex} />*/}
        {/*    ))}*/}
        {/*</div>*/}

          {matchedBlog[0] ? <>
              {matchedBlog[0]['bIsCommentAllowed'] === 'yes' ? <>
                  <div className="rbt-comment-area">
                      {/*<div className="rbt-total-comment-post">*/}
                      {/*    <div className="title">*/}
                      {/*        <h4 className="mb--0">30+ Comments</h4>*/}
                      {/*    </div>*/}
                      {/*    <div className="add-comment-button">*/}
                      {/*        <a*/}
                      {/*            className="rbt-btn btn-gradient icon-hover radius-round btn-md"*/}
                      {/*            href="#"*/}
                      {/*        >*/}
                      {/*            <span className="btn-text">Add Your Comment</span>*/}
                      {/*            <span className="btn-icon">*/}
                      {/*               <i className="feather-arrow-right"></i>*/}
                      {/*            </span>*/}
                      {/*        </a>*/}
                      {/*    </div>*/}
                      {/*</div>*/}
                      <ComntForm/>
                  </div>
              </> : <></>}
          </> : <></>}

          {/*<div className="rbt-comment-area">*/}
          {/*  <h4 className="title">2 comments</h4>*/}
          {/*  <ul className="comment-list">*/}
          {/*    {matchedBlog &&*/}
          {/*      matchedBlog.comment.map((comnt, innerIndex) => (*/}
          {/*        <Comment {...comnt} comnt={comnt} key={innerIndex} />*/}
          {/*      ))}*/}
          {/*  </ul>*/}
          {/*</div>*/}
      </div>
    </>
  );
};

export default BlogDetails;
