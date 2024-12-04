import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import parse from 'html-react-parser'
import * as Icon from 'react-feather'
// import Tooltip from "@material-ui/core/Tooltip"
import { SuccessAlert, ErrorDefaultAlert } from "@/components/Services/SweetAlert";
import {
    Card, Alert, CardBody, CardHeader, Row, Col, Progress, Button,
    TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap'
import Link from "next/link";
import {API_URL, API_KEY} from "../../constants/constant";
import { DecryptData, EncryptData } from "@/components/Services/encrypt-decrypt";

const SeperateActivity = () => {
    const REACT_APP = API_URL

    const [activityListCard, setactivityListCard] = useState([])

    useEffect(() => {
        const url = window.location.href
        const parts = url.split("/");
        const cid = parts[parts.length - 2];
        // const mid = parts[parts.length - 4];
        // const lid = parts[parts.length - 3];
        // const pnview = parts[parts.length - 2];
        const aqid = parts[parts.length - 1];

        if (localStorage.getItem('userData')) {
            const udata = JSON.parse(localStorage.getItem('userData'))
            // console.log(cid)

            Axios.get(`${API_URL}/api/activityQue/GetActivityQueListSeparateViewActivity/${aqid}/${udata['regid']}/${cid}`, {
                headers: {
                    ApiKey: `${API_KEY}`
                }
            })
                .then(res => {
                    if (res.data) {
                        console.log('GetActivityQueListSeparateViewActivity', res.data)
                        setactivityListCard(res.data)
                        // this.setState({
                        //     actquelist: res.data
                        // })
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
        }

    }, []);

    return (
        <>
           <h5>Seperate Activity</h5>

            <div className={'row'}>
                {activityListCard.length !== 0 ? <>
                    {activityListCard.map((item, index) => {
                        return (
                            <>
                                <div className={'col-lg-4'} key={index}>
                                    <Card className='border mb-1'>

                                    <CardHeader className={`${(item.sep_ans_fill === '0') ? 'bg-secondary' : 'bg-success'} p-0`}>

                                        {/* <Progress value={30} className='progress-bar-success h-45 position-absolute w-100 h--60' /> */}

                                        <div className='row w-100' style={{ display: "contents" }}>
                                            <div className='col-9'>
                                                <h5 className="mb-0 p-1 text-white animate shake position-relative w-100 font-weight-bolder">{index + 1} : {item.sActivityName}
                                                </h5>
                                            </div>

                                        </div>
                                    </CardHeader>
                                    <CardBody className='p-2 inner-activity-name'>
                                        <div className='font-weight-bolder'>{item.sQueTitle}</div>
                                    </CardBody>
                                </Card>
                                </div>
                            </>
                        )
                    })}
                </> : <></>}
            </div>

        </>
    );
};

export default SeperateActivity;
