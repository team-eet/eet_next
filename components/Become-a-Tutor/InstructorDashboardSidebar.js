import { useRouter } from "next/router";
import SidebarData from "../../data/dashboard/instructor/siderbar.json";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Axios from "axios";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {DecryptData, EncryptData} from "@/components/Services/encrypt-decrypt";
import {API_URL, API_KEY} from "../../constants/constant";

const InstructorDashboardSidebar = ({ url }) => {
  const router = useRouter();
  const path = router.pathname;
  const [fname, setfname] = useState('')
  const REACT_APP = API_URL
  const [enableMenu,setenableMenu] = useState(false)
  const [tutorcnt, settutorcnt] = useState('')

  const [postId, setpostID] = useState('')

  const [verifysts, setverifySts] = useState([])
  const [cover_verify, setcover_verify] = useState(0)
  const [isCheck, setIsCheck] = useState(0)

  useEffect(() => {

    const url = window.location.href
    const parts = url.split("/");
    const currentPostId = parts[parts.length - 1];
    setpostID(currentPostId);

    if(localStorage.getItem('userData')) {
      const fname = DecryptData(localStorage.getItem('userData')).fname
      setfname(fname)
      Axios.get(`${API_URL}/api/TutorBasics/GetTutorProfile/${DecryptData(localStorage.getItem('userData')).regid}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            settutorcnt(res.data[0].cnt)
            setenableMenu()
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

      Axios.get(`${API_URL}/api/TutorVerify/GetTutorVerify/${DecryptData(localStorage.getItem('userData')).regid}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if(res.data.length !== 0) {
              let res_data = res.data[0];
              for (let key in res_data) {
                if (res_data[key] === null) {
                  res_data[key] = 0;
                }
              }

              setverifySts(res_data)
              const verify_cover1 = res.data[0].sCoverPhotoLeft_verify
              const verify_cover2 = res.data[0].sCoverPhotoCenter_verify
              const verify_cover3 = res.data[0].sCoverPhotoRight_verify
              if(verify_cover1 === 3 || verify_cover2 === 3 || verify_cover3 === 3){
                setcover_verify(3)
              } else if(verify_cover1 === 1 || verify_cover2 === 1 || verify_cover3 === 1){
                setcover_verify(1)
              } else if(verify_cover1 === 2 || verify_cover2 === 2 || verify_cover3 === 2) {
                setcover_verify(2)
              } else {
                setcover_verify(0)
              }

              setIsCheck(1)
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }



      const interval = setInterval(() => {
        setPercentages((prevPercentages) => {
          const updatedPercentages = { ...prevPercentages };

          if (updatedPercentages.percentage1 < 80) {
            updatedPercentages.percentage1 += 1;
          }

          return updatedPercentages;
        });
      }, 50);

      return () => clearInterval(interval);

  }, [])

  const options = [
      {
      "sectionName": "Basics",
      "status": verifysts.sBasic_verify
    },
    {
      "sectionName": "Profile Photo",
      "status": verifysts.sProfilePhoto_verify
      // "status": 0
    },
    {
      "sectionName": "Cover Photo",
      "status": cover_verify
      // verifysts.sCoverPhotoLeft_verify
    },
    {
      "sectionName": "Education",
      "status": verifysts.sEducation_verify
    },
    {
      "sectionName": "Certification",
      "status": verifysts.sCertification_verify
    },
    {
      "sectionName": "Teaching Experience",
      "status": verifysts.sTeachExper_verify
    },
    {
      "sectionName": "Description",
      "status": verifysts.sDesc_verify
    },
    {
      "sectionName": "Intro Video",
      "status": verifysts.sIntroVideo_verify
    },
    {
      "sectionName": "Interests",
      "status": verifysts.sInterests_verify
    },
    {
      "sectionName": "Time Availability",
      "status": verifysts.sTimeAvail_verify
    }
    ]
  const [percentage, setPercentages] = useState(0);

  const countStatus2 = options.filter(option => option.status !== 0).length;
  // Calculate the percentage
  const totalOptions = options.length;
  const percentagecount = (countStatus2 / totalOptions) * 100;

  return (
    <>
      <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
        <div className="inner">
          <div className="content-item-content">
            <div className="rbt-default-sidebar-wrapper">
              <div className="section-title mb--20">
                <div className={'row justify-content-between'}>
                  <div className={'col-lg-6 align-items-center'}>
                    <h6 className="rbt-title-style-2 mt-4">Welcome, {fname}</h6>
                  </div>
                  <div className={'col-lg-5'}>
                    <div className="">
                      <div className="">
                        <CircularProgressbar
                            className="circle-text count"
                            strokeWidth={5}
                            value={isCheck === 1 ? percentagecount : 0 }
                            text={isCheck === 1 ? `${percentagecount}%` : 0}
                            styles={buildStyles({
                              textColor: "#6b7385",
                              pathColor: "#059DFF",
                              trailColor: "#F6F6F6",
                            })}
                        />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
              <nav className="mainmenu-nav">
                <ul className="dashboard-mainmenu rbt-default-sidebar-list nav-tabs">
                  {SidebarData &&
                      SidebarData.siderbar.map((data, index) => {
                        const verificationStatus = options.find(
                            (item) => item.sectionName === data.text
                        )
                        if (!verificationStatus) return null; // Handle if no status found

                        const { status } = verificationStatus;
                        return (
                            <>
                              {
                                isCheck !== 1 ? <>
                                  {
                                    index === 0 ?
                                        <li className="nav-item d-flex align-items-center custIcon" key={index}
                                            role="presentation">
                                          <Link className={`w-100 ${path === data.link ? "active" : ""}`}
                                                href={`/become-a-tutor/${data.link}`}>
                                            <i className={data.icon}/>
                                            <span>{data.text}</span>
                                          </Link>
                                        </li> :

                                        <li className="nav-item d-flex align-items-center custIcon" key={index}
                                            role="presentation">
                                          <span
                                              className="blur-bg">
                                            <i className={data.icon}/>
                                            <span>{data.text}</span>
                                          </span>
                                          {/*<i className={data.icon2}/>*/}
                                        </li>
                                  }

                                </> : <>


                                  {tutorcnt === 0 ? <>
                                    {index === 0 ? <>
                                      <li className="nav-item d-flex align-items-center custIcon" key={index}
                                          role="presentation">
                                        <Link className={`w-100 ${path === data.link ? "active" : ""}`}
                                              href={`/become-a-tutor/${data.link}`}>
                                          <i className={data.icon}/>
                                          <span>{data.text}</span>
                                        </Link>
                                      </li>
                                    </> : <>
                                      <li className="nav-item d-flex align-items-center custIcon" key={index} role="presentation">
                                    <span id={'other-sidebar'}
                                          className={`${path === data.link ? "active" : "blur-bg"} `}>
                                      <i className={data.icon}/>
                                      <span>{data.text}</span>
                                    </span>
                                        {/*<i className={data.icon2}/>*/}
                                      </li>
                                    </>}
                                  </> : <>
                                    <li className="nav-item d-flex align-items-center custIcon" key={index} role="presentation">
                                      <Link
                                          // className={`w-100 ${path === `/become-a-tutor/${data.link}` ? "active" : ""}`}
                                          className={status === 0 && `/become-a-tutor/${data.link}` !== path? "blur-bg" : `/become-a-tutor/${data.link}` === path ? "active" : ""}
                                          // href={`/become-a-tutor/${data.link}`}
                                          href={status === 0 && `/become-a-tutor/${data.link}` !== path ? "javascript:void(0)" : `/become-a-tutor/${data.link}`}
                                      >
                                        <i className={data.icon}/>
                                        <span>{data.text}</span>
                                      </Link>

                                      {status === 0 && (
                                          ''
                                          // <i className={data.pending} style={{ color: "#d1d122" }} />
                                      )}
                                      {status === 1 && (
                                          <i className={data.pending} style={{ color: "#d1d122" }} />
                                      )}
                                      {status === 2 && (
                                          <i className={data.approved} style={{ color: "green" }} />
                                      )}
                                      {status === 3 && (
                                          <i className={data.disapproved} style={{ color: "red" }} />
                                      )}
                                      {/*{verifysts.map((item, index) => {*/}
                                      {/*  return (*/}
                                      {/*      <>*/}
                                      {/*        {item.sBasic_verify === 0 ? <>*/}
                                      {/*          <i className={data.pending} style={{color: '#d1d122'}}/>*/}
                                      {/*        </> : <>*/}
                                      {/*          {item.sBasic_verify=== 1  ? <>*/}
                                      {/*            <i className={data.approved} style={{color: 'green'}}/>*/}
                                      {/*          </> : <>*/}
                                      {/*            <i className={data.disapproved} style={{color: 'red'}}/>*/}
                                      {/*          </>}*/}
                                      {/*        </>}*/}
                                      {/*        */}
                                      {/*        {item.sProfilePhoto_verify === 0 ? <>*/}
                                      {/*          <i className={data.pending} style={{color: '#d1d122'}}/>*/}
                                      {/*        </> : <>*/}
                                      {/*          {item.sProfilePhoto_verify === 1  ? <>*/}
                                      {/*            <i className={data.approved} style={{color: 'green'}}/>*/}
                                      {/*          </> : <>*/}
                                      {/*            <i className={data.disapproved} style={{color: 'red'}}/>*/}
                                      {/*          </>}*/}
                                      {/*        </>}*/}

                                      {/*      </>*/}
                                      {/*  )*/}
                                      {/*})}*/}

                                    </li>
                                  </>}
                                </>}
                            </>
                        )

                      })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorDashboardSidebar;
