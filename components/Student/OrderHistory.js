import {useEffect, useState} from "react";
import Axios from 'axios'
import {API_URL, API_KEY} from "../../constants/constant";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";

const OrderHistory = () => {

  const REACT_APP = API_URL
  const [order, setOrder] = useState([])
  const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
  }

  useEffect(() => {
    if(localStorage.getItem('userData')){
      const udata = DecryptData(localStorage.getItem('userData'))

      Axios.get(`${API_URL}/api/myOrder/GetOrderItem/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              console.log(res.data)
              setOrder(res.data)
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })
    }
  }, []);

  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box" style={{ padding: '25px' }}>
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Order History</h4>
          </div>

          <div className="rbt-dashboard-table table-responsive mobile-table-750">
            <table className="rbt-table table table-borderless">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Course Name</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Payment Type</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
              {order.map((item, index) => {
                return (
                    <>
                      <tr key={index}>
                        <th>{item.orderId}</th>
                        <td>{item.sCourseTitle}</td>
                        <td>{formatDate(item.txnDate)}</td>
                        <td>{item.txnAmount}</td>
                        <td>
                          {item.paymentMode !== null ? item.paymentMode : '-'}
                        </td>
                        <td className={'d-flex'}>
                          <a className='btn btn-outline-primary' href={`/student/student-receipt/${EncryptData(item.orderId)}`} target='_blank'>Receipt</a>
                          <a className='btn btn-outline-primary m-l-5' href={`/student/student-invoice/${EncryptData(item.orderId)}`} target='_blank'>Invoice</a>
                        </td>
                      </tr>
                    </>
                )
              })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
