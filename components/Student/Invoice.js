import {useEffect, useState} from "react";
import Axios from 'axios'
import {API_URL, API_KEY} from "../../constants/constant";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";
import { Card, CardImg, CardBody, CardText, CardTitle, Row, Col, Badge, Button, Table } from 'reactstrap'


const Invoice = () => {

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


    const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
        if (!value) return value
        return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
    }


    useEffect(() => {

        const url = window.location.href
        const parts = url.split("/");
        const currentOrderId = parts[parts.length - 1];
        setorderId(DecryptData(currentOrderId))

        if(localStorage.getItem('userData')){
            const udata = DecryptData(localStorage.getItem('userData'))

            Axios.get(`${API_URL}/api/registration/GetUserProfile/${udata['regid']}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data.length !== 0) {
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
            <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                <div className="content">
                    <div className="section-title">
                        <h4 className="rbt-title-style-3">Invoice</h4>
                    </div>

                    <div className='invoice-preview-wrapper'>
                        <Row className='invoice-preview pl-2 pr-2'>
                            <Col xl={9} md={8} sm={12} className='inv-card'>
                                <Card className='invoice-preview-card'>
                                    <CardBody className='invoice-padding pb-0'>
                                        <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                                            <div>
                                                <div className='logo-wrapper'>
                                                    {/*<img src={eetlogo} className='img-fluid w-100px' alt='logo' />*/}
                                                </div>
                                                <CardText style={{ fontSize: '15px' }} className='m-0'>Office 149, 450 South Brand Brooklyn</CardText>
                                                <CardText style={{ fontSize: '15px' }} className='m-0'>San Diego County, CA 91905, USA</CardText>
                                                <CardText style={{ fontSize: '15px' }} className='m-0'>+1 (123) 456 7891, +44 (876) 543 2198</CardText>
                                            </div>
                                            <div className='mt-md-0 mt-2'>
                                                <h4 className='invoice-title m-0' style={{ fontSize: '20px' }}>
                                                    Invoice <span className='invoice-number'>#{orderId}</span>
                                                </h4>
                                                <CardText className='m-0 font-weight-500' style={{ fontSize: '15px' }}>{sFName} {sLName}</CardText>
                                                <CardText className='m-0' style={{ fontSize: '15px' }}>{sCityName} {sStateName}</CardText>
                                                {(sMobile) ? <CardText className='mb-25' style={{ fontSize: '15px' }}>{sMobile}</CardText> : ''}
                                                {(sEmail) ? <CardText className='mb-0' style={{ fontSize: '15px' }}>{sEmail}</CardText> : ''}

                                            </div>
                                        </div>
                                    </CardBody>
                                    <CardBody className='invoice-padding pt-3'>
                                    </CardBody>
                                    <Table responsive style={{ fontSize: '15px' }}>
                                        <thead>
                                        <tr>
                                            <th className='py-1'>Course</th>
                                            <th className='py-1'>Package</th>
                                            <th className='py-1'>Price</th>
                                            <th className='py-1'>Discount</th>
                                            <th className='py-1'>Total</th>
                                        </tr>
                                        </thead>
                                        <tbody >
                                        {receipt.map((item, index) => (
                                            <tr key={index}>
                                            <td className='py-1'>
                                                <p className='card-text font-weight-bolder mb-25' style={{ fontSize: '15px' }}>{item.cname}</p>
                                                <p className='card-text text-nowrap' style={{ fontSize: '15px' }}>
                                                    {item.fname} {item.lname}
                                                    {/* <span className='font-12'>(12 Sections / 35 Lessons)</span> */}
                                                </p>
                                            </td>
                                            <td className='py-1'>
                                                <span className='font-weight-bold'>{(item.pkgname) ? (item.pkgname) : '-'}</span>
                                            </td>
                                            <td className='py-1'>
                                                <span className='font-weight-bold' style={{ fontSize: '15px' }}>₹ {(item.isaccosiatecourse === 'no') ? (item.pkgprice) : (item.cnewamt)}</span>
                                            </td>
                                            <td className='py-1'>
                                                <span className='font-weight-bold'>{(item.discount !== 0) ? `₹ ${item.discprice}` : '-'}</span>
                                                {(item.sPromocode) ? (<div>
                                                    <small className='text-success'>Promo code applied ({item.sPromocode})</small>
                                                </div>) : ''}
                                            </td>
                                            <td>
                                                <span className='font-weight-bold' style={{ fontSize: '15px' }}>₹ {item.totalprice}</span>
                                            </td>
                                        </tr>))}
                                        <tr className='bg-light'>
                                            <th colSpan={4} className='text-right' >Total:</th>
                                            <th style={{ fontSize: '15px' }}>₹ {getTotalPrice}</th>
                                        </tr>

                                        </tbody>
                                    </Table>
                                    <CardBody className='invoice-padding pt-1'>
                                        <Row>
                                            <Col sm='12' style={{ fontSize: '15px' }}>
                                                <span className='font-weight-bold'>Note: </span>
                                                <span>
                                                    It was a pleasure working with you and your team.We hope you will keep us in mind for future freelance
                                                    projects.Thank You!
                                                </span>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                            </Col>
                            <Col xl={3} md={4} sm={12} className=''>
                                <Card className='invoice-action-wrapper no-print'>
                                    <CardBody>
                                        {/* <InvoiceForm /> */}
                                    
                                        <Button color='secondary' block outline className='mb-75'>
                                            Download
                                        </Button>

                                        <Button
                                            onClick={() => window.print()}
                                            color='secondary'
                                            block
                                            outline
                                            className='mb-75 mt-3'
                                        >
                                            Print
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Invoice;
