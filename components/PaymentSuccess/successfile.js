import Link from "next/link";

import {useEffect, useState} from "react";
import {DecryptData} from "@/components/Services/encrypt-decrypt";
import CartItems from "@/components/Cart/CartItems";
import moment from "moment";

const SuccessFile = () => {
    const [transactionId, settransactionId] = useState('')
    const [OrderId, setorderId] = useState('')
    const [totalamount, settotalamount] = useState('')
    const [getDate, setDate] = useState('')
    useEffect(() => {

        const url = window.location.href
        const parts = url.split("/");
        const txnId = DecryptData(parts[parts.length - 2]);
        const orderId = DecryptData(parts[parts.length - 3]);
        const amount = DecryptData(parts[parts.length - 1]);
        settransactionId(txnId)
        setorderId(orderId)
        settotalamount(amount)
        // console.log(txnId)

        const date = moment();
        const currentDate = date.format('D/MM/YYYY');
        console.log(currentDate)
        setDate(currentDate)
    },[])

    return (
        <>
            <div className={'container text-center'}>
                <h1 className={'text-success'}>Success</h1>
                <p className={''}>Your Transaction was successfull</p>
                <div className={'row'}>
                    <div className={'col-lg-12'}>
                        <div className="cart-table table-responsive mb--60">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className="pro-thumbnail">Transaction Id:</th>
                                    <th className="pro-title">Order Id</th>
                                    <th className="pro-price">Amount</th>
                                    {/*<th className="pro-quantity">Quantity</th>*/}
                                    <th className="pro-subtotal">Date</th>
                                    {/*<th className="pro-remove">Remove</th>*/}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <p>{transactionId}</p>
                                    </td>
                                    <td>
                                        <p>{OrderId}</p>
                                    </td>
                                    <td>{totalamount} ₹</td>
                                    <td>{getDate}</td>

                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <button className={'btn-sm rbt-btn btn-gradient'}>
                            <Link className={'text-white'} href={'/student/student-dashboard'}>
                                Go to Learning
                            </Link>
                        </button>

                    </div>
                </div>
            </div>

        </>
    );
};

export default SuccessFile
