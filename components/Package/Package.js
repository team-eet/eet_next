import React, {useEffect, useState} from "react";

import PricingData from "../../data/elements/pricing.json";
import BasicPlan from "../Pricing/Plans/BasicPlan";
import StandardPlan from "../Pricing/Plans/StandardPlan";
import ExclusivePlan from "../Pricing/Plans/ExclusivePlan";
import { useAppContext } from "@/context/Context";
import * as Icon from 'react-feather'
import Axios from "axios";
import {EncryptData} from "@/components/Services/encrypt-decrypt";
import {ErrorDefaultAlert} from "@/components/Services/SweetAlert";
import {API_URL, API_KEY} from "../../constants/constant";
import { toast } from 'react-toastify'
import { ErrorMessageToast } from "@/components/Services/Toast";
import Link from "next/link";
import {NavLink} from "react-router-dom";
import { Card, CardText, CardBody, CardHeader, CardTitle, Row, Col, Button, ListGroup, ListGroupItem, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip } from 'reactstrap'


const Package = ({ title, tag, col, position }) => {
    const { pricingThree, setPricingThree } = useAppContext();
    const REACT_APP = API_URL

    let cart_arr = []
    let genCart_arr = []

    const [packagearray, setpackagearray] = useState([])
    const [isCartItem, setisCartItem] = useState(false)
    const [isHideButton, setisHideButton] = useState(true)
    const [pid, setpid] = useState('')
    const [regId, setregId] = useState('')
    const [cid, setcid] = useState('')
    const [coursename, setcoursename] = useState('')
    const [sFName, setsFName] = useState('')
    const [sLName, setsLName] = useState('')
    const [sImagePath, setsImagePath] = useState('')
    const [bIsAccosiateCourse, setbIsAccosiateCourse] = useState('')
    const [dAmount, setdAmount] = useState('')
    const [pkg_price, setpkg_price] = useState('')
    const [nCourseAmount, setnCourseAmount] = useState('')
    const [other_pkg_cnt, setother_pkg_cnt] = useState('')
    const [cartItem, setcartItem] = useState([])
    let regid = '0'
    const getPackage = () => {
        const url = window.location.href
        const parts = url.split("/");
        const courseId = parts[parts.length - 1];
        setcid(courseId)
        if (localStorage.getItem('userData')) {
            const udata = DecryptData(localStorage.getItem('userData'))
            regid = udata['regid']
        } else {
            regid = '0'
        }
        // console.log(this.props.match.params.cid.toString())
        console.log("Package",regid,courseId)
        Axios.get(`${API_URL}/api/package/GetPackageView/${regid}/${courseId}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    console.log(res.data)
                    if (res.data.length !== 0) {
                        setpackagearray(res.data)
                        // this.setState({ packagearray: res.data, isLoading: false })
                    }
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })
    }


    const BuyPackage = (pkg, pname, pkgamt) => {
        //get cart item count
        let cartitemcnt = 0
        if (localStorage.getItem('cart')) {
            const str_arr = JSON.parse(localStorage.getItem('cart'))
            if (str_arr.length !== 0) {
                cartitemcnt = str_arr.length
            }
        }

        //get maximum cart item count
        let maximumItemCart = 0
        Axios.get(`${API_URL}/api/companySettings/FillCompanySettings`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data.length !== 0) {
                    //console.log(res.data)

                    maximumItemCart = res.data[0]['nMaximumItemCart']

                    if (maximumItemCart >= (cartitemcnt + 1)) {
                        setisCartItem(true)
                        setisHideButton(false)
                        setpid(pkg)
                        // this.setState({
                        //     isCartItem: true,
                        //     isHideButton: false,
                        //     pid: pkg
                        // })
                        // console.log(this.state.bIsAccosiateCourse)
                        // const getamt = (this.state.bIsAccosiateCourse === 'yes') ?  parseInt(this.state.pkg_price) : parseInt(this.state.dAmount)
                        const getamt = (bIsAccosiateCourse === 'yes') ?  parseInt(pkg_price) : pkgamt
                        console.log(getamt)
                        //check user is login or not
                        if (localStorage.getItem('userData')) {
                            const udata = DecryptData(localStorage.getItem('userData'))

                            //Get Promocode detail if applied for course

                            Axios.get(`${REACT_APP.API_URL}/api/promocode/Get_promocode_detail_package/${cid}/${udata['regid']}/${EncryptData(getamt)}/${EncryptData(pkg)}`, {
                                headers: {
                                    ApiKey: `${REACT_APP.API_KEY}`
                                }
                            })
                                .then(res => {
                                    if (res.data) {
                                        if (res.data.length !== 0) {
                                            console.log(res.data)
                                            const resData = JSON.parse(res.data)



                                            const insert_arr = {
                                                nRegId: udata['regid'],
                                                cid: cid,
                                                cname: coursename,
                                                fname: sFName,
                                                lname: sLName,
                                                camt: nCourseAmount,
                                                // cnewamt: this.state.dAmount,
                                                cnewamt: getamt,
                                                // pkgprice: this.state.pkg_price,
                                                pkgprice: getamt,
                                                isaccosiatecourse: bIsAccosiateCourse,
                                                cimg: sImagePath,
                                                pkgId: EncryptData(pkg),
                                                pkgname: pname,
                                                PCId: resData.pcid,
                                                promocode: resData.promocode,
                                                Discount: resData.discAmt
                                            }
                                            if (insert_arr) {
                                                console.log(insert_arr)
                                                Axios.post(`${REACT_APP.API_URL}/api/cart/InsertCart`, insert_arr, {
                                                    headers: {
                                                        ApiKey: `${REACT_APP.API_KEY}`
                                                    }
                                                }).then(res => {
                                                    const retData = JSON.parse(res.data)
                                                    if (retData.success === "1") {
                                                        //console.log('done')

                                                        if (!localStorage.getItem('cart')) {
                                                            const str_arr = JSON.stringify([insert_arr])
                                                            localStorage.setItem('cart', str_arr)

                                                        } else {
                                                            const gitem = JSON.parse(localStorage.getItem('cart'))
                                                            genCart_arr = []
                                                            if (gitem.length !== 0) {
                                                                for (let i = 0; i < gitem.length; i++) {
                                                                    genCart_arr.push(gitem[i])
                                                                }
                                                            }

                                                            genCart_arr.push(insert_arr)

                                                            const str_arr = JSON.stringify(genCart_arr)
                                                            localStorage.setItem('cart', str_arr)
                                                        }

                                                    } else if (retData.success === "0") {
                                                        { ErrorAlert(retData) }
                                                    }
                                                })
                                                    .catch(err => {
                                                        { ErrorDefaultAlert(JSON.stringify(err.response)) }
                                                    })
                                            }

                                        }
                                    }
                                })
                                .catch(err => {
                                    { ErrorDefaultAlert(err) }
                                })

                        } else {
                            Axios.get(`${API_URL}/api/promocode/Get_promocode_detail_logout/${cid}/${EncryptData(getamt)}`, {
                                headers: {
                                    ApiKey: `${API_KEY}`
                                }
                            })
                                .then(res => {
                                    if (res.data) {
                                        if (res.data.length !== 0) {
                                            //console.log(res.data)
                                            const resData = JSON.parse(res.data)

                                            //get promocode detail without login
                                            cart_arr = {
                                                cid: cid,
                                                cname: coursename,
                                                fname: sFName,
                                                lname: sLName,
                                                camt: nCourseAmount,
                                                // cnewamt: this.state.dAmount,
                                                cnewamt: getamt,
                                                // pkgprice: this.state.pkg_price,
                                                pkgprice: getamt,
                                                isaccosiatecourse: bIsAccosiateCourse,
                                                cimg: sImagePath,
                                                pkgId: EncryptData(pkg),
                                                pkgname: pname,
                                                PCId: resData.pcid,
                                                promocode: resData.promocode,
                                                Discount: resData.discAmt
                                            }

                                            if (!localStorage.getItem('cart')) {
                                                const str_arr = JSON.stringify([cart_arr])
                                                localStorage.setItem('cart', str_arr)

                                            } else {
                                                const gitem = JSON.parse(localStorage.getItem('cart'))
                                                genCart_arr = []
                                                if (gitem.length !== 0) {
                                                    for (let i = 0; i < gitem.length; i++) {
                                                        genCart_arr.push(gitem[i])
                                                    }
                                                }

                                                genCart_arr.push(cart_arr)

                                                const str_arr = JSON.stringify(genCart_arr)
                                                localStorage.setItem('cart', str_arr)
                                            }

                                        }
                                    }
                                })
                                .catch(err => {
                                    { ErrorDefaultAlert(err) }
                                })
                        }

                    } else {
                        const retData = {
                            title: 'Info',
                            message: `Maximum ${maximumItemCart} items added in cart.`
                        }
                        toast.error(<ErrorMessageToast pdata={retData} />, { hideProgressBar: true })
                    }
                }
            })
            .catch(err => {
                { ErrorDefaultAlert(err) }
            })

        //const getcart = localStorage.getItem('cart')
    }


    const  getCourse = () => {
        const url = window.location.href
        const parts = url.split("/");
        const courseId = parts[parts.length - 1];
        Axios.get(`${API_URL}/api/coursemain/GetCoursesView/${courseId}`, {
            headers: {
                ApiKey: `${API_KEY}`
            }
        })
            .then(res => {
                if (res.data) {
                    if (res.data.length !== 0) {
                        //console.log(res.data)
                        setcoursename(res.data[0].sCourseTitle)
                        setsFName(res.data[0].sFName)
                        setsLName(res.data[0].sLName)
                        setsImagePath(res.data[0].sImagePath)
                        setbIsAccosiateCourse(res.data[0].bIsAccosiateCourse)
                        setdAmount(res.data[0].dAmount)
                        setpkg_price(res.data[0].pkg_price)
                        setnCourseAmount(res.data[0].nCourseAmount)
                        setother_pkg_cnt(res.data[0].other_pkg_cnt)
                    }
                }
            })
            .catch(err => {
                console.log(err)
                { ErrorDefaultAlert(err) }
            })
    }

    useEffect(() => {
        getPackage()
        getCourse()

        if (localStorage.getItem('userData')) {
            const udata = DecryptData(localStorage.getItem('userData'))

            //get cart data from db
            Axios.get(`${API_URL}/api/cart/GetCartItem/${udata['regid']}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data) {
                        if (res.data.length !== 0) {
                            setcartItem(res.data)
                            // this.setState({
                            //     cartItem: res.data
                            // })

                        }
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
        } else if (localStorage.getItem('cart')) {
            let chkArr = []
            chkArr = JSON.parse(localStorage.getItem('cart'))

            //console.log(chkArr)
            if (chkArr.length !== 0) {
                for (let i = 0; i < chkArr.length; i++) {
                    chkArr[i].cid = (!isFinite) ? DecryptData(chkArr[i].cid) : chkArr[i].cid
                    chkArr[i].pkgId = (!isFinite) ? DecryptData(chkArr[i].pkgId) : chkArr[i].pkgId
                }

                localStorage.setItem('cart', JSON.stringify(chkArr))
                this.setState({
                    cartItem: chkArr
                })
            }
        }
    }, [])

    return (
        <>
            <div className="container">
                <div className={'row'}>
                    {packagearray.map((item, index) => {
                        return (
                            <>
                                <div className={'col-lg-4'} key={index}>
                                    <div className={'pricing-table'}>
                                        {/*<CardBody>*/}
                                            <Row>
                                                <Col>
                                                    {/*<img src={icon} height={50} alt='pricing'/>*/}
                                                    <h3 className={'mb-0'}><b>{item.sPackageName}</b></h3>
                                                    <span className="rbt-badge mb-3 p-1">{item.nPkgValidity} day
                                                        validity</span>
                                                    <small
                                                        className='pricing-duration text-body font-medium-1 font-weight-bold ml-25'> </small>
                                                </Col>
                                                <Col lg={7}>
                                                    {item.discount !== "" ? <>
                                                        <div
                                                            className='plan-price'>

                                                            {localStorage.getItem('skin') === '"light"' ? <>
                                                                <h3 className='pricing-basic-value font-weight-bolder text-primary m-0'
                                                                    style={{textAlign: 'end'}}>
                                                                    <del>₹ {item.dAmount} INR</del>
                                                                </h3>

                                                                {item.discountType === 'amount' ? <>
                                                                    <h5 className='pricing-basic-value m-0'
                                                                        style={{textAlign: 'end', color: '#db7093'}}>
                                                                        ₹ {item.dAmount - item.discount} INR
                                                                        {/*item.dAmount -*/}
                                                                    </h5>
                                                                    <p className={'text-success m-0'}
                                                                       style={{textAlign: 'end'}}>
                                                                        <b>₹ {item.discount} DISCOUNT
                                                                            APPLIED</b>
                                                                    </p>
                                                                </> : <>
                                                                    <h5 className='pricing-basic-value m-0'
                                                                        style={{textAlign: 'end', color: '#db7093'}}>
                                                                        ₹ {(item.dAmount - item.discount)} INR
                                                                        {/*item.dAmount -*/}
                                                                    </h5>
                                                                    <p className={'text-success m-0'}
                                                                       style={{textAlign: 'end'}}>
                                                                        <b> {item.discount}%
                                                                            DISCOUNT
                                                                            APPLIED</b>
                                                                    </p>
                                                                </>}
                                                                <span className='pricing-duration text-body ml-25 float-right' style={{fontSize: '12px'}}>
                                                                    Valid till {item.discountEndDate}
                                                                </span>

                                                            </> : <>
                                                                <h3 className='pricing-basic-value font-weight-bolder text-end' style={{ color: '#db7093' }}>
                                                                    ₹ {item.dAmount} INR
                                                                </h3>
                                                            </>}
                                                        </div>
                                                    </> : <>
                                                        <div
                                                            className='plan-price mt-2 float-right'>
                                                            <h3 className='font-medium-1 font-weight-bold text-primary'>
                                                                {localStorage.getItem('skin') === '"light"' ? <>
                                                                    <h3 className='pricing-basic-value text-end font-weight-bolder' style={{ color: '#db7093' }}>
                                                                        ₹ {item.dAmount} INR
                                                                    </h3>
                                                                </> : <>
                                                                    <h3
                                                                        className='pricing-basic-value font-weight-bolder text-end' style={{ color: '#db7093' }}>
                                                                        ₹ {item.dAmount} INR
                                                                    </h3>
                                                                </>}
                                                            </h3>
                                                        </div>
                                                    </>}

                                                </Col>
                                            </Row>
                                            {item.sDescription ? <>
                                                <hr/>
                                                <h6>
                                                    <b>{item.sDescription} </b>
                                                </h6>
                                            </> : <></>}
                                            {item.sSubDescription ? <>
                                                <hr/>
                                                <h6 >
                                                    {item.sSubDescription}
                                                </h6>
                                            </> : <></>}

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className='basic-pricing mb-0'>
                                                        <hr/>
                                                        <div className=''>
                                                            <ul className='text-left list-style-icons font-weight-bold'
                                                                style={{ listStyle: 'none' }}
                                                                key={`${index}_ru`}>
                                                                {/*{console.log(JSON.parse(item.packageFeatureData))}*/}
                                                                {(item.sPackageSubfeature) ? JSON.parse(item.sPackageSubfeature).map((pitem, pindex) => (
                                                                    <li key={`${index}_${pindex}_rl`} className="mb-1">
                                                                        {localStorage.getItem('skin') === '"light"' ? <>
                                                                            <Icon.Circle size={12} className='me-3'/>
                                                                            {pitem.sFeature}

                                                                            {(item.packageFeatureData) ? ((((JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).PackageFeatureCount) !== '0') && ((JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).PackageFeatureCount) !== null)) ? <span
                                                                                className='rbt-badge badge badge-light-primary text-primary ms-1'>{((pitem.nPFTId === "11") ? (JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).VideoTotalCount) : (pitem.nPFTId === "12") ? (JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).PDFTotalCount) : (pitem.nPFTId === "14") ? (JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).ImageTotalCount) : (pitem.nPFTId === "15") ? (JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).ActivityTotalCount) : '')} </span> : '') : ''}
                                                                        </> : <><Icon.Circle size={12} className='me-3'/>
                                                                            {pitem.sFeature}
                                                                            {(item.packageFeatureData) ? ((((JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).PackageFeatureCount) !== '0') && ((JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).PackageFeatureCount) !== null)) ? <span className='badge bg-light text-dark'>{((pitem.nPFTId === "1") ? (JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).VideoTotalCount) : (pitem.nPFTId === "3") ? (JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).PDFTotalCount) : (pitem.nPFTId === "4") ? (JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).ImageTotalCount) : (pitem.nPFTId === "5") ? (JSON.parse(item.packageFeatureData).find(obj => obj.PackageFeatureID === (pitem.nPFTId)).ActivityTotalCount) : '')}</span> : '') : ''}
                                                                        </>}


                                                                        {(pitem.sSubFeature) ? (
                                                                            <ul className='list-style-icons'
                                                                                style={{ listStyle: 'none' }}
                                                                                key={`${index}_${pindex}_riu`}>

                                                                                {pitem.sSubFeature.map(function (sf, index) {
                                                                                    return <li
                                                                                        className='ml-1 m-t-5 font-weight-light'
                                                                                        key={`${index}_${pindex}_riuf`}>
                                                                                        <span className='me-3'>-</span>
                                                                                        {sf}
                                                                                    </li>
                                                                                })}
                                                                            </ul>) : ''}

                                                                    </li>)) : 'No Features!'}

                                                            </ul>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        {/*{console.log(item)}*/}
                                        {(isHideButton) ? ((item.pkgCheckTbl.length > 2) ? ((JSON.parse(item.pkgCheckTbl).map((pitem, pindex) => ((pitem.nPkgId === item.nPkgId) ? <button type="button" key={pindex + 1} className="w-100 btn-lg btn btn-outline-success btn-block" disabled={true}>Purchased</button> : (((cartItem).find(obj => (obj.cid === item.nCId && obj.pkgId === item.nPkgId)) !== undefined) ? (<Link href='/cart'><button className='btn btn-primary btn-block w-100' style={{ padding: '10px', fontSize: '15px' }}>
                                            <span className='align-middle'>Go to cart</span>
                                        </button></Link>) : (<button type="button" className="w-100 btn-lg btn btn-outline-success btn-block" style={{ padding: '10px', fontSize: '15px' }} onClick={() => BuyPackage(item.nPkgId, item.sPackageName, item.dAmount)}>Add to cart</button>)))))) : (((cartItem).find(obj => (obj.cid === item.nCId && obj.pkgId === item.nPkgId)) !== undefined) ? <Link href='/cart'><button style={{ padding: '10px', fontSize: '15px' }} className='btn w-100 btn-lg btn-primary btn-block p-1'>
                                            <span className='align-middle'>Go to cart</span>
                                        </button></Link> : <button style={{ padding: '10px', fontSize: '15px' }} type="button" className="w-100 btn-lg btn btn-outline-success btn-block" onClick={() => BuyPackage(item.nPkgId, item.sPackageName, item.dAmount)}>Add to cart</button>)) : ''}

                                        {((isCartItem) && (pid === item.nPkgId)) ? (<Link href='/cart'><button className='btn-lg w-100 btn btn-primary btn-block p-1'>
                                            <span className='align-middle'>Go to cart</span>
                                        </button></Link>) : ((isCartItem) ? ((item.pkgCheckTbl.length > 2) ? ((JSON.parse(item.pkgCheckTbl).map((pitem, pindex) => ((pitem.nPkgId === item.nPkgId) ? <button type="button" key={pindex + 1} className=" btn-lgw-100 btn btn-outline-success btn-block" disabled={true}>Purchased</button> : (((cartItem).find(obj => (obj.cid === item.nCId && obj.pkgId === item.nPkgId)) !== undefined) ? (<Link to='/cart'><button className='btn-lg w-100 btn btn-primary btn-block p-1'>
                                            <span className='align-middle'>Go to cart</span>
                                        </button></Link>) : (<button type="button" className="btn btn-lg w-100 btn-outline-success btn-block" onClick={() => BuyPackage(item.nPkgId, item.sPackageName)}>Add to cart</button>)))))) : (((cartItem).find(obj => (obj.cid === item.nCId && obj.pkgId === item.nPkgId)) !== undefined) ? <Link href='/cart'><button className='w-100 btn btn-primary btn-block p-1'>
                                            <span className='align-middle'>Go to cart</span>
                                        </button></Link> : <button type="button" className="w-100 btn-lg btn btn-outline-success btn-block" onClick={() => BuyPackage(item.nPkgId, item.sPackageName)}>Add to cart</button>)) : '')}
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>

            </div>
        </>
    );
};

export default Package;
