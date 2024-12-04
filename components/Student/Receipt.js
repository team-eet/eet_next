import {useEffect, useState} from "react";
import Axios from 'axios'
import {API_URL, API_KEY} from "../../constants/constant";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";
import { Card, CardImg, CardBody, CardText, CardTitle, Row, Col, Badge, Button, Table } from 'reactstrap'


const Reciept = () => {

    const REACT_APP = API_URL
    const [order, setOrder] = useState([])

    const [receipt, setreceipt] = useState([])
    const [getTotalPrice, setgetTotalPrice] = useState('')
    const [purchaseDate, setpurchaseDate] = useState('')
    const [sFName, setsFName] = useState('')
    const [sLName, setsLName] = useState('')
    const [sMobile, setsMobile] = useState('')
    const [sEmail, setsEmail] = useState('')
    const [sStateName, setsStateName] = useState('')
    const [sCityName, setsCityName] = useState('')
    const [orderId, setorderId] = useState('')
    const [oid, setoid] = useState('')


    const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
        if (!value) return value
        return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
    }


    useEffect(() => {

        const url = window.location.href
        const parts = url.split("/");
        const currentOrderId = parts[parts.length - 1];
        setorderId(currentOrderId)
        setoid(DecryptData(currentOrderId))

        if(localStorage.getItem('userData')){
            const udata = JSON.parse(localStorage.getItem('userData'))

            Axios.get(`${API_URL}/api/registration/GetUserProfile/${udata['regid']}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data.length !== 0) {
                        // console.log(res.data)
                        setsFName(res.data[0]['sFName'])
                        setsLName(res.data[0]['sLName'])
                        setsMobile(res.data[0]['sMobile'])
                        setsEmail(res.data[0]['sEmail'])
                        setsStateName(res.data[0]['sStateName'])
                        setsCityName(res.data[0]['sCityName'])
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })

            Axios.get(`${API_URL}/api/myOrder/GetOrderData/${udata['regid']}/${currentOrderId}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data) {
                        // console.log(res.data)
                        if (res.data.length !== 0) {
                            setreceipt(res.data)

                            let tamt = 0
                            let gdate = ''
                            for (let i = 0; i < res.data.length; i++) {
                                tamt += parseInt(res.data[i].totalprice)
                                if (res.data[i].txnDate) {
                                    gdate = formatDate(res.data[i].txnDate)
                                }
                            }
                            setgetTotalPrice(tamt)
                            setpurchaseDate(gdate)
                        }
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })

            Axios.get(`${API_URL}/api/myOrder/GetOrderItem/${udata['regid']}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data) {
                        // console.log(res.data)
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
            <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                <div className="content">
                    <div className="section-title">
                        <h4 className="rbt-title-style-3">Receipt</h4>
                    </div>

                    <Row className=''>
                        <Col xl={12} md={12} sm={12}>
                            <div className='pt-4'>
                                <div className='pb-0'>
                                    <div className='d-flex justify-content-between flex-md-row flex-column mt-0 mb-3'>
                                        <div style={{ fontSize: '15px' }}>
                                            <div className='font-25'>
                                                EET English
                                                {/* <img src={eetlogo} className='img-fluid w-100px' alt='logo' /> */}
                                            </div>
                                            <div className='mb-25'>Office 149, 450 South Brand Brooklyn</div>
                                            <div className='mb-25'>San Diego County, CA 91905, USA</div>
                                            <div className='mb-0'>+1 (123) 456 7891, +44 (876) 543 2198</div>
                                        </div>
                                        <div className='mt-md-0 mt-2' style={{ fontSize: '15px' }}>
                                            <div>
                                                <span className='font-weight-bolder'>Date : </span>
                                                <span>{purchaseDate}</span>
                                            </div>
                                            <div className=''>
                                                <span className='font-weight-bolder'>Order : </span> <span className='invoice-number'>#{oid}</span>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='mb-3' style={{ fontSize: '15px' }}>
                                        <span className='font-weight-bolder'>Sold To : </span><span>{sFName} {sLName}</span>
                                    </div>
                                </div>
                                <div className='pt-0'>
                                </div>
                                <Table responsive style={{ fontSize: '15px' }}>
                                    <thead>
                                    <tr>
                                        <th className='py-1'>Course</th>
                                        <th className='py-1'>Ordered</th>
                                        <th className='py-1'>Coupon Codes</th>
                                        <th className='py-1'>Price</th>
                                        <th className='py-1'>Discount</th>
                                        <th className='py-1'>Total</th>
                                    </tr>
                                    </thead>
                                    <tbody style={{ fontSize: '15px' }}>
                                    {receipt.map((item, index) => (<tr key={index}>
                                        <td className='py-1'>
                                            <p className='card-text font-weight-bolder mb-25' style={{ fontSize: '15px' }}>{item.cname}</p>
                                        </td>
                                        <td className='py-1'>
                                            <span className='font-weight-bold'>{formatDate(item.txnDate)}</span>
                                        </td>
                                        <td className='py-1'>
                                            <span className='font-weight-bold'>{item.sPromocode}</span>
                                        </td>
                                        <td className='py-1'>
                                            <span className='font-weight-bold'>₹ {(item.isaccosiatecourse === 'no') ? (item.pkgprice) : (item.cnewamt)}</span>
                                        </td>
                                        <td className='py-1'>
                                            <span className='font-weight-bold'>{(item.discount !== 0) ? `₹ ${item.discprice}` : '-'}</span>
                                        </td>
                                        <td>
                                            <span className='font-weight-bold'>  ₹ {item.totalprice}</span>
                                        </td>
                                    </tr>))}
                                    <tr className='bg-light'>
                                        <th colSpan={5} className='text-right'>Total Paid:</th>
                                        <th>₹ {getTotalPrice}</th>
                                    </tr>

                                    </tbody>
                                </Table>
                                <div className='pt-1'>
                                    <Row>
                                        <Col sm='12' style={{ fontSize: '15px' }}>
                                            <span className='font-weight-bold'>Note: </span>
                                            <span>
                                                It was a pleasure working with you and your team.We hope you will keep us in mind for
                                                future freelance projects.Thank You!
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                            </div>

                        </Col>
                    </Row>

                </div>
            </div>
        </>
    );
};

export default Reciept;
