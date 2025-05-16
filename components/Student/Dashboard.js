import CounterWidget from "../Instructor/Dashboard-Section/widgets/CounterWidget";
import CounterWidgetBatch from "@/components/Instructor/Dashboard-Section/widgets/CounterWidgetBatch";
import {useEffect, useState} from "react";
import Axios from "axios";
import {API_URL, API_KEY} from "../../constants/constant";
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import { DecryptData } from "@/components/Services/encrypt-decrypt";
import {useRouter} from "next/router";
import withAuth from '@/components/Utils/withAuth';
import Skeleton from "react-loading-skeleton";

const Dashboard = () => {
  const REACT_APP = API_URL
  const [crscnt, setcrscnt] = useState('')
  const [getCompetedCnt, setCompetedCnt] = useState('')
  const [getActiveCnt, setActiveCnt] = useState('')
  const [isLogin, setIsLogin] = useState(0)
  const [getApiCall, setApiCall] = useState(0)
  const getPurchasedCourse = () => {
    // console.log(DecryptData('mUnt9JQjA_W_MMMfEAje0Q=='))
    // bhavika@123
    if (localStorage.getItem('userData')) {
      const udata = DecryptData(localStorage.getItem('userData')).regid
      // console.log('api called')
      Axios.get(`${API_URL}/api/purchasedCourse/GetPurchasedCourse/${udata}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              setcrscnt(res.data.length)
              console.log('My Learning', res.data)
              const count = res.data.filter(item => item.bCompleted === true).length;
              setActiveCnt(res.data.length - count)
              setCompetedCnt(count)
              setApiCall(1)

            } else {
              setApiCall(1)
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
  }
  const router = useRouter()

  useEffect(() => {
    // const userData = localStorage.getItem('userData');
    // if (!userData) {
    //   // If not logged in, redirect to login page
    //   router.push('/login');
    // } else {
    //   setIsLogin(1)
    //   // If logged in, fetch the purchased course data
    //   getPurchasedCourse();
    // }
    getPurchasedCourse();
  }, []);

  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box mb--60">
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Dashboard</h4>
          </div>
          <div className="row g-5">
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              {
                getApiCall === 1 ?
                    <CounterWidget
                        counterStyle="two"
                        styleClass="bg-primary-opacity"
                        iconClass="bg-primary-opacity"
                        numberClass="color-primary"
                        icon="feather-book-open"
                        title="Enrolled Courses"
                        value={crscnt}
                        btnColor="bg-primary-opacity"
                    />
                    :
                    <>
                      <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-primary-opacity">
                        <div className="inner">
                          <div
                              className="rbt-round-icon bg-primary-opacity d-flex align-items-center justify-content-center"
                              style={{height: '100px', width: '100px', borderRadius: '50%'}}>
                          </div>

                          <div className="content mt-3">
                            <h3 className="counter without-icon color-primary">
                              <Skeleton width={60} height={30}/>
                            </h3>
                            <span className="rbt-title-style-2 d-block mt-2">
            <Skeleton width={120} height={16}/>
          </span>
                          </div>

                          <div className="viewMore mt--10">
                            <Skeleton width={100} height={30} borderRadius={10}/>
                          </div>
                        </div>
                      </div>
                    </>
              }

            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              {
                getApiCall === 1 ?
                    <CounterWidget
                        counterStyle="two"
                        styleClass="bg-coral-opacity"
                        iconClass="bg-coral-opacity"
                        numberClass="color-coral"
                        icon="feather-monitor"
                        title="ACTIVE COURSES"
                        value={getActiveCnt}
                        btnColor="bg-coral-opacity"
                    /> :
                    <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-coral-opacity">
                      <div className="inner">
                        <div
                            className="rbt-round-icon bg-coral-opacity d-flex align-items-center justify-content-center"
                            style={{height: '100px', width: '100px', borderRadius: '50%'}}>
                        </div>

                        <div className="content mt-3">
                          <h3 className="counter without-icon color-primary">
                            <Skeleton width={60} height={30}/>
                          </h3>
                          <span className="rbt-title-style-2 d-block mt-2">
            <Skeleton width={120} height={16}/>
          </span>
                        </div>

                        <div className="viewMore mt--10">
                          <Skeleton width={100} height={30} borderRadius={10}/>
                        </div>
                      </div>
                    </div>
              }

            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              {
                getApiCall === 1 ?
                    <CounterWidget
                        counterStyle="two"
                        styleClass="bg-violet-opacity"
                        iconClass="bg-violet-opacity"
                        numberClass="color-violet"
                        icon="feather-award"
                        title="Completed Courses"
                        value={getCompetedCnt}
                        btnColor="bg-violet-opacity"
                    /> :
                    <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-violet-opacity">
                      <div className="inner">
                        <div
                            className="rbt-round-icon bg-violet-opacity d-flex align-items-center justify-content-center"
                            style={{height: '100px', width: '100px', borderRadius: '50%'}}>
                        </div>

                        <div className="content mt-3">
                          <h3 className="counter without-icon color-primary">
                            <Skeleton width={60} height={30}/>
                          </h3>
                          <span className="rbt-title-style-2 d-block mt-2">
            <Skeleton width={120} height={16}/>
          </span>
                        </div>

                        <div className="viewMore mt--10">
                          <Skeleton width={100} height={30} borderRadius={10}/>
                        </div>
                      </div>
                    </div>
              }

            </div>
          </div>
          <div className="row g-5 mt-3">
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              {
                getApiCall === 1 ?
                    <CounterWidgetBatch
                        counterStyle="two"
                        styleClass="bg-pink-opacity"
                        iconClass="bg-pink-opacity"
                        numberClass="color-pink"
                        icon="feather-book-open"
                        title="Enrolled Batches"
                        value={0}
                    /> :
                    <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-pink-opacity">
                      <div className="inner">
                        <div
                            className="rbt-round-icon bg-pink-opacity d-flex align-items-center justify-content-center"
                            style={{height: '100px', width: '100px', borderRadius: '50%'}}>
                        </div>

                        <div className="content mt-3">
                          <h3 className="counter without-icon color-primary">
                            <Skeleton width={60} height={30}/>
                          </h3>
                          <span className="rbt-title-style-2 d-block mt-2">
            <Skeleton width={120} height={16}/>
          </span>
                        </div>

                        <div className="viewMore mt--10">
                          <Skeleton width={100} height={30} borderRadius={10}/>
                        </div>
                      </div>
                    </div>
              }

            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              {
                getApiCall === 1 ?
                    <CounterWidgetBatch
                        counterStyle="two"
                        styleClass="bg-violet-opacity"
                        iconClass="bg-violet-opacity"
                        numberClass="color-violet"
                        icon="feather-monitor"
                        title="ACTIVE BATCHES"
                        value={0}
                    /> :
                    <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-violet-opacity">
                      <div className="inner">
                        <div
                            className="rbt-round-icon bg-violet-opacity d-flex align-items-center justify-content-center"
                            style={{height: '100px', width: '100px', borderRadius: '50%'}}>
                        </div>

                        <div className="content mt-3">
                          <h3 className="counter without-icon color-primary">
                            <Skeleton width={60} height={30}/>
                          </h3>
                          <span className="rbt-title-style-2 d-block mt-2">
            <Skeleton width={120} height={16}/>
          </span>
                        </div>

                        <div className="viewMore mt--10">
                          <Skeleton width={100} height={30} borderRadius={10}/>
                        </div>
                      </div>
                    </div>
              }
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              {
                getApiCall === 1 ?
                    <CounterWidgetBatch
                        counterStyle="two"
                        styleClass="bg-coral-opacity"
                        iconClass="bg-coral-opacity"
                        numberClass="color-coral"
                        icon="feather-award"
                        title="Completed Batches"
                        value={0}
                    />
                    :
                    <div className="rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed bg-coral-opacity">
                      <div className="inner">
                        <div
                            className="rbt-round-icon bg-coral-opacity d-flex align-items-center justify-content-center"
                            style={{height: '100px', width: '100px', borderRadius: '50%'}}>
                        </div>

                        <div className="content mt-3">
                          <h3 className="counter without-icon color-primary">
                            <Skeleton width={60} height={30}/>
                          </h3>
                          <span className="rbt-title-style-2 d-block mt-2">
            <Skeleton width={120} height={16}/>
          </span>
                        </div>

                        <div className="viewMore mt--10">
                          <Skeleton width={100} height={30} borderRadius={10}/>
                        </div>
                      </div>
                    </div>
              }

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(Dashboard);
