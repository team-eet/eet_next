import Courses from "../../data/dashboard/instructor/instructor.json";
import CourseWidget from "../Instructor/Dashboard-Section/widgets/CourseWidget";
import {useEffect, useState} from "react";
import Axios from "axios";
import {API_URL, API_KEY} from '../../constants/constant'
import { ErrorDefaultAlert, ErrorAlert } from "@/components/Services/SweetAlert";
import Link from "next/link";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";

const Wishlist = () => {

  const REACT_APP = API_URL
  const [wishlistitem, setwishlistitem] = useState([])

  const handleRemoveWishlistItem = (index) => {
    // return () => {
      //check user is login or not
      if (localStorage.getItem('userData')) {
        const udata = DecryptData(localStorage.getItem('userData'))
        Axios.delete(`${API_URL}/api/wishList/DeleteWishlist/${EncryptData(wishlistitem[index].cid)}/${EncryptData(wishlistitem[index].pkgId)}/${udata['regid']}`, {
          headers: {
            ApiKey: `${API_KEY}`
          }
        })
            .then(res => {
              const retData = JSON.parse(res.data)
              if (retData.success === "1") {
                console.log('removed successully')
              } else { { ErrorAlert(retData) } }
            })
            .catch(err => {
              { ErrorDefaultAlert(err) }
            })
      }

      setwishlistitem(wishlistitem.filter((item, i) => i !== index)
      ),()=>{
        localStorage.setItem('wishlist', JSON.stringify(wishlistitem))

      }

      if (wishlistitem.length === 1) {
        localStorage.removeItem('wishlist')
        setwishlistitem([])
      }
      // window.location.reload()
    // }
  }

  useEffect(() => {

    if (localStorage.getItem('userData')) {
      const udata = DecryptData(localStorage.getItem('userData'))

      //get cart data from db
      Axios.get(`${API_URL}/api/wishList/GetWishlistItem/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              console.log(res.data)
              if (res.data.length !== 0) {
                const newwishlist = res.data.filter((v, i, a) => a.findIndex(t => ((t.cid === v.cid) && (t.pkgId === v.pkgId))) === i)
                setwishlistitem(newwishlist)

                localStorage.removeItem('wishlist')
                localStorage.setItem('wishlist', JSON.stringify(newwishlist))
              }
            }
          })
          .catch(err => {
            console.log(err)
            { ErrorDefaultAlert(err) }
          })
    } else if (localStorage.getItem('wishlist')) {
      setwishlistitem(JSON.parse(localStorage.getItem('wishlist')))
    }
  }, []);
  return (
      <>
        <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
          <div className="content">
            <div className="section-title">
              <h4 className="rbt-title-style-3">Wishlist</h4>
            </div>
            <div className="row g-5">
              {wishlistitem.length !== 0 ? <>
                {wishlistitem.map((data, index) => {
                  return (
                      <>
                        <div key={index} className="col-lg-4 rbt-card variation-01 rbt-hover p-3">
                          <div className="rbt-card-img">
                            {/*<button className={'m-0 float-end btn-sm rounded-circle'}><i className="feather-x"></i></button>*/}
                            <Link href={`/course-details/${data.nCId}`}>
                              <img
                                  width={330}
                                  height={227}
                                  src={data.cimg}
                                  alt={data.cname}
                              />
                            </Link>
                          </div>
                          <div className="rbt-card-body">
                            <h5 className="rbt-card-title">
                              <Link href={`/course-details/${data.nCId}`}>{data.cname}</Link>
                            </h5>
                            <small>by {data.fname} {data.lname}</small>
                            <button className={'w-100 mt-3 btn-sm rbt-btn btn-gradient'} onClick={() => handleRemoveWishlistItem(index)}>
                              <i className="feather-x"></i>
                              Remove
                            </button>
                          </div>
                        </div>
                      </>
                  )
                })}
              </> : <>
                <h6 className={'text-center'}>No items in wishlist!</h6>
              </>}

            </div>
          </div>
        </div>
      </>
  );
};

export default Wishlist;
