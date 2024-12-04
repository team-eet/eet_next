import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";
import CourseData from "../../../data/course-details/courseData.json";
import { useAppContext } from "@/context/Context";
import ReactSearchBox from "react-search-box";
import {API_URL, API_KEY} from "../../../constants/constant";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";

const Search = () => {
  const REACT_APP = API_URL
  const { search } = useAppContext();
  const [value, setValue] = useState('')
  const [batchresult, setbatchresult] = useState([])
  const [courseresult, setcourseresult] = useState([])
  const [courseData, setcourseData] = useState([])
  const [isLoading, setisLoading] = useState(true)
  const [val, setVal] = useState('');
  const [post, setPost] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [listShow, setListShow] = useState(false);

  const handleChangeSearch = (e) => {
    if (e.target.value) {
      setVal(e.target.value);

      const arr1 = courseresult;
      const arr2 = batchresult;
      const children = arr1.concat(arr2);
      // console.log(children)
      setSearchData(children);

      const filteredPost = searchData.filter(item =>
          item.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      console.log(filteredPost)

      setListShow(true);
      setPost(filteredPost);
      setSearchValue(e.target.value);
    } else {
      setPost([]);
      setVal('');
      setListShow(false);
    }
  };
  const GoSearch = (event, val) => {
    setVal(val.title);
  };
  const renderMenu = (item, index) => (
      <div className="dropdown" key={index}>
        {item}
      </div>
  );


  const getCourse = () => {
    Axios.get(`${API_URL}/api/coursemain/GetCoursesMem/2`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data) {
            // console.log(res.data)
            if (res.data.length !== 0) {


              const coursewithoutModule = res.data.filter((obj) => {
                return obj.bIsAccosiateModule === 'no'
              })
              // console.log('coursewithoutModule', coursewithoutModule)
              setcourseData(coursewithoutModule)
              setisLoading(false)
            }
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }
  const SearchBatchResult = () => {
    Axios.get(`${API_URL}/api/coursemain/SearchBatchData`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data.length !== 0) {
            // console.log(res.data)
            // this.setState({ batchresult: res.data })
            setbatchresult(res.data)
            // console.log(this.state.batchresult)
            // const arr2 = res.data.map(item => {
            //   return item.title
            // })
            // setbatchresult(arr2)
            // console.log(arr2)
            // this.setState({ batcharray: arr2 })
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  const SearchCourseResult = () => {
    Axios.get(`${API_URL}/api/coursemain/SearchCourseData`, {
      headers: {
        ApiKey: `${API_KEY}`
      }
    })
        .then(res => {
          if (res.data.length !== 0) {
            // console.log(res.data)
            // this.setState({ batchresult: res.data })
            setcourseresult(res.data)
            // console.log(this.state.batchresult)
            // const arr2 = res.data.map(item => {
            //   return item.title
            // })
            // setbatchresult(arr2)
            // console.log(arr2)
            // this.setState({ batcharray: arr2 })
          }
        })
        .catch(err => {
          { ErrorDefaultAlert(err) }
        })
  }

  useEffect(() => {
    SearchBatchResult()
    SearchCourseResult()
    getCourse()
  }, []);

  return (
    <>
      <div className={`rbt-search-dropdown ${!search ? "active" : ""}`}>
        <div className="wrapper">
          <div className="row">

            <form action="#">
              <div className="col-lg-10 col-md-4">


                {/*<Autocomplete*/}
                {/*    value={val}*/}
                {/*    items={post}*/}
                {/*    getItemValue={item => item.title}*/}
                {/*    renderMenu={(item, index) => (*/}
                {/*        <div className="dropdown bg-white shadow mt-2 p-2 rounded-3" key={index}>*/}
                {/*          {post.length !== 0 ? <>*/}
                {/*            {item}*/}
                {/*          </> : <>*/}
                {/*            No Data Found!*/}
                {/*          </>}*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*    renderItem={(item, isHighlighted) => (*/}
                {/*        <div className={`item ${isHighlighted ? 'selected-item' : ''}`} key={item.title}>*/}
                {/*          {post.length !== 0 ? <>*/}
                {/*            {item.is_withbatch === 'yes' ?*/}
                {/*                <a className="text-dark"*/}
                {/*                    // href={`${item.link}/${EncryptData(searchValue)}/${EncryptData(val)}`}>*/}
                {/*                   href={`batch-details/${DecryptData(item.cid)}/${DecryptData(item.tbid)}`}>*/}
                {/*                  {item.title}*/}
                {/*                  /!*item.is_associate, item.is_withbatch, item.cid*!/*/}
                {/*                </a> :*/}
                {/*                item.is_associate === 'no' ?*/}
                {/*                    <a className="text-dark"*/}
                {/*                        // href={`${item.link}/${EncryptData(searchValue)}/${EncryptData(val)}`}>*/}
                {/*                       href={`course-details/${DecryptData(item.cid)}`}>*/}
                {/*                      {item.title}*/}
                {/*                      /!*item.is_associate, item.is_withbatch, item.cid*!/*/}
                {/*                    </a> : <a className="text-dark"*/}
                {/*                        // href={`${item.link}/${EncryptData(searchValue)}/${EncryptData(val)}`}>*/}
                {/*                              href={`course-details-module/${DecryptData(item.cid)}`}>*/}
                {/*                      {item.title}*/}
                {/*                      /!*item.is_associate, item.is_withbatch, item.cid*!/*/}
                {/*                    </a>*/}
                {/*            }*/}
                {/*          </> : <>*/}

                {/*          </>}*/}


                {/*        </div>*/}
                {/*    )}*/}
                {/*    onChange={handleChangeSearch}*/}
                {/*    onSelect={GoSearch}*/}
                {/*    inputProps={{placeholder: "Search for any courses..."}}*/}
                {/*/>*/}

                {/*<input onChange={() => OnChange()} type="text" placeholder="What are you looking for?" />*/}
              </div>
              <div className={"col-lg-2 col-md-2"}>
                <div className="submit-btn text-center">
                  <button className="rbt-btn btn-gradient btn-md">
                    Search
                  </button>
                </div>
              </div>
            </form>


          </div>

          <div className="rbt-separator-mid">
            <hr className="rbt-separator m-0"/>
          </div>

          <div className="row g-4 pt--30 pb--60">
          <div className="col-lg-12">
              <div className="section-title">
                <h5 className="rbt-title-style-2">Our Top Course</h5>
              </div>
            </div>

            {courseData.slice(0,4).map((data, index) => {
              // console.log(data)
              return (
                  <>
                    <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                      <div className="rbt-card variation-01 rbt-hover">
                        <div className="rbt-card-img">
                          <a href={`/course-details/${EncryptData(data.nCId)}`}>
                            <img
                                src={data.sImagePath}
                                width={186}
                                height={128}
                                alt="Card image"
                            />
                          </a>
                        </div>
                        <div className="rbt-card-body">
                          <h5 className="rbt-card-title">
                            <a href={`/course-details/${EncryptData(data.nCId)}`}>
                              {data.sCourseTitle}
                            </a>
                          </h5>
                          <div className="rbt-review">
                            <div className="rating">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                            </div>
                            <span className="rating-count">
                        {" "}
                              ({data.user_rate_cnt} Reviews)
                      </span>
                          </div>
                          <div className="rbt-card-bottom">
                            <div className="rbt-price">
                              <span className="current-price">₹{data.dAmount}</span>
                              <span className="off-price">₹{data.nCourseAmount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              )
            })}

          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
