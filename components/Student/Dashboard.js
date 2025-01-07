import CounterWidget from "../Instructor/Dashboard-Section/widgets/CounterWidget";
import CounterWidgetBatch from "@/components/Instructor/Dashboard-Section/widgets/CounterWidgetBatch";
import {useEffect, useState} from "react";
import Axios from "axios";
import {API_URL, API_KEY} from "../../constants/constant";
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import { DecryptData } from "@/components/Services/encrypt-decrypt";
import {useRouter} from "next/router";
import withAuth from '@/components/Utils/withAuth';

const Dashboard = () => {
  const REACT_APP = API_URL
  const [crscnt, setcrscnt] = useState('')
  const [isLogin, setIsLogin] = useState(0)
  const getPurchasedCourse = () => {
    // console.log(DecryptData('mUnt9JQjA_W_MMMfEAje0Q=='))
    // bhavika@123
    if (localStorage.getItem('userData')) {
      const udata = JSON.parse(localStorage.getItem('userData')).regid
      // console.log('api called')
      Axios.get(`${API_URL}/api/purchasedCourse/GetPurchasedCourse/${udata}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              setcrscnt(res.data.length)
              // console.log('My Learning', res.data)
            } else {

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
              <CounterWidget
                  counterStyle="two"
                  styleClass="bg-primary-opacity"
                  iconClass="bg-primary-opacity"
                  numberClass="color-primary"
                  icon="feather-book-open"
                  title="Enrolled Courses"
                  value={crscnt}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <CounterWidget
                  counterStyle="two"
                  styleClass="bg-coral-opacity"
                  iconClass="bg-coral-opacity"
                  numberClass="color-coral"
                  icon="feather-monitor"
                  title="ACTIVE COURSES"
                  value={0}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <CounterWidget
                  counterStyle="two"
                  styleClass="bg-violet-opacity"
                  iconClass="bg-violet-opacity"
                  numberClass="color-violet"
                  icon="feather-award"
                  title="Completed Courses"
                  value={0}
              />
            </div>
          </div>
          <div className="row g-5 mt-3">
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <CounterWidgetBatch
                  counterStyle="two"
                  styleClass="bg-pink-opacity"
                  iconClass="bg-pink-opacity"
                  numberClass="color-pink"
                  icon="feather-book-open"
                  title="Enrolled Batches"
                  value={0}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <CounterWidgetBatch
                  counterStyle="two"
                  styleClass="bg-violet-opacity"
                  iconClass="bg-violet-opacity"
                  numberClass="color-violet"
                  icon="feather-monitor"
                  title="ACTIVE BATCHES"
                  value={0}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-12">
              <CounterWidgetBatch
                  counterStyle="two"
                  styleClass="bg-coral-opacity"
                  iconClass="bg-coral-opacity"
                  numberClass="color-coral"
                  icon="feather-award"
                  title="Completed Batches"
                  value={0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(Dashboard);
